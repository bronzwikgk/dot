# Existing Code Scope Comparison

## Purpose

This document compares the current `dot/code` inventory with the An App scope.
It exists to prevent premature new code and to keep the build order aligned
with the rule: reuse existing classes first, extend them second, add a new file
only when reuse becomes awkward or repeated in several places.

## Current Code Inventory

### Plugins

| File | Current role | Scope fit |
| --- | --- | --- |
| `code_shared_action_entity_v3_0_0_draft.js` | CRUD-style entity records | stable existing entity plugin |
| `code_shared_action_entity_v3_1_0_draft.js` | advanced entity records, lifecycle, graph checks, import/export | primary candidate for An App entity records |
| `code_shared_app_generator_v3_0_0_draft.js` | creates an app manifest plan from config | useful later, but currently thin |
| `code_shared_entity_runner_v3_0_0_draft.js` | lightweight ordered stage runner | useful for entity-local stages |
| `code_shared_logger_v3_0_0_draft.js` | shared logging plugin | reusable for audit records |
| `code_shared_runner_v3_0_0_draft.js` | full workflow runner with conditions and DAG ordering | main workflow runner |
| `code_shared_validator_v3_0_0_draft.js` | generic schema and rule validator | should be reused by entity validation where practical |

### Utilities

| File | Current role | Scope fit |
| --- | --- | --- |
| `code_shared_collection_v3_0_0_draft.js` | array combine, slice, filtering, split helpers | reusable data utility |
| `code_shared_entity_parser_v3_0_0_draft.js` | simple text to entity/action parse | first home for alias mapping and slot extraction |
| `code_shared_entity_reasoner_v3_0_0_draft.js` | simple reason, resolve, decide | first home for basic matching and decision support |
| `code_shared_entity_registry_v3_0_0_draft.js` | in-memory type/trait lookup | lookup helper only; persistent registry records belong in `action_entity` |
| `code_shared_entity_validator_v3_0_0_draft.js` | approved names, relationship type, entity checks | primary utility to extend for schema, relationship, placeholder, render, and intake checks |
| `code_shared_markdown_pipeline_v3_0_0_draft.js` | decompose, compose, parse markdown blocks | reusable document utility |
| `code_shared_stats_v3_0_0_draft.js` | mean, deviation, weighted mean, z-score | reusable score support |
| `code_shared_text_v3_0_0_draft.js` | escaping, join mapping, tokenization, spacing | reusable language/text support |
| `code_shared_vector_math_v3_0_0_draft.js` | distance and similarity helpers | optional similarity support |

### Datasets And Test Utilities

| Area | Current role | Scope fit |
| --- | --- | --- |
| `utilities/dataset` | approved names for validation, UI names, behavior pairs | source for validation, still needs reports |
| `utilities/test_generation` | code inspection, signature inference, test generation | existing base for test harness work |
| `.testgen` tests | generated tests for older shared code | does not yet cover every newly promoted entity-system file |

## Scope Coverage

| Scope area | Coverage | What to do next |
| --- | --- | --- |
| Test harness | partial | add promoted entity-system files to tests and add a `dot` test command |
| Dataset audit | partial | add dataset report methods; store dataset registry records through `action_entity` |
| Schema enforcement | partial | extend `entity_validator`; reuse generic `validator` behavior where it fits |
| Relationship governance | partial | extend `entity_validator` and `action_entity` graph checks for cardinality, inverse, and cycle policy |
| Command and capability layer | low | start as entity records; use `entity_parser` and `entity_reasoner` before new helpers |
| Template artifact creation | low | use existing `create` operation with template config, schema checks, and audit output |
| App generation | partial | keep `app_generator` thin until schemas and templates are validated |
| Language, bot, memory, UI | mostly documented | defer until validation, relationship, command, and template foundation is stable |

## Reuse Decisions

- Registry records are entity records. Use `action_entity` for storage and lifecycle.
- `entity_registry` remains a lookup/helper utility, not the persistent registry store.
- `entity_validator` is the main validation owner for entity names, schemas, relationships, placeholders, render profiles, and intake records.
- The generic `validator` plugin should be reused by `entity_validator` when schema behavior already exists there.
- `entity_parser` is the first place for alias-to-approved-name mapping and slot extraction.
- `entity_reasoner` is the first place for basic matching and decision scoring.
- Dataset reporting is a utility concern, not a store.
- Artifact creation should use the existing `create` operation on an entity/action config.

## Corrected Build Order

1. Finish the `dot` test harness for existing and promoted code.
2. Expand `entity_validator` for schema and relationship checks.
3. Add dataset report methods and dataset registry entity examples.
4. Expand `entity_parser` only where language aliases and slots are already needed by tests.
5. Expand `entity_reasoner` only where matching or confidence is needed by multiple flows.
6. Add action entity tests for create/update/export/import/graph behavior.
7. Add template artifact creation through existing `create`.
8. Upgrade app generation only after template and schema records are validated.

## Deferred Until Needed

These are documented scope items, but they should not become new files yet:

- separate alias mapper
- separate matcher
- separate slot extractor
- separate confidence helper
- separate provenance helper
- separate audit composer

Each can be reconsidered only after repeated logic appears in at least two
existing classes.
