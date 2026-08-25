# Source Adoption Index And Validation Log

## Purpose

This document records every reviewed file from `input_temp/b0`, `input_temp/b1`,
`input_temp/b2`, and `input_temp/b3`, where its useful content was adapted, and
whether the scratchpad docs cover it.

This is the traceability log for source learning. It should be updated whenever
new source folders are reviewed.

## Two Stage Process

Stage 1 validation checks whether each source file was read, classified, and
assigned a primary owner.

Stage 2 evaluation checks whether useful concepts were adapted into the owner
docs, intentionally deferred, or rejected with a reason.

Status values:

- covered: useful content is represented in docs or datasets
- partial: useful content is represented but needs more detail
- deferred: useful content is valid but belongs to later implementation
- rejected: content should not be adopted
- reference_only: source is only kept as evidence or sample material

## Owner Documents

- `APPLICATION_ENTITY_DOCTRINE.md`: application-wide entity doctrine,
  artifact creation, product shell, layouts, templates, workflows, and business
  application scope.
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`: generic language capability, parsing,
  definition documents, parser workbench, entity change plans, and language
  module integration.
- `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`: English grammar, sentence types,
  corpus policy, sentence completion, sentence boundary, sentence similarity,
  sentence diff, and English template learning.
- `AN_BOT_SCOPE_REQUIREMENTS.md`: chat module, sessions, task continuity,
  tool routing, capability dictionary, quick actions, confidence display, and
  scheduled task chat behavior.
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`: durable knowledge memory, proof traces,
  confidence, provenance, knowledge gaps, conflicts, anomaly records,
  consolidation, and forgetting.
- `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`: placement policy, domain and
  subdomain rules, naming rules, and verification rules.
- `PROJECT_CONTEXT.md`: source placement index and project history.
- `code/dataset/validation_word_datasets.js`: approved 1D vocabulary groups.
- `code/dataset/ui_word_datasets.js`: approved interface vocabulary groups.

## External Reference Concepts

External open-source and research areas reviewed for design ideas:

- Markdown AST tooling: document tree parsing, tree editing, and markdown
  serialization.
- Markdown semantic comparison: block-level and tree-level document comparison.
- Entity resolution: duplicate detection, candidate matches, match scoring,
  survivorship, and human review queues.
- Ontology alignment: equivalent, broader, narrower, related, and conflicting
  concepts.
- Knowledge graph extraction: concept nodes, relationship edges, evidence,
  confidence, and source references.
- Semantic merge: structure-aware comparison, moved or renamed idea detection,
  and validation after merge.
- Git conflict review: keep current, accept incoming, accept both, merge,
  split, defer, or reject as explicit decisions.

Adoption rule:

- These are design references only.
- No external project identity becomes canonical An App vocabulary.
- External providers or large stacks are optional later adapters.
- V1 should first use the current scratchpad code and current source folders.

## Folder Summary

### `input_temp/b0`

Theme: English corpus, English sentence handbook, sentence type datasets,
sentence-boundary detection, and parser workbench reference.

Stage 1 validation: all 5 files inventoried and classified.

Stage 2 evaluation: covered with one new gap fixed in this pass: sentence
boundary edge cases.

### `input_temp/b1`

Theme: sentence completion, incomplete sentence detection, sentence similarity,
sentence diff, keyword extraction, typed template learning, task continuity, and
scheduled task behavior.

Stage 1 validation: all 18 files inventoried and classified.

Stage 2 evaluation: covered across English Language, An App Lang, An Bot, and
approved datasets. Model/provider experiments are intentionally treated as
optional adapters.

### `input_temp/b2`

Theme: rulebot capability dictionary, learning memory, proof traces, confidence,
source provenance, knowledge gaps, anomaly explanation, consolidation,
forgetting, and bot tool-routing patterns.

Stage 1 validation: all 5 files inventoried and classified.

Stage 2 evaluation: covered through the new An Memory doc, An Bot capability
dictionary requirements, placement policy, and approved datasets.

### `input_temp/b3`

Theme: entity definition to generated artifact creation.

Stage 1 validation: 1 file inventoried and classified.

Stage 2 evaluation: covered through application artifact creation,
language artifact plans, source provenance, and execution safety requirements.

## File Index

| id | source file | primary owner | secondary owners | stage 1 | stage 2 | adapted content | remaining action |
|---|---|---|---|---|---|---|---|
| b0_001 | `input_temp/b0/dataset_corpus_english_sentences.txt` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `code/dataset/validation_word_datasets.js` | covered | covered | locked corpus metadata, 13 sentence intent types, sentence pattern rows, audit-preserving lifecycle, count validation | implement corpus loader later |
| b0_002 | `input_temp/b0/dataset_type_sentence.txt` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `code/dataset/validation_word_datasets.js` | covered | covered | sentence structure names and locked dataset metadata | no doc gap |
| b0_003 | `input_temp/b0/handbook_english_sentences.md` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | parts of speech, sentence patterns, tenses, pronoun resolution, non-literal language, semantic roles, intent detection, full English processing pipeline, exception datasets | implement detailed English datasets later |
| b0_004 | `input_temp/b0/is-sentence.js` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | sentence-boundary exception handling for acronyms, initials, ellipses, abbreviations, and terminal punctuation | add boundary utility later |
| b0_005 | `input_temp/b0/parsing tools.html` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `code/dataset/ui_word_datasets.js` | covered | partial | parser workbench, content tagging, autocomplete tests, query builder tests, entity extraction tests, demo commands, tagging config, query config, entity config, implementation-file concept, performance metrics | later extract formal parser workbench test matrix |
| b1_001 | `input_temp/b1/Autocomplete Sentence Prediction Techniques.json` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`, `AN_BOT_SCOPE_REQUIREMENTS.md`, `AN_MEMORY_SCOPE_REQUIREMENTS.md` | covered | covered | entity-first language system, staged discover-to-deliver flow, 1D datasets, schemas, recursive task breakdown, nested instructions, seed dictionaries, symbolic template learning, typed graph memory, template scoring and refinement | implementation later |
| b1_002 | `input_temp/b1/Chrome Extension for Sentence Pasting.json` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `APPLICATION_ENTITY_DOCTRINE.md` | covered | reference_only | sentence-pasting interface idea and host adapter hint | browser add-on behavior deferred |
| b1_003 | `input_temp/b1/Create Sentence Completion App.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | sentence completion application goal, fast prompt completion scope | implementation later |
| b1_004 | `input_temp/b1/Create Sentence Completion Samples.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | covered | covered | incomplete sentence samples as test corpus idea, generated output review need | create sample corpus later |
| b1_005 | `input_temp/b1/dataset_ohm_v7_sentence_type_type_v1.js` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `code/dataset/validation_word_datasets.js` | covered | covered | declarative, interrogative, exclamatory, imperative, fragment, and empty names | no doc gap |
| b1_006 | `input_temp/b1/English Sentence Types.json` | `AN_BOT_SCOPE_REQUIREMENTS.md` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`, `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | new task vs continuation detection, task context, scheduler, fetcher, state manager, config loader, action parser, retry, audit, session isolation | implementation later |
| b1_007 | `input_temp/b1/Extract Keywords from Sentences.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | keyword extraction with ignore-word policy and frequency result | implementation later |
| b1_008 | `input_temp/b1/Grammar Rules for Sentence Construction and Replies.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, `AN_BOT_SCOPE_REQUIREMENTS.md` | covered | covered | grammar rules, reply generation, rule-based chatbot behavior, grammar learning from examples | implementation later |
| b1_009 | `input_temp/b1/JS Incomplete Sentence Detector.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | incomplete prompt detection, short phrases, fast local execution, corpus-backed testing, class/config/method style | implementation later |
| b1_010 | `input_temp/b1/Keyword Extraction from Sentences.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | keyword and frequency extraction, stop-word style filtering | implementation later |
| b1_011 | `input_temp/b1/Models for Generating Sentences from Broken Words.json` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | covered | deferred | optional small-provider idea for rule-to-English rendering and broken phrase repair | provider selection later |
| b1_012 | `input_temp/b1/Remove words from sentence..json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | word removal, ignore-word behavior, filtering concept | implementation later |
| b1_013 | `input_temp/b1/Sentence Completion System for Prompts.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | prompt completion, smart suggestion behavior, one-question-at-a-time design, fast consumer hardware requirement | implementation later |
| b1_014 | `input_temp/b1/Sentence Generation Embeddings.json` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | covered | deferred | optional embedding/provider-based generation or matching | optional adapter later |
| b1_015 | `input_temp/b1/Sentence Similarity Techniques.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | covered | covered | sentence similarity signals and provider option | implementation later |
| b1_016 | `input_temp/b1/sentence.js` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | sentence-level diff tokenization idea | implement sentence diff utility later |
| b1_017 | `input_temp/b1/sentences.json` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `code/dataset/validation_word_datasets.js` | covered | covered | 13 sentence intent types and sentence classification order | no doc gap |
| b1_018 | `input_temp/b1/sentenceSimilarity.js` | `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | covered | deferred | provider-backed sentence similarity as optional semantic signal | optional adapter later |
| b2_001 | `input_temp/b2/08_rulebot_master_dictionary_attributes.txt` | `AN_BOT_SCOPE_REQUIREMENTS.md` | `code/dataset/validation_word_datasets.js`, `AN_MEMORY_SCOPE_REQUIREMENTS.md` | covered | covered | capability dictionary entries, triggers, patterns, constraints, command flow, context flow, error recovery, intent matching, parameter extraction | implement dictionary dataset later |
| b2_002 | `input_temp/b2/AnActionAgent_linguistic-demo_v1_0_0_ready_Gem.js` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `AN_BOT_SCOPE_REQUIREMENTS.md` | covered | covered | natural input to intent, parameters, confidence, and audit status pipeline | implementation later |
| b2_003 | `input_temp/b2/chatbot_learner.txt` | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | `AN_BOT_SCOPE_REQUIREMENTS.md`, `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | covered | covered | rule-based learner, knowledge units, JSONL-style storage option, forward and backward reasoning, proof traces, confidence propagation, source learning, gap detection, conflict handling | implementation later |
| b2_004 | `input_temp/b2/k_smrity_features.txt` | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | `AN_BOT_SCOPE_REQUIREMENTS.md` | covered | covered | working, episodic, and semantic memory; consolidation; forgetting; rule repair; source cross-validation; curiosity/gap detection; explanation layer | implementation later |
| b2_005 | `input_temp/b2/mar2026_AnActionAgent_master_spec_v1_0_0_active_Gem.txt` | `AN_BOT_SCOPE_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, `AN_MEMORY_SCOPE_REQUIREMENTS.md`, `code/dataset/ui_word_datasets.js` | covered | partial | benchmark categories, AST typing, intent registry, tokenization, synonym expansion, confidence normalization, fallback response, chat UI behavior, quick prompts, typing indicator, confidence badge | later split into formal benchmark and UI test matrix |
| b3_001 | `input_temp/b3/actionCodeGen_core_v1_0_0_draft_Gem.js` | `APPLICATION_ENTITY_DOCTRINE.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, `AN_MEMORY_SCOPE_REQUIREMENTS.md` | covered | covered | entity definition to artifact creation, class shape planning, constructor config planning, method contract planning, validation-before-creation, audit and metrics expectation | create artifact artifact creator plugin later |
| b3_002 | `input_temp/b3/ksmriti/docs/l_smrity_success_criteria.md` | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | `AN_MEMORY_SCOPE_REQUIREMENTS.md`, `SCHEMA_CONTRACT_CATALOG.md`, `DATASET_REGISTRY_REQUIREMENTS.md` | covered | covered | acceptance framework, rejection criteria, measurable verification methods, continuous monitoring gates, hypothesis staging, promotion and demotion, repair audit, source validation, memory requirements | implement acceptance and repair utilities later |
| b3_003 | `input_temp/b3/ksmriti/ksmirti_product.html` | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | `CONCEPT_CATALOG.md`, `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | covered | covered | deterministic memory-native product pattern, staged extracted rules, evidence-first validation, knowledge repositories, dual-source validation, source trust dynamics | no doc gap |
| b3_004 | `input_temp/b3/ksmriti/ksmirti_spec_comparison_v1.html` | `SCHEMA_CONTRACT_CATALOG.md` | `DATASET_REGISTRY_REQUIREMENTS.md`, `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | covered | covered | exact rule schema pattern, working/episodic/semantic memory, repair actions, validation protocol, indexed capability bank, implementation priority model | implement formal schemas later |
| b3_005 | `input_temp/b3/dumbtools/docs/actionagent_dumb-tools-spec_v1.1.0_ready_Gem.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md`, `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | covered | covered | deterministic input pipeline, mode detection, tree parsing, normalization, relation linking, rule application, validation, export, audit lineage | implement canonical pipeline later |
| b3_006 | `input_temp/b3/dumbscript_v3/dictionary/dumbscript_v3_dictionary_tree.json` | `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, `DATASET_REGISTRY_REQUIREMENTS.md` | covered | covered | dictionary tree shape with ids, synonyms, patterns, matches, definitions, rules, and suggestion support | implement dictionary loader later |
| b3_007 | `input_temp/b3/dumbscript_v3/rules/rules_dumbscript.txt` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`, `DATASET_REGISTRY_REQUIREMENTS.md` | covered | partial | isolated executable segment markers, source metadata on tree snapshots, canonical command mappings, dataset rules, class/config/method conventions | reconcile old folder rules with current dot layout later |
| b3_008 | `input_temp/b3/MAT/docs/mar2026_MAT-framework-spec_v1_0_0_ready_Gem.md` | `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md` | `AN_BOT_SCOPE_REQUIREMENTS.md`, `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | covered | covered | optional multi-agent collaboration bus, request/acknowledge/execute/manifest/validate/close handoff flow | implement only after core single-agent flow |
| b3_009 | `input_temp/b3/dumbdscript_v1/grammar_definitions/dumbscript_grammar_v1_draft_Gem.md` | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | `SCHEMA_CONTRACT_CATALOG.md`, `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` | covered | covered | natural controlled grammar for entity definitions, properties, operations, validation modifiers, and business rules | implement grammar dataset later |
| gk_001 | `gk/ohn_miner/SYMBOLIC REGRESSION.txt` | `TEMPLATE_DOMAIN_REQUIREMENTS.md` | `EXPERIMENT_DOMAIN_REQUIREMENTS.md`, `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | covered | covered | template-guided expression discovery, placeholder filling, candidate scoring, clustering, staged promotion | implement experiment templates later |
| gk_002 | `gk/experiment_space.txt` | `EXPERIMENT_DOMAIN_REQUIREMENTS.md` | `UI_SURFACE_DOMAIN_REQUIREMENTS.md`, `TEMPLATE_DOMAIN_REQUIREMENTS.md` | covered | covered | experiment entity, versioned runs, nested rule/filter tree, tabbed reports, chart panels, playback, hypothesis validation | implement experiment module later |

## Coverage Evaluation

Covered well:

- English sentence intent and structure types
- English grammar phases and corpus lifecycle
- incomplete sentence detection
- sentence completion
- sentence similarity and diff
- typed template learning
- conversation boundary detection
- task context and scheduled task behavior
- bot capability dictionary
- knowledge memory and learning governance
- entity definition to artifact creation
- confidence, provenance, proof trace, conflict, gap, consolidation, and
  forgetting concepts
- placement policy for domain, subdomain, module, plugin, utility, and template
- hypothesis staging, promotion/demotion lifecycle, source trust dynamics, repair
  actions, rejection criteria, acceptance scoring, and continuous monitoring
- deterministic language pipeline, dictionary tree parsing, controlled grammar,
  command synonym mapping, optional agent bus, template-guided expression
  discovery, and experiment workbench requirements

Partial or deferred:

- Parser workbench test matrix from `parsing tools.html`
- Formal UI test matrix from the large action-agent spec
- Concrete dictionary dataset rows for bot capabilities
- Concrete English corpus files for all listed word groups
- Provider adapters for embeddings or small local models
- Implementation of memory storage and recall
- Artifact artifact creator plugin and tests
- Concrete acceptance criterion, rejection criterion, repair record, and source
  trust utilities
- Canonical language pipeline plugin, dictionary loader, grammar datasets, and
  experiment domain implementation

Rejected or changed:

- Old project identities are source references only.
- Browser add-on behavior is not core An App behavior.
- Provider/model experiments are optional adapters, not core truth.
- Generated or bundled code style is not adopted directly.
- Runtime execution of generated artifacts is blocked by default.
- Host-specific paths are not canonical project structure.

## Two Stage Validation Checklist

Stage 1 validation:

- all files inventoried: passed
- each file has a primary owner: passed
- each file has a coverage status: passed
- old names were not adopted as canonical names: passed

Stage 2 evaluation:

- useful concepts adapted to docs: passed
- deferred concepts listed: passed
- rejected concepts listed: passed
- new doc gaps patched during audit: passed
- dataset updates added where needed: passed

## Next Implementation Backlog

- Create concrete `an_memory` utilities for knowledge units, proof traces,
  confidence reports, and recall.
- Create concrete bot capability dictionary datasets from approved capability
  names, triggers, patterns, and constraints.
- Create English boundary detection utility and tests.
- Create parser workbench test matrix from parser reference files.
- Create UI interaction test matrix for chat surfaces and confidence display.
- Create artifact artifact creator plugin with plan validation, test generation,
  provenance, and audit logging.
