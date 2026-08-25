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

- Added `code_inspector` class with constructor/config shape.
- Added mixed-case instance methods.
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

## 2026-08-24 Snake Case Naming Follow-Up

Renamed the public class API and instance methods to follow the snake_case-only project convention.

```text
code inspector class renamed to `code_inspector`
inspection methods renamed to `inspect_source*`
parameter parser method renamed to `parse_params`
top-level splitter method renamed to `split_top_level`
```

## 2026-08-25

- Renamed class references to snake_case naming standard where applicable.

## 2026-08-25

- Fixed legacy inspection for `export default class`, including anonymous default classes, so constructor test plans can be generated.

## 2026-08-25 Quality Follow-Up

- Copied detected module-level mutable state into each function record as `traits.has_module_state`.
- Set `traits.declared_at_module_depth` for AST-inspected module functions.
- Resolved AST method containers from containing class ranges instead of a fragile class stack only.
- Renamed the old parser marker to `inspection_mode`.
- Excluded nested functions from the top-level AST function inventory.

## 2026-08-25 - ESM Parser And Export Metadata Follow-Up

- Fixed Acorn loading under ESM by using Node `createRequire`.
- Added class export target metadata so constructor exports and public method names are tracked separately.
- Fixed named ESM class export detection so method plans are not dropped.
- Fixed CJS default-object class export detection for `module.exports = { default: ClassName }`.
- Validated through focused ESM regression tests and full generated test suite.
