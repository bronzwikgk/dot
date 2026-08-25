# Open Decisions

## Action Entity Replacement

Current decision:

- keep `code_shared_action_entity_v3_0_0_draft.js`
- keep `code_shared_action_entity_v3_1_0_draft.js`
- use `v3_1_0` for new entity-system work

Open question:

- when should `v3_1_0` replace `v3_0_0` as the default?

Decision gate:

- generated tests for `v3_1_0`
- focused contract tests
- old caller compatibility review
- migration note

## runner Merge

Current decision:

- keep `code_shared_runner_v3_0_0_draft.js` as full workflow runner
- keep `code_shared_entity_runner_v3_0_0_draft.js` as lightweight stage runner

Open question:

- should the entity runner later become a mode inside the shared runner?

Decision gate:

- entity runner tests
- no breakage in existing runner tests
- clear API boundary

## Schema Format

Open question:

- should schema records live as JavaScript datasets, JSON files, or markdown
  generated records?

Preferred starting point:

- JavaScript dataset records, because current code already imports dataset
  modules directly.

## Registry Storage

Current decision:

- registries are entities
- registry records should be stored through `action_entity`
- do not create a separate registry store when `action_entity` already fits

Open question:

- which registry record examples should be built first?

Preferred answer:

- dataset registry records, schema records, command records, capability records,
  and action records.

## Template Storage

Open question:

- should starter templates live in `dot/code`, `dot/dataset_shared_v3`, or a
  new application template folder?

Preferred starting point:

- use a dataset/template folder after template artifact creation is implemented.

## Product Surface Timing

Open question:

- when should An Bot, An App Lang, Memory, and UI work begin?

Preferred answer:

- after test harness, dataset registry, schema validator, and relationship
  governance are complete.

## Language Alias Dataset Promotion

Current decision:

- staging alias datasets may exist in `scratchpad_entity_system/dataset`
- they should not become core truth

Open question:

- what map shape should connect alias words to approved names?

Preferred answer:

- add relationship-map records from alias word to approved dataset value before
  promotion into `dot/code`.
