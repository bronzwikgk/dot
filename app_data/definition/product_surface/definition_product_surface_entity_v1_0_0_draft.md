# Product Surface Entity Definition

Date: 2026-08-25
Status: draft
Owner agent: agent_ui_application
Implemented by: agent_codex_an_app

## Purpose

Define the first product_surface entity set for the application builder.

## Entity Types

- `application`
- `book`
- `cell`
- `view`
- `route`
- `command`
- `layout_node`
- `render_profile`
- `template`
- `state`
- `workflow`
- `policy`

## Rules

- each durable item is an entity
- state is an entity
- book and cell are entities, not separate manager plugins
- route paths must start with `/`
- view layout and render profile names must come from approved datasets
- product_surface may use mock ports until final integration

## Related Files

- `code/plugins/code_shared_product_surface_v3_0_0_draft.js`
- `app_data/dataset/product_surface/dataset_product_surface_entity_type_v1_0_0_draft.json`
- `app_data/datamap/product_surface/datamap_product_surface_entity_relationship_v1_0_0_draft.json`
- `app_data/data_table/product_surface/data_table_product_surface_entity_field_v1_0_0_draft.csv`
