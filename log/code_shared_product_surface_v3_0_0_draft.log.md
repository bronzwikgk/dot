# Shared Product Surface Plugin Log

Date: 2026-08-25
Agent: agent_codex_an_app
Status: draft

## Change

Created the product surface documentation and log pair. Updated the visible
browser surface to declare `an_app_mount` and write `__an_app_boot_marker__`
states.

## Reason

V4 needs browser boot evidence before the visible application builder can be
treated as production-grade. The mount target and boot marker connect the static
surface to the browser runtime validation contract.

## Validation

- Focused visible product surface tests passed.
- Focused browser runtime tests passed.
- Full `node --test` passed.

## 2026-08-25 V4 Search Surface Update

- Added visible workspace search input, clear button, result count, search hit
  markers, and active hit cycling.
- Kept browser controller class-method-only to match existing visible surface
  tests.
- Focused search/status and visible surface tests passed.

## 2026-08-25 V4 Browser Command Wiring Update

- Added browser command records for Run, search-next, and clear-search actions.
- Routed click, command input Enter, global Ctrl+Enter, search Enter, and Escape
  through command resolution.
- Kept the shared command registry utility as the source contract and mirrored
  the same record shape in the static browser controller.

## 2026-08-25 V4 Browser E2E Update

- Added visible notebook cell workspace with rail, textarea editor, output, and
  focus restore.
- Added Playwright Chromium e2e tests for boot readiness, page errors, search,
  keyboard execution, focus preservation, desktop rail layout, and mobile
  layout.

## 2026-08-25 V4 Run-All UI Update

- Added `run_all` browser command record and cell rail button.
- Added DAG-shaped run-all plan with parse, execute, and render tasks.
- Added browser e2e coverage for Ctrl+Shift+Enter run-all execution.

## 2026-08-25 V4 Layout Parity Update

- Added product-surface layout validation, rendering, switching, and comparison
  methods.
- Added browser renderers and tabs for notebook, code editor, block editor,
  tree, table, board, calendar, timeline, diagram, and dashboard.
- Added tests proving same source entity id preservation and no mutation during
  layout switching.

## 2026-08-25 V4 Persistence Update

- Added browser storage selftest, workspace save/load, reload restoration, and
  storage failure status reporting.
- Added version checkpoint based Ctrl+Z/Ctrl+Y undo and redo for the active
  cell editor.
- Added browser e2e coverage for cell persistence after reload and undo/redo.
