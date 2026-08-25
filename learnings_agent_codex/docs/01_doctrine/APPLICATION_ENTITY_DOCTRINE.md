# An App Entity Doctrine

## Purpose

This document records the intended direction of the scratchpad entity system and
the project now called `an_app`. It describes the target architecture without
relying on earlier project names or old implementation names.

`an_app` is a real business application. Its purpose is to help create, update,
validate, compose, test, publish, and persist other applications from artifact creation plans.
The system does this by treating everything as an entity.

## Core Idea

Everything meaningful in the system is an entity.

An application is an entity. A template is an entity. A route, view, component,
workflow, user flow, utility, plugin, dataset, schema, policy, contract, test,
document, log, parsed sentence, command, input, output, shape, table, block, and
relationship can all be represented as entities.

The system should not depend on special controller classes for each type of
thing. Instead, it should use one generic entity model plus reusable operations,
schemas, datasets, templates, relationships, and workflow stages.

## Why This Matters

The intended system is not just a notebook, editor, flow builder, dashboard, or
shell. Those are examples of applications that can be produced by the system.

The deeper objective is a meta-application:

1. Accept natural input from a user, file, template, workflow, tool, or another
   application.
2. Break that input into meaningful pieces.
3. Classify words, sentences, data, shapes, commands, and intent using approved
   datasets and known entity definitions.
4. Validate the resulting entities against schemas, contracts, policies, and
   relationship rules.
5. Resolve references and relationships.
6. Compose entities into templates, views, workflows, routes, documents, tests,
   and deployable application structures.
7. Execute or preview the result when appropriate.
8. Persist the result as data.
9. Test the result.
10. Improve approved datasets, templates, schemas, and rules through controlled
    updates.

## An App Product Definition

`an_app` treats an application as data first.

An application is composed from:

- product config
- route map
- dataset manifest
- template set
- sample data
- registry entry
- lifecycle state
- documentation
- release checklist
- tests
- logs
- API route table
- storage policy
- registry contract
- changelog

The core runtime should not change when a new application is created. Creating a
new application means adding or updating entities, datasets, schemas, templates,
routes, relationships, policies, tests, and logs.

The shell should render navigation, tabs, panels, products, and available
templates from registry data. Product UI should not be hardcoded into the shell.

Core reusable modules:

- An App Lang: turns language and definition documents into validated entity
  change plans.
- An Bot: manages conversations, sessions, tool routing, task continuity,
  confidence display, and user-facing correction flow.
- An Memory: manages knowledge units, memory tiers, provenance, proof traces,
  gaps, conflicts, consolidation, and forgetting.
- English Language: supplies the English domain knowledge used by An App Lang.

## Application Artifact Creation

An application may begin as an application blueprint.

A blueprint becomes a live application through artifact creation:

1. Validate application blueprint.
2. Validate domain boundaries.
3. Validate route map.
4. Validate dataset manifest.
5. Validate dataset-to-template links.
6. Validate required registry entries.
7. Validate lifecycle state.
8. Create the versioned application artifact.
9. Register the created application.
10. Run smoke tests.
11. Record audit log and changelog entries.

Artifact Creation should be represented as an entity and a workflow, not as hidden
manual behavior.

## Artifact Creation

An App should be able to turn validated entity definitions into concrete
artifacts.

Artifact artifact creation may create:

- code files
- test files
- docs
- logs
- route maps
- views
- components
- datasets
- data maps
- data tables
- configs
- schemas
- templates
- workflow definitions

Artifact Creation must be plan-first:

1. Create an artifact plan from entity definitions.
2. Validate names, relationships, policies, and contracts.
3. Check approval policy.
4. Create the artifact.
5. Run tests or smoke checks.
6. Record provenance, diagnostics, and audit log entries.

Runtime execution of generated artifacts is blocked by default. It may happen
only when an explicit policy allows it, required validation passes, and the
action is audited.

Generated artifact records should include:

- source entity ids
- source definition ids
- artifact type
- output path
- validation result ids
- test result ids
- approval id
- provenance ids
- audit id

## Application Lifecycle

Application lifecycle should be explicit and data-driven:

- proposed
- draft
- under_review
- approved
- ready
- active
- stable
- production
- deprecated
- archived

## System Boot Sequence

An App boot should be explicit and auditable:

1. detect runtime
2. load shell config
3. initialize core entities
4. scan entity directories
5. validate entity schemas
6. build relationship graph
7. discover plugins
8. validate signatures
9. register plugin entities
10. resolve requirements
11. check conflicts
12. initialize in order
13. call init hook
14. call load hook
15. call activate hook
16. emit ready event
17. accept user input
18. begin event processing

Lifecycle transitions should be validated by policy. Promotion should require
tests and diagnostics to pass.

## Domain Model

A domain is a logical boundary for business meaning.

A domain entity should define:

- allowed entity types
- allowed document types
- allowed relationship types
- state transition policy
- approved datasets
- approved vocabulary links
- allowed cross-domain imports
- restricted namespaces

This prevents one application or agent from silently redefining a term that
already has approved meaning in another domain.

## Registry Model

Registries are entities that make approved names and capabilities discoverable.

Required registry concepts:

- master registry
- entity registry
- component registry
- template registry
- domain registry
- product registry
- route registry
- dataset registry
- command registry
- service registry

The system should validate that every referenced registry item exists before an
application is created.

Required registry checks:

- every product resolves
- every available product resolves
- every route resolves
- every dataset resolves
- every template resolves
- every service resolves
- every workflow resolves
- every component resolves
- every created version has a changelog entry

The registry should be available through an API route so generated shells,
agents, tests, and documentation can inspect the same live contract.

## Dataset To Template Contract

Every dataset that is intended for display should declare the template or
component family that can render it.

This creates a contract:

- dataset defines fields and domain
- template defines slots and display expectations
- validator confirms they match
- display stage renders only after the contract passes

This prevents silent blank screens when a dataset has no compatible template.

A dataset manifest row should declare:

- dataset id
- label
- domain
- entity type
- template
- component family
- allowed layouts
- read mode
- edit mode
- validation policy

Every dataset intended for display must have an approved template mapping. Every
mapped template must resolve to registered components.

## Complete Starter Templates

`an_app` should include complete starter templates, not only tiny examples.

Initial starter templates should include:

- learning management system
- fintech organization
- organization management
- single user workspace
- sample pipeline collection
- documentation set

A complete starter template should include:

- application blueprint
- domain manifest
- route map
- dataset manifest
- sample data
- schemas
- template set
- component list
- user flows
- policies
- tests
- docs
- release checklist

Starter templates should be treated as entities. A user can create a new
application from a template, inspect the template, modify it, validate it, and
publish a changed version as a new approved template.

## Layout Projection

The same data should be viewable through different layouts.

This means data is not owned by one layout. A JSON object, dataset, entity,
workflow, document, or application blueprint can be projected into multiple
views:

- text editor
- collapsible tree
- document view
- diagram view
- dashboard view
- table view
- card view
- kanban view
- calendar view
- flowchart view
- mindmap view

For example, the same JSON entity can be rendered as:

- a structured text editor
- a collapsible tree
- a document-style page
- a diagram
- a table
- cards
- a workflow canvas

The projection should be selected by render profile. A render profile defines:

- source data type
- target layout
- read or edit mode
- template family
- component family
- allowed operations
- validation rules

This makes layouts reusable lenses over the same canonical entity data.

Route-level layout projections should declare a default layout and alternate
layouts. Projections must not duplicate canonical data. They may declare read
mode, edit mode, required template, component family, and route permissions.

Core layout archetypes to support:

- app workspace
- site page
- document reader

Workspace structures to support:

- single tab
- multiple tab
- split panel

Common product route projections should support grid, list, compact, document,
form, tree, diagram, table, card, kanban, calendar, timeline, dashboard, and
collapsible tree views when the dataset contract allows them.

## Entity Model

Every entity should have a consistent shape:

- `id`: stable identifier.
- `type`: approved entity type.
- `name`: approved or proposed name.
- `status`: lifecycle state.
- `traits`: capabilities such as storable, displayable, executable, editable,
  composable, resolvable, searchable, or testable.
- `config`: attributes, parameters, relationships, policy settings, defaults,
  limits, and runtime options.
- `relationships`: links to other entities using approved relationship types.
- `contracts`: input, output, behavior, or compatibility expectations.
- `policies`: rules for what is allowed, blocked, required, or warned.
- `schema`: structural expectations for the entity data.
- `data`: entity-specific payload.
- `diagnostics`: findings produced during validation, reasoning, or execution.
- `metadata`: version, author, timestamps, provenance, and lineage.

The entity shape should stay generic. Specialized meaning comes from approved
datasets, schemas, traits, relationships, and operations.

## Application As Entity

An application entity represents a complete app or tool that can be composed,
rendered, tested, persisted, and evolved.

An application entity can contain or use:

- route entities
- view entities
- component entities
- template entities
- workflow entities
- user flow entities
- command entities
- dataset entities
- schema entities
- policy entities
- contract entities
- utility entities
- plugin entities
- test entities
- document entities
- log entities

The application entity should describe structure and behavior as data. A builder
can then compose an actual application from those entities.

## Real Business Application Scope

The first business-domain proof should support organization management.

Expected domain entities include:

- organization
- department
- person
- employee
- manager
- role
- permission
- punch_log
- leave_ledger
- payroll_slip
- candidate
- approval_request
- appraisal
- asset
- offboarding_process
- training_course
- helpdesk_ticket

Expected business features include:

- organization chart viewer
- role and permission policy manager
- personnel directory
- session activity log
- employee master
- company master
- attendance and leave tracking
- daily punch logging
- payroll calculation
- candidate onboarding
- approvals hub
- performance appraisal tracking
- asset register
- offboarding tracker
- training records
- helpdesk ticketing
- dashboard

Additional starter domains should include:

- learning management system: courses, lessons, quizzes, learner progress,
  certificates, study books, and assessments.
- fintech organization: accounts, portfolios, positions, orders, transactions,
  reports, risk checks, and approvals.
- single user workspace: notes, tasks, personal datasets, documents, workflows,
  prompts, settings, and local history.
- sample pipelines: create application, create application artifacts,
  dataset-to-template rendering, natural input to entity, business dashboard,
  approval workflow, learning progress, financial records, and personal
  workspace flows.

Expected business relationships include:

- employee has punch_log
- employee has leave_ledger
- employee has payroll_slip
- employee manages employee
- employee submits approval_request
- employee receives appraisal
- employee holds asset
- employee completes training_course

Relationships should include cardinality where needed:

- one_to_one
- one_to_many
- many_to_one
- many_to_many

## Template As Entity

A template entity defines reusable composition.

A template can describe:

- expected input slots
- allowed child entities
- required relationships
- display structure
- output format
- validation rules
- compatible entity types

Users should be able to create templates, select templates, update templates,
validate templates, and generate entities or applications from templates.

## Component As Entity

A component entity represents a visible or interactive part of an application.

Examples include:

- menu bar
- sidebar
- panel
- tab
- button
- input composer
- command palette
- notebook grid
- cell row
- flow canvas
- flow node
- table block
- chart panel
- calendar view
- gallery view
- response renderer

Component entities should be declared through approved component names. Rendering
should fail with a diagnostic if a component name is unknown or has no registered
template.

Core component coverage should include common interactive states and content
states:

- button
- input
- textarea
- select
- checkbox
- radio
- switch
- range
- badge
- card
- alert
- dialog
- accordion
- tabs
- toast
- tooltip
- skeleton
- spinner
- avatar
- table
- progress
- meter
- separator
- breadcrumb
- toggle
- toggle group
- scroll area
- pagination
- timeline
- keyboard hint
- code block
- mark
- blockquote
- divider
- stack
- group
- grid

Component validation should cover default, hover, focus, disabled, loading,
empty, error, success, warning, selected, expanded, collapsed, and responsive
states where relevant.

## Book And Cell As Entities

Book and cell should not require special manager classes.

A book is an entity that can contain cells, use layouts, use templates, and be
persisted.

A cell is an entity that can be edited, displayed, executed, referenced, tested,
and connected to other cells.

Behavior should come from generic operations:

- create entity
- update entity
- delete entity
- link entity
- validate entity
- compose entity
- display entity
- execute entity
- persist entity
- search entity
- export entity
- import entity

This means a notebook application is just one application built from the same
entity system.

## User Flow As Entity

A user flow entity describes how a person accomplishes a task.

Expected flows include:

- create application
- create book
- create cell
- edit cell
- run cell
- run all cells
- reference another cell
- switch layout
- create workflow
- connect workflow nodes
- run workflow
- create template
- use template
- search content
- import application data
- export application data
- open document view
- update settings
- review diagnostics
- run tests
- create product
- create product artifacts
- transition product lifecycle
- inspect product registry
- view saved product versions
- check access
- open API-backed dataset
- switch route projection
- review changelog

User flows should be represented as data so they can be validated, rendered,
tested, and improved.

## Natural Input Flow

Natural input should be handled through a shared flow:

1. Decompose input into candidate parts.
2. Classify tokens, phrases, sentences, data shapes, and commands.
3. Match candidates against approved datasets.
4. Detect proposed new names.
5. Validate proposed names against banned words and near-duplicate names.
6. Parse intent.
7. Resolve known entities and relationships.
8. Compose a structured entity change plan.
9. Validate the plan.
10. Apply the plan only when it passes policy.

This allows plain English to become structured application data without making
the system guess silently.

## Universal Flow Stages

The target runtime should support these shared stages:

- `decompose`
- `validate`
- `parse`
- `transform`
- `reason`
- `resolve`
- `index`
- `compose`
- `execute`
- `format`
- `display`
- `persist`
- `respond`

These stages are data-driven. A pipeline is an ordered stage list bound to
registered operations. Domain-specific pipelines should be siblings of the
default pipeline, not hard-coded exceptions.

## Approved Vocabulary

Approved names should live in datasets.

Datasets should exist for:

- entity types
- entity traits
- operation names
- relationship types
- lifecycle statuses
- stage names
- pipeline names
- intent names
- policy rule types
- contract rule types
- schema field types
- diagnostic levels
- artifact types
- file roles
- test case kinds
- UI component names
- UI layout names
- UI panel names
- UI command names
- block kinds
- workflow node kinds
- import formats
- export formats
- keyboard command names
- application project names
- application scope names
- product blueprint parts
- deployment variant names
- domain boundary names
- registry names
- template super-type names
- template category names
- business domain names
- organization entity names
- organization feature names
- relationship cardinalities
- role names
- permission action names
- config section names
- starter template names
- sample pipeline names
- layout projection names
- render profile names
- API route names
- storage adapter names
- theme token names
- component state names
- route projection names
- product lifecycle action names

The system should use these datasets both for creation and validation. A new
name should be proposed, checked, and accepted before it becomes part of the
approved vocabulary.

## Validation

Validation should be a reusable utility, not embedded inside a specific entity
plugin.

Validation should check:

- entity shape
- required fields
- approved entity type
- approved relationship type
- approved operation name
- approved lifecycle status
- approved UI name
- banned words
- near-duplicate names
- schema compatibility
- contract compatibility
- policy rules
- graph cycles
- unknown references
- missing templates
- missing operation handlers
- invalid input and output

Plugins should call validation. They should not own the validation vocabulary.

## Relationships

Relationships are the source of truth for how entities connect.

Examples:

- application contains route
- application contains view
- view uses component
- component uses template
- workflow contains node
- node connects_to node
- book contains cell
- cell references cell
- template expects schema
- plugin provides operation
- utility validates entity
- dataset approves name
- test verifies flow
- document describes entity
- log records execution

Shortcut fields may be accepted only for migration or compatibility, but the
relationship graph should be the canonical structure.

## Plugins

Plugins should represent reusable behavior, not special ownership of one entity
type.

Useful plugin categories:

- entity lifecycle plugin
- entity composition plugin
- entity template plugin
- entity application plugin
- entity interaction plugin
- entity persistence plugin
- entity workflow plugin
- entity display plugin
- entity test plugin

These plugins should operate through generic entity methods and approved
operation names.

## Utilities

Utilities should be reusable and narrow.

Useful utilities:

- entity validator
- entity parser
- entity reasoner
- entity resolver
- entity registry
- dataset validator
- schema registry
- template registry
- command registry
- workflow graph validator
- relationship graph utility
- search and index utility
- import and export utility
- markdown utility
- semantic layout validator
- test generation utility
- diagnostics formatter
- application artifact creator
- domain manifest validator
- registry validator
- route map validator
- dataset manifest validator
- dataset-to-template validator
- lifecycle transition validator
- permission policy validator
- audit log writer
- render profile validator
- layout projection composer
- multi-layout preview utility
- API route validator
- product version registry
- changelog writer
- storage adapter validator
- theme token validator
- component state validator
- semantic UI validator

Utilities should not silently invent new vocabulary. They should consult
datasets and return findings when unknown names appear.

## API Surface

An App should expose a registry-backed API surface as route entities.

Core API route concepts:

- get registry
- get dataset rows
- create product
- update product
- delete product
- create product artifacts
- list product versions
- transition product lifecycle
- build deployment artifact
- process datatype pipeline
- get access control data
- check permission
- get current actor
- get template taxonomy
- get template library

API routes should declare method, path pattern, input contract, output contract,
permission policy, diagnostics, and audit behavior.

## Storage And Logs

Storage should be selected by deployment profile.

Required storage concepts:

- local browser storage
- local file storage
- backend service storage
- desktop shell storage
- script host storage

Logs should be append-only unless a retention policy explicitly allows archive
or compaction.

Required logs:

- changelog
- audit log
- metrics log
- demo transition log
- validation log
- artifact creation log

Never delete history silently. New events should append to logs with timestamp,
actor, entity id, action, result, and diagnostics.

## Theme And Token Model

Themes should be data-driven.

Theme entities should define:

- color tokens
- spacing tokens
- typography tokens
- radius tokens
- shadow tokens
- layout sizing tokens
- state tokens

The shell may translate external theme ideas into approved tokens, but it should
not import unrelated utility naming directly into canonical An App vocabulary.

## Semantic UI Governance

The UI layer should prefer semantic structure and data attributes for behavior.

Semantic UI rules:

- meaningful elements should describe page structure
- data attributes may select layout, variant, state, mode, and entity binding
- product content should come from registry, dataset, template, and route data
- component classes from external packages should be translated into approved
  component names and tokens
- keyboard navigation should be required for tabs, dialogs, menus, command
  palette, forms, and examples

## Application Builder Scope

The first major application to prove the system should include:

- application shell
- multi-book workspace
- editable cells
- markdown rendering
- natural-language pipeline cells
- code execution cells
- visual workflow builder
- templates gallery
- command palette
- global search
- import and export
- local persistence
- document views
- diagnostics panel
- test runner panel
- layout switching
- relationship inspection
- product creation workflow
- application artifact creation workflow
- domain management
- registry inspection
- role and permission management
- audit log viewer
- organization management dashboard
- complete starter template gallery
- same-data multi-layout viewer
- render profile picker
- registry-rendered sidebar and tabs
- API-backed product workspace
- product versions view
- append-only changelog viewer
- storage health viewer
- theme token editor
- semantic component state gallery
- in-app developer guide
- API reference viewer

This application should be generated or assembled from entities, schemas,
datasets, templates, relationships, and workflows.

## Testing Expectations

The system should test:

- entity creation
- entity validation
- relationship validation
- dataset validation
- schema validation
- template rendering
- component registry coverage
- command registry coverage
- workflow graph execution
- graph cycle detection
- unknown reference detection
- import and export round trip
- persistence round trip
- natural input parsing
- application generation
- generated application smoke flows
- API route contract tests
- registry-rendered UI tests
- product artifact creation tests
- product version tests
- append-only log tests
- component state tests
- keyboard navigation tests
- theme token tests
- storage adapter tests
- semantic UI tests

The generated test utility should eventually test instance methods, constructor
behavior, configuration behavior, and expected success cases. It should be able
to say that code appears correct when tests pass and no diagnostics are found.

## Design Rule

Do not create special classes simply because a noun exists.

Create a new class, plugin, utility, dataset, schema, or template only when it
adds reusable capability.

The default answer should be:

One entity model.
Approved datasets.
Reusable validation.
Relationships as truth.
Templates for composition.
Workflows for behavior.
Plugins for reusable operations.
Tests for confidence.

## Current Scratchpad Alignment

The scratchpad already supports part of this doctrine:

- generic entity lifecycle through `action_entity`
- reusable validation through `entity_validator`
- approved vocabulary datasets
- separate UI vocabulary dataset
- relationship-first modeling
- simple parsing
- simple reasoning
- stage runner
- application manifest planning
- focused tests

Recent scope adoption added approved vocabulary for `an_app`, application
blueprints, artifact creation, registries, domains, deployment variants,
lifecycle transitions, relationship cardinality, role and permission concepts,
template super-types, template categories, and organization-management domain
features.

Recent source coverage also adds registry-rendered UI, API route contracts,
dataset manifest row fields, route-level layout projections, component state
coverage, append-only logs, storage adapter policy, semantic UI governance,
theme token translation, and product version history.

Remaining work should focus on schemas, template registry, command registry,
component registry, workflow graph validation, natural input planning, richer
application generation, artifact creation workflow, business-domain sample
schemas, API route implementation, storage adapters, component state coverage,
and stronger generated tests.
