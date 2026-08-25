# Major 001 Contract: ESM Acorn Loader

Status: completed
Owner: agent_codex_an_app
Priority: p0
Related module: `code_inspector`

## Project Context

An App uses generated tests to evaluate utilities and plugins. The code inspector must use the strongest available parser because generated tests depend on accurate entity, class, method, export, and module-state inventory.

## Problem

Under `type: module`, plain CommonJS loading is unavailable. If Acorn cannot be loaded, ESM consumers silently fall back to the weaker legacy parser and AST-only fixes do not apply.

## Required Behavior

- Acorn must be reachable from ESM.
- If Acorn exists, `inspect_source_auto()` must return `inspection_mode: "acorn"` for parseable JavaScript.
- If Acorn is missing or parsing fails, fallback behavior must remain available.
- Parser loading must not execute inspected source text.

## Where To Work

- `code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js`
- `package.json`
- `package-lock.json`
- `test/test_generation_esm_regression.test.mjs`

## Seed Example

```js
export class sample_box {
  constructor(config = {}) { this.config = config; }
  add(value) { return value + 1; }
}
```

Expected:

- `inspection_mode` is `acorn`.
- class and method records are inventoried.

## Do

- Use `createRequire` under ESM.
- Add Acorn as an explicit development dependency when not vendored.
- Keep fallback behavior.
- Add focused regression tests.

## Do Not

- Do not execute inspected source.
- Do not hide fallback use when Acorn is expected.
- Do not introduce new parser names without user authorization.

## Validation

```powershell
node --test test\test_generation_esm_regression.test.mjs
node --test .testgen\*.test.mjs
```
