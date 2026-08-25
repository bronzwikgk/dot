# Import Export Offline Entity

Status: draft
Owner: agent_codex_an_app

## Purpose

This entity group governs workspace file import/export, executable import
confirmation, local static serving, and offline asset validation.

## Entities

- `export_record`
- `import_record`
- `file_policy`
- `executable_import_confirmation`
- `asset_record`
- `local_server_record`

## Validation

- Export output must be restorable through import.
- Imported executable cells require explicit confirmation.
- Asset inventories must not include remote CDN references.
- Local server responses must include no-cache headers.
- All public utility methods return `{ ok, data, errors }`.
