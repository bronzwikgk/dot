# code_shared_datasets_v3_0_0_draft.md

**Version:** v3.0.0
**Status:** active
**Owner:** agent_codex_an_app
**Merged from:** ui_word_datasets, validation_word_datasets, entity_behavior_datasets

## What It Is

All approved datasets: UI words, validation words, entity behavior mappings.

## Components

### ui_word_datasets
Layout names, render profiles, cell types, flow node types, keyboard commands, panel names, template IDs, accessibility roles.

### validation_word_datasets
Banned words, controlled words, approved operation names, schema names.

### entity_behavior_datasets
Trait-operation pairs, type-trait pairs for entity registry.

## Runtime Contract

- all names in datasets are approved
- banned words rejected by validator
- controlled words only with explicit policy
- behavior mappings come from datasets, not hardcoded

## Related Files

- code/utilities/dataset/code_shared_ui_word_datasets_v3_0_0_draft.js
- code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js
- code/utilities/dataset/code_shared_entity_behavior_datasets_v3_0_0_draft.js
