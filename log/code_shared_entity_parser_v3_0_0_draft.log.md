# Shared Entity Parser Log

## 2026-08-25

Promoted simple entity intent parser from `scratchpad_entity_system/code`.

### Added

- Text tokenization.
- Simple create intent parsing.
- Simple link intent parsing.
- Filler-word skipping for names.

### Fix Before Promotion

- `create entity called invoice` now resolves name `invoice` instead of
  `called`.

### Decision

Keep as a utility and treat it as an early parser only. Full An App language
behavior belongs in later parser work.

### Verification

- Module import from promoted path passed.
- Parser smoke checks passed for create commands with `called`, `named`, and
  direct names.
