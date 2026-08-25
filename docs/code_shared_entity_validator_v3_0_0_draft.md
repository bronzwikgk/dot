# Shared entity_validator utility

## File

`code/utilities/code_shared_entity_validator_v3_0_0_draft.js`

## What It Is

The shared entity validator utility owns approved-name validation for the
entity-first system. Plugins use it to validate entity records, relationship
records, statuses, operations, UI vocabulary, and safe names.

## What It Does

It exposes validation and assertion methods for:

- entity records
- raw input records
- relationship records
- relationship types
- lifecycle statuses
- cell statuses
- datatype names
- diagnostic levels
- import/export formats
- flow node types
- UI action names
- intent names
- layout names
- panel names
- pipeline names and stages
- cell types
- semantic element names
- template ids
- accessibility role names
- approved words
- dataset groups and dataset reports
- schema records
- entity records against schema records
- relationship graphs
- operation names
- snake_case safe names
- banned names
- near-duplicate checks

## When To Use It

Use it when a plugin or utility accepts entity-shaped data or approved
vocabulary. It is the main guard between free-form user input and governed
entity records.

## Runtime Contract

- Validation returns `{ ok, errors }` or a focused result object.
- Assertion methods throw when validation fails.
- Unknown entity types, relationship types, or operations are rejected unless
  config explicitly allows them.
- Banned vocabulary is rejected in safe names, approved-word checks, operation
  names, entity ids/types/names, and relationship type/target values.
- Snake_case phrases are split into tokens before banned vocabulary validation.
- Near-duplicate checks return suggestions.
- Dataset reports include group count, value count, invalid group count,
  per-group reports, and errors.
- The `banned_words` dataset is allowed to contain its own blocked terms.
- Schema records validate id, field names, field types, dataset references, and
  required fields.
- Relationship graph validation detects duplicate ids, missing relationship
  targets, invalid relationships, and dependency cycles.

## Known Limits

- Full schema catalog import data is not complete yet.
- Relationship cardinality and inverse rules are not fully enforced yet.

## How It Was Tested

Smoke checks validated safe names, banned names, relationship types, dataset
reports, schema records, promoted module imports, and entity graph behavior
through the promoted action entity.
