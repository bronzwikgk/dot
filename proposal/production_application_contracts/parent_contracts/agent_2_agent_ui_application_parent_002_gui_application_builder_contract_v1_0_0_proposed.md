# Parent Contract 002: Gui Application Builder

Status: proposed
Priority: p1
Owner agent: agent_ui_application
Delivery lane: product_surface

## Goal

Build the application-builder surface inspired by the reference GUI and app shell sources, using An App entities for books, cells, routes, views, layouts, commands, flows, and state.

## Subcontracts

- ../shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- ../shared_detail_contract_005_action_entity_boundary_v1_0_0_proposed.md
- ../shared_detail_contract_007_workflow_pipeline_runner_v1_0_0_proposed.md
- ../shared_detail_contract_009_ui_surface_v1_0_0_proposed.md
- ../shared_detail_contract_010_an_app_lang_v1_0_0_proposed.md
- ../shared_detail_contract_013_template_domain_v1_0_0_proposed.md
- ../shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md

## Required Output

- builder shell view
- layout projection selector
- book/cell entity rendering
- command palette contract
- editor surface contract
- app preview path
- ui e2e test checklist

## Dependency Isolation

Agent 2 must not wait for Agent 1 runtime code or Agent 3 language code before
starting product_surface work. Agent 2 works contract-first against stable ports,
fixtures, and sample records.

Allowed mock ports:

- `entity_store_port` for create, read, update, remove, query, normalize, and
  validate entity behavior
- `runner_port` for workflow plan preview, stage execution result, skipped stage,
  failed stage, and completed run records
- `command_intent_port` for parsed command, intent, entity reference, slot, and
  confidence records
- `template_port` for template lookup, template clone, template validation, and
  template-to-entity expansion
- `version_port` for save point, diff, branch, merge preview, conflict, and
  restore labels

Agent 2 owns the builder-facing entity model for application, book, cell, view,
route, command, layout_node, render_profile, template, and state. These records
must be usable with mock ports first, then real Agent 1 and Agent 3 ports later.

Agent 2 must not import Agent 1 or Agent 3 concrete modules in the first product
surface pass. Final integration may bind real ports after their owners publish
compatible methods and tests.

## Success Criteria

- same data can render in multiple approved layouts
- book, cell, component, view, route, and state remain entities
- workflows can be created and inspected visually
- ui uses approved layout/block/action names
- responsive desktop and mobile checks pass
- product_surface tests pass with mock ports before real integration
- integration handoff lists exact Agent 1 and Agent 3 methods required

## Do Not

- do not use reference product names as active names
- do not create nested decorative card layouts
- do not create a separate book or cell manager unless authorized
- do not block on Agent 1 or Agent 3 implementation when a fixture can represent
  the missing behavior
