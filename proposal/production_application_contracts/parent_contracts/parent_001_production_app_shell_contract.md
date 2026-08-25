# Parent Contract 001: Production App Shell

Status: proposed
Priority: p0
Owner agent: agent_codex_an_app
Delivery lane: foundation_and_runtime

## Goal

Build the default An App shell that can load an application entity, config, datasets, routes, views, templates, policies, workflows, providers, version records, and audit output.

## Subcontracts

- ../contract_001_dataset_registry_contract.md
- ../contract_002_vocabulary_and_name_reconciliation_contract.md
- ../contract_003_entity_relationship_trait_contract.md
- ../contract_004_validation_utility_contract.md
- ../contract_005_action_entity_boundary_contract.md
- ../contract_006_version_system_contract.md
- ../contract_007_workflow_pipeline_runner_contract.md
- ../contract_008_provider_storage_index_contract.md
- ../contract_014_quality_audit_e2e_contract.md

## Required Output

- app_shell entity schema
- application entity boot path
- config loading policy
- route/view registration path
- provider loading boundary
- version and audit hooks
- smoke test that boots a sample application

## Success Criteria

- shell starts from an application entity
- invalid config fails before runtime work
- routes and views are entities
- state is stored through approved entity behavior
- boot audit record is created
- all names pass vocabulary checks

## Do Not

- do not add a separate state manager when state can be an entity
- do not add new product names without authorization
- do not bypass `action_entity` for durable records
