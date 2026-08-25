# Shared Validation Word Datasets Log

## 2026-08-25

Promoted core validation word datasets from `scratchpad_entity_system/code`.

### Added

- Approved vocabulary arrays for entity types, traits, operations, datatypes,
  relationships, lifecycle states, stages, pipelines, intents, policies,
  contracts, schemas, diagnostics, templates, language, memory, command records,
  quality gates, repository operations, conversion profiles, external intake,
  planning artifacts, and banned names.

### Decision

Keep under `dot/code/utilities/dataset` because validators and registries share
these arrays.

### Verification

- Module import from promoted path passed.
- Duplicate and empty word-array check passed.

## 2026-08-25 Banned Vocabulary Update

- Added the rejected artifact-creation terms to banned vocabulary.
- Replaced approved names that used the banned concept with `create` and
  `artifact creation` wording.

## 2026-08-25 Quality Follow-Up

- Added `validate_word_dataset_arrays(groups)` for programmatic duplicate and invalid-value checks.

## 2026-08-25 Lock-Down Pass

- Standardized the approved Node platform label to `node_runtime`.

## 2026-08-25 Source-Derived Banned Vocabulary Update

- Added source-derived thinking/learning terms to banned vocabulary:
  `optimizer`, `optimization`, `evolve`, `evolution`, `evolutionary`,
  `mutate`, `mutation`, `neuro_rule`, and `rule_engine`.
- Updated the dataset doc, project policy, agent handbook, vocabulary contract,
  improvement-cycle contract, and An App Brain contract.
- Added agent work packet:
  `proposal/production_application_contracts/parent_contracts/agent_3_agent_lang_and_memory_work_name_governance_banned_words_v1_0_0_proposed.md`.
- Focused validation passed for the `banned_words` array.
- Broad convention validation still fails on pre-existing repository-wide
  convention findings and should be handled as a separate cleanup batch:
  `node validate_conventions.js`.

## 2026-08-25 Controlled Operation Correction

- User clarified that optimize/evolve terminology should remain available, and
  mutate may be needed for specific transforms.
- Removed optimizer/optimization/evolve/evolution/evolutionary/mutate/mutation
  from the banned vocabulary.
- Added `optimize`, `optimise`, `evolve`, and `mutate` as controlled allowed
  operation names.
- Kept `neuro_rule` and `rule_engine` blocked as source-branded active names.

## 2026-08-25 V4 Application Builder Vocabulary Update

- Added approved entity type names for book/cell operations and editor/focus
  runtime records.
- Reason: V4 contracts require book, cell, output, execution, ordering, editor
  state, focus state, row, rail, and render sync records to be normal entities.
- Verification: focused V4 utility tests passed and full `node --test` passed.
