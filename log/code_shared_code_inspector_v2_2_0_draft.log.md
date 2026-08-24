# Shared Code Inspector Utility Log

## 2026-08-24

Completed focused pass as part of the test-generation subsystem.

### Issues Fixed

- No ESM named/default exports.
- Legacy parser skipped constructors.
- Legacy parser missed `export function` and `export async function`.
- Legacy parser did not mark `export class` as a class-style export.
- Legacy parser missed ESM named export lists.
- One-line function/method slices could include following lines.

### Verification

Ran fixture-style subsystem check.

Result:

```text
test_generation checks passed
```

Generated tests were then rendered for the updated shared utilities and executed with Node:

```text
826 tests
826 pass
0 fail
```

### Commit

Local commit message:

```text
Improve shared test generation subsystem
```

## 2026-08-24 Class API Follow-Up

Updated the inspector to match the shared utility design pattern:

- Added `CodeInspector` class with constructor/config shape.
- Added camelCase instance methods.
- Kept existing snake_case function exports for compatibility.

### Verification

Ran a direct class API smoke test, then ran the test-generation utility on itself and on the shared utilities.

```text
test_generation class API checks passed

474 self-tests
474 pass

1300 generated shared-utility tests
1300 pass
0 fail
```
