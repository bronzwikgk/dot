# Parent Contract 001: Production App Shell

Status: partial_implemented
Priority: p0
Owner agent: agent_codex_an_app
Delivery lane: foundation_and_runtime

## Goal

Build the default An App shell that can load an application entity, config, datasets, routes, views, templates, policies, workflows, providers, version records, and audit output.

## Subcontracts

- ../shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md
- ../shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- ../shared_detail_contract_003_entity_relationship_trait_v1_0_0_proposed.md
- ../shared_detail_contract_004_validation_utility_v1_0_0_proposed.md
- ../shared_detail_contract_005_action_entity_boundary_v1_0_0_proposed.md
- ../shared_detail_contract_006_version_system_v1_0_0_proposed.md
- ../shared_detail_contract_007_workflow_pipeline_runner_v1_0_0_proposed.md
- ../shared_detail_contract_008_provider_storage_index_v1_0_0_proposed.md
- ../shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md

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

## Implementation Evidence

- `code/plugins/code_shared_app_shell_v3_0_0_draft.js`
- `docs/foundation_and_runtime/code_shared_app_shell_v3_0_0_draft_doc.md`
- `test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs`

Validation passed on 2026-08-25 for valid boot, invalid config rejection,
duplicate child rejection, route path validation, and invalid workflow plan
rejection.

## Completed Scope

- application entity boot validation
- config shape validation
- child id uniqueness validation
- route path validation
- workflow plan boundary validation
- boot audit record creation
- entity-first state boundary documented

## Pending Integration Scope

- bind real Agent 2 product_surface routes, views, layout projections, and
  template entities after Agent 2 fixture tests pass
- bind real Agent 3 command intent, language, memory, and brain ports after
  Agent 3 correction tests pass
- run full real app e2e validation after both integration lanes publish handoff
  notes

## Required Validation Command

```powershell
node --test test\foundation_and_runtime\agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs
```

## Handoff Status

Agent 1 foundation shell contract is ready for commit as partial implementation.
It must not be described as full product readiness until Agent 2 and Agent 3
ports are integrated and parent_009 real app e2e passes.

## Do Not

- do not add a separate state manager when state can be an entity
- do not add new product names without authorization
- do not bypass `action_entity` for durable records
