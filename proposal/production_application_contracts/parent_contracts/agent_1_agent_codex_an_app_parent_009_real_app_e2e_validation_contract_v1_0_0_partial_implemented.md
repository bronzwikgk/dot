# Parent Contract 009: Real App E2E Validation

Status: partial_implemented
Priority: p0
Owner agent: agent_codex_an_app
Delivery lane: foundation_and_runtime

## Goal

Define and run production-grade validation for the real An App build across shell boot, builder usage, language parsing, entity mutation, workflow execution, versioning, repository operations, memory, templates, and ui behavior.

## Subcontracts

- ../shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md
- ../shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- ../shared_detail_contract_004_validation_utility_v1_0_0_proposed.md
- ../shared_detail_contract_005_action_entity_boundary_v1_0_0_proposed.md
- ../shared_detail_contract_006_version_system_v1_0_0_proposed.md
- ../shared_detail_contract_007_workflow_pipeline_runner_v1_0_0_proposed.md
- ../shared_detail_contract_009_ui_surface_v1_0_0_proposed.md
- ../shared_detail_contract_010_an_app_lang_v1_0_0_proposed.md
- ../shared_detail_contract_011_an_bot_agent_v1_0_0_proposed.md
- ../shared_detail_contract_012_an_memory_reasoning_v1_0_0_proposed.md
- ../shared_detail_contract_013_template_domain_v1_0_0_proposed.md
- ../shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md
- ../shared_detail_contract_016_repository_operations_v1_0_0_proposed.md
- ../shared_detail_contract_017_agent_improvement_cycle_v1_0_0_proposed.md
- ../shared_detail_contract_018_knowledge_tree_v1_0_0_proposed.md
- ../shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## Required Output

- e2e scenario catalog
- test data fixtures
- smoke test suite
- generated test suite
- ui validation checklist
- regression gate checklist
- release readiness report

## Success Criteria

- app shell boots from a valid application entity
- invalid inputs fail with structured errors
- builder creates and edits application entities
- parser creates executable structured records only after validation
- workflows execute with audit records
- version and conflict behavior works
- templates generate valid apps
- ui checks pass on desktop and mobile
- final report lists tests, risks, skipped items, and commit message

## Implementation Evidence

- `reports/foundation_and_runtime/agent_1_agent_codex_an_app_e2e_catalog_v1_0_0_draft.md`
- `test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs`

Validation passed on 2026-08-25 for 7 automated tests covering 11 foundation
scenarios in the first Agent 1 foundation catalog.

## Do Not

- do not claim production readiness from unit tests alone
- do not hide skipped tests
- do not test only successful paths
