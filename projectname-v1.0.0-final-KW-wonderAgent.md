# Unified Action Platform Reference

**Version**: 1.0.0
**Status**: Final
**Agent**: KW-wonderAgent
**Date**: 2026-01-01

## 1. Combined Purpose
This single document captures the production-ready service described across the `actionApp_v1.js` documentation and the `actionEntity_v4.js` design specification. Together they describe an extensible Action Framework that hosts resilient entity management, storage adapter plumbing, policy-aware validation, observability, and runtime safety for browser, Node.js, and spreadsheet contexts. The goal is to explain each layer, the data flows between them, and how to operate CRUD workflows without needing additional external references.

## 2. Key Components

### 2.1 ActionFramework (Singleton Core)
- Initializes by merging `APP_CONFIG` with overrides, wiring logger, monitor, hooks, cache, and global error handlers for both browser (`window`) and Node.js (`process`).
- Exposes `getEntity(entityName)` for lazy creation of `ActionEntity` instances, ensuring a single orchestrator per entity.
- Provides `health()` to gather system metrics (entities, cache, `process.memoryUsage()`, `process.uptime()`).
- Offers `startServer()` in Node.js to create an HTTP listener that parses URLs, routes, context, and delegates operations to the relevant entity, while recording latency and metrics through `monitor`.
- Maintains platform-aware runtime detection and standardizes logging/monitoring via configured `logger` and `monitor` instances.

### 2.2 ActionEntity (Main Orchestrator)
- Manages entity lifecycles, configurations, validation, caching, hooks, and pluggable storage drivers.
- Attributes include `config`, `entities`, `entityConfigs`, `storage` (driver instances), `cache` (in-memory `Map` with TTL hints), and a `ready` flag set after `initialize()` completes.
- `initialize()` persists configs when using file storage, sets up directories, instantiates storage drivers (`ActionFs`, `IndexedDBStorage`, `LocalStorageAdapter`, `ActionSpreadsheetAdapter`), and ensures data files exist.
- Processes requests via `processRequest(request)` that validates the entity/action, checks readiness, runs validation, delegates to precise `execute` methods, captures errors, and formats structured responses.

### 2.3 Storage Providers & Drivers
- Each driver implements promise-based CRUD (`create`, `read`, `update`, `delete`, `list`) for its backend:
  * `ActionFs`: Serializes/deserializes JSON/JSONL/CSV files via `fs.promises` and `path` helpers.
  * `IndexedDBStorage`: Uses IndexedDB object stores to persist structured browser data and define indexes for quick lookups.
  * `LocalStorageAdapter`: Stores key-value pairs under configurable prefixes.
  * `ActionSpreadsheetAdapter`: Maps objects to Google Sheets rows/columns via AppScript APIs.
- Configurable options such as `dbName`, `storeName`, `indexes`, `sheetId`, `tabName`, and file paths allow each driver to operate with specific environmental details.
- Drivers are dynamically instantiated based on `config.storage.driver` and share consistent interfaces so `ActionEntity` can operate uniformly.

### 2.4 Supporting Utilities
- `ActionError`: Central error class that takes category, code, message, details, context, and references `ERROR_CONFIG`/`APP_CONFIG` for levels, recoverability, HTTP status, and sanitization rules. It enriches context, hides sensitive details in production, exposes `toJSON()`, and logs via `ActionFramework.getLogger()`.
- `CacheManager`: Configured through `APP_CONFIG.cache`, uses `LocalStorage` or `MemoryStorage` to store TTL’ed data with pattern invalidation. Entities consult the cache for reads/lists and invalidate related entries after writes.
- `Validator` / `SchemaValidator`: Schema-driven validation engine that enforces required fields, types, min/max lengths, formats (emails), enums, and array rules, throwing `ActionError` with precise messages on violation.
- Logger/Monitor pair track structured logs, audits, request/error metrics, and expose metrics APIs for health checks.

## 3. Data and Event Flows
- **Framework Initialization**: `new ActionFramework(configOverrides)` merges configs, sets up logger/monitor/hooks/cache, and registers global error handlers (`window`/`process`).
- **Entity Lifecycle**: `ActionFramework.getEntity(entityName)` either retrieves or instantiates an `ActionEntity`, which initializes storage, cache, validation, hooks, and ensures readiness before accepting requests.
- **CRUD Execution**: `ActionEntity` methods follow a strict sequence: permission validation, `beforeX` hooks, schema validation (`SchemaValidator.validate()`), storage driver interaction, cache synchronization (`set`, `get`, `delete`, `invalidatePattern`), `afterX` hooks, metrics recording, and audit logging. Errors are normalized via `ActionError.fromError()` and logged.
- **Global Error Management**: Listeners on `window` and `process` capture uncaught errors/promises, turn them into `ActionError`, log via logger, and on unrecoverable Node.js exceptions call `process.exit(1)`.
- **HTTP Request Flow (Node.js)**: `startServer()` listens to incoming requests, parses method/URL/body, matches routes in `config.routes.endpoints`, delegates to `ActionEntity` CRUD methods, formats JSON responses with `X-Request-ID`, records metrics, and handles errors consistently.

## 4. Entity Configuration and Schemas
- `ENTITY_CONFIGS` defines blueprints per entity (e.g., `user_register`, `user_session`, `alarm`) with `id`, `name`, `type`, `dbSchema`, `storage`, and optional `cacheHints`.
- `dbSchema.properties` specify field metadata (`type`, `validate` rules, `default` values) that inform `SchemaValidator` and `ActionEntity` enrichment.
- Storage configs declare the driver (`fs`, `indexeddb`, `localstorage`, `spreadsheet`), `keyField`, and driver-specific options (paths, file names, database names, indexes, prefixes, sheet IDs, header rows).
- `cacheHints` include TTLs and explicit keys (e.g., `['user_register_list']`) guiding the entity cache’s expiration and invalidation behavior.
- Entities receive metadata such as `_id`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy` from data enrichment logic before persistence.

## 5. API & Usage Patterns
- All interactions use `{ entity, action, data, id }` requests. `processRequest()` validates readiness, action validity, executes the matching `execute` method (`Create`, `Read`, `Update`, `Delete`, `List`), handles storage results, syncs cache, and formats responses as `{ success, data, meta, error }`.
- `executeCreate` generates timestamps/IDs, applies simple password hashing, persists via the storage driver, and clears relevant caches.
- `executeRead` checks the cache first, falls back to driver reads (by `keyField`), caches on hit, and returns sanitized data.
- `executeUpdate` merges updates, updates timestamps, persists the merged record, and invalidates caches.
- `executeDelete` ensures the record exists via the driver before removal and clears caches.
- `executeList` caches entire collections, calls `list()` or `read(filters)` on drivers, applies in-memory filters if needed, and stores the full list for future reads.
- Response metadata always includes `entity`, `action`, `timestamp`, and whether the cache was hit, while failures include `error.code` and descriptive messages.

## 6. Non-Functional Characteristics
- **Performance**: In-memory cache accelerates reads/list operations; write throughput depends on the storage driver (file I/O, indexedDB transactions, Google Sheets latency).
- **Error Handling**: Validation errors bubble up via `ActionError`, storage driver issues propagate standardized responses, and global handlers catch unhandled situations.
- **Security**: Schema validation, minimal password hashing (base64), and sanitized production errors are in place; sensitive data should not land in browser storage or spreadsheets without extra safeguards.
- **Scalability**: Local storage drivers lack horizontal scaling; IndexedDB/LocalStorage are origin-bound; Google Sheets is limited by API quotas and spreadsheet size.
- **Maintainability**: Modular design (ActionFramework, ActionEntity, validators, caches, drivers) plus declarative entity configs and hook extensibility keep the stack readable.

## 7. Integration Points
- Higher-level applications instantiate `ActionFramework`, call `await actionEntity.initialize()`, and route service requests through `actionEntity.processRequest()`.
- Node.js drivers rely on `fs.promises` and `path` for file operations.
- Browser builds leverage `IndexedDBStorage` and `LocalStorageAdapter` utilities.
- Google AppScript flows use `ActionSpreadsheetAdapter` with Sheet IDs, tabs, and header rows.
- Logging/monitoring expose metrics for health checks, and `ActionFramework` assures each entity’s audit trail includes `logger.audit()` calls.
- Future hooks/error handlers are designed to integrate easily with external RBAC, dependency injection, or distributed caching systems.

## 8. Limitations & Future Considerations
- Replace simple `ActionError` handling with a more structured strategy to align with the broader framework.
- Expand hook support to enable custom workflows, dependency injection, and external authorization/enforcement.
- Offer advanced caching (eviction policies, persistence), query languages beyond key/value filtering, and concurrency controls for multi-process writes.
- Move `ENTITY_CONFIGS` and `DATASETS` to external JSON sources for easier configuration and scaling.
- Adapt file drivers for streaming large datasets while maintaining integrity.
- Account for Google AppScript execution limits and asynchronous patterns when using spreadsheet drivers.
- Respect browser storage quotas, same-origin policies, and avoid storing sensitive data without encryption.

## 9. Usage Templates
- Initialization requires calling `new ActionFramework(configOverrides)`, awaiting `actionEntity.initialize()`, and then passing CRUD requests in the `{ entity, action, data, id }` shape.
- CRUD helper methods wrap `processRequest()` calls and log the resulting JSON responses, handling errors by logging `createResponse.error` when `success` is false.
- HTTP server responses include headers such as `X-Request-ID` and `Content-Type`, and node metrics are recorded on each request via `monitor.recordLatency()` and `monitor.recordRequest()`.
