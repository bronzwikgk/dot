# V4 Contract 001: Command Registry

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_001, v4_missing_024

## Goal

Create one command registry that binds action names, DOM selectors, keyboard
combos, and methods to the same entity-backed command records.

## Required Entities

- command_record
- command_binding
- keyboard_combo
- selector_binding
- command_result

## Required Methods

- register_command(config)
- validate_command(config)
- resolve_command_from_action(config)
- resolve_command_from_selector(config)
- resolve_command_from_keyboard(config)
- execute_command(config)
- list_commands(config)

## Success Criteria

- the same command is reached by action name, selector, and keyboard combo
- duplicate command ids fail validation
- duplicate keyboard combos fail unless explicitly scoped
- invalid selectors fail validation
- every command result returns `{ ok, data, errors }`

## Tests

- registry unit tests
- duplicate binding tests
- browser click/keyboard e2e tests

## Do Not

- do not create separate registries for click, keyboard, and chrome commands
- do not introduce command names outside approved datasets
