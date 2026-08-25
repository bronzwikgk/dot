# Agent 3 Work: An App Brain Correction And Test Plan

Date: 2026-08-25
Status: proposed
Owner agent: agent_lang_and_memory
Reviewer: agent_codex_an_app
Priority: p0

## Purpose

Fix the current `an_app_brain` implementation/proposal mismatch so Agent 1,
Agent 2, and Agent 3 can work in parallel without hidden dependency breaks.

This proposal is a correction contract. Agent 3 must complete it before claiming
`an_app_brain` implementation readiness.

## Search Command

Agent 3 must start by running:

```powershell
rg --files dot\proposal | rg "agent_3_agent_lang_and_memory"
```

## Related Files

- `dot/proposal/production_application_contracts/parent_contracts/agent_3_agent_lang_and_memory_work_an_app_brain_v1_4_0_proposed.md`
- `dot/proposal/production_application_contracts/shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md`
- `dot/docs/code_shared_an_app_brain_v1_4_0_draft.md`
- `dot/log/code_shared_an_app_brain_v1_4_0_draft.log.md`
- `dot/code/plugins/an_app_brain_v1_4_0/`

## Current Issues To Fix

| Issue Id | Severity | Issue | Required Fix |
| --- | --- | --- | --- |
| agent_3_fix_001 | major | `an_app_brain` code uses CommonJS `require` and `module.exports` inside a package with `"type": "module"`. | Convert to ESM imports/exports or move the current code out of active `code` as prototype. |
| agent_3_fix_002 | major | Contract says not to create plugin implementation before schema/validation approval, but plugin folder exists under `dot/code/plugins`. | Either get explicit approval and make it compliant, or move/freeze it as proposal prototype. |
| agent_3_fix_003 | major | Code uses standalone `function` and arrow callbacks instead of class/config/constructor/method convention. | Convert public implementation to class/config/constructor/method style. |
| agent_3_fix_004 | major | File placement/name does not match dot promoted plugin convention. | Use approved file/module shape or document prototype status clearly. |
| agent_3_fix_005 | major | No Agent 3 tests exist under `dot/test`. | Add tests before claiming readiness. |
| agent_3_fix_006 | major | Schema/code mismatch: `ingestion_record` schema requires `session_id`, but code omits it. | Align code and schema. |
| agent_3_fix_007 | major | Decomposition promises cycle detection, repeated-state detection, timeout, and audit, but code only implements depth/node limits. | Implement promised policy or reduce the claim in docs/schema. |
| agent_3_fix_008 | major | Brain code risks duplicating `an_app_lang`, `an_bot`, `an_memory`, `knowledge_tree`, validator, and runner behavior. | Keep `an_app_brain` as coordinator with ports/adapters, not duplicate domain owner behavior. |
| agent_3_fix_009 | minor | Doc parent contract reference omits current version/status filename in one place. | Use full current filename when pointing to files. |
| agent_3_fix_010 | minor | Some comments still use short `contract_019` wording where a file reference is intended. | Use `shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md` for file refs; keep `contract_019` only as an id. |

## Dependency Isolation

Agent 3 work must not block Agent 1 or Agent 2.

Agent 3 must publish stable fixture records and port expectations first:

- `command_intent_port`
- `an_app_lang_port`
- `an_bot_port`
- `an_memory_port`
- `knowledge_tree_port`
- `brain_coordination_port`

Agent 2 can use fixture records from these ports before real Agent 3
implementation is ready. Agent 1 can validate e2e boundaries with mock Agent 3
ports before final integration.

## Required Output

Agent 3 must produce:

- corrected implementation plan
- corrected code or prototype relocation note
- tests under `dot/test/language_and_knowledge`
- schema/code alignment report
- docs update
- log update
- shared inbox handoff

Required test file names:

```text
dot/test/language_and_knowledge/agent_3_agent_lang_and_memory_an_app_brain_module_load_v1_0_0_test.mjs
dot/test/language_and_knowledge/agent_3_agent_lang_and_memory_an_app_brain_record_shape_v1_0_0_test.mjs
dot/test/language_and_knowledge/agent_3_agent_lang_and_memory_an_app_brain_boundary_policy_v1_0_0_test.mjs
```

## Test Requirements

Minimum tests:

- module loads in the current `type: module` package
- session record includes required fields
- ingestion record includes `session_id`
- decomposition record respects `max_depth`
- decomposition record respects `max_nodes`
- decomposition policy either implements or honestly rejects cycle detection
- boundary check blocks unsafe or low-confidence output
- improvement proposal requires approval and does not apply changes
- brain coordinator can run with mock ports
- code does not require concrete Agent 1 or Agent 2 modules

Required command:

```powershell
node --test test\language_and_knowledge\agent_3_agent_lang_and_memory_an_app_brain_*_test.mjs
```

## Conventions

Agent 3 must obey:

- every durable/governable item is an entity
- no new or similar active names without user authorization
- public names use snake_case
- no active use of banned names except in policy lists or source/inspiration notes
- no `src`
- no `deps`
- no `materialize` or `materialization`
- no source-branded names as product names
- class/config/constructor/method style for new promoted JS
- no final readiness claim without tests, docs, logs, and handoff

Controlled words allowed only with policy:

- `optimize`
- `optimise`
- `evolve`
- `mutate`

## Do

- fix runtime load first
- align schema and code before expanding behavior
- use ports for external domains
- keep parser behavior in `an_app_lang`
- keep bot lifecycle in `an_bot`
- keep memory and evidence behavior in `an_memory` and `knowledge_tree`
- keep workflow execution in runner
- keep validation rules in validation utility
- report every skipped test with reason

## Do Not

- do not claim production readiness from shape coverage alone
- do not create a parallel parser, memory system, bot runtime, runner, or validator
- do not create hard dependencies on Agent 1 or Agent 2 code
- do not use fixture records as production truth
- do not add new names to datasets without approval

## Success Criteria

This correction is complete only when:

- Agent 3 code or prototype location matches the approved status
- Node can load the module path used by tests
- tests pass under `dot/test/language_and_knowledge`
- schema-required fields are present in records
- docs and logs state actual maturity honestly
- Agent 1 and Agent 2 can continue using fixture ports without waiting
- shared inbox handoff lists changed files, tests run, unresolved risks, and next action

## Handoff Template

Agent 3 handoff must include:

- acting agent name
- assigned owner agent name
- parent contract id
- detail contract ids
- current conversation cross-check result
- files changed
- tests run
- skipped tests and reason
- mock ports published
- real ports still pending
- unresolved names
- unresolved conflicts
- next recommended action
