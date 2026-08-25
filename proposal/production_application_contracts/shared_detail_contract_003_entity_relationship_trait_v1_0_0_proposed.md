# Contract 003: Entity Relationship Trait

Status: proposed
Priority: p0
Owner domain: entity_system
Owner agent: agent_codex_an_app
Work items: work_003, work_004, work_005

## Purpose

Define the production entity shape, relationship metadata, trait dataset, and trait-operation map.

## Required Entity Shape

- `entity_id`
- `entity_type`
- `config`
- `schema_ref`
- `attributes`
- `traits`
- `relationships`
- `links`
- `policy`
- `provenance`
- `status`
- `state`
- `diagnostics`
- `validation`
- `version_ref`

## Outputs

- entity type dataset
- relationship type dataset
- relationship metadata map
- trait dataset
- trait-operation map
- entity schema contract
- relationship schema contract
- doc, log, and tests

## Validation

- entity types must be approved
- relationship type must be approved
- relationship source/target rules must pass
- cardinality must be explicit when required
- traits must only enable approved operations
- every relationship has provenance and audit path

## Success Criteria

- action_entity can create/read/update/delete/query compliant entities
- relationship validation catches unknown type, unknown target, invalid cardinality, and unsupported trait operation
- docs explain when entity behavior is enough and when a plugin is justified

## Do Not

- do not create a separate class for each entity type by default
- do not make registry, state, book, cell, or version records special non-entity stores
