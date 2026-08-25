# Domain Scope From Docs

## Purpose

This file summarizes what the scratchpad documents require, grouped by domain.

## Foundation Domains

Phase 1 should finish these domains first because all later product behavior
depends on them.

### Dataset Registry

Required outcomes:

- dataset registry records stored through `action_entity`
- dataset owner tracking
- duplicate checks
- empty-array checks
- banned-name checks
- relationship map cross-reference checks
- generated registry report

Primary docs:

- `../02_domains/DATASET_REGISTRY_REQUIREMENTS.md`
- `../01_doctrine/CONCEPT_CATALOG.md`

### Schema Contract

Required outcomes:

- executable schema records
- schema validation added to the existing `entity_validator`
- schema reference checks from plugins and docs
- relationship schema validation
- command, capability, action, flow, template, tree, audit, intake, and planning
  schemas

Primary doc:

- `../02_domains/SCHEMA_CONTRACT_CATALOG.md`

### Quality Audit

Required outcomes:

- validation gates
- quality gates
- audit report records
- conflict records
- gap records
- approval states
- risk levels
- evidence checks
- round-trip validation checks

Primary doc:

- `../02_domains/QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`

## Execution Domains

### Command Capability

Required outcomes:

- command record handling
- capability records stored through `action_entity`
- action records stored through `action_entity`
- slot extraction
- matching score rules
- confirmation rules
- command execution logs

Primary doc:

- `../02_domains/COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md`

### Repository Operations

Required outcomes:

- safe repository operation records
- stage/commit/push policy
- release and rollback records
- approval gate integration

Primary doc:

- `../02_domains/REPOSITORY_OPERATIONS_DOMAIN_REQUIREMENTS.md`

### External Intake

Required outcomes:

- local file intake
- URL/web page/API intake policy
- connected workspace adapter records
- timeout and size limits
- normalized evidence output
- structured error records

Primary doc:

- `../02_domains/EXTERNAL_INTAKE_DOMAIN_REQUIREMENTS.md`

## Product Domains

Phase 2 should build these only after the foundation domains are tested and
governed.

### Template

Required outcomes:

- starter templates
- domain templates
- sample pipelines
- placeholder validation
- artifact creation from templates using the existing `create` operation
- template audit reports
- LMS and fintech starter templates

Primary doc:

- `../02_domains/TEMPLATE_DOMAIN_REQUIREMENTS.md`

### An App Lang

Required outcomes:

- text normalization
- sentence classification
- slot extraction
- language alias datasets that map user words to approved system names
- semantic particles
- entity change plans
- parser workbench states
- controlled English commands
- ambiguity and near-match reports

Primary doc:

- `../02_domains/AN_APP_LANG_SCOPE_REQUIREMENTS.md`

Boundary:

- `action_word_names`, `entity_word_names`, `relationship_word_names`,
  `layout_word_names`, `template_word_names`, `dataset_word_names`,
  `workflow_word_names`, `policy_word_names`, and `status_word_names` are
  language-facing alias datasets.
- Core truth remains in existing approved datasets such as `operation_names`,
  `entity_types`, `relationship_types`, `layout_names`, template datasets, and
  lifecycle/status datasets.

### An Bot

Required outcomes:

- sessions
- messages
- tool requests/results
- confidence display records
- correction flow
- quick actions
- profile-aware help
- conversation exports

Primary doc:

- `../02_domains/AN_BOT_SCOPE_REQUIREMENTS.md`

### An Memory

Required outcomes:

- working, episodic, and semantic memory records
- provenance
- proof traces
- knowledge gaps
- conflicts
- learning states
- forgetting policy

Primary doc:

- `../02_domains/AN_MEMORY_SCOPE_REQUIREMENTS.md`

### UI Surface

Required outcomes:

- layout records
- render profiles
- input surfaces
- view switching
- accessibility states
- same-data multi-layout support

Primary doc:

- `../02_domains/UI_SURFACE_DOMAIN_REQUIREMENTS.md`

### English Language

Required outcomes:

- sentence type datasets
- grammar corpus handling
- part-of-speech records
- tense/aspect records
- pronoun resolution records
- semantic role records

Primary doc:

- `../02_domains/ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`
