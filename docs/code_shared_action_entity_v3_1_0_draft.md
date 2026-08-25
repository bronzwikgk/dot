# Shared Action Entity Plugin V3.1.0

## File

`code/plugins/code_shared_action_entity_v3_1_0_draft.js`

## What It Is

The shared action entity plugin is the advanced entity surface for the
entity-first application model. It extends the older CRUD-only entity idea into
a richer record model with lifecycle, relationships, policies, contracts,
versioning, import/export, and graph validation.

## What It Does

It exposes:

- `normalize_entity(input)`
- `validate_entity(entity)`
- `validate_input(input)`
- `validate_output(output)`
- `create(data, options)`
- `read(id, options)`
- `update(id, data, options)`
- `delete(id, options)`
- `query(filter, options)`
- `create_batch(items)`
- `update_batch(items)`
- `query_batch(filters)`
- `set_status(id, status)`
- `draft(id)`
- `activate(id)`
- `deprecate(id)`
- `archive(id)`
- `link_entities(from_id, to_id, type, attributes)`
- `unlink_entities(from_id, to_id, type)`
- `add_relationship(id, relationship)`
- `remove_relationship(id, relationship)`
- `get_relationships(id, type)`
- `get_dependencies(id)`
- `get_dependents(id)`
- `validate_graph()`
- `add_policy(id, policy)`
- `remove_policy(id, policy)`
- `add_contract(id, contract)`
- `add_operation(id, operation)`
- `diff_entities(before, after)`
- `bump_version(entity, level)`
- `export_entity(entity)`
- `import_entity(text)`

## When To Use It

Use this plugin when an object should be treated as a governed entity with
relationships, lifecycle state, audit-ready fields, and validation.

Use the older `code_shared_action_entity_v3_0_0_draft.js` only when the caller
needs the smaller CRUD surface and does not yet depend on relationships or
entity doctrine fields.

## Runtime Contract

- Entity ids and types must use snake_case path/name rules.
- Entity ids, types, names, and operation names must not contain banned
  vocabulary.
- Entity status must be approved.
- Inline `schemas` are normalized as entity data.
- The `data` field is preserved during normalization so version records,
  repository records, and application records can store payloads.
- Optional `schema_records` config validates every entity before persistence.
- Relationship types must be approved unless explicitly allowed by config.
- Legacy dependency input is disabled unless explicitly enabled for migration.
- Relationship targets do not need to exist at link time.
- Relationship targets must resolve during graph validation.
- Cycles are reported during graph validation.
- Graph validation is delegated to the shared `entity_validator` utility.
- Cache entries should reflect the latest stored record.
- `import_entity(text)` validates and persists the imported entity, then returns
  the same stored-record shape as `create`.
- Injected drivers expose `generate_id()` and `get_timestamp()`.
- Entity inputs and batch inputs are rejected when their shape is invalid.

## Implemented Methods

All documented methods are implemented:

- **CRUD**: `create`, `read`, `update`, `delete`, `query`
- **Batch**: `create_batch`, `update_batch`, `query_batch`
- **Lifecycle**: `set_status`, `draft`, `activate`, `deprecate`, `archive`
- **Relationships**: `link_entities`, `unlink_entities`, `add_relationship`, `remove_relationship`, `get_relationships`, `get_dependencies`, `get_dependents`
- **Validation**: `validate_graph`
- **Policies/Contracts**: `add_policy`, `remove_policy`, `add_contract`, `add_operation`
- **Diffing**: `diff_entities(before, after)` - returns array of field changes
- **Versioning**: `bump_version(entity, level)` - returns new version string (major/minor/patch)
- **Import/Export**: `export_entity(entity)`, `import_entity(text)`
- **Payload**: `normalize_entity(input)` preserves `data`

## Known Limits

- Full schema catalog import data is not complete yet.
- Storage is memory-backed unless a driver is injected.
- Full unit tests are not yet generated for this promoted file.

## How It Was Tested

Smoke checks imported the promoted module, created entities, read them, validated
a correct relationship graph, verified missing relationship targets fail, and
tested diff_entities, bump_version, export_entity, and import_entity.

Agent 1 foundation runtime tests also verify that version snapshots persist the
entity payload through the `data` field.
