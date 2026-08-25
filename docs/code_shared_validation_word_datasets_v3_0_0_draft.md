# Shared Validation Word Datasets

## File

`code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js`

## What It Is

This dataset module contains approved one-dimensional word arrays for core
validation across the entity-first system.

## What It Contains

It includes approved words for entity types, traits, operations, datatypes,
relationships, lifecycle statuses, stages, pipelines, intents, policies,
contracts, schemas, diagnostics, artifacts, templates, application scope,
language, memory, source coverage, command records, capabilities, quality gates,
repository operations, conversion profiles, external intake, planning artifacts,
and banned names.

## When To Use It

Use it as the shared source for validating approved core vocabulary.

## Runtime Contract

- Each exported group should be a one-dimensional array.
- String arrays should not contain duplicates.
- `validate_word_dataset_arrays(groups)` can be used by tests or agents to
  check string arrays for invalid values and duplicates.
- New names should be added here before validators accept them.

## Known Limits

- It is a vocabulary source, not a full registry with owner metadata.
- A generated dataset registry report is still needed.

## Banned Vocabulary Update

The banned vocabulary now includes the rejected artifact-creation terms.
Approved application, operation, relationship, artifact, and pipeline names use
`create` or `artifact creation` wording instead.

The banned vocabulary blocks source-branded thinking/learning names that should
not become active product names without authorization:

- `neuro_rule`
- `rule_engine`

The operation words `optimize`, `optimise`, `evolve`, and `mutate` are allowed
when their contracts define exact behavior, inputs, outputs, validation, seed
policy when relevant, and rollback or audit behavior. These words should not be
used as vague module names.

Use approved An App names where they fit better:

- `improvement_cycle`
- `improvement_proposal`
- `score_record`
- `failure_record`
- `pattern_record`
- `rule_set`
- `rule_record`
- `assertion_record`
- `validation_utility`
- `an_app_brain`

## Runtime Vocabulary Update

The approved Node platform label is `node_runtime`.

## How It Was Tested

The module imports successfully. Word-array checks found no empty arrays or
duplicate values.
