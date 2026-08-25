# Shared Collection Utility Log

## 2026-08-24

Completed focused utility pass for `code/utilities/code_shared_collection_v3_0_0_draft.js`.

### Issues Fixed

- `new collection_util()` could crash because constructor defaults did not normalize `config` before reading fields.
- `seed` was stored but not used, so shuffled train/test splits could not be reproduced.

### Verification

Ran focused Node checks for:

- Default constructor behavior.
- Default train/test ratios.
- Array concatenation.
- Matrix flattening.
- Safe slicing.
- Window extraction.
- Sliding windows.
- Invalid window-size rejection.
- Predicate filtering.
- Range filtering.
- Train/test splitting.
- Train/test splitting with labels.
- Seeded shuffle reproducibility.
- Confirmation that seeded shuffle changes default ordered indices.

Result:

```text
collection checks passed
```

### Commit

Local commit message:

```text
Complete shared collection utility
```

Push is handled by the user through GitHub Desktop.

## 2026-08-25

- Renamed class references to snake_case naming standard where applicable.

## 2026-08-25

- Fixed deterministic split config so seed `0` is preserved instead of being treated as missing.
