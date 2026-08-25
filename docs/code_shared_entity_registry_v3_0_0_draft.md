# Shared Entity Registry Utility

## File

`code/utilities/code_shared_entity_registry_v3_0_0_draft.js`

## What It Is

The shared entity registry utility stores approved entity traits and entity
types. It uses dataset-backed behavior pairs to resolve which operations a type
can perform.

## What It Does

It exposes:

- `register_trait(name, operations)`
- `register_type(name, traits)`
- `describe_trait(name)`
- `describe_type(name)`
- `operations_for_type(name)`
- `has_type(name)`
- `list_types()`

## When To Use It

Use it when code needs to check whether an entity type exists or needs to
discover behavior from type-to-trait and trait-to-operation mappings.

## Runtime Contract

- Trait and type names must be snake_case.
- Types can only reference registered traits.
- Operation lookup returns unique approved operations for a type.

## Known Limits

- Registry state is in memory.
- It does not yet persist approvals or provenance.

## How It Was Tested

Dataset cross-reference checks confirmed behavior pairs point to approved types,
traits, and operations.
