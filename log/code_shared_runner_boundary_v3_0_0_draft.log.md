# Shared Runner Boundary Log

## 2026-08-25

Compared the existing shared workflow runner with the promoted entity runner.

### Decision

Keep both.

### Rationale

- Existing runner owns named plans, AST steps, DAG tasks, conditions, nested
  flows, budgets, sessions, and task sorting.
- Entity runner owns small ordered stage pipelines with diagnostics and timing.
- Merging now could change the existing runner contract before entity-system
  tests exist.

### Follow-Up

Reconsider merge after entity runner tests exist and the shared runner can offer
a simple stage-runner mode without breaking existing tests.
