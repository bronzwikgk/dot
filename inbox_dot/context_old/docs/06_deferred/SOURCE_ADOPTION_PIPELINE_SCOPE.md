# Source Adoption Pipeline Scope

Status: deferred design. This document is retained as future architecture and
trial evidence, while current source learning is handled by manual review,
concept cataloging, schema cataloging, and domain-owned docs.

## Purpose

The Source Adoption Pipeline is a governed subsystem for learning from many
source folders without copying old names, stale structure, or unsafe behavior.

Its job is to ingest source material, convert source and target documents into
comparable trees, extract concepts, compare them with current An App knowledge,
recommend adoption decisions, apply approved changes, validate the result, and
write an audit trail.

The user remains the reviewer. The pipeline prepares evidence and
recommendations; it does not silently rewrite the system.

## Target Folder

This work should live in its own isolated folder:

```text
scratchpad_entity_system/code/source_adoption_pipeline
```

Suggested structure:

```text
scratchpad_entity_system/code/source_adoption_pipeline
  source_inventory.js
  document_tree.js
  concept_extractor.js
  concept_matcher.js
  ownership_classifier.js
  coverage_evaluator.js
  recommendation_writer.js
  adoption_applier.js
  adoption_auditor.js
  adoption_pipeline_runner.js
  sample_data
  logs
```

Tests should live here:

```text
scratchpad_entity_system/test/source_adoption_pipeline.test.mjs
```

Generated or sample reports should live here:

```text
scratchpad_entity_system/code/source_adoption_pipeline/logs
```

## Source Concepts Adopted From External Projects

The pipeline should learn concepts from these external project families without
copying their product shape:

- Markdown AST tooling: parse documents into stable tree nodes and serialize
  approved changes back to markdown.
- Markdown semantic comparison tools: compare blocks and tree nodes before
  comparing raw text.
- Entity resolution tools: detect duplicate or near-duplicate concepts across
  sources.
- Ontology alignment tools: map equivalent, broader, narrower, and related
  concepts across different vocabularies.
- Knowledge graph tools: store concept nodes, relationship edges, evidence,
  confidence, and source references.
- Semantic merge tools: compare structure, detect moved or renamed ideas, and
  validate after merge.
- Git conflict review practice: every conflict is an explicit review point with
  keep, accept, merge, split, defer, or reject decisions.

## Existing Code To Reuse

From the scratchpad:

- `entity_runner`: use as the governed stage runner.
- `entity_validator`: use for names, relationships, approved values,
  near-duplicate checks, and banned-word checks.
- `action_entity`: use for storing source files, concepts, recommendations,
  validation results, and audit records as entities.
- `markdown_pipeline`: use for V1 markdown decomposition and composition.
- `entity_parser`: reuse simple token extraction ideas for concept scanning.
- `entity_reasoner`: reuse score-based decision support.
- `app_generator`: reuse plan-first artifact creation style.
- validation datasets: reuse approved status, relationship, memory, language,
  and source adoption vocabulary.

From `dot`:

- text utility concepts: tokenization, spacing normalization, and safe text
  escaping.
- logger concept: append-only run logs.
- stats concept: counts and metrics for runs.
- validator concept: input and output validation.
- runner concept: stage registration and ordered flow execution.
- test generation concept: generated smoke tests as a secondary check.

## Core Data Shapes

### Source Folder Record

- id
- path
- source batch id
- file count
- readable count
- skipped count
- hash summary
- inventory status

### Source File Record

- id
- folder id
- relative path
- file type
- size
- last modified timestamp
- content hash
- parse strategy
- readable status
- diagnostics

### Document Tree

- id
- source file id
- root node id
- node count
- heading count
- list count
- table count
- code block count
- diagnostics

### Tree Node

- id
- document tree id
- parent id
- node kind
- position
- heading path
- raw text
- normalized text
- tokens
- extracted names
- extracted relationships
- confidence

### Concept Record

- id
- source file id
- source node ids
- label
- normalized meaning
- concept type
- candidate owner
- evidence text
- related concept ids
- confidence

### Match Record

- id
- incoming concept id
- target doc node id
- match category
- match score
- match reasons
- overlap tokens
- missing details
- conflict details

### Recommendation Record

- id
- concept id
- owner doc
- secondary docs
- recommended action
- reason
- risk
- proposed summary
- approval status
- reviewer note

### Adoption Record

- id
- recommendation id
- target doc
- update kind
- before hash
- after hash
- status
- diagnostics

### Validation Record

- id
- adoption run id
- check name
- status
- expected count
- actual count
- findings

### Audit Record

- id
- run id
- timestamp
- source folders
- counts
- recommendations
- approvals
- changed files
- validation results
- unresolved risks
- next actions

## Core Flows

### 1. Inventory Flow

Reads source folders and creates indexed source folder and file records.

Checks:

- every file gets an id
- counts match disk inventory
- unsupported files are recorded, not ignored silently
- content hashes are stored for repeatable comparison

### 2. Document Tree Flow

Converts incoming sources and current docs into comparable trees.

V1 parse targets:

- markdown
- plain text
- JSON
- JavaScript
- HTML

V1 node kinds:

- document
- heading
- paragraph
- list item
- table row
- code block
- metadata
- comment
- key value

### 3. Concept Extraction Flow

Extracts concepts from tree nodes.

Signals:

- headings
- repeated nouns or phrases
- bullet groups
- table rows
- explicit requirement language
- relationship phrases
- status words
- test names
- policy words
- source evidence

Output is a concept list with evidence and confidence.

### 4. Existing Knowledge Tree Flow

Converts current scratchpad docs into trees and concept records.

Target docs:

- application doctrine
- An App Lang requirements
- English Language domain requirements
- An Bot requirements
- An Memory requirements
- policy and conventions
- source adoption log
- validation datasets
- UI datasets

### 5. Similarity And Matching Flow

Compares incoming concepts to current concepts.

Match layers:

- exact approved name
- normalized phrase
- token overlap
- near-name distance
- heading path similarity
- relationship similarity
- owner similarity
- optional semantic provider

Output match categories:

- exact_duplicate
- near_duplicate
- broader_than_existing
- narrower_than_existing
- related
- conflicting_definition
- conflicting_owner
- unrelated
- no_match

### 6. Conflict Management Flow

Finds and classifies merge risks.

Conflict types:

- duplicate concept
- competing owner
- competing definition
- competing relationship
- stale source
- unsafe behavior
- missing evidence
- low confidence
- partial overlap

Allowed decisions:

- keep_existing
- accept_source
- accept_both
- merge
- split
- link_as_related
- defer
- reject
- ask_review

Survivorship rules:

- approved current docs win over old source unless evidence is stronger.
- source names are evidence only unless approved as canonical names.
- safety policy wins over convenience.
- primary owner must be one doc.
- secondary docs may reference but should not redefine.
- implementation tasks go to backlog, not requirement sections.

### 7. Ownership Classification Flow

Routes each concept.

Routing:

- application-wide architecture goes to application doctrine
- generic language parsing goes to An App Lang
- English grammar goes to English Language domain
- chat, sessions, and tool routing go to An Bot
- memory, proof, provenance, gaps, and conflicts go to An Memory
- placement process goes to policy
- source trace goes to source adoption log
- approved word groups go to validation datasets
- interface names go to UI datasets

### 8. Coverage Evaluation Flow

Classifies each concept as:

- covered
- partial
- missing
- deferred
- rejected
- reference_only

Every partial, missing, deferred, or rejected item needs a reason.

### 9. Recommendation Flow

Creates a human-review report.

No files are changed by this flow.

Recommendation items should include:

- concept id
- matched current nodes
- recommended owner
- decision options
- evidence
- risk
- suggested next action
- confidence

### 10. Adoption Flow

Applies only approved recommendations.

Rules:

- update the primary owner doc
- add secondary references only when needed
- update datasets only for approved word groups
- keep source ids in the adoption log
- do not copy old names as canonical names
- do not create executable behavior directly
- create backlog entries for implementation

### 11. Validation Flow

Checks the adoption.

Required checks:

- source inventory count equals file rows
- every source file has an id
- every concept has an owner or rejection reason
- every adopted concept appears in a target doc
- every dataset addition is unique
- no banned vocabulary outside the allowed dataset
- no duplicate primary owner definitions
- every conflict has a decision
- every applied recommendation has an audit record
- tests pass

### 12. Audit Flow

Writes final audit output.

Audit output:

- run id
- timestamp
- source folders
- source file count
- tree node count
- concept count
- match count
- conflict count
- recommendation count
- approved count
- applied count
- validation summary
- unresolved risks
- next actions

## V1 Implementation Scope

V1 should be intentionally small and useful.

Build:

- source inventory class
- simple document tree class
- markdown and text parser adapters
- JSON parser adapter
- JavaScript comment and export scanner
- HTML heading and text scanner
- concept extractor
- concept matcher
- owner classifier
- coverage evaluator
- recommendation report writer
- audit report writer
- source adoption runner
- test sample folder
- tests for b0, b1, b2, b3 sample inputs
- tests against current scratchpad docs

Do not build in V1:

- automatic large rewrites
- direct runtime execution
- provider-based semantic matching
- complex UI
- external database storage
- automatic approval

## Test Scope

Tests should use:

- sample input files created under the isolated folder
- current source folders `input_temp/b0` through `input_temp/b3`
- current scratchpad docs
- current validation datasets

Minimum tests:

- inventories all files in a sample folder
- assigns stable ids
- parses markdown headings and bullets
- parses JSON transcript titles and messages
- parses JavaScript comments and exported class names
- parses HTML headings
- extracts concepts with evidence
- matches duplicate and near-duplicate concepts
- classifies owners using placement policy
- detects conflicting owners
- produces recommendation rows
- produces validation rows
- writes audit summary
- rejects banned vocabulary in generated docs
- confirms source file count equals index rows

## Foreseeable Issues

### Large Source Folders

Large source folders can create too many tree nodes.

Mitigation:

- parse by file type
- hash files
- process incrementally
- summarize large sections
- keep low-confidence nodes in review

### Same Concept, Different Words

Two sources may describe the same concept differently.

Mitigation:

- use token overlap, near-name checks, heading path, relationships, and owner
  rules together
- create candidate duplicate records
- require review for low-confidence merges

### Same Words, Different Concept

Two items may share words but mean different things.

Mitigation:

- compare surrounding tree branch
- compare owner category
- compare relationships
- compare expected output shape

### Owner Boundary Drift

One concept may touch many docs.

Mitigation:

- require one primary owner
- allow secondary references
- reject duplicate definitions

### Source Name Pollution

Old project names may leak into canonical docs.

Mitigation:

- source names stay in evidence and logs only
- canonical names come from approved datasets
- near-duplicate checks run before adoption

### Over-Adoption

The system may recommend adopting too much.

Mitigation:

- require decision status
- default uncertain items to review or defer
- never apply without approval

### Under-Adoption

The system may miss subtle ideas.

Mitigation:

- report large unmatched sections
- report low-confidence concepts
- show coverage counts

### Unsafe Generated Artifacts

Some source files describe generated executable behavior.

Mitigation:

- plan-first artifact creation
- execution blocked by default
- validation, tests, approval, and audit required

### Report Drift

Report counts may not match inventory.

Mitigation:

- indexable ids and counts are required
- validation compares inventory, concept, recommendation, and audit counts

## Recommended Build Order

1. Build inventory and id system.
2. Build document tree parser adapters.
3. Build current-doc tree loading.
4. Build concept extraction.
5. Build owner classification.
6. Build matching and conflict classification.
7. Build recommendation report.
8. Build audit report.
9. Add tests with sample inputs and current docs.
10. Add adoption applier only after evaluator reports are trustworthy.

## Success Criteria

- A run over `input_temp/b0` through `input_temp/b3` produces a report with
  one indexed row per source file.
- Every extracted concept has evidence.
- Every recommendation has an owner and a next action.
- Every conflict has a category and decision options.
- Validation detects count mismatches.
- Validation detects missing owners.
- Validation detects banned vocabulary outside the approved dataset.
- Tests pass using sample inputs and current scratchpad docs.
- No source concept is adopted without an approval status.
