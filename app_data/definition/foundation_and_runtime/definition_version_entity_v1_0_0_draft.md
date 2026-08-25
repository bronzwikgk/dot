# Entity Definition: version_record

Owner domain: version_system
Owner agent: agent_codex_an_app
Status: draft

## Purpose

Defines an entity-level version snapshot.

## Fields

- `id`
- `type`
- `name`
- `status`
- `relationships`
- `attributes.entity_id`
- `attributes.parent_version_ids`
- `attributes.summary`
- `attributes.created_by`
- `attributes.created_at`
- `attributes.validation_result`
- `data`

## Relationships

- version_record `documents` entity

## Validation

- entity id required
- version id required
- snapshot payload must be preserved in `data`
- restore must produce audit evidence
