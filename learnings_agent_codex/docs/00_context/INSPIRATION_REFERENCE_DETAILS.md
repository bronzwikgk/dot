# Inspiration Reference Details

## Purpose

This document captures API contracts, schemas, feature patterns, datasets, and
learning targets from inspiration software and related open-source projects.

It is not a dependency decision. It is a reference library for later design.

## Completeness Evaluation

Current status: partial but useful.

Covered well:

- major inspiration sources
- high-level feature patterns
- public API/contract learning where easy to identify
- schema ideas
- dataset backlog
- UI panels and surfaces
- shortcut and setting contracts
- canvas, workflow, editor, parser, rules, and knowledge graph references

Previously underdefined and now expanded:

- Notion-like block types
- database view types such as table, list, board, kanban, calendar, timeline,
  gallery, chart, form, and dashboard
- user navigation surfaces
- component states
- autosuggest and autocorrect behavior
- UI setting groups and common preferences

Still incomplete:

- exact shortcut tables for every inspiration product
- exact settings schema for every inspiration product
- full API endpoint inventory for each open-source project
- full source-code schema extraction from repositories
- accessibility behavior per component
- collaboration state and conflict resolution per product
- mobile navigation patterns
- offline/sync conflict states
- permission model comparison
- plugin/extension lifecycle comparison
- import/export format comparison

Decision:

- this doc is complete enough as a first-pass learning reference
- it is not complete enough to be treated as a full product parity matrix
- next step should be a feature matrix and schema matrix, not more prose only

## Editor Workspace References

### Visual Studio Code

Sources:

- https://github.com/microsoft/vscode
- https://code.visualstudio.com/api
- https://code.visualstudio.com/api/references/contribution-points
- https://code.visualstudio.com/api/references/vscode-api
- https://github.com/microsoft/vscode-extension-samples

Feature patterns:

- command palette
- file explorer
- tabbed editors
- side panels
- status bar
- diagnostics
- diff editor
- source control view
- extension marketplace
- extension activation lifecycle

API/contract learning:

- extension manifest declares contribution points in `package.json`
- contribution points register commands, menus, keybindings, languages,
  debuggers, views, walkthroughs, themes, snippets, and configuration
- runtime API exposes namespaces for window, workspace, commands, languages,
  authentication, debug, scm, tasks, and extensions

Schema ideas for An App:

- `extension_capability`
- `command_contribution`
- `view_contribution`
- `menu_contribution`
- `keybinding_contribution`
- `diagnostic_record`
- `editor_tab`
- `workspace_folder`

Dataset ideas:

- editor_panel_names
- contribution_point_names
- diagnostic_level_names
- source_control_action_names
- editor_command_names

### Monaco Editor

Sources:

- https://github.com/microsoft/monaco-editor

Feature patterns:

- embeddable code editor
- editor model
- markers/diagnostics
- completion providers
- custom languages
- syntax highlighting
- diff editor

API/contract learning:

- editor content is held in models
- diagnostics are attached to models as markers
- completion, hover, and language services are provider-based
- editor instances should be separate from document records

Schema ideas:

- `editor_model`
- `model_marker`
- `completion_item`
- `language_provider`
- `diff_model`

## Knowledge Workspace References

### AppFlowy

Sources:

- https://github.com/appflowy-io/appflowy
- https://docs.appflowy.io/docs
- https://appflowy-io-appflowy.mintlify.app/core/databases
- https://github.com/AppFlowy-IO/AppFlowy-Docs/blob/main/essential-documentation/contribute-to-appflowy/architecture/backend/database.md

Feature patterns:

- docs
- wiki
- projects
- database views
- templates
- collaboration
- data ownership
- desktop/mobile/browser support

Schema/API learning:

- databases can be shown as multiple views over the same data
- common view types include grid, board, and calendar
- field types include text, number, date, tag, checkbox, and related practical
  workspace fields
- storage architecture uses local database concepts and schema migrations

Schema ideas:

- `workspace`
- `document`
- `database`
- `database_field`
- `database_row`
- `database_view`
- `template_record`

Dataset ideas:

- database_view_type_names
- database_field_type_names
- workspace_app_type_names

### AFFiNE

Sources:

- https://github.com/toeverything/affine
- https://docs.affine.pro/
- https://github.com/toeverything/AFFiNE/discussions/6052

Feature patterns:

- docs
- whiteboards
- databases
- templates
- local-first workspace
- self-hosting
- knowledge base plus planning

API/contract learning:

- backend uses layered API surfaces such as GraphQL, REST, WebSocket sync, and
  CRDT/Yjs-based collaboration
- workspace, document, database, table, comment, and tag records are useful
  concepts for An App
- document and whiteboard should be different layouts over structured records

Schema ideas:

- `workspace`
- `doc_record`
- `whiteboard_record`
- `database_record`
- `comment_record`
- `tag_record`
- `sync_record`

### Logseq

Sources:

- https://github.com/logseq/logseq
- https://github.com/logseq/plugins
- https://logseq.github.io/plugins/
- https://github.com/logseq/docs/blob/master/db-version-changes.md

Feature patterns:

- outliner
- pages and blocks
- backlinks
- graph view
- Markdown/Org files
- plugin API
- tasks and knowledge workflows

API/contract learning:

- blocks and pages can be treated as unified graph nodes
- plugin API exposes extension points for blocks, pages, UI, and graph data
- raw markdown can remain source of truth while enhanced views edit it

Schema ideas:

- `page_node`
- `block_node`
- `backlink_record`
- `graph_node`
- `graph_edge`
- `plugin_record`

### Outline

Sources:

- https://github.com/outline/outline
- https://www.getoutline.com/developers
- https://docs.getoutline.com/s/guide/doc/api-1rEIXDfLF6
- https://docs.getoutline.com/s/guide/doc/collections-l9o3LD22sV

Feature patterns:

- team knowledge base
- nested collections
- documents
- search
- permissions
- comments
- public/private sharing

API/contract learning:

- API is RPC-style and supports programmatic interaction with workspace data
- collections group documents and are permission boundaries
- useful operations include create/read/update/archive/restore/search
  documents and manage collections

Schema ideas:

- `collection`
- `document`
- `document_revision`
- `permission_record`
- `comment_record`
- `search_result`

## Workflow Automation References

### n8n

Sources:

- https://github.com/n8n-io/n8n
- https://docs.n8n.io/integrations/builtin/node-types
- https://docs.n8n.io/integrations/builtin/credentials
- https://github.com/n8n-io/n8n-docs/blob/main/docs/connect/n8n-api/authentication.md

Feature patterns:

- visual workflow builder
- node catalog
- credentials
- triggers
- workflow templates
- workflow executions
- integrations
- self-hosting

API/contract learning:

- workflows are node graphs with node type, config, connections, credentials,
  and execution state
- credentials have type-specific schemas
- API key authentication is used for public API access
- node details and credentials are separate from workflow instance state

Schema ideas:

- `workflow`
- `workflow_node`
- `workflow_connection`
- `credential_ref`
- `workflow_execution`
- `node_type`
- `trigger_node`

Dataset ideas:

- workflow_node_type_names
- trigger_type_names
- credential_type_names
- execution_status_names
- connector_category_names

### Node-RED

Sources:

- https://github.com/node-red/node-red
- https://nodered.org/docs/api/
- https://nodered.org/docs/user-guide/context
- https://nodered.org/docs/user-guide/projects/

Feature patterns:

- low-code event-driven flows
- node palette
- wires between nodes
- deploy action
- runtime admin API
- context storage
- Git-backed projects

API/contract learning:

- runtime exposes Admin HTTP API for flows, nodes, settings, diagnostics, and
  authentication
- context can be stored in memory, local filesystem, or custom stores
- projects package flow files and related artifacts under version control

Schema ideas:

- `flow_project`
- `flow_tab`
- `flow_node`
- `flow_wire`
- `context_store`
- `deploy_record`
- `runtime_diagnostic`

## Website Builder References

### Webflow

Sources:

- https://developers.webflow.com/reference
- https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items
- https://developers.webflow.com/data/reference/cms/collections/list
- https://developers.webflow.com/data/reference/cms/collection-items/staged-items/create-items

Feature patterns:

- visual website builder
- CMS collections
- pages
- components
- forms
- assets
- publishing
- webhooks

API/contract learning:

- Data API manages CMS content, pages, components, forms, assets, ecommerce,
  webhooks, and site configuration
- CMS collection has a schema and collection items
- item creation can be batched and requires write scope
- staged and published content are separate lifecycle states

Schema ideas:

- `site`
- `cms_collection`
- `cms_field`
- `cms_item`
- `page`
- `component`
- `form`
- `asset`
- `publish_record`

### GrapesJS

Sources:

- https://github.com/GrapesJS/grapesjs
- https://grapesjs.com/docs/modules/Components.html
- https://grapesjs.com/docs/api/component.html

Feature patterns:

- embeddable web builder
- component tree
- component manager
- block manager
- trait/style editing
- plugin-defined component types
- exportable HTML/CSS

API/contract learning:

- component is a node in a template tree
- component properties update canvas and exported code
- custom component types should be registered through plugins before loading
  templates
- components have tag, attributes, traits, editability rules, and placement
  constraints

Schema ideas:

- `page_builder`
- `component_type`
- `component_node`
- `component_trait`
- `style_rule`
- `builder_plugin`
- `export_record`

## Canvas And Whiteboard References

### Excalidraw

Sources:

- https://github.com/excalidraw/excalidraw
- https://docs.excalidraw.com/docs/codebase/json-schema
- https://plus.excalidraw.com/docs/api
- https://plus.excalidraw.com/docs/api/scene-content-schema

Feature patterns:

- whiteboard
- shapes
- arrows/connectors
- scene file
- export/import
- collaboration
- collections/scenes in hosted API

API/schema learning:

- scene content has type, version, source, app state, elements, and scene
  version
- elements are persisted records with id, type, x, y, width, height, and
  element-specific fields
- API exposes scenes, scene content, collections, users, invites, logs, and
  workspace resources

Schema ideas:

- `canvas_scene`
- `scene_element`
- `shape_element`
- `connector_element`
- `app_state`
- `scene_collection`

### tldraw

Sources:

- https://github.com/tldraw/tldraw
- https://tldraw.dev/docs/shapes
- https://tldraw.dev/sdk-features/store
- https://tldraw.dev/reference/tlschema/createTLSchema

Feature patterns:

- infinite canvas SDK
- custom shapes
- tools
- bindings
- assets
- collaboration
- undo/redo
- persistence

API/schema learning:

- shapes are JSON records in the editor store
- shape records include base properties plus `props` for shape-specific data
- store is a reactive database with shapes, pages, bindings, assets, and other
  records
- store validates records against schema and tracks changes for undo/redo,
  persistence, and synchronization
- schema supports shape, binding, asset, user, custom records, and migrations

Schema ideas:

- `canvas_store`
- `canvas_page`
- `canvas_shape`
- `canvas_binding`
- `canvas_asset`
- `shape_schema`
- `store_migration`

## Parsing And Grammar References

### Tree-sitter

Sources:

- https://github.com/tree-sitter/tree-sitter
- https://tree-sitter.github.io/

Feature patterns:

- parser generator
- incremental parsing
- concrete syntax tree
- language grammars
- editor integration
- query system

API/schema learning:

- parser builds a concrete syntax tree
- tree can update efficiently as source changes
- queries can find syntax patterns in trees
- useful for code editor and live language workbench

Schema ideas:

- `grammar`
- `syntax_tree`
- `syntax_node`
- `source_edit`
- `tree_query`
- `query_match`

### Ohm

Sources:

- https://github.com/ohmjs/ohm
- https://ohmjs.org/

Feature patterns:

- grammar-first parser toolkit
- PEG syntax
- parser/interpreter separation
- semantic operations

API/schema learning:

- grammar is a reusable artifact
- input match result can succeed or fail
- semantic actions can be separate from grammar definition
- grammar can be treated as an API contract

Schema ideas:

- `grammar_record`
- `grammar_rule`
- `match_result`
- `semantic_operation`
- `parse_failure`

### Chevrotain

Sources:

- https://github.com/chevrotain/chevrotain
- https://chevrotain.io/

Feature patterns:

- parser toolkit for JavaScript/TypeScript
- lexer and parser separation
- LL(K) grammar style
- grammar written as JavaScript/TypeScript source
- no separate code generation phase

Schema ideas:

- `token_type`
- `lexer_config`
- `parser_rule`
- `parse_result`
- `syntax_error`

## Rule And Policy References

### json-rules-engine

Sources:

- https://github.com/CacheControl/json-rules-engine

Feature patterns:

- JSON-readable rules
- condition trees
- facts
- events/results
- persistence-friendly business logic

Schema ideas:

- `rule_record`
- `condition_tree`
- `fact_record`
- `rule_event`
- `rule_result`

### rule-engine-js

Sources:

- https://github.com/crafts69guy/rule-engine-js

Feature patterns:

- JSON-based dynamic business logic
- validation
- decision-making
- security-oriented rule execution

Schema ideas:

- `policy_rule`
- `validation_rule`
- `operator_record`
- `rule_execution_report`

## Knowledge Graph And Reasoning References

### MemoryJS

Sources:

- https://github.com/danielsimonjr/memoryjs

Feature patterns:

- entities
- relations
- observations
- hierarchical organization
- search
- storage backends

Schema ideas:

- `knowledge_entity`
- `knowledge_relation`
- `observation_record`
- `memory_backend`
- `search_query`

### Understand Anything

Sources:

- https://github.com/Egonex-AI/Understand-Anything

Feature patterns:

- codebase-to-knowledge-graph
- graph exploration
- search
- agent-friendly project understanding

Schema ideas:

- `code_graph`
- `file_node`
- `symbol_node`
- `dependency_edge`
- `question_answer_record`

### IBM HKLIB

Sources:

- https://ibm.github.io/neuro-symbolic-ai/toolkit/hklib/

Feature patterns:

- hyperlinked knowledge graph
- multimodal knowledge links
- graph reasoning

Schema ideas:

- `hyperknowledge_node`
- `hyperknowledge_link`
- `reasoning_context`
- `proof_path`

## Cross-Project Dataset Backlog

Suggested one-dimensional datasets:

- ui_component_names
- ui_region_names
- ui_panel_names
- ui_menu_names
- ui_toolbar_names
- ui_dialog_names
- ui_popover_names
- ui_sidebar_names
- ui_status_indicator_names
- ui_command_surface_names
- keyboard_shortcut_scope_names
- keyboard_modifier_names
- keyboard_key_names
- shortcut_action_names
- shortcut_conflict_type_names
- setting_scope_names
- setting_value_type_names
- preference_category_names
- accessibility_setting_names
- theme_setting_names
- layout_setting_names
- editor_setting_names
- canvas_setting_names
- workflow_setting_names
- contribution_point_names
- editor_panel_names
- diagnostic_level_names
- database_view_type_names
- database_field_type_names
- block_type_names
- workspace_app_type_names
- workflow_node_type_names
- trigger_type_names
- credential_type_names
- execution_status_names
- connector_category_names
- website_section_names
- component_type_names
- style_token_names
- form_field_type_names
- publish_target_names
- canvas_tool_names
- shape_type_names
- connector_type_names
- diagram_node_type_names
- grammar_rule_type_names
- parser_error_type_names
- ast_node_type_names
- dag_node_type_names
- semantic_action_names
- rule_condition_type_names
- rule_operator_names
- rule_outcome_names
- policy_decision_names
- validation_scope_names
- observation_type_names
- proof_step_type_names
- graph_query_type_names

## Cross-Project Schema Backlog

Suggested schema/contracts:

- ui_component_contract
- ui_region_contract
- command_palette_contract
- keyboard_shortcut_contract
- keyboard_shortcut_binding
- shortcut_conflict_record
- settings_record
- preference_record
- accessibility_preference
- theme_record
- layout_preference
- panel_state
- menu_item
- toolbar_item
- extension_capability
- editor_session
- diagnostic_record
- workspace
- document
- page_entity
- block_entity
- database
- database_view
- collection
- permission_record
- workflow
- workflow_node
- workflow_connection
- workflow_execution
- flow_project
- context_store
- website_entity
- cms_collection
- cms_item
- component_node
- canvas_scene
- canvas_shape
- canvas_binding
- grammar_record
- parser_session
- syntax_tree
- condition_tree
- rule_record
- policy_rule
- knowledge_unit
- observation_record
- proof_trace
- graph_query

## Follow-Up Review Plan

1. Review each project in priority order: AFFiNE, AppFlowy, Logseq, n8n,
   Node-RED, VS Code, Tree-sitter, Ohm, tldraw, GrapesJS.
2. For each project, inspect public docs and repository structure.
3. Create a feature matrix with rows as capabilities and columns as projects.
4. Create a schema matrix with rows as An App candidate schemas and columns as
   source inspirations.
5. Convert accepted rows into `DATASET_REGISTRY_REQUIREMENTS.md` and
   `SCHEMA_CONTRACT_CATALOG.md`.
6. Keep closed products as UX references only.

## Extensive UI Component Reference

### Cross-Application UI Components

These component names should be treated as inspiration for approved UI datasets:

- app shell
- workspace switcher
- project switcher
- file explorer
- entity explorer
- collection explorer
- page tree
- block tree
- outline tree
- graph view
- canvas
- editor
- code editor
- rich text editor
- markdown editor
- block editor
- database grid
- board view
- calendar view
- timeline view
- dashboard
- chart panel
- inspector panel
- properties panel
- settings panel
- command palette
- quick action bar
- toolbar
- status bar
- activity bar
- side bar
- secondary side bar
- bottom panel
- terminal panel
- output panel
- debug panel
- problems panel
- search panel
- source control panel
- extensions panel
- node palette
- workflow canvas
- minimap
- breadcrumb
- tab bar
- split editor group
- modal dialog
- command menu
- context menu
- slash menu
- floating toolbar
- color picker
- shape picker
- connection handle
- resize handle
- selection box
- ruler
- grid
- guide
- comment thread
- notification toast
- approval prompt
- conflict resolver
- diff viewer
- preview pane
- publish panel
- import dialog
- export dialog
- template gallery
- version history panel
- audit panel
- run history panel

### VS Code UI, Shortcuts, And Settings

Sources:

- https://code.visualstudio.com/docs/editing/userinterface
- https://code.visualstudio.com/docs/configure/keybindings
- https://code.visualstudio.com/docs/reference/default-keybindings
- https://code.visualstudio.com/api/references/when-clause-contexts

Useful UI parts:

- activity bar
- primary side bar
- secondary side bar
- editor group
- tabs
- breadcrumbs
- minimap
- panel
- status bar
- command palette
- settings editor
- keyboard shortcuts editor
- source control view
- debug view
- extensions view
- problems panel
- output panel
- terminal panel

Shortcut learning:

- commands should have ids
- shortcut bindings should be user-editable
- shortcuts can be scoped by context
- menus and shortcuts can use context conditions to enable/disable commands
- shortcut editor should show command id, keybinding, source, and context
- command palette should show shortcuts beside commands

Settings learning:

- settings exist at multiple scopes: user, workspace, folder, language, and
  extension
- settings should have schema, default value, description, and allowed values
- settings UI should be searchable and grouped by category
- JSON-style settings should remain available for power users

An App adoption:

- define `command_palette_contract`
- define `keyboard_shortcut_contract`
- define `when_context_contract`
- create datasets for `ui_region_names`, `keyboard_shortcut_scope_names`,
  `setting_scope_names`, and `setting_value_type_names`

### Monaco Editor UI, Shortcuts, And Settings

Useful UI parts:

- editor model
- diff editor
- markers
- hover
- completion list
- inline completion
- minimap
- glyph margin
- line numbers
- folding controls
- find/replace widget
- context menu

Settings learning:

- editor options should include language, theme, read-only mode, word wrap,
  minimap, line numbers, folding, tab size, format on type, and diagnostics
  display
- editor state should be separate from document entity state

An App adoption:

- editor model is an entity-linked view model
- diagnostics should come from validator/test/audit records
- completions should be powered by approved datasets and parser context

### n8n UI, Shortcuts, And Settings

Sources:

- https://docs.n8n.io/build/keyboard-shortcuts
- https://docs.n8n.io/integrations/builtin/node-types

Useful UI parts:

- workflow canvas
- node palette
- node search
- node configuration panel
- credential selector
- execution panel
- run history
- error details
- workflow list
- templates gallery
- connection handles
- pinned data/output view
- expression editor

Shortcut learning:

- workflow-level shortcuts include create new, open, save, undo, redo, and
  execute
- canvas shortcuts should support copy, paste, duplicate, delete, select,
  zoom, pan, and add node
- shortcut help can be shown in-context from the canvas

Settings learning:

- workflow settings should include execution mode, retry, timeout, error
  handling, credentials policy, activation state, and sharing
- node settings should include input contract, output contract, parameters,
  credential refs, retry policy, and disabled state

An App adoption:

- flow builder should use shared runner DAG schema
- node config panel should edit `workflow_node` entities
- each run writes `workflow_execution` and audit records

### Node-RED UI, Shortcuts, And Settings

Useful UI parts:

- node palette
- flow tabs
- canvas/wires
- deploy button
- debug sidebar
- context data view
- node edit dialog
- configuration nodes
- project settings

Settings learning:

- context storage can be memory, local filesystem, or custom storage
- projects can package flows and related files under version control
- deploy should be an explicit transition with validation

An App adoption:

- context store maps to storage driver policy
- deploy maps to activation/publish lifecycle
- debug sidebar maps to audit/run output panel

### Knowledge Workspace UI, Shortcuts, And Settings

Sources:

- AppFlowy
- AFFiNE
- Logseq
- Outline
- Notion
- Workflowy

Useful UI parts:

- workspace
- sidebar navigation
- document page
- block editor
- outliner
- backlink panel
- graph view
- database grid
- board view
- calendar view
- field editor
- template gallery
- collection tree
- permissions panel
- comment thread
- revision history

Shortcut/settings learning:

- outliner needs fast indent, outdent, collapse, expand, move, zoom, and block
  reference commands
- database view settings should store view type, filters, sort order, grouping,
  visible fields, and layout preferences
- field settings should define field type, required state, validation, default,
  options, and display behavior
- collection permissions are useful as policy boundaries
- archive/restore should be lifecycle transitions

An App adoption:

- one dataset can render as grid, board, calendar, table, or dashboard
- blocks/pages can be unified graph nodes
- markdown can remain source while structured views edit parsed blocks
- permission records should be schema-backed

### Website Builder UI, Shortcuts, And Settings

Sources:

- Webflow
- GrapesJS

Useful UI parts:

- designer canvas
- navigator/tree
- style panel
- element settings panel
- assets panel
- CMS collections panel
- pages panel
- components panel
- interactions panel
- publish panel
- component tree
- block manager
- trait manager
- layer manager
- device manager
- code export

Settings learning:

- page/site settings should include slug, SEO metadata, publish target,
  custom code policy, forms, assets, and locale
- CMS collection settings should include fields, validations, staged/published
  state, and batch limits
- component nodes should expose tag, attributes, traits, style, editability,
  draggable/droppable rules, and export behavior

An App adoption:

- website builder edits page/section/component/style entities
- publish must create a publish record and acceptance result
- component registry should be dataset/schema-driven

### Canvas And Whiteboard UI, Shortcuts, And Settings

Sources:

- https://docs.excalidraw.com/docs/codebase/json-schema
- https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props
- https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/ui-options
- https://plus.excalidraw.com/how-to-start
- https://tldraw.dev/docs/shapes
- https://tldraw.dev/sdk-features/store
- https://tldraw.dev/examples/keyboard-shortcuts
- https://tldraw.dev/sdk-features/accessibility
- https://tldraw.dev/reference/tlschema/createTLSchema

Useful UI parts:

- infinite canvas
- toolbar
- shape tools
- selection tool
- text tool
- arrow tool
- library
- background settings
- export/import
- collaboration
- scene content
- default tools
- custom tools
- shapes
- bindings
- assets
- pages
- menus
- shortcuts dialog
- accessibility menu
- preferences menu

Shortcut learning:

- shape shortcuts make canvas creation fast
- common shortcuts include rectangle, text, escape, flowchart node creation,
  shape cycling, movement, zoom to fit, and shortcut help
- shortcuts can be overridden
- shortcuts are associated with tools or actions
- newly added shortcuts should be added to shortcut help/dialog
- keyboard handling should be scoped to the focused canvas by default

Settings learning:

- UI options can control canvas actions, docked sidebar breakpoint, welcome
  screen, and tools
- keyboard handling can be local to component or global
- accessibility preferences include reduce motion, keyboard shortcuts on/off,
  and enhanced accessibility mode
- shape schemas include props and migrations
- store validates records and tracks changes for undo/redo, persistence, and
  sync

An App adoption:

- canvas shortcuts must be scoped by active surface
- scene content maps to `canvas_scene` and `scene_element`
- whiteboard export/import needs round-trip validation
- define `shortcut_binding` records with tool/action target
- define `accessibility_preference` records
- define `canvas_store` records with schema validation and migrations

## Shortcut Contract For An App

Every shortcut should be an entity.

Required fields:

- `id`
- `command_ref`
- `label`
- `keys`
- `platform`
- `scope`
- `when_context`
- `priority`
- `enabled`
- `source`
- `conflict_policy`

Contract:

- command reference must resolve
- shortcut scope must be approved
- context condition must be valid
- conflicts must be reported
- user overrides must not delete default records
- shortcut help must be generated from active shortcut records

Suggested shortcut scopes:

- global
- app_shell
- editor
- code_editor
- markdown_editor
- block_editor
- canvas
- workflow_canvas
- table_view
- dashboard
- modal
- command_palette

Suggested context fields:

- active_surface
- selected_entity_type
- selected_count
- edit_mode
- read_only
- has_selection
- has_clipboard
- can_undo
- can_redo
- validation_state
- user_role

## Settings Contract For An App

Every setting should be schema-backed.

Required fields:

- `id`
- `name`
- `category`
- `scope`
- `value_type`
- `default_value`
- `allowed_values`
- `description`
- `owner`
- `requires_restart`
- `policy_ref`

Contract:

- scope must be approved
- value must match declared type
- setting override order must be deterministic
- risky settings require policy gate
- settings UI and JSON/editor view must show the same data

Suggested setting scopes:

- user
- workspace
- application
- project
- domain
- route
- view
- component
- plugin
- utility
- runtime
- session

Suggested categories:

- appearance
- accessibility
- editor
- canvas
- workflow
- automation
- storage
- cache
- security
- routing
- naming
- validation
- audit
- experiment
- notification

## UI Component Contract For An App

Every UI component should be an entity or an entity-backed view model.

Required fields:

- `id`
- `name`
- `component_type`
- `owner_domain`
- `input_contract`
- `output_contract`
- `state_ref`
- `setting_refs`
- `command_refs`
- `shortcut_refs`
- `permission_policy`
- `render_policy`
- `audit_level`

Contract:

- component type must be approved
- input and output contracts must resolve
- state is stored through approved entity/storage path
- commands and shortcuts must resolve
- component settings must validate before render
- render failures must produce diagnostics
