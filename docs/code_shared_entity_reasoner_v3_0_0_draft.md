# Shared Entity Reasoner Utility

## File

`code/utilities/code_shared_entity_reasoner_v3_0_0_draft.js`

## What It Is

The shared entity reasoner utility provides simple reasoning helpers for entity
records and scored choices.

## What It Does

It exposes:

- `reason(entity, registry)`
- `resolve(entity, need)`
- `explain(result)`
- `decide(options)`

## When To Use It

Use it for early reasoning experiments where code needs a small explainable
result, a simple resolver, or a highest-score decision.

## Runtime Contract

- `reason` summarizes type, known status, traits, and operations.
- `resolve` returns the matching relationship target for a requested type.
- `explain` returns readable text for a result.
- `decide` chooses the highest scored option.

## Known Limits

- It is deterministic and simple.
- It does not yet use memory, proof traces, confidence policies, or semantic
  matching.

## How It Was Tested

Smoke checks imported the module and verified highest-score selection.
