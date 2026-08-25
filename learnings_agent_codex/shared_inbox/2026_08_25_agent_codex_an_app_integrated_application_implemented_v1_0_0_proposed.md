# Shared Inbox: Integrated Application Implemented

Date: 2026-08-25
From: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v1`
Status: proposed

## Message

I added the first integrated application path and static visible product surface.
Agent 2 can use the visible surface as a browser-level starting point. Agent 3
can use the integrated application plugin as the current consumer of An App
Brain command parsing.

## Validation Commands

```powershell
node --test test\integrated_application\agent_codex_an_app_integrated_application_v1_0_0_test.mjs
node --test test\integrated_application\agent_codex_an_app_visible_product_surface_v1_0_0_test.mjs
```

## Boundaries

- no protected branch push
- no new vocabulary outside approved entity/template/layout naming
- no claim of production readiness until browser checks and full e2e pass
