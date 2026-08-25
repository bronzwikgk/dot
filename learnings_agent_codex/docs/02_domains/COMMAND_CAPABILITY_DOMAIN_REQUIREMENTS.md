# Command Capability Domain Requirements

## Purpose

The Command Capability domain owns how user requests become approved capabilities, selected actions, and audited flows.

## Scope

This domain includes:

- commands
- intents
- capabilities
- actions
- command templates
- capability routing
- clarification prompts
- risk and confirmation behavior
- execution logs
- command outcome reports

## Canonical Command Mapping

Command parsing should resolve synonyms before planning.

Examples:

- show, display, present, and render resolve to the approved output intent.
- create, add, and make resolve to create.
- list and show resolve to query/list behavior depending on target shape.

Command records should keep:

- canonical action
- original phrase
- matched pattern
- target family
- attributes or slots
- confidence
- validation result
- audit reference

Target family and action type must be selected from approved datasets before
execution.

## Flow From Request To Work

1. User enters a command.
2. Language layer classifies intent.
3. Bot checks session context.
4. Capability matcher selects candidate capabilities.
5. Policy gate checks risk and confirmation mode.
6. Action selector creates a proposed action or flow.
7. User approval is requested when needed.
8. Action executes and logs outcome.

## Command Contract

A command must include:

- phrase
- intent
- context
- capability match
- risk level
- confirmation mode
- status
- outcome

## Capability Contract

A capability must include:

- id
- name
- domain
- accepted inputs
- produced outputs
- action references
- policy references
- test references
- owner
- triggers
- similar words
- patterns
- required slots
- optional slots
- defaults
- safety level
- confirmation rule
- output contract
- audit fields

## Action Contract

An action must include:

- id
- name
- capability id
- input schema
- output schema
- policy references
- audit log shape

## Clarification Policy

The system should ask for clarification when:

- required input is missing
- multiple capabilities match
- confidence is low
- risk is above automatic approval threshold
- user intent conflicts with policy

## Capability Creation Loop

Capability creation should follow this loop:

1. capture intent
2. draft capability spec
3. add or update registry records
4. create prompt tests
5. run tests
6. evaluate and refine
7. scale the test set once stable

## Command Execution Flow

Command execution should:

1. validate input
2. match intent to capability
3. extract entities and slots
4. validate slots
5. request confirmation when needed
6. execute or dry run
7. respond with result and audit record

## Matching Score Requirements

Intent matching should support weighted signals:

- exact match
- synonym match
- pattern match
- semantic match

Default weights may be exact 100, synonym 80, pattern 70, and semantic 60. These values must be configurable and test-backed.

Tie-breaking should consider:

- higher confidence
- lower risk
- more required slots present
- recent context
- explicit user wording

## Slot Extraction Requirements

Slot extraction should support:

- positional extraction
- named extraction
- flagged extraction
- natural language extraction

Missing required slots should create clarification questions before execution.

## Dataset Updates Needed

- Add command record field names.
- Add capability record field names.
- Add confirmation mode names.
- Add command status names.
- Add action outcome names.
- Add command template type names.
- Add parser command names.
- Add parser surface names.
- Add matching signal names.
- Add slot extraction mode names.
- Add command flow step names.
