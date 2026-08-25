# Agent Codex An App V4 Pending Work Tracker

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`

## Status Legend

- `pending`: not started
- `active`: currently being implemented
- `blocked`: waiting on user decision or missing dependency
- `validated`: tests/report pass in workspace
- `ready_for_transfer`: clean enough to promote from workspace

## Lock And Validation

| Item ID | Priority | Status | Work |
|---|---|---|---|
| v4_lock_001 | p0 | validated | V4 single-owner proposal update |
| v4_lock_002 | p0 | validated | V4 inventory report |
| v4_lock_003 | p0 | validated | V4 contract coverage report |
| v4_lock_004 | p0 | validated | V4 doc/log coverage report |
| v4_lock_005 | p0 | validated | V4 app_data validation report |
| v4_lock_006 | p0 | validated | V4 convention scan classification report |

## P0 Implementation

| Item ID | Priority | Status | Work |
|---|---|---|---|
| v4_missing_001 | p0 | validated | unified command registry |
| v4_missing_002 | p0 | validated | edit/command mode gating |
| v4_missing_003 | p0 | validated | focus-preserving renders |
| v4_missing_004 | p0 | validated | rail outside cell layout |
| v4_missing_005 | p0 | validated | browser boot marker contract |
| v4_missing_011 | p0 | validated | global search |
| v4_missing_013 | p0 | validated | browser boot-failure test/benchmark short-circuit |
| v4_missing_018 | p0 | validated | full browser health e2e |
| v4_missing_019 | p0 | validated | browser focus editing e2e |
| v4_missing_020 | p0 | validated | browser search e2e |
| v4_missing_021 | p0 | validated | cell execution for natural language, code, markdown |
| v4_missing_022 | p0 | validated | live book/cell create/move/delete |
| v4_missing_024 | p0 | validated | keyboard shortcut registry and e2e |
| v4_missing_027 | p0 | validated | run all and DAG dependency behavior in UI |
| v4_missing_033 | p0 | validated | layout parity |
| v4_missing_035 | p0 | validated | project/product definition markdown schema |
| v4_missing_036 | p0 | validated | runtime detection and dependency resolution |
| v4_missing_037 | p0 | validated | browser entry and mount resolver |

## Contract Progress

| Contract ID | Status | File |
|---|---|---|
| v4_contract_001 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_001_command_registry_v1_0_0_proposed.md` |
| v4_contract_002 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_002_editor_focus_v1_0_0_proposed.md` |
| v4_contract_003 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_003_book_cell_operations_v1_0_0_proposed.md` |
| v4_contract_004 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_004_search_and_status_v1_0_0_proposed.md` |
| v4_contract_005 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_005_layout_parity_v1_0_0_proposed.md` |
| v4_contract_006 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_006_browser_e2e_gate_v1_0_0_proposed.md` |
| v4_contract_007 | proposed | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_007_persistence_version_undo_v1_0_0_proposed.md` |
| v4_contract_008 | proposed | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_008_import_export_offline_v1_0_0_proposed.md` |
| v4_contract_009 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_009_cell_command_language_v1_0_0_proposed.md` |
| v4_contract_010 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_010_definition_runtime_dependency_v1_0_0_proposed.md` |
| v4_contract_011 | proposed | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_011_policy_and_cache_v1_0_0_proposed.md` |
| v4_contract_012 | validated | `agent_workspace_v4/agent_codex_an_app/proposal/agent_codex_an_app_v4_contract_012_entry_mount_view_frame_v1_0_0_proposed.md` |

## P1 Implementation

| Item ID | Priority | Status | Work |
|---|---|---|---|
| v4_missing_006 | p1 | pending | template store/composer/tree renderer boundary decision |
| v4_missing_007 | p1 | pending | manifest/inventory stale entry validation |
| v4_missing_008 | p1 | pending | docs route links to module paths |
| v4_missing_009 | p1 | pending | offline icon/package asset policy |
| v4_missing_010 | p1 | pending | relative config path anchoring |
| v4_missing_014 | p1 | pending | storage selftest and storage key validation |
| v4_missing_015 | p1 | pending | storage errors surfaced in status bar |
| v4_missing_016 | p1 | pending | local static server hardening |
| v4_missing_017 | p1 | pending | import confirmation for executable code cells |
| v4_missing_023 | p1 | pending | persistence across reload |
| v4_missing_025 | p1 | pending | version-backed undo/redo |
| v4_missing_026 | p1 | pending | six-template gallery cards |
| v4_missing_028 | p1 | pending | editable flow builder diagram canvas |
| v4_missing_029 | p1 | pending | export/import files |
| v4_missing_030 | p1 | pending | docs routing and hash deep links |
| v4_missing_034 | p1 | pending | offline capability and zero CDN references |
| v4_missing_038 | p1 | pending | policy datasets and policy validation |
| v4_missing_039 | p1 | pending | shell cache backed by action_entity |
| v4_missing_040 | p1 | pending | default listener and view frame resolution |

## P2 Implementation

| Item ID | Priority | Status | Work |
|---|---|---|---|
| v4_missing_012 | p2 | pending | demo/tour highlight selector |
| v4_missing_031 | p2 | pending | guided tour |
| v4_missing_032 | p2 | pending | canvas drag/drop and chained flow run |
