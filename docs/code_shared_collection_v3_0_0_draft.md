# Shared Collection Utility

## File

`code/utilities/code_shared_collection_v3_0_0_draft.js`

## What It Is

The shared collection utility provides common array and dataset operations in one class:

- Concatenation.
- Matrix flattening.
- Slicing.
- Fixed-size window extraction.
- Sliding windows.
- Predicate filtering.
- Numeric range filtering.
- Train/test splitting.
- Train/test splitting with labels.
- Optional shuffled splitting with deterministic seeds.

It is intended for shared runtime code and test/data preparation code that needs predictable collection behavior without duplicating small helper functions.

## What It Does

`collection_util` exposes:

- `concat(arrays)`
- `flattenToVector(matrix)`
- `slice(array, start, end)`
- `extractWindow(array, windowSize, position)`
- `slidingWindows(array, windowSize)`
- `filter(items, predicate)`
- `matchesPredicate(item, predicate)`
- `filterByRange(items, field, min, max)`
- `split(data)`
- `splitWithLabels(data, labels)`
- `shuffleArray(array)`

Compatibility aliases:

- `execute(arrays)` calls `concat(arrays)`.
- `executeWithLabels(data, labels)` calls `splitWithLabels(data, labels)`.

## When To Use It

Use this utility when code needs simple, deterministic collection manipulation.

Good use cases:

- Preparing data for tests.
- Creating sliding windows over token or vector arrays.
- Splitting samples into train/test sets.
- Filtering records by simple predicates.
- Flattening matrix-like arrays into vectors.

Avoid using it for:

- Streaming large datasets.
- Deep query languages.
- Joins or grouped aggregations.
- Cryptographically random shuffling.
- Complex stratified machine-learning splits.

## Configuration

Create a utility with defaults:

```js
const collections = new collection_util();
```

Defaults:

- `trainRatio: 0.8`
- `testRatio: 0.2`
- `shuffle: false`
- `seed: null`

Custom configuration:

```js
const collections = new collection_util({
  trainRatio: 0.7,
  shuffle: true,
  seed: 123
});
```

`testRatio` is stored for compatibility and documentation, but `split()` and `splitWithLabels()` currently compute the test set as the remainder after applying `trainRatio`.

## Examples

Concatenate arrays:

```js
collections.concat([[1, 2], [3], []]);
// [1, 2, 3]
```

Slice safely:

```js
collections.slice([1, 2, 3, 4], -2, 3);
// [1, 2, 3]
```

Create sliding windows:

```js
collections.slidingWindows([1, 2, 3], 2);
// [[1, 2], [2, 3]]
```

Filter records:

```js
collections.filter(
  [{ score: 1 }, { score: 3 }],
  { field: "score", operator: "gte", value: 2 }
);
// [{ score: 3 }]
```

Split data:

```js
collections.split(["a", "b", "c", "d"]);
// {
//   train: ["a", "b", "c"],
//   test: ["d"],
//   train_indices: [0, 1, 2],
//   test_indices: [3]
// }
```

Seeded shuffled split:

```js
const splitA = new collection_util({ shuffle: true, seed: 123 }).split(data);
const splitB = new collection_util({ shuffle: true, seed: 123 }).split(data);
// splitA and splitB are identical
```

## Predicate Operators

`matchesPredicate()` and `filter()` support:

- `eq`
- `neq`
- `gt`
- `gte`
- `lt`
- `lte`
- `abs_lt`
- `abs_gt`

Unknown operators return `false`.

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `new collection_util()` must work with no config.
- A configured seed of `0` is a valid deterministic seed and must not be treated
  as missing.
- `concat(null)` returns `[]`.
- `slice(null, start, end)` returns `[]`.
- `slice()` clamps the start and end to valid array bounds.
- `slidingWindows()` throws for non-positive or non-finite window sizes.
- `filter(null, predicate)` returns `[]`.
- Missing predicates match all items.
- `split(null)` returns empty train/test arrays and index arrays.
- `splitWithLabels(null, labels)` returns empty data/label/index arrays.
- Shuffled splits are reproducible when `seed` is set.
- `shuffleArray()` should not mutate its input array.

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
node --input-type=module -e "import assert from 'node:assert/strict'; import {collection_util} from './code/utilities/code_shared_collection_v3_0_0_draft.js'; const c=new collection_util(); assert.equal(c.trainRatio,0.8); assert.equal(c.testRatio,0.2); assert.deepEqual(c.concat([[1,2],[3],[]]),[1,2,3]); assert.deepEqual(c.flattenToVector([[1,2],[3,4]]),[1,2,3,4]); assert.deepEqual(c.slice([1,2,3,4],-2,3),[1,2,3]); assert.deepEqual(c.extractWindow([1,2,3,4],2,1),[2,3]); assert.deepEqual(c.slidingWindows([1,2,3],2),[[1,2],[2,3]]); assert.throws(()=>c.slidingWindows([1,2],0),/positive windowSize/); const rows=[{x:-2,kind:'a'},{x:0,kind:'b'},{x:3,kind:'a'}]; assert.deepEqual(c.filter(rows,{field:'kind',operator:'eq',value:'a'}),[rows[0],rows[2]]); assert.deepEqual(c.filterByRange(rows,'x',-1,3),[rows[1],rows[2]]); assert.deepEqual(c.split(['a','b','c','d']),{train:['a','b','c'],test:['d'],train_indices:[0,1,2],test_indices:[3]}); const c2=new collection_util({trainRatio:0.5}); assert.deepEqual(c2.splitWithLabels(['a','b','c','d'],['A','B','C','D']),{train_data:['a','b'],test_data:['c','d'],train_labels:['A','B'],test_labels:['C','D'],train_indices:[0,1],test_indices:[2,3]}); const s1=new collection_util({shuffle:true,seed:123,trainRatio:0.5}).split(['a','b','c','d','e','f']); const s2=new collection_util({shuffle:true,seed:123,trainRatio:0.5}).split(['a','b','c','d','e','f']); assert.deepEqual(s1,s2); assert.notDeepEqual(s1.train_indices,[0,1,2]); console.log('collection checks passed');"
```

Expected output:

```text
collection checks passed
```

## How To Update It

When updating this utility:

1. Keep method names stable unless all callers are updated in the same utility pass.
2. Add focused checks for every new predicate operator.
3. Test empty input behavior for new collection methods.
4. Test whether methods mutate their inputs.
5. Test seeded and unseeded behavior if shuffle logic changes.
6. Update this document with any new method, operator, config field, or split behavior.
7. Update the matching maintenance log in `log/code_shared_collection_v3_0_0_draft.log.md`.
8. Commit only collection code, collection docs, and collection log for the collection utility pass.

## Known Limits

- `flattenToVector()` expects a matrix-like array and does not guard `null` rows.
- `concat()` expects each child item to be array-like.
- `filter()` supports one predicate at a time.
- Splits are simple ratio splits, not stratified splits.
- Seeded shuffling is deterministic but not cryptographically random.
