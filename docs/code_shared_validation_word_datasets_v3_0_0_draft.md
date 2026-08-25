# Shared Validation Word Datasets

## File

`code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js`

## What It Is

This dataset module contains approved one-dimensional word arrays for core
validation across the entity-first system.

## What It Contains

It includes approved words for entity types, traits, operations, datatypes,
relationships, lifecycle statuses, stages, pipelines, intents, policies,
contracts, schemas, diagnostics, artifacts, templates, application scope,
language, memory, source coverage, command records, capabilities, quality gates,
repository operations, conversion profiles, external intake, planning artifacts,
and banned names.

## When To Use It

Use it as the shared source for validating approved core vocabulary.

## Runtime Contract

- Each exported group should be a one-dimensional array.
- String arrays should not contain duplicates.
- New names should be added here before validators accept them.

## Known Limits

- It is a vocabulary source, not a full registry with owner metadata.
- A generated dataset registry report is still needed.

## How It Was Tested

The module imports successfully. Word-array checks found no empty arrays or
duplicate values.
