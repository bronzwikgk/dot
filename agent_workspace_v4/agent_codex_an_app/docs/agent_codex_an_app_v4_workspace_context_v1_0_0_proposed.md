# Agent Codex An App V4 Workspace Context

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Baseline: `wip_dot_v4`

## Objective

Implement V4 as a single-agent branch-local effort. Work stays inside
`agent_workspace_v4/agent_codex_an_app/` until it is clean enough to promote to
shared repo folders.

## Rules

- only the user pushes protected/shared branches
- no whole workspace folder is promoted directly
- everything is an entity
- no new/similar names without checking approved datasets and docs
- no active V4 work is assigned to other agents
- code must use snake_case names and class/config/constructor/method style
- every promoted item needs docs, logs, tests, and validation evidence

## Source Of Truth

- V4 proposal:
  `proposal/release_validation/agent_1_agent_codex_an_app_wip_dot_v3_to_v4_completeness_validation_proposal_v1_0_0_proposed.md`
- V3 validation report:
  `reports/release_validation/agent_1_agent_codex_an_app_main_validation_report_v1_0_0_proposed.md`

## Workspace Folders

- `app_data`
- `docs`
- `handoff`
- `logs`
- `proposal`
- `reports`
- `templates`
- `tests`
- `user_data`

## Immediate Order

1. lock-readiness reports
2. V4 contracts
3. P0 app definition/runtime/dependency foundation
4. P0 browser entry/mount and command registry
5. P0 book/cell/edit/focus/search/layout/e2e
