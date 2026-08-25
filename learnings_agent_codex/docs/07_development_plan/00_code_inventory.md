# Code Inventory

## Purpose

This inventory records what currently exists in `dot/code` before future An App
development begins.

## Plugins

| File | Role | Current Status |
| --- | --- | --- |
| `code_shared_validator_v3_0_0_draft.js` | schema/rule/path validator for workflow runner | existing shared plugin, tested |
| `code_shared_runner_v3_0_0_draft.js` | main workflow runner for AST plans and DAG tasks | existing shared plugin, tested |
| `code_shared_action_entity_v3_0_0_draft.js` | CRUD-oriented entity storage plugin | existing shared plugin, tested |
| `code_shared_logger_v3_0_0_draft.js` | logging and metrics plugin | existing shared plugin, tested |
| `code_shared_action_entity_v3_1_0_draft.js` | advanced entity-first plugin | promoted, smoke-tested |
| `code_shared_app_generator_v3_0_0_draft.js` | app manifest planner | promoted, smoke-tested |
| `code_shared_entity_runner_v3_0_0_draft.js` | lightweight stage runner | promoted, smoke-tested |

## Utilities

| File | Role | Current Status |
| --- | --- | --- |
| `code_shared_collection_v3_0_0_draft.js` | collection, windows, filtering, splitting | existing shared utility, tested |
| `code_shared_stats_v3_0_0_draft.js` | stats calculations | existing shared utility, tested |
| `code_shared_text_v3_0_0_draft.js` | text escaping, joining, tokenizing, spacing | existing shared utility, tested |
| `code_shared_vector_math_v3_0_0_draft.js` | distance and similarity | existing shared utility, tested |
| `test_generation/code_shared_code_inspector_v2_2_0_draft.js` | code inspection for tests | existing test utility, tested |
| `test_generation/code_shared_signature_inference_v2_2_0_draft.js` | signature inference for tests | existing test utility, tested |
| `test_generation/code_shared_test_generation_v2_2_0_draft.js` | generated test creation | existing test utility, tested |
| `code_shared_entity_validator_v3_0_0_draft.js` | entity and approved-word validation | promoted, smoke-tested |
| `code_shared_entity_registry_v3_0_0_draft.js` | type/trait/operation lookup | promoted, smoke-tested |
| `code_shared_entity_parser_v3_0_0_draft.js` | simple entity-intent parser | promoted, smoke-tested |
| `code_shared_entity_reasoner_v3_0_0_draft.js` | simple reason/resolve/explain/decide helper | promoted, smoke-tested |
| `code_shared_markdown_pipeline_v3_0_0_draft.js` | simple markdown parse/compose pipeline | promoted, smoke-tested |

## Datasets

| File | Role | Current Status |
| --- | --- | --- |
| `code_shared_validation_word_datasets_v3_0_0_draft.js` | core approved vocabulary arrays | promoted, smoke-tested |
| `code_shared_ui_word_datasets_v3_0_0_draft.js` | UI approved vocabulary arrays | promoted, smoke-tested |
| `code_shared_entity_behavior_datasets_v3_0_0_draft.js` | type-trait and trait-operation pairs | promoted, smoke-tested |

## Test Assets

Existing generated tests cover the older shared files only.

Current result:

```text
1300 pass
0 fail
```

Promoted entity-system files are not yet included in the generated-test
manifest.

## Immediate Code Reality

- `dot/package.json` has no test script.
- Existing test runner files generate tests but do not include the promoted
  entity-system files yet.
- `action_entity v3_0_0` and `action_entity v3_1_0` both exist.
- The main workflow runner and lightweight entity runner both exist by design.
