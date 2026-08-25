# Branch Policy And Agent 3 Evaluation

Date: 2026-08-25
Acting agent: agent_codex_an_app
Status: proposed

## Branch Policy Added

Each agent must maintain its own workspace branch:

- `dot_agent_codex_an_app_v1`
- `dot_agent_ui_application_v1`
- `dot_agent_lang_and_memory_v1`

The current development feature branch remains `wip_dot_v3`.

Merge into `wip_dot_v3` only after checks, validation, tests, benchmark where
relevant, audit, docs, logs, reports, and handoff all pass.

## Agent 3 Evaluation

Agent 3 improved An App Brain work, but it is not merge-ready.

Current result:

```text
37 tests discovered
36 passed
1 failed
```

Primary failure:

```text
decomposition stops at max_depth
```

Agent 3 must finish the correction on `dot_agent_lang_and_memory_v1` and provide
a handoff before merge.
