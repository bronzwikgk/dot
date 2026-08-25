# Action NLP Doc Dataset Adoption Note

## Scope

Reviewed selected documentation and dataset-facing files from
`input_temp/b7/actionNLP`.

Large training JSON exports were listed as dataset evidence but not deeply read
in this pass. This pass focused on docs, specifications, seed packets, type
registry material, and policy ingestion examples.

## Files Reviewed

- `input_temp/b7/actionNLP/ActionNLP.txt`
- `input_temp/b7/actionNLP/docs/actionNLP_seed_knowledge_packet_v1_2026-03-30.md`
- `input_temp/b7/actionNLP/docs/master_feature_index_nlu_v1.md`
- `input_temp/b7/actionNLP/docs/types_registry_metadata_specification.md`
- `input_temp/b7/actionNLP/docs/gap_analysis_shunya_capabilities.txt`
- `input_temp/b7/actionNLP/docs/linguistic_specification_complete_v2.md`
- `input_temp/b7/actionNLP/docs/policy_ingestion_simulation.md`

## What This Folder Is About

This folder defines a deterministic language processing system. In simple
English, it says:

- the system must start with approved seed knowledge
- raw text should become typed nodes
- typed nodes should become a tree
- the tree should be validated
- useful facts, rules, templates, and relationships should be promoted into
  approved datasets
- learned knowledge must be versioned, validated, and governed

The strongest idea is boot-time seed knowledge. The system should not start
blank. It should start with known types, words, grammar rules, patterns,
templates, facts, policies, and validation gates.

## Adopted Concepts

### Seed Knowledge Packet

Required groups:

- type system
- lexicon
- grammar rules
- pattern library
- response templates
- seed facts
- seed policies
- validation gates
- optional synonym sets
- optional weighted word sets

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`
- dataset files

### Type Registry

Required registry behavior:

- every type has an approved name
- every type has a description
- every type belongs to a category
- every type can be validated
- type changes are versioned
- type use can be searched
- type hierarchy can be rendered

Adoption target:

- `APPLICATION_ENTITY_DOCTRINE.md`
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- dataset files

### Linguistic Hierarchy

Required hierarchy:

- document
- paragraph
- chained paragraph
- sentence
- chained sentence
- clause
- phrase
- token

Required sentence attributes:

- id
- type
- clause count
- structure
- tokens
- part-of-speech tags
- dependency links
- tense
- voice
- mood
- polarity

Adoption target:

- `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

### Shared Pipeline

Recommended shared stages:

- ingest
- detect mode
- parse
- normalize to entities
- link relations
- apply rules
- validate
- compile or execute
- render or export
- audit and feedback

Adoption target:

- `APPLICATION_ENTITY_DOCTRINE.md`
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

### Policy Ingestion

Required node outputs:

- metadata field node
- policy rule node
- example node
- checklist item node
- document control node

Required trace fields:

- file id
- path
- size
- encoding
- adapter
- raw text
- node id
- node type
- granularity
- line range
- metadata

Adoption target:

- `AN_MEMORY_SCOPE_REQUIREMENTS.md`
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

### Capability Gap Model

Required gap fields:

- gap id
- missing capability
- impact
- current state
- desired state
- priority
- recommended implementation note
- files or docs to create

Adoption target:

- `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`
- `SOURCE_ADOPTION_INDEX_AND_VALIDATION_LOG.md`

## Dataset Additions Needed

Add 1D arrays for:

- seed knowledge group names
- type registry category names
- linguistic hierarchy node names
- sentence attribute names
- grammar metadata names
- pipeline stage names
- policy node type names
- trace field names
- capability gap field names
- quality gate names
- fallback template names

## Documentation Updates Needed

1. Add a seed knowledge section to `AN_APP_LANG_SCOPE_REQUIREMENTS.md`.
2. Add exact English hierarchy and sentence attribute requirements to
   `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`.
3. Add type registry governance to `APPLICATION_ENTITY_DOCTRINE.md`.
4. Add policy ingestion trace requirements to `AN_MEMORY_SCOPE_REQUIREMENTS.md`.
5. Add gap model guidance to `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`.

## Decision

Adopt the concepts, not the old names. This folder should become the reference
for An App Lang boot knowledge, type governance, deterministic language parsing,
and policy ingestion traceability.
