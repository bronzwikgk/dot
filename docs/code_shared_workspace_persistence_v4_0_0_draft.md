# code_shared_workspace_persistence_v4_0_0_draft

Status: draft
Owner: agent_codex_an_app

## What It Is

`workspace_persistence` is a utility for saving and restoring An App workspace
state. It also creates version checkpoints used by undo and redo.

## Public Methods

- `validate_storage_key(config)`
- `run_storage_selftest(config)`
- `save_workspace(config)`
- `load_workspace(config)`
- `create_undo_checkpoint(config)`
- `undo_change(config)`
- `redo_change(config)`

## Use Cases

- Persist selected book, cell, layout, and command state.
- Restore state after browser reload.
- Block invalid storage keys before writing user data.
- Create audit records for save, load, undo, and redo.

## Test

```powershell
node --test test\v4_workspace_persistence\agent_codex_an_app_v4_workspace_persistence_v1_0_0_test.mjs
```
