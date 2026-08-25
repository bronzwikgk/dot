# Shared Entity validator Log

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
## 2026-08-25 Banned Vocabulary Update

- Expanded banned vocabulary checks across entity, relationship, operation,
  safe-name, and approved-word validation.
- Banned checks now tokenize snake_case values so longer names containing a
  banned token are rejected.

## 2026-08-25 Dataset And Schema Pass

- Added dataset group validation and dataset report creation methods.
- Added enum-field, schema-record, and entity-against-schema validation methods.
- Added relationship graph validation with duplicate id, missing target, invalid relationship, and dependency cycle checks.
- Allowed the `banned_words` dataset group to report its own blocked terms without failing that group for vocabulary content.
