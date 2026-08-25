# Shared Entity Behavior Datasets Log

## 2026-08-25

Promoted behavior mapping datasets from `scratchpad_entity_system/code`.

### Added

- Trait-to-operation pairs.
- Type-to-trait pairs.

### Decision

Keep as dataset maps so behavior can be derived from approved vocabulary rather
than hardcoded branching.

### Verification

- Module import from promoted path passed.
- Cross-reference check confirmed pairs point to approved types, traits, and
  operations.
