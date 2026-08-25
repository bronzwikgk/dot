# V4 Contract 008: Import Export Offline

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_009, v4_missing_016, v4_missing_017, v4_missing_029, v4_missing_034

## Goal

Support governed file export/import, local static serving, and offline-capable
assets with zero CDN dependency.

## Required Entities

- export_record
- import_record
- file_policy
- executable_import_confirmation
- asset_record
- local_server_record

## Required Methods

- export_workspace(config)
- import_workspace(config)
- validate_import(config)
- confirm_executable_import(config)
- validate_asset_inventory(config)
- create_local_server(config)

## Success Criteria

- export creates a restorable file
- import validates before merge/restore
- executable cells require confirmation
- local server supports configured port and no-cache headers
- offline browser run succeeds with network disabled
- asset scan finds no CDN references

## Tests

- export/import tests
- executable confirmation tests
- local server tests
- offline browser e2e

## Do Not

- do not silently execute imported code
- do not depend on CDN assets for promoted V4 app
