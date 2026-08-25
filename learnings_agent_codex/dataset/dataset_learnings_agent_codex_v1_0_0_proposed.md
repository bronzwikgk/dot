# Scratchpad Dataset Folder

## Purpose

This folder stores planning-level datasets derived from the scratchpad domain
docs.

These datasets cover documented vocabulary scope before the values are promoted
into `dot/code/utilities/dataset`.

## Files

- `domain_scope_word_datasets.js`: one-dimensional word datasets needed to
  cover the current domain docs.

## Promotion Rule

Use these datasets as staging data. Before promotion into `dot/code`, each group
should be checked for:

- duplicates
- empty values
- naming consistency
- overlap with existing approved datasets
- correct owning domain

## Current Status

This folder contains the missing domain-scope word datasets identified from the
scratchpad docs. Relationship maps and registry/table datasets still require a
separate pass.
