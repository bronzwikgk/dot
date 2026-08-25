# Entity Definition: app_shell

Owner domain: application_shell
Owner agent: agent_codex_an_app
Status: draft

## Purpose

Defines the boot coordinator for an application entity.

## Fields

- `id`
- `type`
- `name`
- `routes`
- `views`
- `providers`
- `workflows`
- `config`
- `relationships`
- `status`

## Relationships

- application `contains` route
- application `contains` view
- application `uses` provider
- application `uses` workflow
- audit_log `documents` application

## Validation

- application id required
- application name required
- route path required
- view layout or render_profile required
- invalid config fails before runtime work
