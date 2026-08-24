# Shared Code Inspector Utility Log

## 2026-08-24

Completed focused pass as part of the test-generation subsystem.

### Issues Fixed

- No ESM named/default exports.
- Legacy parser skipped constructors.
- Legacy parser missed `export function` and `export async function`.
- Legacy parser did not mark `export class` as a class-style export.
- One-line function/method slices could include following lines.

### Verification

Ran fixture-style subsystem check.

Result:

```text
test_generation checks passed
```

### Commit

Local commit message:

```text
Improve shared test generation subsystem
```
