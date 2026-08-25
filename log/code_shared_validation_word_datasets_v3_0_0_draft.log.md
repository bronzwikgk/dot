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
