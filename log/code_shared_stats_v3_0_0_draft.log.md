# Shared Stats Utility Log

## 2026-08-24

Completed focused utility pass for `code/utilities/code_shared_stats_v3_0_0_draft.js`.

### Issues Fixed

- `new StatsUtil({ zCritical: 0 })` incorrectly fell back to `1.96` because config used `||`.
- Constructor did not declare a default config parameter.
- `zScoreBatch(null, mean, stdDev)` could throw because it read `values.length`.

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
- Explicit zero `zCritical` behavior.

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
