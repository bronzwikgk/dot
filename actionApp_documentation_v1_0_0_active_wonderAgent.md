# Action Framework Documentation - actionApp_v1.js

**Version**: 1.0.0
**Status**: Active
**Agent**: wonderAgent
**Date**: 2026-01-01

## 1. Overview

This document provides a detailed breakdown of the `actionApp_v1.js` framework, focusing on its features, data flow, and event flow across its methods and classes. This framework is a production-grade, universal solution designed for both browser and Node.js environments, emphasizing modularity, robust error handling, and extensibility.

## 2. Features

*   **Platform-Aware Runtime**: Automatically detects and adapts to `browser` or `node` environments.
*   **Comprehensive Configuration System**: Relies on external configuration files (`RUNTIME.js`, `ERROR_CONFIG.js`, `APP_CONFIG.js`) for modular and flexible setup.
*   **Production Error Handling (`ActionError`)**:
    *   Centralized error management with structured `ActionError` class.
    *   Categorization, custom codes, severity levels (critical, error, warn, info).
    *   Recoverability flags, timestamping, and detailed context.
    *   Integration with logging and monitoring.
    *   Automatic mapping of generic errors to `ActionError`.
    *   Sanitization of error details in production environments.
*   **RBAC Permissions & Validation**: Integrated permission checks for entity operations based on user roles.
*   **Multi-Storage Support (`ActionEntity` with Storage Providers)**:
    *   `ActionEntity` abstracts data persistence.
    *   Supports `IndexedDB`, `LocalStorage`, `FileStorage`, and `MemoryStorage` providers.
    *   Dynamic selection and fallback mechanisms for storage providers.
*   **Built-in Caching (`CacheManager`)**:
    *   Dedicated `CacheManager` for configurable caching.
    *   Supports `LocalStorage` and `MemoryStorage` as cache providers.
    *   Time-to-live (TTL) and pattern-based invalidation.
*   **Robust Data Validation (`Validator`)**:
    *   Separate `Validator` class for schema-based data validation.
    *   Checks required fields, data types, min/max lengths, formats (e.g., email), enums, and array constraints.
    *   Integrates with `ActionError` for validation failures.
*   **Health Monitoring & Logging**:
    *   Custom `logger` and `monitor` for structured logging and performance metrics.
    *   Records requests, errors, and latency.
    *   Provides a `health()` endpoint/method for system and entity status.
    *   Audit logging for entity operations.
*   **Global Error Handling**: Registers global listeners for uncaught exceptions and unhandled promise rejections in both browser (`window`) and Node.js (`process`) environments.
*   **HTTP Server (Node.js)**:
    *   Built-in HTTP server with `startServer()` method for Node.js.
    *   Handles CORS, advanced route matching with path parameters.
    *   Integrates seamlessly with `ActionEntity` methods for API actions.
    *   Automatic error handling and response formatting using `ActionError`.
*   **Data Enrichment**: Automatically adds metadata like `_id`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy` to entity data.
*   **Response Sanitization**: Removes hidden fields from entity responses before returning them.
*   **Extensible Hooks**: Supports `before` and `after` hooks for CRUD operations, allowing custom logic injection.
*   **Singleton Framework (`ActionFramework`)**: Ensures a single instance of the core framework throughout the application.

## 3. Data Flow Across Classes and Methods

This section details how data is created, transformed, stored, and retrieved within the `actionApp_v1.js` framework.

### 3.1. `ActionError`
*   **Input**: `category`, `code`, `message`, `details`, `context` from call site. Configuration from `ERROR_CONFIG` and `APP_CONFIG`.
*   **Processing**: Constructs error object, setting `name`, `code`, `level`, `recoverable`, `timestamp`, `httpStatus`, and `suggestions` based on `ERROR_CONFIG`. Enriches `context`. Hides `details` and `stack` in production.
*   **Output**: Structured `ActionError` instance. `toJSON()` provides a client-friendly representation. `log()` sends formatted error data to `ActionFramework.getLogger()`.

### 3.2. `ActionEntity`
*   **Input**: `entityName` (constructor). `data`, `id`, `query` (CRUD operations).
*   **Initialization**:
    *   `constructor`: Loads entity-specific config from `APP_CONFIG.entities[entityName]`.
    *   `initStorage()`: Reads `APP_CONFIG.storage` for provider config. Creates and returns a storage provider instance (`IndexedDBStorage`, `LocalStorage`, `FileStorage`, `MemoryStorage`). Handles fallbacks.
    *   `initCache()`: Creates `CacheManager` instance configured by `APP_CONFIG.cache`.
    *   `initValidator()`: Creates `Validator` instance using the entity's schema.
    *   `initHooks()`: Fetches hook functions from `ActionFramework.getHook()`.
*   **CRUD Operations (`create`, `read`, `update`, `delete`)**:
    *   **Data Validation**: `this.validator.validate(data, operation)` ensures data conforms to schema.
    *   **Data Enrichment**: `enrichData()` adds or updates `_id`, `metadata.createdAt`, `createdBy`, `updatedAt`, `updatedBy`.
    *   **Data Persistence**: Delegates `create`, `read`, `update`, `delete` calls to `this.storage` provider.
    *   **Caching**: Interacts with `this.cache` (e.g., `set`, `get`, `delete`, `invalidatePattern`).
    *   **Output**: Returns a structured response object via `formatResponse()` containing `success`, `operation`, `timestamp`, and `data` (sanitized). `sanitizeResponse()` removes fields marked as `hidden` in the schema.

### 3.3. Storage Providers (`IndexedDBStorage`, `LocalStorage`, `MemoryStorage`)
*   **Input**: `options` (constructor). `data`, `id`, `query` (CRUD methods).
*   **Processing**: Execute actual read/write/update/delete operations on their respective underlying storage mechanisms.
*   **Output**: Raw data objects (often including an internal `_id`).

### 3.4. `CacheManager`
*   **Input**: `options` (constructor). `key`, `data` (for set), `pattern` (for invalidatePattern).
*   **Initialization**: `initialize()` creates and initializes an internal `LocalStorage` or `MemoryStorage` instance based on `options.provider`.
*   **Processing**: Stores and retrieves data with a TTL. Performs pattern matching for invalidation.
*   **Output**: Cached data (`get`) or success/failure status of cache operations (`set`, `delete`, `invalidatePattern`).

### 3.5. `Validator`
*   **Input**: `options` (constructor, containing `schema`). `data`, `operation` (for `validate()`).
*   **Processing**: Iterates through `schema.fields` and validates `data` against rules (required, type, min/max, format, enum, array properties).
*   **Output**: The `validatedData` object if all checks pass. Throws an `ActionError` with validation details if errors are found.

### 3.6. `ActionFramework`
*   **Input**: `configOverrides` (constructor). `entityName` (`getEntity`).
*   **Initialization**:
    *   Merges `APP_CONFIG` with `configOverrides`.
    *   `initLogger()`: Configures logger based on `this.config.logging`.
    *   `initMonitor()`: Initializes metrics collection (requests, errors, latency).
    *   `initHooks()`: Sets up default hook functions.
    *   Initializes `CacheManager`.
*   **`getEntity(entityName)`**: Lazily creates and returns `ActionEntity` instances.
*   **`health()`**: Gathers health status from registered `ActionEntity` instances, `this.cache`, and system-level metrics (Node.js `process.memoryUsage()`, `process.uptime()`).
*   **`startServer()` (Node.js)**:
    *   **Input**: HTTP `req` and `res` objects.
    *   **Parsing**: Parses `req.url`, `req.method`, `req.body` (JSON), and path parameters.
    *   **Context Creation**: Builds a `context` object including `requestId`, `user` (placeholder), `headers`, `ip`.
    *   **Delegation**: Delegates core logic to `ActionEntity` methods (e.g., `entity.create(requestData, context)`).
    *   **Response**: Formats the `ActionEntity`'s result into a JSON HTTP response, including `X-Request-ID` and `Content-Type` headers.
    *   **Metrics**: Records request latency and success/failure via `this.monitor`.

## 4. Event Flow Across Methods and Classes

The framework primarily uses direct method calls as its "event" flow, with explicit event listeners for global error handling and internal hook mechanisms.

### 4.1. Application Initialization
*   `new ActionFramework(configOverrides)`:
    *   Calls `this.mergeConfigs()`, `this.initLogger()`, `this.initMonitor()`, `this.initHooks()`, `this.cache.initialize()`.
    *   **Crucially**: Calls `this.registerErrorHandler()`, setting up global event listeners.
    *   Logs framework initialization status to console.

### 4.2. Entity Lifecycle and CRUD Operations
*   **`ActionFramework.getEntity(entityName)`**:
    *   If `entityName` is new, `new ActionEntity(entityName)` is called.
    *   `new ActionEntity()`:
        *   Calls `this.initStorage()`, `this.initCache()`, `this.initValidator()`, `this.initHooks()`.
        *   Calls asynchronous `this.storage.initialize()` and `this.cache.initialize()`.
*   **`ActionEntity.create/read/update/delete(data, context)` (Triggered by external client or HTTP server)**:
    1.  **Permission Check**: `this.checkPermission()` is called. If denied, `ActionError` is thrown, halting execution.
    2.  **`beforeX` Hooks**: `this.runHooks('beforeX', ...)` is called. Custom hook functions registered in `APP_CONFIG` are executed.
    3.  **Validation**: `this.validator.validate()` is called. If validation fails, `ActionError` is thrown, halting execution.
    4.  **Storage Operation**: The respective `this.storage` provider's CRUD method is called.
    5.  **Cache Interaction**: `this.cache` methods (`set`, `get`, `delete`, `invalidatePattern`) are called.
    6.  **`afterX` Hooks**: `this.runHooks('afterX', ...)` is called.
    7.  **Metrics**: `this.recordMetrics()` is called.
    8.  **Auditing**: `this.audit()` is called, which in turn calls `ActionFramework.getLogger().audit()`.
    9.  **Error Handling**: If any step throws an `Error`, it is caught. `ActionError.fromError()` normalizes it, and `actionError.log()` is called using `ActionFramework.getLogger()`.

### 4.3. Global Error Handling
*   **Event Listeners**: Set up by `ActionFramework.registerErrorHandler()`.
    *   **Browser**: `window.addEventListener('error')`, `window.addEventListener('unhandledrejection')`.
    *   **Node.js**: `process.on('uncaughtException')`, `process.on('unhandledRejection')`.
*   **Trigger**: When an unhandled error or rejected promise occurs in the respective runtime environment.
*   **Flow**:
    1.  The event listener catches the raw error.
    2.  `ActionError.fromError(rawError, { source: ... })` is called to create a standardized `ActionError` instance.
    3.  `actionError.log()` is called, routing the error through `ActionFramework.getLogger()`.
    4.  **(Node.js specific)** If `actionError.recoverable` is false for `uncaughtException`, `process.exit(1)` is called.

### 4.4. HTTP Server Request Flow (Node.js Specific)
*   **`ActionFramework.startServer()`**: Starts an HTTP server.
*   **HTTP Request Event**: An incoming HTTP request triggers the server's request listener (`async (req, res) => { ... }`).
    1.  **Request Parsing**: Request headers, URL, and body are processed.
    2.  **Route Matching**: The request's method and URL are matched against `this.config.routes.endpoints`.
    3.  **Entity Delegation**: Based on the matched route's `action`, the corresponding `ActionEntity`'s CRUD method is called (e.g., `entity.create()`, `entity.read()`).
    4.  **Response Generation**: The result from `ActionEntity` is formatted into an HTTP JSON response.
    5.  **Metrics**: `this.monitor.recordLatency()` and `this.monitor.recordRequest()` are called.
    6.  **Error Handling**: If any part of the request processing (parsing, routing, entity call) throws an error, it is caught. `ActionError.fromError()` is used, `actionError.log()` is called, and an appropriate HTTP error response is sent back to the client.

### 4.5. Logging and Monitoring
*   **Trigger**: Explicit calls to `ActionFramework.getLogger().*()` and `ActionFramework.getMonitor().*()`. These calls are embedded in `ActionError.log()`, `ActionEntity`'s CRUD operations, and `ActionFramework.startServer()`.
*   **Flow**: Log data is formatted according to `APP_CONFIG.logging` and printed to the console. Monitoring data is stored internally for later retrieval via `ActionFramework.getMonitor().getMetrics()` or `ActionEntity.getMetrics()`.
