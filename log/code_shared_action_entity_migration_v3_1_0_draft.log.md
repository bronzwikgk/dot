# Shared Action Entity Migration Log

## 2026-08-25

Compared `code_shared_action_entity_v3_0_0_draft.js` and
`code_shared_action_entity_v3_1_0_draft.js`.

### Decision

Keep both.

### Rationale

- `v3_0_0` is the stable CRUD-oriented entity plugin with generated tests.
- `v3_1_0` is the advanced entity-first plugin with relationships, policies,
  contracts, lifecycle helpers, graph validation, and import/export.
- Replacing the old file now would risk breaking existing callers and generated
  tests.

### Follow-Up

Make `v3_1_0` the default only after generated tests, focused relationship
tests, graph tests, and migration notes are complete.
