# Shared validator Utility Log

## 2026-08-24

Completed first focused utility pass for `code/plugins/code_shared_validator_v3_0_0_draft.js`.

### Issues Fixed

- `validate(null, schema)` could throw because schema checks accessed fields on `data` directly.
- Compound rules passed by the runner, such as `{ type: "and", conditions: [...] }`, were not implemented.
- String conditions containing comparison operators with `=`, such as `>=` and `<=`, evaluated incorrectly.
- Structured rule operators were missing `!=`, `!==`, `>=`, and `<=`.
- VM condition execution had no timeout.

### Verification

Ran focused Node checks for:

- Null payload schema validation.
- Compound `and`, `or`, and `not` rules.
- Structured `>=` and `!==` comparisons.
- String condition `<=` comparison.

Result:

```text
validator checks passed
```

### Commit

Local commit message:

```text
Fix shared validator rule evaluation
```

Push is handled by the user through GitHub Desktop.

## 2026-08-25

- Renamed class references to snake_case naming standard where applicable.

## 2026-08-25 Quality Follow-Up

- Added built-in string format validation for `email`, `url`, and `date`.
- Preserved falsy resolved values such as `0` and `false`.
- Removed the private `_resolve_value` alias from the class surface.

## 2026-08-25 Snake Case API Pass

- Renamed public methods to `evaluate_rule()` and `resolve_value()`.
- Renamed string length schema keys to `min_length` and `max_length`.

## 2026-08-25 Lock-Down Pass

- Added enum property validation.
- Guarded rule evaluation and path resolution against missing context.
- Guarded malformed property schemas from becoming runtime TypeErrors.
- Made VM condition error logging opt-in with `log_vm_errors`; failed condition execution still evaluates to false.
