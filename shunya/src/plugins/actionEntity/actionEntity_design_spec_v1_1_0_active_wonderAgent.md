# ActionEntity Design Specification

**Document**: `actionEntity_design_spec_v1_1_0_active_wonderAgent.md`
**Version**: 1.1.0
**Status**: Active
**Author**: wonderAgent
**Date**: 2026-01-01

## 1. Introduction

This document provides a comprehensive design specification for the `ActionEntity` component as implemented in `actionEntity_v4.js`. It details the component's purpose, architecture, functional and non-functional requirements, and integration points. `ActionEntity` is a flexible entity management system designed for data persistence, validation, and retrieval across various storage contexts, including local file-based storage (Node.js), browser-based storage (IndexedDB, LocalStorage), and cloud-based spreadsheets (Google AppScript). It offers a standardized CRUD (Create, Read, Update, Delete) interface for various data entities.

## 2. Purpose and Overview

`ActionEntity_v4.js` encapsulates a self-contained entity management system designed for data persistence, validation, and retrieval across diverse storage backends. It provides a foundational layer for managing various data entities (like users, sessions, alarms) through a standardized CRUD (Create, Read, Update, Delete) interface. The design emphasizes simplicity, configurability through in-memory entity definitions, and adaptable storage interaction, making it suitable for environments ranging from local Node.js applications to browser-based SPAs and serverless Google AppScript functions. It integrates a basic in-memory caching mechanism to enhance read performance and ensures data integrity through schema-based validation.

## 3. Architecture and Main Components

The `ActionEntity_v4.js` architecture is designed around a modular pattern, centralizing entity management while delegating specific functionalities to dedicated helper classes and data structures. It now supports multiple pluggable storage drivers.

### 3.1. High-Level Conceptual Diagram

```
+---------------------+
|                     |
|    External Caller  |
| (e.g., ActionApp,   |
|  ActionProcessor)   |
|                     |
+----------+----------+
           | Request: {entity, action, data, id}
           v
+---------------------------------------------------------------------------------------------+
|                                                                                             |
|                               ActionEntity (Main Orchestrator)                              |
|                                                                                             |
|  +---------------------------+                                                              |
|  |       Entity Configs      |                                                              |
|  | (ENTITY_CONFIGS, dbSchema)|                                                              |
|  +---------------------------+                                                              |
|           ^          |                                                                      |
|           |          |  Data flow: CRUD operations, validation, caching                     |
|           |          |                                                                      |
|  +---------------------------+      +---------------------------+       +---------------------------+
|  |      SchemaValidator      |<---->|    Pluggable Storage      |<----->|     Storage Backends      |
|  |  (Data Integrity)         |      |     Adapter (Driver)      |       | (Filesystem, IndexedDB,   |
|  +---------------------------+      |  (ActionFs, IndexedDB,    |       |  LocalStorage, Spreadsheet)|
|           ^                          |   LocalStorage, Spreadsheet) |       +---------------------------+
|           |                          +---------------------------+
|           |                                                                      ^
|           |                                                                      |
|  +---------------------------+                                        +---------------------------+
|  |    In-memory Cache      |                                        |  DATASETS                 |
|  | (Map, with simple TTL)   |------------------------------------->|  (Validation Arrays)      |
|  +---------------------------+                                        +---------------------------+
|                                                                                             |
+---------------------------------------------------------------------------------------------+
           | Response: {success, data, meta, error}
           v
+---------------------+
|                     |
|    External Caller  |
| (e.g., ActionApp,   |
|  ActionProcessor)   |
|                     |
+---------------------+
```

### 3.2. Description of Main Classes and Their Responsibilities

1.  **`ActionEntity` (Main Orchestrator)**:
    *   **Responsibility**: The central class for managing entities across various storage backends. It initializes the component ecosystem, processes incoming requests (CRUD operations), and coordinates between the `SchemaValidator`, dynamically selected storage driver, and its internal caching mechanism. It manages entity configurations and orchestrates the entire data lifecycle from request to response.
    *   **Key Attributes**: `config`, `actions`, `entities`, `storage` (dynamically selected storage driver instance), `entityConfigs`, `cache` (in-memory Map), `ready` flag.
    *   **Key Methods**: `initialize()`: Now also initializes the specific storage driver. `processRequest(request)`, `executeCreate()`, `executeRead()`, `executeUpdate()`, `executeDelete()`, `executeList()`, `generateId()`, `applyFilters()`, `hashPassword()`.

2.  **Pluggable Storage Adapters (e.g., `ActionFs`, `IndexedDBStorage`, `LocalStorageAdapter`, `ActionSpreadsheetAdapter`)**:
    *   **Responsibility**: Each adapter provides a promise-based interface for interacting with a specific storage technology. They abstract away the complexities of storage-specific APIs, data serialization/deserialization, and connection management. `ActionEntity` dynamically instantiates the correct adapter based on the `storage.driver` configuration.
    *   **Common Methods (Conceptual)**: `initialize()`, `create(data)`, `read(query)`, `update(id, data)`, `delete(id)`, `list(filters)`.
    *   **Specific Implementations**:
        *   **`ActionFs` (File System Adapter)**: (Node.js) Provides methods for file system operations (read/write JSON, JSONL, CSV).
        *   **`IndexedDBStorage`**: (Browser) Adapts to `IndexedDB` API for structured client-side storage.
        *   **`LocalStorageAdapter`**: (Browser) Adapts to `LocalStorage` API for simple key-value client-side storage.
        *   **`ActionSpreadsheetAdapter`**: (AppScript) Interacts with Google Sheets API for cloud-based tabular data storage.

3.  **`SchemaValidator` (Data Integrity Enforcer)**:
    *   **Responsibility**: A static utility for enforcing data integrity by validating incoming data against predefined entity schemas (`dbSchema`). It checks for required fields, data types, format patterns, and other constraints.
    *   **Key Methods**: `validate(data, schema, isUpdate)`, `checkType()`, `isValidEmail()`.

4.  **`DATASETS` (Constants and Reference Data)**:
    *   **Responsibility**: Defines arrays of allowed values for actions (`create`, `read`, etc.), recognized entity names, supported field types, and status codes. These datasets are used for basic input validation and internal consistency checks.

5.  **`ENTITY_CONFIGS` (In-memory Entity Definitions)**:
    *   **Responsibility**: An object literal containing the blueprint for each managed entity. Each entry defines the entity's `id`, `name`, `type`, `dbSchema` (with field properties and validation rules), `storage` details (driver, path, file, format, or IndexedDB/Spreadsheet specific options), and optional `cacheHints`. This is the core metadata that `ActionEntity` uses to operate on data.

## 4. Data Models / Entity Configurations

The `ActionEntity` component operates on data entities whose structures and operational parameters are defined through in-memory configuration objects. These configurations, primarily found in the `ENTITY_CONFIGS` constant, serve as blueprints for how each entity is validated, stored, and cached.

### 4.1. `ENTITY_CONFIGS` Structure

`ENTITY_CONFIGS` is an object where each key represents an `entityName` (e.g., `'user_register'`, `'user_session'`, `'alarm'`). The value associated with each `entityName` is an object that defines the entity's metadata and operational rules.

```javascript
const ENTITY_CONFIGS = {
  // Example for 'user_register' entity
  user_register: {
    id: 'user_register',        // Unique identifier for the entity configuration
    name: 'User Register',      // Human-readable name
    type: 'entity',             // Type of entity (e.g., 'entity', 'collection', 'static')

    dbSchema: { /* ... schema definition ... */ },
    storage: { /* ... storage configuration ... */ },
    cacheHints: { /* ... caching hints ... */ }
  },
  // Other entity configurations...
};
```

### 4.2. `dbSchema` Definition

The `dbSchema` object within an entity configuration specifies the structure of the data records for that entity, including properties, their types, and validation rules. It follows a simplified JSON Schema-like convention.

```javascript
dbSchema: {
  properties: {
    id: { type: 'string' },
    username: {
      type: 'string',
      validate: { required: true, minLength: 3 }
    },
    email: {
      type: 'string',
      validate: { required: true, format: 'email' }
    },
    password: {
      type: 'string',
      validate: { required: true, minLength: 6 }
    },
    userId: { type: 'string', validate: { required: true } },
    role: { type: 'string', default: 'user' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  }
}
```

*   **`properties`**: Object mapping field names to their definitions.
*   **`type`**: Field data type (`'string'`, `'number'`, `'boolean'`, `'date'`, `'array'`, `'object'`).
*   **`validate`**: Optional object with validation rules (`required`, `minLength`, `maxLength`, `format`, `enum`).
*   **`default`**: Default value or function for the field.

### 4.3. `storage` Configuration

The `storage` object within an entity configuration specifies how the entity's data records are persisted. This configuration is now extended to support multiple drivers.

```javascript
storage: {
  driver: 'fs',                     // Storage driver: 'fs', 'indexeddb', 'localstorage', 'spreadsheet'
  // Common options
  keyField: 'id',                   // The field used as a unique identifier for records

  // Driver-specific options:
  // For 'fs' driver (Node.js):
  path: './data/user_register',     // Base directory path for entity files
  file: 'users.json',               // The specific file name for this entity's data
  format: 'json',                   // The file format: 'json', 'jsonl', or 'csv'

  // For 'indexeddb' driver (Browser):
  dbName: 'myAppDB',                // The IndexedDB database name
  storeName: 'user_registers',      // The object store name within the database
  version: 1,                       // The database version (for upgrades)
  indexes: [{ name: 'email', keyPath: 'email', unique: true }], // IndexedDB indexes

  // For 'localstorage' driver (Browser):
  prefix: 'app_user_reg_',          // Prefix for localStorage keys

  // For 'spreadsheet' driver (Google AppScript):
  sheetId: '1Abc...xyz',            // The Google Spreadsheet ID
  tabName: 'UserRegisters',         // The specific sheet (tab) name within the spreadsheet
  headerRow: 1                      // The row number containing headers
}
```

*   **`driver`**: Now supports `'fs'` (File System, Node.js), `'indexeddb'` (Browser), `'localstorage'` (Browser), and `'spreadsheet'` (Google AppScript).
*   **`keyField`**: (Common) The name of the field that uniquely identifies each record.
*   **Driver-Specific Options**:
    *   **`fs`**: `path`, `file`, `format` (as previously defined).
    *   **`indexeddb`**: `dbName`, `storeName`, `version`, `indexes`. These are passed to the `IndexedDBStorage` utility.
    *   **`localstorage`**: `prefix`. Used by the `LocalStorageAdapter` utility.
    *   **`spreadsheet`**: `sheetId`, `tabName`, `headerRow`. Used by the `ActionSpreadsheetAdapter` utility.

### 4.4. `cacheHints` Configuration

The `cacheHints` object provides suggestions to the internal caching mechanism on how to manage this entity's data in the cache.

```javascript
cacheHints: {
  ttl: 300,             // Time-To-Live in seconds
  keys: ['user_register_list'] // Optional: specific cache keys
}
```

*   **`ttl`**: (`number`) The duration (in seconds) that an entity record or list should remain in the cache.
*   **`keys`**: (`Array<string>`) A list of predefined cache keys relevant for this entity.

## 5. Functional Specifications

The `ActionEntity` component provides a set of functionalities for managing entities, ensuring data integrity, and optimizing data access across various storage backends.

### 5.1. `initialize()` Process

*   **Purpose**: To prepare the `ActionEntity` instance for operation by setting up file system structures, loading entity configurations, and initializing the selected storage driver.
*   **Flow**:
    1.  Creates a dedicated `configs` subdirectory within the `basePath` (e.g., `./data/configs`) if it doesn't already exist (if `fs` driver is used).
    2.  Iterates through each `entityName` defined in `this.entities`.
    3.  For each entity:
        *   Retrieves its configuration from `ENTITY_CONFIGS`.
        *   **Persists config**: (If `fs` driver implied) Persists this configuration to a file (e.g., `entity_user_register_config.json`).
        *   Stores the configuration in `this.entityConfigs`.
        *   **Initializes Storage Driver**: Instantiates the appropriate storage driver (`ActionFs`, `IndexedDBStorage`, etc.) based on `config.storage.driver` and passes relevant options. Calls `await driver.initialize()` if the driver requires it (e.g., IndexedDB for schema/store creation).
        *   (If `fs` driver) Ensures initial empty data files exist for each entity.
    4.  Sets `this.ready = true`.

### 5.2. `processRequest(request)` Flow

*   **Purpose**: The main public interface for external modules to interact with `ActionEntity`, handling all CRUD requests across supported storage backends.
*   **Input**: A `request` object with properties:
    *   `entity`: (`string`) The name of the entity to operate on.
    *   `action`: (`string`) The desired CRUD action (`'create'`, `'read'`, `'update'`, `'delete'`, `'list'`).
    *   `data`: (`object`, optional) The payload for `create` and `update` actions, or filters for `list`.
    *   `id`: (`string`, optional) The ID of the record for `read`, `update`, `delete` actions.
*   **Flow**:
    1.  Checks `this.ready` flag; throws an error if not initialized.
    2.  Validates `request.entity` and `request.action`.
    3.  Retrieves `entityConfig` and the dynamically initialized storage driver.
    4.  **Validation**: Calls `SchemaValidator.validate()` for `create`/`update`.
    5.  Delegates the request to the appropriate `execute` method, which in turn calls the corresponding method on the selected storage driver.
    6.  Captures errors and formats into the response.
    7.  Returns standardized response: `{ success: boolean, data: any, meta: object, error: object }`.

### 5.3. CRUD Operations

Each `execute` method now delegates to the dynamically chosen storage driver:

#### 5.3.1. `executeCreate(entity, data, config)`
*   **Action**: Creates a new record for the specified `entity`.
*   **Flow**: Generates `id`, adds timestamps, applies simplified password hashing, then calls `this.storageDriver.create(record)`. Invalidates `entity:list` cache.

#### 5.3.2. `executeRead(entity, id, config)`
*   **Action**: Reads a single record by its `id`.
*   **Flow**: Checks in-memory cache. If not found, calls `this.storageDriver.read(id)` or `this.storageDriver.read({ [config.storage.keyField]: id })`. Caches the result.

#### 5.3.3. `executeUpdate(entity, id, data, config)`
*   **Action**: Updates an existing record identified by `id`.
*   **Flow**: Reads existing record (via `this.storageDriver`), merges `data`, updates `updatedAt`, then calls `this.storageDriver.update(id, updatedRecord)`. Invalidates relevant caches.

#### 5.3.4. `executeDelete(entity, id, config)`
*   **Action**: Deletes a single record by its `id`.
*   **Flow**: Verifies existence (via `this.storageDriver`), then calls `this.storageDriver.delete(id)`. Invalidates relevant caches.

#### 5.3.5. `executeList(entity, filters = {}, config)`
*   **Action**: Retrieves a list of records for the specified `entity`, optionally filtered.
*   **Flow**: Checks in-memory cache for full list. If not found, calls `this.storageDriver.list(filters)` or `this.storageDriver.read(filters)`. Caches the full list, then applies `filters` in-memory if needed.

### 5.4. Validation Logic (`SchemaValidator`)

*   **Purpose**: To enforce data types, presence, and formats as defined in `dbSchema`.
*   **Flow (`SchemaValidator.validate`)**: Unchanged, continues to provide error messages based on schema violations.

### 5.5. Storage Driver Operations (`ActionFs`, `IndexedDBStorage`, `LocalStorageAdapter`, `ActionSpreadsheetAdapter`)

*   **Purpose**: Each driver provides standardized CRUD methods for its specific backend.
*   **`ActionFs` (Node.js)**: Serializes/deserializes data to/from JSON, JSONL, CSV files.
*   **`IndexedDBStorage` (Browser)**: Interacts with IndexedDB object stores for structured data.
*   **`LocalStorageAdapter` (Browser)**: Stores/retrieves key-value pairs in LocalStorage.
*   **`ActionSpreadsheetAdapter` (Google AppScript)**: Reads/writes data to Google Sheets, mapping objects to rows/columns.

### 5.6. Caching Mechanism

*   **Purpose**: To improve read performance using an in-memory `Map`.
*   **Flow**: Unchanged, `executeRead`/`executeList` check cache first. `create`/`update`/`delete` invalidate relevant cache entries. TTL expiry is implemented using `setTimeout`.

### 5.7. ID Generation

*   **Purpose**: To provide unique identifiers for new records.
*   **Flow**: Unchanged, `generateId()` concatenates current timestamp with a random string.

## 6. Non-Functional Requirements

### 6.1. Performance
*   **Read Operations**: Enhanced by in-memory caching.
*   **Write Operations**: Performance depends on the chosen storage driver (file I/O, IndexedDB transaction speed, network latency for Google Sheets).
*   **Browser Storage**: `IndexedDB` offers better performance and larger quotas than `LocalStorage` for structured data.
*   **Google Sheets**: Performance is subject to Google API rate limits, network latency, and spreadsheet size. Operations typically involve reading/writing entire rows/sheets, which can be slower for large datasets.

### 6.2. Error Handling
*   **Validation Errors**: `SchemaValidator` provides specific error messages.
*   **Storage Driver Errors**: Each driver handles its specific errors (file not found, IndexedDB transaction errors, API errors for Spreadsheets) and propagates them to `ActionEntity` for standardized reporting.
*   **Execution Errors**: `processRequest` standardizes errors into a `{ success: false, error: { code, message } }` format.
*   **Logging**: Uses `console.log` and `console.error` for debugging.

### 6.3. Security
*   **Basic Password Hashing**: Simplified base64 hashing (for demo; not production-grade).
*   **Input Validation**: `SchemaValidator` mitigates some data-related vulnerabilities.
*   **No Explicit RBAC/ACL**: Authorization must be handled by an external layer.
*   **Browser Storage**: Data in `LocalStorage` and `IndexedDB` is client-side and generally accessible to other scripts on the same origin. Not suitable for highly sensitive data without additional encryption.
*   **Google Sheets**: Requires proper OAuth2 authentication and authorization scopes configured in the AppScript project. Data is stored in Google's infrastructure.

### 6.4. Scalability
*   **Horizontal Scalability**: The current design is not suitable for horizontal scaling with `fs`, `indexeddb`, or `localstorage` drivers due to their local nature and potential for data inconsistency with concurrent writes.
*   **Google Sheets**: Scalability is limited by Google Sheets row/column limits, API rate limits, and concurrent access performance. Best suited for smaller datasets or specific use cases like configuration storage or audit logs.
*   **Vertical Scalability**: Performance can be scaled vertically with hardware upgrades (for Node.js) or device performance (for browser).

### 6.5. Maintainability
*   **Modular Design**: Clear separation of responsibilities among `ActionEntity`, `SchemaValidator`, and pluggable storage drivers.
*   **Configurability**: Entity behaviors are driven by `ENTITY_CONFIGS`, promoting declarative management.
*   **Readability**: Clear naming and comments.

## 7. Integration Points

### 7.1. External Framework / Application
*   **Core Integration**: Instantiated and managed by a higher-level application (e.g., `ActionFramework`).
*   **Constructor**: Configured via options `{ dataset, storage, cache }`.
*   **Initialization**: Requires `await actionEntity.initialize()` call.
*   **Request Processing**: External application passes `{ entity, action, data, id }` requests to `actionEntity.processRequest()`.

### 7.2. Node.js Core Modules
*   **`fs.promises`**: For asynchronous file system operations when `fs` driver is used.
*   **`path`**: For resolving file paths and directory manipulation when `fs` driver is used.

### 7.3. Browser-Specific Utilities
*   **`actionIndexdb` (`IndexedDBStorage`)**: Utility providing an adapter for `IndexedDB` when `indexeddb` driver is configured.
*   **`actionLocalStorage` (`LocalStorageAdapter`)**: Utility providing an adapter for `LocalStorage` when `localstorage` driver is configured.

### 7.4. Google AppScript Environment
*   **`ActionSpreadsheet` (`ActionSpreadsheetAdapter`)**: Utility providing an adapter for Google Sheets API when `spreadsheet` driver is configured and running within the Google AppScript environment.

### 7.5. Configuration Data (`ENTITY_CONFIGS` and `DATASETS`)
*   **Internal but Externalizable**: Currently in-memory, but designed to potentially load from external files for greater configurability.

### 7.6. (Future) Error Handling Integration
*   Structured error responses allow integration with higher-level error handling systems (e.g., `ActionError`).

### 7.7. (Future) Hooks Integration
*   Simplified internal hooks could be replaced by a general-purpose hook manager.

## 8. Usage Guide / Examples

### 8.1. Initialization

```javascript
// Example for Node.js (File System driver)
const { ActionEntity } = require('./actionEntity_v4.js');
// OR for Browser/AppScript (assuming ActionEntity is globally available or imported via module)
// import { ActionEntity } from './actionEntity_v4.js';

async function setupActionEntity(storageConfig) {
  const actionEntity = new ActionEntity({
    dataset: {
      action: ['create', 'read', 'update', 'delete', 'list'],
      entity: ['user_register', 'user_session', 'alarm']
    },
    storage: storageConfig, // Dynamic storage configuration
    cache: true
  });
  await actionEntity.initialize();
  console.log("ActionEntity initialized and ready.");
  return actionEntity;
}

// Example setup with different drivers:
/*
// Node.js (File System)
const fsStorageConfig = {
  driver: 'fs',
  basePath: './data'
};
// const myActionEntityFs = await setupActionEntity(fsStorageConfig);

// Browser (IndexedDB) - requires IndexedDBStorage utility
const indexedDBStorageConfig = {
  driver: 'indexeddb',
  dbName: 'myAppDB',
  storeName: 'user_registers',
  version: 1,
  indexes: [{ name: 'email', keyPath: 'email', unique: true }]
};
// const myActionEntityIdb = await setupActionEntity(indexedDBStorageConfig);

// Browser (LocalStorage) - requires LocalStorageAdapter utility
const localStorageConfig = {
  driver: 'localstorage',
  prefix: 'app_user_reg_'
};
// const myActionEntityLs = await setupActionEntity(localStorageConfig);

// Google AppScript (Spreadsheet) - requires ActionSpreadsheetAdapter utility
const spreadsheetConfig = {
  driver: 'spreadsheet',
  sheetId: '1Abc...xyz', // Replace with your actual Spreadsheet ID
  tabName: 'UserRegisters',
  headerRow: 1
};
// const myActionEntitySs = await setupActionEntity(spreadsheetConfig);
*/
```

### 8.2. Performing CRUD Operations

Once initialized, `ActionEntity` processes requests via its `processRequest` method, regardless of the underlying storage driver.

#### 8.2.1. Create a Record (`create`)
```javascript
async function createRecord(actionEntity, entityName, data) {
  const createRequest = { entity: entityName, action: 'create', data: data };
  const createResponse = await actionEntity.processRequest(createRequest);
  console.log("Create Response:", JSON.stringify(createResponse, null, 2));
  if (!createResponse.success) { console.error("Failed to create record:", createResponse.error); }
  return createResponse;
}

// Example:
// await createRecord(myActionEntityFs, 'user_register', {
//   username: 'jane_doe', email: 'jane@example.com', password: 'securePassword123', userId: 'user_002', role: 'admin'
// });
```

#### 8.2.2. Read a Single Record (`read`)
```javascript
async function readRecord(actionEntity, entityName, recordId) {
  const readRequest = { entity: entityName, action: 'read', id: recordId };
  const readResponse = await actionEntity.processRequest(readRequest);
  console.log("Read Response:", JSON.stringify(readResponse, null, 2));
  if (!readResponse.success) { console.error("Failed to read record:", readResponse.error); }
  return readResponse;
}
// Example:
// await readRecord(myActionEntityFs, 'user_register', 'id_...');
```

#### 8.2.3. List All Records (`list`)
```javascript
async function listRecords(actionEntity, entityName, filters = {}) {
  const listRequest = { entity: entityName, action: 'list', data: filters };
  const listResponse = await actionEntity.processRequest(listRequest);
  console.log("List Response:", JSON.stringify(listResponse, null, 2));
  if (!listResponse.success) { console.error("Failed to list records:", listResponse.error); }
  else { console.log(`Found ${listResponse.data.length} records.`); }
  return listResponse;
}
// Example:
// await listRecords(myActionEntityFs, 'user_register', { role: 'admin' });
```

#### 8.2.4. Update a Record (`update`)
```javascript
async function updateRecord(actionEntity, entityName, recordId, updates) {
  const updateRequest = { entity: entityName, action: 'update', id: recordId, data: updates };
  const updateResponse = await actionEntity.processRequest(updateRequest);
  console.log("Update Response:", JSON.stringify(updateResponse, null, 2));
  if (!updateResponse.success) { console.error("Failed to update record:", updateResponse.error); }
  return updateResponse;
}
// Example:
// await updateRecord(myActionEntityFs, 'user_register', 'id_...', { email: 'jane.new@example.com' });
```

#### 8.2.5. Delete a Record (`delete`)
```javascript
async function deleteRecord(actionEntity, entityName, recordId) {
  const deleteRequest = { entity: entityName, action: 'delete', id: recordId };
  const deleteResponse = await actionEntity.processRequest(deleteRequest);
  console.log("Delete Response:", JSON.stringify(deleteResponse, null, 2));
  if (!deleteResponse.success) { console.error("Failed to delete record:", deleteResponse.error); }
  return deleteResponse;
}
// Example:
// await deleteRecord(myActionEntityFs, 'user_register', 'id_...');
```

### 8.3. Handling Responses

All responses from `processRequest` follow a consistent structure:

```json
{
  "success": true, // or false
  "data": { /* ... result of the operation ... */ },
  "meta": {
    "entity": "user_register",
    "action": "create",
    "timestamp": "2026-01-01T12:34:56.789Z",
    "cacheHit": false // or true, for read/list operations
  },
  "error": null // or { code: "VALIDATION_FAILED", message: "..." } on failure
}
```

## 9. Limitations / Future Considerations

*   **Detailed Error Handling**: Integrate with a more robust `ActionError` class (e.g., from `actionApp_v1.js`) for structured, actionable error information.
*   **Pluggable Hooks**: Develop a more flexible hook system that supports custom pre/post-operation functions or external flows.
*   **Dependency Injection**: Refactor `ActionEntity` to allow injection of storage drivers and other utilities, improving testability and extensibility. This would move the instantiation of `ActionFs`, `IndexedDBStorage`, etc., outside of `ActionEntity`'s `initialize()` method.
*   **Advanced Caching Strategies**: Implement more sophisticated cache eviction policies, persistent caching, or distributed caching for higher-scale applications.
*   **External Authorization**: Integrate with a dedicated RBAC or ACL system in a layer above `ActionEntity`.
*   **External Configuration**: Load `ENTITY_CONFIGS` and `DATASETS` from external files (e.g., JSON) instead of in-memory constants.
*   **Concurrency Control**: Implement locking mechanisms or optimistic concurrency for multi-process environments to prevent data corruption.
*   **Query Language**: For `read` and `list` operations, introduce a richer query language beyond simple key-value filtering.
*   **Scalability for Large Files**: Implement streaming or partial file operations for very large data files to avoid loading entire files into memory.
*   **AppScript Environment Considerations**:
    *   **Execution Limits**: Be mindful of Google AppScript's daily execution quotas and time limits for API calls (e.g., `UrlFetchApp`).
    *   **Asynchronous Operations**: AppScript often requires careful handling of asynchronous patterns, especially for external calls.
    *   **Authentication**: `ActionSpreadsheet` relies on the AppScript project's execution context and associated Google Account permissions for Spreadsheet access.
*   **Browser Storage Considerations**:
    *   **Origin Policy**: `IndexedDB` and `LocalStorage` are bound by the Same-Origin Policy.
    *   **Quotas**: `LocalStorage` has small size limits (typically 5-10MB). `IndexedDB` offers much larger, more flexible quotas.
    *   **Security**: Data is client-side. Do not store sensitive information unencrypted.
