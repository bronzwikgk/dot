# Code Promotion Evaluation

## Purpose

This note evaluates `scratchpad_entity_system/code` for promotion into `dot/code`.

## Scope

Evaluated code files:

- `action_entity.js`
- `app_generator.js`
- `entity_parser.js`
- `entity_reasoner.js`
- `entity_registry.js`
- `entity_runner.js`
- `entity_validator.js`
- `markdown_pipeline.js`
- `dataset/validation_word_datasets.js`
- `dataset/ui_word_datasets.js`
- `dataset/entity_behavior_datasets.js`

The removed source adoption pipeline is out of scope and should not be promoted.

## Promotion Classification

| File | Classification | Target in `dot/code` |
| --- | --- | --- |
| `action_entity.js` | plugin | `dot/code/plugins/code_shared_action_entity_v3_1_0_draft.js` |
| `app_generator.js` | plugin | `dot/code/plugins/code_shared_app_generator_v3_0_0_draft.js` |
| `entity_runner.js` | plugin | merge into or replace `dot/code/plugins/code_shared_runner_v3_0_0_draft.js` after compatibility review |
| `entity_validator.js` | utility | `dot/code/utilities/code_shared_entity_validator_v3_0_0_draft.js` |
| `entity_registry.js` | utility | `dot/code/utilities/code_shared_entity_registry_v3_0_0_draft.js` |
| `entity_parser.js` | utility | `dot/code/utilities/code_shared_entity_parser_v3_0_0_draft.js` |
| `entity_reasoner.js` | utility | `dot/code/utilities/code_shared_entity_reasoner_v3_0_0_draft.js` |
| `markdown_pipeline.js` | utility | `dot/code/utilities/code_shared_markdown_pipeline_v3_0_0_draft.js` |
| `dataset/*.js` | utility dataset | `dot/code/utilities/dataset/` |

## Code Readiness

Ready for staged promotion:

- Modules load with Node ES module imports.
- Entity create/read/query/update/delete surface exists.
- Entity normalization includes config, attributes, parameters, relationships, policies, contracts, operations, tests, docs, logs, tags, and metadata.
- Relationship handling supports explicit relationships and migration-only legacy relationship input.
- Graph validation catches missing targets and cycles.
- validator owns approved names, relationship types, statuses, datatypes, UI names, safe names, and banned names.
- Registry maps entity types to traits and traits to operations.
- runner supports configured stages with timing and diagnostics.
- Parser now skips filler words such as `called` and `named` when choosing entity names.
- Markdown pipeline can decompose, parse, compose, and run.
- App generator can plan app files from route, view, and component entities.

## Issues Fixed During Evaluation

- `entity_parser` previously parsed `create entity called invoice` with name `called`.
- It now selects `invoice`, while still supporting direct names such as `create route api_orders`.

## Remaining Risks Before Full Dot Integration

- Import paths must be adjusted during promotion because plugins and utilities will live in different folders.
- The existing `dot/code/plugins/code_shared_action_entity_v3_0_0_draft.js` already exists, so promotion should be versioned as the next action entity draft, not copied over blindly.
- Existing runner behavior in `dot/code/plugins/code_shared_runner_v3_0_0_draft.js` may have workflow features that the scratchpad runner does not include. Review before replacement.
- The schema catalog is currently documentation only. Code-level schema enforcement still needs a dedicated validator step.
- No full unit test suite exists yet for the promoted files. Current validation is smoke-level.

## Validation Performed

- Imported all scratchpad code modules successfully.
- Created and read entities with `action_entity`.
- Validated a correct graph.
- Verified a missing relationship target fails graph validation.
- Ran parser checks for `create entity called invoice`, `create view named dashboard`, and `create route api_orders`.
- Checked dataset word arrays for empty arrays and duplicate values.
- Checked behavior dataset pairs against approved traits, types, operations, and key relationship names.
- Checked banned exact words outside the approved banned-word dataset.

## Promotion Recommendation

Promote in batches:

1. Dataset files into `dot/code/utilities/dataset/`.
2. `entity_validator` and `entity_registry`.
3. `action_entity` as a versioned plugin upgrade.
4. Parser, reasoner, markdown pipeline, and app generator.
5. runner only after comparing with the current shared runner.

Do not promote the removed source adoption pipeline.
