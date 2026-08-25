# Shared Entity Registry Log

## 2026-08-25

Promoted entity registry utility from `scratchpad_entity_system/code`.

### Added

- Trait registration.
- Type registration.
- Trait description.
- Type description.
- Operation lookup by type.
- Type existence checks.

### Decision

Keep as a utility because it is a shared lookup layer used by entity plugins and
validators.

### Verification

- Module import from promoted path passed.
- Dataset cross-reference check confirmed mapped traits, types, and operations
  exist in approved datasets.
