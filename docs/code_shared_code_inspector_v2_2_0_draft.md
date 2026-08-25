# Shared Code Inspector Utility

## File

`code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js`

## What It Is

The code inspector is the first stage of the generic JavaScript test-generation pipeline. It reads JavaScript source text and builds an inventory of declared functions, class methods, constructors, exports, parameters, source slices, and structural traits.

It does not execute the inspected code.

## What It Does

The inspector exposes a class API:

- `new code_inspector(config)`
- `inspector.inspect_source(source_text)`
- `inspector.inspect_source_ast(source_text)`
- `inspector.inspect_source_auto(source_text)`
- `inspector.parse_params(param_text)`
- `inspector.split_top_level(text, separator)`

It also keeps the older compatibility functions:

- `inspect_source(source_text)`
- `inspect_source_ast(source_text)`
- `inspect_source_auto(source_text)`
- `parse_params(param_text)`
- `split_top_level(text, separator)`

`inspect_source_auto()` prefers the Acorn AST parser mode when available and falls back to a legacy line parser.

The returned inventory includes:

- `inspection_mode`
- `classes`
- `export_style`
- `exported_names`
- `has_module_state`
- `functions`

Each function record includes:

- `name`
- `container`
- `kind`
- `params`
- `jsdoc`
- `source`
- `start_line`
- `end_line`
- `traits`

## When To Use It

Use this utility before signature inference or generated testing when you need a static map of a JavaScript file.

Avoid using it as a security scanner or full parser for TypeScript/JSX.

## Improvements In This Pass

- Added ESM exports while keeping the existing global API.
- Legacy parser now includes constructors.
- Legacy parser detects `export class` as class-style exports.
- Legacy parser recognizes `export function` and `export async function`.
- Legacy parser recognizes ESM named export lists such as `export { logger, create_logger }`.
- Legacy parser recognizes `export default class` declarations, including
  anonymous default classes.
- One-line source slices are no longer extended into the following function/method.
- Added `code_inspector` class export with constructor/config style while preserving existing function exports.
- Module-level mutable state is now copied into each function record as
  `traits.has_module_state`.
- AST method containers are resolved from the containing class range, which
  avoids losing outer class names when classes are nested or adjacent.
- `traits.declared_at_module_depth` is set for module-level function records.
- Nested functions are excluded from the top-level function inventory.
- Parser mode is reported as `inspection_mode`; the old parser marker field is
  no longer emitted.

## How It Was Tested

Fixture source with exported functions, async function, exported class, constructor, and method was inspected. Assertions verified:

- Function detection.
- Async function detection.
- Constructor detection.
- Class export detection.
- Compatibility with downstream signature inference and test generation.

Expected output:

```text
test_generation checks passed
```

After the class API update, the test-generation utility was run on itself and on the shared utilities:

```text
474 self-tests
474 pass

1300 generated shared-utility tests
1300 pass
0 fail
```

## How To Update It

When updating:

1. Keep source inspection non-executing.
2. Test both function and class inputs.
3. Test ESM export syntax and class constructors.
4. Keep the global API and ESM exports in sync.
5. Update the matching log in `log/code_shared_code_inspector_v2_2_0_draft.log.md`.

## Known Limits

- TypeScript and JSX are out of scope.
- The legacy parser is convention-based.
- Acorn is an explicit dev dependency for Node ESM test-generation use.

## 2026-08-25 ESM Parser Fix

- Added Node ESM-compatible Acorn loading through `createRequire`.
- Added `acorn` as a dev dependency so the AST parser is reachable during normal ESM test generation.
- Added `export_target` metadata for class-style exports so constructor target selection does not conflict with method names.
- Fixed named ESM class exports so `exported_names` represents public class methods while `export_target` represents the constructor export.
- Fixed `module.exports = { default: ClassName }` detection so CJS default-object class exports are treated as class exports.
- Added focused regression coverage in `test/test_generation_esm_regression.test.mjs`.
