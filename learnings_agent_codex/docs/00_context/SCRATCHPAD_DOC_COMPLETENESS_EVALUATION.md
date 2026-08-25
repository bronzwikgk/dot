# Scratchpad Doc Completeness Evaluation

## Purpose

This document evaluates the current scratchpad docs for completeness, conflicts, similar items, and missing items. It is a checkpoint for deciding what should be merged into canonical requirements next.

## Current Inventory

Current scratchpad documentation has four groups:

- Canonical scope docs: `APPLICATION_ENTITY_DOCTRINE.md`, `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, `AN_BOT_SCOPE_REQUIREMENTS.md`, `AN_MEMORY_SCOPE_REQUIREMENTS.md`, `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`, `CONCEPT_CATALOG.md`, `DATASET_REGISTRY_REQUIREMENTS.md`, `SCHEMA_CONTRACT_CATALOG.md`, `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md`, and `TEMPLATE_DOMAIN_REQUIREMENTS.md`.
- Domain docs: `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md`, `REPOSITORY_OPERATIONS_DOMAIN_REQUIREMENTS.md`, `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md`, `UI_SURFACE_DOMAIN_REQUIREMENTS.md`, `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`, and `EXTERNAL_INTAKE_DOMAIN_REQUIREMENTS.md`.
- Adoption notes: focused notes for action NLP, prototype definition, label learning, tree building, rule bot, templates, capability self-evolution, rule and flow inbox, input surface, repository actions, search, HTTP fetch, planning artifacts, parser README, stale An App folders, and large folders.
- Audit and governance docs: project context, source adoption index, manual audits, policy, and deferred adoption pipeline scope.

Current dataset files are:

- `validation_word_datasets.js`: approved vocabulary arrays for entities, traits, operations, datatypes, relationships, application scope, language, memory, source adoption, and banned words.
- `ui_word_datasets.js`: approved UI vocabulary arrays for layouts, cells, panels, templates, views, and editor pieces.
- `entity_behavior_datasets.js`: relationship pairs that map traits to operations and entity types to traits.

## Completeness Summary

| Area | Status | Evaluation |
| --- | --- | --- |
| Source learning coverage | Strong | Most reviewed sources have either a canonical owner, a focused adoption note, or an audit entry. |
| Canonical product direction | Strong | The entity-first An App direction is clear and consistent across the main docs. |
| Language and English domain | Strong | Natural English parsing, controlled English, sentence types, corpus policy, and grammar concepts are well covered. |
| Bot and memory domain | Strong | Session continuity, confidence, proof traces, corrections, learning governance, and conflict handling are covered. |
| UI layout vocabulary | Strong | Layout names are separated and owned by a dedicated UI surface domain doc. |
| Dataset readiness | Strong for approved vocabulary, Medium for generated reports | Word datasets and relationship maps exist; the remaining gap is a generated registry report that counts owners and validation coverage. |
| Schema and contract readiness | Strong initial catalog, Medium for executable schemas | The canonical schema catalog exists; the next step is code-level schema enforcement. |
| Relationship governance | Strong in docs and datasets, Medium in executable validation | Relationship types and policy are documented; code-level relationship validation still needs expansion. |
| Test and audit readiness | Medium High | Policy, gates, and audit documents exist; implementation tests for doc-dataset-schema consistency remain pending. |
| Source adoption automation | Deferred | The pipeline scope is useful as future design, but current work has shifted back to manual review. |

## Main Conflicts

1. Dataset meaning is overloaded.

Current docs use dataset to mean both approved one-dimensional word arrays and richer relationship maps. The cleaner convention should be:

- Word dataset: one-dimensional approved vocabulary array.
- Registry map: structured object map or record catalog.
- Relationship map: pair or edge list that connects approved words.

2. Everything is an entity, but domains still need boundaries.

This is not a real conflict. A domain is an entity family and ownership boundary. The doctrine should say that domains do not replace entities; they organize entity types, rules, templates, and policies.

3. Natural English definitions can describe behavior, but should not directly activate behavior.

Docs correctly move toward English-driven application creation, but activation needs a validation and approval gate. Parsed definitions should create proposed entity changes first.

4. Tree terms overlap.

The docs mention tree, common tree, document tree, semantic tree, layout tree, and project tree. Proposed convention:

- Document tree: parsed structure of one input document.
- Semantic tree: meaning-level nodes extracted from text.
- Project tree: merged structure across many files.
- Render tree: UI/output-ready structure.
- Relationship graph: cross-node and cross-entity links.

5. Command, capability, action, and flow overlap.

Proposed convention:

- Command: user-facing phrase or structured request.
- Capability: approved ability the system can perform.
- Action: executable step selected by a capability.
- Flow: ordered or conditional set of actions.

6. Agent and bot overlap.

Proposed convention:

- Bot: conversational module inside An App.
- Agent: worker/profile/capability entity that can execute or review work.
- Bot may route to agents, but bot is not the whole agent system.

7. Repository operation docs overlap with action-specific notes.

`ACTION_GIT_DOC_DATASET_ADOPTION_NOTE.md` should remain source learning. `REPOSITORY_OPERATIONS_DOMAIN_REQUIREMENTS.md` should become the canonical owner.

8. File conversion overlaps with language parsing.

`AN_APP_LANG_SCOPE_REQUIREMENTS.md` should own parsing and semantic extraction. `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` should own input/output format profiles, preservation reports, and conversion policy.

9. The source adoption pipeline is paused.

`SOURCE_ADOPTION_PIPELINE_SCOPE.md` should be marked as deferred design. It should not be treated as an active implementation requirement until the manual review batches are complete.

## Similar Items To Consolidate

These items appear in more than one doc and should be defined once:

- Seed knowledge, type registry, type hierarchy, entity registry.
- Command catalog, capability registry, action registry, command templates.
- Label taxonomy, knowledge taxonomy, learning trace, correction record.
- Parser adapter, document tree, semantic tree, conversion manifest, provenance record.
- Policy, rule, validation gate, quality gate, approval state.
- Benchmark report, audit report, evidence record, coverage report.
- Template definition, starter template, sample pipeline, domain template.
- Search provider, external knowledge intake, citation, evidence source.
- Repository stage, repository operation, phase gate, release report.
- Layout, render profile, input surface, panel, editor surface.

## Canonical Docs Added

The following canonical docs now exist and should be used as owners:

- `DATASET_REGISTRY_REQUIREMENTS.md`: defines word datasets, registry maps, relationship maps, naming, validation, duplication checks, and ownership.
- `SCHEMA_CONTRACT_CATALOG.md`: lists canonical schema shapes for entity, relationship, policy, contract, template, flow, command, document tree, semantic tree, project tree, render tree, audit report, and source adoption record.
- `UI_SURFACE_DOMAIN_REQUIREMENTS.md`: owns layout types, render profiles, input surfaces, panels, editor surfaces, keyboard commands, accessibility states, and view switching.
- `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`: owns two-stage validation, coverage accounting, report shape, evidence retention, risk levels, and approval states.
- `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md`: owns command parsing, capability matching, action selection, command templates, confirmation policy, and command execution logs.
- `TEMPLATE_DOMAIN_REQUIREMENTS.md`: owns domain templates, starter templates, sample pipelines, template inheritance, template validation, and template artifact creation.
- `CONCEPT_CATALOG.md`: owns repeated concept definitions and canonical ownership decisions.

## Dataset Groups Added Or Owned

These groups are now represented in datasets or owned by the relevant domain docs:

- Dataset group types: word dataset, registry map, relationship map, schema catalog, rule catalog.
- Tree node types: document node, semantic node, project node, render node, relationship node.
- Provenance field names: source path, source id, section id, evidence id, confidence, adopted by, validation state.
- Command record fields: phrase, intent, capability id, action id, risk level, confirmation mode, outcome.
- Capability record fields: id, domain, allowed input, output, policy, tests, owner.
- Policy and rule fields: condition, scope, decision, severity, explanation, override mode.
- Approval state names: proposed, reviewed, approved, rejected, deferred, superseded.
- Quality gate names: inventory check, owner check, duplicate check, conflict check, validation check, adoption check.
- UI input surface names: command bar, prompt panel, chat panel, form panel, file drop zone, table editor, tree editor.
- Render view names: document view, code editor, block editor, notebook, tree view, diagram, dashboard, table, kanban, calendar, timeline.
- Search source names: local file, local folder, web page, documentation page, repository, corpus, user note.
- Repository operation names: inspect, stage, commit, pull, merge, tag, release, deploy, rollback.
- Conversion profile names: markdown to document tree, html to document tree, json to entity tree, text to semantic tree, tree to document, tree to diagram.
- Error and recovery names: missing field, invalid type, duplicate id, unknown relationship, unsupported format, low confidence, conflict detected.
- External intake names: local file, URL, web page, JSON API, connected document, connected sheet, connected slide, connected file.
- Planning artifact names: business plan, strategy goals, market customer, governance risk compliance, human review, operations reliability, financial unit economics, data knowledge, continuous improvement, change version management, agent architecture, investor one-pager, market study, risk register, KPI dashboard, review cadence, 90-day action plan, 12-month milestone plan, archive rename manifest.

## Closed Source Coverage / Remaining Limits

These areas are now closed at concept and requirement level:

- `b6/actionHttpFetch`: covered by `ACTION_HTTP_FETCH_COVERAGE_NOTE.md` and owned by `EXTERNAL_INTAKE_DOMAIN_REQUIREMENTS.md`.
- `b7/actionPlans`: covered by `ACTION_PLANS_COVERAGE_NOTE.md` and owned by template, schema, quality, and planning artifact datasets.
- Very large folders remain concept-level only by explicit instruction to ignore folders with huge file counts.

## Canonical Ownership Decisions

Use this placement map to avoid future duplication:

- Application entity model: `APPLICATION_ENTITY_DOCTRINE.md`.
- Natural language and parser behavior: `AN_APP_LANG_SCOPE_REQUIREMENTS.md`.
- English grammar and sentence knowledge: `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`.
- Conversation, routing, and help behavior: `AN_BOT_SCOPE_REQUIREMENTS.md`.
- Memory, proof, learning, and conflict retention: `AN_MEMORY_SCOPE_REQUIREMENTS.md`.
- Agent profiles and worker flows: `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md`.
- Repository operations: `REPOSITORY_OPERATIONS_DOMAIN_REQUIREMENTS.md`.
- File conversion: `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md`.
- Dataset policy: new `DATASET_REGISTRY_REQUIREMENTS.md`.
- Schema and contract policy: new `SCHEMA_CONTRACT_CATALOG.md`.
- UI surfaces: new `UI_SURFACE_DOMAIN_REQUIREMENTS.md`.
- Quality and audit: new `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`.

## Recommended Cleanup Batches

Batch 1: normalize documentation ownership. Status: started.

- Status: complete for current reviewed sources.
- Added the missing canonical docs listed above.
- Marked source adoption automation as deferred design.
- Added cross-links from adoption notes to canonical owners.
- Moved repeated definitions into canonical owner docs.

Batch 2: normalize datasets.

- Status: mostly complete for word datasets.
- Word datasets, registry maps, and relationship maps are separated by convention.
- Missing dataset groups from reviewed docs have initial dataset coverage.
- Validation checks exist for banned words and duplicate word-array values.
- Remaining gap: generated report that says which docs introduced each dataset group.

Batch 3: normalize schemas and contracts.

- Status: initial catalog complete.
- One schema catalog exists.
- Minimum required fields are defined for core records, trees, audit reports, external intake, and planning artifacts.
- Remaining gap: executable schemas and a checker that verifies doc references.

Batch 4: close pending source coverage.

- Status: complete for current scope.
- `b6/actionHttpFetch` is covered.
- `b7/actionPlans` is covered.
- Large folders stay concept-level only until the user asks for a deeper pass.

## Evaluation Result

The scratchpad docs are complete as a concept and requirement archive for reviewed sources. They are not yet an implementation package because executable validators, a generated registry report, and production modules remain to build.

The biggest remaining work is implementation: turn the documented schemas, datasets, and validation gates into code-level checks and reports.
