# Parent Contract 009: Real App E2E Validation

Status: proposed
Priority: p0
Owner agent: agent_codex_an_app
Delivery lane: foundation_and_runtime

## Goal

Define and run production-grade validation for the real An App build across shell boot, builder usage, language parsing, entity mutation, workflow execution, versioning, repository operations, memory, templates, and ui behavior.

## Subcontracts

- ../contract_001_dataset_registry_contract.md
- ../contract_002_vocabulary_and_name_reconciliation_contract.md
- ../contract_004_validation_utility_contract.md
- ../contract_005_action_entity_boundary_contract.md
- ../contract_006_version_system_contract.md
- ../contract_007_workflow_pipeline_runner_contract.md
- ../contract_009_ui_surface_contract.md
- ../contract_010_an_app_lang_contract.md
- ../contract_011_an_bot_agent_contract.md
- ../contract_012_an_memory_reasoning_contract.md
- ../contract_013_template_domain_contract.md
- ../contract_014_quality_audit_e2e_contract.md
- ../contract_016_repository_operations_contract.md
- ../contract_017_agent_improvement_cycle_contract.md
- ../contract_018_knowledge_tree_contract.md
- ../contract_019_an_app_brain_domain_contract.md

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

## Do Not

- do not claim production readiness from unit tests alone
- do not hide skipped tests
- do not test only successful paths
