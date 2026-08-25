# V4 Contract 005: Layout Parity

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_033

## Goal

Render the same entity data through all approved layouts without changing the
underlying entity.

## Required Layouts

- notebook
- code_editor
- block_editor
- tree
- table
- board
- calendar
- timeline
- diagram
- dashboard

## Required Methods

- create_layout_projection(config)
- validate_layout_name(config)
- render_layout(config)
- switch_layout(config)
- compare_layout_output(config)

## Success Criteria

- layout names come from approved datasets
- same entity id is preserved across all layouts
- layout switch does not mutate source entity
- each layout has static and browser validation

## Tests

- layout projection tests
- no-mutation tests
- browser layout parity e2e

## Do Not

- do not use reference product names as active layout names
- do not create one-off layout names outside the dataset
