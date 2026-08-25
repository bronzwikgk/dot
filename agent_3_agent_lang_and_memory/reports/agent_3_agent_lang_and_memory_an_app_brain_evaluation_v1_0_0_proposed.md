# Agent 3 An App Brain Evaluation

Date: 2026-08-25
Status: proposed
Reviewer: agent_codex_an_app
Owner agent: agent_lang_and_memory
Current branch checked: `wip_dot_v3`
Expected agent branch: `dot_agent_lang_and_memory_v1`
Merge target branch: `wip_dot_v3`

## Summary

Agent 3 improved the An App Brain work substantially. The previous plugin folder
is gone, a single ESM plugin file now exists, and the requested
language_and_knowledge tests exist.

The lane is not merge-ready yet because one Agent 3 test fails and the code
still violates the no-arrow-callback convention.

## Files Evaluated

- `code/plugins/an_app_brain_v1_4_0_draft.js`
- `docs/code_shared_an_app_brain_v1_4_0_draft.md`
- `log/code_shared_an_app_brain_v1_4_0_draft.log.md`
- `test/language_and_knowledge/agent_3_agent_lang_and_memory_an_app_brain_module_load_v1_0_0_test.mjs`
- `test/language_and_knowledge/agent_3_agent_lang_and_memory_an_app_brain_record_shape_v1_0_0_test.mjs`
- `test/language_and_knowledge/agent_3_agent_lang_and_memory_an_app_brain_boundary_policy_v1_0_0_test.mjs`

## Validation Run

Command:

```powershell
node --test test\language_and_knowledge\agent_3_agent_lang_and_memory_an_app_brain_*_test.mjs
```

Result:

```text
37 tests discovered
36 passed
1 failed
```

Failing test:

```text
decomposition stops at max_depth
Expected false !== true for recursion_stopped
```

## Issues

| Issue Id | Severity | File | Problem | Fix |
| --- | --- | --- | --- | --- |
| agent_3_eval_001 | major | `test/language_and_knowledge/agent_3_agent_lang_and_memory_an_app_brain_boundary_policy_v1_0_0_test.mjs` | `decomposition stops at max_depth` fails because `recursion_stopped` remains false when max depth is reached. | Update decomposition recursion logic so reaching `max_depth` records `recursion_stopped: true` and `stop_reason: "max_depth"` consistently, or correct the test only if the approved policy says depth equal to max depth is not a stop. |
| agent_3_eval_002 | major | `code/plugins/an_app_brain_v1_4_0_draft.js` | Code uses arrow callbacks despite the coding convention. | Replace arrow callbacks with class methods or approved non-arrow callbacks before merge. |
| agent_3_eval_003 | major | branch governance | Work appears on `wip_dot_v3`, but the new rule requires Agent 3 work to happen on `dot_agent_lang_and_memory_v1` before merge. | Move remaining Agent 3 work to the Agent 3 branch, validate there, then merge after gates pass. |
| agent_3_eval_004 | minor | tests | Test fixture uses source-like string `"src"` in failure/pattern tests. | Rename fixture values to approved neutral values such as `source_ref`. |
| agent_3_eval_005 | minor | plugin header | Header says prototype path `dot/proposal/prototypes/an_app_brain_v1_4_0_prototype/`, but active code is under `code/plugins`. | Update header/doc/log to honestly state current status and approved branch location. |

## Positive Changes

- ESM module loading now works.
- Agent 3 required test files now exist.
- The old multi-file plugin folder is no longer present.
- The plugin uses class/config/constructor/method shape at the public API level.
- The module has no hard dependency on Agent 1 or Agent 2.
- `ingestion_record` now includes `session_id`.
- Boundary and approval tests exist.

## Merge Decision

Do not merge Agent 3 work into `wip_dot_v3` as complete until:

- all Agent 3 tests pass
- arrow callbacks are removed or explicitly waived
- branch rule is followed through `dot_agent_lang_and_memory_v1`
- docs/logs match actual implementation status
- Agent 3 provides handoff with tests, audit, skipped checks, and risks

## Agent 3 Next Action

Agent 3 should fix `agent_3_eval_001` first, then remove convention violations,
then rerun:

```powershell
node --test test\language_and_knowledge\agent_3_agent_lang_and_memory_an_app_brain_*_test.mjs
```
