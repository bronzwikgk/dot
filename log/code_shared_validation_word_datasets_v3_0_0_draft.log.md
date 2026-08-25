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
