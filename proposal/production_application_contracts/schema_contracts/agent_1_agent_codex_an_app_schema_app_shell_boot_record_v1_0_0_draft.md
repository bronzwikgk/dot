# Schema Contract: app_shell_boot_record

Date: 2026-08-25
Owner agent: agent_codex_an_app
Owner domain: application_shell
Status: draft

## Purpose

Define the boot record produced by `app_shell`.

## Required Fields

| Field | Type | Rule |
| --- | --- | --- |
| `id` | text | required, starts with `boot_` |
| `application_id` | reference | required |
| `status` | text | required, `completed` or `failed` |
| `routes` | list | route entity ids |
| `views` | list | view entity ids |
| `providers` | list | provider entity ids |
| `workflows` | list | workflow entity ids |
| `audit_id` | reference | required when completed |

## Validation

- invalid application input fails before child records are created
- route path starts with `/`
- child ids are unique
- workflow plans validate before registration
- audit record is created on successful boot
