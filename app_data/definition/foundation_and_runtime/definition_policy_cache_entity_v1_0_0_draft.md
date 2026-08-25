# Policy Cache Entity

Status: draft
Owner: agent_codex_an_app

## Purpose

Policy cache defines approved policy records and shell cache entries. Shell cache
writes must go through `action_entity` so cached runtime state remains an entity.

## Entities

- `cache_policy`
- `storage_policy`
- `security_policy`
- `routing_policy`
- `naming_policy`
- `create_policy`
- `shell_cache`
- `cache_entry`

## Validation

- Policy ids must use snake_path format.
- Policy types must come from the approved dataset.
- Cache scopes must come from the approved dataset.
- Cache writes create audit records.
