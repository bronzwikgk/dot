# V4 Contract 002: Editor Focus

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_002, v4_missing_003, v4_missing_004, v4_missing_019

## Goal

Support edit/command mode, focus-preserving renders, and cell rail layout
without rebuilding active editor rows while a user types.

## Required Entities

- editor_state
- focus_state
- cell_row
- cell_rail
- render_sync_record

## Required Methods

- enter_edit_mode(config)
- exit_edit_mode(config)
- capture_focus(config)
- restore_focus(config)
- sync_cell_view(config)
- validate_cell_row_layout(config)

## Success Criteria

- `Ctrl+S` saves only while editing
- `Escape` exits edit mode
- focus remains in the active editor after render
- active cell row is not rebuilt while typing
- rail is outside the cell and does not overlap content

## Tests

- edit mode unit tests
- focus state tests
- browser focus e2e
- desktop/mobile rail layout check

## Do Not

- do not recreate all cell DOM nodes while typing
- do not put rail controls inside cell content
