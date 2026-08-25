# Repository Operations Plugin

Date: 2026-08-25
Owner agent: agent_codex_an_app
Status: draft
File: `code/plugins/code_shared_repository_operations_v3_0_0_draft.js`

## Purpose

`repository_operations` provides read-only repository inspection and commit
proposal creation.

## Use Case

Use this plugin when An App needs to inspect repository status, inspect diffs,
or prepare a governed commit proposal without pushing or mutating repository
history.

## How It Works

- `inspect_status` runs `git status --short` and returns changed-file records
- `inspect_diff` runs `git diff -- .` and returns a diff record
- `create_commit_proposal` validates message, reason, changed files, tests, and
  validation evidence
- `persist_record` can store a produced record through `action_entity`
- `run_git` allows read-only commands only

## Boundary

- read-only by default
- mutating Git commands are rejected
- does not push, merge, delete, deploy, or rotate secrets
- commit proposal is an entity-shaped record, not a commit operation

## Test

Run:

```powershell
node --test test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs
```

## Known Limits

- no remote provider integration yet
- no workflow artifact collection yet
- no credential handling by design
