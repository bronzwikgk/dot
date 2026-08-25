# Three Agent Priority Backlog

Date: 2026-08-25
Status: proposed
Owner: agent_codex_an_app

## Purpose

This is the handover board for the production An App development batch. It
divides all pending work into 3 priority levels across 3 agents.

## Agents

| Agent | Lane | Main Responsibility |
| --- | --- | --- |
| agent_codex_an_app | foundation_and_runtime | shell, entity lifecycle, versioning, repository boundary, e2e gates |
| agent_ui_application | product_surface | GUI/application builder, layout projections, templates, ui validation |
| agent_lang_and_memory | language_and_knowledge | An App Lang, An App Brain, bot runtime, memory, knowledge tree, name governance |

## Agent 3 Folder Structure

Agent 3 uses this handover structure:

```text
dot/proposal/production_application_contracts/parent_contracts/
  agent_3_agent_lang_and_memory_work_an_app_brain_v1_4_0_proposed.md
  agent_3_agent_lang_and_memory_work_an_app_brain_correction_and_test_plan_v1_0_0_proposed.md
  agent_3_agent_lang_and_memory_work_name_governance_banned_words_v1_0_0_proposed.md
  agent_3_agent_lang_and_memory_parent_005_an_app_lang_implementation_contract_v1_0_0_proposed.md
  agent_3_agent_lang_and_memory_parent_006_bot_agent_runtime_contract_v1_0_0_proposed.md
  agent_3_agent_lang_and_memory_parent_007_memory_knowledge_tree_system_contract_v1_0_0_proposed.md
```

Agent 3 search command:

```powershell
rg --files dot\proposal | rg "agent_3_agent_lang_and_memory"
```

Agent 3 should place new schema/contract planning files under:

```text
dot/proposal/production_application_contracts/schema_contracts/
```

Agent 3 should not create implementation files under `dot/code` until the user
approves the relevant schema and implementation batch.

Agent 3 app data outputs must follow the approved structure:

- flat approved values go in `dot/app_data/dataset`
- typed relationship groups go in `dot/app_data/datamap`
- schema-shaped CSV attribute/parameter tables go in `dot/app_data/data_table`

## P0: Foundation Lock

Do this first.

| Agent | Work | Output |
| --- | --- | --- |
| agent_codex_an_app | app shell boot boundary | boot schema, boot flow, boot smoke scenario |
| agent_codex_an_app | entity lifecycle validation gate | action_entity boundary evidence |
| agent_codex_an_app | version schema boundary | version/diff/branch/merge/conflict schema plan |
| agent_codex_an_app | real app e2e catalog | production acceptance scenarios |
| agent_ui_application | ui vocabulary review | ui name conflict report |
| agent_ui_application | builder entity model | book/cell/view/route/state entity mapping |
| agent_ui_application | layout projection rules | approved render profiles and layout projection boundaries |
| agent_lang_and_memory | name governance scan | banned/controlled name reconciliation report |
| agent_lang_and_memory | An App Brain schema needs | v1.4 record schema list and boundaries |
| agent_lang_and_memory | An App Brain correction and tests | runtime-load fix, schema/code alignment, and language_and_knowledge tests |
| agent_lang_and_memory | parser records | language input/output record contract |

## P1: Production Build

Start after the related p0 item has a clear schema, contract, or smoke path.
If a related owner agent has not finished implementation, continue with mock
ports and fixture records. Do not turn integration dependencies into start
blockers.

| Agent | Work | Output |
| --- | --- | --- |
| agent_codex_an_app | repository read-only operations | inspect/status/diff/commit-proposal boundary |
| agent_codex_an_app | provider/storage/index integration | provider config and audit rules |
| agent_codex_an_app | cross-agent integration review | compatibility report for ui and language lanes |
| agent_ui_application | GUI application builder scope | builder implementation plan |
| agent_ui_application | editor and command surfaces | command palette/editor checklist |
| agent_ui_application | production templates | LMS, fintech, single-user, research, automation fixtures |
| agent_ui_application | template validation path | template smoke and generated-test plan |
| agent_lang_and_memory | An App Lang implementation plan | parser plan and sample tests |
| agent_lang_and_memory | bot/agent runtime lifecycle | bot_session, agent_task, approval gate lifecycle |
| agent_lang_and_memory | memory/knowledge-tree handoff | evidence, knowledge_node, coverage, decision schema |
| agent_lang_and_memory | controlled improve/evolve/mutate policy | score, seed, rollback, audit rules |

## P2: Expansion And Hardening

Start after the related p1 item works or has an explicit blocked note.

| Agent | Work | Output |
| --- | --- | --- |
| agent_codex_an_app | workflow artifacts and logs | workflow_run, workflow_artifact, workflow_log plan |
| agent_codex_an_app | release gate automation | repeatable release readiness report |
| agent_ui_application | responsive hardening | desktop/mobile visual validation checklist |
| agent_ui_application | advanced layout parity | table, board, calendar, timeline, diagram, dashboard report |
| agent_lang_and_memory | source learning expansion | source inventory and adoption report plan |
| agent_lang_and_memory | improvement-cycle hardening | improvement proposal validation suite |

## Shared Rules

- Every contract and handoff must name the assigned agent.
- Every agent must search `dot\proposal` for its agent number and agent name
  before starting work.
- Agent-owned proposal filenames must include agent number and agent name.
- Planning, proposal, report, template, and handoff filenames should preserve
  status and version where practical.
- Everything durable or governable is an entity.
- No new or similar active names without authorization.
- Keep public names snake_case.
- Utility first, then plugin, then dataset/schema/docs/log/test.
- Every output needs validation evidence.
- Use shared inbox for conflicts and handoffs.
- Do not claim production readiness from unit tests alone.
- Cross-agent dependencies must be handled through contracts, mock ports, and
  fixtures until real integration is approved.
- Before editing, cross-check the current conversation, master docs, policy docs,
  parent contract, detail contracts, and shared inbox for convention violations,
  banned names, pending decisions, and user corrections.

## Agent 2 Unblock Rule

Agent 2 can start all p0 and p1 product_surface planning and fixture work now.
The only Agent 2 work that must wait is final e2e integration with concrete
Agent 1 runtime modules and concrete Agent 3 language/memory modules.

## Handoff Format

Each agent must report:

- acting agent name
- assigned owner agent name
- priority level
- parent contract ids
- detail contract ids
- current conversation cross-check result
- files changed
- tests run
- skipped tests and reason
- unresolved names
- unresolved conflicts
- next action

## Ready To Start

Start with p0 only:

- agent_codex_an_app starts shell/entity/version/e2e foundation.
- agent_ui_application starts ui vocabulary and builder entity model.
- agent_lang_and_memory starts name governance and An App Brain schema needs.
