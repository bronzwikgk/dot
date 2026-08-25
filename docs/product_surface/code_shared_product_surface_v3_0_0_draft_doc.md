# Product Surface Plugin

Date: 2026-08-25
Status: draft
Owner agent: agent_ui_application
Implemented by: agent_codex_an_app

## What It Is

`product_surface` is the first application-builder plugin for the Agent 2 lane.
It defines the builder-facing entity model, template expansion, layout
projection, command surface, editor surface, preview path, and ui e2e checklist.

## What It Does

- validates application entities
- validates production template records
- registers and lists templates
- expands a template into an application entity and related entities
- projects the same entity into approved render profiles
- creates command/editor/preview surface contracts
- validates product_surface datasets

## When To Use

Use this plugin when building the GUI/application-builder surface before final
Agent 1 and Agent 3 integration is ready.

## Dependency Boundary

The plugin works with mock ports:

- `entity_store_port`
- `runner_port`
- `command_intent_port`
- `template_port`
- `version_port`

It does not import Agent 1 or Agent 3 concrete modules.

## Related App Data

- `app_data/dataset/product_surface/dataset_product_surface_entity_type_v1_0_0_draft.json`
- `app_data/dataset/product_surface/dataset_product_surface_template_domain_v1_0_0_draft.json`
- `app_data/dataset/product_surface/dataset_product_surface_mock_port_v1_0_0_draft.json`
- `app_data/datamap/product_surface/datamap_product_surface_entity_relationship_v1_0_0_draft.json`
- `app_data/data_table/product_surface/data_table_product_surface_entity_field_v1_0_0_draft.csv`
- `app_data/definition/product_surface/definition_product_surface_entity_v1_0_0_draft.md`
- `app_data/definition/product_surface/definition_product_surface_template_v1_0_0_draft.md`

## Templates

- `template_product_surface_lms_v1_0_0_draft.json`
- `template_product_surface_fintech_organization_v1_0_0_draft.json`
- `template_product_surface_single_user_workspace_v1_0_0_draft.json`
- `template_product_surface_research_workflow_v1_0_0_draft.json`
- `template_product_surface_automation_workflow_v1_0_0_draft.json`
- `template_product_surface_application_builder_v1_0_0_draft.json`

## How Tested

Run:

```powershell
node --test test\product_surface\agent_codex_an_app_agent_2_product_surface_v1_0_0_test.mjs
```

Tests cover dataset validation, template registration, template expansion,
invalid route rejection, multi-layout projection, and command/editor/preview
contracts.

## Known Limits

- this is a contract-level product surface, not a rendered browser UI
- final desktop/mobile visual validation remains pending
- real Agent 1 and Agent 3 ports are not bound yet
