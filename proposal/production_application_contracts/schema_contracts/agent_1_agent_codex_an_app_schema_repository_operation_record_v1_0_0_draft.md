# Schema Contract: repository_operation_record

Date: 2026-08-25
Owner agent: agent_codex_an_app
Owner domain: repository_operations
Status: draft

## Purpose

Define read-only repository status, diff, and commit proposal records.

## Required Fields

| Field | Type | Rule |
| --- | --- | --- |
| `id` | text | required |
| `type` | text | `repository_status`, `repository_diff`, or `commit_proposal` |
| `status` | text | required |
| `attributes.repository_path` | text | required for status/diff |
| `attributes.read_only` | boolean | must be true for status/diff |
| `attributes.created_by` | text | required |
| `attributes.created_at` | timestamp | required |
| `data.changed_files` | list | required for status/proposal |
| `data.diff_text` | text | required for diff |
| `data.validation` | map | required for proposal |
| `data.tests` | list | required for proposal |

## Validation

- allowed Git commands are `status`, `diff`, `log`, `show`, `rev-parse`, and
  `branch`
- mutating Git commands such as `commit`, `push`, `merge`, `reset`, `checkout`,
  and `clean` are rejected
- commit proposal requires message, reason, changed files, validation, and test
  evidence
- provider credentials must never be persisted
