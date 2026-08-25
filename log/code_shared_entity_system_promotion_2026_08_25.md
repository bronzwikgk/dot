# Shared Entity System Promotion Log

Date: 2026-08-25

## Objective

Move the approved scratchpad entity system code into `dot/code` so it can be
reviewed and pushed as part of the shared codebase.

## Source

Promoted from:

- `scratchpad_entity_system/code/action_entity.js`
- `scratchpad_entity_system/code/app_generator.js`
- `scratchpad_entity_system/code/entity_parser.js`
- `scratchpad_entity_system/code/entity_reasoner.js`
- `scratchpad_entity_system/code/entity_registry.js`
- `scratchpad_entity_system/code/entity_runner.js`
- `scratchpad_entity_system/code/entity_validator.js`
- `scratchpad_entity_system/code/markdown_pipeline.js`
- `scratchpad_entity_system/code/dataset/validation_word_datasets.js`
- `scratchpad_entity_system/code/dataset/ui_word_datasets.js`
- `scratchpad_entity_system/code/dataset/entity_behavior_datasets.js`

Excluded:

- `scratchpad_entity_system/code/source_adoption_pipeline`

Reason for exclusion: the user removed the trial adoption pipeline and asked to
promote only the reusable entity-system code and datasets.

## Files Added To Dot

Plugins:

- `dot/code/plugins/code_shared_action_entity_v3_1_0_draft.js`
- `dot/code/plugins/code_shared_app_generator_v3_0_0_draft.js`
- `dot/code/plugins/code_shared_entity_runner_v3_0_0_draft.js`

Utilities:

- `dot/code/utilities/code_shared_entity_validator_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_entity_registry_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_entity_parser_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_entity_reasoner_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_markdown_pipeline_v3_0_0_draft.js`

Datasets:

- `dot/code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js`
- `dot/code/utilities/dataset/code_shared_ui_word_datasets_v3_0_0_draft.js`
- `dot/code/utilities/dataset/code_shared_entity_behavior_datasets_v3_0_0_draft.js`

Docs:

- `dot/docs/code_shared_entity_system_promotion_v3_0_0_draft.md`

Log:

- `dot/log/code_shared_entity_system_promotion_2026_08_25.md`

## Import Path Updates

The promoted files were copied from the scratchpad and import paths were updated
for the `dot/code` layout:

- Plugin files import shared utilities through `../utilities/...`.
- Plugin files import datasets through `../utilities/dataset/...`.
- Utility files import datasets through `./dataset/...`.
- Dataset files have no imports.

## Design Decisions

- `action_entity` is a plugin because it is an active entity capability with
  create, read, update, delete, query, relationship, policy, contract, lifecycle,
  version, import/export, and graph behavior.
- `app_generator` is a plugin because it creates app manifests from entity
  definitions.
- `entity_runner` is a plugin candidate because it orchestrates configured
  stages.
- `entity_validator`, `entity_registry`, `entity_parser`, `entity_reasoner`, and
  `markdown_pipeline` are utilities because they are reusable helpers called by
  plugins.
- Dataset modules live under utilities because they are shared validation and
  lookup data.
- The existing action entity and runner files were not overwritten. New promoted
  versions were added for controlled review.

## Fix Applied Before Promotion

`entity_parser` was corrected in the scratchpad before promotion.

Previous behavior:

- `create entity called invoice` produced name `called`.

Current behavior:

- `create entity called invoice` produces name `invoice`.
- `create view named dashboard` produces name `dashboard`.
- `create route api_orders` produces name `api_orders`.

## Validation Commands Run

Module import validation:

```bash
node --input-type=module -e "const mods=['./dot/code/plugins/code_shared_action_entity_v3_1_0_draft.js','./dot/code/plugins/code_shared_app_generator_v3_0_0_draft.js','./dot/code/plugins/code_shared_entity_runner_v3_0_0_draft.js','./dot/code/utilities/code_shared_entity_validator_v3_0_0_draft.js','./dot/code/utilities/code_shared_entity_registry_v3_0_0_draft.js','./dot/code/utilities/code_shared_entity_parser_v3_0_0_draft.js','./dot/code/utilities/code_shared_entity_reasoner_v3_0_0_draft.js','./dot/code/utilities/code_shared_markdown_pipeline_v3_0_0_draft.js','./dot/code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js','./dot/code/utilities/dataset/code_shared_ui_word_datasets_v3_0_0_draft.js','./dot/code/utilities/dataset/code_shared_entity_behavior_datasets_v3_0_0_draft.js']; for (const m of mods) await import(m); console.log('promoted dot modules import ok')"
```

Result:

```text
promoted dot modules import ok
```

Entity and parser smoke validation:

```bash
node --input-type=module -e "import { action_entity } from './dot/code/plugins/code_shared_action_entity_v3_1_0_draft.js'; import { entity_parser } from './dot/code/utilities/code_shared_entity_parser_v3_0_0_draft.js'; const p=new entity_parser(); const parsed=p.parse('create entity called invoice').entities[0]; const store=new action_entity('items',{allow_unknown_types:true}); await store.create({id:'a',type:'utility',name:'a'}); await store.create({id:'b',type:'utility',name:'b',relationships:[{type:'depends_on',to:'a'}]}); const graph=await store.validate_graph(); console.log(JSON.stringify({parser_name:parsed.name,graph_ok:graph.ok},null,2));"
```

Result:

```json
{
  "parser_name": "invoice",
  "graph_ok": true
}
```

Dataset validation:

```bash
node --input-type=module -e "const mods=[await import('./dot/code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js'),await import('./dot/code/utilities/dataset/code_shared_ui_word_datasets_v3_0_0_draft.js')]; let bad=[]; for (const mod of mods) for (const [name,value] of Object.entries(mod)) if (Array.isArray(value) && value.every(x=>typeof x==='string')) { const seen=new Set(); for (const item of value) { if (seen.has(item)) bad.push(name+':'+item); seen.add(item); } if (!value.length) bad.push(name+':empty'); } if (bad.length) { console.log(bad.join('\n')); process.exit(1); } console.log('promoted dataset arrays ok');"
```

Result:

```text
promoted dataset arrays ok
```

## Remaining Follow-Up

- Add unit tests for promoted files.
- Compare `code_shared_entity_runner_v3_0_0_draft.js` with the existing shared
  runner before replacing or merging behavior.
- Add code-level schema checks based on the schema contract catalog.
- Add dataset registry reporting so each dataset group has owner, count, and
  validation status.
