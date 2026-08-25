# Agent Work Assignment

Date: 2026-08-25
Status: proposed
Owner: agent_codex_an_app

## Purpose

Divide the complete pending work across 3 agents and 3 priority levels while
keeping the 19 detail contracts as subcontracts. Each agent must follow the
same entity doctrine, naming policy, validation policy, docs/log policy, and
approval boundaries.

## Priority Levels

| Priority | Meaning | Start Rule | Finish Rule |
| --- | --- | --- | --- |
| p0 | foundation lock | start first | must be stable before broad implementation |
| p1 | production build | start after relevant p0 dependency is clear | must produce usable product capability |
| p2 | expansion and hardening | start after core path works | must improve scale, coverage, providers, or learning |

No agent should start p1 work that depends on an unresolved p0 contract. No
agent should start p2 work unless the p1 path it extends has a working smoke
test or an explicit blocked note.

## Dependency Isolation Rule

Cross-agent dependencies are contract-time dependencies unless the user approves
a direct implementation dependency. A dependent agent must proceed with ports,
fixtures, and schema records when the provider agent has not finished concrete
code.

| Dependency Type | Rule |
| --- | --- |
| compile_time | prohibited across agents in first pass unless explicitly authorized |
| contract_time | required through parent contract, detail contract, schema, or fixture |
| fixture_time | allowed and preferred for unblocking independent work |
| integration_time | allowed after both provider and consumer publish tests and handoff notes |

Agent 2 must not block on Agent 1 or Agent 3 for product_surface work. Agent 2
uses mock ports for entity storage, workflow preview, command intent, templates,
and version labels. Agent 1 later binds runtime/version/repository ports. Agent
3 later binds language, bot, memory, and brain ports.

## Agent 1: agent_codex_an_app

Lane: foundation_and_runtime
Priority ownership: p0 primary, p1 support, p2 audit
Proposal search command: `rg --files dot\proposal | rg "agent_1_agent_codex_an_app"`

Assigned parent contracts:

- agent_1_agent_codex_an_app_parent_001_production_app_shell_contract_v1_0_0_partial_implemented.md
- agent_1_agent_codex_an_app_parent_003_version_system_implementation_contract_v1_0_0_partial_implemented.md
- agent_1_agent_codex_an_app_parent_004_repository_operations_implementation_contract_v1_0_0_partial_implemented.md
- agent_1_agent_codex_an_app_parent_009_real_app_e2e_validation_contract_v1_0_0_partial_implemented.md

Reason:

This lane is the most important and immediate because it locks the base system that every other lane depends on: shell boot, entity lifecycle, validation, versioning, runner behavior, repository operation boundaries, and production validation.

Primary subcontracts:

- shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md
- shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- shared_detail_contract_003_entity_relationship_trait_v1_0_0_proposed.md
- shared_detail_contract_004_validation_utility_v1_0_0_proposed.md
- shared_detail_contract_005_action_entity_boundary_v1_0_0_proposed.md
- shared_detail_contract_006_version_system_v1_0_0_proposed.md
- shared_detail_contract_007_workflow_pipeline_runner_v1_0_0_proposed.md
- shared_detail_contract_008_provider_storage_index_v1_0_0_proposed.md
- shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md
- shared_detail_contract_016_repository_operations_v1_0_0_proposed.md

Immediate deliverables:

- app shell boot scope
- version system implementation plan
- repository operation boundary plan
- real app e2e scenario catalog
- validation gate for all agent lanes

Priority backlog:

| Priority | Work | Parent Contract | Detail Contracts | Output |
| --- | --- | --- | --- | --- |
| p0 | lock entity lifecycle boundary | parent_001, parent_009 | contract_004, contract_005, contract_014 | action_entity validation gate and smoke evidence |
| p0 | lock app shell boot contract | parent_001 | contract_001, contract_002, contract_005, contract_007, contract_008 | boot schema, boot plan, boot smoke scenario |
| p0 | lock version record schema and boundary | parent_003 | contract_003, contract_004, contract_005, contract_006 | version/diff/branch/merge/conflict schema plan |
| p0 | create real app e2e scenario catalog | parent_009 | contract_014 plus all touched contracts | end-to-end validation catalog and acceptance gates |
| p1 | repository operation read-only boundary | parent_004 | contract_006, contract_008, contract_016 | inspect/status/diff/commit-proposal scope |
| p1 | provider/storage/index integration boundary | parent_001, parent_004 | contract_008, contract_016 | provider config and audit rules |
| p1 | cross-agent integration review | parent_009 | all p1 contracts | review report for ui and language lanes |
| p2 | repository workflow artifacts/logs | parent_004 | contract_016 | workflow_run, workflow_artifact, workflow_log plan |
| p2 | release readiness automation | parent_009 | contract_014 | repeatable release gate report |

## Agent 2: agent_ui_application

Lane: product_surface
Priority ownership: p1 primary, p0 dependency review, p2 polish
Proposal search command: `rg --files dot\proposal | rg "agent_2_agent_ui_application"`

Assigned parent contracts:

- agent_2_agent_ui_application_parent_002_gui_application_builder_contract_v1_0_0_partial_implemented.md
- agent_2_agent_ui_application_parent_008_production_templates_contract_v1_0_0_partial_implemented.md

Reason:

This lane owns the user-facing application builder, layout projections, template editing, and production templates.

Primary subcontracts:

- shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- shared_detail_contract_005_action_entity_boundary_v1_0_0_proposed.md
- shared_detail_contract_007_workflow_pipeline_runner_v1_0_0_proposed.md
- shared_detail_contract_009_ui_surface_v1_0_0_proposed.md
- shared_detail_contract_010_an_app_lang_v1_0_0_proposed.md
- shared_detail_contract_013_template_domain_v1_0_0_proposed.md
- shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md

Immediate deliverables:

- builder surface scope
- layout projection contract
- template fixture list
- ui e2e checklist

Implementation note:

Agent Codex implemented the first Agent 2 product_surface batch on behalf of
`agent_ui_application`. The owner remains `agent_ui_application`; final rendered
GUI and visual validation remain pending.

Priority backlog:

| Priority | Work | Parent Contract | Detail Contracts | Output |
| --- | --- | --- | --- | --- |
| p0 | review approved ui names and blocked names | parent_002 | contract_002, contract_009 | ui vocabulary conflict report |
| p0 | define builder entity model | parent_002 | contract_005, contract_009 | partial_implemented in `code_shared_product_surface_v3_0_0_draft.js` |
| p0 | define layout projection contract | parent_002 | contract_009 | partial_implemented with approved render profile mapping |
| p1 | build gui application builder scope | parent_002 | contract_007, contract_009, contract_010 | partial_implemented as product_surface plugin contract layer |
| p1 | define editor and command surfaces | parent_002 | contract_009, contract_010 | partial_implemented with command/editor/preview contracts |
| p1 | create production template fixture list | parent_008 | contract_001, contract_013, contract_014 | partial_implemented with six template files |
| p1 | define template validation path | parent_008 | contract_004, contract_013, contract_014 | partial_implemented with product_surface tests |
| p2 | responsive ui hardening checklist | parent_002 | contract_009, contract_014 | desktop/mobile visual validation plan |
| p2 | advanced layout parity | parent_002 | contract_009 | table, board, calendar, timeline, diagram, dashboard parity report |

## Agent 3: agent_lang_and_memory

Lane: language_and_knowledge
Priority ownership: p1 primary, p0 schema/name support, p2 learning
Proposal search command: `rg --files dot\proposal | rg "agent_3_agent_lang_and_memory"`

Assigned parent contracts:

- agent_3_agent_lang_and_memory_parent_005_an_app_lang_implementation_contract_v1_0_0_proposed.md
- agent_3_agent_lang_and_memory_parent_006_bot_agent_runtime_contract_v1_0_0_proposed.md
- agent_3_agent_lang_and_memory_parent_007_memory_knowledge_tree_system_contract_v1_0_0_proposed.md
- agent_3_agent_lang_and_memory_work_an_app_brain_correction_and_test_plan_v1_0_0_proposed.md

Reason:

This lane owns parsing, command understanding, bot runtime, memory, knowledge tree, source evidence, and improvement proposals.

Primary subcontracts:

- shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md
- shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- shared_detail_contract_003_entity_relationship_trait_v1_0_0_proposed.md
- shared_detail_contract_004_validation_utility_v1_0_0_proposed.md
- shared_detail_contract_007_workflow_pipeline_runner_v1_0_0_proposed.md
- shared_detail_contract_010_an_app_lang_v1_0_0_proposed.md
- shared_detail_contract_011_an_bot_agent_v1_0_0_proposed.md
- shared_detail_contract_012_an_memory_reasoning_v1_0_0_proposed.md
- shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md
- shared_detail_contract_017_agent_improvement_cycle_v1_0_0_proposed.md
- shared_detail_contract_018_knowledge_tree_v1_0_0_proposed.md
- shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

Immediate deliverables:

- language parser scope
- bot task lifecycle scope
- memory and knowledge tree scope
- An App Brain coordination scope
- evidence and adoption decision rules

Priority backlog:

| Priority | Work | Parent Contract | Detail Contracts | Output |
| --- | --- | --- | --- | --- |
| p0 | finish name governance scan | support all parents | contract_001, contract_002, contract_004 | banned/controlled name reconciliation report |
| p0 | define An App Brain v1.4 schema needs | parent_005, parent_006, parent_007 | contract_010, contract_011, contract_012, contract_019 | schema-first brain work report |
| p0 | correct An App Brain implementation/proposal mismatch | agent_3_agent_lang_and_memory_work_an_app_brain_correction_and_test_plan_v1_0_0_proposed.md | contract_004, contract_010, contract_011, contract_012, contract_014, contract_019 | ESM load, class/config/method style, schema alignment, and tests |
| p0 | define parser input/output records | parent_005 | contract_004, contract_010 | language_request, parsing_record, intent/entity extraction schema |
| p1 | implement An App Lang plan | parent_005 | contract_001, contract_002, contract_010, contract_014 | parser implementation plan and sample tests |
| p1 | define bot/agent runtime lifecycle | parent_006 | contract_007, contract_011, contract_012, contract_017 | bot_session, agent_task, approval gate lifecycle |
| p1 | define memory and knowledge-tree handoff | parent_007 | contract_012, contract_018, contract_019 | evidence, knowledge_node, coverage, decision schema |
| p1 | define controlled improve/evolve/mutate policy | parent_006, parent_007 | contract_017, contract_019 | score/seed/rollback/audit rules |
| p2 | source learning and knowledge-tree expansion | parent_007 | contract_015, contract_018 | source inventory and adoption report plan |
| p2 | agent improvement cycle hardening | parent_006 | contract_017 | improvement proposal validation suite |

## Three-Agent Priority Matrix

| Priority | agent_codex_an_app | agent_ui_application | agent_lang_and_memory |
| --- | --- | --- | --- |
| p0 | app shell boot, entity lifecycle, version schema, e2e catalog | ui names, builder entity model, layout projection rules | name governance, An App Brain schemas, parser records |
| p1 | repository read-only boundary, provider/storage/index integration, cross-agent review | builder scope, editor/command surfaces, production templates | An App Lang plan, bot lifecycle, memory/knowledge-tree handoff |
| p2 | workflow artifacts/logs, release gate automation | responsive hardening, advanced layout parity | source learning expansion, improvement-cycle hardening |

## Handover Packets

| Agent | Give This First | Also Give |
| --- | --- | --- |
| agent_codex_an_app | agent_1_agent_codex_an_app_parent_001_production_app_shell_contract_v1_0_0_partial_implemented.md | agent_1_agent_codex_an_app_parent_003_version_system_implementation_contract_v1_0_0_partial_implemented.md, agent_1_agent_codex_an_app_parent_004_repository_operations_implementation_contract_v1_0_0_partial_implemented.md, agent_1_agent_codex_an_app_parent_009_real_app_e2e_validation_contract_v1_0_0_partial_implemented.md, contract_004, contract_005, contract_006, contract_014 |
| agent_ui_application | agent_2_agent_ui_application_parent_002_gui_application_builder_contract_v1_0_0_partial_implemented.md | agent_2_agent_ui_application_parent_008_production_templates_contract_v1_0_0_partial_implemented.md, contract_009, contract_013, active master docs |
| agent_lang_and_memory | agent_3_agent_lang_and_memory_work_an_app_brain_correction_and_test_plan_v1_0_0_proposed.md | agent_3_agent_lang_and_memory_work_an_app_brain_v1_4_0_proposed.md, agent_3_agent_lang_and_memory_work_name_governance_banned_words_v1_0_0_proposed.md, agent_3_agent_lang_and_memory_parent_005_an_app_lang_implementation_contract_v1_0_0_proposed.md, agent_3_agent_lang_and_memory_parent_006_bot_agent_runtime_contract_v1_0_0_proposed.md, agent_3_agent_lang_and_memory_parent_007_memory_knowledge_tree_system_contract_v1_0_0_proposed.md, contract_010, contract_011, contract_012, contract_017, contract_018, contract_019 |

## Shared Agent Rules

- Every contract and handoff must name the assigned agent.
- Every agent must search `dot\proposal` for its agent number and agent name
  before starting work.
- Agent-owned proposal filenames must include agent number and agent name.
- Planning, proposal, report, template, and handoff filenames should preserve
  status and version where practical.
- Everything durable or governable is an entity.
- No new or similar active names without user authorization.
- Reuse approved names before proposing a new name.
- Keep public names snake_case.
- Work utility first, then plugin, then dataset/schema/docs/log/test.
- Every changed utility, plugin, dataset, or contract needs docs and logs.
- Use shared inbox for conflicts, proposed names, and handoff notes.
- Do not claim e2e readiness from unit tests alone.
- Before editing, cross-check the current conversation, master docs, policy docs,
  parent contract, detail contracts, and shared inbox for convention violations,
  banned names, pending decisions, and user corrections.

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

These dependencies are integration boundaries, not start blockers. A consumer
agent must write the expected port methods, fixture shape, and skipped-real-port
reason in its handoff.

## Handoff Protocol

Each agent handoff must include:

- acting agent name
- assigned owner agent name
- parent contract id
- related detail contract ids
- current conversation cross-check result
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
- each detail contract has owner agent and owner domain
- each handoff reports conversation cross-check status
- 3 agents have clear, non-overlapping primary lanes
- cross-lane dependencies are explicit
