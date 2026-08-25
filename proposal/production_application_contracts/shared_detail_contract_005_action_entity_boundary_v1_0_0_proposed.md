# Contract 005: Action Entity Boundary

Status: proposed
Priority: p0
Owner domain: entity_system
Owner agent: agent_codex_an_app

## Purpose

Define `action_entity` as the core governed entity lifecycle plugin and prevent unnecessary new manager/store classes.

## Responsibilities

- create entity
- read entity
- update entity
- delete entity
- query entity
- import entity
- normalize entity
- validate entity
- apply remove policy
- record provenance
- preserve version/audit refs

## Uses Existing Utilities

- validation utility
- dataset registry
- relationship validation
- schema validation
- version validation when available

## Boundary

`action_entity` owns lifecycle coordination. It does not own specialized diff algorithms, complex merge policy, parser behavior, ui rendering, or provider implementation.

## Success Criteria

- registry records can be stored as entities
- state records can be stored as entities
- version/branch/diff/merge/conflict/tag records can be stored as entities
- query returns consistent shape
- import errors are guarded and audit-ready
- docs describe id scheme per driver

## Do

- prefer action_entity before creating new lifecycle plugins
- keep public API snake_case
- validate input and output

## Do Not

- do not introduce entity-specific manager classes by default
- do not persist malformed imports
- do not silently mutate injected drivers
