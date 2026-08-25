# code_shared_v4_foundation.md

**Version:** v4.0.0
**Status:** active
**Owner:** agent_codex_an_app
**Merged from:** browser_runtime, workspace_persistence, storage_provider, static_server, config_anchoring, shell_cache, policy_cache, policy_validation

## What It Is

V4 foundation/runtime modules: browser runtime, persistence, storage, server, config, cache, policy.

## Components

### browser_runtime
Browser health check, boot guard, benchmark short-circuit.

### workspace_persistence
Storage provider, autosave, reload restore, undo/redo version integration.

### storage_provider
Storage boundary, key validation, selftest, error surfacing.

### static_server
Local static server with no-cache policy and port/env handling.

### config_anchoring
Config source resolver, path anchoring, traversal rejection.

### shell_cache
Shell cache backed by action_entity, audit records, TTL.

### policy_cache
Policy validation and caching for boot-time checks.

### policy_validation
Cache/storage/security/routing/naming/create policy datasets and validation.

## Runtime Contract

- storage selftest must pass before boot
- config paths reject traversal
- policies validate before boot
- shell cache creates audit records

## Related Files

- code/utilities/code_shared_browser_runtime_v4_0_0_draft.js
- code/utilities/code_shared_workspace_persistence_v4_0_0_draft.js
- code/utilities/code_shared_storage_provider_v4_0_0_draft.js
- code/utilities/code_shared_static_server_v4_0_0_draft.js
- code/utilities/code_shared_config_anchoring_v4_0_0_draft.js
- code/utilities/code_shared_shell_cache_v4_0_0_draft.js
- code/utilities/code_shared_policy_cache_v4_0_0_draft.js
- code/utilities/code_shared_policy_validation_v4_0_0_draft.js
