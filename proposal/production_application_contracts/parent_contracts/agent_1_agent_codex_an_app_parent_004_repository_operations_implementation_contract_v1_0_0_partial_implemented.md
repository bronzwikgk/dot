# Parent Contract 004: Repository Operations Implementation

Status: partial_implemented
Priority: p1
Owner agent: agent_codex_an_app
Delivery lane: provider_and_operations

## Goal

Implement governed repository inspection and automation support for status, diff, commit proposals, workflow runs, artifacts, logs, dispatch requests, and repository-provider boundaries.

## Subcontracts

- ../shared_detail_contract_005_action_entity_boundary_v1_0_0_proposed.md
- ../shared_detail_contract_006_version_system_v1_0_0_proposed.md
- ../shared_detail_contract_007_workflow_pipeline_runner_v1_0_0_proposed.md
- ../shared_detail_contract_008_provider_storage_index_v1_0_0_proposed.md
- ../shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md
- ../shared_detail_contract_016_repository_operations_v1_0_0_proposed.md

## Required Output

- repository record schema
- repository provider config
- status inspection operation
- diff inspection operation
- commit proposal operation
- workflow run record operation
- artifact/log collection operation
- approval and audit rules

## Success Criteria

- repository operations can run in read-only mode
- commit proposal includes changed files, reason, validation, tests, and risk notes
- workflow runs, artifacts, and logs are entities
- provider credentials are never persisted in docs/logs
- risky provider mutation requires approval

## Implementation Evidence

- `code/plugins/code_shared_repository_operations_v3_0_0_draft.js`
- `docs/foundation_and_runtime/code_shared_repository_operations_v3_0_0_draft_doc.md`
- `app_data/definition/foundation_and_runtime/definition_repository_operation_entity_v1_0_0_draft.md`
- `test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs`

Validation passed on 2026-08-25 for read-only status inspection, commit
proposal validation, and mutating Git command rejection.

## Completed Scope

- repository operation record definition
- read-only repository status inspection boundary
- read-only diff operation boundary
- commit proposal record validation
- mutating Git command rejection
- secret persistence prohibition documented
- provider policy boundary documented

## Pending Integration Scope

- workflow run, artifact, and log entities need implementation in a later
  operations batch
- commit proposal may be wired to GitHub Desktop handoff after user approval
- provider-backed remote operations remain blocked until explicit approval

## Required Validation Command

```powershell
node --test test\foundation_and_runtime\agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs
```

## Handoff Status

Agent 1 repository operation contract is ready for commit as partial
implementation. Current implementation is intentionally read-only except commit
proposal creation.

## Do Not

- do not push, merge, delete, deploy, or rotate secrets without approval
- do not store secrets in entity records
- do not bypass provider policy
