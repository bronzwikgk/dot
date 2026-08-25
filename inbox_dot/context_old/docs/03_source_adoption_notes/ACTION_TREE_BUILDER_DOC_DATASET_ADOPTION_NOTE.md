# Action Tree Builder Doc Dataset Adoption Note

## Scope

Reviewed documentation and dataset-facing notes from
`input_temp/b6/actionTreeBuilder`.

This pass focused on multi-file tree building, format detection, common tree
normalization, provenance, relationships, output views, and session logs.

## Files Reviewed

- `input_temp/b6/actionTreeBuilder/docs_actiontreebuilder/manifest_ActionTreeBuilder_v1_draft.md`
- `input_temp/b6/actionTreeBuilder/input/1.txt`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_01.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_02.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_03.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_04.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_05.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_06.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_07.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_08.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_09.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_10.md`
- `input_temp/b6/actionTreeBuilder/logs_actionTreeBuilder/session_2026-03-07_11.md`

## What This Folder Is About

This folder is about building one normalized project tree from many files.

In simple English:

- accept files or folders
- detect each file format
- parse each file into its own tree
- normalize every native tree into one common shape
- place all trees under a virtual root
- find duplicates, references, similarities, and conflicts
- keep provenance for every node
- export the result in useful views

This is directly useful for An App Lang, An Memory, and the manual adoption
work we are doing now.

## Adopted Concepts

### Supported Input Scope

Required input modes:

- single file
- multiple files
- folder
- empty input placeholder

Required file formats:

- markdown
- text
- yaml
- mixed format

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- dataset files

### Format Detection

Detection should use:

- extension
- content signals
- confidence score
- fallback mode

Required confidence bands:

- high
- medium
- low

Required handling modes:

- strict
- lenient
- interactive
- fallback

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

### Common Tree Node

Required node fields:

- id
- type
- value
- child nodes
- metadata
- optional formatting

Required metadata fields:

- source format
- line number
- column
- depth
- file path
- source hash
- timestamp

Optional formatting fields:

- indent
- bullet marker
- header level
- style
- delimiter
- comment list

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

### Consolidated Project Tree

Required consolidated tree fields:

- virtual root
- source list
- normalized node list
- relationship graph
- duplicate index
- conflict index
- query index

Adoption target:

- `APPLICATION_ENTITY_DOCTRINE.md`
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

### Relationship Analysis

Relationship types to support:

- exact duplicate
- near duplicate
- structural duplicate
- explicit file reference
- link reference
- section reference
- implicit reference
- topic similarity
- temporal supersession
- structural relationship
- version conflict
- contradiction
- format conflict

Adoption target:

- relationship datasets
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

### Output Views

Required output views:

- raw tree
- normalized tree
- flat list
- graph
- chunks
- query response

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- UI datasets

### Error And Recovery Modes

Required error categories:

- unreadable file
- missing file
- zero byte file
- syntax error
- encoding error
- size limit
- unknown format
- malformed tree

Required recovery options:

- abort
- skip section
- repair
- truncate
- stream
- preserve placeholder

Adoption target:

- `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

### Session Log Pattern

Session logs showed a useful documentation discipline:

- session id
- session date
- project name
- changes
- notes

Adoption target:

- `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`

## Dataset Additions Needed

Add or extend 1D arrays for:

- input mode names
- file format names
- format signal names
- detection confidence band names
- detection handling mode names
- common tree node field names
- source metadata field names
- formatting field names
- consolidated tree field names
- relationship analysis type names
- output view names
- tree error category names
- recovery option names
- session log field names

## Documentation Updates Needed

1. `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
   - Add multi-file tree builder requirements.
   - Add format detection confidence model.
   - Add common tree node schema.
   - Add recovery modes.

2. `AN_MEMORY_SCOPE_REQUIREMENTS.md`
   - Add provenance fields.
   - Add consolidated tree memory.
   - Add duplicate/reference/conflict relationship tracking.

3. `APPLICATION_ENTITY_DOCTRINE.md`
   - Add consolidated project tree as an entity type.
   - Add output views as projections over the same canonical tree.

4. `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`
   - Add session log minimum fields.
   - Add tree ingestion recovery guidance.

## Decision

Adopt the multi-file tree builder concept. It should become the reference for
project-level document ingestion, normalized tree shape, provenance, relationship
analysis, and output views.
