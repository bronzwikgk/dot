# Major 004 Contract: CJS Default Object Class Constructor

Status: completed
Owner: agent_codex_an_app
Priority: p0
Related modules: `code_inspector`, `test_generator`

## Project Context

Some CommonJS modules export a class through an object default key. The test generator must still construct the class so shared utilities/plugins can be tested consistently across module styles.

## Problem

`module.exports = { default: ClassName }` was detected as a named object. Constructor tests were dropped or could not find a class constructor.

## Required Behavior

- Inspector detects default-object class exports as class-style exports.
- `export_target` is `default`.
- Renderer uses `mod.default || mod` for CJS class construction.
- Constructor unit is included.

## Where To Work

- `code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js`
- `code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js`
- `test/test_generation_esm_regression.test.mjs`

## Seed Example

```js
class cjs_box {
  constructor(config = {}) { this.config = config; }
  add(value) { return value; }
}
module.exports = { default: cjs_box };
```

Expected:

- `export_style` is `class`.
- `export_target` is `default`.
- rendered constructor line includes `mod.default || mod`.

## Do

- Detect the class identifier behind `default`.
- Keep named-object behavior for non-class object exports.
- Add regression coverage.

## Do Not

- Do not drop constructor tests.
- Do not classify every object default export as class without confirming the target is a class.

## Validation

```powershell
node --test test\test_generation_esm_regression.test.mjs
node --test .testgen\*.test.mjs
```
