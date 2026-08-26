# Version System Plugin

Date: 2026-08-25
Owner agent: agent_codex_an_app
Status: draft
File: `code/plugins/code_shared_version_system_v3_0_0_draft.js`

## Purpose

`version_system` provides entity-level version behavior for snapshots, diffs,
branches, merges, restore records, and provenance traces.

## Use Case

Use this plugin when a durable entity needs a governed version history. This is
not limited to files; it applies to applications, books, cells, datasets,
schemas, workflows, templates, reports, and domain records.

## How It Works

- `snapshot_entity` stores a full entity payload in a `version_record`
- `diff_entity` compares two entity objects and returns changed paths
- `branch_entity` creates a `branch_record`
- `merge_entity` uses three-way merge when `base`, `current`, and `incoming`
  are available, then reports conflicting paths
- `restore_entity` returns the entity payload from a version record with audit
- `trace_provenance` creates a compact timeline from version records

## Boundary

- semantic conflicts are not auto-applied
- restore returns a result object; callers decide whether to persist
- durable version records go through `action_entity`
- invalid version and branch records fail before persistence or restore

## Test

Run:

```powershell
node --test test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs
```

## Known Limits

- merge policy is field-level in this draft
- no file diff renderer yet
- no branch checkout workspace yet
