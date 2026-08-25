# V4 Contract 007: Persistence Version Undo

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_014, v4_missing_023, v4_missing_025

## Goal

Persist entity state, restore it after reload, and support version-backed undo
and redo.

## Required Entities

- storage_record
- autosave_record
- undo_record
- redo_record
- version_checkpoint

## Required Methods

- save_workspace(config)
- load_workspace(config)
- validate_storage_key(config)
- create_undo_checkpoint(config)
- undo_change(config)
- redo_change(config)

## Success Criteria

- state survives reload
- invalid storage keys fail validation
- undo/redo use version records
- undo/redo produce audit records
- reload restores selected book/cell/layout state

## Tests

- storage unit tests
- reload browser e2e
- undo/redo unit and browser tests

## Do Not

- do not store user data under docs/proposal/code
- do not mutate state without version checkpoint
