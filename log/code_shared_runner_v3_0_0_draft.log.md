# Shared runner Utility Log

## 2026-08-24

Completed focused utility pass for `code/plugins/code_shared_runner_v3_0_0_draft.js`.

### Issues Fixed

- Inline plans passed directly to `run()` did not infer `kind`, while registered plans did.
- DAG topological sorting did not reject missing task IDs.
- DAG topological sorting did not reject duplicate task IDs.
- DAG topological sorting did not reject missing dependencies.
- DAG topological sorting did not detect dependency cycles.

### Verification

Ran focused Node checks for:

- Inline AST plan execution.
- validator-backed AST conditions.
- Registered AST plan execution.
- `nextMap` routing.
- DAG cycle rejection.
- Missing dependency rejection.
- Duplicate task ID rejection.
- Missing task ID rejection.
- Dependency-before-dependent sort order.
- DAG task input resolution from config and task output.

Result:

```text
runner checks passed
```

### Commit

The runner code changes were pushed in an earlier mixed commit through GitHub Desktop.

Documentation/log repair commit message:

```text
Document shared runner utility
```

Push is handled by the user through GitHub Desktop.

## 2026-08-25

- Renamed class references to snake_case naming standard where applicable.

## 2026-08-25

- Fixed DAG execution so unknown task types or actions throw `[SYS-06]` instead of returning an error object as a successful result.
