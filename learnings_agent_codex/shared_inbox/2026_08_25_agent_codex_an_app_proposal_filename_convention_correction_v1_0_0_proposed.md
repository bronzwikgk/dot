# Proposal Filename Convention Correction

Date: 2026-08-25
Acting agent: agent_codex_an_app
Status: proposed

## Reason

The proposal contracts mixed old filenames with the new convention. This made
agent search and handoff less reliable.

## Correction

Agent-owned proposal files now use an agent prefix, version, and status.

Shared detail contracts now use:

```text
shared_detail_contract_<number>_<name>_v<version>_<status>.md
```

Agent-owned coordination files now use:

```text
agent_<number>_<agent_name>_<artifact_name>_v<version>_<status>.md
```

## Agent 2 Dependency Note

Agent 2 product_surface work is no longer blocked by Agent 1 or Agent 3
implementation. The contracts define mock ports and fixture records for first
pass work. Final concrete integration remains a later validation gate.

## Validation

Ran a path-based naming scan across:

- `proposal/production_application_contracts`
- `reports/product_surface`
- `user_data/product_surface`
- `learnings_agent_codex/shared_inbox`

Result: naming scan passed.
