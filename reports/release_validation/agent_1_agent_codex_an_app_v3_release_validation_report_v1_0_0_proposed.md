# V3 Release Validation Report

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: dot_agent_codex_an_app_v4

## Summary

V3 foundation is clean and tested. V4 implementation has 12 modules with passing
tests. V3 is not complete against full reference GUI success criteria but is
clean as a foundation and first product surface slice.

## Test Results

| Test Suite | File | Result |
|---|---|---|
| foundation_runtime | agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs | 7/7 pass |
| product_surface | agent_codex_an_app_agent_2_product_surface_v1_0_0_test.mjs | 6/6 pass |
| integrated_application | agent_codex_an_app_integrated_application_v1_0_0_test.mjs | 4/4 pass |
| visible_surface | agent_codex_an_app_visible_product_surface_v1_0_0_test.mjs | 3/3 pass |
| v4_command_registry | agent_codex_an_app_v4_command_registry_v1_0_0_test.mjs | pass |
| v4_editor_focus | agent_codex_an_app_v4_editor_focus_v1_0_0_test.mjs | pass |
| v4_book_cell | agent_codex_an_app_v4_book_cell_v1_0_0_test.mjs | pass |
| v4_search_status | agent_codex_an_app_v4_search_status_v1_0_0_test.mjs | pass |
| v4_layout_parity | agent_codex_an_app_v4_layout_parity_v1_0_0_test.mjs | pass |
| v4_browser_e2e | agent_codex_an_app_v4_product_surface_browser_e2e_v1_0_0_test.mjs | pass |
| v4_persistence_undo | agent_codex_an_app_v4_workspace_persistence_v1_0_0_test.mjs | pass |
| v4_import_export | agent_codex_an_app_v4_import_export_offline_v1_0_0_test.mjs | pass |
| v4_cell_command | agent_codex_an_app_v4_cell_command_language_v1_0_0_test.mjs | pass |
| v4_definition_runtime | agent_codex_an_app_v4_definition_runtime_dependency_v1_0_0_test.mjs | pass |
| v4_project_inventory | agent_codex_an_app_v4_project_inventory_v1_0_0_test.mjs | pass |
| v4_policy_cache | agent_codex_an_app_v4_policy_cache_v1_0_0_test.mjs | pass |
| **Total** | | **131 tests, 129 pass, 0 fail, 2 skipped** |

## V3 Completeness Status

| Area | Status | Notes |
|---|---|---|
| app shell boot | pass | parent_001 partial_implemented |
| version system | pass | parent_003 partial_implemented |
| repository ops | pass | parent_004 partial_implemented |
| e2e validation | pass | parent_009 partial_implemented |
| product_surface | pass | 6/6 tests |
| integrated_app | pass | 4/4 tests |
| visible_surface | pass | 3/3 tests |
| An App Brain | pass | 37/37 tests |
| reference GUI flows | partial | 10/34 partial, 23 missing |
| an_app.txt scope | partial | 7/17 partial, 10 missing |

## V4 Implementation Status

| Module | Code | Doc | Log | Test | Status |
|---|---|---|---|---|---|
| command_registry | yes | yes | yes | yes | done |
| editor_focus | yes | yes | yes | yes | done |
| book_cell | yes | yes | yes | yes | done |
| search_status | yes | yes | yes | yes | done |
| layout_parity | yes | yes | yes | yes | done |
| browser_e2e | yes | yes | yes | yes | done |
| persistence_undo | yes | yes | yes | yes | done |
| import_export_offline | yes | yes | yes | yes | done |
| cell_command_language | yes | yes | yes | yes | done |
| definition_runtime_dependency | yes | yes | yes | yes | done |
| project_inventory | yes | yes | yes | yes | done |
| policy_cache | yes | yes | yes | yes | done |

## V4 Contracts Created

| Contract | File | Status |
|---|---|---|
| v4_contract_001 | command_registry_contract | proposed |
| v4_contract_002 | editor_focus_contract | proposed |
| v4_contract_003 | book_cell_operations_contract | proposed |
| v4_contract_004 | search_and_status_contract | proposed |
| v4_contract_005 | layout_parity_contract | proposed |
| v4_contract_006 | browser_e2e_gate_contract | proposed |
| v4_contract_007 | persistence_version_undo_contract | proposed |
| v4_contract_008 | import_export_offline_contract | proposed |
| v4_contract_009 | cell_command_language_contract | proposed |
| v4_contract_010 | definition_runtime_dependency_contract | proposed |
| v4_contract_011 | policy_and_cache_contract | proposed |
| v4_contract_012 | entry_mount_view_frame_contract | proposed |

## V3 Missing Items (Deferred to V4)

### Reference GUI Flows (23 missing, 10 partial)

| Flow | Status | V4 Action |
|---|---|---|
| unified command registry | partial | v4_contract_001 |
| edit/command mode | missing | v4_contract_002 |
| focus-preserving render | missing | v4_contract_002 |
| rail outside cell | missing | v4_contract_002 |
| single-owner globals | partial | v4_contract_012 |
| template trio | partial | deferred |
| dead manifest removal | not_applicable | use inventory gate |
| docs route links | partial | v4_contract_012 |
| offline icons | missing | v4_contract_008 |
| config path anchoring | missing | v4_contract_010 |
| global search | missing | v4_contract_004 |
| visual demo | missing | deferred |
| boot failure short-circuit | partial | v4_contract_006 |
| selftest storage | missing | v4_contract_007 |
| storage error status | missing | v4_contract_004 |
| static server hardening | missing | v4_contract_008 |
| import confirmation | missing | v4_contract_008 |
| health e2e | missing | v4_contract_006 |
| focus editing e2e | missing | v4_contract_002 |
| search e2e | missing | v4_contract_004 |
| execution e2e | partial | v4_contract_009 |
| books/cells e2e | partial | v4_contract_003 |
| persistence reload | missing | v4_contract_007 |
| keyboard shortcuts | missing | v4_contract_002 |
| undo/redo e2e | missing | v4_contract_007 |
| templates gallery | partial | deferred |
| run all DAG | partial | deferred |
| flow builder | partial | deferred |
| export/import | missing | v4_contract_008 |
| docs routing | missing | v4_contract_012 |
| guided tour | missing | deferred |
| canvas drag/drop | missing | deferred |
| layout parity | partial | v4_contract_005 |
| offline CDN | missing | v4_contract_008 |

### An App Text Scope (10 missing, 7 partial)

| Scope | Status | V4 Action |
|---|---|---|
| knowledge base framework | partial | deferred |
| entity doctrine | partial | v4_contract_010 |
| definition markdown | partial | v4_contract_010 |
| allowed_runtime | missing | v4_contract_010 |
| feature flags | missing | v4_contract_010 |
| definition structure | partial | v4_contract_010 |
| runtime dependency | partial | v4_contract_010 |
| policies | partial | v4_contract_011 |
| shell cache | partial | v4_contract_011 |
| runtime detection | missing | v4_contract_010 |
| definition resolution | missing | v4_contract_010 |
| dependency resolution | missing | v4_contract_010 |
| default resolution | missing | v4_contract_010 |
| default flows | partial | v4_contract_010 |
| default listeners | missing | v4_contract_012 |
| default view frame | missing | v4_contract_012 |
| browser entry | missing | v4_contract_012 |

## Release Decision

V3 is ready for V4 baseline creation. The following are required before V4
implementation begins:

1. Lock this proposal (user marks as locked)
2. Create V4 contracts from locked proposal (done)
3. Create V4 branch (done: dot_agent_codex_an_app_v4)
4. Implement V4 modules (12 done, 38 pending items remain)

## Skipped Tests

| Test | Reason |
|---|---|
| 2 skipped in full suite | existing V3 tests, not related to V4 work |
