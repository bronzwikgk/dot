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
- `next_map` routing.
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
- Added banned vocabulary checks for plan names, step ids/actions, task
  ids/types/actions, subflow names, and dependency ids.

## 2026-08-25 Quality Follow-Up

- Preserved `terminated` status instead of overwriting it as completed.
- Allowed `next_map.undefined` routing for steps with no produced output.
- Added fallback mustache-style input resolution when no validator is injected.

## 2026-08-25 Snake Case API Pass

- Renamed public methods to `register_plan()`, `topological_sort()`, and `get_sessions()`.
- Migrated runner plan fields to `step_id`, `next_map`, and `step_outputs`.
- Runner action hosts now use `execute_action()`.

## 2026-08-25 Lock-Down Pass

- Invalid AST steps now fail with explicit `[SYS-06]` errors instead of TypeErrors.
- Invalid DAG tasks now fail with explicit `[SYS-06]` errors.
- Input source resolution now tolerates malformed source entries.
- Registration now validates AST/DAG structure before storing a plan.

## 2026-08-25 Documentation Alignment

- Added error codes documentation: `[SYS-04]` (action limit), `[SYS-05]` (depth limit), `[SYS-06]` (validation errors).
- Updated runtime contract to include `[SYS-04]` and `[SYS-05]` guarantees.
- Verified with smoke check: `runner checks passed`.

## 2026-08-25 - Agent Codex An App Naming Follow-Up

- Renamed the constructor input to `config` so the runner code follows the current banned-word and snake_case naming policy.
- No execution behavior or public object shape changed.
- Re-ran generated tests after the update: `1296` passed, `0` failed.
