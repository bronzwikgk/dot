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
rg --files dot\proposal | rg "agent_1_agent_codex_an_app"
rg --files dot\proposal | rg "agent_2_agent_ui_application"
rg --files dot\proposal | rg "agent_3_agent_lang_and_memory"
```

The agent must report any convention violation, name conflict, missing
authorization, or pending decision before claiming readiness.

Process tooling guidance lives in
`docs/agent_process_tooling_guidelines_dot_v1_0_0_proposed.md`.

## Agent Branch And Workspace Rules

Every agent must work in its own workspace branch before changes are merged into
the current development feature branch.

Branch naming pattern:

```text
dot_<agent_name>_v<version>
```

Approved current agent branches:

- `dot_agent_codex_an_app_v1`
- `dot_agent_ui_application_v1`
- `dot_agent_lang_and_memory_v1`

The current development feature branch is `wip_dot_v3`. Agents may not push,
merge, or commit directly into `master`, `main`, `wip_dot_v3`, or any other
shared protected branch unless the user explicitly performs or authorizes that
action. Agents may only push to their own agent branch.

Agent branches are eligible for user merge into `wip_dot_v3` only after checks,
validation, tests, benchmark where relevant, audit, docs, logs, reports, and
handoff all pass.

Before starting work, each agent must record:

- current branch
- intended agent branch
- parent contract
- detail contracts
- validation command
- merge target branch

No agent should commit directly to `wip_dot_v3`, `master`, `main`, or any shared
protected branch. The user is the only person who pushes or merges into master
branches.

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

## Cross-Agent Dependency Rules

Agents must avoid hard dependency chains during planning and first-pass
implementation. When another agent owns a future capability, depend on a named
port, fixture, schema, or contract instead of concrete code.

Allowed dependency states:

- `contract_time`: the consumer relies on an approved contract or schema
- `fixture_time`: the consumer uses sample records or a mock port
- `integration_time`: the consumer binds to real provider code after both sides
  have tests and handoff notes

Do not create a compile-time dependency across agent lanes unless the user
approves it. Agent 2 product_surface work must continue with mock ports for
entity storage, workflow preview, command intent, templates, and version labels
until Agent 1 and Agent 3 publish compatible ports.

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
- maintain work in the agent branch named for your agent before merge review
- use shared inbox for conflicts, proposed names, blocked decisions, and
  agent-to-agent communication

## Do Not

- do not add a new or similar active name without user authorization
- do not put relationships inside datasets
- do not put attributes or parameters inside datasets
- do not put executable behavior inside app data
- do not claim production readiness from unit tests alone
- do not create implementation files before required schema/contract approval
- do not push or merge into `master`, `main`, `wip_dot_v3`, or any shared
  protected branch
- do not ask another agent to push to anything except that agent's own branch
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
- benchmark run, or reason benchmark is not applicable
- audit result
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
- agent branch is known
- user authorization is recorded for any new active name

## Definition Of Done

Work is done only when:

- implementation or document matches the approved scope
- no unauthorized names were introduced
- related docs and logs are updated
- tests or validation checks were run
- benchmark and audit are complete, or explicitly not applicable
- skipped checks have explicit reasons
- report or handoff lists remaining risk
- user receives a clear commit message
