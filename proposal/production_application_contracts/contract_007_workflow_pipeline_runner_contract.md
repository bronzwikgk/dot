# Contract 007: Workflow Pipeline Runner

Status: proposed
Priority: p0
Owner domain: workflow_system
Work items: work_002, work_015

## Purpose

Define governed pipeline/workflow execution using the canonical An App stages and existing runner behavior.

## Canonical Pipeline

`ingest -> decompose -> parse -> build_ast -> build_dag -> classify -> validate -> reason -> resolve -> plan -> execute -> compose -> display -> persist -> audit -> respond`

## Outputs

- stage records
- workflow records
- task records
- DAG records
- execution run records
- diagnostics
- audit logs

## Validation

- stage names are approved
- dependencies are known
- cycles fail
- missing task IDs fail
- invalid conditions fail
- skipped work is visible
- approval gates are explicit

## Success Criteria

- run full pipeline
- run one stage
- dry run
- step forward
- step backward when policy allows
- pause/resume/stop
- produce trace output
- preserve audit and version refs

## Do Not

- do not add new universal stages without authorization
- do not hide skipped or failed stages
