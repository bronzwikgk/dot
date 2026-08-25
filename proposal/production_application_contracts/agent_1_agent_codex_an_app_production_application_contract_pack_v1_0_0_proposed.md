# Production Application Contract Pack

Date: 2026-08-25
Owner agent: agent_codex_an_app
Status: proposed
Purpose: define the pending documentation and rigid contracts needed before the next production development batch.

## Project Success Criteria

The development batch succeeds when An App can be built into a working production-grade business application using the active `dot` codebase, the master docs, approved datasets, schemas, utilities, plugins, tests, logs, and e2e validation.

Reference success sources:

- `gk/gui_v4`
- `input_temp/an_app_stale`
- `input_temp/an_app_v2_stale`
- `project_action_org`
- `project_An_App_Shell_v01`
- `gk/shared/experiments/an_app_v5`
- `an_app.txt`
- `dot/docs/an_app_master_project`
- `dot/docs/development_guidelines_for_dot.md`
- `dot/docs/agent_process_tooling_guidelines_dot_v1_0_0_proposed.md`
- `dot/learnings_agent_codex`

## Mandatory Agent Rules

- Every contract must name the assigned `Owner agent`.
- Agent-owned proposal contract filenames must include agent number and agent
  name so each agent can find work by searching `dot/proposal`.
- Each agent must search `dot/proposal` for its own agent name before starting
  work.
- Everything durable or governable is an entity.
- Do not add a new or similar name without user authorization.
- Reuse approved names before proposing new names.
- Keep names snake_case.
- Work utility first, then plugin, then dataset/schema/docs/log/test.
- Every promoted item needs doc, log, tests, and validation evidence.
- Do not claim e2e readiness from unit tests alone.
- Before editing, cross-check the current conversation, master docs, policy docs,
  parent contract, detail contracts, and shared inbox for convention conflicts,
  banned names, pending decisions, and user corrections.
- Organize templates, docs, proposals, tests, reports, and logs by subdomain.
- Store entity definition documents in `app_data/definition`.
- Store user-created or imported working data in `user_data` until promoted.
- Maintain version and status in planning, proposal, report, template, and
  handoff filenames where practical.
- Treat cross-agent dependencies as contract/fixture boundaries until final
  integration. Do not make Agent 2 wait for Agent 1 or Agent 3 concrete code
  when mock ports can represent the required behavior.

## Contract Index

This folder now has two contract layers:

- parent contracts: 9 product delivery contracts in `parent_contracts`
- detail contracts: 19 rigid subcontracts in this folder

Parent contracts define what must be built for the production application. Detail contracts define the rules, utilities, plugin boundaries, datasets, validation, and audit behavior that each parent contract must obey.

Agent search commands:

```powershell
rg --files dot\proposal | rg "agent_1_agent_codex_an_app"
rg --files dot\proposal | rg "agent_2_agent_ui_application"
rg --files dot\proposal | rg "agent_3_agent_lang_and_memory"
```

## Parent Contract Index

| Parent Id | Parent Contract | Owner Agent | Priority | Main Detail Contracts |
| --- | --- | --- | --- | --- |
| parent_001 | parent_contracts/agent_1_agent_codex_an_app_parent_001_production_app_shell_contract_v1_0_0_partial_implemented.md | agent_codex_an_app | p0 | contract_001, contract_002, contract_003, contract_004, contract_005, contract_006, contract_007, contract_008, contract_014 |
| parent_002 | parent_contracts/agent_2_agent_ui_application_parent_002_gui_application_builder_contract_v1_0_0_partial_implemented.md | agent_ui_application | p1 | contract_002, contract_005, contract_007, contract_009, contract_010, contract_013, contract_014 |
| parent_003 | parent_contracts/agent_1_agent_codex_an_app_parent_003_version_system_implementation_contract_v1_0_0_partial_implemented.md | agent_codex_an_app | p0 | contract_003, contract_004, contract_005, contract_006, contract_014 |
| parent_004 | parent_contracts/agent_1_agent_codex_an_app_parent_004_repository_operations_implementation_contract_v1_0_0_partial_implemented.md | agent_codex_an_app | p1 | contract_005, contract_006, contract_007, contract_008, contract_014, contract_016 |
| parent_005 | parent_contracts/agent_3_agent_lang_and_memory_parent_005_an_app_lang_implementation_contract_v1_0_0_proposed.md | agent_lang_and_memory | p1 | contract_001, contract_002, contract_004, contract_007, contract_010, contract_012, contract_014, contract_019 |
| parent_006 | parent_contracts/agent_3_agent_lang_and_memory_parent_006_bot_agent_runtime_contract_v1_0_0_proposed.md | agent_lang_and_memory | p1 | contract_004, contract_005, contract_007, contract_010, contract_011, contract_012, contract_014, contract_017, contract_019 |
| parent_007 | parent_contracts/agent_3_agent_lang_and_memory_parent_007_memory_knowledge_tree_system_contract_v1_0_0_proposed.md | agent_lang_and_memory | p1 | contract_001, contract_002, contract_003, contract_010, contract_012, contract_014, contract_015, contract_018, contract_019 |
| parent_008 | parent_contracts/agent_2_agent_ui_application_parent_008_production_templates_contract_v1_0_0_partial_implemented.md | agent_ui_application | p1 | contract_001, contract_002, contract_004, contract_009, contract_013, contract_014 |
| parent_009 | parent_contracts/agent_1_agent_codex_an_app_parent_009_real_app_e2e_validation_contract_v1_0_0_partial_implemented.md | agent_codex_an_app | p0 | contract_001, contract_002, contract_004, contract_005, contract_006, contract_007, contract_009, contract_010, contract_011, contract_012, contract_013, contract_014, contract_016, contract_017, contract_018, contract_019 |

Agent assignment:

- parent_contracts/agent_1_agent_codex_an_app_work_assignment_v1_0_0_proposed.md

| Contract Id | Contract File | Work Items Covered | Priority |
| --- | --- | --- | --- |
| contract_001 | shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md | work_001 | p0 |
| contract_002 | shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md | work_002, work_003, work_009, work_011, work_013, work_018 | p0 |
| contract_003 | shared_detail_contract_003_entity_relationship_trait_v1_0_0_proposed.md | work_003, work_004, work_005 | p0 |
| contract_004 | shared_detail_contract_004_validation_utility_v1_0_0_proposed.md | work_001 through work_025 validation layer | p0 |
| contract_005 | shared_detail_contract_005_action_entity_boundary_v1_0_0_proposed.md | entity lifecycle, registry-as-entity, version records | p0 |
| contract_006 | shared_detail_contract_006_version_system_v1_0_0_proposed.md | work_022, work_023, work_024, work_025 | p0 |
| contract_007 | shared_detail_contract_007_workflow_pipeline_runner_v1_0_0_proposed.md | work_002, work_015 | p0 |
| contract_008 | shared_detail_contract_008_provider_storage_index_v1_0_0_proposed.md | work_006, work_007, work_008 | p1 |
| contract_009 | shared_detail_contract_009_ui_surface_v1_0_0_proposed.md | work_011, work_012, work_013, work_014, work_018, work_019 | p1 |
| contract_010 | shared_detail_contract_010_an_app_lang_v1_0_0_proposed.md | work_015, work_016 | p1 |
| contract_011 | shared_detail_contract_011_an_bot_agent_v1_0_0_proposed.md | bot, command, agent, approval, task flows | p1 |
| contract_012 | shared_detail_contract_012_an_memory_reasoning_v1_0_0_proposed.md | work_010, work_017, work_021 | p1 |
| contract_013 | shared_detail_contract_013_template_domain_v1_0_0_proposed.md | templates, sample pipelines, domain starter packs | p1 |
| contract_014 | shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md | work_015, work_025 and all production readiness gates | p0 |
| contract_015 | shared_detail_contract_015_external_intake_file_conversion_v1_0_0_proposed.md | work_008, work_020 | p2 |
| contract_016 | shared_detail_contract_016_repository_operations_v1_0_0_proposed.md | AnGitAgent inbox repository automation, workflow runs, artifacts, logs, commit proposals | p1 |
| contract_017 | shared_detail_contract_017_agent_improvement_cycle_v1_0_0_proposed.md | AnGitAgent inbox self-check, score, failure pattern, improvement proposal, rollback, audit | p1 |
| contract_018 | shared_detail_contract_018_knowledge_tree_v1_0_0_proposed.md | AnGitAgent inbox source tree, knowledge nodes, relationships, diagrams, coverage reports | p1 |
| contract_019 | shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md | An App Brain subdomain coordination across language, memory, bot, reasoning, scoring, and improvement | p1 |

## Source Coverage Notes

| Source | Coverage Note | Status |
| --- | --- | --- |
| github_dump/dump/inbox_AnGitAgent_inbox | agent_1_agent_codex_an_app_angitagent_inbox_coverage_evaluation_v1_0_0_proposed.md | proposal-covered |

## Required Validation For Any Contract Batch

Minimum checks:

```powershell
node --test test\test_generation_esm_regression.test.mjs
node .testgen\run_generated_tests.mjs
node .testgen\run_testgen_self_tests.mjs
node --test .testgen\*.test.mjs
```

Documentation checks:

- requirement IDs have no duplicates
- work IDs have no duplicates
- contract IDs have no duplicates
- every contract names its owner agent
- every handoff names the acting agent
- touched docs/logs have no avoidable-name drift except when listing banned terms
- every changed utility/plugin/dataset has matching docs and logs
- the agent reports whether it checked current conversation context and lists any
  detected convention conflicts
- cross-agent work lists whether each dependency is `contract_time`,
  `fixture_time`, or `integration_time`

## Definition Of Done

- All contracts in this folder exist and map to active master requirements.
- Each contract names owner agent, owner domain, related files, inputs, outputs, validation, tests, success criteria, do rules, do-not rules, and handoff notes.
- The shared inbox is used for proposed names, conflicts, and unresolved decisions.
- User receives a commit message and a clear list of remaining implementation work.
