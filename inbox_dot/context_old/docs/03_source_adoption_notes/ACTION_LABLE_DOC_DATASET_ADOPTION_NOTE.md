# Action Lable Doc Dataset Adoption Note

## Scope

Reviewed selected documentation and dataset-style files from
`input_temp/b6/actionLable`.

This pass focused on conversation labeling, knowledge tree structure, label
rules, dependency mapping, export shapes, and test expectations.

## Files Reviewed

- `input_temp/b6/actionLable/actionLable_project_doc_v1.0.0_active_0dot1.txt`
- `input_temp/b6/actionLable/actionLable_project_knowledge_tree_v1_active_codex.md`
- `input_temp/b6/actionLable/definitions/dataList_actionlable_activities_v1_0_0_draft_Gem.js`
- `input_temp/b6/actionLable/definitions/dataTree_actionlable_flow_v1_0_0_draft_Gem.js`

## What This Folder Is About

This folder is about turning long conversations into structured knowledge.

In simple English:

- paste or load a conversation
- split it into turns, paragraphs, sentences, and code blocks
- apply label rules
- assign confidence scores
- map relationships between labeled nodes
- show the result in a browser
- export the result as JSON or Markdown

This is directly useful for An Memory, An Bot, and An App Lang.

## Adopted Concepts

### Conversation Node Model

Required node levels:

- conversation
- turn
- paragraph
- sentence
- code block

Required node fields:

- id
- type
- preview content
- full content
- labels
- confidence
- extracted entities
- parent id
- child ids

Adoption target:

- `AN_MEMORY_SCOPE_REQUIREMENTS.md`
- `AN_BOT_SCOPE_REQUIREMENTS.md`

### Label Taxonomy

A label taxonomy should support:

- label name
- scope
- rule list
- child labels
- lineage path
- confidence

Useful label scopes:

- file
- paragraph
- sentence
- word

Adoption target:

- dataset files
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

### Label Rule Shape

Required rule fields:

- keywords
- patterns
- minimum match count
- base confidence
- scope
- label path

Rule behavior:

- count matched keywords and patterns
- apply label when match count reaches the configured threshold
- adjust confidence by node type and content length
- keep output deterministic for the same input and config

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

### Dependency Mapping

Dependency mapping should detect:

- shared label
- shared entity
- direct mention
- related project context
- learning sequence hint

Required dependency fields:

- from node
- to node
- dependency type
- confidence
- evidence

Adoption target:

- `AN_MEMORY_SCOPE_REQUIREMENTS.md`
- relationship datasets

### Conversation Knowledge Pipeline

Pipeline stages:

- ingest
- parse
- label
- map dependencies
- summarize
- export

Adoption target:

- `APPLICATION_ENTITY_DOCTRINE.md`
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

### Export Contract

Required export targets:

- JSON
- Markdown

Export should include:

- input metadata
- parsed nodes
- labels
- dependency links
- summary
- confidence metrics

Adoption target:

- `AN_MEMORY_SCOPE_REQUIREMENTS.md`
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

### Test And Benchmark Expectations

Required checks:

- label coverage target
- deterministic dependency output
- export parse validity
- browser flow check
- sample config comparison
- latency threshold for typical pasted conversations

Adoption target:

- `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

## Dataset Additions Needed

Add or extend 1D arrays for:

- conversation node type names
- label scope names
- label field names
- label rule field names
- dependency signal names
- conversation pipeline stage names
- export artifact field names
- label confidence band names
- conversation benchmark metric names

## Documentation Updates Needed

1. `AN_MEMORY_SCOPE_REQUIREMENTS.md`
   - Add conversation-to-knowledge pipeline.
   - Add label taxonomy.
   - Add dependency map contract.
   - Add export artifact contract.

2. `AN_BOT_SCOPE_REQUIREMENTS.md`
   - Add conversation labeling for session review and task continuity.

3. `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
   - Add label rule matching as a parse enrichment step.

4. `APPLICATION_ENTITY_DOCTRINE.md`
   - Add conversation node, label, label rule, and dependency map as entity
     types.

## Decision

Adopt the conversation labeling and knowledge organization concepts. Do not
adopt old names as canonical names. This folder should inform label datasets,
conversation memory, dependency mapping, and export contracts.
