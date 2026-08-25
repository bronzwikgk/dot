# Parent Contract 002: Gui Application Builder

Status: proposed
Priority: p1
Owner agent: agent_ui_application
Delivery lane: product_surface

## Goal

Build the application-builder surface inspired by the reference GUI and app shell sources, using An App entities for books, cells, routes, views, layouts, commands, flows, and state.

## Subcontracts

- ../contract_002_vocabulary_and_name_reconciliation_contract.md
- ../contract_005_action_entity_boundary_contract.md
- ../contract_007_workflow_pipeline_runner_contract.md
- ../contract_009_ui_surface_contract.md
- ../contract_010_an_app_lang_contract.md
- ../contract_013_template_domain_contract.md
- ../contract_014_quality_audit_e2e_contract.md

## Required Output

- builder shell view
- layout projection selector
- book/cell entity rendering
- command palette contract
- editor surface contract
- app preview path
- ui e2e test checklist

## Success Criteria

- same data can render in multiple approved layouts
- book, cell, component, view, route, and state remain entities
- workflows can be created and inspected visually
- ui uses approved layout/block/action names
- responsive desktop and mobile checks pass

## Do Not

- do not use reference product names as active names
- do not create nested decorative card layouts
- do not create a separate book or cell manager unless authorized
