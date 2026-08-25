# An App Lang Scope And Requirements

## Purpose

An App Lang is the language layer for An App.

Its job is to turn natural English, controlled English, markdown definition
documents, dataset descriptions, template descriptions, and workflow
descriptions into validated An App entities and actions.

An App Lang is not a separate business application. It is a reusable language
capability used by An App to understand, classify, validate, translate, and
compose structured application data.

English grammar knowledge belongs to the English Language domain document:
`ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`.

An App Lang may call that domain when input is English, but it should not mix
all English grammar rules directly into the generic language capability.

The definition-language contract adapted from the old OHM DSL notes is captured
in `AN_APP_LANG_DEF_LANGUAGE_SPEC.md`. That document owns `.def` syntax,
reference prefixes, AST/DAG node names, import behavior, schema versioning,
state, async, cache, transaction, and validation-code requirements for An App
Lang.

## Deterministic Pipeline Requirements

An App Lang should support a canonical deterministic language pipeline:

1. ingest input
2. detect mode
3. parse into tree
4. normalize into approved shapes
5. link relations
6. apply rules
7. validate integrity
8. compile or execute when allowed
9. export structured output
10. audit lineage

Every pipeline node should keep input source metadata, raw text when policy
allows it, normalized labels, dictionary ids, parent/child links, dependency
links, validation status, and audit references.

Executable language segments should be clearly marked so ordinary prose,
documentation, and command language are not mixed by accident.

Dictionary tree entries should include:

- `id`
- `name`
- `type`
- `use_case`
- `synonyms`
- `patterns`
- `matches`
- `similar_nodes`
- `definitions`
- `rules`
- `grammar_hints`

## Core Goal

An App Lang should let a user describe an application, dataset, template,
workflow, relationship, policy, or change in simple English, and then produce a
structured entity change plan that An App can validate and apply.

## NLU Matching Method Catalog

Language matching should support a catalog of methods:

- exact match
- substring match
- fuzzy match
- phonetic match
- lexical match
- synonym match
- semantic match
- contextual semantic match

Fuzzy matching may include edit-distance and prefix-aware methods. Lexical matching should prefer lemmatization when a dictionary is available. Semantic matching should remain optional and provider-backed.

## Semantic Particle

A semantic particle is the smallest independent logic unit extracted from input.

Semantic particles may become:

- fact candidates
- rule candidates
- action candidates
- context candidates
- relationship candidates

Particles should preserve source text, source span, confidence, and parser evidence.

Example input:

```text
create a payroll dashboard for employees with approvals and audit logs
```

Expected structured understanding:

- intent: create_application_part
- domain: payroll
- target entity: dashboard
- related entities: employee, approval_request, audit_log
- likely datasets: employee_master, payroll_engine, approvals_hub,
  session_activity_log
- likely templates: payroll_slip_template, approval_request_template,
  audit_log_template
- required validations: dataset references, permissions, audit rule

## Position In An App

An App Lang sits before the entity system.

Flow:

```text
natural input
→ an_app_lang
→ parsed intent
→ slots and entities
→ warnings and questions
→ structured change plan
→ entity_validator
→ action_entity
→ registry / dataset / template / workflow update
```

## What It Learns From The Reference Project

Useful concepts to adopt:

- controlled natural language
- docs as definitions
- dataset definition documents
- datamap definition documents
- data table definition documents
- plugin definition documents
- template matching
- slot extraction
- sentence validation
- sentence translation
- ambiguity detection
- near-match suggestions
- golden sentence corpus
- corpus initiation
- error catalog
- lexicon datasets
- cacheable vocabulary lookup
- safe expression evaluation
- structure policy for datasets, data maps, data tables, and definition docs
- runtime count checks for approved word arrays
- ordered template matching
- preposition-to-slot mapping
- multi-host delivery
- locked sentence-type corpuses with lifecycle policy
- pragmatic sentence classification
- parts-of-speech tagging
- tense and aspect detection
- pronoun resolution
- semantic role mapping
- non-literal language detection
- exception handling for irregular and ambiguous language

Concepts to avoid copying directly:

- old folder naming
- product-specific names
- mixed casing
- broken test syntax
- hardcoded object-heavy vocabulary shapes
- unrealistic zero-object policy
- old runtime terms that conflict with An App vocabulary

## Inputs

An App Lang should accept:

- natural English request
- controlled English command
- markdown definition document
- dataset description
- datamap description
- data table description
- template description
- workflow description
- policy description
- relationship description
- pasted JSON or tabular sample
- natural layout text
- natural style text
- user correction
- locked grammar corpus
- sentence type dataset
- English language handbook definition
- definition file
- schema migration definition
- import definition
- state definition
- cache definition
- transaction definition

## Outputs

An App Lang should produce:

- normalized text
- token list
- sentence list
- detected intent
- extracted slots
- candidate entity list
- candidate relationship list
- candidate dataset list
- candidate template list
- candidate workflow list
- ambiguity warnings
- unknown word findings
- near-match suggestions
- validation findings
- structured entity change plan
- artifact creation plan
- content tag result
- autocomplete suggestions
- query plan
- extracted entity values
- correction record
- layout abstract tree
- style rule tree
- parser workbench preview state
- part-of-speech tags
- sentence structure classification
- tense and aspect result
- pronoun reference map
- semantic role map
- figure-of-speech findings
- language exception findings
- compound sentence child intents
- definition parse tree
- AST record
- DAG record
- definition validation report
- schema migration report
- reference resolution report

## Required Entities

An App Lang should model these as entities:

- language_request
- normalized_text
- token
- sentence
- phrase
- intent_match
- slot
- parse_result
- translation_result
- ambiguity_finding
- near_match_finding
- lexicon_entry
- grammar_template
- golden_sentence
- language_rule
- definition_document
- dataset_definition
- datamap_definition
- data_table_definition
- plugin_definition
- expression_rule
- change_plan
- corpus
- corpus_source
- corpus_cache
- error_catalog_entry
- warning_catalog_entry
- document_datamap
- document_data_table
- initiation_plugin
- global_context_plugin
- content_tag_result
- autocomplete_request
- autocomplete_result
- query_builder_request
- extracted_entity_value
- correction_learning_record
- natural_layout_document
- natural_style_document
- parser_workbench_session
- command_surface
- configuration_profile
- learning_store
- learning_metric
- confidence_policy
- query_renderer
- semantic_element_tree
- style_tree
- parser_preview_state
- sentence_type
- sentence_pattern
- part_of_speech_tag
- tense_result
- pronoun_reference
- semantic_role_assignment
- figure_of_speech_finding
- language_exception_finding
- compound_sentence
- grammar_corpus_entry
- locked_dataset_definition

## Required Datasets

An App Lang needs approved 1D datasets for:

- intent names
- action words
- entity words
- relationship words
- layout words
- template words
- dataset words
- workflow words
- policy words
- status words
- preposition words
- stop words
- ambiguity warning names
- near-match warning names
- parse warning names
- grammar template names
- expression operation names
- document section names
- corpus category names
- corpus source names
- warning code names
- error code names
- fallback policy names
- cache operation names
- cache status names
- content tag names
- extractable entity names
- query intent names
- query target names
- layout rule names
- style rule names
- language config profile names
- learning store names
- language command names
- confidence policy names
- correction source names
- autocomplete context names
- parser workbench action names
- preposition slot names
- data shape category names
- parser host target names
- sentence intent type names
- sentence structure type names
- part of speech names
- tense names
- pronoun type names
- figure of speech names
- semantic role names
- language exception names
- sentence pattern names

## Required Data Maps

An App Lang needs relationship/mapping data for:

- word to intent
- word to entity type
- word to operation
- phrase to template
- phrase to workflow
- phrase to relationship type
- dataset name to entity type
- template name to component family
- layout name to render profile
- document section to entity field
- warning code to resolution guidance
- error code to gate
- error code to resolution guidance
- corpus source to dataset definition
- dataset definition to datamap definition
- data table to cache operation
- golden sentence to expected change plan
- input phrase to content tag
- prefix to autocomplete suggestion
- natural query to query plan
- query plan to render target
- natural layout rule to layout tree node
- natural style rule to style tree node
- correction to learned rule
- configuration profile to default values
- learning store to review workflow
- confidence policy to review gate
- preposition to slot name
- verb phrase to ordered template
- data shape category to storage type
- sentence pattern to intent
- sentence intent type to entity type
- part of speech to phrase role
- tense pattern to tense name
- pronoun type to resolution rule
- semantic role to slot name
- figure of speech to interpretation policy
- language exception to handler
- compound sentence to ordered child sentences

## Required Data Tables

An App Lang needs tabular definitions for:

- grammar templates
- slot extraction rules
- sentence examples
- error catalog
- parser warnings
- translation patterns
- expression rules
- document schema rules
- golden corpus expected outputs
- corpus source definitions
- corpus cache definitions
- error catalog entries
- warning catalog entries
- fallback policies
- content tagging rules
- autocomplete trie rows
- query builder patterns
- entity extraction patterns
- correction learning records
- layout parser rules
- style parser rules
- command surface definitions
- configuration profile definitions
- learning store records
- learning statistics records
- confidence policy rules
- query render target rules
- dataset count expectations
- parser host target contracts
- ordered template priority rows
- preposition slot mapping rows
- sentence grammar corpus rows
- sentence type rows
- part of speech tagging rules
- tense detection rules
- pronoun resolution rules
- semantic role rules
- figure of speech rules
- language exception rules
- compound sentence parse rows

## Required Components

The language layer should be made from reusable utilities and plugins:

- natural_language_parser
- text_normalizer
- sentence_segmenter
- token_classifier
- template_matcher
- slot_extractor
- sentence_validator
- sentence_translator
- ambiguity_detector
- near_match_suggester
- definition_document_parser
- expression_validator
- golden_corpus_runner
- language_diagnostics_formatter
- corpus_initiator
- corpus_source_registry
- corpus_cache_manager
- error_catalog_provider
- warning_catalog_provider
- content_tagger
- autocomplete_provider
- query_builder
- entity_extractor
- correction_learner
- command_surface
- configuration_profile_loader
- learning_store_manager
- confidence_policy_checker
- query_plan_renderer
- layout_language_parser
- style_language_parser
- layout_ast_generator
- parser_workbench
- preview_renderer
- structure_policy_checker
- dataset_count_checker
- host_target_adapter
- part_of_speech_tagger
- tense_detector
- pronoun_resolver
- semantic_role_mapper
- figure_of_speech_detector
- language_exception_handler
- compound_sentence_parser

## Parser Tool Requirements

An App Lang should include parser tools for interactive and command-style use.

Required tools:

- content_tagger
- autocomplete_provider
- query_builder
- entity_extractor
- correction_learner
- command_surface
- configuration_profile_loader
- learning_store_manager
- confidence_policy_checker
- query_plan_renderer
- layout_language_parser
- style_language_parser
- layout_ast_generator
- preview_renderer
- structure_policy_checker
- dataset_count_checker
- host_target_adapter
- part_of_speech_tagger
- tense_detector
- pronoun_resolver
- semantic_role_mapper
- figure_of_speech_detector
- language_exception_handler
- compound_sentence_parser

### Locked Corpus Requirements

An App Lang may use locked corpus files as canonical grammar references.

A locked corpus should declare:

- version
- status
- schema version
- maintainer
- last updated date
- source reference
- line format
- lifecycle transition policy
- changelog

Locked corpuses should be append-only. Sentence types should not be deleted.
Deprecated sentence types should be marked and skipped so audit history remains
available.

The sentence grammar corpus should support rows with:

- sentence type
- phrase pattern
- resolved entity type
- intent meaning

The initial sentence intent types to support are:

- assertion
- query
- command
- condition
- negation
- comparison
- definition
- greeting
- farewell
- confirmation
- rejection
- clarification
- compound

The basic sentence structure types to support are:

- declarative
- interrogative
- imperative
- exclamatory

### Structure Policy

An App Lang should enforce a simple data-shape policy:

- 1D arrays are datasets
- relationship pairs are data maps
- rows with named fields are data tables
- config and schema descriptions are definition documents

The parser should classify incoming examples into one of these storage shapes
before proposing changes.

Dataset rules:

- approved word lists should be 1D arrays
- arrays should contain unique strings
- tests should calculate the count from the data
- expected counts should be stored as data and verified at load time

Data table rules:

- rows should have consistent columns
- required columns should be declared
- missing columns should produce findings

Data map rules:

- each mapping should declare source, target, and relationship meaning
- unknown source or target names should produce findings

### English Grammar Pipeline

An App Lang should support a complete English understanding pipeline when the
input requires general sentence understanding rather than only controlled
commands.

Pipeline:

1. tokenize input into words and punctuation-aware segments
2. tag each token with part of speech
3. parse sentence structure
4. detect tense and aspect
5. resolve pronouns
6. map semantic roles
7. detect intent
8. detect non-literal language
9. expand contractions and synonym candidates
10. handle irregular forms and known exceptions
11. produce structured understanding with confidence and findings

The original text should always be preserved. Normalized text and filtered text
are derived views.

### Parts Of Speech Requirements

Supported parts of speech:

- noun
- verb
- adjective
- adverb
- pronoun
- preposition
- conjunction
- determiner
- interjection
- auxiliary verb
- modal verb
- qualifier
- particle
- article
- quantifier

Each tag should include token span, tag name, confidence, and source dataset.

### Sentence Pattern Requirements

Supported sentence patterns:

- subject plus verb
- subject plus verb plus object
- subject plus verb plus complement
- subject plus verb plus object plus object
- subject plus verb plus object plus complement
- subject plus auxiliary plus verb plus object
- subject plus auxiliary plus adverb plus verb plus object

Patterns should produce structured roles such as subject, verb, object,
complement, auxiliary, and adverb.

### Tense Requirements

Supported English tenses:

- present simple
- present continuous
- present perfect
- present perfect continuous
- past simple
- past continuous
- past perfect
- past perfect continuous
- future simple
- future continuous
- future perfect
- future perfect continuous

Tense detection should identify main verb, auxiliary tokens, aspect, time
meaning, and confidence.

### Pronoun Resolution Requirements

Supported pronoun categories:

- subject pronoun
- object pronoun
- possessive pronoun
- possessive determiner
- reflexive pronoun
- demonstrative pronoun
- relative pronoun
- interrogative pronoun
- indefinite pronoun

Pronoun resolution should find the nearest compatible prior noun or phrase when
context is available. If no compatible referent exists, it should emit a finding
instead of guessing silently.

### Semantic Role Requirements

Supported semantic roles:

- agent
- patient
- theme
- instrument
- location
- time

Semantic roles should map back to extracted slots so downstream action plans can
use them.

### Non-Literal Language Requirements

The language layer should detect non-literal language when relevant.

Supported types:

- idiom
- metaphor
- simile
- irony
- sarcasm
- euphemism
- collocation

Non-literal detections should not automatically become action plans. They should
add interpretation findings and lower confidence when literal execution would be
unsafe or likely wrong.

### Language Exception Requirements

The language layer should handle known English exceptions:

- irregular verbs
- irregular nouns
- phrasal verbs
- ambiguous words
- homonyms
- synonyms
- antonyms
- contractions
- stopwords
- compound words

Exception handling should be dataset-backed. Unknown exceptions should be
recorded as findings and, when useful, proposed as learning records.

### Host Target Requirements

An App Lang should be portable across host targets.

Host targets:

- browser
- node
- script_host
- desktop_shell
- backend_service

Host-specific wrappers may vary, but parser behavior, datasets, warnings, and
golden corpus results should stay consistent across hosts.

### Command Surface

An App Lang should expose the parser tools through a command surface so the same
capability can be used from the workbench, tests, scripts, and pasted text.

Required commands:

- tag
- complete
- query
- extract
- learn
- parse_layout
- parse_style
- render_preview
- validate_sentence
- translate_sentence
- run_corpus

The command surface should accept direct text input and piped document input.
It should return structured JSON-compatible results with diagnostics, not only
human-readable text.

### Configuration Profiles

The language layer should load behavior from configuration profiles with
defaults and project overrides.

Required profiles:

- tagging_profile
- autocomplete_profile
- query_profile
- extraction_profile
- layout_profile
- style_profile
- corpus_profile
- fallback_profile
- host_target_profile
- structure_policy_profile

Profile rules:

- defaults must exist for every required profile
- project overrides apply after defaults
- invalid overrides should report findings and fall back to the last valid value
- profile shape should be versioned
- profile changes should be covered by tests
- host target differences should be documented

### Learning Stores

The language layer should separate approved vocabulary from learned suggestions.

Required stores:

- base_dictionary
- user_dictionary
- learned_rule_log
- feedback_log
- learning_stats
- correction_queue

Learned records should record input text, old result, corrected result,
confidence, timestamp, actor, and review status.

Learning statistics should include count by tag, count by entity type, average
confidence, accepted corrections, rejected corrections, and pending corrections.

### Confidence Policy

Every parser result that can be uncertain should include confidence.

Confidence rules:

- each tag has a minimum confidence threshold
- results below threshold require review
- multiple candidates should be ranked by confidence
- pattern matches, keyword matches, and value shape checks can contribute to
  confidence
- tests should verify expected confidence bands, not just labels

### Ordered Template Matching

Template matching should use ordered priorities.

Rules:

- exact controlled patterns should run before broad fallback patterns
- multi-word verbs should run before single-word verbs when both match
- fallback task patterns should produce a warning
- ambiguous matches should include all reasonable candidates and the chosen
  priority rule

### Content Tagging

The content tagger should classify text into approved content tags:

- instruction
- rule
- information
- knowledge

Examples:

- "install the package" should classify as instruction
- "users must log in with email" should classify as rule
- "javascript runs in browsers" should classify as information
- "understanding async behavior requires practice" should classify as knowledge

The tagger should return confidence and findings. Low-confidence tags should
require review.

Content tagging should split multi-sentence text, tag each sentence, deduplicate
tag results by tag type, sort by confidence, and produce a summary with total
sentences, total tags, tag distribution, and average confidence.

### Autocomplete

The autocomplete provider should suggest approved words while the user types.

Suggestion sources:

- approved entity names
- approved operation names
- approved template names
- approved dataset names
- approved layout names
- approved workflow names
- project-specific vocabulary
- user-approved learned vocabulary

Autocomplete should be context-aware. For example, after `render`, layout names
should rank higher than entity names.

Autocomplete should be backed by a prefix index or equivalent structure so
suggestions remain fast as dictionaries grow.

### Query Builder

The query builder should translate natural search requests into structured query
plans.

Examples:

- "find employee records where department is engineering"
- "search workflows containing payroll"
- "show datasets related to approvals"
- "find documents modified yesterday"

The output should be a query plan, not a shell command. A separate renderer may
turn the query plan into a filesystem, database, registry, document, URL, or
search-index operation.

Supported query render targets:

- registry
- dataset
- document
- filesystem
- database
- search_index
- url

Query planning should preserve query history with input, structured output,
timestamp, and render target. Renderers may produce filesystem, SQL,
search-index, or URL forms only after the structured query plan validates.

### Entity Extraction

The entity extractor should detect common values inside text:

- email
- phone
- date
- url
- path
- id
- amount
- time
- duration
- person_name
- organization_name

Extracted values should include source span, value, entity type, confidence, and
validation findings.

Overlapping extracted values should be resolved deterministically. When two
values overlap, the longer or more specific match should be kept and the removed
match should be available in diagnostics.

### Slot Extraction

Slot extraction should map approved prepositions into approved slot names.

Reference slot mappings:

- from to source
- to to target
- into to destination
- using to tool
- with to instrument or attributes
- at to location
- for to purpose
- by to actor or grouping field

Articles such as `a`, `an`, `the`, `this`, and `that` may be dropped from slot
text when preserving them would reduce match quality. The original text should
still be retained in the parse result.

### Learning From Corrections

The correction learner should store user corrections as reviewable learning
records.

Correction examples:

- tag correction: information to instruction
- slot correction: wrong target field
- entity correction: unknown word mapped to approved entity
- layout correction: natural layout phrase mapped to approved layout rule

Learning records should not become approved rules automatically. They should be
reviewed, validated, and promoted through approved datasets or data tables.

## Natural Layout Parser Requirements

An App Lang should parse natural layout descriptions into a layout abstract tree.

Example input:

```text
The body is a column container that takes full viewport height.
The header is a row container with fixed height.
The main element grows to fill available space.
The preview area has padding and white background.
```

Expected output:

- layout nodes
- parent-child relationships
- layout rules
- style rules
- semantic element tree
- style rule tree
- component candidates
- validation findings

Supported layout concepts:

- row container
- column container
- fixed height
- full viewport height
- grow to fill
- align center
- align right
- gap between children
- padding
- border
- rounded panel
- preview area
- editor area
- last child alignment
- status message area
- action button area
- two panel layout
- three panel layout
- full height workspace
- scrollable panel
- minimum width zero

Supported style concepts:

- system font
- monospace font
- zero margin
- zero padding
- box sizing border box
- light background
- medium background
- dark text
- secondary text
- subtle border
- top border
- blue action
- white text
- small font size
- relaxed line height
- medium font weight
- preserve whitespace
- disable resizing
- auto overflow
- hidden overflow
- focus outline
- hover state
- no list marker

The layout parser and style parser should remain separate. Natural markup text
creates structure. Natural style text creates style rules. The preview renderer
combines both only after validation succeeds.

## Parser Workbench Requirements

An App Lang should include a parser workbench UI.

Workbench areas:

- natural text editor
- natural style editor
- parsed result view
- abstract tree view
- semantic tree view
- style tree view
- preview view
- diagnostics panel
- correction log
- command output panel
- learning statistics panel
- status message area

Workbench actions:

- tag content
- complete text
- build query
- extract entity
- learn correction
- parse layout text
- parse style text
- generate layout abstract tree
- generate style tree
- preview layout
- show status
- show learning statistics
- render command output

The workbench should let users see the same input as raw text, parsed structure,
tree, and preview without changing the canonical input.

The workbench should support side-by-side markup, style, and preview panels.
It should also support a tree-only preview for debugging parser output before a
visual layout is rendered.

## Controlled Language Requirements

An App Lang should support controlled English patterns such as:

- create `<entity>` named `<name>`
- update `<entity>` with `<field>` as `<value>`
- link `<source>` to `<target>` as `<relationship>`
- create application for `<domain>`
- use template `<template>`
- render `<dataset>` as `<layout>`
- validate `<entity>`
- run workflow `<workflow>`
- export `<entity>` as `<format>`
- import `<file>` as `<entity>`

The parser should not pretend to understand arbitrary English. If a sentence is
outside supported patterns, it should produce a finding and ask for clarification
or suggest the closest supported pattern.

## Markdown Definition Requirements

An App Lang should parse definition documents with predictable sections:

- purpose
- inputs
- outputs
- fields
- parameters
- relationships
- validation
- examples
- policies
- templates
- tests
- open decisions

Each section should map to an entity field, relationship, dataset, schema,
policy, contract, or diagnostic.

## Definition Document Contracts

An App Lang should support four definition document contracts.

### Dataset Definition

A dataset definition document should declare:

- purpose
- data source
- query pattern
- parameters
- parameter defaults
- parameter constraints
- output formats
- validation rules
- example inputs
- example outputs
- related cache table
- fallback behavior

Required behavior:

- parameters are validated before use
- empty required parameters produce findings
- source failures produce findings with error catalog links
- output can be normalized into a 1D array when requested

### Datamap Definition

A datamap definition document should declare:

- purpose
- source fields
- target fields
- field mapping rules
- transformation rules
- normalization rules
- cross-map constraints
- example input
- example output

Required behavior:

- every source field is either mapped, ignored with reason, or reported
- every target field has a source or default
- numeric normalization must declare min, max, and clamp behavior
- examples must be testable

### Data Table Definition

A data table definition document should declare:

- purpose
- column names
- column types
- primary key
- example rows
- operations
- capacity policy
- maintenance policy
- related dataset definition
- related datamap definition

Required behavior:

- row shape validates against declared columns
- cache rows include created or fetched timestamp when needed
- expiry policy is explicit
- cleanup behavior is explicit

### Plugin Definition

A plugin definition document should declare:

- classification
- purpose
- startup behavior
- runtime behavior
- fallback behavior
- related definitions
- diagnostics

Supported classifications:

- initiation_plugin
- global_context_plugin

Initiation plugins run during startup to register corpus sources, datamaps, data
tables, and default fallback behavior.

Global context plugins provide shared lookup data during runtime, such as error
catalog entries and warning catalog entries.

## Artifact Plan Requirements

An App Lang should translate natural language, controlled English, and
definition documents into artifact creation plans.

Artifact plans may describe:

- class entity shape
- constructor config
- method signatures
- method contracts
- plugin artifact
- utility artifact
- route artifact
- view artifact
- component artifact
- dataset artifact
- test artifact
- doc artifact

An artifact plan should include:

- id
- requested artifact type
- source request id
- source entity ids
- target path
- fields
- parameters
- relationships
- policies
- contracts
- validation gates
- test expectations
- approval requirement
- audit requirement

An App Lang should never treat raw generated text as approved executable
behavior. It should create a plan, validate the plan, and pass the result to the
artifact creation workflow.

Dynamic execution should produce a blocked finding unless explicit approval and
policy allow it.

## Corpus Requirements

An App Lang must include a corpus system.

The corpus system stores example language, source definitions, expected outputs,
and regression cases.

Corpus types:

- source corpus: external or internal vocabulary sources
- definition corpus: markdown definition documents
- golden sentence corpus: input sentences with expected parsed output
- warning corpus: ambiguous or invalid sentences with expected findings
- domain corpus: domain-specific words, templates, and relationships

The corpus initiation process should:

1. read dataset definition documents
2. read datamap definition documents
3. read data table definition documents
4. read plugin definition documents
5. register corpus sources
6. register mapping rules
7. configure cache tables
8. configure error and warning catalogs
9. verify at least one corpus source exists
10. fall back to a minimal local corpus when loading fails

Fallback requirements:

- if dataset definitions fail, use minimal local vocabulary
- if datamap definitions fail, use identity mapping with findings
- if data table definitions fail, continue without cache and report findings
- if error catalog loading fails, use minimal error catalog
- one failed definition should not prevent other valid definitions from loading

## Lexicon And Cache Requirements

An App Lang should support lexicon lookup as an optional vocabulary expansion
capability.

The lexicon source contract should support:

- query term
- required non-empty validation
- output as structured records
- output as 1D string array
- source error findings
- source timeout findings

The lexicon cache should support:

- query key
- result payload
- fetched timestamp
- expiry timestamp
- cache hit
- cache miss
- stale cleanup
- healthy query list

Default cache policy:

- cache entries expire after 30 days unless a project overrides the policy
- expired rows can be removed by cleanup
- cache should store source results; mapping can happen after read

## Error And Warning Catalog Requirements

An App Lang should maintain a shared catalog for errors and warnings.

Each catalog entry should include:

- code
- level
- message
- gate
- category
- resolution

Required operations:

- lookup by code
- list all codes
- list by category
- get gate by code
- get resolution by code

Fallback behavior:

- unknown codes return a structured unknown-code finding
- missing catalog uses a minimal default catalog
- user or project overrides apply after defaults

## Ambiguity Requirements

The language layer must detect ambiguity.

Examples:

- one sentence matches multiple templates
- one word maps to multiple entity types
- one target name is near multiple approved names
- a relationship target is missing
- a command has no object
- a dataset has no template mapping

Ambiguity should produce structured findings, not silent guesses.

## Near-Match Requirements

The language layer should suggest approved names when input is close to a known
name.

Examples:

- `payrol` suggests `payroll`
- `employe` suggests `employee`
- `blok_editor` suggests `block_editor`

Near matches should be suggestions only. They should not be auto-applied unless
policy allows it.

## Expression Requirements

An App Lang should support safe expressions for validation and transformations.

Allowed expression concepts:

- literals
- arithmetic
- comparison
- boolean logic
- field references
- simple approved operations such as length, round, upper, lower, join,
  fallback

Blocked expression concepts:

- arbitrary evaluation
- filesystem access
- process access
- network access
- dynamic code execution

## Golden Corpus Requirements

An App Lang should maintain a golden corpus of example inputs and expected
structured outputs.

Corpus categories:

- entity creation
- relationship creation
- dataset creation
- template selection
- layout projection
- workflow creation
- business application creation
- RBAC changes
- validation requests
- import and export
- ambiguous inputs
- invalid inputs
- sentence grammar classification
- parts-of-speech tagging
- tense detection
- pronoun resolution
- semantic role mapping
- non-literal language
- language exceptions

Source-inspired baseline categories:

- data import and export sentences
- browser or UI action sentences
- analytics sentences
- control-flow sentences
- assignment sentences
- labeled-step sentences
- named-argument sentences

Minimum corpus size:

- V1 should include at least 40 golden sentences.
- At least 10 sentences should be invalid or ambiguous cases.
- Corpus count must be calculated from the corpus file during tests.
- Comments or headers that claim a sentence count are not trusted unless tests
  verify the count.

Expected corpus item fields:

- id
- category
- input_text
- expected_intent
- expected_slots
- expected_entities
- expected_relationships
- expected_change_plan
- expected_findings
- status

Required corpus examples:

- read tabular data from a path
- load structured data from a URL
- filter records by condition
- sort records by field
- group records and compute aggregate
- join records on key
- remove duplicate rows
- write data to a target
- navigate to a page
- fill an input
- click an action
- wait for a condition
- compute a metric
- summarize data by dimension
- branch on a condition
- run actions in parallel
- run a named workflow
- wait for duration
- wait until time
- set state value
- repeat action
- try action and handle failure
- switch by state
- call named operation with arguments
- create application part
- link entities
- render dataset as layout
- classify assertion sentence
- classify query sentence
- classify command sentence
- classify conditional sentence
- classify negation sentence
- classify comparison sentence
- classify definition sentence
- classify greeting and farewell
- classify confirmation and rejection
- parse compound sentence into ordered child sentences
- tag parts of speech in a sentence
- detect future simple tense
- resolve pronoun to prior phrase
- map agent and patient roles
- detect idiom as non-literal language
- expand contraction before parsing
- handle irregular verb form
- handle compound word as one unit

Every parser update should run against the golden corpus.

## Validation Requirements

An App Lang should validate:

- input is text or supported document/data
- parsed intent is approved
- extracted operation is approved
- extracted entity type is approved
- extracted relationship type is approved
- extracted layout name is approved
- extracted template name is approved
- extracted dataset name is approved or proposed
- output change plan is valid
- ambiguity is reported
- unknown words are reported
- near matches are reported
- approved datasets are 1D arrays of unique strings
- declared dataset counts match actual data counts
- data table rows have declared columns
- data maps use approved source and target names
- host target behavior matches golden corpus expectations
- sentence type resolves to one approved intent or emits ambiguity
- pronoun references resolve or produce findings
- non-literal language is flagged before action planning
- irregular forms normalize through approved datasets

## Test Requirements

Required tests:

- text normalization tests
- sentence segmentation tests
- token classification tests
- template matching tests
- slot extraction tests
- sentence validation tests
- sentence translation tests
- near-match tests
- ambiguity tests
- definition document parsing tests
- expression validation tests
- golden corpus tests
- corpus initiation tests
- corpus count tests
- lexicon lookup tests
- lexicon cache tests
- datamap parsing tests
- data table parsing tests
- plugin classification tests
- error catalog tests
- warning catalog tests
- entity change plan validation tests
- command surface tests
- piped input tests
- configuration override tests
- learning store tests
- learning statistics tests
- confidence threshold tests
- query render target tests
- layout workbench preview tests
- structure policy tests
- dataset count validation tests
- ordered template priority tests
- preposition slot mapping tests
- host target consistency tests
- locked corpus metadata tests
- sentence type classification tests
- parts-of-speech tagging tests
- tense detection tests
- pronoun resolution tests
- semantic role mapping tests
- non-literal language tests
- language exception tests
- overlapping extraction tests
- query history tests

Performance expectations for V1:

- content tagging should stay fast for long notes
- autocomplete should stay fast per keystroke
- query planning should return quickly enough for interactive use
- memory use should stay bounded by configured corpus and cache limits
- general sentence tagging should stay fast enough for interactive review

## Integration Requirements

An App Lang must integrate with:

- entity_validator
- action_entity
- entity_registry
- entity_reasoner
- dataset registry
- template registry
- relationship registry
- layout projection system
- diagnostics system
- audit log
- command surface
- parser workbench
- learning store
- configuration profile loader
- event log
- metrics log
- host target adapters
- structure policy checker

Integration rules:

- all mutations pass through validation first
- parser events should be traceable by request id
- profile loading and corpus loading should emit diagnostics
- accepted corrections should create audit entries
- rejected corrections should remain available for review
- parser host adapters should not change parse results

## Non-Goals

An App Lang should not:

- be a general chatbot
- guess silently
- replace the entity validator
- execute unsafe expressions
- mutate entities before validation
- invent approved vocabulary automatically
- copy old project names or old folder structures

## Completeness Against Source Reference

Covered from the reference:

- controlled natural language pipeline
- template matching
- slot extraction
- sentence validation
- sentence translation
- docs as definitions
- dataset definition documents
- datamap definition documents
- data table definition documents
- plugin definition documents
- initiation plugin classification
- global context plugin classification
- corpus initiation
- lexicon lookup
- lexicon cache
- error catalog
- near-match suggestions
- ambiguity reporting
- golden sentence corpus
- corpus count validation
- safe expression requirements
- command surface with direct and piped input
- configuration profiles with defaults and overrides
- learning stores for dictionary, corrections, feedback, and statistics
- confidence thresholds and ranked candidates
- prefix-index autocomplete behavior
- query render targets for registry, dataset, document, filesystem, database,
  search index, and URL
- natural markup plus natural style parsing
- semantic tree, style tree, rendered preview, status message, and command
  output workbench areas
- source layout concepts such as full viewport height, fixed header/footer,
  last-child alignment, textarea editor, preview area, focus state, overflow,
  and box sizing
- event, metric, diagnostic, and audit expectations
- structure policy for datasets, data maps, data tables, and definition docs
- calculated dataset counts and load-time count validation
- ordered template matching with fallback warnings
- preposition-based slot extraction
- multi-host behavior consistency
- locked sentence corpuses with metadata and lifecycle policy
- sentence intent and sentence structure classifications
- full English grammar pipeline
- parts of speech, tense, pronoun, semantic role, non-literal, and exception
  handling
- sentence summary output, query history, and deterministic overlap handling
- sentence completion and incomplete sentence detection through language domain
  providers
- sentence similarity and sentence diff for correction, continuation, and
  learning workflows
- typed template learning as reviewed language-domain records
- generic routing to An Memory for knowledge gaps, proof traces, provenance,
  and durable learning records
- generic routing to An Bot for conversation boundaries, task context, and
  scheduled task chat behavior

Source items intentionally changed:

- old project and folder names are replaced with An App naming
- mixed-case vocabulary is replaced by approved naming policy
- broken or aspirational tests are treated as requirements, not trusted tests
- hardcoded shape-heavy examples are converted into dataset, data map, data
  table, and definition-document requirements
- extreme zero-object rules are not adopted as policy for An App entities
- shell-specific query output is replaced by structured query plans plus
  approved render targets
- host-specific export wrappers are treated as adapters, not separate language
  behavior

Known source issue captured as a requirement:

- the reference golden corpus comment claims 29 sentences, but the listed
  sentence arrays contain more. An App Lang must calculate corpus counts from
  data during tests and fail on mismatched declared counts.

## Minimum Complete V1

Minimum V1 should support:

- parse one controlled English sentence
- load a minimal local corpus
- run corpus initiation
- detect intent
- extract core slots
- validate names against approved datasets
- suggest near matches
- report ambiguity
- translate into a structured entity change plan
- parse a simple markdown definition document
- run golden corpus tests
- verify golden corpus counts from data
- parse one dataset definition document
- parse one datamap definition document
- parse one data table definition document
- classify one initiation plugin
- classify one global context plugin
- run one command surface request
- accept one piped document input
- load default configuration profiles
- apply one project override
- store one correction in the learning queue
- produce one learning statistics summary
- enforce one confidence threshold
- render one query plan to an approved target
- parse one natural markup document
- parse one natural style document
- generate one semantic tree and one style tree
- render one parser preview state
- look up one error catalog entry
- integrate with entity_validator
- classify one input data shape
- verify one dataset count at load time
- run one ordered template priority case
- extract one preposition slot
- confirm one host target adapter returns the same parse result
- load one locked grammar corpus
- classify one sentence intent type
- classify one sentence structure type
- tag parts of speech for one sentence
- detect one tense
- resolve one pronoun
- map one semantic role
- flag one non-literal expression
- normalize one irregular or contracted form
- parse one compound sentence into child intents
- resolve one overlapping extraction case
- call one sentence completion provider
- call one incomplete sentence detector
- call one sentence similarity provider
- create one pending typed template learning record

## Open Decisions

- exact grammar template format
- exact slot extraction table format
- exact warning code dataset
- exact golden corpus file format
- exact corpus item schema
- exact corpus cache storage format
- exact dataset definition document schema
- exact datamap definition document schema
- exact data table definition document schema
- exact plugin definition document schema
- exact error catalog schema
- exact expected-count storage format
- exact host target package format
- exact locked corpus row parser format
- exact part-of-speech tag schema
- exact tense result schema
- exact pronoun resolution schema
- exact non-literal finding schema
- whether markdown docs become entities directly or produce change plans first
- whether user approval is required for every proposed new name
- how much free-form English is allowed before asking for clarification
