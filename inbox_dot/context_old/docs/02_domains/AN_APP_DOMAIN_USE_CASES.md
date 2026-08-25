# An App Domain Use Cases

## Purpose

This document defines what An App should be able to do, organized by domain.
It is anchored in `an_app.txt`.

An App is a real business application framework where every important thing is
an entity: application, file, UI component, template, dataset, schema, policy,
workflow, command, memory item, experiment, report, and generated artifact.

Each application should have a definition file that declares metadata,
allowed runtime, feature flags, definitions, shapes, patterns, schemas, config,
runtime dependencies, and policies. The app shell reads that definition,
resolves dependencies, builds defaults, mounts the app, and maintains global
context through `action_entity`.

## Reading Order

Read this document in three layers:

1. Product/module use cases: what each named An App module is responsible for.
2. Business-facing use cases: what users want to create or operate.
3. Domain use cases: the internal domains that make those business use cases
   possible.

## Product And Module Use Cases

This section separates the use cases by named An App product/module boundary.
Each module is still entity-first and should use shared validation, runner,
dataset, schema, memory, policy, and audit services.

### An App

An App is the main business application framework.

Use cases:

- create a full business application from a definition file
- maintain a knowledge base and use it to create new applications
- create website, product, notebook, workflow, pipeline, automation, research,
  experiment, template, and dashboard entities
- resolve runtime, dependencies, defaults, policies, routes, layouts, and view
  frame
- manage application state through `action_entity`
- validate every application record before activation
- render the same data in multiple layouts
- generate docs, logs, tests, and acceptance records for created artifacts

### An App Shell

An App Shell is the runtime host for one application.

Use cases:

- load the application definition file
- detect runtime
- resolve plugins, utilities, datasets, datamaps, datatables, definitions, and
  templates
- initialize global context and cache
- mount the app into the configured target element
- wire default flows, listeners, routes, and view frame
- enforce application-level cache, storage, security, routing, naming, and
  create policies

### An App Lang

An App Lang is the language and parsing capability.

Use cases:

- parse natural English and controlled English into structured records
- parse markdown definitions into document trees
- classify input as command, definition, rule, question, comparison,
  condition, correction, or continuation
- normalize synonyms to approved names
- extract entities, relationships, rules, facts, patterns, shapes, schemas,
  templates, and policies
- build AST and DAG records when required
- create validated change plans for An App
- preserve source metadata, parser evidence, and confidence

### An Bot

An Bot is the conversational module inside An App.

Use cases:

- receive user requests
- keep session context
- distinguish new task from continuation
- ask clarification when required slots are missing
- show proposed actions before risky work
- support approve, reject, retry, explain, run test, and show diff actions
- recall memory with proof traces
- create correction, feedback, task, decision, and audit records

### An Memory

An Memory is the governed knowledge and recall module.

Use cases:

- store working, episodic, semantic, and procedural memory
- preserve facts, rules, relationships, evidence, sources, corrections,
  conflicts, gaps, and findings
- stage extracted knowledge as hypotheses
- promote, demote, archive, or rollback knowledge through policy
- track confidence, source trust, validation count, and proof traces
- support exact, recent, topic, entity, relationship, source, confidence, and
  gap recall

### An Agent System

An Agent System represents specialized worker/reviewer modules.

Use cases:

- create developer, reviewer, researcher, tester, maintainer, writer, and
  domain agents
- assign capabilities, flows, policies, tools, and review duties
- coordinate optional team handoffs through an event bus
- preserve request, acknowledge, execute, emit manifest, validate, and close
  records
- keep all agent work auditable and policy-controlled

### An UI Surface

An UI Surface renders An App entities.

Use cases:

- show the same data in notebook, code editor, block editor, document,
  collapsible tree, diagram, dashboard, table, card, kanban, calendar,
  timeline, canvas, form, chat, parser workbench, language workbench, and chart
  layouts
- create route, view, component, panel, command bar, input surface, and output
  surface entities
- render JSON as editor text, tree, document, diagram, dashboard, or table
- keep UI names approved by UI datasets

### An Experiment

An Experiment is the versioned analysis and hypothesis-testing module.

Use cases:

- create experiments and experiment versions
- create nested rule and filter trees
- run experiments through the shared runner
- persist run config, inputs, outputs, findings, metrics, and audit records
- compare experiment versions
- render summary, table, chart, dashboard, and finding views
- stage discovered expressions as hypotheses before promotion

### An Template System

An Template System owns reusable creation patterns.

Use cases:

- create templates for websites, apps, products, notebooks, workflows,
  pipelines, documents, reports, schemas, datasets, dashboards, and experiments
- define placeholders, defaults, examples, output contracts, and validation
  policies
- create LMS, fintech organization, single user, organization management, and
  other business templates
- track generated artifact to template version
- stage template changes before approval

### An Quality Audit

An Quality Audit proves that created or changed work is acceptable.

Use cases:

- define acceptance criteria
- define rejection criteria
- run two-stage validation
- detect gaps, conflicts, deferred items, and recommendations
- verify docs, tests, logs, provenance, names, schemas, relationships, and
  policies
- create monitoring gates for active systems

## Application Entity Doctrine

Use cases:

- create a new application entity from a definition file
- create application parts as entities: route, view, component, workflow,
  dataset, schema, template, policy, command, and report
- validate relationships between application entities
- detect duplicate names, unknown references, and invalid relationship cycles
- import and export application definitions
- version application definitions
- trace every generated artifact back to source, template, or user instruction
- use one entity operation layer instead of separate managers for state, book,
  cell, UI, template, and workflow records

## App Shell

Use cases:

- detect runtime
- load application definition
- resolve runtime dependencies
- resolve default config
- resolve default flows
- resolve default listeners
- resolve default view frame
- mount application into the configured browser element
- maintain global context and cache through a dedicated `action_entity`
  instance
- enforce cache, storage, security, routing, naming, and create policies

## Business-Facing Use Cases

These are the user-visible jobs An App should support. Each business use case
is still implemented through entities, templates, datasets, schemas, policies,
flows, plugins, utilities, memory, UI layouts, and audit records.

### Create A Website

User goal:

- create a website for a person, product, company, event, documentation hub,
  or internal tool

Expected system behavior:

- collect business purpose, audience, pages, sections, content, visual style,
  assets, routes, forms, and publishing target
- create website, page, route, section, component, asset, content block, and
  policy entities
- use approved layout and UI names
- generate or bind templates
- validate names, routes, links, forms, and missing content
- render preview in browser layout
- create docs, tests, and audit record

### Create A Product

User goal:

- define and manage a product, product package, feature set, roadmap, pricing,
  market, customer segment, and launch plan

Expected system behavior:

- create product, feature, requirement, customer, market, pricing, roadmap,
  release, risk, and metric entities
- connect product records to docs, templates, experiments, and tasks
- produce product brief, requirements doc, release plan, and dashboard
- track decisions, assumptions, validation evidence, and open questions

### Manage A Fintech Organization

User goal:

- manage customers, accounts, payments, ledger records, compliance cases,
  approvals, reconciliation, reports, and operational dashboards

Expected system behavior:

- create fintech organization, product, customer, account, transaction,
  ledger, payment, compliance, approval, reconciliation, report, and dashboard
  entities
- validate money-related records through schema, currency, precision,
  reference, policy, and audit checks
- run reconciliation and exception workflows
- show finance, risk, compliance, and operations dashboards

### Build And Test Stock Trading Algorithms

User goal:

- create trading strategies, import market data, run backtests, compare
  strategy versions, and validate hypotheses before promotion

Expected system behavior:

- create market data, symbol, feature, indicator, signal, rule, strategy,
  backtest, trade, position, metric, finding, report, and dashboard entities
- validate data quality, lookahead bias, strategy dependencies, and risk rules
- run backtest and walk-forward pipelines
- stage discovered rules as hypotheses before promotion
- render charts, tables, reports, and dashboards

### Create A Notebook Or Book

User goal:

- create a notebook/book for notes, research, tasks, code-like cells,
  experiments, workflows, or documentation

Expected system behavior:

- create book, page, cell, block, dataset, output, command, and view entities
- support markdown, structured data, workflow, table, chart, and result cells
- use the shared runner for executable cells where policy allows execution
- persist notebook state through `action_entity`
- render the same content as notebook, block editor, code editor,
  collapsible tree, diagram, or dashboard

### Create Automation Or Scheduled Work

User goal:

- create cron-like jobs, reminders, recurring checks, data refreshes,
  repository checks, report generation, or workflow automation

Expected system behavior:

- create automation, schedule, trigger, condition, action, policy, retry,
  notification, and audit entities
- validate schedule, allowed runtime, permission, retry policy, and output
  contract
- run through shared runner
- persist every run with status, result, logs, metrics, and next run time

### Create A Research Agent

User goal:

- create an agent that researches a topic, collects sources, extracts facts,
  compares evidence, writes summaries, and reports gaps

Expected system behavior:

- create research agent, topic, source, evidence, claim, fact, gap, conflict,
  summary, and report entities
- use external intake only through policy
- stage extracted facts as hypotheses
- validate facts through source trust, schema, and contradiction checks
- produce traceable research notes and reports

### Create A Team Of Agents

User goal:

- create a team with roles such as researcher, developer, reviewer,
  tester, maintainer, writer, or domain expert

Expected system behavior:

- create team, agent, role, task, handoff, manifest, validation, and close
  entities
- use optional agent bus flow: request, acknowledge, execute, emit manifest,
  validate, close
- enforce permissions and approval policy per role
- preserve all handoffs and decisions as audit records

### Edit Markdown Or Documentation

User goal:

- edit markdown, restructure docs, generate docs, compare docs, or maintain a
  handbook

Expected system behavior:

- parse markdown into document tree entities
- preserve headings, sections, lists, tables, links, code blocks, and source
  spans
- support document, block editor, collapsible tree, and code editor layouts
- validate placeholders, links, required sections, row traceability, and
  orphan content
- export markdown and run round-trip validation

### Create A Business Application

User goal:

- create a real application such as LMS, fintech operations app, CRM-like
  workspace, personal knowledge app, project tracker, approval system, or
  reporting portal

Expected system behavior:

- create application definition, domain, entity, schema, dataset, datamap,
  route, view, component, workflow, policy, command, and template entities
- resolve runtime, dependencies, defaults, flows, listeners, and view frame
- validate relationships and schema before generation
- render application shell
- create docs, tests, logs, and acceptance report

### Create Flows And Pipelines

User goal:

- create a pipeline for ingestion, parsing, validation, execution, reporting,
  source adoption, research, experiment runs, or business operations

Expected system behavior:

- create flow, stage, step, condition, input, output, dependency, retry,
  rollback, and audit entities
- build AST or DAG where needed
- validate unknown dependencies and cycles
- execute through shared runner
- persist stage outputs and final report

### Create Experiment Or Analysis Workspace

User goal:

- create experiments for strategy mining, product tests, data analysis,
  feature comparison, hypothesis validation, or versioned research

Expected system behavior:

- create experiment, version, run, rule node, filter node, source dataset,
  derived feature, finding, chart, and report entities
- support nested rule/filter builder
- run comparison across versions
- display output in summary, table, chart, and dashboard layouts
- stage findings as hypotheses before promotion

### Create Templates

User goal:

- create reusable templates for websites, applications, notebooks, pipelines,
  docs, reports, domains, datasets, schemas, or experiments

Expected system behavior:

- create template, placeholder, default, example, validation rule, output
  contract, and version entities
- validate required placeholders
- track template use in generated artifacts
- stage template changes before approval

### Create Knowledge Base

User goal:

- maintain a personal, team, product, research, or organization knowledge base

Expected system behavior:

- ingest documents and notes
- extract entities, facts, rules, relationships, gaps, and conflicts
- classify by domain and source
- stage uncertain knowledge
- promote validated knowledge into memory
- expose search, recall, proof trace, and dashboard views

## An App Lang

Use cases:

- turn natural English into structured application change plans
- parse controlled English into entities, properties, operations, and rules
- convert markdown definition documents into trees
- classify words, phrases, sentences, command targets, and entity candidates
- normalize synonyms to approved names
- build AST and DAG records from input when needed
- detect incomplete input and request clarification
- extract semantic particles from text
- create rule candidates and relationship candidates
- preserve input source metadata and parser evidence

## English Language Domain

Use cases:

- classify sentence type and intent
- detect command, query, definition, comparison, condition, rejection,
  confirmation, clarification, greeting, farewell, and compound input
- split text into sentences and paragraphs
- handle incomplete sentences
- extract keywords with approved stop-word filtering
- support prompt completion and suggestion behavior
- provide English grammar datasets for An App Lang
- keep English-specific grammar separate from generic application logic

## Command Capability Domain

Use cases:

- map user commands to approved capabilities
- resolve command synonyms before execution
- select action, target family, slots, defaults, and risk level
- request clarification when command slots are missing
- require approval for risky operations
- create audited command outcome records
- route commands to plugins, utilities, flows, or app shell operations
- maintain command templates and examples

## An Bot

Use cases:

- act as the conversational module inside An App
- keep session context
- distinguish new task from continuation
- ask one clear question when input is incomplete
- expose quick actions such as approve, reject, retry, explain, run test,
  and show diff
- call memory recall with proof traces
- create task, decision, correction, and feedback records
- show confidence, status, and pending approval state
- never bypass entity validation or policy gates

## Agent System

Use cases:

- represent helper, reviewer, developer, maintainer, and domain agents as
  entities
- assign capabilities, policies, specialties, and flows to agents
- create review tasks and audit tasks
- support optional multi-agent event bus handoff
- record request, acknowledge, execute, emit manifest, validate, and close
  lifecycle for agent work
- preserve all handoffs as auditable records

## An Memory

Use cases:

- store working memory for current session context
- store episodic memory for past actions, runs, decisions, and failures
- store semantic memory for stable concepts, patterns, facts, and relationships
- store procedural memory for known flows and templates
- stage extracted knowledge as hypotheses
- promote, demote, archive, or rollback knowledge
- track confidence, provenance, proof traces, conflicts, gaps, and source trust
- create repair records for specialize, generalize, split, merge, reclassify,
  demote, rollback, retry, and request review

## Dataset Registry

Use cases:

- maintain approved one-dimensional word datasets
- validate names against approved vocabulary
- block banned words
- prevent near-duplicate names where an approved name already exists
- maintain registry maps for schemas, rules, templates, policies, and domains
- maintain relationship maps
- produce dataset validation reports with counts and duplicate checks
- record owner doc and source for every dataset group

## Schema And Contract Catalog

Use cases:

- define required fields for every entity type
- validate records against schema
- define plugin, utility, template, command, memory, experiment, and audit
  contracts
- define application definition schema
- define runtime dependency schema
- define hypothesis, repair, source trust, acceptance, rejection, experiment
  run, and finding schemas
- manage schema migration records

## Template Domain

Use cases:

- create applications from starter templates
- create domain templates for LMS, fintech organization, single user,
  organization management, and other sample business packages
- create layout, flow, document, dataset, schema, report, and knowledge
  templates
- create app definition templates
- fill placeholders from approved options
- validate template output
- track generated artifact to template version
- use expression templates for guided discovery and experiments

## UI Surface Domain

Use cases:

- render the same data through multiple layouts
- support notebook, code editor, block editor, document view, collapsible tree,
  diagram, dashboard, table, card, kanban, calendar, timeline, canvas, form,
  chat, parser workbench, language workbench, and chart layout
- render JSON as text editor, tree, document, diagram, dashboard, or table
- provide route, view, component, panel, command bar, and input surface
  entities
- keep layout names approved through UI datasets
- compose views from entity records and templates

## File Conversion Domain

Use cases:

- parse files into document trees
- convert supported formats into An App records
- preserve source spans and provenance
- compare trees
- merge trees with conflict reporting
- export records into governed artifacts
- run round-trip validation
- report unsupported content instead of silently dropping it

## External Intake Domain

Use cases:

- intake local files, folders, URLs, APIs, and connected workspaces
- normalize external evidence records
- enforce allowed protocol, timeout, size, and authentication policy
- preserve raw evidence when policy allows it
- classify source type and source trust
- create structured error records on failure
- keep external intake separate from memory promotion

## Repository Operations Domain

Use cases:

- inspect repository status
- prepare push-sized batches
- create change summaries
- write docs and logs for promoted utilities/plugins/datasets
- avoid reverting unrelated user changes
- support user-managed GitHub Desktop workflow
- provide commit message recommendations
- record major decisions in logs

## Quality Audit Domain

Use cases:

- run two-stage validation for source adoption
- create completeness reports
- create gap, conflict, deferred, and recommendation records
- define acceptance criteria before activation
- define rejection criteria that block activation
- monitor active systems with warning and critical thresholds
- verify tests, docs, logs, provenance, and policy compliance
- ensure generated output is traceable to source, template, or instruction

## Experiment Domain

Use cases:

- create experiments as entities
- create experiment versions
- create experiments from templates
- run experiments through shared runner and validator
- persist run config, inputs, outputs, findings, and audit evidence
- build nested rule and filter trees
- validate hypotheses
- compare runs and versions
- show tabbed results with summary, table, chart, and finding views
- support template-guided expression discovery
- stage discovered expressions as hypotheses before promotion

## Fintech Organization Management Domain

Use cases:

- create fintech organization workspace
- manage customers, accounts, products, payments, subscriptions, fees, invoices,
  and ledger records
- ingest transaction batches
- reconcile payments, payouts, settlements, and ledger entries
- create exception queues and approval workflows
- manage KYC, AML, risk, compliance, and audit cases
- generate operations, finance, risk, compliance, and executive dashboards
- create reports and audit packs

## Algo Stock Trading Domain

Use cases:

- create trading research workspace
- import market data
- define symbols, timeframes, indicators, derived features, signals, rules,
  strategies, and versions
- run backtests and walk-forward validation
- compare strategy versions
- detect regimes and data-quality issues
- validate hypotheses and stage candidate rules
- render charts, trade tables, metric dashboards, findings, and reports

## Development Plan Domain

Use cases:

- inventory existing code
- compare code against domain scope
- identify missing utilities, plugins, datasets, schemas, and docs
- prioritize foundation utilities before plugins
- split work into push-sized batches
- define acceptance checks for each batch
- keep open decisions visible
- give the user a go-ahead and commit message after each complete batch

## Minimum End-To-End Business Application Use Case

The smallest real An App flow should support:

1. user describes an application in English
2. An App Lang parses and classifies the request
3. command capability selects the create application capability
4. app shell loads the relevant template and definition schema
5. action entity creates application, schema, route, view, dataset, and policy
   entities
6. entity validator checks names, schema, relationships, and banned words
7. runner executes the approved creation pipeline
8. UI surface renders the application definition in at least two layouts
9. quality audit writes test, doc, provenance, and acceptance records
10. repository operation prepares the push summary and commit message
