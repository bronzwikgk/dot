# Unified Action Platform Design - actionApp

**Version**: 1.1.0
**Status**: Active
**Agent**: KW-wonderAgent
**Date**: 2026-01-01

## 1. Purpose
This document unifies the production-grade runtime described in `actionApp_v1.js`, the `actionEntity_v4.js` design notes, and the deepseek scripts (`deepseek_javascript_20251231_f7c633.js` + `deepseek_javascript_20260101_ff0b2e.js`). It renames the framework core to `actionApp` and adds the event-centric and view-centric layers (`actionEvent`, `actionView`), the `actionEngine` flow runner, and the platform-agnostic file loader and http service utilities into a single narrative covering configuration, flows, and integration points without requiring external knowledge.

## 2. Runtime Detection & Capabilities
`actionApp` boots by running the `RUNTIME` detector that inspects the environment in priority order (Apps Script, Browser, Node.js, Deno, Bun). Each runtime yields a feature map (`fileSystem`, `localStorage`, `indexedDB`, `googleSheets`, `scriptProperties`, `googleDrive`, `httpServer`, `domAccess`) that upstream components consume. This detector powers branch-specific behavior (file IO, DOM hooks, HTTP servers) and records the detected runtime version for diagnostics.

## 3. actionApp (formerly ActionFramework)
- Central singleton that merges `APP_CONFIG`, environment overrides, and runtime-specific defaults.
- Initializes logger, monitor, cache, error handling, `ConfigLoader`, `PluginManager`, `ExternalAPIService`, and `CacheManager`, then calls `registerErrorHandler()` so `window`/`process` errors become sanitized `actionError` records.
- Exposes `getEntity(entityName)` to lazily create `actionEntity` instances, `getHook()` for plugin hooks, `getLogger()`/`getMonitor()` for observability, and `health()` for system-wide metrics including `process.memoryUsage()` and cache stats.
- Starts the Node.js HTTP listener via `httpService` (the renamed ExternalAPIService/ActionServer engine) that parses requests, resolves routes to `actionEntity` CRUD operations, enriches responses with `X-Request-ID` and `Content-Type`, and records latency metrics.
- Maintains platform-aware guards so browser deployments only run DOM/event flows (`actionEvent`, `actionView`) while server deployments focus on HTTP, file, and plugin orchestration.

## 4. actionEngine (Flow Runner)
- Receives structured action descriptors (`{ entity, action, data, id, context }`) from HTTP, CLI, scheduler, or UI triggers.
- Validates the descriptor, fetches the relevant `actionEntity`, and sequences the CRUD call (`create`, `read`, `update`, `delete`, `list`) while capturing `actionError` results.
- Coordinates with `actionEvent` (to dispatch lifecycle hooks) and `actionView` (to notify UI updates) before and after the entity call.
- Uses `actionApp`’s monitoring hooks to instrument start/finish times, cache hits, and plugin hook execution.
- Supports pluggable pipeline stages from the `PluginManager` hook registry (`beforeCreate`, `afterUpdate`, `onError`) so custom logic can mutate payloads or audit decisions.

## 5. actionEntity (Entity Manager)
- Mirrors the earlier design: entity configs define `dbSchema`, storage driver info, and `cacheHints` for TTL/pattern invalidation.
- Initializes storage providers (`ActionFs`, `IndexedDBStorage`, `LocalStorageAdapter`, `ActionSpreadsheetAdapter`) via the runtime-aware config loader.
- Enriches data with `_id`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy` and cleans hidden fields before returning responses.
- Interfaces with `CacheManager` for reads/lists and invalidates cache entries on writes/deletes.
- Relies on `SchemaValidator` (and the `Validator` alias) to enforce required fields, formats (email, enum), ranges, and array constraints while raising `ActionError` on violations.
- Hooks into `actionEvent` to emit audit events and `actionEngine` to propagate metrics and monitoring data.

## 6. actionEvent & actionView (User Interaction Layer)
- `actionEvent` maintains a lightweight event bus that registers listeners across runtimes (DOM `document.addEventListener`, browser `window`, server `process`, or AppsScript `ScriptApp`).
- Provides helpers (`on`, `off`, `emit`) for custom lifecycle hooks, tying into the `PluginManager` so plugins can register `actionEvent.on('beforeEntityUpdate', ...)` handlers.
- Subscribes to UI triggers (button clicks, keyboard shortcuts) to push descriptors into `actionEngine`, and listens for `actionEngine`’s `response` events to animate `actionView` updates.
- `actionView` owns DOM wiring: templates, data binding, semantic navigation, pointer/hover cues, and escape-sequence-safe rendering.
- Streams configuration-driven UI layouts (forms, dashboards, tables) influenced by section 12 of `deepseek_javascript_20260101_ff0b2e.js` and supports template caching, dynamic form building, file upload forms, and data visualization widgets.
- Ensures accessibility (ARIA, keyboard navigation, high contrast) while preferring semantic tag selectors and global token styling.

## 7. File Loader Utility
- `ConfigLoader` handles `.js`, `.json`, `.yml/.yaml`, `.jsonl`, `.txt`, `.csv`, `.xml`, `.html` files with runtime-aware readers:
  * Node.js: uses `fs.promises`, `path`, and dynamic `import` to load ES modules or JSON.
  * Browser: leverages `fetch` to stream files, supporting directory loading via server endpoints.
  * Apps Script: reads from `PropertiesService`, `DriveApp`, or inline script files.
- Supports directory traversal (with recursive config merging) and determines config types for ingestion into `actionApp` and `actionEntity`.
- Includes parsers for CSV (with escaped quotes), YAML (indentation-aware), XML (tag stack), and JSON Lines, ensuring configs can live in whichever format is convenient for the environment.
- Exposes `readFile`, `writeFile`, `parseSimpleYAML`, `parseCSV`, and `parseXML` so other utilities (e.g., `httpService`, `PluginManager`, custom exports) reuse canonical parsing logic.

## 8. httpService (External API & HTTP Layer)
- Based on `ExternalAPIService` with circuit breaker, rate limiting, retry/backoff, OAuth2 token management, webhook signing, and platform-specific implementations.
- Uses `fetch` (Node.js fetch or node-fetch, browser `window.fetch`, AppsScript `UrlFetchApp`) and falls back gracefully to runtime features.
- `httpService` also powers the server listener: request parsing, middleware-style header/cookie handling, REST/WebSocket/SSE endpoints, route matching, error formatting, and CORS policies.
- Supports API registration/management, base URLs, timeout overrides, headers, auth strategies (basic, bearer, API key), and response transformation for `actionEngine` to consume.
- Maintains `apiClients`, `circuits`, `rateLimiters`, and encrypted API key stores (Node.js AES-256-GCM) while exposing `sendWebhook`, `callAPI`, and `callWithOAuth` to the rest of the suite.

## 9. Plugin System & Hooks
- `PluginManager` allows dynamic loading from files or inline code via `ConfigLoader`, tracks lifecycle (`load`, `unload`, `enable`, `disable`), and stores hooks in a prioritized registry.
- Plugins integrate with `actionEvent`, `actionEngine`, `actionEntity`, and `httpService` by registering hooks (`beforeCreate`, `afterResponse`, `onFailure`) that `actionEngine` invokes sequentially.
- Supports dependencies, isolation, and a simple `require` fallback for bundling plugin helpers.
- Hooks fire for entity CRUD operations, HTTP requests, view updates, and custom plugin events defined in `actionEvent`.

## 10. Flow Descriptions
- **Initialization Flow**: `actionApp` merges configs, invokes `ConfigLoader` to hydrate entity definitions, instantiates `PluginManager`, registers hooks, boots `CacheManager`, wires `httpService`, and publishes readiness via `actionEvent` so UI components can render.
- **Entity CRUD Flow**: An `actionEngine` request triggers `actionEvent` pre-hooks, validates data via `SchemaValidator`, delegates to the runtime-appropriate storage driver, updates caches, emits `after` hooks, records audit logs, and notifies `actionView` for UI refreshes.
- **HTTP/API Flow**: `httpService` handles incoming routes, resolves the `actionEngine` descriptor, catches `actionError`, replies with sanitized JSON, and logs metrics through `actionApp`’s monitor.
- **Event/UI Flow**: `actionEvent` translates DOM or runtime events into action descriptors, pushes them to `actionEngine`, then listens for `response` or `error` events to drive `actionView` updates, loading spinners, and accessibility announcements.
- **File/Config Flow**: `ConfigLoader` reads directories (Node.js/AppsScript), merges base + override configs, and feeds `actionApp` as well as `PluginManager`. File watchers trigger reloads when available (via section 6.3 of the spec).

## 11. Monitoring, Logging, & Health
- `actionApp`’s logger/monitor pair (structured JSON, audit, performance metrics) tracks requests, errors, latency, and plugin behavior.
- Health checks aggregate entity readiness, cache stats, runtime memory/uptime, HTTP listener status, and plugin availability.
- Observability hooks adhere to Section 7 of the feature list, ensuring log rotation, filtering, usage analytics, dashboards, and alerting.

## 12. Integration & Usage Patterns
- Higher-level applications instantiate `actionApp`, await `actionEntity` initialization, register plugins/hooks via `PluginManager`, and send commands through `actionEngine`.
- CLI/cron/webhooks can reuse `ConfigLoader` and `httpService` to export/import data (`json`, `csv`, `xml`, `yaml`) per Section 3.
- UI modules call `actionEvent` to listen for user actions and rely on `actionView` for semantic navigation, dynamic forms, and data visualizations defined in Section 12.
- External APIs integrate through `httpService` with circuit breakers and OAuth tokens; responses feed into `actionEngine` for further persistence or view updates.

## 13. Limitations & Roadmap
- Browser storage (IndexedDB/LocalStorage) remains origin-bound; sensitive data should not be kept client-side without encryption.
- Google Apps Script flows must honor execution quotas, so plugin hooks should minimize synchronous work.
- Planned expansions (Rails Section 13 of the feature list) include offline sync conflict resolution, AI/ML assistants, blockchain-backed logging, and IoT integrations.
- Consider replacing the simple `ConfigLoader` parser with a third-party YAML/XML library when configs grow more complex.

## 14. Glossary
- `actionApp`: Renamed core orchestrator (formerly ActionFramework).
- `actionEngine`: Flow executor coordinating entity CRUD, events, views, and plugins.
- `actionEvent`: Event bus bridging DOM/runtime triggers with engine lifecycle hooks.
- `actionView`: DOM and template manager for semantic, accessible UI updates.
- `actionEntity`: Entity CRUD and storage management layer.
- `ConfigLoader`: File utility that reads `.js/.json/.yml/.jsonl/.txt/.csv/.xml/.html` and merges configs per runtime.
- `httpService`: Platform-agnostic HTTP client/server layer with retries, circuit breakers, OAuth, webhook signing, and API key management.
