# Major 002 Contract: ESM Class Methods In Test Plan

Status: completed
Owner: agent_codex_an_app
Priority: p0
Related modules: `code_inspector`, `test_generator`

## Project Context

Generated tests must cover class methods, not only constructors. In An App terms, each utility/plugin class exposes entity operations through methods; dropping methods creates false confidence.

## Problem

Named ESM class detection mixed the constructor export name with callable method names. `should_include_signature()` then excluded methods, producing constructor-only plans.

## Required Behavior

- `export_target` stores the class constructor export.
- `exported_names` stores public callable methods for class-style exports.
- Public methods are included unless intentionally private by leading underscore.
- Constructor plan remains included.

## Where To Work

- `code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js`
- `code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js`
- `.testgen/run_generated_tests.mjs`
- `.testgen/run_testgen_self_tests.mjs`

## Seed Example

```js
export class sample_box {
  constructor(config = {}) { this.config = config; }
  add(value) { return value + 1; }
  remove(value) { return value - 1; }
}
```

Expected plan units:

- constructor
- `add`
- `remove`

## Do

- Keep class constructor target separate from method names.
- Keep snake_case names.
- Use focused assertions against plan units.

## Do Not

- Do not treat the class name as a method.
- Do not allow constructor-only plans for public-method classes.
- Do not add similar names for the same export concept without authorization.

## Validation

```powershell
node --test test\test_generation_esm_regression.test.mjs
node .testgen\run_generated_tests.mjs
node --test .testgen\*.test.mjs
```
