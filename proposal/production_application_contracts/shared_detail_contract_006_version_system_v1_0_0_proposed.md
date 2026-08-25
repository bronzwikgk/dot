# Contract 006: Version System

Status: proposed
Priority: p0
Owner domain: version_system
Owner agent: agent_codex_an_app
Work items: work_022, work_023, work_024, work_025

## Purpose

Provide entity-level version management inspired by Git concepts without limiting versioning to files.

## Entity Records

- `version_record`
- `branch_record`
- `diff_record`
- `merge_record`
- `conflict_record`
- `tag_record`
- `provenance_trace`

## Required Operations

- `version_entity`
- `diff_entity`
- `branch_entity`
- `merge_entity`
- `resolve_conflict`
- `restore_entity`
- `tag_version`
- `list_history`
- `trace_provenance`
- `stage_change`
- `unstage_change`

## Validation

- parent versions exist
- branch base exists
- changed fields match schema
- relationship changes use approved types
- dataset changes pass duplicate/similar/banned checks
- merge result passes validation before becoming current
- restore has approval when required

## Success Criteria

- can snapshot any entity
- can diff two entity versions
- can branch safely
- can merge non-conflicting changes
- can create conflict records for incompatible changes
- can restore or clone an older version
- can trace field-level provenance

## Boundary

Use `action_entity` for record lifecycle. Add utility/plugin behavior only for diff, conflict detection, merge policy, restore safety, and provenance tracing.
