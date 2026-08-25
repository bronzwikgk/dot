# Schema Contract: version_record

Date: 2026-08-25
Owner agent: agent_codex_an_app
Owner domain: version_system
Status: draft

## Purpose

Define the entity-level snapshot record.

## Required Fields

| Field | Type | Rule |
| --- | --- | --- |
| `id` | text | required |
| `type` | text | must be `version_record` |
| `attributes.entity_id` | reference | required |
| `attributes.parent_version_ids` | list | defaults to empty list |
| `attributes.summary` | text | required |
| `attributes.created_by` | text | required |
| `attributes.created_at` | timestamp | required |
| `attributes.validation_result` | map | required |
| `data` | map | required entity payload |

## Validation

- snapshot target must have `id`
- snapshot payload must be preserved in `data`
- restore rejects version records without object payload
- provenance trace reads from version attributes only
