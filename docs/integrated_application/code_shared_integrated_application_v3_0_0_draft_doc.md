# Integrated Application Plugin

Date: 2026-08-25
Status: draft
Owner agent: agent_codex_an_app
Implemented by: agent_codex_an_app

## What It Is

`integrated_application` is the first stitched An App runtime path. It binds the
application shell, product surface, version system, and An App Brain into one
testable pipeline without replacing those modules.

## What It Does

- parses a user command through An App Brain
- selects an approved production template
- creates an application entity from the selected template
- boots the application shell
- creates a version snapshot for the application entity
- creates preview and layout projections
- produces a release gate report for the stitched path

## When To Use

Use this plugin for smoke testing the real app direction across Agent 1, Agent 2,
and Agent 3 work lanes. It is the current bridge from command input to a valid
application entity and preview-ready product surface.

## Related Modules

- `code/plugins/code_shared_app_shell_v3_0_0_draft.js`
- `code/plugins/code_shared_product_surface_v3_0_0_draft.js`
- `code/plugins/code_shared_version_system_v3_0_0_draft.js`
- `code/plugins/an_app_brain_v1_4_0_draft.js`

## Visible Surface

- `html/product_surface/an_app_product_surface_v1_0_0_draft.html`
- `html/product_surface/an_app_product_surface_v1_0_0_draft.css`
- `html/product_surface/an_app_product_surface_v1_0_0_draft.js`

The visible surface is a static browser preview for template selection, command
selection, layout projection, preview path, and audit display.

## How Tested

Run:

```powershell
node --test test\integrated_application\agent_codex_an_app_integrated_application_v1_0_0_test.mjs
node --test test\integrated_application\agent_codex_an_app_visible_product_surface_v1_0_0_test.mjs
```

Tests cover command parsing, template selection, application creation, shell
boot, version snapshot, release gate checks, blocked command boundaries, and
static visible surface hooks.

## Known Limits

- browser screenshot validation is still pending
- repository handoff is represented by version output, not a full git write path
- product editing is represented as template/application projection, not live
  persisted browser state yet
