# V4 Contract 002: Editor and Focus Preservation

Date: 2026-08-25
Status: active
Owner agent: agent_codex_an_app
Priority: p0
Domain: foundation_and_runtime

## Purpose

Define edit/command mode gating, focus state capture/restore, and cell row rendering with focus preservation.

## Required Records

- editor_state_record
- focus_state_record
- cell_row_record
- keyboard_policy_record

## Required Operations

- enter_edit_mode
- exit_edit_mode
- capture_focus
- restore_focus
- render_cell_row

## Inputs

- editor_ref
- focus_ref
- cell_row_ref
- keyboard_event

## Outputs

- editor_state_record
- focus_state_record

## Validation

- Ctrl+S only saves while editing
- Escape exits edit mode
- undo/redo remain governed
- focus survives typing

## Success Criteria

- typing does not rebuild active row
- focus remains stable during render
- edit mode gating works for save/escape

## Do

- use entity doctrine for editor state
- preserve focus across renders
- gate keyboard actions by mode

## Do Not

- do not rebuild DOM rows during typing
- do not bypass edit mode for save
- do not lose focus on render
