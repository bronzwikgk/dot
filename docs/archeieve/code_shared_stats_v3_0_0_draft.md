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

`stats_util` exposes:

- `mean(values)`
- `standard_deviation(values)`
- `standard_error(std_dev, sample_size)`
- `confidence_interval(mean, standard_error)`
- `weighted_mean(values, weights)`
- `z_score(raw_value, mean, std_dev)`
- `z_score_batch(values, mean, std_dev)`

Compatibility aliases:

- `execute(values)` calls `mean(values)`.
- `execute_batch(values, mean, std_dev)` calls `z_score_batch(values, mean, std_dev)`.

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
const stats = new stats_util();
```

Default:

```js
z_critical: 1.96
```

Custom z-critical:

```js
const stats = new stats_util({ z_critical: 1.645 });
```

Explicit `0` is preserved:

```js
const stats = new stats_util({ z_critical: 0 });
```

## Examples

Mean:

```js
stats.mean([1, 2, 3]);
// 2
```

Population standard deviation:

```js
stats.standard_deviation([2, 4]);
// 1
```

Standard error:

```js
stats.standard_error(4, 16);
// 1
```

Confidence interval:

```js
stats.confidence_interval(10, 2);
// { lower: 6.08, upper: 13.92, midpoint: 10, width: 7.84 }
```

Weighted mean:

```js
stats.weighted_mean([10, 20], [1, 3]);
// 17.5
```

Z-score:

```js
stats.z_score(12, 10, 2);
// 1
```

Batch z-score:

```js
stats.z_score_batch([8, 10, 12], 10, 2);
// [-1, 0, 1]
```

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `new stats_util()` must work with no config.
- `z_critical` should use `1.96` only when missing, not when explicitly set to `0`.
- `mean(null)` and `mean([])` return `0`.
- `standard_deviation()` returns population standard deviation, dividing by `n`.
- `standard_deviation(null)` and arrays shorter than 2 return `0`.
- `standard_error()` returns `0` for non-positive sample sizes.
- `weighted_mean()` returns `0` for missing arrays, mismatched lengths, or zero total weight.
- `z_score()` returns `0` when standard deviation is `0`.
- `z_score_batch(null)` and `z_score_batch([])` return `[]`.
- Methods should not mutate input arrays.

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
node --input-type=module -e "import assert from 'node:assert/strict'; import {stats_util} from './code/utilities/code_shared_stats_v3_0_0_draft.js'; const s=new stats_util(); assert.equal(s.mean([1,2,3]),2); assert.equal(s.mean([]),0); assert.equal(s.execute([2,4]),3); assert.equal(s.standard_deviation([2,4]),1); assert.equal(s.standard_deviation([1]),0); assert.equal(s.standard_error(4,16),1); assert.equal(s.standard_error(4,0),0); assert.deepEqual(s.confidence_interval(10,2),{lower:6.08,upper:13.92,midpoint:10,width:7.84}); assert.equal(s.weighted_mean([10,20],[1,3]),17.5); assert.equal(s.weighted_mean([10],[1,2]),0); assert.equal(s.weighted_mean([10,20],[0,0]),0); assert.equal(s.z_score(12,10,2),1); assert.equal(s.z_score(12,10,0),0); assert.deepEqual(s.z_score_batch([8,10,12],10,2),[-1,0,1]); assert.deepEqual(s.z_score_batch(null,10,2),[]); const zero=new stats_util({z_critical:0}); assert.equal(zero.confidence_interval(10,2).width,0); console.log('stats checks passed');"
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

- `standard_deviation()` uses population variance, not sample variance.
- Numeric inputs are assumed to already be numbers.
- No special handling is provided for `NaN`, `Infinity`, or numeric strings.
- Confidence interval math uses the configured z-critical multiplier directly.
