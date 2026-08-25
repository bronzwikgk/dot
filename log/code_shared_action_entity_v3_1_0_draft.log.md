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
