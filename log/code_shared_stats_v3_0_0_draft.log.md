# Shared Stats Utility Log

## 2026-08-24

Completed focused utility pass for `code/utilities/code_shared_stats_v3_0_0_draft.js`.

### Issues Fixed

- `new stats_util({ z_critical: 0 })` incorrectly fell back to `1.96` because config used `||`.
- Constructor did not declare a default config parameter.
- `z_score_batch(null, mean, std_dev)` could throw because it read `values.length`.

### Verification

Ran focused Node checks for:

- Default constructor behavior.
- Mean and `execute()` alias.
- Empty mean behavior.
- Population standard deviation.
- Standard deviation with fewer than two values.
- Standard error and zero sample size.
- Confidence interval shape and values.
- Weighted mean.
- Weighted mean mismatch and zero-weight behavior.
- Z-score and zero standard deviation.
- Batch z-score.
- Null batch z-score behavior.
- Explicit zero `z_critical` behavior.

Result:

```text
stats checks passed
```

### Commit

Local commit message:

```text
Complete shared stats utility
```

Push is handled by the user through GitHub Desktop.

## 2026-08-25

- Renamed class references to snake_case naming standard where applicable.

## 2026-08-25 Snake Case API Pass

- Renamed stats helpers to `standard_deviation()`, `standard_error()`, `confidence_interval()`, `weighted_mean()`, `z_score()`, `z_score_batch()`, and `execute_batch()`.
- Renamed confidence config/state to `z_critical`.
