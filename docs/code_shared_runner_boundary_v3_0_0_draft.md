# Shared Runner Boundary

## Purpose

This document defines the boundary between the existing shared workflow runner
and the newly promoted entity runner.

## Decision

Keep both runners for now.

`code_shared_runner_v3_0_0_draft.js` remains the main workflow runner.
`code_shared_entity_runner_v3_0_0_draft.js` remains a lightweight stage runner
for entity-system pipelines.

## Existing Shared Runner

Use `code_shared_runner_v3_0_0_draft.js` for:

- named plans
- AST-style step execution
- DAG task execution
- conditions
- jumps
- termination
- nested subflows
- action budgets
- depth limits
- task dependency sorting
- session tracking

## Entity Runner

Use `code_shared_entity_runner_v3_0_0_draft.js` for:

- small ordered stages
- parse and validate passes
- conversion passes
- materialization previews
- diagnostics and timing collection

## Why Not Merge Now

The existing runner is broader and already tested. The entity runner is smaller
and easier to use for simple pipelines. Merging now would risk changing the
existing workflow contract before the entity system has generated tests and
schema gates.

## Future Merge Rule

Merge later only if:

- entity runner tests exist
- shared runner can expose a simple stage-runner mode
- existing workflow tests still pass
- docs clearly describe the combined API
