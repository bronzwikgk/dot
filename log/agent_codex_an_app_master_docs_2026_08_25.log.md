# Agent Codex An App Master Docs Promotion Log

Date: 2026-08-25
Agent name: agent_codex_an_app
Scope: evaluation of recent dot code/docs/log updates, naming policy follow-up, and master project document promotion.

## Source Documents Promoted

- `scratchpad_entity_system/docs/08_master_project/AN_APP_MASTER_PROJECT_DOCUMENT.md`
- `scratchpad_entity_system/docs/08_master_project/AN_APP_REQUIREMENTS_AND_SPEC.md`
- `scratchpad_entity_system/docs/08_master_project/AN_APP_INPUT_AND_ARTIFACT_CHECKLIST.md`
- `scratchpad_entity_system/docs/08_master_project/AN_APP_PENDING_WORK_TRACKER.md`

## Destination

- `docs/an_app_master_project/an_app_master_project_document.md`
- `docs/an_app_master_project/an_app_requirements_and_spec.md`
- `docs/an_app_master_project/an_app_input_and_artifact_checklist.md`
- `docs/an_app_master_project/an_app_pending_work_tracker.md`

## Evaluation Summary

- The `dot` repository was clean before this pass.
- Recent runner documentation and log entries describe the expected snake_case API and the runner boundary updates.
- The code scan found one remaining avoidable project term in the runner constructor input.
- Updated `code_shared_runner_v3_0_0_draft.js` to use `config` for that constructor input; no public behavior changed.
- After the update, the banned/avoidable code-name scan returned no matches for the checked terms.

## Validation

- Regenerated generated tests with `.testgen/run_generated_tests.mjs`.
- Regenerated test-generation self-tests with `.testgen/run_testgen_self_tests.mjs`.
- Executed generated tests with `node --test .testgen/*.test.mjs`.
- Result: `1296` tests passed, `0` failed, `0` skipped.

## Notes For Future Agents

- The promoted master docs are planning and product-scope documents, not executable code.
- Keep implementation work staged utility first, then plugin, then dataset/schema/docs/log, then test.
- Keep naming snake_case and avoid introducing new names when an existing entity/action name can carry the capability.

## 2026-08-25 - Version Management Doctrine Update

- Added Git-inspired version management as entity-level product scope.
- Updated the master project document with snapshot, diff, branch, merge, conflict, status, staging, history, tag, restore, and field provenance concepts.
- Updated requirements/spec with `req_app_027`, version entity records, version states, operations, validation, and merge/conflict policy.
- Updated input/artifact checklist with version, diff, branch, merge, conflict, tag, restore, and provenance checks.
- Updated pending work tracker with version schema, diff/conflict utility, plugin boundary, and test tasks.

## 2026-08-25 - Scratchpad Learning Archive Transfer

- Copied the remaining `scratchpad_entity_system` learning material into `dot/learnings_agent_codex`.
- Preserved docs, datasets, trial code, tests, generated tests, README, package metadata, and scratchpad runner files.
- Added `dot/learnings_agent_codex/LEARNING_ARCHIVE_INDEX.md` to clarify archive purpose, active-master boundary, and adoption policy.
- Transfer validation: source count `78`, destination count `78`.

## 2026-08-25 - Agent Handbook And Shared Inbox

- Added `dot/learnings_agent_codex/AGENT_HANDBOOK.md`.
- Added shared inbox folder at `dot/learnings_agent_codex/shared_inbox`.
- Added inbox README, reusable message template, and first handoff note.
- Handbook covers project context, active source of truth, pending work, development order, testing, e2e validation, evaluation, naming conventions, do/don't rules, version doctrine, and ready-to-push criteria.

## 2026-08-25 - Convention Enforcement Update

- Strengthened the handbook from guidance to enforcement for entity doctrine and naming governance.
- Added a required new-name authorization gate.
- Updated shared inbox protocol so proposed new or similar names must be logged and authorized before implementation.
- Updated inbox template with proposed-name authorization fields.

## 2026-08-25 - Test Generation ESM Major Fixes

- Verified the external evaluation report against current code and confirmed the ESM test-generation cluster was real.
- Fixed Acorn loading under ESM by adding Node `createRequire` usage and adding `acorn` as a dev dependency.
- Added `export_target` propagation so class constructor targets and method exports remain separate.
- Fixed named ESM class methods being dropped from generated plans.
- Fixed ESM named class constructor rendering.
- Fixed CJS default-object class constructor rendering.
- Fixed runner/logger doc command local-name collisions.
- Added focused tracked regression tests and proposal task contracts.
- Validation: `node --test .testgen/*.test.mjs` passed with `1167` tests, `0` failed.

## 2026-08-25 - Production Application Contract Pack

- Added `dot/proposal/production_application_contracts`.
- Created 15 production contracts covering all active pending work groups and production e2e success criteria.
- Added a contract README and validation checklist.
- Contracts enforce entity doctrine, naming authorization, snake_case, validation, testing, docs/logs, and shared inbox handoff.
