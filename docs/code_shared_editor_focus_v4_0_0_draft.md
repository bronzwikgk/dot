# Shared Editor Focus Utility

## File

`code/utilities/code_shared_editor_focus_v4_0_0_draft.js`

## What It Is

The shared editor focus utility tracks edit mode, command mode, active cell
focus, and cell row layout validation.

## What It Does

It exposes:

- `enter_edit_mode(config)`
- `exit_edit_mode(config)`
- `capture_focus(config)`
- `restore_focus(config)`
- `sync_cell_view(config)`
- `validate_cell_row_layout(config)`

## When To Use It

Use it when a browser surface needs to preserve editor focus while rerendering
cell rows, or when keyboard behavior depends on whether the user is editing.

## Runtime Contract

- `Ctrl+S` is handled only in edit mode.
- `Escape` exits edit mode.
- Active cells are not marked for rebuild while the user is editing them.
- Cell rail controls must remain outside cell content.
- Every result returns `{ ok, data, errors }`.

## How It Was Tested

Focused Node tests cover edit mode, command mode, keyboard handling, focus
capture/restore, render preservation, and rail layout validation.
