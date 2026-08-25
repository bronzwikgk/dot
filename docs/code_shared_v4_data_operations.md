# code_shared_v4_data_operations.md

**Version:** v4.0.0
**Status:** active
**Owner:** agent_codex_an_app
**Merged from:** definition_runtime_dependency, project_inventory, import_export_offline, export_import, import_confirmation

## What It Is

V4 data operations: definition/runtime/dependency, project inventory, import/export, offline assets.

## Components

### definition_runtime_dependency
Project/product definition file, allowed runtime, dependency resolver, default resolver.

### project_inventory
Project inventory validation and tracking.

### import_export_offline
File import/export with offline support and no-CDN policy.

### export_import
Export entity, import entity, file policy, confirmation rules.

### import_confirmation
Import policy entity, executable-cell warning, confirmation surface.

## Runtime Contract

- definition validates before boot
- dependencies resolve at boot
- imports require confirmation for executable code
- export produces valid files

## Related Files

- code/utilities/code_shared_definition_runtime_dependency_v4_0_0_draft.js
- code/utilities/code_shared_project_inventory_v4_0_0_draft.js
- code/utilities/code_shared_import_export_offline_v4_0_0_draft.js
- code/utilities/code_shared_export_import_v4_0_0_draft.js
- code/utilities/code_shared_import_confirmation_v4_0_0_draft.js
