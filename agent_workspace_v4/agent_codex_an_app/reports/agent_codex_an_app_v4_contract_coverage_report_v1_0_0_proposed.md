# Agent Codex An App V4 Contract Coverage Report

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`

## Summary

All 12 V4 contracts requested by the V3-to-V4 proposal now exist in the
branch-local V4 workspace.

## Coverage

| Contract ID | Status | File |
|---|---|---|
| v4_contract_001 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_001_command_registry_v1_0_0_proposed.md` |
| v4_contract_002 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_002_editor_focus_v1_0_0_proposed.md` |
| v4_contract_003 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_003_book_cell_operations_v1_0_0_proposed.md` |
| v4_contract_004 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_004_search_and_status_v1_0_0_proposed.md` |
| v4_contract_005 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_005_layout_parity_v1_0_0_proposed.md` |
| v4_contract_006 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_006_browser_e2e_gate_v1_0_0_proposed.md` |
| v4_contract_007 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_007_persistence_version_undo_v1_0_0_proposed.md` |
| v4_contract_008 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_008_import_export_offline_v1_0_0_proposed.md` |
| v4_contract_009 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_009_cell_command_language_v1_0_0_proposed.md` |
| v4_contract_010 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_010_definition_runtime_dependency_v1_0_0_proposed.md` |
| v4_contract_011 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_011_policy_and_cache_v1_0_0_proposed.md` |
| v4_contract_012 | covered | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_012_entry_mount_view_frame_v1_0_0_proposed.md` |

## Backlog Coverage

The contracts cover all V4 backlog groups:

- command registry and keyboard binding
- editor mode, focus, and cell row layout
- book/cell operations and cell execution
- search and status
- layout parity
- browser e2e gate
- persistence, version, undo, redo
- import/export/offline
- command language
- definition/runtime/dependency
- policy/cache
- entry/mount/view frame

## Finding

Contract coverage is complete enough to begin P0 implementation. Contracts are
still `proposed`; promotion requires implementation evidence and tests.
