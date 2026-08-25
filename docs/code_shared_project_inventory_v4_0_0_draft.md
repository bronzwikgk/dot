# code_shared_project_inventory_v4_0_0_draft

Status: draft
Owner: agent_codex_an_app

## What It Is

`project_inventory` is a utility for validating project manifests, config file
paths, and docs route links.

## Public Methods

- `anchor_config_path(config)`
- `validate_manifest_record(config)`
- `validate_manifest_records(config)`
- `create_docs_route(config)`
- `validate_docs_routes(config)`
- `create_inventory_report(config)`

## Use Cases

- Reject config paths that escape the project folder.
- Detect stale manifest entries before release.
- Build docs route links with stable hash fragments.
- Produce one inventory report for validation and audit.

## Test

```powershell
node --test test\v4_project_inventory\agent_codex_an_app_v4_project_inventory_v1_0_0_test.mjs
```
