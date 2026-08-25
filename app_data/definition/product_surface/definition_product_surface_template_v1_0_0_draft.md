# Product Surface Template Definition

Date: 2026-08-25
Status: draft
Owner agent: agent_ui_application
Implemented by: agent_codex_an_app

## Purpose

Define editable template entities that expand into application entities.

## Required Template Fields

- `id`
- `type`
- `name`
- `domain`
- `application`
- `routes`
- `views`
- `workflows`
- `policies`
- `sample_data`

## Approved Domains

- `lms`
- `fintech_organization`
- `single_user_workspace`
- `research_workflow`
- `automation_workflow`
- `application_builder`

## Validation

Templates validate through `product_surface.validate_template()` before they are
registered or expanded.
