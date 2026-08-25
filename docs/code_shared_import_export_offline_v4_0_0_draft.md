# code_shared_import_export_offline_v4_0_0_draft

Status: draft
Owner: agent_codex_an_app

## What It Is

`import_export_offline` is a utility for governed workspace import/export,
executable import confirmation, offline asset checks, and local static serving.

## Public Methods

- `export_workspace(config)`
- `import_workspace(config)`
- `validate_import(config)`
- `confirm_executable_import(config)`
- `validate_asset_inventory(config)`
- `create_local_server(config)`

## Rules

- JSON export must import back into the same state.
- Imported executable cells are blocked until `confirmed: true`.
- Asset paths must be local and must not contain remote CDN references.
- The local server uses a configured port and `Cache-Control: no-store`.

## Test

```powershell
node --test test\v4_import_export_offline\agent_codex_an_app_v4_import_export_offline_v1_0_0_test.mjs
```
