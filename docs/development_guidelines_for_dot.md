# Development Guidelines For dot

Date: 2026-08-25
Owner agent: agent_codex_an_app
Status: proposed

## Purpose

Define how agents and developers should plan, place, implement, validate, and
handoff dot work.

## Required Pre-Work

Before changing files, the acting agent must cross-check:

- current conversation
- `docs/policy_and_convention_for_dot.md`
- active master docs
- related parent contract
- related detail contracts
- shared inbox notes
- approved names and banned names

Every assigned agent must first search `dot/proposal` for its own agent name
and agent number. This finds the parent contracts, work packets, and handoff
notes related to that agent.

Examples:

```powershell
rg -n "agent_1_agent_codex_an_app" dot\proposal
rg -n "agent_2_agent_ui_application" dot\proposal
rg -n "agent_3_agent_lang_and_memory" dot\proposal
```

The agent must report any convention violation, name conflict, missing
authorization, or pending decision before claiming readiness.

Process tooling guidance lives in
`docs/agent_process_tooling_guidelines_dot_v1_0_0_proposed.md`.

## Approved Folder Rules

Use subdomain folders for:

- `docs/<subdomain_name>`
- `proposal/<subdomain_name>`
- `templates/<subdomain_name>`
- `test/<subdomain_name>`
- `reports/<subdomain_name>`
- `log/<subdomain_name>`

Use app data folders by shape:

- `app_data/dataset` for flat one-dimensional arrays
- `app_data/datamap` for relationship collections grouped by relationship type
- `app_data/data_table` for schema-shaped CSV attribute and parameter tables
- `app_data/definition` for entity definition documents

Use `user_data` for user-created or imported working data that is not promoted
yet.

## File Naming For Agent Work

Agent-owned proposal contracts must include:

- agent number
- agent name
- contract or work name
- version where practical
- status where practical

Use this pattern for new files:

```text
agent_<number>_<agent_name>_<artifact_name>_v<version>_<status>.md
```

Existing parent contract filenames may keep their parent id, but must include
agent number and agent name.

## Development Order

Preferred order:

1. utility
2. plugin
3. app data
4. schema or contract
5. docs
6. log
7. test
8. report
9. handoff

Registry-like behavior should use entity behavior where possible. Validation
should stay in utilities unless a plugin is coordinating a governed workflow.

## Do

- treat every durable or governable item as an entity
- reuse approved names before proposing new names
- keep public names snake_case
- put code under `code/plugins` or `code/utilities`
- put user working data under `user_data`
- put entity definitions under `app_data/definition`
- group docs, templates, proposals, tests, reports, and logs by subdomain
- include acting agent name and assigned owner agent in handoffs
- search `dot/proposal` for your agent name before starting work
- keep version and status in planning/proposal/report/template filenames
- include tests run, skipped tests, source refs, and known limits
- use shared inbox for conflicts, proposed names, blocked decisions, and
  agent-to-agent communication

## Do Not

- do not add a new or similar active name without user authorization
- do not put relationships inside datasets
- do not put attributes or parameters inside datasets
- do not put executable behavior inside app data
- do not claim production readiness from unit tests alone
- do not create implementation files before required schema/contract approval
- do not hide skipped validation
- do not silently promote source learning into active behavior

## Handoff Requirements

Each handoff must include:

- acting agent name
- assigned owner agent name
- parent contract id
- detail contract ids
- current conversation cross-check result
- files changed
- app data touched
- tests run
- skipped tests and reason
- unresolved names
- unresolved conflicts
- next recommended action

## Definition Of Ready

Work is ready to start when:

- owner agent is named
- related domain/subdomain is named
- contract or scope exists
- approved file location is known
- required app data shape is known
- validation path is known
- user authorization is recorded for any new active name

## Definition Of Done

Work is done only when:

- implementation or document matches the approved scope
- no unauthorized names were introduced
- related docs and logs are updated
- tests or validation checks were run
- skipped checks have explicit reasons
- report or handoff lists remaining risk
- user receives a clear commit message
