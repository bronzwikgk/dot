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
