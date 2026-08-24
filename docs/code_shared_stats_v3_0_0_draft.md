# Shared Stats Utility

## File

`code/utilities/code_shared_stats_v3_0_0_draft.js`

## What It Is

The shared stats utility provides small statistical calculations for shared runtime and evaluation code:

- Mean.
- Population standard deviation.
- Standard error.
- Confidence interval.
- Weighted mean.
- Z-score.
- Batch z-score normalization.

It is intentionally lightweight and dependency-free.

## What It Does

`StatsUtil` exposes:

- `mean(values)`
- `standardDeviation(values)`
- `standardError(stdDev, sampleSize)`
- `confidenceInterval(mean, standardError)`
- `weightedMean(values, weights)`
- `zScore(rawValue, mean, stdDev)`
- `zScoreBatch(values, mean, stdDev)`

Compatibility aliases:

- `execute(values)` calls `mean(values)`.
- `executeBatch(values, mean, stdDev)` calls `zScoreBatch(values, mean, stdDev)`.

## When To Use It

Use this utility when code needs simple descriptive statistics without pulling in a larger math package.

Good use cases:

- Summarizing evaluation scores.
- Computing confidence intervals over aggregated measurements.
- Normalizing small numeric arrays.
- Calculating weighted averages.
- Utility-level tests or reporting.

Avoid using it for:

- Full statistical modeling.
- Large numeric arrays requiring optimized vectorization.
- Sample standard deviation when the caller expects `n - 1` correction.
- Distribution-specific confidence intervals beyond a configurable z-critical multiplier.

## Configuration

Create with defaults:

```js
const stats = new StatsUtil();
```

Default:

```js
zCritical: 1.96
```

Custom z-critical:

```js
const stats = new StatsUtil({ zCritical: 1.645 });
```

Explicit `0` is preserved:

```js
const stats = new StatsUtil({ zCritical: 0 });
```

## Examples

Mean:

```js
stats.mean([1, 2, 3]);
// 2
```

Population standard deviation:

```js
stats.standardDeviation([2, 4]);
// 1
```

Standard error:

```js
stats.standardError(4, 16);
// 1
```

Confidence interval:

```js
stats.confidenceInterval(10, 2);
// { lower: 6.08, upper: 13.92, midpoint: 10, width: 7.84 }
```

Weighted mean:

```js
stats.weightedMean([10, 20], [1, 3]);
// 17.5
```

Z-score:

```js
stats.zScore(12, 10, 2);
// 1
```

Batch z-score:

```js
stats.zScoreBatch([8, 10, 12], 10, 2);
// [-1, 0, 1]
```

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `new StatsUtil()` must work with no config.
- `zCritical` should use `1.96` only when missing, not when explicitly set to `0`.
- `mean(null)` and `mean([])` return `0`.
- `standardDeviation()` returns population standard deviation, dividing by `n`.
- `standardDeviation(null)` and arrays shorter than 2 return `0`.
- `standardError()` returns `0` for non-positive sample sizes.
- `weightedMean()` returns `0` for missing arrays, mismatched lengths, or zero total weight.
- `zScore()` returns `0` when standard deviation is `0`.
- `zScoreBatch(null)` and `zScoreBatch([])` return `[]`.
- Methods should not mutate input arrays.

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
node --input-type=module -e "import assert from 'node:assert/strict'; import {StatsUtil} from './code/utilities/code_shared_stats_v3_0_0_draft.js'; const s=new StatsUtil(); assert.equal(s.mean([1,2,3]),2); assert.equal(s.mean([]),0); assert.equal(s.execute([2,4]),3); assert.equal(s.standardDeviation([2,4]),1); assert.equal(s.standardDeviation([1]),0); assert.equal(s.standardError(4,16),1); assert.equal(s.standardError(4,0),0); assert.deepEqual(s.confidenceInterval(10,2),{lower:6.08,upper:13.92,midpoint:10,width:7.84}); assert.equal(s.weightedMean([10,20],[1,3]),17.5); assert.equal(s.weightedMean([10],[1,2]),0); assert.equal(s.weightedMean([10,20],[0,0]),0); assert.equal(s.zScore(12,10,2),1); assert.equal(s.zScore(12,10,0),0); assert.deepEqual(s.zScoreBatch([8,10,12],10,2),[-1,0,1]); assert.deepEqual(s.zScoreBatch(null,10,2),[]); const zero=new StatsUtil({zCritical:0}); assert.equal(zero.confidenceInterval(10,2).width,0); console.log('stats checks passed');"
```

Expected output:

```text
stats checks passed
```

## How To Update It

When updating this utility:

1. State whether any deviation formula is population or sample based.
2. Add focused checks for null, empty, and zero-denominator cases.
3. Preserve compatibility aliases unless callers are updated in the same utility pass.
4. Test explicit zero config values when adding config fields.
5. Update this document with any new method, formula, or config field.
6. Update the matching maintenance log in `log/code_shared_stats_v3_0_0_draft.log.md`.
7. Commit only stats code, stats docs, and stats log for the stats utility pass.

## Known Limits

- `standardDeviation()` uses population variance, not sample variance.
- Numeric inputs are assumed to already be numbers.
- No special handling is provided for `NaN`, `Infinity`, or numeric strings.
- Confidence interval math uses the configured z-critical multiplier directly.
