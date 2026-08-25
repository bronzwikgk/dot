# Shared Entity Validator Log

## 2026-08-25

Promoted entity validation utility from `scratchpad_entity_system/code`.

### Added

- Entity validation.
- Raw input validation.
- Relationship validation.
- Relationship type validation.
- Lifecycle status validation.
- Approved vocabulary validation.
- UI vocabulary validation.
- Operation validation.
- Safe snake_case name validation.
- Banned-name validation.
- Near-duplicate suggestions.

### Decision

Keep as a utility because plugins should call it rather than duplicating
validation rules.

### Verification

- Module import from promoted path passed.
- Safe-name and banned-name smoke checks passed.
- Relationship type smoke check passed.
