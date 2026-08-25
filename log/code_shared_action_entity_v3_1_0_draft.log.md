# Shared Action Entity V3.1.0 Log

## 2026-08-25

Promoted advanced entity plugin from `scratchpad_entity_system/code`.

### Added

- Normalized entity record model.
- Relationship, policy, contract, operation, docs, logs, tags, and metadata fields.
- Lifecycle helpers.
- Batch create, update, and query helpers.
- Relationship helpers.
- Graph validation for missing targets and cycles.
- Diff, version bump, import, and export helpers.

### Decision

Keep alongside `code_shared_action_entity_v3_0_0_draft.js` until generated tests
and focused migration checks are complete.

### Verification

- Module import from promoted path passed.
- Create/read smoke check passed.
- Valid relationship graph passed.
- Missing relationship target failed as expected.

## 2026-08-25

- Added driver compatibility for older `generate_id`/`get_timestamp` hooks, added relationship wrapper methods, and allowed relationship targets to be checked during graph validation instead of link time.
- Added banned vocabulary validation during entity normalization.

## 2026-08-25 Quality Follow-Up

- `import_entity(text)` now validates, persists, caches, and returns the stored-record shape.
- Removed fragile unknown-type error remapping so validator messages pass through directly.
- Creation timestamps now share one generated timestamp when `created_at`/`updated_at` are not supplied.

## 2026-08-25 Snake Case API Pass

- Removed mixed-case driver normalization fallbacks; drivers are expected to expose `generate_id()` and `get_timestamp()`.

## 2026-08-25 Lock-Down Pass

- `normalize_entity()` now rejects non-object entity input.
- Batch helpers now reject non-array inputs with explicit errors.

## 2026-08-25 Validator Integration Pass

- Normalized inline `schemas` on entity records.
- Added optional `schema_records` config validation before persistence.
- Delegated graph validation to shared `entity_validator`.
