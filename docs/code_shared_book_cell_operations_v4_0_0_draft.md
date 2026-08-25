# Shared Book Cell Operations Utility

## File

`code/utilities/code_shared_book_cell_operations_v4_0_0_draft.js`

## What It Is

The shared book cell operations utility creates and changes book and cell
entities through `action_entity`.

## What It Does

It exposes:

- `create_book(config)`
- `create_cell(config)`
- `update_cell(config)`
- `move_cell(config)`
- `remove_cell(config)`
- `execute_cell(config)`
- `clear_cell_output(config)`

## When To Use It

Use it when an application surface needs notebook-style books and cells without
creating a separate book manager or cell manager plugin.

## Runtime Contract

- Books and cells are stored as entities.
- Cell order is stable after move and remove.
- Markdown, natural language, and code cells produce output records.
- Code cell execution requires explicit confirmation.
- Every operation writes an audit record.
- Every result returns `{ ok, data, errors }`.

## How It Was Tested

Focused Node tests cover book creation, cell creation, update, move, remove,
output creation, output clearing, confirmation for code cells, and audit record
creation.
