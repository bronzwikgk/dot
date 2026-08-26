# Shared Signature Inference Utility

## File

`code/utilities/test_generation/code_shared_signature_inference_v2_2_0_draft.js`

## What It Is

Signature inference is the second stage of the generic JavaScript test-generation pipeline. It takes function records from the code inspector and infers likely parameter types, return type, confidence, and behavioral archetype.

It is heuristic. It helps generate useful tests, but it does not prove correctness by itself.

## What It Does

The utility exposes a class API:

- `new signature_inferencer(config)`
- `inferencer.infer_signature(fn_record)`
- `inferencer.infer_signatures(fn_records)`
- `inferencer.classify_archetype(name, param_types, return_type)`
- `inferencer.normalize_type_token(raw_type)`
- `inferencer.infer_return_from_source(fn_record)`

It also keeps the older compatibility functions:

- `infer_signature(fn_record)`
- `infer_signatures(fn_records)`
- `classify_archetype(name, param_types, return_type)`
- `normalize_type_token(raw_type)`
- `infer_return_from_source(fn_record)`

It uses:

- JSDoc tags.
- Parameter names.
- Default values.
- Function names.
- Simple return-source patterns.

## Improvements In This Pass

- Added ESM exports while keeping the existing global API.
- Constructor records are now preserved for generated constructor tests.
- Added simple body-based return inference from return statements.
- `infer_signatures(null)` safely returns an empty list.
- Added `signature_inferencer` class export with constructor/config style while preserving existing function exports.

## When To Use It

Use this utility after code inspection and before test generation.

Good use cases:

- Choosing sample inputs.
- Choosing generated test templates.
- Classifying functions as string transforms, array transforms, numeric functions, predicates, and so on.

Avoid treating inference as a contract. It is a best-effort guess.

## How It Was Tested

Fixture checks verified:

- JSDoc return type wins.
- Async traits survive from inspector records.
- Constructor records are included.
- Source return inference recognizes array-returning patterns.
- Output feeds into generated plans.
- Module-state traits from inspection are preserved on inferred signatures.
- `ArrayBuffer` is no longer normalized as `array<any>`.
- Rest parameters are inferred as `array<any>`.

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

1. Keep inference deterministic.
2. Prefer JSDoc over heuristics.
3. Add tests for new type/archetype rules.
4. Keep global API and ESM exports in sync.
5. Update the matching log in `log/code_shared_signature_inference_v2_2_0_draft.log.md`.

## Known Limits

- It is name/body heuristic based.
- It does not execute code.
- It does not perform full data-flow or type analysis.
