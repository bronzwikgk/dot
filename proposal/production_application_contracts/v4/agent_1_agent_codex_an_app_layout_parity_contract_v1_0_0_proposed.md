# V4 Contract 005: Layout Parity

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Priority: p0
Domain: product_surface

## Purpose

Define all approved layout projections and visual validation for notebook, code editor, block editor, tree, table, board, calendar, timeline, diagram, and dashboard.

## Required Records

- layout_profile_record
- render_profile_record
- layout_dataset_record
- layout_validation_record

## Required Operations

- render_layout
- validate_layout
- switch_layout
- export_layout

## Inputs

- entity_data
- layout_type
- render_profile

## Outputs

- layout_profile_record
- layout_validation_record

## Validation

- same entity data renders in every approved layout
- layout switching preserves data
- responsive layouts work on desktop and mobile

## Success Criteria

- notebook layout works
- code editor layout works
- block editor layout works
- tree layout works
- table layout works
- board layout works
- calendar layout works
- timeline layout works
- diagram layout works
- dashboard layout works

## Do

- use entity doctrine for layout records
- preserve data across layout switches
- validate responsive behavior

## Do Not

- do not lose data on layout switch
- do not bypass responsive validation
- do not hardcode layout-specific logic
