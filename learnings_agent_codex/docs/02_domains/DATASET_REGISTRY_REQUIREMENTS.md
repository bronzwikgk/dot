# Dataset Registry Requirements

## Purpose

This document defines how approved datasets, registry maps, and relationship maps should be named, validated, owned, and updated.

## Dataset Classes

| Class | Shape | Use |
| --- | --- | --- |
| word dataset | one-dimensional array of approved strings | validates names, labels, states, types, and allowed values |
| registry map | structured keyed records | stores catalog records with fields and owners |
| relationship map | array of pairs or edge records | connects approved ids, traits, types, and operations |
| schema catalog | named schema records | defines required fields for records and tree nodes |
| rule catalog | named policy or validation rules | validates operations and decisions |

## Ownership

- Core names belong to `validation_word_datasets.js`.
- UI names belong to `ui_word_datasets.js`.
- Behavior pairs belong to `entity_behavior_datasets.js`.
- Schema records belong to `SCHEMA_CONTRACT_CATALOG.md` until code records are added.
- Domain-specific datasets must name their owning domain doc.

## Required Dataset Groups

The registry should include these word dataset groups:

- dataset class names
- registry record types
- tree node type names
- provenance field names
- command record field names
- capability record field names
- policy field names
- rule field names
- approval state names
- quality gate names
- input surface names
- render view names
- search source names
- repository operation names
- conversion profile names
- recovery state names
- source coverage state names

## Validation Rules

Each word dataset must:

- be one-dimensional
- contain strings only
- use snake_case names
- avoid duplicate values
- avoid empty strings
- avoid banned words
- have a clear owning doc

Each registry map must:

- have stable ids
- have an owner
- have a schema reference
- have an approval state
- have provenance when derived from source learning

Each relationship map must:

- reference known source and target values
- name the relationship type
- define cardinality when needed
- fail validation on unknown target values
- report cycles when a relationship type cannot safely cycle

## Update Process

1. Identify the domain owner.
2. Check the concept catalog for an existing approved name.
3. Add new words only when no approved name fits.
4. Add the dataset group to the registry.
5. Validate duplicates, banned words, unknown relationships, and missing owners.
6. Record the source or reason for adoption.

## Type Ratification Process

New entity types must be ratified before activation.

Required phases:

1. search existing registries for exact or similar names
2. reserve the name in the owning document
3. define the shape and required fields
4. wire default traits
5. declare relationship types, inverses, and cardinality
6. register only after approval

Required gates:

- name is clear
- schema is complete
- traits exist
- relationship targets and inverses are valid
- registration happens after the approved row exists

## Additional Dataset Groups Needed

The current scope requires these additional one-dimensional word groups:

- memory type names
- verification status names
- repair action names
- acceptance category names
- rejection reason names
- monitor metric names
- source trust factor names
- command target family names
- experiment entity names
- experiment action names
- expression template type names
- finding type names
- chart type names
- UI component names
- UI region names
- UI panel names
- UI menu names
- UI toolbar names
- UI dialog names
- UI status indicator names
- UI command surface names
- UI compiler stage names
- semantic HTML tag names
- semantic HTML tag category names
- semantic HTML singleton tag names
- layout node type names
- route segment names
- design token names
- UI lifecycle state names
- UI event type names
- UI input type names
- UI output type names
- keyboard shortcut scope names
- keyboard modifier names
- shortcut action names
- shortcut conflict type names
- setting scope names
- setting value type names
- preference category names
- accessibility setting names
- theme setting names
- layout setting names
- editor setting names
- canvas setting names
- workflow setting names
- fintech entity names
- fintech product type names
- transaction type names
- account type names
- payment status names
- compliance case type names
- trading entity names
- market data field names
- timeframe names
- order side names
- strategy status names
- backtest metric names
- data quality issue names

## Open Items

Current status:

- Core word datasets exist for approved names, relationships, policies, quality, source adoption, language, memory, templates, parser records, and planning records.
- UI word datasets exist separately for layout and editor vocabulary.
- Relationship and trait behavior pairs exist as relationship maps.
- Remaining work is a generated registry report, not missing domain ownership.

- Add a code-level dataset registry that lists every dataset group, owner doc, and validation rule.
- Add a validation report that counts arrays, values, duplicates, and unknown relationship targets.
- Reconcile adoption-note dataset requests into this registry.
