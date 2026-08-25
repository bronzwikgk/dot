# Shared Entity System Promotion

## Purpose

This document explains the shared entity system code promoted from
`scratchpad_entity_system/code` into `dot/code`.

The promotion keeps the entity-first direction while preserving the existing
`dot` plugin and utility layout.

## Promoted Files

Plugins:

- `dot/code/plugins/code_shared_action_entity_v3_1_0_draft.js`
- `dot/code/plugins/code_shared_app_generator_v3_0_0_draft.js`
- `dot/code/plugins/code_shared_entity_runner_v3_0_0_draft.js`

Utilities:

- `dot/code/utilities/code_shared_entity_validator_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_entity_registry_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_entity_parser_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_entity_reasoner_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_markdown_pipeline_v3_0_0_draft.js`

Utility datasets:

- `dot/code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js`
- `dot/code/utilities/dataset/code_shared_ui_word_datasets_v3_0_0_draft.js`
- `dot/code/utilities/dataset/code_shared_entity_behavior_datasets_v3_0_0_draft.js`

## Companion Documents

Per-file docs:

- `dot/docs/code_shared_action_entity_v3_1_0_draft.md`
- `dot/docs/code_shared_app_generator_v3_0_0_draft.md`
- `dot/docs/code_shared_entity_runner_v3_0_0_draft.md`
- `dot/docs/code_shared_entity_validator_v3_0_0_draft.md`
- `dot/docs/code_shared_entity_registry_v3_0_0_draft.md`
- `dot/docs/code_shared_entity_parser_v3_0_0_draft.md`
- `dot/docs/code_shared_entity_reasoner_v3_0_0_draft.md`
- `dot/docs/code_shared_markdown_pipeline_v3_0_0_draft.md`
- `dot/docs/code_shared_validation_word_datasets_v3_0_0_draft.md`
- `dot/docs/code_shared_ui_word_datasets_v3_0_0_draft.md`
- `dot/docs/code_shared_entity_behavior_datasets_v3_0_0_draft.md`

Decision docs:

- `dot/docs/code_shared_runner_boundary_v3_0_0_draft.md`
- `dot/docs/code_shared_action_entity_migration_v3_1_0_draft.md`

## What The Code Does

`code_shared_action_entity_v3_1_0_draft.js` is the main entity plugin. It
normalizes entity records, validates them, stores them through a driver,
maintains a cache, manages relationships, handles lifecycle updates, supports
batch create/update/query, calculates diffs, bumps versions, imports and
exports records, and validates relationship graphs.

`code_shared_app_generator_v3_0_0_draft.js` creates an app manifest plan from
an app entity plus related route, view, and component entities.

`code_shared_entity_runner_v3_0_0_draft.js` runs named stages in a configured
order and records diagnostics plus timings.

`code_shared_entity_validator_v3_0_0_draft.js` is the shared validation utility.
It validates entity shape, input, output, relationships, relationship types,
lifecycle statuses, datatype names, operation names, UI vocabulary, safe names,
and banned names.

`code_shared_entity_registry_v3_0_0_draft.js` registers approved entity traits
and entity types, then resolves allowed operations for a type.

`code_shared_entity_parser_v3_0_0_draft.js` is a small intent parser for simple
entity commands. It can parse create and link intent records.

`code_shared_entity_reasoner_v3_0_0_draft.js` provides simple reason, resolve,
explain, and decide helpers.

`code_shared_markdown_pipeline_v3_0_0_draft.js` decomposes markdown into blocks,
parses it, composes it back, and runs that round trip.

The dataset files provide approved vocabulary arrays and behavior mapping pairs
used by validator and registry utilities.

## Promotion Rules

- Plugins represent active capabilities or orchestration.
- Utilities provide reusable helper behavior used by plugins.
- Dataset files belong under `dot/code/utilities/dataset`.
- The removed source adoption pipeline was not promoted.
- Existing `code_shared_action_entity_v3_0_0_draft.js` was preserved. The
  promoted action entity was added as `v3_1_0` for review.
- Existing `code_shared_runner_v3_0_0_draft.js` was preserved. The promoted
  runner was added as `code_shared_entity_runner_v3_0_0_draft.js` so the older
  workflow runner is not overwritten.

## Validation Performed

- Loaded every promoted module from its new `dot/code` path.
- Created and read entities using the promoted action entity plugin.
- Validated a correct relationship graph.
- Confirmed the parser reads `create entity called invoice` as name `invoice`.
- Checked promoted word datasets for duplicate and empty one-dimensional arrays.

## Remaining Work

- Add focused unit tests under the existing shared test pattern.
- Keep the existing shared runner and new entity runner separate for now, as
  documented in `code_shared_runner_boundary_v3_0_0_draft.md`.
- Keep action entity `v3_0_0` and `v3_1_0` side by side for now, as documented
  in `code_shared_action_entity_migration_v3_1_0_draft.md`.
- Add code-level schema enforcement for the schema catalog documented in the
  scratchpad.
- Add generated registry reports for dataset ownership and coverage.
