# Shared Entity runner Log

## 2026-08-25

Promoted lightweight stage runner from `scratchpad_entity_system/code`.

### Added

- Configured stage order.
- Stage registration.
- Sequential stage execution.
- Timing records.
- Diagnostics.
- Stop-on-error behavior.

### Decision

Keep separate from the existing shared workflow runner for now. The existing
runner remains responsible for AST plans, DAG tasks, conditions, nested flows,
budgets, and sessions.

### Verification

- Module import from promoted path passed.
- Two-stage smoke check passed during scratchpad evaluation.

## 2026-08-25

- Fixed default run behavior so registered stages execute when no explicit stage list is provided. Separated allowed stage names from default requested stages.
