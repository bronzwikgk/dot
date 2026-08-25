# Contract 009: UI Surface

Status: proposed
Priority: p1
Owner domain: ui_surface
Owner agent: agent_ui_application
Work items: work_011, work_012, work_013, work_014, work_018, work_019

## Purpose

Define how the same entity data renders through approved layouts and editor surfaces.

## Approved Surface Families

- notebook
- code_editor
- block_editor
- table
- board
- calendar
- timeline
- dashboard
- diagram
- canvas
- website_builder
- parser_workbench

## Required Records

- render_profile
- layout_node
- component
- route
- view
- book
- cell
- ui_state
- design_token
- interaction record

## Validation

- layout name is approved
- component name is approved
- event/action name is approved
- block names map to approved block names
- product layout names are not mixed with CSS layout techniques
- same data can render in multiple profiles without mutating source entity

## Success Criteria

- book/cell are entities
- state is entity-backed
- shell interactions are specified
- app-shell panel behavior is covered
- ui datasets cover components, events, layouts, style tokens, states, and interactions

## Do Not

- do not adopt product names as active layout names without approval
- do not create hidden ui state outside entities
