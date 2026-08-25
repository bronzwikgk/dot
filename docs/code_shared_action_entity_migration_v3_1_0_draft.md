# Shared Action Entity Migration

## Purpose

This document defines how `code_shared_action_entity_v3_1_0_draft.js` relates to
the existing `code_shared_action_entity_v3_0_0_draft.js`.

## Decision

Keep both versions for now.

`v3_0_0` remains the stable CRUD-oriented entity plugin. `v3_1_0` is the
advanced entity-first plugin and should become the replacement only after its
tests, docs, and migration checks are complete.

## V3.0.0 Role

Use `v3_0_0` when code needs:

- create
- read
- update
- delete
- query
- simple schema validation
- small memory-backed storage
- compatibility with existing generated tests

## V3.1.0 Role

Use `v3_1_0` when code needs:

- normalized entity config
- attributes and parameters
- relationships
- policies
- contracts
- operations
- docs and logs on records
- lifecycle helpers
- batch helpers
- graph validation
- version bumping
- entity import/export

## Replacement Rule

Do not replace `v3_0_0` blindly.

Promote `v3_1_0` as the default action entity only after:

- generated tests include `v3_1_0`
- focused contract tests cover relationships and graph validation
- callers depending on the old class name are checked
- migration notes explain field changes
- docs and logs are complete

## Current Recommendation

Use `v3_1_0` for new entity-system work. Leave existing users of `v3_0_0`
untouched until compatibility is proven.
