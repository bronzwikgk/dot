# Shared Command Registry Utility

## File

`code/utilities/code_shared_command_registry_v4_0_0_draft.js`

## What It Is

The shared command registry utility keeps one approved command record for each
user action. It connects the same command to action names, selectors, keyboard
combos, and executable methods.

## What It Does

It exposes:

- `register_command(config)`
- `validate_command(config)`
- `resolve_command_from_action(config)`
- `resolve_command_from_selector(config)`
- `resolve_command_from_keyboard(config)`
- `execute_command(config)`
- `list_commands(config)`

## When To Use It

Use it when a plugin or UI surface needs one source of truth for commands. A
click, keyboard shortcut, command bar action, or plugin call should resolve to
the same command record.

## Runtime Contract

- Command actions must come from approved UI action datasets.
- Duplicate command ids fail.
- Duplicate keyboard combos fail within the same scope.
- Duplicate selectors fail.
- Every result returns `{ ok, data, errors }`.

## How It Was Tested

Node tests cover command registration, duplicate id rejection, duplicate
keyboard rejection, invalid selector rejection, action resolution, selector
resolution, keyboard resolution, command execution, and missing method errors.
