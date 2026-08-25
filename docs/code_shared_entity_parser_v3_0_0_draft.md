# Shared Entity Parser Utility

## File

`code/utilities/code_shared_entity_parser_v3_0_0_draft.js`

## What It Is

The shared entity parser utility is a small deterministic parser for simple
entity commands.

## What It Does

It exposes:

- `parse(text)`
- `pick_name(tokens, start_index, fallback)`
- `tokenize(text)`

It currently recognizes simple create and link intents.

## When To Use It

Use it for early command parsing smoke checks and simple entity-intent
experiments.

Do not use it as the full An App language parser yet. The full parser needs
schemas, confidence, clarification, sentence classification, and review states.

## Runtime Contract

- Tokenization lowercases input.
- `parse(null)` and `parse(undefined)` are treated as empty input.
- Create commands produce `{ action, type, name }`.
- Link commands produce `{ action, from, to }`.
- Filler words such as `called` and `named` are skipped when selecting names.

## Known Limits

- It handles only a small command set.
- It does not validate parsed output against schemas.
- It does not assign confidence scores.

## How It Was Tested

Smoke checks confirmed:

- `create entity called invoice` resolves name `invoice`.
- `create view named dashboard` resolves name `dashboard`.
- `create route api_orders` resolves name `api_orders`.
