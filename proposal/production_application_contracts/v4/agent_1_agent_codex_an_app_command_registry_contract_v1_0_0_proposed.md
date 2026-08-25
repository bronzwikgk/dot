# V4 Contract 001: Command Registry

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Priority: p0
Domain: foundation_and_runtime

## Purpose

Define unified command registry binding data-action attributes, chrome selectors, keyboard combos, and methods for GUI command routing.

## Required Records

- command_registry_record
- command_binding_record
- keyboard_combo_record
- selector_action_record

## Required Operations

- register_command
- bind_selector
- bind_keyboard_combo
- resolve_command
- execute_command

## Inputs

- command_name
- selector
- keyboard_combo
- method_ref
- action_element

## Outputs

- command_registry_record
- command_binding_record

## Validation

- all command names pass vocabulary reconciliation
- no duplicate command bindings
- keyboard combos are unique per context
- selectors resolve to valid DOM elements

## Success Criteria

- click, selector, and keyboard combo invoke same command
- duplicate bindings are rejected
- command registry survives boot

## Implementation Evidence

- `code/utilities/code_shared_command_registry_v4_0_0_draft.js` (pending)
- `test/v4_command_registry/agent_codex_an_app_v4_command_registry_v1_0_0_test.mjs` (pending)

## Do

- reuse approved An App names
- use entity doctrine for registry records
- validate before registering

## Do Not

- do not allow duplicate command names
- do not bypass vocabulary reconciliation
- do not hardcode selectors without validation
