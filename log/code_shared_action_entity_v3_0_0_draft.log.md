# Shared Action Entity Utility Log

## 2026-08-24

Completed focused utility pass for `code/plugins/code_shared_action_entity_v3_0_0_draft.js`.

### Issues Fixed

- Cached records were returned by reference from `read()`, allowing callers to mutate cached state.
- Memory-driver `query()` returned stored record objects by reference.
- Entity `query()` returned driver result records by reference instead of defensive copies.

### Verification

Ran focused Node checks for:

- Required field validation.
- Enum validation.
- Date validation.
- Automatic ID generation.
- Custom ID field support.
- Create/read/update/delete behavior.
- `updated_at` presence after update.
- Cache size limit.
- Read-result mutation isolation.
- Query-result mutation isolation.
- Missing record read rejection after delete.

Result:

```text
action_entity checks passed
```

### Commit

Local commit message:

```text
Complete shared action entity utility
```

Push is handled by the user through GitHub Desktop.

## 2026-08-25

- Renamed class references to snake_case naming standard where applicable.

## 2026-08-25 Snake Case API Pass

- Renamed memory driver helpers to `generate_id()` and `get_timestamp()`.
- Renamed cache/id/timestamp fields to `cache_limit`, `id_field`, `created_at`, and `updated_at`.

## 2026-08-25 Lock-Down Pass

- `create()` now rejects non-object entity data.

## 2026-08-25 Documentation Alignment

- Updated constructor documentation to show all 4 parameters (name, config, driver, options).
- Added `generate_id(prefix)` signature to match v3.1.0 for consistency.
- Verified with smoke check: `action_entity v3.0.0 checks passed`.
