# Agent Work: An App Brain v1.4.0

Date: 2026-08-25
Status: proposed
Owner agent: agent_lang_and_memory
Reviewer: agent_codex_an_app
Priority: p1

## Purpose

Turn the `an_app_brain` subdomain contract into implementable schema,
validation, and test-ready work without creating duplicate parser, memory, bot,
runner, or source-adoption code.

## Source

- `proposal/an_brain_domain_proposal.md`
- `dot/proposal/production_application_contracts/shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md`
- `dot/docs/code_shared_an_app_brain_v1_4_0_draft.md`

## Work Items

| Work Id | Scope | Priority | Success Criteria |
| --- | --- | --- | --- |
| work_an_app_brain_001 | ingestion records | p0 | raw input becomes source-backed ingestion_record |
| work_an_app_brain_002 | decomposition records | p0 | recursive split has node ids, depth, and stop reason |
| work_an_app_brain_003 | parsing records | p0 | An App Lang output is linked and validated |
| work_an_app_brain_004 | reasoning and resolution | p1 | reasoning_trace and resolution_record include evidence and type |
| work_an_app_brain_005 | composition and understanding | p1 | response output links to decision, understanding, and evidence |
| work_an_app_brain_006 | validation and recursion | p1 | recursion has max depth, cycle checks, timeout, and audit |
| work_an_app_brain_007 | learning and controlled operations | p1 | optimize/evolve/mutate use explicit score, seed, rollback, and audit |
| work_an_app_brain_008 | context and boundary | p0 | seven context layers and boundary checks are schema-backed |
| work_an_app_brain_009 | knowledge-tree handoff | p1 | knowledge nodes preserve source evidence and coverage decisions |

## Required Folder And File Structure

Agent 3 must keep implementation planning separate from active implementation
until schema and validation are approved.

The assigned owner agent is `agent_lang_and_memory`. Any handoff or work note
for this contract must name both the acting agent and the assigned owner agent.
Before editing, the acting agent must cross-check the current conversation,
master docs, policy docs, parent contracts, detail contracts, and shared inbox
for convention violations, banned names, pending decisions, and user
corrections.

Agent search command:

```powershell
rg --files dot\proposal | rg "agent_3_agent_lang_and_memory"
```

Planning and contracts:

```text
dot/proposal/production_application_contracts/parent_contracts/
  agent_3_agent_lang_and_memory_work_an_app_brain_v1_4_0_proposed.md
  agent_3_agent_lang_and_memory_work_name_governance_banned_words_v1_0_0_proposed.md
  agent_3_agent_lang_and_memory_parent_005_an_app_lang_implementation_contract_v1_0_0_proposed.md
  agent_3_agent_lang_and_memory_parent_006_bot_agent_runtime_contract_v1_0_0_proposed.md
  agent_3_agent_lang_and_memory_parent_007_memory_knowledge_tree_system_contract_v1_0_0_proposed.md
```

Subdomain docs:

```text
dot/docs/
  code_shared_an_app_brain_v1_4_0_draft.md

dot/docs/an_app_master_project/
  an_app_master_project_document.md
  an_app_requirements_and_spec.md
  an_app_input_and_artifact_checklist.md
  an_app_pending_work_tracker.md
```

Expected future docs:

```text
dot/docs/
  code_shared_an_app_lang_v3_0_0_draft.md
  code_shared_an_bot_agent_v3_0_0_draft.md
  code_shared_an_memory_reasoning_v3_0_0_draft.md
  code_shared_knowledge_tree_v3_0_0_draft.md
```

Expected future logs:

```text
dot/log/
  code_shared_an_app_lang_v3_0_0_draft.log.md
  code_shared_an_bot_agent_v3_0_0_draft.log.md
  code_shared_an_memory_reasoning_v3_0_0_draft.log.md
  code_shared_knowledge_tree_v3_0_0_draft.log.md
  code_shared_an_app_brain_v1_4_0_draft.log.md
```

Expected future schema contracts:

```text
dot/proposal/production_application_contracts/schema_contracts/
  agent_3_agent_lang_and_memory_schema_an_app_brain_session_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_an_app_brain_context_record_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_an_app_brain_reasoning_trace_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_an_app_brain_resolution_record_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_an_app_brain_boundary_record_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_an_app_brain_recursion_trace_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_an_app_lang_parse_record_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_an_bot_session_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_an_memory_evidence_record_v1_0_0_draft.md
  agent_3_agent_lang_and_memory_schema_knowledge_tree_node_v1_0_0_draft.md
```

Expected future code locations, only after approval:

```text
dot/code/utilities/
  code_shared_an_app_lang_v3_0_0_draft.js
  code_shared_an_memory_reasoning_v3_0_0_draft.js
  code_shared_knowledge_tree_v3_0_0_draft.js

dot/code/plugins/
  code_shared_an_bot_agent_v3_0_0_draft.js
  code_shared_an_app_brain_v1_4_0_draft.js
```

Expected future tests:

```text
dot/test/
  an_app_lang_parse_record.test.mjs
  an_bot_session_lifecycle.test.mjs
  an_memory_evidence_record.test.mjs
  knowledge_tree_node_validation.test.mjs
  an_app_brain_boundary_recursion.test.mjs
```

Agent 3 must not create these future implementation files until the matching
schema/contract is approved. Planning docs may be created in `proposal`.

## App Data Structure

Agent 3 must use the approved app data folders when proposing language,
memory, brain, bot, or knowledge-tree datasets.

| Folder | Agent 3 Use |
| --- | --- |
| `dot/app_data/dataset` | Flat one-dimensional arrays for context layer names, reasoning type names, resolution type names, boundary type names, recursion stop reason names, confidence labels, memory state names, parser shape names, and intent names. |
| `dot/app_data/datamap` | Relationship groups for context inheritance, evidence links, reasoning-to-decision links, knowledge-node links, parser-output links, memory-source links, and bot-session-to-task links. |
| `dot/app_data/data_table` | Schema-shaped CSV-style tables for record attributes, parameters, thresholds, confidence fields, boundary limits, policy columns, scoring settings, and provider settings. |

Rules:

- do not put relationships in a dataset
- do not put attributes or parameters in a dataset
- do not create a new app data group until the approved name check is done
- propose schema columns before creating a data_table
- group datamap entries by relationship type

## Do

- use approved name `an_app_brain`
- name the acting agent and assigned owner agent in every handoff
- report the current conversation cross-check result before claiming readiness
- treat records as entities
- reuse existing `an_app_lang`, `an_memory`, `an_bot`, `knowledge_tree`,
  `workflow_pipeline_runner`, validation, and `action_entity` boundaries
- define schemas before plugin work
- add tests before claiming implementation readiness

## Do Not

- do not create an `an_app_brain` plugin before schema and validation work
- do not use the source name as the active domain name
- do not use source-branded blocked names as active names
- do not allow self-improvement to apply changes without approval

## Validation

- all new record names exist in the master spec or are submitted for approval
- all controlled operations have explicit policy
- all reasoning outputs have evidence, assumptions, and confidence
- all recursion has limits and stop reason
- all boundary failures produce clarification, blocked result, or explicit assumption
