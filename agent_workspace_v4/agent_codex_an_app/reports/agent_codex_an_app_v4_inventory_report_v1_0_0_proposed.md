# Agent Codex An App V4 Inventory Report

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`

## Scope

Inventory was taken from the current `dot` repository after the `wip_dot_v4`
baseline and before V4 code implementation.

## Top-Level Inventory

| Area | Count | Notes |
|---|---:|---|
| `code/plugins` | 13 | promoted runtime/plugin classes including app shell, action entity, product surface, integrated application, An App Brain |
| `code/utilities` | 15 | shared utilities, datasets, and test generation utilities |
| `app_data` | 15 | structure docs plus product surface datasets/datamap/data_table/definitions |
| `templates/product_surface` | 6 | LMS, fintech organization, single user workspace, research workflow, automation workflow, application builder |
| `docs` | 45 | shared utility/plugin docs, master docs, policy docs, domain docs |
| `proposal` | 58 | parent contracts, shared detail contracts, schema contracts, prototypes, V4 proposal |
| `log` | 34 | shared utility/plugin logs and implementation logs |
| `reports` | 13 | foundation, product surface, integrated app, language/knowledge, release validation |
| `test` | 8 | release-facing Node test files |
| `html/product_surface` | 3 | static visible product surface HTML/CSS/JS |
| `agent_workspace_v4/agent_codex_an_app` | 16 | branch-local V4 workspace docs, contracts, reports, logs, handoff |

## Promoted Runtime Code Inventory

| File | Type | Status |
|---|---|---|
| `code/plugins/code_shared_action_entity_v3_1_0_draft.js` | plugin | promoted draft |
| `code/plugins/code_shared_app_shell_v3_0_0_draft.js` | plugin | promoted draft |
| `code/plugins/code_shared_version_system_v3_0_0_draft.js` | plugin | promoted draft |
| `code/plugins/code_shared_repository_operations_v3_0_0_draft.js` | plugin | promoted draft |
| `code/plugins/code_shared_product_surface_v3_0_0_draft.js` | plugin | promoted draft |
| `code/plugins/code_shared_integrated_application_v3_0_0_draft.js` | plugin | promoted draft |
| `code/plugins/an_app_brain_v1_4_0_draft.js` | plugin | promoted draft |
| `code/plugins/code_shared_runner_v3_0_0_draft.js` | plugin | promoted draft |
| `code/plugins/code_shared_validator_v3_0_0_draft.js` | plugin | promoted draft |
| `code/plugins/code_shared_logger_v3_0_0_draft.js` | plugin | promoted draft |

## V4 Workspace Inventory

| Folder | Status |
|---|---|
| `agent_workspace_v4/agent_codex_an_app/docs` | created |
| `agent_workspace_v4/agent_codex_an_app/proposal` | 12 contracts created |
| `agent_workspace_v4/agent_codex_an_app/reports` | tracker and validation reports |
| `agent_workspace_v4/agent_codex_an_app/logs` | workspace log created |
| `agent_workspace_v4/agent_codex_an_app/handoff` | handoff log created |
| `agent_workspace_v4/agent_codex_an_app/tests` | pending |
| `agent_workspace_v4/agent_codex_an_app/templates` | pending |
| `agent_workspace_v4/agent_codex_an_app/app_data` | pending |
| `agent_workspace_v4/agent_codex_an_app/user_data` | pending |

## Finding

The V4 branch has enough inventory evidence to begin contract-led
implementation. The V4 workspace is intentionally branch-local and should not be
promoted as a whole folder.
