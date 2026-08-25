# Priority Roadmap

## Priority Rule

Build the foundation before the product surface.

The system should be able to validate names, schemas, relationships, tests,
docs, and logs before it starts generating larger applications.

## Phase 1: Strengthen Dot Foundation

Phase 1 builds reusable shared code, tests, schemas, relationships, and
command/capability records. Registry-like things should be entity records stored
through `action_entity`, not separate registry stores.

## Required Utility Capability List

Prefer extending existing utilities before adding new files.

| Capability | Preferred Home | Reason |
| --- | --- | --- |
| code inspection | existing test generation utilities | already exists |
| signature inference | existing test generation utilities | already exists |
| test plan creation | existing test generation utilities | already exists |
| text normalization | existing `text_util` or parser utility | text utility already exists |
| tokenization | existing `text_util` or parser utility | parser already tokenizes |
| simple parsing | existing `entity_parser` | already exists |
| markdown block parsing | existing `markdown_pipeline` | already exists |
| approved-name validation | existing `entity_validator` | already exists |
| schema validation | extend `entity_validator` | validation already has one owner |
| relationship rule validation | extend `entity_validator` plus `action_entity` graph checks | relationships belong to entity records |
| dataset report creation | new utility methods or small utility if report logic grows | reporting is reusable and not storage |
| alias-to-approved-name mapping | new utility only if parser mapping outgrows `entity_parser` | alias data is parser support |
| matching score calculation | new utility only if command matching outgrows parser/reasoner | command matching needs scoring |
| slot extraction | new utility only if parser extraction outgrows `entity_parser` | language parsing needs reusable extraction |
| confidence calculation | new utility only if bot, memory, and parser share it | shared confidence policy |
| provenance record helper | new utility only if multiple plugins repeat provenance creation | audit and memory share provenance |
| audit report composition | new utility only if reports are reused across plugins | quality domain needs consistent reports |
| template placeholder checking | extend `entity_validator` first | placeholders are schema-like validation |
| render profile checking | extend `entity_validator` first | UI config validation |
| external intake checking | extend `entity_validator` first | intake records are schema/policy validation |

New utility files should be created only after an existing class becomes too
large or the behavior is shared by at least two plugins.

## P0: Push Readiness And Test Harness

Goal: make the promoted code safely testable inside `dot`.

Work:

- add `npm` scripts
- add promoted files to generated-test manifest
- run generated tests
- add focused smoke tests for promoted modules
- document test commands

Reason:

Future work should not build on untracked code.

## P1: Dataset Record And Report Utilities

Goal: make approved vocabulary auditable.

Work:

- create dataset report utility
- store dataset registry records through `action_entity`
- count groups and values
- detect duplicates, empty strings, banned names, invalid snake_case names
- validate behavior pairs against approved datasets
- produce markdown and JSON reports

Reason:

All domains depend on approved names.

## P2: Schema Enforcement In Existing validator

Goal: turn schema catalog docs into executable validation.

Work:

- create schema dataset records
- extend `entity_validator` with schema validation methods
- validate required fields
- validate enum-like fields through datasets
- connect schema validation to action entity and template work

Reason:

Entity records cannot safely create artifacts until schemas are enforced.

## P3: Relationship Governance

Goal: make relationship rules trustworthy.

Work:

- add cardinality records
- add inverse relationship rules
- add acyclic relationship policy
- expand graph validation in `action_entity`
- expand relationship validation in `entity_validator`
- add focused relationship tests

Reason:

An App depends on relationships as the source of truth.

## P4: Command And Capability Layer

Goal: turn requests into governed actions.

Work:

- command record schema
- capability records stored through `action_entity`
- action records stored through `action_entity`
- slot extraction
- matching score rules
- confirmation policy
- command execution logs

Reason:

Language and bot layers need a safe target for parsed intent.

## P5: Template And App Artifact Creation

Goal: create real application artifacts from templates through the existing
`create` operation.

Work:

- template records
- placeholder validation
- template artifact creation handler
- LMS starter template
- fintech organization starter template
- single-user starter template
- artifact creation audit report

Reason:

This is where An App begins becoming a real business application builder.

## P6: Language, Bot, Memory, And UI

Goal: build user-facing intelligence on the governed foundation.

Work:

- An App Lang parser upgrade
- English domain datasets
- An Bot session/message/action proposal records
- An Memory knowledge/provenance/conflict records
- UI render profiles and view switching plan

Reason:

These modules are high value, but they should sit on validated schemas,
datasets, relationships, templates, and commands.

## Phase 2: Build An App Capabilities

Phase 2 starts after P0 through P4 are stable and P5 has a tested create-flow
for template-driven artifacts.

Phase 2 work includes:

- app blueprint flows
- template-driven artifact creation through `create`
- An App Lang parser upgrades
- language alias-to-approved-name maps
- An Bot session and action proposal records
- An Memory evidence/provenance/conflict records
- UI render profiles and view switching
