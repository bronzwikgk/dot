# Shared Inbox: Agent Search Contract Filename Rule

Date: 2026-08-25
Author: agent_codex_an_app
Status: added

## Summary

Agent-owned proposal contract filenames now include agent number and agent
name. Each agent must search `dot/proposal` for its own agent name before
starting work.

## Agent Search Commands

```powershell
rg --files dot\proposal | rg "agent_1_agent_codex_an_app"
rg --files dot\proposal | rg "agent_2_agent_ui_application"
rg --files dot\proposal | rg "agent_3_agent_lang_and_memory"
```

## Rule

New agent-owned proposal files should use:

```text
agent_<number>_<agent_name>_<artifact_name>_v<version>_<status>.md
```

Parent contract files may keep parent ids, but must include agent number and
agent name:

```text
agent_<number>_<agent_name>_parent_<id>_<scope>_contract.md
```

Planning, proposal, report, template, and handoff filenames should preserve
version and status where practical.

## Validation

The parent contract filenames under
`dot/proposal/production_application_contracts/parent_contracts` were renamed
for:

- `agent_1_agent_codex_an_app`
- `agent_2_agent_ui_application`
- `agent_3_agent_lang_and_memory`
