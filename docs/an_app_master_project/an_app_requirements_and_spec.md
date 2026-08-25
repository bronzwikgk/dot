# An App Requirements And Spec

## Requirement Index

| Id | Area | Requirement | Priority | Status | Owner Domain | Implementation State | Test Ref | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| req_app_001 | doctrine | Treat every durable concept as an entity-backed record. | must | adopted | doctrine | planned | test_concept_shape | Application Entity Doctrine, an_app.txt |
| req_app_002 | entity | Store config, schema, relationships, policy, provenance, status, traits, attributes, links, diagnostics, and validation state on entities. | must | adopted | entity_system | partial | test_entity_contract | Schema Contract Catalog, gk_app_v2 |
| req_app_003 | concept | Document active concepts with the canonical concept shape. | must | adopted | doctrine | planned | test_concept_shape | an_app_v5 |
| req_app_004 | vocabulary | Validate approved names, banned words, duplicate values, similar names, reservations, and deprecations before active use. | must | adopted | dataset_registry | partial | test_vocabulary_governance | Dataset Registry Requirements, an_app_v5 |
| req_app_005 | dataset | Organize datasets by code, ui, system, and domain ownership while keeping one-dimensional word datasets flat. | must | adopted | dataset_registry | partial | test_dataset_registry | an_app_v5 |
| req_app_005a | app_data | Store app data in `app_data/dataset`, `app_data/datamap`, and `app_data/data_table` with strict shape boundaries. | must | proposed | dataset_registry | planned | test_app_data_shape | user clarification 2026-08-25 |
| req_app_005b | structure | Organize templates, docs, proposals, tests, reports, and logs by subdomain; store user working data in `user_data`; store entity definitions in `app_data/definition`. | must | proposed | doctrine | planned | test_folder_structure | user clarification 2026-08-25 |
| req_app_006 | schema | Maintain schema and contract records for entity, relationship, command, action, workflow, template, route, ui, provider, storage, index, and domain records. | must | adopted | schema_contract | partial | test_schema_catalog | Schema Contract Catalog |
| req_app_007 | pipeline | Support the canonical An App pipeline with stage records, diagnostics, dry run, single-stage run, debug stepping, and trace output. | must | adopted | workflow_system | partial | test_pipeline_trace | an_app_stale, gk_app_v2 |
| req_app_008 | language | Convert English, controlled text, definition files, commands, templates, and structured samples into validated entity change plans. | must | adopted | an_app_lang | planned | test_language_parse | English Language Domain, An App Lang |
| req_app_009 | bot | Maintain conversation/session context and execute approved commands with approval gates, artifacts, and audit. | must | adopted | an_bot | planned | test_bot_session | An Bot requirements |
| req_app_010 | memory | Preserve evidence, trust, conflicts, recall, consolidation, and forgetting policy. | must | adopted | an_memory | planned | test_memory_evidence | An Memory requirements |
| req_app_011 | workflow | Run governed workflows with stages, dependencies, conditions, branching, rollback, pause/resume/stop, logs, and versioning. | must | adopted | workflow_system | partial | test_workflow_run | Runner docs, gk_app_v2 |
| req_app_012 | ui | Render the same entity data through approved layouts and editor surfaces without mutating the underlying record. | must | adopted | ui_surface | planned | test_render_profile | ui surface requirements |
| req_app_013 | ui | Support semantic ui compilation with layout tree nodes, repeater nodes, tag ontology, placeholder resolution, design tokens, route state, lifecycle state, and diagnostics. | should | adopted | ui_surface | planned | test_ui_compiler | gui_v2 |
| req_app_014 | shell | Support shell/editor interactions: navigation, hover menus, search, window controls, tabs, slash insertion, contextual menu, edit/rename gestures, clipboard, find/replace, template insertion, autosave, and versioned books/cells. | should | adopted | ui_surface | planned | test_shell_interactions | features.txt |
| req_app_015 | editor | Support code, block/document, database-style, workflow, diagram, dashboard, chat, canvas, and website-builder surfaces as render profiles. | should | adopted | ui_surface | planned | test_editor_surfaces | gk_app_v2, inspiration docs |
| req_app_016 | storage | Support local storage, browser storage, autosave, manual save, versioning, revert, recovery state, and optional future sync provider. | must | adopted | storage_system | planned | test_storage_contract | gk_app_v2 |
| req_app_017 | index | Support full-text search, property search, fuzzy search, autocomplete, rebuild, and stats over entity records. | must | adopted | search_index | planned | test_index_contract | gk_app_v2 |
| req_app_018 | provider | Represent providers as system entities with interface, config, permission, activation, health, fallback, and audit contracts. | must | adopted | provider_system | planned | test_provider_contract | an_app_v5 |
| req_app_019 | integration | Link code, documents, workflows, agents, database-style records, logs, search, and routes through shared entity relationships. | must | adopted | application_shell | planned | test_cross_entity_links | gk_app_v2, ui_surface, workflow_system, entity_system |
| req_app_020 | template | Provide governed templates for LMS, fintech organization, single user, trading research, websites, products, research agents, team agents, documents, and workflows. | must | adopted | template_domain | planned | test_template_slots | domain use cases |
| req_app_021 | quality | Every generated artifact must have checklist evidence, audit output, validation result, doc, log, and known limits. | must | adopted | quality_audit | partial | test_artifact_audit | Quality Audit, project convention |
| req_app_022 | quality | Track quality targets for latency, scale, memory, recovery, security, maintainability, and compatibility. | should | adopted | quality_audit | planned | test_quality_targets | gk_app_v2 |
| req_app_023 | domain | Support fintech organization management without real-money movement in V1. | should | adopted | fintech_organization_management | planned | test_fintech_template | Fintech requirements |
| req_app_024 | domain | Support stock trading research and backtesting without live trading in V1. | should | adopted | algo_stock_trading | planned | test_trading_template | Algo Stock Trading requirements |
| req_app_025 | inspiration | Maintain inspiration references as learning material, not active source of truth. | should | adopted | context | partial | test_inspiration_index | inspiration docs |
| req_app_026 | samples | Include sample inputs, outputs, templates, and validation reports for each major domain. | should | proposed | quality_audit | missing | test_sample_pack | source adoption logs |
| req_app_027 | version | Support entity-level version management inspired by Git concepts: snapshot, diff, branch, merge, conflict resolution, restore, tag, history, and field-level provenance. | must | adopted | version_system | planned | test_version_contract | Git concept model |
| req_app_028 | brain | Support An App Brain as a coordination subdomain for context, reasoning, decisions, response composition, scoring, and improvement proposals. | should | proposed | an_app_brain | planned | test_brain_session | an_brain_domain_proposal, AnGitAgent inbox |
| req_app_029 | brain | Support An App Brain v1.4 scope: ingestion, decomposition, parsing, knowledge base records, reasoning, resolution, composition, learning, understanding, validation, recursion, multi-session context, and boundary checks. | should | proposed | an_app_brain | planned | test_brain_pipeline | an_brain_domain_proposal v1.4.0 |

## Functional Spec

### Canonical Term Boundaries

| Term | Meaning | Boundary |
| --- | --- | --- |
| entity | Durable record with identity, type, data/config, attributes, traits, links, relationships, state, diagnostics, policy, provenance, and validation state. | Everything persistent or governable becomes an entity. |
| attribute | Simple key-value property on an entity. | Attributes store record-level facts and do not replace schema, config, or relationships. |
| config | Operational settings for an entity, plugin, provider, template, workflow, or surface. | Config controls behavior and defaults; attributes describe the record. |
| trait | Behavior marker that enables approved operations. | Traits describe capability, not storage ownership. |
| relationship | Directed connection between entities. | Relationships need approved type, source, target, and cardinality policy when needed. |
| link | Concrete relationship instance between two entity ids. | Link is the stored edge; relationship is the approved meaning/type. |
| status | Current lifecycle label for a record. | Status is a compact state label, not the full state object. |
| state | Runtime or persistent condition, progress, selected values, and recovery data. | State may include status but can also include context, progress, errors, and ui selections. |
| diagnostic | Error, warning, hint, or informational finding produced during work. | Diagnostics explain a local check or stage result. |
| audit | Durable evidence record covering what happened, why, by whom, with counts and references. | Audit is broader than diagnostics and must support review. |
| operation | Small approved action that can be invoked. | Use specific `verb_entity` names when the action is not generic. |
| task | Logical unit of work that may contain one or more operations. | Tasks are not the same as pipeline stages unless a stage wraps one task. |
| stage | Named pipeline position with input, output, status, diagnostics, and policy. | Stages belong to pipelines. |
| pipeline | Ordered or governed stage sequence. | Pipeline is the execution skeleton. |
| workflow | Pipeline or pipeline set with conditions, branching, approvals, and rollback. | Workflow is the governed business flow. |
| flow | User-facing shorthand for workflow/pipeline. | Prefer pipeline or workflow in specs. |
| compose | Assemble structured output from resolved records. | Compose does not mount ui or write storage. |
| render | Convert a record into a view artifact. | Render creates view output, not necessarily browser DOM. |
| display | Present rendered output on a surface. | Display is runtime presentation. |
| inject | ui-specific mount of composed/rendered output into a viewport. | Not a universal pipeline stage. |
| format | Serialize output for export or transport. | Format is an export capability, not always a pipeline stage. |
| persist | Save governed state or artifacts. | Persist uses storage capability. |
| storage | Capability/provider for saving and loading entity records. | Storage is entity-backed and policy-governed. |
| index | Search capability over entity records. | Index is a supporting capability, not core truth. |
| registry | Entity-backed catalog of approved records. | Registry behavior can use action_entity; validation stays in utilities. |
| dataset | One-dimensional approved word array unless a map/table is explicitly needed. | Dataset validates names and allowed values. |
| datamap | Collection of relationships grouped by relationship type. | Datamap stores edges and mapping groups, not flat vocabulary or item attributes. |
| data_table | CSV-style two-dimensional table of attributes and parameters for dataset items, built from the schema for that group or type. | Data table stores item fields, thresholds, parameters, and descriptive values. |
| schema | Field/type/requiredness contract for record shape. | Schema validates structure. |
| contract | Behavioral or integration agreement around inputs, outputs, policy, and validation. | Contract can reference schemas and datasets. |
| catalog | Human or entity-backed collection of related records. | Catalog is documentation/organization, not validation by itself. |
| provider | Swappable adapter with interface, config, permissions, health, fallback, and audit. | Provider output must be validated before becoming governed data. |
| utility | Reusable deterministic helper class for validation, parsing, formatting, extraction, or pure transformation. | Utilities should avoid owning durable app state. |
| plugin | Capability class that performs governed behavior and can call utilities. | Plugins may mutate entities only through approved policy. |
| definition | Entity definition document for an entity type or entity-shaped record. | Definitions belong in `app_data/definition` and describe shape, fields, relationships, policies, lifecycle, validation, examples, and update process. |
| user_data | User-created or imported working data that is not promoted yet. | User data is source material until validated and promoted through approved app data, docs, templates, or code. |

### Canonical Pipeline Stage Catalog

| Stage | Purpose | Required Output |
| --- | --- | --- |
| ingest | Accept raw input, source file, request, event, or external record. | intake record and source evidence |
| decompose | Break input into smaller candidate records or fragments. | candidate entity fragments |
| parse | Build structural parse tree from text, document, code, JSON, ui, or definition input. | parse tree |
| build_ast | Convert parse tree into normalized AST records. | AST records |
| build_dag | Convert executable or dependency-bearing records into DAG records. | DAG records or no-execution finding |
| classify | Assign domain, entity type, intent, shape, and risk labels. | classification records |
| validate | Check datasets, schemas, relationships, policy, references, and risk gates. | validation report |
| reason | Apply rules, context, evidence, and relationship logic. | findings and recommendations |
| resolve | Resolve references, placeholders, routes, providers, links, and slots. | resolved references or findings |
| plan | Produce ordered change, execution, artifact, or response plan. | plan record |
| execute | Run approved operations, plugins, or workflows. | execution result |
| compose | Assemble structured output or artifact body. | composed artifact |
| display | Present rendered or composed output on an approved surface. | display record |
| persist | Save approved records, artifacts, logs, versions, or indexes. | persisted refs |
| audit | Record evidence, counts, decisions, errors, warnings, and next action. | audit report |
| respond | Return user-facing summary, question, approval request, or result. | response record |

Supporting capabilities:

- `index` supports search and autocomplete, but is not core truth.
- `format` supports export serialization, but does not replace compose/display.
- `inject` is the ui-specific mount action inside display.

### Entity Type Catalog

Core entity types that must be represented before production development:

| Entity Type | Owner Domain | Purpose |
| --- | --- | --- |
| application | application_shell | Top-level runnable business application. |
| entity | entity_system | Generic governed record. |
| trait | entity_system | Behavior marker for entities. |
| relationship | entity_system | Approved relationship meaning. |
| link | entity_system | Stored relationship edge. |
| attribute | entity_system | Entity field/value fact. |
| config | schema_contract | Entity or system behavior settings. |
| schema | schema_contract | Record shape contract. |
| contract | schema_contract | Input/output/behavior agreement. |
| dataset | dataset_registry | Approved word/value source. |
| datamap | dataset_registry | Relationship or mapping record set. |
| datatable | dataset_registry | Row-based reference data. |
| policy | quality_audit | Rule governing permission, validation, risk, or lifecycle. |
| command | an_app_lang | User or system instruction record. |
| intent | an_app_lang | Parsed user goal mapped to plan or workflow. |
| language_request | an_app_lang | Incoming language input with source/provenance. |
| parse_tree | an_app_lang | Structural parse result. |
| ast_record | an_app_lang | Normalized abstract syntax record. |
| dag_record | workflow_system | Executable/dependency graph record. |
| plan | workflow_system | Ordered change or execution plan. |
| workflow | workflow_system | Governed conditional business flow. |
| pipeline | workflow_system | Ordered stage sequence. |
| stage | workflow_system | One executable pipeline position. |
| task | workflow_system | Logical work unit. |
| operation | workflow_system | Approved callable action. |
| route | ui_surface | Navigable path to entity/view state. |
| render_profile | ui_surface | View definition for rendering entity data. |
| layout_node | ui_surface | Node in a layout tree. |
| component | ui_surface | Reusable view element. |
| book | ui_surface | Notebook/document container. |
| cell | ui_surface | Editable block or notebook unit. |
| view | ui_surface | Presentation over entity data. |
| provider | provider_system | Swappable adapter with contract and policy. |
| storage_record | storage_system | Persistence event/version/recovery record. |
| index_record | search_index | Search index metadata and stats. |
| version_record | version_system | Saved entity snapshot with parent refs, author, timestamp, summary, validation, and changed fields. |
| branch_record | version_system | Named line of entity work for draft, review, experiment, client-specific, agent-generated, or production changes. |
| diff_record | version_system | Structured comparison across entity data, config, schema, relationships, ui, workflow, or text. |
| merge_record | version_system | Governed combination of version or branch changes with conflict and validation results. |
| conflict_record | version_system | Reviewable disagreement created by incompatible field, relationship, schema, policy, name, workflow, or intent changes. |
| tag_record | version_system | Stable label for an important version such as release, approved template, delivery, or compliance-reviewed state. |
| audit_report | quality_audit | Reviewable evidence and validation summary. |
| diagnostic | quality_audit | Error, warning, or hint. |
| template | template_domain | Reusable entity/artifact starter. |
| bot_session | an_bot | Conversation/session state. |
| agent | agent_system | Autonomous or assisted work actor. |
| brain_session | an_app_brain | Context-bearing coordination session across language, memory, reasoning, decision, composition, scoring, and audit records. |
| ingestion_record | an_app_brain | Intake record for source, request, conversation, file, or event input before decomposition. |
| decomposition_record | an_app_brain | Recursive split result with source refs, node ids, depth, and stop reason. |
| parsing_record | an_app_brain | Parse result linked to An App Lang output, source refs, confidence, and diagnostics. |
| knowledge_base_record | an_app_brain | Governed set of knowledge facts, formulas, provenance, and validation state. |
| knowledge_fact | an_app_brain | Atomic source-backed fact with owner domain, confidence, and provenance. |
| knowledge_formula | an_app_brain | Derived or learned rule/formula with proof, validation, and source refs. |
| knowledge_provenance | an_app_brain | Source trace for facts, formulas, summaries, and decisions. |
| decision_record | an_app_brain | Structured record of selected next action, alternatives, reason, evidence refs, and approval needs. |
| composition_record | an_app_brain | Structured response/artifact assembly record linked to reasoning, decision, and evidence refs. |
| resolution_record | an_app_brain | Record of resolved reference, temporal phrase, placeholder, route, provider, or entity ref. |
| understanding_record | an_app_brain | Intent, implication, missing-context, and gap analysis record. |
| recursion_trace | an_app_brain | Recursive reasoning/decomposition trace with limits, cycle checks, timeout, and stop reason. |
| boundary_record | an_app_brain | Boundary check result for ambiguity, missing evidence, stale context, low confidence, unsafe action, or approval need. |
| memory_record | an_memory | Evidence, recall, or consolidation record. |
| fintech_organization | fintech_organization_management | Fintech business workspace root. |
| trading_workspace | algo_stock_trading | Trading research workspace root. |

### System State Catalog

All state values must come from datasets or domain-approved extensions.

| State Group | Values |
| --- | --- |
| lifecycle_status | proposed, draft, reviewed, approved, ready, active, stable, staged, validated, deprecated, archived, rejected, deferred |
| execution_status | received, parsed, matched, needs_clarification, waiting_for_approval, approved, running, completed, failed, blocked, cancelled |
| validation_status | untested, verified, contradicted, deprecated, blocked, needs_review |
| ui_component_state | idle, focused, hovered, active, selected, editing, dragging, resizing, connecting, loading, empty, dirty, saving, saved, validating, valid, warning, error, blocked, disabled, read_only, pending_approval, running, completed, failed, cancelled, archived |
| ui_lifecycle_state | unmounted, initializing, mounted, rendering, rendered, updating, updated, destroying |
| storage_state | unsaved, autosaving, saved, versioned, recovering, recovered, revert_pending, reverted, failed |
| provider_state | unavailable, available, activating, active, degraded, failing, disabled |
| audit_state | not_checked, in_review, supported, weakly_supported, contradicted, accepted, rejected, needs_review |
| memory_state | new, linked, consolidated, superseded, expired, archived |
| workflow_state | draft, validated, running, paused, waiting_for_approval, completed, failed, cancelled, archived |

### User Flow Catalog

| Flow Id | User Flow | Canonical Pipeline Path | Required Output |
| --- | --- | --- | --- |
| user_flow_001 | create application from natural English | ingest, decompose, parse, build_ast, classify, validate, plan, execute, compose, display, persist, audit, respond | application entity, app definition, audit report |
| user_flow_002 | create website | ingest, parse, classify, validate, plan, compose, display, persist, audit, respond | website template instance and render profile |
| user_flow_003 | create product workspace | ingest, parse, classify, validate, plan, execute, persist, audit, respond | product entities, roadmap, docs |
| user_flow_004 | create notebook/book | ingest, validate, plan, execute, display, persist, audit, respond | book entity, initial cells, route |
| user_flow_005 | edit cell or block | ingest, validate, execute, compose, display, persist, audit, respond | updated cell/block, version record |
| user_flow_006 | insert template cell or block | ingest, resolve, validate, execute, display, persist, audit, respond | inserted entity from approved template |
| user_flow_007 | run workflow | ingest, resolve, validate, plan, execute, audit, respond | workflow run record and logs |
| user_flow_008 | create automation schedule | ingest, parse, validate, plan, persist, audit, respond | trigger, workflow, policy |
| user_flow_009 | create research agent | ingest, parse, classify, validate, plan, execute, persist, audit, respond | agent, task, memory policy |
| user_flow_010 | create team of agents | ingest, parse, classify, validate, plan, execute, persist, audit, respond | agent group and handoff policy |
| user_flow_011 | import source document | ingest, decompose, parse, build_ast, classify, validate, reason, resolve, plan, persist, audit, respond | source record, extracted candidates, adoption plan |
| user_flow_012 | compare and adopt learning | ingest, parse, classify, validate, reason, resolve, plan, audit, respond | gap/conflict report and proposed updates |
| user_flow_013 | create fintech organization template | ingest, classify, validate, plan, execute, compose, persist, audit, respond | fintech workspace entities |
| user_flow_014 | run trading backtest | ingest, validate, resolve, plan, execute, compose, display, persist, audit, respond | backtest run, metrics, findings |
| user_flow_015 | search all entities | ingest, resolve, validate, execute, display, audit, respond | search result view and index diagnostics |

### Entity Core

Entity records must include:

- `id`
- `type`
- `name`
- `data`
- `config`
- `attributes`
- `traits`
- `links`
- `relationships`
- `policies`
- `contracts`
- `status`
- `state`
- `diagnostics`
- `provenance`
- `validation_state`

Entity operations should be handled through `action_entity` where possible. Registry-like behavior should be modeled as entity behavior unless a dedicated utility is needed for validation or pure transformation.

### Dataset Core

Datasets are one-dimensional approved word arrays unless a datamap or data_table is explicitly required. Dataset validation must check:

- array shape
- string-only values
- snake_case values
- duplicate values
- banned words
- domain ownership
- unknown relationship targets

Dataset ownership may be grouped as:

- code datasets: data types, entity types, traits, relationships, behaviors, schemas
- ui datasets: components, events, layouts, styles, tokens
- system datasets: config keys, permissions, metrics, providers, values, diagnostics
- domain datasets: business-domain records such as fintech and trading names

Plain `.dataset` artifacts can be used as source material, but active code should still expose validated datasets in the format chosen for the implementation batch.

Approved app data layout:

| Folder | Shape | Use |
| --- | --- | --- |
| `app_data/dataset` | one-dimensional array | approved names, types, statuses, operations, layout names, policy values, validation labels |
| `app_data/datamap` | relationship groups keyed by relationship type | parent-child maps, alias maps, compatible-with maps, ownership maps, dependency maps, source-to-target maps |
| `app_data/data_table` | schema-shaped CSV-style table | attributes, parameters, thresholds, defaults, flags, labels, descriptions, and settings for dataset items |
| `app_data/definition` | entity definition document | entity shape, fields, config, relationships, policies, lifecycle, validation, examples, source refs, and update process |

Validation must reject map-shaped or table-shaped data inside `app_data/dataset`, reject ungrouped relationships inside `app_data/datamap`, and reject table columns that are not allowed by the relevant schema.

Project artifacts should be organized by subdomain:

- `docs/<subdomain_name>`
- `proposal/<subdomain_name>`
- `templates/<subdomain_name>`
- `test/<subdomain_name>`
- `reports/<subdomain_name>`
- `log/<subdomain_name>`

User-created or imported working data belongs in `user_data` until it is
validated and promoted.

### Concept Definition Spec

Core concept records must include:

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

Core concept layers:

- domain
- behavior
- ui
- system

The minimum concept set includes:

- entity
- trait
- relationship
- operation
- task
- pipeline
- workflow
- intent
- component
- provider

### Vocabulary Governance Spec

Before creating a new name:

1. search exact approved names
2. search bag-of-words for component words
3. search similar-word mappings
4. search full datasets for partial matches
5. reuse or extend existing concepts when possible
6. reserve the new name only when no approved name fits
7. document source, owner, reason, and replacement/deprecation behavior

Operations should prefer `verb_entity` names when they describe a specific operation. Names that return multiple records should use plural wording where that makes the result clear.

### Provider Spec

Provider records must define:

- provider name
- provider type
- interface contract
- implementation reference
- activation state
- permissions
- config keys
- health status
- fallback behavior
- audit policy

Providers are adapters, not core truth. Provider output must be validated before it becomes governed data.

### Pipeline Core

Pipeline stages should produce structured stage records with:

- input reference
- output reference
- status
- errors
- warnings
- evidence references
- next action

No stage should silently skip validation when validation data is available.

Pipeline execution must support:

- full run
- single-stage run
- dry run
- debug step forward
- debug step backward
- stop on error
- per-stage trace
- per-stage diagnostics
- per-stage metrics

The 13-stage product pipeline from `gk_app_v2` maps into the canonical An App pipeline:

| gk_app_v2 Stage | Canonical An App Mapping |
| --- | --- |
| decompose | ingest and decompose |
| validate | validate |
| parse | parse, build_ast, build_dag |
| transform | normalize and transform |
| reason | reason |
| resolve | resolve |
| index | index as storage/search stage |
| compose | compose |
| execute | execute |
| format | compose or export formatting |
| display | display |
| persist | persist |
| respond | respond, audit trigger |

### Storage And Index Spec

Storage capability must support:

- save entity
- load entity
- delete entity
- list stored entities
- version entity
- list versions
- get version
- revert version
- autosave
- manual save
- local file storage
- browser storage
- optional cloud sync as a future provider

Index capability must support:

- index entity
- index batch
- remove entity from index
- full-text search
- property search
- fuzzy search
- autocomplete
- rebuild index
- index stats

Storage and index are entity-backed capabilities. They may be implemented by plugins/providers, but their records still follow entity/schema/policy validation.

Storage/index/provider rule:

- capability contracts are entities
- provider implementations are plugins or adapters
- provider outputs are proposed records until validated
- indexes speed lookup but do not replace source records
- persisted versions must preserve previous state and audit refs

### Version Management Spec

An App should learn from Git at the concept level, not by limiting itself to file-only version control. Versions apply to every durable entity: application, document, book, cell, dataset, schema, template, workflow, route, ui surface, policy, provider config, agent plan, report, and domain record.

Required version concepts:

| Concept | An App Meaning | Required Fields |
| --- | --- | --- |
| snapshot | Saved state of one entity or an entity group at a point in time. | `entity_id`, `version_id`, `parent_version_ids`, `snapshot_ref`, `created_by`, `created_at`, `validation_result` |
| change_record | Explanation of what changed and why. | `version_id`, `change_summary`, `changed_fields`, `reason`, `source_refs`, `audit_ref` |
| diff | Structured comparison between two versions. | `from_version_id`, `to_version_id`, `diff_type`, `changed_paths`, `before_values`, `after_values`, `diagnostics` |
| branch | Separate line of work for safe drafting or review. | `branch_id`, `entity_id`, `base_version_id`, `status`, `owner`, `policy_ref` |
| merge | Governed combination of changes from one branch/version into another. | `merge_id`, `source_ref`, `target_ref`, `strategy`, `conflicts`, `validation_result`, `audit_ref` |
| conflict | Explicit disagreement requiring policy or user decision. | `conflict_id`, `conflict_type`, `path`, `left_value`, `right_value`, `recommendation`, `resolution_status` |
| tag | Stable label for an important version. | `tag_id`, `version_id`, `label`, `purpose`, `created_by`, `created_at` |
| restore | Return an entity to a previous version or clone it as a new draft. | `restore_id`, `entity_id`, `from_version_id`, `mode`, `approval_ref`, `audit_ref` |
| provenance_trace | Field-level history. | `entity_id`, `field_path`, `versions`, `authors`, `source_refs`, `decision_refs` |

Diff must support:

- text diff for documents and notes.
- structured diff for JSON/config/schema records.
- tree diff for AST, document trees, layout trees, and notebooks.
- relationship diff for links and relationship records.
- workflow diff for stages, dependencies, conditions, and DAG records.
- ui diff for layout tree, render profile, component, token, and route changes.
- dataset diff for added, removed, renamed, duplicated, similar, or deprecated values.

Branch policy must support:

- `draft`
- `review`
- `experiment`
- `client_specific`
- `agent_generated`
- `production`

Merge policy must support:

- auto merge when changes are non-overlapping and validation passes.
- user approval when semantic conflicts exist.
- rejection when schema, policy, relationship, or validation checks fail.
- audit output for every merge attempt.

Conflict detection must cover:

- same field changed differently.
- same relationship changed differently.
- duplicate or similar concept names.
- duplicate or similar dataset values.
- incompatible schema changes.
- incompatible policy changes.
- workflow ordering conflicts.
- unresolved source or provider references.
- user intent conflicts.

Version states:

| State | Meaning |
| --- | --- |
| unversioned | Entity has no saved version record yet. |
| changed | Entity differs from latest saved version. |
| staged | Selected changes are prepared for a governed save. |
| saved | Entity has a current saved version. |
| branched | Entity is being edited on a non-production line of work. |
| merging | Merge is being evaluated or applied. |
| conflicted | Conflict record exists and requires resolution. |
| restored | Entity was restored from a previous version. |
| tagged | Version has an important stable label. |
| archived | Version remains available but is no longer active. |

Version operations:

- `version_entity`
- `diff_entity`
- `branch_entity`
- `merge_entity`
- `resolve_conflict`
- `restore_entity`
- `tag_version`
- `list_history`
- `trace_provenance`
- `stage_change`
- `unstage_change`

These operations should use existing entity behavior wherever possible. A new plugin should only be added when version-specific policy, diff, conflict, or history behavior cannot be cleanly handled by `action_entity` plus validation utilities.

Version validation must check:

- entity and parent version refs exist.
- branch base version exists.
- changed fields are valid for the entity schema.
- relationship changes use approved relationship types.
- dataset changes pass duplicate, similar-name, banned-word, and deprecation checks.
- merge results pass schema and policy validation before becoming current state.
- restore actions have the required approval and audit records.

### ui Surface Spec

ui surfaces are entity-backed render profiles. A render profile must declare:

- layout
- target entity type
- data reference
- allowed interactions
- validation behavior
- empty state
- error state
- accessibility rules
- lifecycle states

Semantic ui compiler records should support:

- `layout_node`
- `repeater_node`
- `content_label`
- `design_token`
- `route`
- `render_profile`
- `ui_lifecycle_state`

Shell/editor interactions should support:

- header navigation
- hover menus
- search
- window controls
- editor tabs
- slash commands
- contextual menu
- double-click cell edit
- double-click item rename
- cut, copy, paste
- find and replace
- insert template cell or block
- autosave
- feature-flagged version control for books and cells

### Code Editor Spec

The code editor surface should support:

- syntax highlighting for common languages
- autocomplete
- diagnostics
- symbol resolution
- find references
- rename symbol
- formatting
- multiple cursors
- selections
- folding
- line numbers
- optional minimap

### Block And Database View Spec

Block documents should support:

- heading, paragraph, list, callout, and code blocks
- nested blocks
- slash insertion
- entity mentions
- block comments
- version history
- full-text search
- markdown, HTML, and PDF export

Database-style entity views should support:

- schemas
- text, number, select, multi_select, date, relation, rollup, checkbox, formula, and file properties
- table, board, gallery, list, and calendar views
- filtering
- sorting
- cross-database relations
- rollups
- formulas

### Workflow And Agent Spec

Workflow surfaces should support:

- visual builder
- trigger nodes
- action nodes
- condition nodes
- loop nodes
- subflow nodes
- parallel nodes
- merge nodes
- timeout nodes
- execution logs
- pause, resume, stop
- workflow versioning

Agent surfaces should support:

- orchestration
- subagents
- instructions
- controlled capability calls
- task decomposition
- parallel execution
- short-term, long-term, and project memory
- artifacts
- approval workflow
- handoff
- streaming output
- provider fallback

### Quality Targets

| Id | Target |
| --- | --- |
| nfr_perf_001 | small entity pipeline latency under 50ms |
| nfr_perf_002 | large entity pipeline latency under 2s for entities above 10mb |
| nfr_perf_003 | autocomplete response under 100ms |
| nfr_perf_004 | document open under 500ms for 1000 blocks |
| nfr_perf_005 | workflow start under 200ms |
| nfr_perf_006 | agent first output under 1s |
| nfr_perf_007 | idle memory under 100mb |
| nfr_perf_008 | large entity memory under 500mb |
| nfr_scale_001 | maximum entity data size 100mb |
| nfr_scale_002 | maximum concurrent loaded entities 100 |
| nfr_scale_003 | maximum concurrent workflows 50 |
| nfr_scale_004 | maximum concurrent agents 20 |
| nfr_scale_005 | maximum database rows 10000 |
| nfr_scale_006 | maximum document blocks 10000 |
| nfr_rel_001 | crash recovery through autosave |
| nfr_rel_002 | no data loss on crash for saved or autosaved records |
| nfr_sec_001 | local-first by default |
| nfr_sec_002 | optional encrypted sync later |
| nfr_sec_003 | controlled permission model for agents |
| nfr_sec_004 | controlled permission model for workflows |
| nfr_maint_001 | core implementation should remain dependency-light |
| nfr_maint_002 | optional providers may add dependencies only behind config and policy |
| nfr_comp_001 | target runtimes include node_runtime, browser_runtime, and future local runtimes |
| nfr_comp_002 | import formats include json, markdown, csv, and xml |
| nfr_comp_003 | export formats include json, markdown, HTML, pdf, and xml |

### Template Spec

Templates must define:

- template type
- target domain
- required inputs
- optional inputs
- produced artifacts
- validation checklist
- example input
- example output
- known limits

### Domain Spec

Each domain must define:

- purpose
- scope
- core entities
- required datasets
- required schemas
- required utilities
- required plugins
- default pipelines
- ui surfaces
- use cases
- tests
- non-goals

### Production Readiness Gates

Before a development batch is ready:

- requirement has owner, status, implementation state, and test reference
- names pass vocabulary governance
- entity types and states are approved or proposed with owner
- schema and contract records exist for new artifacts
- user flow is mapped to canonical pipeline stages
- permissions and risk policy are explicit
- diagnostics and audit output are defined
- rollback or recovery behavior is documented
- docs and logs are updated
- sample input and expected artifact are available when practical

## Implementation Priority

| Priority | Build Area | Reason |
| --- | --- | --- |
| p0 | validator utility upgrades | All later activation depends on reliable validation. |
| p0 | action_entity plugin lock | Entity behavior is the storage and mutation center. |
| p0 | runner boundary lock | Pipelines need deterministic execution and audit. |
| p1 | dataset registry report | Approved names must be visible and counted. |
| p1 | concept registry report | Active concepts need consistent definition and validation fields. |
| p1 | schema contract records | Docs must become runnable validation records. |
| p1 | parser/decomposer/classifier utilities | Input must become structured records. |
| p1 | ui render profile and layout node schemas | gui/app shell work needs stable artifact shapes. |
| p1 | storage/index capability contracts | Search, autosave, versioning, and recovery need stable contracts. |
| p1 | editor interaction contracts | Books/cells/code/docs need explicit command and ui behavior. |
| p2 | template catalog | Business use cases need reusable starting points. |
| p2 | sample apps | Validate that docs become real artifacts. |
| p3 | inspiration deep extraction | Exact shortcuts/API/schema can be harvested later. |

## Acceptance Criteria

An App scope is ready for implementation when:

- every requirement has an owner domain
- every required dataset group exists or is marked deferred
- every required schema has a contract
- every core concept uses the concept definition shape
- every required utility/plugin is mapped to existing code or a planned file
- every template has input and artifact checklist
- test utility can validate datasets, schemas, and selected code
- docs and logs exist for promoted code
