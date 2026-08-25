# Shared Vector Math Utility

## File

`code/utilities/code_shared_vector_math_v3_0_0_draft.js`

## What It Is

The shared vector math utility provides basic vector comparison operations:

- Euclidean distance.
- Cosine similarity.
- Batch Euclidean distance.
- Batch cosine similarity.

It is dependency-free and intended for lightweight ranking, search, deduplication, and numeric comparison tasks in the shared runtime.

## What It Does

`vector_math_util` exposes:

- `distance(vector_a, vector_b)`
- `similarity(vector_a, vector_b)`
- `distance_batch(target_vector, candidate_vectors)`
- `similarity_batch(target_vector, candidate_vectors)`

Compatibility aliases:

- `execute(vector_a, vector_b)` calls `distance(vector_a, vector_b)`.
- `execute_batch(target_vector, candidate_vectors)` calls `distance_batch(target_vector, candidate_vectors)`.

## When To Use It

Use this utility when code needs simple numeric vector comparisons.

Good use cases:

- Ranking candidate embeddings by similarity.
- Measuring numeric feature distance.
- Deduplication passes.
- Lightweight search scoring.
- Small batch comparisons.

Avoid using it for:

- Sparse vector math.
- Weighted metrics.
- Large-scale matrix operations.
- Approximate nearest-neighbor search.
- GPU/vectorized workloads.
- Non-numeric vector validation.

## Examples

Euclidean distance:

```js
const vectors = new vector_math_util();

vectors.distance([0, 0], [3, 4]);
// 5
```

Cosine similarity:

```js
vectors.similarity([1, 0], [1, 0]);
// 1
```

Batch distance:

```js
vectors.distance_batch([0, 0], [[3, 4], [0, 0]]);
// [5, 0]
```

Batch similarity:

```js
vectors.similarity_batch([1, 0], [[1, 0], [0, 1]]);
// [1, 0]
```

## Edge Behavior

The utility returns `0` for:

- Null single-vector inputs.
- Mismatched vector lengths.
- Zero-magnitude cosine inputs.

Batch methods return `[]` for missing or empty candidate lists.

The utility does not mutate input vectors.

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `new vector_math_util()` must work with no config.
- `distance(null, vector)` returns `0`.
- `distance()` returns `0` for mismatched vector lengths.
- `similarity(null, vector)` returns `0`.
- `similarity()` returns `0` for mismatched vector lengths.
- `similarity()` returns `0` when either vector magnitude is zero.
- Batch methods preserve candidate order.
- Batch methods return one numeric result per candidate.
- `distance_batch(target, null)` returns `[]`.
- `similarity_batch(target, null)` returns `[]`.
- Methods should not mutate input arrays.

## Floating-Point Notes

Cosine similarity may return values very close to an expected value rather than exactly equal because JavaScript uses floating-point arithmetic.

For tests, prefer approximate assertions for non-trivial cosine values:

```js
Math.abs(actual - expected) < 1e-12
```

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
node --input-type=module -e "import assert from 'node:assert/strict'; import {vector_math_util} from './code/utilities/code_shared_vector_math_v3_0_0_draft.js'; const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-12); const v=new vector_math_util(); assert.equal(v.distance([0,0],[3,4]),5); assert.equal(v.execute([1,1],[4,5]),5); assert.equal(v.distance(null,[1]),0); assert.equal(v.distance([1,2],[1]),0); near(v.similarity([1,0],[1,0]),1); assert.equal(v.similarity([1,0],[0,1]),0); near(v.similarity([1,1],[2,2]),1); assert.equal(v.similarity([0,0],[1,2]),0); assert.deepEqual(v.distance_batch([0,0],[[3,4],[0,0]]),[5,0]); assert.deepEqual(v.similarity_batch([1,0],[[1,0],[0,1]]),[1,0]); assert.deepEqual(v.execute_batch([0,0],[[3,4]]),[5]); assert.deepEqual(v.distance_batch([0,0],null),[]); assert.deepEqual(v.similarity_batch([1,0],null),[]); console.log('vector_math checks passed');"
```

Expected output:

```text
vector_math checks passed
```

## How To Update It

When updating this utility:

1. Keep return behavior for invalid inputs explicit and documented.
2. Add focused checks for nulls, mismatched lengths, and zero vectors.
3. Use approximate assertions for cosine values where floating-point drift is expected.
4. Test batch methods whenever single-vector behavior changes.
5. Update this document with any new metric, config field, or edge behavior.
6. Update the matching maintenance log in `log/code_shared_vector_math_v3_0_0_draft.log.md`.
7. Commit only vector_math code, vector_math docs, and vector_math log for the vector_math utility pass.

## Known Limits

- Inputs are assumed to be numeric arrays.
- Mismatched lengths return `0` rather than throwing.
- Sparse vectors are not supported.
- Weighted metrics are not supported.
- Batch methods run sequentially.
