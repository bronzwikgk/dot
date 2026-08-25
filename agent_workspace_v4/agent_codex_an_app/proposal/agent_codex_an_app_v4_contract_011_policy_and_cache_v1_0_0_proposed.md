# V4 Contract 011: Policy And Cache

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_038, v4_missing_039

## Goal

Define policy validation and shell cache behavior for An App. The app shell must
keep global context and cache through a dedicated `action_entity` instance.

## Required Entities

- cache_policy
- storage_policy
- security_policy
- routing_policy
- naming_policy
- create_policy
- shell_cache
- cache_entry

## Required Methods

- validate_policy(config)
- validate_policy_set(config)
- create_shell_cache(config)
- read_cache_entry(config)
- write_cache_entry(config)
- remove_cache_entry(config)
- audit_cache(config)

## Success Criteria

- policies are validated from approved datasets
- invalid policy names fail before app boot
- cache entries are entities
- shell cache operations pass through `action_entity`
- cache writes create audit records
- cache policy controls max entries and allowed scopes

## Tests

- policy dataset tests
- policy validation tests
- shell cache action_entity integration tests
- audit record tests

## Do Not

- do not store unvalidated cache records directly in plain objects for promoted runtime behavior
- do not bypass action_entity for shell cache writes
