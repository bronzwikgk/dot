# Code Shared An App Brain v1.4.0 Draft

## What It Is

`an_app_brain` is an An App subdomain for coordinating language, memory,
reasoning, resolution, decision records, response composition, scoring,
learning, context, recursion limits, and boundary checks.

It is not a separate app and not a duplicate parser, memory system, bot,
runner, or plugin. It should reuse existing `dot` utilities and plugins first.

## Source Learning

- `proposal/an_brain_domain_proposal.md`
- `input_temp/knowledge_trees/an_brain.tree.json`
- `input_temp/knowledge_tree_schema.json`
- `input_temp/an_brain/An_brain_3.md`
- `github_dump/dump/inbox_AnGitAgent_inbox`

## Domain Scope

The v1.4 source proposes a 13-part cognitive pipeline. In approved An App
language, this becomes:

1. ingestion
2. decomposition
3. parsing
4. knowledge_base
5. reasoning
6. resolution
7. composition
8. learning
9. understanding
10. validation
11. recursion
12. multi_session
13. boundary

These are subdomain responsibilities. They should map to existing canonical
pipeline stages wherever possible:

`ingest -> decompose -> parse -> classify -> validate -> reason -> resolve -> plan -> execute -> compose -> display -> persist -> audit -> respond`

## Required Entity Records

- brain_session
- context_record
- ingestion_record
- decomposition_record
- parsing_record
- knowledge_base_record
- knowledge_fact
- knowledge_formula
- knowledge_provenance
- reasoning_trace
- resolution_record
- understanding_record
- composition_record
- validation_report
- recursion_trace
- boundary_record
- score_record
- failure_record
- pattern_record
- improvement_proposal
- evidence_record

## Context Layers

`context_record` should support seven layers:

- system
- organization
- project
- domain
- session
- conversation
- entity

Each layer must declare source, freshness, confidence, and override policy.

## Reasoning Types

`reasoning_trace` should support:

- deductive
- inductive
- abductive
- analogical
- causal

Every reasoning result must record evidence refs, assumptions, confidence, and
known limits.

## Resolution Types

`resolution_record` should support:

- coreference
- deictic
- temporal
- entity_ref
- route_ref
- provider_ref
- placeholder

Temporal resolution must use an explicit date/time context. For example, a
relative word like yesterday must resolve through the active session context.

## Boundary Policy

An App Brain must not pretend to know what it does not know.

Boundary checks must cover:

- missing evidence
- ambiguous reference
- stale context
- low confidence
- conflicting memory
- unsafe action
- recursion limit reached
- approval required

When a boundary check fails, the output should be a clarification, blocked
result, or explicit assumption, not an executable action.

## Recursion Policy

Recursive reasoning or decomposition must have:

- max depth
- max node count
- cycle detection
- repeated-state detection
- timeout
- audit trail
- stop reason

## Controlled Operations

The following operation words are allowed only with exact contracts:

- optimize
- optimise
- evolve
- mutate

Each use must define input, output, validation, seed policy when relevant,
rollback, and audit.

## Existing Code To Reuse

- `code/utilities/code_shared_entity_parser_v3_0_0_draft.js`
- `code/utilities/code_shared_entity_validator_v3_0_0_draft.js`
- `code/utilities/code_shared_entity_reasoner_v3_0_0_draft.js`
- `code/utilities/code_shared_entity_registry_v3_0_0_draft.js`
- `code/utilities/code_shared_collection_v3_0_0_draft.js`
- `code/utilities/code_shared_vector_math_v3_0_0_draft.js`
- `code/utilities/code_shared_markdown_pipeline_v3_0_0_draft.js`
- `code/plugins/code_shared_runner_v3_0_0_draft.js`
- `code/plugins/code_shared_validator_v3_0_0_draft.js`
- `code/plugins/code_shared_action_entity_v3_1_0_draft.js`

## Development Boundary

Do not create a new `an_app_brain` plugin until:

- vocabulary is reconciled
- record schemas are defined
- validation utility coverage exists
- language and memory boundaries are clear
- tests and seed samples exist
- user approves the implementation batch

## How To Test Later

Minimum tests:

- parse a simple request into records
- resolve a relative reference through context
- produce a reasoning trace with evidence
- block an ambiguous request
- stop recursive decomposition at configured limits
- create an improvement proposal without applying it
- audit input through response

## Known Limits

This is a subdomain scope document, not an implementation. It authorizes the
approved name `an_app_brain` and the coordination boundary only.
