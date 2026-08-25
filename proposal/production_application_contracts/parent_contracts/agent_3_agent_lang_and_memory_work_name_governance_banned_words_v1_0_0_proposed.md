# Agent Work: Name Governance And Banned Words

Date: 2026-08-25
Status: proposed
Owner agent: agent_lang_and_memory
Reviewer: agent_codex_an_app
Priority: p0

## Purpose

Lock naming governance before production implementation. The agent must ensure new source-derived names do not enter active code, datasets, contracts, docs, methods, plugins, utilities, domains, or folders without authorization.

## Related Contracts

- ../shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md
- ../shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- ../shared_detail_contract_004_validation_utility_v1_0_0_proposed.md
- ../shared_detail_contract_010_an_app_lang_v1_0_0_proposed.md
- ../shared_detail_contract_017_agent_improvement_cycle_v1_0_0_proposed.md
- ../shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## Immediate Work

1. Scan active `dot` code, datasets, docs, logs, and proposals for banned or avoidable names.
2. Separate allowed mentions from violations.
3. Allowed mentions are explicit banned-name lists, source coverage notes, migration notes, and warnings.
4. Violations are active names for files, folders, classes, methods, datasets, operations, entity types, plugins, utilities, domains, schemas, and product modules.
5. Create a reconciliation report with exact file and line references.
6. Propose replacement names using approved An App vocabulary.
7. Do not rename implementation files until tests/docs/log impact is known.

## Current Banned Active Names

- `src`
- `function`
- `foreach`
- `engine`
- `deps`
- `materialize`
- `materialization`
- `neuro_rule`
- `rule_engine`

## Controlled Allowed Operation Names

- `optimize`
- `optimise`
- `evolve`
- `mutate`

These are allowed only when the contract defines exact behavior, inputs,
outputs, validation, seed policy when relevant, rollback, and audit behavior.
They should not be used as vague product, plugin, utility, domain, or folder
names.

## Preferred Replacement Map

| Blocked name | Preferred replacement |
| --- | --- |
| `src` | `code` |
| `function` | class/config/constructor/method wording |
| `foreach` | loop, iteration, or explicit traversal wording |
| `engine` | system, runtime, runner, evaluator, or utility according to scope |
| `deps` | dependencies |
| `materialize`, `materialization` | create, generate, compose, persist, or render according to scope |
| `neuro_rule`, `rule_engine` | rule_set, rule_record, assertion_record, validation_utility, rule_system when explicitly authorized |

## Validation Commands

Run from `dot`:

```powershell
node -e "import('./code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js').then((m)=>{const r=m.validate_word_dataset_arrays({banned_words:m.banned_words}); if(!r.ok){console.error(r.errors); process.exit(1)} console.log('banned_words ok', m.banned_words.length);})"
node validate_conventions.js
```

Manual scan:

```powershell
Get-ChildItem -Recurse -File -Include *.js,*.md,*.dataset |
  Select-String -Pattern 'src|function|foreach|engine|deps|materialize|materialization|neuro_rule|rule_engine'
```

## Success Criteria

- banned word dataset contains the full blocked list
- controlled operation names are documented and not treated as banned
- policy docs and agent handbook match the dataset
- vocabulary contract names the blocked source-derived terms
- all active-name violations are either fixed or logged as pending
- every source-derived term has a preferred replacement or authorization path
- no implementation rename happens without tests, docs, and logs

## Do

- treat every durable name decision as an entity-governed decision
- reuse approved An App names first
- keep public names snake_case
- report exact file and line for every possible violation
- ask for authorization when replacement would create a new active name

## Do Not

- do not silently promote source names
- do not change working code names without running related tests
- do not treat source notes as active product truth
- do not remove source evidence just to make a scan clean
