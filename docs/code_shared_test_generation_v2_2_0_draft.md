# Shared Test Generation Utility

## File

`code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js`

## What It Is

The test generation utility is the third stage of the generic JavaScript/Node.js testing pipeline. It converts inferred signatures plus template/sample/edge banks into a generated `node:test` file.

It generates safety, regression, and behavioral checks. Without a contract file, it should not claim deep correctness.

## What It Does

The utility exposes a class API:

- `new test_generator(config)`
- `generator.generate_test_plan(signatures, template_bank_strings, sample_bank_strings, options)`
- `generator.render_test_file(plan, require_path, snapshot_path, options)`
- `generator.parse_template_entry(entry_text)`
- `generator.parse_sample_entry(entry_text)`
- `generator.summarize_plan(units)`
- `generator.should_include_signature(signature, options)`

It also keeps the older compatibility functions:

- `generate_test_plan(signatures, template_bank_strings, sample_bank_strings, options)`
- `render_test_file(plan, require_path, snapshot_path, options)`
- `parse_template_entry(entry_text)`
- `parse_sample_entry(entry_text)`
- `summarize_plan(units)`
- `should_include_signature(signature, options)`

Generated tests can cover:

- Determinism.
- Immutability.
- Snapshot regression.
- Edge safety.
- Constructor availability.

## Improvements In This Pass

- Added ESM exports while keeping the existing global API.
- Generated tests are async-aware.
- Calls are awaited, so async target functions are handled.
- Class constructors get explicit constructor test units.
- Edge-safety tests now report unexpected thrown values more clearly.
- Generated plans include a `summary` with unit/case counts.
- Sample bank was expanded with richer values, function samples, mixed arrays, and objects.
- Public-target selection is stricter: private/internal methods are skipped, class methods are generated only for class-style targets, and constructors are generated only when the class is targetable.
- Stateful method names such as `create`, `update`, `delete`, and `query` avoid determinism/snapshot properties.
- Plan summaries avoid prototype-key collisions such as the `constructor` key.
- Added `test_generator` class export with constructor/config style while preserving existing function exports.
- Sample fallback selection now guards entries with missing `type` values.

## When To Use It

Use it to generate baseline tests for JavaScript utilities and Node modules.

Good use cases:

- Smoke tests.
- Safety tests.
- Regression tests.
- Broad generated coverage before adding hand-written contract tests.

Avoid using it alone to claim full correctness.

## How It Was Tested

A fixture pipeline inspected source containing:

- Exported function.
- Exported async function.
- Exported class.
- Constructor.
- Method that can throw.

Then it inferred signatures, generated a plan, rendered an ESM test file, and asserted:

- Plan summary exists.
- Constructor unit exists.
- Edge-safety cases exist.
- Rendered tests are async.
- Rendered tests include constructor handling.

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

1. Keep generated tests deterministic for identical inputs.
2. Test rendered output strings after changing the harness.
3. Keep CJS and ESM render paths aligned.
4. Update sample/edge/template banks when adding new inferred types.
5. Keep global API and ESM exports in sync.
6. Update the matching log in `log/code_shared_test_generation_v2_2_0_draft.log.md`.

## Known Limits

- Correctness contracts are not implemented yet.
- Snapshots are regression checks, not proof of correctness.
- Constructor tests use generated sample arguments.
- Edge-safety tests allow normal `Error`, `TypeError`, and `RangeError`.
- Generated tests do not mock filesystem, network, process, or global side effects.
- Stateful method detection is name-based and conservative.
