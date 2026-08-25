# Agent Work Assignment

Date: 2026-08-25
Status: proposed
Owner: agent_codex_an_app

## Purpose

Divide the 9 parent contracts across 3 agents while keeping the 18 detail contracts as subcontracts. Each agent must follow the same entity doctrine, naming policy, validation policy, docs/log policy, and approval boundaries.

## Agent 1: agent_codex_an_app

Lane: foundation_and_runtime
Priority: immediate

Assigned parent contracts:

- parent_001_production_app_shell_contract.md
- parent_003_version_system_implementation_contract.md
- parent_004_repository_operations_implementation_contract.md
- parent_009_real_app_e2e_validation_contract.md

Reason:

This lane is the most important and immediate because it locks the base system that every other lane depends on: shell boot, entity lifecycle, validation, versioning, runner behavior, repository operation boundaries, and production validation.

Primary subcontracts:

- contract_001_dataset_registry_contract.md
- contract_002_vocabulary_and_name_reconciliation_contract.md
- contract_003_entity_relationship_trait_contract.md
- contract_004_validation_utility_contract.md
- contract_005_action_entity_boundary_contract.md
- contract_006_version_system_contract.md
- contract_007_workflow_pipeline_runner_contract.md
- contract_008_provider_storage_index_contract.md
- contract_014_quality_audit_e2e_contract.md
- contract_016_repository_operations_contract.md

Immediate deliverables:

- app shell boot scope
- version system implementation plan
- repository operation boundary plan
- real app e2e scenario catalog
- validation gate for all agent lanes

## Agent 2: agent_ui_application

Lane: product_surface
Priority: next

Assigned parent contracts:

- parent_002_gui_application_builder_contract.md
- parent_008_production_templates_contract.md

Reason:

This lane owns the user-facing application builder, layout projections, template editing, and production templates.

Primary subcontracts:

- contract_002_vocabulary_and_name_reconciliation_contract.md
- contract_005_action_entity_boundary_contract.md
- contract_007_workflow_pipeline_runner_contract.md
- contract_009_ui_surface_contract.md
- contract_010_an_app_lang_contract.md
- contract_013_template_domain_contract.md
- contract_014_quality_audit_e2e_contract.md

Immediate deliverables:

- builder surface scope
- layout projection contract
- template fixture list
- ui e2e checklist

## Agent 3: agent_lang_and_memory

Lane: language_and_knowledge
Priority: next

Assigned parent contracts:

- parent_005_an_app_lang_implementation_contract.md
- parent_006_bot_agent_runtime_contract.md
- parent_007_memory_knowledge_tree_system_contract.md

Reason:

This lane owns parsing, command understanding, bot runtime, memory, knowledge tree, source evidence, and improvement proposals.

Primary subcontracts:

- contract_001_dataset_registry_contract.md
- contract_002_vocabulary_and_name_reconciliation_contract.md
- contract_003_entity_relationship_trait_contract.md
- contract_004_validation_utility_contract.md
- contract_007_workflow_pipeline_runner_contract.md
- contract_010_an_app_lang_contract.md
- contract_011_an_bot_agent_contract.md
- contract_012_an_memory_reasoning_contract.md
- contract_014_quality_audit_e2e_contract.md
- contract_017_agent_improvement_cycle_contract.md
- contract_018_knowledge_tree_contract.md
- contract_019_an_app_brain_domain_contract.md

Immediate deliverables:

- language parser scope
- bot task lifecycle scope
- memory and knowledge tree scope
- An App Brain coordination scope
- evidence and adoption decision rules

## Shared Agent Rules

- Everything durable or governable is an entity.
- No new or similar active names without user authorization.
- Reuse approved names before proposing a new name.
- Keep public names snake_case.
- Work utility first, then plugin, then dataset/schema/docs/log/test.
- Every changed utility, plugin, dataset, or contract needs docs and logs.
- Use shared inbox for conflicts, proposed names, and handoff notes.
- Do not claim e2e readiness from unit tests alone.

## Cross-Lane Dependencies

| Dependency | Provider Agent | Consumer Agent |
| --- | --- | --- |
| validation gate | agent_codex_an_app | all agents |
| action_entity lifecycle | agent_codex_an_app | all agents |
| version records | agent_codex_an_app | all agents |
| ui layout rules | agent_ui_application | all agents |
| template fixtures | agent_ui_application | agent_codex_an_app |
| parsed command records | agent_lang_and_memory | agent_ui_application, agent_codex_an_app |
| memory evidence records | agent_lang_and_memory | all agents |
| e2e report | agent_codex_an_app | all agents |

## Handoff Protocol

Each agent handoff must include:

- parent contract id
- related detail contract ids
- files changed
- tests run
- skipped tests with reason
- unresolved names
- unresolved conflicts
- next recommended action

## Success Criteria

- 9 parent contracts exist
- each parent contract references relevant detail contracts
- each parent contract has owner agent, priority, required output, validation, success criteria, and do-not rules
- 3 agents have clear, non-overlapping primary lanes
- cross-lane dependencies are explicit
