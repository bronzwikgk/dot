# Contract 014: Quality Audit E2E

Status: proposed
Priority: p0
Owner domain: quality_audit
Work items: work_015, work_025 and all production readiness gates

## Purpose

Define the e2e validation and success criteria for the production-grade An App batch.

## E2E Validation Layers

1. source intake inventory
2. dataset validation
3. schema validation
4. entity lifecycle
5. relationship validation
6. pipeline execution
7. runner validation
8. plugin validation
9. artifact checklist
10. version/diff/history validation
11. audit report
12. user-facing output

## Required Evidence

- test command output
- generated test report
- focused regression tests
- source coverage report
- dataset registry report
- schema validation report
- artifact checklist report
- e2e run record
- known limits
- commit message

## Success Criteria

- no critical or major defects open for the batch scope
- all must requirements have implementation state at least partial with clear next action
- active app can run a sample business workflow
- same entity data can render in more than one layout
- generated artifacts have docs/log/audit
- failures are visible and actionable

## Do Not

- do not treat generated tests alone as correctness proof
- do not call a batch production-ready without e2e evidence
