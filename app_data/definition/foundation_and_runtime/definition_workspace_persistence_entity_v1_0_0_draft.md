# Workspace Persistence Entity

Status: draft
Owner: agent_codex_an_app

## Purpose

Workspace persistence stores application state outside code, docs, and proposal
folders. It supports reload recovery and version-style undo/redo records for
entity state changes.

## Entities

- `storage_record`
- `autosave_record`
- `undo_record`
- `redo_record`
- `version_checkpoint`

## Validation

- Storage keys must use snake_path format.
- State must be stored as structured JSON.
- Undo and redo must refer to version checkpoint records.
- Storage failures must return `{ ok, data, errors }` and surface as status.
