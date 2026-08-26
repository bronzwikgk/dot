# Shared Entity Behavior Datasets

## File

`code/utilities/dataset/code_shared_entity_behavior_datasets_v3_0_0_draft.js`

## What It Is

This dataset module contains mapping pairs used by the entity registry.

## What It Contains

It exports:

- `trait_operation_pairs`
- `type_trait_pairs`

Trait-operation pairs map a trait to allowed operations. Type-trait pairs map an
entity type to its traits.

## When To Use It

Use it when behavior should come from approved type and trait mappings rather
than hardcoded branching.

## Runtime Contract

- Trait names must exist in the approved trait dataset.
- Type names must exist in the approved entity type dataset.
- Operation names must exist in the approved operation dataset.

## Known Limits

- It is an initial behavior map.
- It does not yet include policy, risk, or lifecycle constraints.

## How It Was Tested

Cross-reference checks confirmed all pairs point to approved types, traits, and
operations.
