# Shared Cell Command Language Utility

## File

`code/utilities/code_shared_cell_command_language_v4_0_0_draft.js`

## What It Is

The shared cell command language utility parses short workspace commands into
approved command names, slots, cell language records, and execution plans.

## What It Does

It exposes:

- `parse_command_text(config)`
- `classify_command_intent(config)`
- `extract_command_slots(config)`
- `create_execution_plan(config)`
- `validate_execution_plan(config)`

## Runtime Contract

- Parsed command names must be approved UI actions.
- Markdown, code, and natural language cells are distinguished.
- Ambiguous or unknown text returns a clarification plan instead of executing.
- Execution plans must validate before runner handoff.
- Parse records include confidence and evidence.

## How It Was Tested

Focused Node tests cover approved command mapping, slot extraction, ambiguity,
clarification, and execution plan validation.
