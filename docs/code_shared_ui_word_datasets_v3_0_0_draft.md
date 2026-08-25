# Shared UI Word Datasets

## File

`code/utilities/dataset/code_shared_ui_word_datasets_v3_0_0_draft.js`

## What It Is

This dataset module contains approved UI vocabulary separated from core entity
vocabulary.

## What It Contains

It includes approved names for layouts, cells, panels, views, editor surfaces,
render profiles, import/export formats, UI actions, accessibility roles, and
template ids.

## When To Use It

Use it when validating UI layouts, panels, editor surfaces, render modes, and
interface-related entity configuration.

## Runtime Contract

- UI vocabulary stays separate from core validation vocabulary.
- String arrays should not contain duplicates.
- New UI names should be checked against this file before adoption.
- `validate_ui_word_dataset_arrays(groups)` can be used by tests or agents to
  check UI string arrays for invalid values and duplicates.

## Known Limits

- It does not yet include full render schemas or visual layout constraints.

## How It Was Tested

The module imports successfully. Word-array checks found no empty arrays or
duplicate values.

## V4 Command Update

The approved GUI action names now include `run_all` for notebook-wide DAG-style
cell execution.
