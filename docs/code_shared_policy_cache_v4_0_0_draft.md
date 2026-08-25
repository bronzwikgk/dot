# code_shared_policy_cache_v4_0_0_draft

Status: draft
Owner: agent_codex_an_app

## What It Is

`policy_cache` validates policy records and manages shell cache entries through
`action_entity`.

## Public Methods

- `validate_policy(config)`
- `validate_policy_set(config)`
- `create_shell_cache(config)`
- `read_cache_entry(config)`
- `write_cache_entry(config)`
- `remove_cache_entry(config)`
- `audit_cache(config)`

## Test

```powershell
node --test test\v4_policy_cache\agent_codex_an_app_v4_policy_cache_v1_0_0_test.mjs
```
