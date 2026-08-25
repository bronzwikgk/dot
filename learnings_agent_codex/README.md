# Scratchpad Entity System

This folder is an isolated prototype and planning workspace for the
entity-first `an_app` direction. It does not modify the older GUI or action
experiments.

## Start Here

Read these first:

- `docs/00_context/PROJECT_CONTEXT.md`
- `docs/01_doctrine/APPLICATION_ENTITY_DOCTRINE.md`
- `docs/01_doctrine/CONCEPT_CATALOG.md`
- `docs/00_context/SCRATCHPAD_DOC_COMPLETENESS_EVALUATION.md`

## Folder Map

```text
scratchpad_entity_system/
  README.md
  package.json
  run_generated_action_entity_tests.mjs
  code/
  docs/
    00_context/
    01_doctrine/
    02_domains/
    03_source_adoption_notes/
    04_audits_and_logs/
    05_policy/
    06_deferred/
    07_development_plan/
```

## Documentation Groups

`docs/00_context` contains project context and current evaluation records.

`docs/01_doctrine` contains the core entity-first doctrine and the approved
concept catalog.

`docs/02_domains` contains active domain requirements for language, bot, memory,
datasets, schemas, templates, UI, quality, commands, repository operations,
external intake, and file conversion.

`docs/03_source_adoption_notes` contains source-learning notes. These are
evidence and adoption records, not the canonical owners of active requirements.

`docs/04_audits_and_logs` contains manual completeness audits and source
adoption index records.

`docs/05_policy` contains agent working policy and rework prevention rules.

`docs/06_deferred` contains paused or future design work.

`docs/07_development_plan` contains the code inventory, doc-derived scope, gap
analysis, priority roadmap, build batches, and open decisions for future
development.

## Code Map

- `code/action_entity.js`: entity foundation, relationships, versions, lifecycle.
- `code/entity_registry.js`: type and trait registry.
- `code/entity_runner.js`: universal stage runner.
- `code/entity_validator.js`: naming, registry, policy, and contract checks.
- `code/dataset/validation_word_datasets.js`: approved core validation word groups.
- `code/dataset/ui_word_datasets.js`: approved UI word groups.
- `code/dataset/entity_behavior_datasets.js`: approved mapping pairs for behavior lookup.
- `code/markdown_pipeline.js`: markdown decompose, parse, compose.
- `code/entity_parser.js`: plain text intent parser.
- `code/entity_reasoner.js`: reason, resolve, explain, decide.
- `code/app_generator.js`: app entity to file manifest planner.

## Current Status

The reusable scratchpad code has been promoted into `dot/code` for review. The
scratchpad remains the architecture memory, research record, and future planning
space.

The removed source adoption pipeline is deferred and documented under
`docs/06_deferred`.

## Run

```bash
cd D:\0dot1_Aug_2016_master\scratchpad_entity_system
node run_generated_action_entity_tests.mjs
```

## Decision Notes

Do not create one class per entity type yet. Use one `action_entity` class and
many configs. Add separate shared classes only when behavior is truly
cross-cutting, such as validation, graph planning, policy gates, documentation,
and code generation.
