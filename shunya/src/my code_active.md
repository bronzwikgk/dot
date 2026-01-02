# ehh Manifest Reference
Version: 1.0.1
Status: inprogress
Agent: WA-Alpha wonderAgent

## Purpose
Establish a structured manifest that makes assets, configuration layers, core services, docs, source modules, and operational artifacts discoverable for the `ehh` workspace.

## Assets
- `logos`: iconography, branding, and illustration assets referenced in documentation or UI layouts.

## Configuration
### Global Configurations
- `appConfig`: application-wide runtime flags, build profiles, and feature toggles.
- `entityCollectionConfig`: metadata describing each entity collection, relational mappings, and indexing strategy.
- `entityConfig`: per-entity schema descriptors, validation rules, and lifecycle hooks.
- `routeConfig`: route definitions, guards, middleware associations, and handler mapping for server/client surfaces.
- `globalRuleConfig`: business rules applied across the stack, including compliance, retention, and scheduling policies.
- `listenerConfig`: catalog of event listeners and their trigger contexts.
- `viewConfig`: layout presets, view parameters, and feature gating nuggets.
- `serviceConfig`: backend service bindings, retries, and circuit-breaker behavior.
- `pluginConfig`: plugin lifecycle declarations, dependencies, and initialization order.
- `utilityConfig`: reusable helpers, defaults, and shared constants that other areas consume.

## Core
- `Entry.js`: bootstraps the platform, wires central services (routing, persistence, logging), and exposes the primary lifecycle hooks.
- `ActionApp.js`: orchestrates actions, handles intent/context switching, integrates plugin payloads, and surfaces telemetry.

## Documentation
- `User docs`: end-user guidance, flow walkthroughs, and how-tos.
- `Developer docs`: integration guides, coding patterns, plugin creation notes, and contribution workflows.
- `About`: overview of the platform mission, principles, team, and governance.
- `API`: contract definitions, authentication, response codes, and error handling conventions.

## Source
### Plugins
- `ActionEntity`: entity lifecycle helpers and synchronization adapters.
- `ActionView`: rendering adapters, view utilities, and reactive plumbing.
- `ActionEvent`: domain event definitions, dispatchers, and enrichment helpers.
- `ActionServer`: server-side middleware, routing helpers, and request orchestration.
- `ActionClient`: client synchronization, websockets, and polling strategies.
- `ActionEngine Flow`: workflow definitions, orchestrated steps, state machine transitions, and diagnostics.

### Utility
- `ActionValidator`: centralized validation rules and schema enforcement helpers.
- `ActionInclude`: shared includes leveraged by other actions.
- `Parser`: document, payload, or script parsing utilities.
- `Include`: generic include helpers for templates, stories, or code generation.
- `ActionTree`: tree walkers for batch operations, reports, or hierarchical transforms.
- `ActionFs`: filesystem helpers for asset management, caching layers, or migration tooling.
    - Methods:
        - readconfig:
        - createfile:
- `ActionIndexDb`: indexedDB helpers for client persistence strategies.
- `ActionLocalStorage`: localStorage bindings, cache eviction strategies, and persistence helpers.
- `HttpService`: HTTP client wrappers with retry, timeout, and circuit metadata.
- `ActionAgent`: worker/agent orchestration utilities, message routing, and health checks.
- `Mat`: matrix, analytics, or math helpers powering simulation flows.
- `ActionOllama`: Ollama integrations, model connectors, and inference helpers.
- `Watchman`: file, process, or artifact monitoring helpers for CI/DI workflows.

## Tests
- `unitTestCases`: granular validation for actions, utilities, and configuration handlers.
- `e2eTestCases`: scenario-driven suites that surface cross-module behavior and plugin interactions.

## Reports
- `operationalMetrics`: runtime health dashboards, task duration, and error summaries.
- `auditReports`: compliance, change history, and event evaluations mapped to business rules.
- `pluginAnalysis`: plugin usage patterns, latency reports, and dependency diagrams.

## Logs
- `applicationLogs`: runtime telemetry, request traces, and status updates.
- `pluginLogs`: instrumented plugin events, lifecycle transitions, and error stack traces.
- `releaseLogs`: change notes, deployment timestamps, and rollout observations.

## Instructions
- `runbooks`: deployment, rollback, and maintenance instructions for on-call or release teams.
- `setupGuides`: local dev setup, configuration seeds, and dependency notes.
- `pluginOnboarding`: how-to for integrating new plugins, required metadata, and testing steps.

## Credentials
- `apiKeys`: lists of vault paths or placeholders for third-party keys, secrets, and scopes.
- `certificates`: signing cert information, expiry dates, and rotation reminders.
- `tokens`: scoped tokens, refresh guidance, and storage hints.

## Use Cases
- `erms`: enterprise resource management flows and reconciliation.
- `TMS`: trade and portfolio management sequences and scheduling.
- `ActionSpace`: workspace orchestration, layout, and collaboration flows.
- `ActionAgent`: runtime agent coordination, alerting, and orchestration.
- `Mat`: analytical use cases, simulation tooling, and metric exports.
- `Spa`: single-page application workflows and client hydration.
- `NodejsApi`: REST/GraphQL backends built with Node.js services.
- `SpreadSheet Server`: spreadsheet-driven backends or data transformation services.

## Latest Active Version
    - ActionFS: D:\Users\0dot1\Documents\Github\dot\shunya\src\utils\utility\dot-actionFs-v1.0.5-approved-KW-wonderAgent.js
    - ActionFS_tests: D:\Users\0dot1\Documents\Github\dot\inprogress\test\dot-utility-suite-v1.0.5-inprogress-KW-wonderAgent.js
## Latest Approved Version




Classes and method
- actionEntity : A class that handles all data operations, including schema validation for fields and persistant storage using utility helpers
    - init
        - creates a cache object
        - loads all data from paths in config.
            - loads list of entity into this.entityCollection, an array object with an entity config as an item.
                - traverse content, parse,resolve directives like include or dynamic variables., if entity storage policy is for cache on system start, it loads the data from the entity config storage path into cache. 
A tree with all the major flows and steps in minmal words with conditions


Flow: Add Service,
    - User adds service via UI (GitLab, GitHub, DigitalOcean, custom FS, etc.).
    - User saves credentials + service name.
    - System fetches repositories/projects from that service.
    - For each repo → fetch branches.
    - For each branch → fetch folder + file tree.
    - Build and store an index tree.



Flow
    - request - visit
        - instance created
        - app start
        - load files and data
            - traverse
            - parse
            - resolve
                - directives
                    - include
                    - dynamic variables
