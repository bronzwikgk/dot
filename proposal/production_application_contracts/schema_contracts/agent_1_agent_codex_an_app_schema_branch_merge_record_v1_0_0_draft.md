# Schema Contract: branch_merge_record

Date: 2026-08-25
Owner agent: agent_codex_an_app
Owner domain: version_system
Status: draft

## Purpose

Define branch and merge behavior for entity-level versions.

## Branch Required Fields

| Field | Type | Rule |
| --- | --- | --- |
| `id` | text | required |
| `type` | text | must be `branch_record` |
| `attributes.entity_id` | reference | required |
| `attributes.base_version_id` | reference | optional |
| `attributes.branch_status` | text | defaults to `draft` |
| `attributes.owner` | text | required |

## Merge Required Fields

| Field | Type | Rule |
| --- | --- | --- |
| `type` | text | must be `merge_record` |
| `merged` | map | proposed merged entity |
| `conflicts` | list | conflict records |
| `conflict_count` | number | must equal conflict count |
| `validation_result` | map | required |

## Validation

- use three-way merge when base, current, and incoming are available
- auto-merge only when current and incoming do not change the same path
  differently
- conflict records must include path, base, current, incoming, and status
- conflicts require review before active state changes
