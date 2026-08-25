# UI Surface Domain Requirements

## Purpose

The UI Surface domain owns how the same data can be viewed, edited, navigated, and reviewed through different layouts.

## Scope

This domain includes:

- layouts
- render profiles
- editor surfaces
- input surfaces
- panels
- view switching
- accessibility states
- keyboard commands
- preview states
- responsive behavior

## Core Requirement

The same entity data should be viewable through multiple approved layouts without changing the underlying record.

Examples:

- JSON data in a code editor
- JSON data as a collapsible tree
- JSON data as a document view
- JSON data as a diagram
- JSON data as a dashboard
- workflow data as a flowchart
- entity records as table, card, kanban, calendar, or timeline views

## Canonical Layout Names

Preferred layout names should come from `ui_word_datasets.js`.

Important layout families:

- notebook
- code_editor
- block_editor
- document_view
- collapsible_tree
- diagram
- dashboard
- table_view
- list_view
- gallery_view
- card_view
- kanban_view
- calendar_view
- timeline_view
- canvas_view
- form_view
- chat_view
- workflow_canvas
- website_builder
- database_view
- chart_view
- split_view
- diff_view
- parser_workbench
- language_workbench

## Block Types

Block editor and document layouts should support a broad block catalog.

Content blocks:

- paragraph
- heading_1
- heading_2
- heading_3
- bulleted_list
- numbered_list
- checklist
- toggle
- quote
- callout
- divider
- code_block
- equation
- table
- image
- video
- audio
- file
- bookmark
- embed

Knowledge blocks:

- page_reference
- block_reference
- backlink
- relation
- property
- tag
- mention
- comment
- footnote
- citation

Database/view blocks:

- database
- table_view
- list_view
- board_view
- kanban_view
- calendar_view
- timeline_view
- gallery_view
- chart_view
- form_view
- dashboard_view

Application blocks:

- command_block
- workflow_block
- pipeline_block
- entity_block
- schema_block
- dataset_block
- policy_block
- template_block
- experiment_block
- output_block
- preview_block
- audit_block

Each block should be an entity or entity-backed view model with id, type,
content, properties, relationships, source, validation state, and render
policy.

## Input Surfaces

Approved input surfaces should include:

- command_bar
- prompt_panel
- chat_panel
- form_panel
- table_editor
- tree_editor
- code_editor
- block_editor
- file_drop_zone
- search_panel
- settings_panel

## Navigation Surfaces

Navigation should support:

- workspace switcher
- project switcher
- application switcher
- sidebar tree
- page tree
- block tree
- entity explorer
- file explorer
- collection explorer
- breadcrumb
- tab bar
- command palette
- quick switcher
- search results
- backlink panel
- graph view
- canvas zoom into node
- previous/next history
- recently opened list
- pinned items
- favorites

Navigation records should preserve target entity, source surface, route,
parameters, user role, and audit context when governed records are opened.

## Render Profile Contract

A render profile must define:

- layout
- data type
- allowed interactions
- read/write mode
- validation behavior
- empty state
- error state
- accessibility requirements

## Component States

Every interactive UI component should define state behavior.

Required state names:

- idle
- focused
- hovered
- active
- selected
- editing
- dragging
- resizing
- connecting
- loading
- empty
- dirty
- saving
- saved
- validating
- valid
- warning
- error
- blocked
- disabled
- read_only
- pending_approval
- running
- completed
- failed
- cancelled
- archived

State records should declare visual treatment, allowed commands, shortcut
availability, validation behavior, and accessibility label behavior.

## Autosuggest And Autocorrect

An App should support suggestion behavior without silently changing governed
records.

Autosuggest should support:

- command suggestions
- approved name suggestions
- block type suggestions
- property suggestions
- relation suggestions
- template suggestions
- schema field suggestions
- dataset value suggestions
- route suggestions
- workflow node suggestions
- shortcut suggestions
- setting suggestions

Autocorrect should support:

- spelling correction suggestions
- near-match approved-name suggestions
- banned-word replacement suggestions
- casing and separator correction
- synonym-to-approved-name correction
- missing-slot suggestions
- incomplete-command suggestions

Rules:

- suggestions are previewed before mutation
- corrections are not auto-applied to approved vocabulary without policy
- accepted corrections create learning records
- rejected corrections remain auditable
- low-confidence suggestions require clarification or review

## Settings And Preferences

UI settings should be entity-backed and schema-validated.

Setting groups:

- appearance
- theme
- density
- layout
- accessibility
- keyboard_shortcuts
- editor
- block_editor
- code_editor
- canvas
- workflow_canvas
- table_view
- dashboard
- notifications
- autosuggest
- autocorrect
- validation
- audit_visibility

Common settings:

- theme mode
- font size
- density
- sidebar position
- panel position
- default layout
- default view for data type
- keyboard shortcuts enabled
- reduce motion
- enhanced accessibility labels
- autosuggest enabled
- autocorrect enabled
- require approval before correction
- show diagnostics
- show audit panel
- autosave interval
- restore last session

## View Switching Contract

View switching must:

- preserve the same data reference
- avoid silent data loss
- explain unsupported fields
- record conversion warnings
- keep audit state visible when editing governed records

## Dataset Updates Needed

- Add input surface names to UI datasets.
- Add render view aliases so similar names resolve to one approved name.
- Add accessibility state names.
- Add interaction state names.
- Add preview state names.
- Add semantic HTML tag names, tag category names, singleton tag names, and tag relationship rules for layout-tree validation.
- Add UI compiler stage names: decompose, parse, transform, reason, resolve, compose, inject.
- Add layout node type names such as element, text, repeater, template, slot, and fragment.
- Add route segment names such as user_type, book_id, cell_id, view_id, entity_id, project_id, and application_id.
- Add design token names and lifecycle state names for token validation and render state tracking.
- Add UI event, input, and output type names for interaction validation.

## Semantic UI Compiler Pattern

The `gui_v2` learning adds a compiler-style UI pattern:

`decompose -> parse -> transform -> reason -> resolve -> compose -> inject`

This should be treated as a UI-specific version of the broader An App pipeline. `inject` means mounting a composed view into a runtime viewport. It should map to display/mount behavior and does not need to become a separate universal doctrine stage.

Compiler inputs:

- layout tree
- content labels
- design tokens
- data records
- route context
- tag ontology

Compiler outputs:

- rendered view artifact
- lifecycle state
- diagnostics
- audit record

## Layout Tree Contract

A layout tree node should define:

- `id`
- `node_type`
- `tag`
- `attributes`
- `content`
- `children`
- `data_path`
- `template`
- `state_refs`
- `policy_refs`

`repeater` nodes must include `data_path` and `template`. Placeholders must resolve before display. Failed resolution should produce diagnostics instead of silent blank output.

## Semantic Tag Ontology

HTML tag usage should be validated by approved datasets and relationship maps where possible.

Required ontology concepts:

- tag name
- tag category
- allowed parent-child relationship
- singleton constraint
- attribute type
- event type

The source learning supports categories such as document_section, block_text, inline_text, tabular_grid, ordered_unordered_list, form_input, interactive_action, interactive_element, media_embed, layout_container, navigation_bar, page_metadata, web_component, and metadata_element.

Classless semantic CSS can be supported as a render policy for generated UI templates. It should not be a global requirement for every application because some applications may need component-library class names or framework-specific attributes.
