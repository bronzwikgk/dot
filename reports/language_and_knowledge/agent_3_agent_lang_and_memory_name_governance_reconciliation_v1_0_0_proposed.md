# Agent 3 Name Governance Reconciliation Report

Date: 2026-08-25
Status: proposed
Agent: agent_3_agent_lang_and_memory (agent_lang_and_memory)
Owner agent: agent_lang_and_memory
Branch: dot_agent_lang_and_memory_v1
Contract: agent_3_agent_lang_and_memory_work_name_governance_banned_words_v1_0_0_proposed.md

## Scan Scope

- dot/code/**/*.js (agent_3 files only)
- dot/test/**/*.mjs (agent_3 files only)
- dot/docs/**/*.md (agent_3 files only)
- dot/proposal/**/*agent_3*.md (agent_3 files only)
- dot/proposal/prototypes/an_app_brain_v1_4_0_prototype/**/*.js (frozen)

## Banned Words Scanned

`src`, `function`, `foreach`, `engine`, `deps`, `materialize`, `materialization`, `neuro_rule`, `rule_engine`

## Controlled Words Scanned

`optimize`, `optimise`, `evolve`, `mutate`

## Agent 3 Violations Found And Fixed

| File | Line | Word | Type | Action |
|---|---|---|---|---|
| code/plugins/an_app_brain_v1_4_0_draft.js | 392 | function | banned | fixed: replaced nested helper with iterative split block |
| test/.../agent_3_..._record_shape_v1_0_0_test.mjs | 188 | src | banned | fixed: changed to `"source_ref"` |
| test/.../agent_3_..._record_shape_v1_0_0_test.mjs | 196 | src | banned | fixed: changed to `"source_ref"` |

## Agent 3 Allowed Mentions (Not Violations)

| File | Line | Word | Reason Allowed |
|---|---|---|---|
| proposal/.../correction_and_test_plan_v1_0_0_proposed.md | 39 | function | policy list describing the issue |
| proposal/.../correction_and_test_plan_v1_0_0_proposed.md | 114-126 | src, deps, materialize, etc. | banned word list (policy doc) |
| proposal/.../work_an_app_brain_v1_0_0_proposed.md | 31 | optimize, evolve, mutate | controlled operation names in work table |
| proposal/.../name_governance_v1_0_0_proposed.md | 34-66 | all banned words | policy doc defining the list |
| proposal/.../name_governance_v1_0_0_proposed.md | 81 | all banned words | validation command pattern |
| test/.../module_load_v1_0_0_test.mjs | 8 | function | runtime check `typeof ... === "function"` |
| reports/.../evaluation_v1_0_0_proposed.md | 59 | src | evaluation describing the issue |

## Existing Dot Code Violations (Not Agent 3 Scope)

| File | Line | Word | Notes |
|---|---|---|---|
| code_shared_runner_v3_0_0_draft.js | 5,11,13 | engine | comments/changelog |
| code_shared_runner_v3_0_0_draft.js | 187,231,351,365,374,375 | function | typeof checks and helper functions |
| code_shared_validator_v3_0_0_draft.js | 7,12 | engine | comments/changelog |
| code_shared_logger_v3_0_0_draft.js | 72,76 | function | helper functions |
| code_shared_text_v3_0_0_draft.js | 20-23 | function | exported helper functions |
| code_shared_collection_v3_0_0_draft.js | 169,173 | function | reduce callback |
| code_shared_code_inspector_v2_2_0_draft.js | many | function | throughout file |

These are pre-existing violations in shared utilities not owned by agent_3. They should be addressed by the respective owners.

## Controlled Words Usage (Allowed)

| File | Line | Word | Context |
|---|---|---|---|
| code_shared_validation_word_datasets_v3_0_0_draft.js | 61 | optimize, optimise, evolve, mutate | controlled words list (policy) |
| code_shared_validation_word_datasets_v3_0_0_draft.js | 812 | optimize | pipeline stage name list |
| definition_repository_operation_entity_v1_0_0_draft.md | 33 | mutate | "must not mutate" (policy) |

## Post-Fix Verification

```
node --test test\language_and_knowledge\agent_3_agent_lang_and_memory_an_app_brain_*_test.mjs
37 tests discovered
37 passed
0 failed
```

## False Positives (Not Naming Violations)

| File | Line | Hit | Reason Not Violation |
|---|---|---|---|
| module_load_v1_0_0_test.mjs | 8 | `typeof ... === "function"` | JS runtime type check using keyword, not a name |

Production Agent 3 code no longer uses the nested `function` helper. Remaining
mentions are policy/report/test-runtime language only.

## Conclusion

Agent 3 code is now clean of banned words. All naming violations fixed. All allowed mentions documented. False positives identified. Existing dot code violations are outside agent_3 scope.
