# Parent Contract 008: Production Templates

Status: proposed
Priority: p1
Owner agent: agent_ui_application
Delivery lane: product_surface

## Goal

Create production-ready templates for business domains and sample pipelines, including LMS, fintech organization management, single-user workspace, app builder flows, research workflows, and automation jobs.

## Subcontracts

- ../contract_001_dataset_registry_contract.md
- ../contract_002_vocabulary_and_name_reconciliation_contract.md
- ../contract_004_validation_utility_contract.md
- ../contract_009_ui_surface_contract.md
- ../contract_013_template_domain_contract.md
- ../contract_014_quality_audit_e2e_contract.md

## Required Output

- template schema
- LMS template
- fintech organization template
- single-user workspace template
- research workflow template
- automation workflow template
- application builder template
- template validation fixtures

## Success Criteria

- templates can generate valid application entities
- templates use approved datasets and names
- templates include routes, views, layouts, policies, and sample data
- templates include expected workflows and tests
- templates can be edited through the builder surface

## Do Not

- do not create template-only behavior outside entity lifecycle
- do not use domain sample data as production truth
- do not skip validation fixtures
