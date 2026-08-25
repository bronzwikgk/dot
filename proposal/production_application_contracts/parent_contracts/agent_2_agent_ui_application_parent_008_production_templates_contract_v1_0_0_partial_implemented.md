# Parent Contract 008: Production Templates

Status: partial_implemented
Priority: p1
Owner agent: agent_ui_application
Delivery lane: product_surface

## Goal

Create production-ready templates for business domains and sample pipelines, including LMS, fintech organization management, single-user workspace, app builder flows, research workflows, and automation jobs.

## Subcontracts

- ../shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md
- ../shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- ../shared_detail_contract_004_validation_utility_v1_0_0_proposed.md
- ../shared_detail_contract_009_ui_surface_v1_0_0_proposed.md
- ../shared_detail_contract_013_template_domain_v1_0_0_proposed.md
- ../shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md

## Required Output

- template schema
- LMS template
- fintech organization template
- single-user workspace template
- research workflow template
- automation workflow template
- application builder template
- template validation fixtures

## Dependency Isolation

Agent 2 may create production template fixtures before Agent 1 and Agent 3 finish
their implementations. Templates must target stable entity contracts and mock
ports first.

Allowed fixture inputs:

- application, book, cell, route, view, layout_node, state, command, workflow,
  template, and policy entities
- parsed command fixture records from `command_intent_port`
- workflow preview fixture records from `runner_port`
- version label fixture records from `version_port`
- validation fixture records from `entity_store_port` and `template_port`

Templates must record their unresolved integration assumptions in the handoff.
Final e2e validation may wait for Agent 1 and Agent 3, but template definition,
template samples, and template validation fixtures must proceed independently.

## Success Criteria

- templates can generate valid application entities
- templates use approved datasets and names
- templates include routes, views, layouts, policies, and sample data
- templates include expected workflows and tests
- templates can be edited through the builder surface
- templates validate against mock ports without concrete Agent 1 or Agent 3 code
- final integration needs are listed as explicit port-method requirements

## Implementation Evidence

- `templates/product_surface/template_product_surface_lms_v1_0_0_draft.json`
- `templates/product_surface/template_product_surface_fintech_organization_v1_0_0_draft.json`
- `templates/product_surface/template_product_surface_single_user_workspace_v1_0_0_draft.json`
- `templates/product_surface/template_product_surface_research_workflow_v1_0_0_draft.json`
- `templates/product_surface/template_product_surface_automation_workflow_v1_0_0_draft.json`
- `templates/product_surface/template_product_surface_application_builder_v1_0_0_draft.json`
- `code/plugins/code_shared_product_surface_v3_0_0_draft.js`
- `test/product_surface/agent_codex_an_app_agent_2_product_surface_v1_0_0_test.mjs`

## Completed Scope

- template schema through plugin validation
- LMS template
- fintech organization template
- single-user workspace template
- research workflow template
- automation workflow template
- application builder template
- template validation fixtures

## Pending Integration Scope

- editable rendered template UI
- generated app e2e validation through real app shell
- real Agent 1 and Agent 3 port binding

## Do Not

- do not create template-only behavior outside entity lifecycle
- do not use domain sample data as production truth
- do not skip validation fixtures
- do not wait for language parsing or runtime storage when fixture records can
  represent the needed contract
