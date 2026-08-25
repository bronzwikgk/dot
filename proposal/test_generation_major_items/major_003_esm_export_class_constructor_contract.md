# Major 003 Contract: ESM Export Class Constructor Rendering

Status: completed
Owner: agent_codex_an_app
Priority: p0
Related module: `test_generator`

## Project Context

Generated tests instantiate exported class utilities/plugins. Constructor tests must target the class export, not a method export.

## Problem

For named ESM class exports, rendered tests built `__ctor` from the first exported name. When the first exported name was a method such as `add`, constructor tests attempted `new mod["add"]()`.

## Required Behavior

- ESM class constructor rendering must prefer `mod.default`.
- If no default exists, it must use `mod[export_target]`.
- It must not use a method name as constructor target.

## Where To Work

- `code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js`
- generated test plans
- generated manifest

## Seed Example

```js
export class sample_box {
  constructor(config = {}) { this.config = config; }
  add(value) { return value + 1; }
}
```

Expected rendered constructor expression:

```js
mod.default || mod["sample_box"] || mod
```

## Do

- Propagate `export_target`.
- Verify generated source includes the expected constructor expression.
- Keep method invocation through instance methods.

## Do Not

- Do not derive constructor target from method list.
- Do not rename public APIs without updating docs/log/tests.

## Validation

```powershell
node --test test\test_generation_esm_regression.test.mjs
node --test .testgen\*.test.mjs
```
