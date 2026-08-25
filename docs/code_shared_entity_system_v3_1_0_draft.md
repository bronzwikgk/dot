# code_shared_entity_system_v3_1_0_draft.md

**Version:** v3.1.0
**Status:** active
**Owner:** agent_codex_an_app
**Merged from:** action_entity_v3_0_0, action_entity_v3_1_0, action_entity_migration_v3_1_0, entity_parser, entity_registry, entity_validator, entity_behavior_datasets, entity_system_promotion

## What It Is

Complete entity-first system: CRUD, validation, registry, parser, behavior datasets, lifecycle, relationships, versioning, and promotion rules.

## Components

### action_entity (v3.0.0 stable, v3.1.0 advanced)

**v3.0.0:** Basic CRUD entity plugin with schema validation, auto-generated IDs, timestamps, bounded LRU cache. Use for simple storage.

**v3.1.0:** Advanced entity-first model extending v3.0.0:
- CRUD + Batch: create, read, update, delete, query, create_batch, update_batch, query_batch
- Lifecycle: set_status, draft, activate, deprecate, archive
- Relationships: link_entities, unlink_entities, add_relationship, remove_relationship, get_relationships, get_dependencies, get_dependents
- Validation: validate_graph (delegated to entity_validator)
- Policies/Contracts: add_policy, remove_policy, add_contract, add_operation
- Diffing: diff_entities(before, after) returns field-level change array
- Versioning: bump_version(entity, level) returns new semver string
- Import/Export: export_entity, import_entity
- Normalization: normalize_entity(input) preserves data field

**Migration rule:** Keep both. v3.1.0 becomes default only after full test/doc coverage. Use v3.1.0 for new work. Leave v3.0.0 users untouched.

### entity_parser

Lightweight deterministic parser for entity commands:
- parse(text) -> { action, type, name } or { action, from, to }
- pick_name(tokens, start_index, fallback)
- tokenize(text)
- Recognizes create and link intents
- Known limits: small command set, no schema validation, no confidence scores

### entity_registry

Stores approved entity traits and types using dataset-backed behavior pairs:
- register_trait, register_type, describe_trait, describe_type
- operations_for_type resolves type->trait->operation mappings
- Snake_case names required

### entity_validator

Central approved-name validation utility:
- Validates entity records, raw input, relationships, statuses, datatypes
- Validates UI action/intent/layout/panel/pipeline names
- Validates relationship graphs (duplicate IDs, missing targets, cycles)
- Validates banned vocabulary, near-duplicates, snake_case
- Returns { ok, errors } or focused result

### entity_behavior_datasets

Dataset module exporting mapping pairs for the registry:
- trait_operation_pairs: maps traits to allowed operations
- type_trait_pairs: maps entity types to their traits
- All names must exist in approved datasets

### Promotion Rules

Promoted from scratchpad to dot:
- Plugins: action_entity_v3_1_0, app_generator, entity_runner
- Utilities: entity_validator, entity_registry, entity_parser, entity_reasoner, markdown_pipeline
- Datasets: validation_word_datasets, ui_word_datasets, entity_behavior_datasets
- Old files preserved, new versions added alongside

## Runtime Contract

- snake_case IDs and types
- banned vocabulary checks
- approved statuses only
- schema-based validation via optional schema_records config
- relationship targets must resolve during graph validation
- cycles reported, not silently ignored

## Known Limits

- incomplete schema catalog
- memory-only driver (no persistence)
- shallow copies
- equality-only queries
- no transactions
- relationship cardinality/inverse not fully enforced

## When To Use

- v3.0.0: simple CRUD with schema validation
- v3.1.0: lifecycle, relationships, graph validation, versioning, import/export
- entity_parser: early command-parsing smoke checks
- entity_registry: type/trait/operation resolution
- entity_validator: approved name and graph validation
- entity_behavior_datasets: behavior mapping from datasets

## Related Files

- code/plugins/code_shared_action_entity_v3_0_0_draft.js
- code/plugins/code_shared_action_entity_v3_1_0_draft.js
- code/utilities/code_shared_entity_parser_v3_0_0_draft.js
- code/utilities/code_shared_entity_registry_v3_0_0_draft.js
- code/utilities/code_shared_entity_validator_v3_0_0_draft.js
- code/utilities/dataset/code_shared_entity_behavior_datasets_v3_0_0_draft.js
