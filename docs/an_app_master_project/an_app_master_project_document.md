# An App Master Project Document

## Purpose

An App is a real business application platform where every meaningful item is an entity. The same doctrine applies to applications, documents, templates, datasets, schemas, policies, workflows, commands, routes, views, ui components, user flows, bots, agents, experiments, financial records, trading strategies, and generated artifacts.

The goal is to let a user describe work in natural English or structured input, convert that input into governed entity records, validate it against approved datasets and schemas, run it through a predictable pipeline, and render or persist the result as an application, document, workflow, dataset, report, website, notebook, dashboard, diagram, automation, bot capability, or business-domain template.

## Project Identity

An App is not only an app builder and not only a notebook. It is an entity-governed application shell for creating, editing, executing, validating, and explaining business systems.

Core identity:

- everything is an entity
- every entity has config, schema, relationships, policy, provenance, status, and validation state
- every operation should pass through approved utilities and plugins
- every generated artifact should be traceable to source input, dataset decisions, schema checks, and audit output
- every ui surface is a view over the same governed data

## Source Learning Base

This master document consolidates the scratchpad learning from:

- `an_app.txt`
- `gk/gui_v4`
- `gk/gui_v2`
- `gk/shared/experiments/an_app_v5`
- `gk/shared/experiments/shared/inbox/gk_app_v2.txt`
- `gk/shared/experiments/shared/inbox/features.txt`
- `input_temp/an_app_stale`
- `input_temp/an_app_v2_stale`
- `input_temp/b0` through `input_temp/b8`
- `project_action_org`
- `project_An_App_Shell_v01`
- `project_ohm_lang_v8`
- parser, bot, rule, flow, agent, memory, language, repository, experiment, fintech, trading, and ui inspiration notes
- public inspiration systems documented in `INSPIRATION.md`, `INSPIRATION_REFERENCE_DETAILS.md`, and `INSPIRATION_FEATURE_MATRIX.md`

## Operating Doctrine

The project should prefer existing approved names, datasets, schemas, and entity behavior before adding new concepts. New names require a dataset entry, owning domain, reason, and validation.

Registry behavior is entity behavior. State is an entity. A book is an entity. A cell is an entity. A route is an entity. A ui component is an entity. An application is an entity. A template is an entity. A policy is an entity.

## Fundamental Concept Model

The `an_app_v5` learning clarifies the minimum concept catalog. These are normalized into active snake_case names:

| Layer | Concepts | Meaning |
| --- | --- | --- |
| domain | entity, trait, relationship | What exists, what behavior it carries, and how records connect. |
| behavior | operation, task, pipeline, workflow, intent | What can be done, how work is grouped, ordered, branched, and triggered by user goals. |
| ui | component | What renders an entity or interaction surface. |
| system | provider | Swappable implementation behind storage, index, display, agent, or integration behavior. |

Every documented concept should use this standard shape:

- `name`
- `layer`
- `definition`
- `purpose`
- `attributes`
- `operations`
- `relationships`
- `constraints`
- `examples`
- `validation`

This concept shape is required for core concepts and recommended for every domain concept before it becomes active implementation scope.

## Default Pipeline

The full An App pipeline is:

`ingest -> decompose -> parse -> build_ast -> build_dag -> classify -> validate -> reason -> resolve -> plan -> execute -> compose -> display -> persist -> audit -> respond`

The `gk_app_v2` PRD describes a shorter 13-stage product pipeline:

`decompose -> validate -> parse -> transform -> reason -> resolve -> index -> compose -> execute -> format -> display -> persist -> respond`

That pipeline should be treated as a product-facing subset of the fuller An App pipeline. It strengthens the need for standalone stage execution, dry-run mode, debug stepping, per-stage diagnostics, indexing, formatting, display, persistence, and response triggers.

The ui compiler learning from `gui_v2` adds a ui-specific pipeline:

`decompose -> parse -> transform -> reason -> resolve -> compose -> inject`

`inject` means mounting a composed ui artifact into a runtime viewport. It belongs to the ui surface domain and can be implemented as a display/mount operation, not as a new universal doctrine.

## Core Product Modules

| Module | Purpose |
| --- | --- |
| An App Shell | Runtime shell that loads app definition, config, routes, dependencies, views, datasets, templates, and default flows. |
| An App Lang | Language and grammar layer that parses natural English, structured text, DSL-like patterns, commands, and templates into records. |
| An App Brain | Coordination subdomain for ingestion, decomposition, parsing, context, reasoning, resolution, decision records, response composition, learning, scoring, recursion limits, boundary checks, and governed improvement proposals across language, memory, bot, and knowledge-tree records. |
| An Bot | Conversation, command, session, task, approval, and automation interface inside An App. |
| An Memory | Governed memory, source trust, evidence, conflict, recall, consolidation, and forgetting. |
| Entity System | Entity CRUD, schema validation, relationship graph validation, import/export, provenance, and policy checks. |
| Workflow System | Stage, step, task, condition, approval gate, rollback, audit, and pipeline execution. |
| ui surface | Multi-layout rendering over the same data: notebook, code editor, block editor, table, board, calendar, timeline, dashboard, diagram, canvas, website builder, and parser workbench. |
| Template System | Domain templates and artifact templates for LMS, fintech organization, single user, stock trading research, websites, products, reports, flows, and agents. |
| Quality Audit | Test generation, validation reports, source adoption logs, artifact checklists, and regression checks. |

## Core System Capabilities

The `gk_app_v2` PRD clarifies the first practical capability groups:

- entity lifecycle: create, read, update, delete, list, query, append, insert
- relationship lifecycle: link, unlink, find path, trace connections
- trait lifecycle: add, remove, list, check, get enabled operations
- attribute lifecycle: get, set, delete, list, merge
- pipeline execution: run full pipeline, run one stage, dry run, step forward, step backward
- diagnostics: capture errors, warnings, hints, trace, metrics, and logs at each stage
- storage: save, load, delete, list, version, revert, autosave
- indexing: index, remove from index, search text, search property, fuzzy search, autocomplete
- display: render, update, destroy, render tree, render list
- context: get, set, check, delete, push, pop, merge, clear

These are capabilities and contracts. They do not require separate ownership classes when existing entity behavior, utilities, or plugins can provide them.

System capabilities follow one rule: the capability contract is an entity, while the implementation may be a utility, plugin, provider, or existing action_entity behavior. This keeps state, storage, index, display, route, book, cell, and provider behavior inside the same governed entity model.

## Version Management Doctrine

An App should adapt the strongest Git ideas as an entity-level version system. The goal is not to manage only files. The goal is to let every important entity be saved, compared, branched, merged, restored, tagged, and audited.

Version management applies to:

- applications
- documents, books, cells, and blocks
- datasets and approved word lists
- schemas and contracts
- templates
- workflows, pipelines, DAG records, and stage records
- ui surfaces, layout trees, components, routes, and render profiles
- policies and provider configs
- bot sessions, agent plans, research outputs, and business-domain records

Git concepts to adapt:

| Git Concept | An App Adaptation |
| --- | --- |
| commit | entity snapshot with change summary, changed fields, validation result, source refs, and audit ref |
| diff | structured comparison across text, JSON/config, tree, relationship, workflow, ui, schema, and dataset changes |
| branch | separate line of work for draft, review, experiment, client-specific, agent-generated, or production changes |
| merge | governed combination of changes with auto-merge, approval, rejection, conflict, and audit policy |
| conflict | explicit review item for incompatible field, relationship, schema, policy, dataset, workflow, or intent changes |
| status | current version state such as changed, staged, saved, branched, merging, conflicted, restored, tagged, or archived |
| staging | selected changes prepared for save, review, merge, or release |
| history | timeline of versions, authors, agents, validation results, decisions, and restore events |
| tag | stable label for release, approved template, client delivery, production-ready, or compliance-reviewed state |
| restore | revert an entity to an older version or clone an older version as a new draft |
| field_provenance | field-level history showing who or what changed a value, when, why, and from which source |

Version behavior should be implemented with existing entity capabilities first. `action_entity` can own create/read/update/delete/query behavior for version records, branch records, diff records, merge records, conflict records, tag records, and history records. New version-specific utilities or plugins are only justified for diff calculation, conflict detection, merge policy, restore safety, and provenance tracing.

## Business Use Cases

An App should support:

- create a website
- create a product
- create a business application
- create a notebook or book
- create and run automation jobs
- create research agents
- create teams of agents
- edit markdown and structured documents
- create workflows and pipelines
- create diagrams and dashboards
- create templates and reuse templates
- manage a fintech organization
- research and backtest stock trading strategies
- ingest source documents and preserve learning with evidence
- edit code with syntax highlighting, diagnostics, autocomplete, symbol navigation, formatting, multiple cursors, folding, line numbers, and optional minimap
- edit documents with blocks, nesting, slash commands, mentions, comments, version history, and export
- create database-style entities with schema, properties, table/board/gallery/list/calendar views, filtering, sorting, relations, rollups, and formulas
- build visual workflows with triggers, actions, conditions, loops, subflows, parallel branches, merge nodes, timeout behavior, logs, and versioning

## Production User Flows

The first production-grade user flows are:

- create application from natural English
- create website
- create product workspace
- create notebook or book
- edit cell or block
- insert template cell or block
- run workflow
- create automation schedule
- create research agent
- create team of agents
- import source document
- compare and adopt learning
- create fintech organization template
- run trading backtest
- search all entities

## ui Doctrine

The same entity data should render in multiple layouts without changing the record.

Approved layout names include:

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
- board_view
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

The `gui_v2` learning adds a semantic ui compiler pattern:

- JSON layout tree
- semantic tag ontology
- parent-child tag relationship rules
- singleton tag constraints
- content placeholder resolution
- design token injection
- repeater nodes for array data
- hash route state
- lifecycle state tracking

The shared `features.txt` note adds concrete shell/editor behavior:

- body/header navigation with hover menus, search, and window controls
- block-editor document surface with code-editor-style tabs
- slash command insertion
- contextual right-click menu
- double-click to edit a cell
- double-click to rename an item
- multi-layer autosuggest and autocorrect for words, templates, expressions, shapes, and patterns
- explorer for user books and entities
- cut, copy, paste, find, and replace inside books
- insert template cells and blocks
- autosave
- feature-flagged version control for books and cells

Books, cells, ui state, tabs, explorer nodes, and version records are entities.

## Quality Targets

Initial product targets from `gk_app_v2`:

| Area | Target |
| --- | --- |
| small pipeline latency | under 50ms |
| large entity pipeline latency | under 2s for entities above 10mb |
| autocomplete response | under 100ms |
| document open | under 500ms for 1000 blocks |
| workflow start | under 200ms |
| agent first output | under 1s |
| idle memory | under 100mb |
| large entity memory | under 500mb |
| maximum entity data size | 100mb |
| loaded entities | 100 concurrent loaded entities |
| concurrent workflows | 50 |
| concurrent agents | 20 |
| database rows | 10000 rows per database |
| document blocks | 10000 blocks per document |

These targets are product goals. Implementation batches should measure them only when the related capability exists.

Core implementation should remain dependency-light. Optional providers may add dependencies only behind config, permission, validation, and audit policy.

## Build Order

Preferred project build order:

1. utilities
2. datasets
3. schemas/contracts
4. plugins
5. templates
6. flows/pipelines
7. ui surfaces
8. app packages
9. sample business applications
10. audit and release documentation

## Initial Template Targets

Required template families:

- LMS organization template
- fintech organization template
- single user productivity template
- stock trading research template
- product creation template
- website creation template
- research agent template
- team of agents template
- markdown/document editing template
- workflow/pipeline template

## Governance

Every promoted utility, plugin, dataset, schema, template, or domain must have:

- source reason
- owner domain
- approved name
- config/schema
- tests or validation report
- doc
- log
- known limits
- update process

Development work must follow `docs/development_guidelines_for_dot.md` and
`docs/agent_process_tooling_guidelines_dot_v1_0_0_proposed.md`.
Templates, docs, proposals, tests, reports, and logs should be organized by
subdomain. Entity definition documents belong in `app_data/definition`.
User-created or imported working data belongs in `user_data` until validated
and promoted.

Vocabulary governance from `an_app_v5` adds these rules:

- check existing registry and datasets before creating a name
- prefer exact approved names
- if a similar name exists, extend the existing concept before proposing a new one
- reserve a new name before active use
- never delete vocabulary silently; deprecate with replacement and changelog
- operations should use `verb_entity` names when the operation is specific
- datasets should stay flat one-dimensional arrays unless a relationship map or data table is explicitly required
- bag-of-words and similar-word maps are governance aids, not replacement sources of truth

App data uses three approved folders:

| Folder | Purpose | Boundary |
| --- | --- | --- |
| `app_data/dataset` | One-dimensional approved arrays. | Use for flat allowed values such as names, types, statuses, operations, layout names, policy values, and validation labels. |
| `app_data/datamap` | Relationship collections grouped by relationship type. | Use when the core fact is an edge or mapping such as parent-child, alias, compatible-with, owns, depends-on, source-to-target, or validates. |
| `app_data/data_table` | CSV-style two-dimensional attribute and parameter tables. | Use when the core fact is a dataset item plus schema-defined fields, thresholds, settings, parameters, or descriptive attributes. |

App data must not contain executable behavior. Plugins and utilities consume app data; they do not hide app data inside code.

## Known Boundaries

An App V1 should not:

- run live financial trading
- move real money
- bypass compliance approval
- silently mutate governed records
- invent names when approved names exist
- treat source learning as active behavior until it is validated
- hide rejected, failed, or superseded records

## Risks

Key product risks:

- generic pipeline performance can degrade without stage contracts and indexing
- long-running agents can leak memory without limits and cleanup
- agent and workflow execution require permissions, sandboxing, and audit
- a universal entity model can become hard to understand without strong examples and diagnostics
- zero-dependency goals can slow delivery of editor/parser features
- cross-domain integration can become fragile unless all domains use shared entity, schema, dataset, and pipeline contracts
