# Production Application Contract Pack

Date: 2026-08-25
Owner: agent_codex_an_app
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
- `dot/learnings_agent_codex`

## Mandatory Agent Rules

- Everything durable or governable is an entity.
- Do not add a new or similar name without user authorization.
- Reuse approved names before proposing new names.
- Keep names snake_case.
- Work utility first, then plugin, then dataset/schema/docs/log/test.
- Every promoted item needs doc, log, tests, and validation evidence.
- Do not claim e2e readiness from unit tests alone.

## Contract Index

| Contract Id | Contract | Work Items Covered | Priority |
| --- | --- | --- | --- |
| contract_001 | dataset_registry_contract.md | work_001 | p0 |
| contract_002 | vocabulary_and_name_reconciliation_contract.md | work_002, work_003, work_009, work_011, work_013, work_018 | p0 |
| contract_003 | entity_relationship_trait_contract.md | work_003, work_004, work_005 | p0 |
| contract_004 | validation_utility_contract.md | work_001 through work_025 validation layer | p0 |
| contract_005 | action_entity_boundary_contract.md | entity lifecycle, registry-as-entity, version records | p0 |
| contract_006 | version_system_contract.md | work_022, work_023, work_024, work_025 | p0 |
| contract_007 | workflow_pipeline_runner_contract.md | work_002, work_015 | p0 |
| contract_008 | provider_storage_index_contract.md | work_006, work_007, work_008 | p1 |
| contract_009 | ui_surface_contract.md | work_011, work_012, work_013, work_014, work_018, work_019 | p1 |
| contract_010 | an_app_lang_contract.md | work_015, work_016 | p1 |
| contract_011 | an_bot_agent_contract.md | bot, command, agent, approval, task flows | p1 |
| contract_012 | an_memory_reasoning_contract.md | work_010, work_017, work_021 | p1 |
| contract_013 | template_domain_contract.md | templates, sample pipelines, domain starter packs | p1 |
| contract_014 | quality_audit_e2e_contract.md | work_015, work_025 and all production readiness gates | p0 |
| contract_015 | external_intake_file_conversion_contract.md | work_008, work_020 | p2 |
| contract_016 | repository_operations_contract.md | AnGitAgent inbox repository automation, workflow runs, artifacts, logs, commit proposals | p1 |
| contract_017 | agent_improvement_cycle_contract.md | AnGitAgent inbox self-check, score, failure pattern, improvement proposal, rollback, audit | p1 |
| contract_018 | knowledge_tree_contract.md | AnGitAgent inbox source tree, knowledge nodes, relationships, diagrams, coverage reports | p1 |

## Source Coverage Notes

| Source | Coverage Note | Status |
| --- | --- | --- |
| github_dump/dump/inbox_AnGitAgent_inbox | ANGITAGENT_INBOX_COVERAGE_EVALUATION.md | proposal-covered |

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
- touched docs/logs have no avoidable-name drift except when listing banned terms
- every changed utility/plugin/dataset has matching docs and logs

## Definition Of Done

- All contracts in this folder exist and map to active master requirements.
- Each contract names owner domain, related files, inputs, outputs, validation, tests, success criteria, do rules, do-not rules, and handoff notes.
- The shared inbox is used for proposed names, conflicts, and unresolved decisions.
- User receives a commit message and a clear list of remaining implementation work.
