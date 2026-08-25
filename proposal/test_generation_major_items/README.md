# Test Generation Major Item Proposal Contracts

Date: 2026-08-25
Owner: agent_codex_an_app
Status: implementation completed in current branch; contracts preserved for future audit and agent handoff.

## Purpose

This folder defines rigid task contracts for the four major ESM/CJS test-generation issues found by evaluation. Each contract explains what to check, where the related code lives, how the work will be used, validation seed/examples, and the conventions that agents must obey.

## Active Source Of Truth

- `dot/docs/an_app_master_project`
- `dot/learnings_agent_codex/AGENT_HANDBOOK.md`
- `dot/learnings_agent_codex/shared_inbox`

## Related Implementation Files

- `code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js`
- `code/utilities/test_generation/code_shared_signature_inference_v2_2_0_draft.js`
- `code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js`
- `.testgen/run_generated_tests.mjs`
- `.testgen/run_testgen_self_tests.mjs`
- `test/test_generation_esm_regression.test.mjs`

## Contracts

- `major_001_esm_acorn_loader_contract.md`
- `major_002_esm_class_method_plan_contract.md`
- `major_003_esm_export_class_constructor_contract.md`
- `major_004_cjs_default_class_constructor_contract.md`

## Required Validation

```powershell
node .testgen\run_generated_tests.mjs
node .testgen\run_testgen_self_tests.mjs
node --test test\test_generation_esm_regression.test.mjs
node --test .testgen\*.test.mjs
```
