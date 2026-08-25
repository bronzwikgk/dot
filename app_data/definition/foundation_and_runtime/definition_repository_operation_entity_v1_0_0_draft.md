# Entity Definition: repository_operation

Owner domain: repository_operations
Owner agent: agent_codex_an_app
Status: draft

## Purpose

Defines read-only repository status, diff, and commit proposal records.

## Fields

- `id`
- `type`
- `name`
- `status`
- `attributes.repository_path`
- `attributes.read_only`
- `attributes.created_by`
- `attributes.created_at`
- `data.changed_files`
- `data.diff_text`
- `data.validation`
- `data.tests`

## Relationships

- commit_proposal `documents` repository_status
- repository_diff `documents` repository_status

## Validation

- read-only inspection must not mutate repository history
- commit proposal requires message, reason, changed files, and validation
- provider credentials must not be stored
