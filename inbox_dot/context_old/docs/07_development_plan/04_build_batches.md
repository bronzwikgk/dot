# Build Batches

## Phase 1: Dot Foundation

These batches make the shared codebase dependable before product work begins.

## Batch 1: Test Harness For Promoted Code

Deliverables:

- `dot/package.json` test scripts
- promoted modules added to generated-test target list
- generated tests for promoted files
- focused smoke test file for promoted entity system
- doc/log update

Acceptance:

- existing generated tests pass
- promoted generated tests pass or have documented skips
- smoke tests pass

## Batch 2: Dataset Record And Report Utilities

Deliverables:

- dataset registry entity examples
- dataset report utility methods
- docs and log
- generated and focused tests

Acceptance:

- reports all dataset groups
- reports counts
- catches duplicates and empty strings
- validates behavior pairs
- stores registry records through `action_entity`

## Batch 3: Schema Dataset And Entity validator Expansion

Deliverables:

- schema dataset records for catalog schemas
- new schema methods in `entity_validator`
- docs and log
- focused tests

Acceptance:

- validates required fields
- validates known enum fields through datasets
- returns structured errors
- integrates with entity validator or action entity by config

## Batch 4: Relationship Rule Expansion

Deliverables:

- relationship rule dataset
- cardinality and inverse checks
- acyclic relationship policy
- `entity_validator` relationship-rule methods
- `action_entity` graph-rule methods
- focused tests
- docs and log

Acceptance:

- unknown targets fail
- invalid cardinality fails
- unsafe cycles fail
- inverse mismatch reports clear errors

## Batch 5: Command Capability Registry

Deliverables:

- command record examples
- capability records
- action records
- `action_entity` storage examples for command/capability/action records
- parser/reasoner matching rules
- confirmation policy checks
- docs and log

Acceptance:

- command maps to approved capability
- missing slots produce clarification records
- risky commands require confirmation
- execution creates an audit-ready log record

## Phase 2: An App Capability Build

These batches build product behavior on top of the Phase 1 foundation.

## Batch 6: Template Artifact Creation

Deliverables:

- template record dataset
- placeholder validator
- template artifact creation handler
- LMS starter template
- fintech starter template
- single-user starter template
- docs and log

Acceptance:

- unfilled required placeholders fail
- generated entity records validate
- generated relationship records validate
- artifact creation emits audit report

## Batch 7: App Artifact Creation Workflow

Deliverables:

- app blueprint schema
- app artifact creation flow
- app generator upgrade
- smoke test application plan
- docs and log

Acceptance:

- blueprint validates
- route/view/component records validate
- manifest is reproducible
- workflow creates audit output

## Batch 8: Language And Bot Starter Layer

Deliverables:

- parser upgrade using command/capability records
- language alias-to-approved-name support in the parser first
- bot session and message records
- action proposal flow
- confidence and clarification records
- docs and log

Acceptance:

- simple English request becomes proposed entity change plan
- low confidence creates clarification
- no state mutation happens before approval

## Batch 9: Memory And UI Starter Layer

Deliverables:

- memory record schemas
- provenance and evidence records
- UI render profile records
- view switching plan
- docs and log

Acceptance:

- evidence links resolve
- conflict records validate
- same data can be represented by multiple approved layout records
