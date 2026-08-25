# Shared UI Word Datasets Log

## 2026-08-25

Promoted UI vocabulary datasets from `scratchpad_entity_system/code`.

### Added

- Approved UI names for layouts, panels, views, cells, editor surfaces, render
  profiles, UI actions, accessibility roles, and template ids.

### Decision

Keep UI vocabulary separate from core vocabulary so interface names do not
pollute the entity core.

### Verification

- Module import from promoted path passed.
- Duplicate and empty word-array check passed.

## 2026-08-25 Quality Follow-Up

- Added `validate_ui_word_dataset_arrays(groups)` for programmatic duplicate and invalid-value checks.

## 2026-08-25 V4 Command Update

- Added approved GUI action name `run_all`.
- Reason: V4 browser surface needs notebook-wide execution routed through the
  same command registry conventions as single-cell execution.
- Verification: focused cell command language and browser e2e tests passed.
