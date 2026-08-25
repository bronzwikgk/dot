# Manual Dataset And Doc Audit B6 B7

## Purpose

This document records a recursive audit focused only on dataset-like files and
documentation under:

- `input_temp/b6`
- `input_temp/b7`

Code files were not evaluated for implementation quality in this pass. They
were only considered when their file name or folder role showed dataset,
schema, data tree, knowledge, rule, spec, manifest, or requirement content.

## Recursive Inventory

| Batch | All recursive files | All bytes | Doc and dataset candidates |
| --- | ---: | ---: | ---: |
| b6 | 1,004 | 20,879,484 | 753 |
| b7 | 60,607 | 903,995,466 | 35,339 |

The large b7 count is mostly caused by documentation corpuses, converted
outputs, package material, command-page references, and audit/log stores. Those
are accounted for by group before adoption decisions are made.

## File Shapes Found

### b6

| Extension | Count |
| --- | ---: |
| `.md` | 497 |
| `.json` | 144 |
| `.txt` | 87 |
| `.html` | 9 |
| `.js` dataset-like | 8 |
| `.jsonl` | 2 |
| `.yaml` | 2 |
| `.index` | 2 |
| `.mermaid` | 1 |
| `.def` | 1 |

### b7

| Extension | Count |
| --- | ---: |
| `.md` | 34,417 |
| `.json` | 279 |
| `.txt` | 217 |
| `.yml` | 169 |
| `.js` dataset-like | 94 |
| `.yaml` | 55 |
| `.py` dataset-like | 31 |
| `.jsonl` | 18 |
| `.csv` | 9 |
| `.html` | 7 |
| other doc/data shapes | 43 |

## B6 High Signal Groups

### action_input

Adopted concepts:

- input widget as a reusable UI component
- semantic markup requirement
- token-driven styling
- draggable persistent widgets
- UI frame and panel naming
- UI evidence document with requirement status

Current scratchpad coverage:

- Mostly belongs in `APPLICATION_ENTITY_DOCTRINE.md` and UI datasets.

Gap:

- Add an approved UI component requirement for input surface, floating trigger,
  panel, widget position persistence, and semantic markup rules.

### action_lable

Adopted concepts:

- conversation labeling utility
- conversation to tree-like nodes
- hierarchical labels
- label confidence
- dependency mapping between nodes
- exportable knowledge artifacts
- label tree and rule tree datasets

Current scratchpad coverage:

- Partially covered by `AN_MEMORY_SCOPE_REQUIREMENTS.md`,
  `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, and `AN_BOT_SCOPE_REQUIREMENTS.md`.

Gap:

- Add label taxonomy dataset.
- Add label rule schema.
- Add conversation knowledge extraction scope.
- Add dependency map output contract.

### action_tree_builder

Adopted concepts:

- multi-file document tree builder
- format detection with confidence
- native parse tree per format
- normalized common tree
- consolidated project tree with virtual root
- provenance and line range tracking
- duplicate, reference, similarity, temporal supersession, and conflict links
- strict, lenient, and recover modes

Current scratchpad coverage:

- Partially covered by `AN_APP_LANG_SCOPE_REQUIREMENTS.md` and
  `SOURCE_ADOPTION_PIPELINE_SCOPE.md`.

Gap:

- Add consolidated project tree schema.
- Add document provenance schema.
- Add relationship policy for duplicate, reference, similarity, supersession,
  and conflict links.

### action_git

Adopted concepts:

- repository actions as governed entity operations
- deploy tree definition
- testable git action wrapper

Current scratchpad coverage:

- Lightly covered by application publish and audit language.

Gap:

- Add repository operation policy as a future utility.
- Add branch, commit, tag, remote, deploy target, and approval relationship
  names to datasets later.

### action_http_fetch

Adopted concepts:

- fetch adapter as an external knowledge intake utility
- config, templates, definitions, docs, logs

Current scratchpad coverage:

- Related to search provider and external verification notes.

Gap:

- Add network intake adapter requirements: provider config, timeout, retry,
  evidence capture, and security policy.

### agent and learner folders

Adopted concepts:

- agent persona profiles
- cognitive capability profile
- learner datasets
- benchmarker and tester docs
- learned tree artifacts
- profile-driven, rule-based, security-aware agent tests

Current scratchpad coverage:

- Partially covered by `AN_BOT_SCOPE_REQUIREMENTS.md` and
  `AN_MEMORY_SCOPE_REQUIREMENTS.md`.

Gap:

- Add learner dataset registry.
- Add agent capability profile schema.
- Add benchmark and tester report schema.
- Add learned artifact promotion policy.

## B7 High Signal Groups

### command_page_knowledge

Evidence group:

- `AnGitAgent/data/input/cli_knowledge/tldr`
- many language/platform folders such as common, linux, osx, windows, and
  localized variants

Adopted concepts:

- large command knowledge corpus
- command example pages as reusable knowledge entries
- command usage examples by platform and language
- command catalog can be bootstrapped from structured pages

Current scratchpad coverage:

- Partially covered by command catalog notes.

Gap:

- Add command knowledge entry schema.
- Add command example schema.
- Add platform and locale dimensions.
- Add import policy for external command corpuses.

### ast_parser_docs

Evidence group:

- `AAstParser/README_ast_parser.md`

Adopted concepts:

- everything as an entity
- parsing and transformation over files, documents, nodes, configs, templates,
  and policies
- English-defined system
- round-trip validation
- plugin architecture
- command line and API surfaces
- provenance tracking

Current scratchpad coverage:

- Strongly covered by `APPLICATION_ENTITY_DOCTRINE.md` and
  `AN_APP_LANG_SCOPE_REQUIREMENTS.md`.

Gap:

- Add round-trip validation requirement.
- Add provenance trace requirement for every transformation.

### type_anchored_system

Evidence group:

- `AAstParser/type-anchored-system/SPECIFICATION_v2.md`
- `AAstParser/type-anchored-system/GAP_ANALYSIS.md`
- related test and governance data folders

Adopted concepts:

- fixed ontology with inheritance
- typed template matching
- learnable templates
- human approval for governed changes
- type lattice
- specific language templates for causality, passive voice, noun phrase
  modifiers, person-role identification, instrument role, long-distance
  dependency, relative clause, and concessive clause
- learning traces and meta-learning examples

Current scratchpad coverage:

- Partially covered by `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`,
  `AN_APP_LANG_SCOPE_REQUIREMENTS.md`, and `AN_MEMORY_SCOPE_REQUIREMENTS.md`.

Gap:

- Add type hierarchy dataset.
- Add template pattern schema.
- Add language template dataset.
- Add learning trace schema.
- Add approval entity schema for learned changes.

### action_nlp_seed_knowledge

Evidence group:

- `actionNLP/ActionNLP.txt`
- `actionNLP/docs/actionNLP_seed_knowledge_packet_v1_2026-03-30.md`

Adopted concepts:

- deterministic rule-based NLP
- fixed type system at boot
- lexicon and dictionary
- grammar and parsing rules
- shapes and pattern library
- output and fallback templates
- seed facts, seed policies, quality gates, conflict handling
- optional synonym sets and bag-of-words ranking

Current scratchpad coverage:

- Mostly covered by English Language and An App Lang docs.

Gap:

- Add seed knowledge packet document.
- Add boot seed dataset list.
- Add quality gate dataset.
- Add deterministic fallback template set.

### any_format_conversion

Evidence group:

- `any2any/README.md`
- `anyFormat2js/docs/README.md`
- example templates and conversion manifests

Adopted concepts:

- all-to-all file conversion
- supported input format table
- conversion manifest
- parser per file type
- universal iterator for traversal
- output variants such as text, markdown, JSON, YAML, HTML, and module wrapper

Current scratchpad coverage:

- Partially covered by An App Lang parser adapter and markdown pipeline docs.

Gap:

- Add conversion manifest schema.
- Add supported file type dataset.
- Add parser adapter matrix.
- Add output renderer matrix.

### natural_english_definition_system

Evidence group:

- `Aprototype/README.md`
- config files for actions, commands, entities, keywords, rules, behavior
- definition docs

Adopted concepts:

- system behavior defined by editable natural English definitions
- definition sections for builtins, patterns, section parsers, executors,
  project, entities, commands, validations, rules, outputs, handlers, and
  configuration
- environment-specific definition loading

Current scratchpad coverage:

- Partially covered by An App Lang and Application doctrine.

Gap:

- Add canonical definition document schema.
- Add section type dataset.
- Add command handler schema.
- Add validation section schema.

## Immediate Dataset Additions Needed

Add or extend 1D arrays for:

- parser format names
- parser stage names
- output format names
- relationship analysis names
- provenance field names
- label category names
- label rule field names
- command knowledge field names
- command platform names
- locale names
- type hierarchy names
- semantic role names
- language template names
- learning trace event names
- approval status names
- quality gate names
- seed knowledge group names
- definition section names
- UI input surface names
- repository operation names
- network intake policy names

## Immediate Doc Updates Needed

1. `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
   - parser adapter matrix
   - conversion manifest
   - type-anchored template learning
   - definition document sections
   - round-trip validation

2. `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`
   - language template dataset
   - type hierarchy for sentence and phrase structures
   - deterministic grammar seed packet
   - fallback and clarification templates

3. `AN_MEMORY_SCOPE_REQUIREMENTS.md`
   - label taxonomy
   - knowledge artifact promotion
   - learning traces
   - evidence and provenance retention

4. `AN_BOT_SCOPE_REQUIREMENTS.md`
   - agent capability profiles
   - command knowledge catalog
   - tester and benchmark report schemas
   - approval flow for learned updates

5. `APPLICATION_ENTITY_DOCTRINE.md`
   - dataset-like entity types for label taxonomy, command page, conversion
     manifest, type hierarchy, template pattern, learning trace, and approval.

## Two Stage Validation

Stage 1 inventory validation:

- `b6` and `b7` were scanned recursively.
- Total file counts were recorded.
- Doc and dataset candidate counts were recorded.
- Major high-signal groups were identified.
- Large generated, package, media, and log stores were grouped instead of being
  treated as primary concept docs.

Stage 2 coverage validation:

- Representative docs were read from each high-signal group.
- Current scratchpad coverage was mapped.
- Missing dataset and documentation items were listed.
- Old names remain evidence names, not canonical project names.

## Final Finding

`b6` and `b7` add strong detail for datasets and docs. The most important
adoption work is not more code yet. First we should formalize datasets and docs
for:

- seed knowledge
- type hierarchy
- language templates
- command knowledge
- label taxonomy
- conversion manifest
- parser adapter matrix
- provenance and learning traces
- approval and quality gates
