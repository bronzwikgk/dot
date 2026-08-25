# Contract 016: Repository Operations

Status: proposed
Priority: p1
Owner domain: repository_operations
Owner agent: agent_codex_an_app
Source coverage: github_dump/dump/inbox_AnGitAgent_inbox

## Purpose

Define how An App may inspect and coordinate repository work while keeping actual mutation governed by approval, audit, and version policy.

Repository work is an entity workflow. A repository, branch, commit proposal, diff, workflow run, artifact, log, and conflict are all entity records.

## Related Contracts

- contract_005_action_entity_boundary_contract.md
- contract_006_version_system_contract.md
- contract_007_workflow_pipeline_runner_contract.md
- contract_008_provider_storage_index_contract.md
- contract_011_an_bot_agent_contract.md
- contract_014_quality_audit_e2e_contract.md
- contract_015_external_intake_file_conversion_contract.md

## Required Records

- repository_record
- repository_provider_record
- branch_record
- commit_proposal
- diff_record
- merge_record
- conflict_record
- workflow_run_record
- workflow_artifact
- workflow_log
- repository_dispatch_request
- repository_operation_audit

## Required Operations

- inspect_repository
- check_status
- read_diff
- create_commit_proposal
- validate_commit_proposal
- create_branch_record
- compare_branch
- create_merge_record
- resolve_conflict
- request_workflow_run
- inspect_workflow_run
- collect_workflow_artifacts
- collect_workflow_logs

## Inputs

- repository_ref
- provider_ref
- actor_ref
- operation_name
- permission_policy
- approval_policy
- branch_ref
- change_set
- workflow_ref
- external_payload

## Outputs

- operation_result
- audit_report
- diff_record
- conflict_record
- commit_proposal
- workflow_run_record
- workflow_artifact
- workflow_log

## Validation

- repository provider is approved
- actor has permission for the requested operation
- external payload schema is known
- branch base exists before branch or merge work
- commit proposal includes changed files, reason, tests, and risk notes
- merge policy validates before merge is marked ready
- conflicts are explicit records, not hidden text
- secrets are never written to docs, logs, or artifacts
- provider failures return structured errors
- every risky operation has approval evidence

## Success Criteria

- can inspect repository status without mutation
- can produce a commit proposal with validation evidence
- can map GitHub/GitLab workflow runs to entity records
- can collect workflow artifacts and logs as auditable records
- can create conflict records for branch, merge, file, schema, dataset, workflow, and name conflicts
- can hand off final push/merge decisions to the user or approved provider policy

## Do

- reuse `action_entity` for lifecycle storage
- reuse version-system records for branch, diff, merge, conflict, and history
- keep provider-specific behavior behind provider config
- keep all operation names snake_case
- write a log for each repository operation batch

## Do Not

- do not push, merge, delete branches, rotate secrets, or trigger external deployment without approval
- do not add a new repository-specific manager class while `action_entity` can own the record lifecycle
- do not store tokens or secrets in docs/logs
- do not use source-only names from the inbox if an approved An App name already exists

## Handoff Notes

AnGitAgent inbox includes GitHub Actions and GitLab CI/CD ideas. For An App, these should be adopted as provider-backed repository operations, not as a separate product doctrine. Use this contract when implementing repository inspection, dispatch, workflow run collection, artifact collection, log collection, and commit proposal flows.
