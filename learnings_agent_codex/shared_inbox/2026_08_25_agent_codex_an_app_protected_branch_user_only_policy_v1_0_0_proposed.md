# Protected Branch User Only Policy

Date: 2026-08-25
Acting agent: agent_codex_an_app
Status: proposed

## Decision

Only the user may push or merge into protected/shared branches:

- `master`
- `main`
- `wip_dot_v3`
- any shared current development branch

Agents may only push to their own workspace branch:

- `dot_agent_codex_an_app_v1`
- `dot_agent_ui_application_v1`
- `dot_agent_lang_and_memory_v1`

## Merge Gate

Agents prepare handoff and commit messages. The user performs the protected
branch merge or push after checks, validation, tests, benchmark where relevant,
audit, docs, logs, reports, and handoff pass.
