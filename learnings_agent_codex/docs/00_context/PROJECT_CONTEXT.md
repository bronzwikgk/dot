# Scratchpad Entity System Context

## Objective

This scratchpad is an isolated prototype for the `wip_dot_v3` direction and the project now called `an_app`. It exists to test the idea that everything can be represented as an entity, while keeping the main `dot`, GUI experiments, and older action projects untouched.

`an_app` means a real business application builder: an application that can create, validate, compose, test, publish, and maintain other applications from entities, datasets, schemas, templates, relationships, workflows, policies, logs, and artifact creation plans.

## Starting Point

The work started after reviewing older app and GUI experiments. The key discovery was that those folders contained useful concepts, but the code style and naming were not clean enough to adopt directly. The scratchpad was created to rebuild the useful concepts in a controlled place.

## Core Decisions

- Use `code`, not banned source-folder naming.
- Use snake_case class names, method names, ids, and approved vocabulary.
- Keep one generic `action_entity` plugin rather than one class per entity type.
- Put validation rules in `entity_validator`.
- Put approved names in datasets so new names are checked before adoption.
- Keep UI names in a separate UI dataset so GUI vocabulary does not pollute core vocabulary.
- Treat relationships as the source of truth.
- Treat legacy dependency input as migration-only and disabled by default.
- Keep generated tests as a smoke check, but rely on focused manual tests until the test generator learns instance methods.

## Implemented Pieces

- `action_entity`: entity lifecycle, storage orchestration, relationships, policies, contracts, import/export, graph validation.
- `entity_registry`: approved entity types and traits with behavior lookup.
- `entity_validator`: reusable validation utility used by plugins.
- `entity_runner`: universal stage runner.
- `entity_parser`: simple intent parser.
- `entity_reasoner`: basic type/operation reasoning.
- `markdown_pipeline`: markdown decompose/parse/compose utility.
- `app_generator`: app manifest planner.
- `validation_word_datasets`: core approved-name arrays.
- `ui_word_datasets`: UI approved-name arrays.
- `entity_behavior_datasets`: mapping pairs for type-to-trait and trait-to-operation behavior.

## Doctrine Documents

- `APPLICATION_ENTITY_DOCTRINE.md`: the target architecture for `an_app`, a real business application that can create, validate, compose, test, publish, and persist other applications using entities, datasets, schemas, templates, relationships, workflows, plugins, utilities, and artifact creation plans.
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`: scope and requirements for `an_app_lang`, the language layer that turns natural English, controlled English, and markdown definition documents into validated entity change plans.
- `AN_BOT_SCOPE_REQUIREMENTS.md`: scope and requirements for `an_bot`, the conversational agent module inside An App that manages sessions, messages, tool routing, confidence display, structured previews, feedback, corrections, profile-aware help, and bot self-description.
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`: scope and requirements for `an_memory`, the knowledge memory and learning-governance module that manages working memory, episodic memory, semantic memory, confidence, provenance, proof traces, knowledge gaps, conflicts, consolidation, and forgetting.
- `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`: scope and requirements for the English Language domain, including sentence types, grammar corpuses, parts of speech, tense, pronoun resolution, semantic roles, non-literal language, and exception handling used by `an_app_lang`.
- `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`: policy document capturing recent agent mistakes, rework causes, ownership rules, naming conventions, source-learning process, verification commands, and completion checklist.
- `SOURCE_ADOPTION_INDEX_AND_VALIDATION_LOG.md`: file-by-file adoption index for reviewed source folders, including primary owners, secondary owners, two-stage validation status, adapted content, deferred content, and remaining actions.
- `SOURCE_ADOPTION_PIPELINE_SCOPE.md`: scope of work for the governed source adoption pipeline, including isolated folder shape, flows, data shapes, conflict management, tests, risks, and build order.
- `MANUAL_COMPLETENESS_AUDIT_B0_B4.md`: recursive manual completeness audit for
  `input_temp/b0` through `input_temp/b4`, including nested folder coverage,
  high-signal concept groups, remaining gaps, and two-stage validation.
- `ACTION_NLP_DOC_DATASET_ADOPTION_NOTE.md`: focused adoption note for
  `input_temp/b7/actionNLP`, covering seed knowledge, type registry governance,
  linguistic hierarchy, policy ingestion, and dataset gaps.
- `APROTOTYPE_DOC_DATASET_ADOPTION_NOTE.md`: focused adoption note for
  `input_temp/b7/Aprototype`, covering natural-English definition documents,
  command/entity/rule datasets, keyword parsing, and shared traversal needs.
- `ACTION_LABLE_DOC_DATASET_ADOPTION_NOTE.md`: focused adoption note for
  `input_temp/b6/actionLable`, covering conversation labeling, label taxonomy,
  dependency mapping, conversation knowledge nodes, export contracts, and
  benchmark expectations.
- `ACTION_TREE_BUILDER_DOC_DATASET_ADOPTION_NOTE.md`: focused adoption note for
  `input_temp/b6/actionTreeBuilder`, covering multi-file tree building, format
  detection, common tree schema, provenance, relationship analysis, recovery
  modes, output views, and session log discipline.
- `AN_RULE_BOT_DOC_DATASET_ADOPTION_NOTE.md`: focused adoption note for
  `input_temp/b7/AnRuleBot`, covering registry-driven bot design, capability
  records, action records, safety policy, context, templates, and tests.
- `AN_RULE_BOT_TEMPLATES_COVERAGE_NOTE.md`: focused coverage note for
  `input_temp/b7/AnRuleBot/templates`, covering knowledge, document, report,
  communication, technical, and config template families plus placeholder,
  flow error-handling, test-report, and maintenance concepts.
- `AN_RULE_BOT_CAPABILITY_SELF_EVOLVE_COVERAGE_NOTE.md`: focused coverage note
  for capability creator, self-evolve gap analysis, boot sequence, welcome
  message, rule dictionary, and capability feature notes.
- `RULE_FLOW_INBOX_COVERAGE_NOTE.md`: focused coverage note for
  `inbox_knowledge/rule&flow`, covering NLU matching methods, cognitive nodes,
  deterministic learning loop, passive/active knowledge, tree query, tree diff,
  tree merge, schema migration, parser scope, and topic perspectives.
- `ACTION_HTTP_FETCH_COVERAGE_NOTE.md`: focused coverage note for
  `input_temp/b6/actionHttpFetch`, covering controlled URL intake, local file
  fallback, response limits, HTML cleaning, JSON summaries, link discovery, and
  structured fetch errors.
- `ACTION_PLANS_COVERAGE_NOTE.md`: focused coverage note for
  `input_temp/b7/actionPlans`, covering business planning frameworks, strategy,
  markets, governance, human review, operations, finance, data, improvement,
  version management, agent architecture, reports, and review cadence.
- `ACTION_INPUT_DOC_DATASET_ADOPTION_NOTE.md`: focused adoption note for
  `input_temp/b6/actionInput`, covering input surfaces, panels, accessibility,
  interaction states, persistence, and UI dataset additions.
- `ACTION_GIT_DOC_DATASET_ADOPTION_NOTE.md`: focused adoption note for
  `input_temp/b6/actionGit`, covering repository operation stages, deployment
  flow policy, security gates, integrity checks, remote sync, and push safety.
- `ACTION_SEARCH_DOC_DATASET_ADOPTION_NOTE.md`: focused adoption note for
  `input_temp/b6/actionSearch`, covering provider configuration, normalized
  search results, external knowledge intake, query transforms, and search audit.
- `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md`: domain requirements for agents, skills,
  profiles, menus, flows, reviews, facts, and agent dataset records.
- `REPOSITORY_OPERATIONS_DOMAIN_REQUIREMENTS.md`: domain requirements for safe
  repository operations, deployment manifests, phase gates, reports, and
  rulebooks.
- `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md`: domain requirements for converting
  supported formats into target views with manifests, policy, capability
  matrices, and preservation reports.
- `EXTERNAL_INTAKE_DOMAIN_REQUIREMENTS.md`: domain requirements for controlled
  intake from local files, URLs, web pages, APIs, and connected workspaces.
- `LARGE_FOLDER_DOC_DATASET_ADOPTION_NOTE.md`: grouped adoption note for the
  large folders under b6 and b7, focused on docs and dataset concepts while
  excluding generated/package/runtime bulk.
- `SCRATCHPAD_DOC_COMPLETENESS_EVALUATION.md`: checkpoint evaluation of all
  scratchpad docs and datasets, covering completeness, conflicts, similar
  items, missing canonical docs, missing dataset groups, and cleanup batches.
- `AN_APP_STALE_V1_V2_COVERAGE_NOTE.md`: focused coverage note comparing the
  two old An App folders with the scratchpad and listing V2 gaps around
  handbook creation, type ratification, provider plugin contracts, bindings,
  datamaps, datatables, and external workspace bridge behavior.
- `AAST_PARSER_README_COVERAGE_NOTE.md`: focused coverage note for the
  AAstParser README, covering parser application wrapper, parser plugin
  contract, parser commands, sessions, knowledge loading, and round-trip
  validation.
- `CONCEPT_CATALOG.md`: canonical index of repeated concepts, preferred
  meanings, ownership, and consolidation rules.
- `DATASET_REGISTRY_REQUIREMENTS.md`: dataset governance for word datasets,
  registry maps, relationship maps, schema catalogs, rule catalogs, owners,
  validation, and update process.
- `SCHEMA_CONTRACT_CATALOG.md`: canonical human-readable schema and contract
  catalog for entities, relationships, commands, capabilities, actions, flows,
  templates, trees, audit reports, and source adoption records.
- `UI_SURFACE_DOMAIN_REQUIREMENTS.md`: domain requirements for layouts, render
  profiles, input surfaces, panels, editor surfaces, accessibility states, and
  view switching.
- `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`: domain requirements for validation
  gates, quality gates, coverage, conflicts, gaps, approval states, risk, and
  audit reports.
- `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md`: domain requirements for command
  parsing, capability matching, action selection, clarification, confirmation,
  and execution logs.
- `TEMPLATE_DOMAIN_REQUIREMENTS.md`: domain requirements for starter
  templates, domain templates, sample pipelines, artifact creation, validation,
  and audit output.

## Adoption Rule

Nothing here should be copied into `dot` blindly. Each utility should be adopted one at a time with docs, logs, tests, and a commit.

## Development Planning

Future implementation planning now lives in `docs/07_development_plan`.

Start with:

- `docs/07_development_plan/00_code_inventory.md`
- `docs/07_development_plan/01_domain_scope_from_docs.md`
- `docs/07_development_plan/02_gap_analysis.md`
- `docs/07_development_plan/03_priority_roadmap.md`
- `docs/07_development_plan/04_build_batches.md`
- `docs/07_development_plan/05_open_decisions.md`

## Source Placement Index

Reference sources reviewed and where their learnings belong:

- `input_temp/an_app_stale`: application builder scope, entity doctrine,
  templates, layouts, workflows, and artifact creation. Primary owners:
  `APPLICATION_ENTITY_DOCTRINE.md`, `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, and
  UI datasets.
- `gk/gui_v4`: interface layout concepts, panels, editor surfaces, trees,
  diagrams, dashboards, flows, and interaction names. Primary owners:
  `APPLICATION_ENTITY_DOCTRINE.md` and `code/dataset/ui_word_datasets.js`.
- `project_action_org`: real business organization domain scope, people,
  roles, access, payroll, attendance, assets, approvals, audit, and starter
  organization template ideas. Primary owner:
  `APPLICATION_ENTITY_DOCTRINE.md`.
- `project_An_App_Shell_v01`: real application shell scope, layouts,
  templates, rendered views over the same data, and product shell behavior.
  Primary owners: `APPLICATION_ENTITY_DOCTRINE.md`,
  `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, and UI datasets.
- `project_ohm_lang_v8`: parser workbench, language grammar, corpus handling,
  parsing layout, parse previews, and language requirements. Primary owner:
  `AN_APP_LANG_SCOPE_REQUIREMENTS.md`.
- English corpus and sentence files under `input_temp`: English sentence
  types, corpus policy, grammar rules, sentence patterns, and sentence
  validation. Primary owner: `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`.
- HTML parser and agent-bot references under `D:/gk_work/feb2026`: parser
  workbench layout, bot UI, chat demo, profile/stage help, and bot capability
  surfaces. Primary owners: `AN_APP_LANG_SCOPE_REQUIREMENTS.md`,
  `AN_BOT_SCOPE_REQUIREMENTS.md`, and UI datasets.
- `input_temp/b1`: sentence completion, incomplete sentence detection,
  sentence similarity, sentence diff, typed template learning, conversation
  boundary detection, task context, scheduled task behavior, and bot-to-bot
  lifecycle ideas. Primary owners: `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`,
  `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, and `AN_BOT_SCOPE_REQUIREMENTS.md`.
- `input_temp/b2`: rulebot capability dictionary, learning memory,
  knowledge units, proof traces, confidence propagation, external learning,
  conflict handling, anomaly explanation, consolidation, forgetting, and
  command-flow capability routing. Primary owners:
  `AN_MEMORY_SCOPE_REQUIREMENTS.md`, `AN_BOT_SCOPE_REQUIREMENTS.md`, and
  validation datasets.
- `input_temp/b3`: entity definition to artifact creation, class shape
  planning, constructor config planning, method contract planning, validation
  before creation, and audit expectations. Primary owners:
  `APPLICATION_ENTITY_DOCTRINE.md`, `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, and
  `AN_MEMORY_SCOPE_REQUIREMENTS.md`.
- `input_temp/b0` through `input_temp/b4` recursive manual audit:
  batch-level file counts, nested folder coverage, concept-bearing groups,
  package/runtime/media classification, and remaining gaps. Primary owner:
  `MANUAL_COMPLETENESS_AUDIT_B0_B4.md`.

Placement rule:

- Define a concept once in the primary owner.
- Use `CONCEPT_CATALOG.md` to resolve repeated concepts and naming conflicts.
- Use `SCHEMA_CONTRACT_CATALOG.md` for record shape and boundary promises.
- Use `DATASET_REGISTRY_REQUIREMENTS.md` for dataset class, ownership, and
  validation rules.
- Reference it from related docs only when integration behavior is needed.
- Add approved 1D vocabulary to datasets when validation may need the names.
- Keep old source names as source references only, not canonical An App names.
