# Inspiration

## Purpose

This document tracks inspiration software, GitHub repositories, and external
learning material for An App.

Detailed API, schema, dataset, and feature notes live in:

- `INSPIRATION_REFERENCE_DETAILS.md`
- `INSPIRATION_FEATURE_MATRIX.md`

The goal is to learn product patterns, schemas, datasets, interaction models,
and architecture ideas without copying old identities or adopting unapproved
names as canonical An App vocabulary.

## Adoption Policy

- Learn concepts, not brand identity.
- Prefer open source repositories when code-level learning is useful.
- Treat closed products as product/UX inspiration only.
- Record what to learn, what not to copy, owner domain, and adoption status.
- Convert useful ideas into An App entities, schemas, datasets, templates,
  flows, policies, and audit gates.

## Status Names

- `to_review`: useful but not analyzed deeply yet
- `learned`: concept has been reviewed
- `adopted`: learning has been added to docs/datasets
- `reference_only`: keep as inspiration, do not implement directly
- `deferred`: useful later, not needed for foundation
- `rejected`: does not fit An App doctrine

## Inspiration Index

| id | source | type | link | owner domain | status | learn |
| --- | --- | --- | --- | --- | --- | --- |
| insp_001 | Visual Studio Code | software/open source | https://github.com/microsoft/vscode | UI Surface, File Conversion, Repository Operations | to_review | code editor layout, side panels, command palette, extensions, source control, diff, file explorer, diagnostics |
| insp_002 | Monaco Editor | open source editor core | https://github.com/microsoft/monaco-editor | UI Surface, An App Lang | to_review | embeddable code editor, markers, completion, models, editor services |
| insp_003 | Notion | closed product | https://www.notion.so | UI Surface, Template Domain, Knowledge Base | reference_only | block editor, databases, templates, relation fields, page-as-record model |
| insp_004 | AppFlowy | open source workspace | https://github.com/appflowy-io/appflowy | UI Surface, Knowledge Base, Template Domain | to_review | open source Notion-like workspace, docs, wikis, projects, collaboration, data ownership |
| insp_005 | AFFiNE | open source workspace | https://github.com/toeverything/affine | UI Surface, Knowledge Base, Whiteboard, Template Domain | to_review | combined docs, whiteboards, databases, local-first workspace, planning and creation together |
| insp_006 | Anytype | product/source-available ecosystem | https://anytype.io | Application Entity Doctrine, Knowledge Base | reference_only | object-based knowledge management, ontology-style objects, properties, relations, local-first private data |
| insp_007 | Logseq | open source knowledge base | https://github.com/logseq/logseq | An Memory, English Language, UI Surface | to_review | outliner, graph links, Markdown/Org storage, task and knowledge workflows |
| insp_008 | Outline | open source team wiki | https://github.com/outline/outline | Knowledge Base, Repository Operations, Quality Audit | to_review | team knowledge base, collections, permissions, search, collaborative docs |
| insp_009 | Workflowy | closed product | https://workflowy.com | UI Surface, An App Lang | reference_only | infinite outline, collapsible tree, zoom into node, nested planning |
| insp_010 | n8n | open source/fair-code automation | https://github.com/n8n-io/n8n | Command Capability, Runner, Template Domain | to_review | workflow automation, node catalog, templates, integrations, visual flow builder |
| insp_011 | n8n workflow libraries | open source templates | https://github.com/zie619/n8n-workflows | Template Domain, Command Capability | to_review | searchable workflow template inventory, reusable automation samples |
| insp_012 | Node-RED | open source flow tool | https://github.com/node-red/node-red | Runner, Command Capability, UI Surface | to_review | event-driven flow programming, node palette, wires, deployable flow projects, Git-backed project model |
| insp_013 | Webflow | closed product | https://webflow.com | UI Surface, Template Domain | reference_only | visual website builder, CMS-like collections, style panels, publish workflow |
| insp_014 | GrapesJS | open source web builder | https://github.com/GrapesJS/grapesjs | UI Surface, Template Domain | to_review | embeddable web builder, drag/drop page structure, component blocks, exportable HTML templates |
| insp_015 | Miro | closed product | https://miro.com | UI Surface, Agent System | reference_only | collaborative canvas, boards, sticky notes, diagrams, workshops, team collaboration |
| insp_016 | Excalidraw | open source whiteboard | https://github.com/excalidraw/excalidraw | UI Surface, File Conversion | to_review | whiteboard scene model, shapes, arrows, export, collaboration, simple diagramming |
| insp_017 | tldraw | open source canvas SDK | https://github.com/tldraw/tldraw | UI Surface | to_review | infinite canvas SDK, custom shapes, bindings, tools, collaboration, canvas state model |
| insp_018 | Tree-sitter | open source parser | https://github.com/tree-sitter/tree-sitter | An App Lang, File Conversion | to_review | incremental parsing, concrete syntax tree, language grammars, editor-friendly parsing |
| insp_019 | Ohm | open source parser toolkit | https://github.com/ohmjs/ohm | An App Lang | to_review | grammar-as-API, PEG grammar definitions, parser/interpreter separation |
| insp_020 | Chevrotain | open source parser toolkit | https://github.com/chevrotain/chevrotain | An App Lang | to_review | parser toolkit in JavaScript, lexer/parser separation, grammar as code |
| insp_021 | json-rules-engine | open source rules | https://github.com/CacheControl/json-rules-engine | Validator, Command Capability, Quality Audit | to_review | JSON rules as persistable records, condition trees, event/results model |
| insp_022 | rule-engine-js | open source rules | https://github.com/crafts69guy/rule-engine-js | Validator, Quality Audit | to_review | secure JSON-style dynamic business logic and validation |
| insp_023 | MemoryJS | open source knowledge graph library | https://github.com/danielsimonjr/memoryjs | An Memory, Application Entity Doctrine | to_review | entity/relation/observation records, hierarchical organization, multiple storage backends |
| insp_024 | Understand Anything | open source knowledge graph/code graph | https://github.com/Egonex-AI/Understand-Anything | An Memory, File Conversion, Agent System | to_review | codebase-to-knowledge-graph, exploration, search, agent-friendly graph understanding |
| insp_025 | IBM Neuro-Symbolic AI HKLIB | research/toolkit | https://ibm.github.io/neuro-symbolic-ai/toolkit/hklib/ | An Memory, Reasoner | to_review | hyperlinked knowledge graph concept, multimodal knowledge links, graph reasoning |
| insp_026 | KG-LLM Papers | GitHub paper index | https://github.com/zjukg/KG-LLM-Papers | An Memory, Agent System | reference_only | knowledge graph and language model integration research index |

## Product Learning By Area

### Code Editor And Developer Workspace

Sources:

- Visual Studio Code
- Monaco Editor

Learning to adopt:

- file explorer as entity tree
- command palette as command capability surface
- tabbed editors as view entities
- diagnostics panel as validation/audit output
- diff viewer for generated and edited artifacts
- source control panel for repository operations
- extension model as plugin capability registry

Datasets suggested:

- editor_panel_names
- editor_action_names
- diagnostic_level_names
- source_control_action_names
- diff_view_mode_names

Schemas suggested:

- editor_session
- editor_tab
- diagnostic_record
- diff_record
- extension_capability

### Block Documents And Knowledge Workspaces

Sources:

- Notion
- AppFlowy
- AFFiNE
- Anytype
- Logseq
- Outline
- Workflowy

Learning to adopt:

- page, block, object, relation, property, collection, graph, and outline as
  entity families
- local-first or owner-controlled storage as a policy option
- block editor and collapsible tree as two views over the same data
- knowledge base can be personal, team, product, or organization scoped
- relations and backlinks should be first-class records
- templates should create pages, databases, projects, tasks, and docs

What not to copy:

- product-specific brand language
- closed product lock-in
- uncontrolled synonym sprawl
- hidden schema changes

Datasets suggested:

- block_type_names
- property_type_names
- knowledge_workspace_type_names
- outline_action_names
- relation_view_names

Schemas suggested:

- page_entity
- block_entity
- object_entity
- relation_property
- backlink_record
- collection_view

### Workflow Automation And Flow Builders

Sources:

- n8n
- n8n workflow libraries
- Node-RED

Learning to adopt:

- workflows are graph entities
- each node has input contract, output contract, config, credentials policy,
  retry policy, and run record
- node catalog and workflow templates make creation faster
- flow projects should be versionable and exportable
- visual flow builder should map to the same DAG runner structure
- executions need status, logs, metrics, and replay/audit records

What not to copy:

- integration sprawl before core pipeline is stable
- hidden runtime credentials
- unvalidated imported workflows

Datasets suggested:

- workflow_node_type_names
- trigger_type_names
- connector_type_names
- run_status_names
- retry_policy_names

Schemas suggested:

- workflow_node
- workflow_edge
- workflow_run
- trigger_record
- connector_record
- automation_template

### Website And Product Builders

Sources:

- Webflow
- GrapesJS

Learning to adopt:

- website is an application entity with routes, pages, sections, components,
  assets, forms, content blocks, and publishing policy
- visual builder should edit entity records, not opaque page blobs
- reusable components and templates are core
- style controls should use approved tokens and layout datasets
- export/publish should create traceable artifacts

What not to copy:

- one-off generated markup without source records
- style names outside approved UI datasets

Datasets suggested:

- website_section_names
- component_type_names
- style_token_names
- form_field_type_names
- publish_target_names

Schemas suggested:

- website_entity
- page_entity
- section_entity
- component_entity
- style_token
- publish_record

### Canvas, Diagram, And Whiteboard

Sources:

- Miro
- Excalidraw
- tldraw

Learning to adopt:

- canvas is a layout over entities
- shapes, connectors, arrows, sticky notes, frames, and groups are entities
- diagram nodes can link to schema, workflow, memory, or experiment records
- whiteboard scene export/import should preserve ids and relationships
- custom shapes should support An App-specific records like entity, schema,
  dataset, policy, flow, and finding

What not to copy:

- decorative canvas without data binding
- diagrams that cannot round-trip into structured records

Datasets suggested:

- canvas_tool_names
- shape_type_names
- connector_type_names
- diagram_node_type_names
- whiteboard_export_type_names

Schemas suggested:

- canvas_scene
- canvas_shape
- canvas_connector
- diagram_node
- diagram_edge

### Parsing, Grammar, And An App Lang

Sources:

- Tree-sitter
- Ohm
- Chevrotain
- local An App Lang sources

Learning to adopt:

- grammar should be a first-class artifact
- parser output should preserve tree, source span, errors, and confidence
- incremental parsing matters for editor/live workbench use
- grammar and semantic actions should be separate where practical
- parser workbench should show input, tree, errors, rules, and output records

What not to copy:

- parser library dependency before we decide runtime policy
- grammar syntax that conflicts with approved An App vocabulary

Datasets suggested:

- grammar_rule_type_names
- parser_error_type_names
- ast_node_type_names
- dag_node_type_names
- semantic_action_names

Schemas suggested:

- grammar_record
- parser_session
- ast_node
- dag_node
- parse_error
- semantic_particle

### Rules, Validation, And Policy

Sources:

- json-rules-engine
- rule-engine-js
- local validator and entity validator

Learning to adopt:

- rules should be persistable JSON-like records
- condition trees need `and`, `or`, `not`, comparison, existence, and custom
  operator support
- rules should produce structured events/results
- validation rules and policy rules should be separate categories
- every rule should have owner, priority, test, and audit reference

What not to copy:

- arbitrary unbounded rule execution
- rule formats that bypass existing validator and action entity

Datasets suggested:

- rule_condition_type_names
- rule_operator_names
- rule_outcome_names
- policy_decision_names
- validation_scope_names

Schemas suggested:

- rule_record
- condition_tree
- validation_rule
- policy_rule
- rule_result

### Knowledge Graph, Memory, And Reasoning

Sources:

- MemoryJS
- Understand Anything
- IBM HKLIB
- KG-LLM Papers
- local An Memory sources

Learning to adopt:

- knowledge should store entities, relations, observations, evidence, confidence,
  conflicts, and source trust
- code/docs/projects can be converted into knowledge graphs
- graph search and proof trace are important for explanation
- memory should support working, episodic, semantic, and procedural categories
- external semantic providers are optional adapters, not core truth

What not to copy:

- black-box graph claims without evidence
- provider-dependent reasoning as the foundation

Datasets suggested:

- memory_type_names
- observation_type_names
- proof_step_type_names
- graph_query_type_names
- source_trust_factor_names

Schemas suggested:

- knowledge_unit
- observation_record
- proof_trace
- graph_query
- source_trust_record

### Experiment And Discovery Workbench

Sources:

- local experiment space
- symbolic regression notes
- ksmriti acceptance framework

Learning to adopt:

- experiment is an entity with versions and runs
- each run preserves config, inputs, outputs, findings, and audit evidence
- expression templates can guide discovery
- candidates should be scored by precision, recall, frequency, and complexity
- findings should be staged before promotion
- charts and tables are layouts over run results

Datasets suggested:

- experiment_entity_names
- experiment_action_names
- expression_template_type_names
- finding_type_names
- chart_type_names

Schemas suggested:

- experiment
- experiment_version
- experiment_run
- finding
- expression_template
- run_report

## Similar Project Watchlist

These projects are closest to An App's intended shape:

| id | project | why similar | learning priority |
| --- | --- | --- | --- |
| similar_001 | AFFiNE | combines docs, whiteboards, databases, and knowledge workspace | high |
| similar_002 | AppFlowy | open-source Notion-like project/wiki/team workspace | high |
| similar_003 | Logseq | outliner plus knowledge graph plus local files | high |
| similar_004 | n8n | visual workflow builder and automation templates | high |
| similar_005 | Node-RED | flow-based programming and deployable flow projects | high |
| similar_006 | GrapesJS | embeddable visual builder for pages/templates | medium |
| similar_007 | tldraw | extensible canvas SDK | medium |
| similar_008 | Excalidraw | simple structured whiteboard scene model | medium |
| similar_009 | Tree-sitter | incremental parsing and tree model | high |
| similar_010 | Ohm | grammar-first language parsing | high |
| similar_011 | json-rules-engine | structured rule records and condition trees | medium |
| similar_012 | MemoryJS | entity/relation/observation knowledge records | medium |

## Initial Adoption Backlog

1. Add approved dataset groups for editor panels, block types, workflow nodes,
   canvas shapes, parser nodes, rule operators, and graph query types.
2. Add schema records for editor session, block entity, workflow node,
   canvas scene, grammar record, condition tree, and knowledge unit.
3. Add feature matrix comparing An App with AFFiNE, AppFlowy, Logseq, n8n,
   Node-RED, GrapesJS, tldraw, and VS Code.
4. Add a parser workbench scope based on Tree-sitter, Ohm, and Chevrotain
   learning.
5. Add a workflow builder scope based on n8n and Node-RED learning.
6. Add a canvas/diagram scope based on Excalidraw, tldraw, and Miro learning.

## Source Links

- Visual Studio Code: https://github.com/microsoft/vscode
- AppFlowy: https://github.com/appflowy-io/appflowy
- AFFiNE: https://github.com/toeverything/affine
- Logseq: https://github.com/logseq/logseq
- Outline: https://github.com/outline/outline
- n8n: https://github.com/n8n-io/n8n
- Node-RED: https://github.com/node-red/node-red
- GrapesJS: https://github.com/GrapesJS/grapesjs
- Excalidraw: https://github.com/excalidraw/excalidraw
- tldraw: https://github.com/tldraw/tldraw
- Tree-sitter: https://github.com/tree-sitter/tree-sitter
- Ohm: https://github.com/ohmjs/ohm
- Chevrotain: https://github.com/chevrotain/chevrotain
- json-rules-engine: https://github.com/CacheControl/json-rules-engine
- rule-engine-js: https://github.com/crafts69guy/rule-engine-js
- MemoryJS: https://github.com/danielsimonjr/memoryjs
- Understand Anything: https://github.com/Egonex-AI/Understand-Anything
- IBM Neuro-Symbolic AI HKLIB:
  https://ibm.github.io/neuro-symbolic-ai/toolkit/hklib/
- KG-LLM Papers: https://github.com/zjukg/KG-LLM-Papers
