# An Memory Scope And Requirements

## Purpose

An Memory is the knowledge memory and learning-governance module inside An App.

Its job is to store, recall, validate, explain, revise, consolidate, and retire
knowledge used by An App, An App Lang, An Bot, domains, plugins, utilities, and
templates.

An Memory is not the chat module. An Bot talks with the user. An Memory manages
what the system knows, how strongly it knows it, where it learned it, and when
that knowledge must be reviewed.

## Position In An App

Flow:

```text
observation, document, user correction, parser output, or tool result
-> an_memory
-> normalize knowledge unit
-> validate source and shape
-> compare with existing knowledge
-> assign confidence and provenance
-> store, review, reject, or expire
-> expose recall and proof trace
```

An Memory should never promote uncertain learning silently. Low-confidence,
conflicting, stale, or externally sourced knowledge should stay pending until
policy allows promotion.

## Cognitive Node Families

Memory should support five cognitive node families:

- config node: stores thresholds, limits, metadata, and tuning parameters
- memory node: stores short-term session context and recent interactions
- knowledge node: stores long-term facts, rules, concepts, and relationships
- optimization node: stores tuning, pruning, and benchmark results
- anomaly node: stores contradictions, schema violations, and abnormality alerts

## Knowledge Activation States

Knowledge should move through explicit states:

- passive
- active
- pending_review
- rejected
- retired

Passive knowledge may be stored and reviewed, but should not drive inference until policy promotes it.

## Topic Perspective Requirements

A fact may appear in multiple topic perspectives.

Topic perspectives should:

- point to the same underlying fact where possible
- keep perspective-specific explanation
- allow bidirectional cross-topic links
- preserve confidence and provenance
- avoid duplicating truth records silently

## Source Learning

This module learns from:

- digital brain feature notes
- rule-based learner notes
- rulebot dictionary and flow notes
- sentence learning and template learning notes
- older action-agent benchmark and AST indexes

Source-specific project names are not adopted. Useful ideas are translated into
An App module requirements.

## Required Entities

An Memory should model these as entities:

- memory_unit
- knowledge_unit
- fact_record
- rule_record
- concept_record
- topic_record
- assumption_record
- learning_record
- proof_trace
- reasoning_step
- confidence_report
- source_record
- provenance_link
- knowledge_gap
- conflict_record
- anomaly_record
- pattern_record
- relationship_record
- validation_result
- recall_request
- recall_result
- working_memory_item
- episodic_memory_item
- semantic_memory_item
- consolidation_run
- forgetting_record
- memory_policy
- memory_index
- external_learning_request
- external_learning_result
- self_reflection_record
- self_criticism_record
- self_correction_feedback
- pattern_induction_record
- ontology_version_record
- cognitive_config_node
- cognitive_memory_node
- cognitive_knowledge_node
- cognitive_optimization_node
- cognitive_anomaly_node
- topic_perspective_record

## Required Datasets

An Memory needs approved 1D datasets for:

- memory tier names
- knowledge unit type names
- knowledge source type names
- reasoning mode names
- confidence band names
- conflict type names
- anomaly type names
- learning status names
- proof status names
- consolidation action names
- forgetting reason names
- source reliability band names
- recall mode names
- validation result names

## Required Data Maps

An Memory needs relationship/mapping data for:

- knowledge unit to source record
- knowledge unit to provenance links
- knowledge unit to confidence report
- knowledge gap to external learning request
- external learning result to learning record
- learning record to validation result
- conflict record to resolution action
- proof trace to reasoning steps
- memory tier to retention policy
- topic to knowledge units
- concept to related concepts
- rule record to required facts
- anomaly record to violated rules
- pattern record to candidate rule

## Required Data Tables

An Memory needs tabular definitions for:

- knowledge units
- fact records
- rule records
- concept records
- topic records
- assumptions
- learning records
- proof traces
- reasoning steps
- source records
- provenance links
- knowledge gaps
- conflict records
- anomaly records
- pattern records
- relationship records
- validation results
- memory indexes
- consolidation runs
- forgetting records
- external learning requests
- external learning results

## Memory Tier Requirements

An Memory should support three memory tiers:

- working memory
- episodic memory
- semantic memory

Working memory stores the active reasoning context, recent facts, temporary
inferences, task-local notes, and low-confidence items.

Episodic memory stores historical traces, conversation events, tool outcomes,
reasoning paths, corrections, and examples.

Semantic memory stores stable concepts, facts, rules, relationships, patterns,
and approved generalized knowledge.

Each memory tier should have:

- retention policy
- confidence policy
- storage format
- recall policy
- promotion policy
- expiry policy
- audit policy

## Knowledge Unit Requirements

Each knowledge unit should include:

- id
- type
- title
- content
- confidence
- status
- source ids
- provenance ids
- related entity ids
- created timestamp
- updated timestamp
- last accessed timestamp
- usage count
- validation result ids
- expiration timestamp
- audit id

Knowledge unit types should include:

- fact
- rule
- concept
- topic
- keyword
- assumption
- learning
- relationship
- pattern
- anomaly

## Reasoning Requirements

An Memory should support forward reasoning and backward reasoning.

Forward reasoning should:

- load working facts
- find matching rules
- create candidate conclusions
- calculate confidence
- add accepted conclusions to working memory
- store high-confidence conclusions when policy allows
- stop at a configured iteration limit

Backward reasoning should:

- start from a goal
- find rules that may prove the goal
- recursively prove required facts
- mark missing facts as knowledge gaps
- create a proof trace
- return confidence and reasons

Confidence propagation should use configurable rules:

- all-required conditions use the lowest condition confidence
- any-valid conditions use the highest condition confidence
- rule confidence multiplies condition confidence
- repeated independent paths may increase confidence by policy
- stale knowledge decays by policy

## Learning Requirements

An Memory should learn through controlled stages:

- ingest
- parse
- extract
- normalize
- validate
- compare
- store
- review
- promote
- expire

Learning may come from:

- user correction
- approved document
- corpus row
- tool result
- parser output
- repeated pattern
- external source result
- manual maintainer entry

Each learning record should include:

- source
- extracted knowledge units
- confidence
- validation findings
- conflicts
- related proof traces
- promotion decision
- reviewer
- audit id

## Gap Detection Requirements

An Memory should create a knowledge gap when:

- a user asks about unknown knowledge
- a proof trace cannot prove a required fact
- a parser finds an unresolved entity
- confidence is below threshold
- two approved sources disagree
- a domain requires a dataset item that does not exist

A knowledge gap should include:

- missing item
- reason
- related task id
- related entity id
- suggested source types
- priority
- status
- audit id

## Conflict And Anomaly Requirements

An Memory should detect:

- contradictory facts
- conflicting rules
- stale facts
- source disagreement
- impossible relationships
- unexpected value shape
- repeated failed reasoning path
- pattern outside normal bounds

Conflict handling should support:

- keep existing
- accept new
- keep both pending
- merge
- split
- lower confidence
- request review
- reject

An anomaly should point to the rule, fact, pattern, or expected range that it
violated. It should be explainable as a structured finding.

## Source And Provenance Requirements

Every stored knowledge unit should have provenance unless it is seed knowledge.

Source records should include:

- id
- type
- location
- title
- owner
- trust band
- retrieved timestamp
- validation timestamp
- expiration policy
- notes

Provenance links should show:

- which source produced the knowledge
- which parser or extractor created it
- which validation checks accepted it
- which prior knowledge supported or contradicted it

## Consolidation And Forgetting Requirements

An Memory should periodically consolidate knowledge.

Consolidation may:

- promote repeated high-confidence patterns
- merge duplicate concepts
- specialize over-broad rules
- generalize over-narrow rules
- split mixed rules
- archive stale low-use items
- lower confidence for obsolete items
- create review tasks for conflicts

Forgetting is controlled removal from active recall, not silent deletion.
Archived knowledge should remain auditable unless policy allows removal.

## Recall Requirements

Recall requests should support:

- exact id lookup
- topic lookup
- entity lookup
- relationship lookup
- proof trace lookup
- recent memory lookup
- similar knowledge lookup
- gap lookup

Recall results should include:

- matched knowledge units
- confidence
- reason for match
- source summary
- freshness
- conflicts
- suggested next action

## Integration Requirements

An Memory must integrate with:

- an_app_lang
- an_bot
- english_language_domain
- entity_validator
- action_entity
- entity_registry
- audit log
- diagnostics log
- metrics log
- dataset registry
- source registry
- template registry
- policy registry

An Bot may request recall and show proof traces. An App Lang may store parser
findings and unresolved entities. Domains may supply approved corpuses and
rules. Plugins may use memory only through validation and policy.

## Non-Goals

An Memory should not:

- chat with the user directly
- execute tools directly
- promote unvalidated learning as approved knowledge
- treat external results as truth without source policy
- hide conflicts
- delete historical audit records silently
- mix domain-specific grammar into generic memory rules

## Minimum Complete V1

Minimum V1 should support:

- create one knowledge unit
- store one fact record
- store one rule record
- create one source record
- attach provenance to a knowledge unit
- calculate one confidence report
- run one forward reasoning pass
- run one backward proof trace
- create one knowledge gap
- detect one conflict
- recall by id
- recall by topic
- archive one stale item
- write one learning record
- validate memory records through entity validation

## Adoption From Reference Files

Adopted learning:

- three memory tiers: working, episodic, semantic
- four active memory categories for An App:
  working_memory, episodic_memory, semantic_memory, and procedural_memory
- confidence bands and confidence propagation
- proof traces for explainable reasoning
- JSONL-style appendable knowledge units as a storage option
- source reliability and provenance tracking
- gap detection when knowledge is missing
- conflict records for contradictory knowledge
- anomaly records linked to violated rules or expected shapes
- consolidation cycles for promotion, merge, split, specialization, and
  generalization
- forgetting as archival or active-recall removal
- rule application counts and success tracking
- external learning only through validated source records
- storing high-confidence derived facts only when policy allows
- hypothesis staging before promotion into active knowledge
- source trust dynamics based on validation results, contradiction count,
  freshness, and human review
- repair actions that are auditable and reversible
- staged records must keep source, confidence, validation count, conflicts won,
  conflicts lost, and verification status

Changed for An App:

- old project names are not adopted
- memory is a module, not the bot itself
- external retrieval is optional and policy-controlled
- model/vector providers are optional adapters, not core truth
- learning must be explainable, auditable, and reversible

## Hypothesis And Promotion Requirements

Any extracted rule, schema, relation, template, domain idea, or app artifact
starts as a hypothesis unless it is created directly from an approved template
or explicit user instruction.

Hypothesis records should include:

- `id`
- `record_type`
- `source_ref`
- `proposed_value`
- `confidence`
- `evidence_refs`
- `validation_count`
- `conflicts_won`
- `conflicts_lost`
- `verification_status`
- `approval_state`

Promotion requires:

- schema validation
- approved vocabulary check
- relationship check when relationships exist
- source evidence check
- conflict check
- audit record

Demotion or rollback is required when later evidence contradicts active
knowledge beyond the configured threshold.

## Repair Requirements

Repair actions should be records, not hidden edits.

Approved repair actions include:

- specialize
- generalize
- split
- merge
- reclassify
- demote
- rollback
- retry
- request_review

Every repair record should include before state, after state, reason, evidence,
validation result, and rollback plan.
