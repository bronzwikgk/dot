# Shared Entity Runner Plugin

## File

`code/plugins/code_shared_entity_runner_v3_0_0_draft.js`

## What It Is

The shared entity runner plugin is a lightweight stage runner. It executes a
configured list of named stages and records timing plus diagnostics.

## What It Does

It exposes:

- `register_stage(name, handler)`
- `run(input, options)`

## When To Use It

Use it for small validation, parsing, conversion, or materialization pipelines
where each stage receives a value and returns the next value.

Use `code_shared_runner_v3_0_0_draft.js` for declared workflows, DAG tasks,
conditions, nested plans, action budgets, and task dependency sorting.

## Runtime Contract

- Stage names must be present in the configured stage order.
- Stage handlers must be callable.
- Missing stages create diagnostics.
- Failed stages create diagnostics and stop when configured to stop on error.
- Successful runs return final value, context, diagnostics, and timings.

## Known Limits

- No DAG execution.
- No nested workflow model.
- No validator-backed condition handling.
- No action host or task registry integration.

## How It Was Tested

Smoke checks registered two stages, ran them in order, and confirmed final
context state and diagnostics.
