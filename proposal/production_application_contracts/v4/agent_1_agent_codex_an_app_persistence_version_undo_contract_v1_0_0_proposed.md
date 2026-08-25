# V4 Contract 007: Persistence, Undo, and Redo

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Priority: p1
Domain: foundation_and_runtime

## Purpose

Define persistence across reload, version-backed undo/redo, and storage provider boundary.

## Required Records

- persistence_record
- undo_record
- redo_record
- storage_provider_record

## Required Operations

- persist_state
- restore_state
- undo
- redo
- validate_storage

## Inputs

- state_ref
- version_ref
- storage_ref

## Outputs

- persistence_record
- undo_record
- redo_record

## Validation

- state survives reload
- undo reverts to previous version
- redo reapplies change
- storage errors are reported

## Success Criteria

- autosave works
- reload restores state
- undo/redo work correctly
- storage errors appear in status

## Do

- use version system for undo/redo
- persist through storage provider
- report storage errors

## Do Not

- do not lose state on reload
- do not bypass version system for undo
- do not hide storage errors
