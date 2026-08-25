# V4 Contract 003: Book Cell Operations

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_021, v4_missing_022

## Goal

Implement books and cells as entities with create, update, move, remove,
execute, and output operations.

## Required Entities

- book
- cell
- cell_output
- cell_execution
- cell_order

## Required Methods

- create_book(config)
- create_cell(config)
- update_cell(config)
- move_cell(config)
- remove_cell(config)
- execute_cell(config)
- clear_cell_output(config)

## Success Criteria

- book and cell are handled through entity operations
- cell order is stable after move/remove
- natural language, code, and markdown cells produce output records
- unsafe executable cells require explicit confirmation
- all operations produce audit records

## Tests

- book/cell unit tests
- output record tests
- browser books/cells e2e
- executable confirmation tests

## Do Not

- do not create a separate book manager or cell manager plugin
- do not execute imported code cells without confirmation
