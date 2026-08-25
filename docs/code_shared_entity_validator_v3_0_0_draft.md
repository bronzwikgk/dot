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
- Near-duplicate checks return suggestions.

## Known Limits

- It does not yet enforce every schema from the schema contract catalog.
- Relationship cardinality and inverse rules are not fully enforced yet.

## How It Was Tested

Smoke checks validated safe names, banned names, relationship types, promoted
module imports, and entity graph behavior through the promoted action entity.
