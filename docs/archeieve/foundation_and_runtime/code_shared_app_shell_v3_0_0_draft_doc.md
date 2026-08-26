# App Shell Plugin

Date: 2026-08-25
Owner agent: agent_codex_an_app
Status: draft
File: `code/plugins/code_shared_app_shell_v3_0_0_draft.js`

## Purpose

`app_shell` boots an application entity and registers related route, view,
provider, and workflow entities through `action_entity`.

## Use Case

Use this plugin when an An App application needs to start from a governed
application record instead of scattered runtime state.

## How It Works

1. validates the application input
2. creates the application entity
3. creates child route, view, provider, and workflow entities
4. registers workflow plans with the shared runner when a plan is supplied
5. creates a boot audit entity
6. returns boot state with created records and audit evidence

## Boundary

- state is stored as entity records
- invalid config fails before runtime work
- duplicate child ids fail before runtime work
- route paths must start with `/`
- workflow plans are validated before registration
- route and view records are entities
- provider records are entities
- workflow plans are registered, not executed during boot

## Test

Run:

```powershell
node --test test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs
```

## Known Limits

- no browser ui mounting yet
- no provider credential loading
- no persistent storage provider beyond injected `action_entity`
