# WIP Dot V3 To V4 Completeness Validation Proposal

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Target branch: `wip_dot_v3`
Next clean branch: `wip_dot_v4`

## Goal

Validate `wip_dot_v3` with evidence before creating `wip_dot_v4`. Only clean,
tested, documented, and convention-compliant items should move forward. Every
agent must then create a V4 workspace folder in their own branch root and
continue from the clean V4 baseline.

## V3 Freeze Rule

After this proposal is accepted, `wip_dot_v3` should be frozen for features.
Only validation fixes, documentation corrections, and release-readiness reports
should be added before V4 is created.

Agents must not push to protected/shared branches. The user alone pushes or
merges `wip_dot_v3`, `wip_dot_v4`, `master`, or `main`.

## Required V3 Validation Stages

| Stage ID | Stage | Required Output | Pass Rule |
|---|---|---|---|
| v3_gate_001 | inventory | code/docs/tests/app_data/templates/proposal/log/report inventory | every promoted item listed with owner, status, domain, and evidence |
| v3_gate_002 | contract coverage | contract coverage table | every parent/shared/schema contract marked covered, partial, missing, blocked, duplicate, or not_needed |
| v3_gate_003 | code validation | automated test output | `node --test` and focused suites pass or failures are classified |
| v3_gate_004 | convention validation | naming/banned-word scan report | no active production-code violations in promoted V3 files |
| v3_gate_005 | documentation validation | doc/log coverage report | every promoted code/data/template item has doc/log or recorded exception |
| v3_gate_006 | app_data validation | dataset/datamap/data_table/definition report | datasets are 1D arrays, datamaps group relationships, data tables have stable headers |
| v3_gate_007 | reference GUI gap review | completed-flow coverage matrix | reference GUI flows are mapped to covered, partial, missing, or V4 target |
| v3_gate_008 | real app e2e | e2e release readiness report | command to app entity to shell to version to preview path passes |
| v3_gate_009 | V4 branch decision | go/no_go report | critical rows are pass or explicitly deferred to V4 with owner and priority |

## Current V3 Evidence

| Area | Evidence | Current Status |
|---|---|---|
| foundation/runtime | `test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs` | pass: 7/7 |
| product surface | `test/product_surface/agent_codex_an_app_agent_2_product_surface_v1_0_0_test.mjs` | pass: 6/6 |
| integrated app | `test/integrated_application/agent_codex_an_app_integrated_application_v1_0_0_test.mjs` | pass: 4/4 |
| visible static surface | `test/integrated_application/agent_codex_an_app_visible_product_surface_v1_0_0_test.mjs` | pass: 3/3 |
| An App Brain | `test/language_and_knowledge/agent_3_agent_lang_and_memory_an_app_brain_*_test.mjs` | pass: 37/37 |
| production scan | `an_app_brain`, `product_surface`, `integrated_application`, visible product surface JS | pass for checked V3 promoted files |

## Reference Completed-Flow Coverage Matrix

The pasted completed-flow list is treated as reference GUI success criteria for
V4, not as a claim that V3 already implements all behavior.

| Flow ID | Reference Flow | V3 Coverage | V4 Action |
|---|---|---|---|
| ref_gui_001 | unified command registry binding data-action, selectors, keys, and methods | partial: product surface has command input; no unified registry | define command registry entity, dataset, and UI/action binding contract |
| ref_gui_002 | edit/command mode keyboard gating with save, escape, undo, redo | missing | add editor state entity and keyboard policy tests |
| ref_gui_003 | focus-preserving render path | missing | add focus state capture/restore contract and browser e2e |
| ref_gui_004 | rail outside cell layout | missing | add cell row/layout entity and CSS/browser validation |
| ref_gui_005 | single-owner globals and boot markers | partial: app shell has boot records; no browser global boot marker contract | define shell boot marker policy for browser runtime |
| ref_gui_006 | dependency injection for template trio | partial: product surface uses ports and templates; no template store/composer/tree renderer trio | decide whether trio becomes entities/ports or remains reference-only |
| ref_gui_007 | dead manifest entry removal | not_applicable | use inventory gate to catch stale manifest records |
| ref_gui_008 | docs route links to real module paths | partial: docs point to module paths | add docs-route surface validation |
| ref_gui_009 | unified icon package/offline asset policy | missing | add asset/vendor policy and offline validation |
| ref_gui_010 | relative config path anchoring | missing | add config source resolver utility or contract |
| ref_gui_011 | global search with hit marking and cycling | missing | add search entity, command, state, and browser e2e |
| ref_gui_012 | visual demo highlight selector | missing | add demo/tour entity and style contract if approved |
| ref_gui_013 | boot failure short-circuit in tests/benchmarks | partial: foundation validates invalid shell boot; no browser bench guard | add browser readiness gate and benchmark boundary |
| ref_gui_014 | selftest storage key correction | missing | add storage state entity and selftest policy |
| ref_gui_015 | storage error surfaced in status bar | missing | add status/error surface contract |
| ref_gui_016 | static server hardening and no-cache | missing | add local server/runtime asset contract |
| ref_gui_017 | import confirmation for executable code cells | missing | add import policy and executable-cell confirmation |
| ref_gui_018 | health e2e with cells, page errors, commands registry | missing | add Puppeteer or Playwright health spec |
| ref_gui_019 | focus editing e2e | missing | add browser focus e2e |
| ref_gui_020 | search e2e | missing | add browser search e2e |
| ref_gui_021 | execution e2e for natural language/code/markdown cell outputs | partial: integrated command pipeline exists; no cell execution UI | add cell execution entity and browser e2e |
| ref_gui_022 | books/cells create/move/delete e2e | partial: book/cell exist as entity names only | implement book/cell entity operations in product surface |
| ref_gui_023 | persistence across reload | missing | add storage provider and reload e2e |
| ref_gui_024 | keyboard shortcuts e2e | missing | add keyboard command registry and e2e |
| ref_gui_025 | undo/redo e2e | missing | add version-backed undo/redo for entities |
| ref_gui_026 | templates panel with six gallery cards | partial: six templates exist and static template list exists | add gallery card surface and browser e2e |
| ref_gui_027 | run all and DAG dependency behavior | partial: runner/foundation validation exists; no browser run-all | bind runner to product surface and add e2e |
| ref_gui_028 | flow builder diagram palette/canvas/node execution | partial: diagram projection exists; no editable canvas | add flow builder surface and e2e |
| ref_gui_029 | export/import files | missing | add export/import entity, policy, and browser e2e |
| ref_gui_030 | docs routing/deep links | missing | add route/doc entity and deep-link e2e |
| ref_gui_031 | guided tour | missing | add tour entity and optional template |
| ref_gui_032 | canvas drag/drop and chained flow run | missing | add canvas interaction tests after flow builder |
| ref_gui_033 | notion/notebook/code editor/block editor layout parity | partial: document/tree/diagram/table projections exist | add notebook, code editor, block editor, board, calendar, timeline, dashboard parity |
| ref_gui_034 | offline icon/assets and zero CDN | missing | add offline asset scan and vendor policy |

## V3 Completeness Answer

V3 is not complete against the pasted full reference GUI success criteria. V3 is
clean as a foundation and first product-surface slice:

- application shell boot and validation
- version snapshot and restore basics
- repository read-only boundary
- product_surface template/entity/projection contracts
- six starter production templates
- static visible product surface
- integrated command to application pipeline
- An App Brain record and boundary foundation

V3 does not yet cover the full reference GUI/browser application suite:

- command registry with selectors and keyboard combos
- edit mode and focus preservation
- books/cells live operations
- browser persistence and reload
- global search UI
- flow canvas drag/drop
- file export/import
- docs routing and guided tour
- offline asset/vendor validation
- 16-spec browser e2e suite

## V4 Missing Item Backlog

Every item below comes from a `partial` or `missing` row in the reference
completed-flow coverage matrix. These are the required V4 work items before the
project can claim parity with the reference GUI/product suite.

| V4 Item ID | Priority | Owner | Missing Item | Required Files/Artifacts | Validation |
|---|---|---|---|---|---|
| v4_missing_001 | p0 | agent_ui_application | unified command registry binding data-action, chrome selectors, keyboard combos, and methods | `app_data/dataset/ui_surface/dataset_ui_command_name_v1_0_0_draft.json`, `app_data/datamap/ui_surface/datamap_ui_command_binding_v1_0_0_draft.json`, command registry plugin or product_surface method | browser e2e proves click, selector, and keyboard combo invoke same command |
| v4_missing_002 | p0 | agent_ui_application | edit/command mode gating | editor state entity definition, keyboard policy dataset, product surface edit-mode controller | tests prove `Ctrl+S` only saves while editing, `Escape` exits edit mode, undo/redo remain governed |
| v4_missing_003 | p0 | agent_ui_application | focus-preserving renders | focus state entity, capture/restore methods, render sync method | browser e2e proves typing does not rebuild active row and focus remains stable |
| v4_missing_004 | p0 | agent_ui_application | rail outside cell layout | cell row entity definition, CSS layout contract, visible cell row template | desktop/mobile browser validation proves rail is outside cell and sticky without overlap |
| v4_missing_005 | p0 | agent_codex_an_app | browser boot marker contract | app shell browser boot record, boot marker policy, readiness gate | e2e proves boot success/failure markers and no false ready state |
| v4_missing_006 | p1 | agent_ui_application | template store, composer, and tree renderer boundary | decide entity/port names; add definitions and tests if adopted | contract review proves no duplicate manager/plugin names and no hard dependency cycle |
| v4_missing_007 | p1 | agent_codex_an_app | manifest/inventory stale entry validation | inventory utility/report for manifests and route/action registrations | validation report catches dead entries and duplicate bindings |
| v4_missing_008 | p1 | agent_ui_application | docs route links to real module paths | docs route entity, docs surface, route fixtures | browser e2e proves help/about/settings/deep-link routes render correct docs |
| v4_missing_009 | p1 | agent_ui_application | offline icon/package asset policy | asset dataset, vendor folder policy, no-CDN scan report | offline browser run passes with network disabled |
| v4_missing_010 | p1 | agent_codex_an_app | relative config path anchoring | config source resolver utility, path policy, fixtures | tests prove relative paths anchor to source record and reject traversal |
| v4_missing_011 | p0 | agent_ui_application | global search with hit marking, count, and cycling | search entity, search state, command binding, status surface | browser e2e proves hit count, next/previous cycling, clear behavior |
| v4_missing_012 | p2 | agent_ui_application | demo/tour highlight selector | tour entity, step dataset, highlight CSS policy | browser e2e proves tour next/back/skip and highlight placement |
| v4_missing_013 | p0 | agent_codex_an_app | browser boot-failure test/benchmark short-circuit | readiness helper, benchmark guard, failure fixture | test proves benchmark/e2e stops on boot error and reports exact reason |
| v4_missing_014 | p1 | agent_codex_an_app | storage selftest and storage key validation | storage provider boundary, storage key dataset, selftest report | tests prove invalid key/state is rejected and reported |
| v4_missing_015 | p1 | agent_ui_application | storage errors surfaced in status bar | status surface entity, error record shape, browser status binding | browser e2e proves storage error appears in status surface |
| v4_missing_016 | p1 | agent_codex_an_app | local static server hardening | local server utility or script, no-cache policy, port/env handling | test proves no-cache header, `PORT` support, and friendly occupied-port failure |
| v4_missing_017 | p1 | agent_ui_application | import confirmation for executable code cells | import policy entity, executable-cell warning state, confirmation surface | browser e2e proves executable import requires confirmation |
| v4_missing_018 | p0 | agent_codex_an_app | full browser health e2e | Puppeteer or Playwright test suite, app launch helper, page-error capture | health spec proves clean boot, no page errors, command registry present |
| v4_missing_019 | p0 | agent_ui_application | browser focus editing e2e | visible editor surface and focus test | browser e2e proves focus survives typing and escape behavior |
| v4_missing_020 | p0 | agent_ui_application | browser search e2e | global search UI and test | browser e2e proves search marks/cycles/clears |
| v4_missing_021 | p0 | agent_ui_application + agent_lang_and_memory | cell execution for natural language, code, and markdown outputs | cell entity operations, output entity, An App Lang command parser, runner binding | e2e proves natural-language cell, code cell, and markdown cell produce expected output |
| v4_missing_022 | p0 | agent_ui_application | live book/cell create/move/delete | book entity operations, cell entity operations, rail controls | browser e2e proves create book, add cell, move cell, remove cell |
| v4_missing_023 | p1 | agent_codex_an_app + agent_ui_application | persistence across reload | storage provider, autosave policy, reload test fixtures | browser e2e proves state survives reload and invalid storage is reported |
| v4_missing_024 | p0 | agent_ui_application | keyboard shortcut registry and e2e | keyboard combo dataset, command registry map, keyboard tests | browser e2e proves sidebar toggle, run selected cell, escape blur, save/undo/redo |
| v4_missing_025 | p1 | agent_codex_an_app | version-backed undo/redo for entities | undo/redo policy, version integration, action_entity/version_system test | tests prove revert/reapply and audit record correctness |
| v4_missing_026 | p1 | agent_ui_application | six-template gallery cards | template gallery view, card entity/layout, template create action | browser e2e proves six cards render and create application/book from template |
| v4_missing_027 | p0 | agent_codex_an_app + agent_ui_application | run all and DAG dependency behavior in UI | runner binding, run-all command, dependency datamap | e2e proves dependency order, skipped blocked nodes, and audit output |
| v4_missing_028 | p1 | agent_ui_application | editable flow builder diagram canvas | flow node entity, edge entity, canvas state, palette, drop/connect actions | browser e2e proves node drop, edge connect, node run to completed |
| v4_missing_029 | p1 | agent_codex_an_app + agent_ui_application | export/import files | export entity, import entity, file policy, confirmation rules | browser e2e proves export file and import restore/merge behavior |
| v4_missing_030 | p1 | agent_ui_application | docs routing and hash deep links | docs route records, route selection state, deep-link test | browser e2e proves route navigation and selected entity restore |
| v4_missing_031 | p2 | agent_ui_application | guided tour | tour template, step records, navigation controls | browser e2e proves next/back/skip and no stuck overlay |
| v4_missing_032 | p2 | agent_ui_application | canvas drag/drop and chained flow run | canvas interaction handlers, chain execution record | browser e2e proves drag reposition and chained run completes |
| v4_missing_033 | p0 | agent_ui_application | layout parity for notebook, code editor, block editor, board, calendar, timeline, diagram, dashboard, table, tree | layout dataset, render-profile datamap, projection tests, visible layouts | browser/static tests prove same entity data renders in every approved layout |
| v4_missing_034 | p1 | agent_codex_an_app + agent_ui_application | offline capability and zero CDN references | vendor asset folder, asset inventory report, network-disabled e2e | offline browser e2e passes and scan shows zero CDN references |

## V4 Missing Item Grouping By Agent

| Agent | P0 Items | P1 Items | P2 Items |
|---|---|---|---|
| agent_codex_an_app | v4_missing_005, v4_missing_013, v4_missing_018, v4_missing_027 | v4_missing_007, v4_missing_010, v4_missing_014, v4_missing_016, v4_missing_023, v4_missing_025, v4_missing_029, v4_missing_034 | none |
| agent_ui_application | v4_missing_001, v4_missing_002, v4_missing_003, v4_missing_004, v4_missing_011, v4_missing_019, v4_missing_020, v4_missing_021, v4_missing_022, v4_missing_024, v4_missing_027, v4_missing_033 | v4_missing_006, v4_missing_008, v4_missing_009, v4_missing_015, v4_missing_017, v4_missing_023, v4_missing_026, v4_missing_028, v4_missing_029, v4_missing_030, v4_missing_034 | v4_missing_012, v4_missing_031, v4_missing_032 |
| agent_lang_and_memory | v4_missing_021 | classification/entity extraction for app-building commands | none |

## V4 Required New Or Updated Contracts

The following contracts should be created or updated before implementation:

| Contract ID | Contract File | Purpose |
|---|---|---|
| v4_contract_001 | `proposal/production_application_contracts/v4/agent_2_agent_ui_application_command_registry_contract_v1_0_0_proposed.md` | command registry, keyboard bindings, selector/action binding |
| v4_contract_002 | `proposal/production_application_contracts/v4/agent_2_agent_ui_application_editor_focus_contract_v1_0_0_proposed.md` | edit mode, focus preservation, cell row rendering |
| v4_contract_003 | `proposal/production_application_contracts/v4/agent_2_agent_ui_application_book_cell_operations_contract_v1_0_0_proposed.md` | live book/cell create/move/remove/render |
| v4_contract_004 | `proposal/production_application_contracts/v4/agent_2_agent_ui_application_search_and_status_contract_v1_0_0_proposed.md` | global search, status surface, storage error display |
| v4_contract_005 | `proposal/production_application_contracts/v4/agent_2_agent_ui_application_layout_parity_contract_v1_0_0_proposed.md` | all approved layout projections and visual validation |
| v4_contract_006 | `proposal/production_application_contracts/v4/agent_1_agent_codex_an_app_browser_e2e_gate_contract_v1_0_0_proposed.md` | browser health, boot guard, benchmark short-circuit |
| v4_contract_007 | `proposal/production_application_contracts/v4/agent_1_agent_codex_an_app_persistence_version_undo_contract_v1_0_0_proposed.md` | persistence, undo/redo, version-backed state |
| v4_contract_008 | `proposal/production_application_contracts/v4/agent_1_agent_codex_an_app_import_export_offline_contract_v1_0_0_proposed.md` | file import/export, local server, offline assets |
| v4_contract_009 | `proposal/production_application_contracts/v4/agent_3_agent_lang_and_memory_cell_command_language_contract_v1_0_0_proposed.md` | language parsing for GUI commands and cell execution |

## V4 Required New Or Updated App Data

| App Data ID | Folder | Required Data |
|---|---|---|
| v4_app_data_001 | `app_data/dataset/ui_surface` | command names, keyboard combo names, layout names, status names, search action names |
| v4_app_data_002 | `app_data/datamap/ui_surface` | command-to-selector-to-keyboard bindings, layout-to-render-profile map |
| v4_app_data_003 | `app_data/data_table/ui_surface` | command attributes, keyboard attributes, layout attributes, status attributes |
| v4_app_data_004 | `app_data/definition/ui_surface` | command, keyboard_combo, editor_state, focus_state, search_state, status_surface |
| v4_app_data_005 | `app_data/definition/product_surface` | book, cell, output, flow_node, flow_edge, tour_step, asset_record |
| v4_app_data_006 | `templates/product_surface` | notebook/book/cell starter, flow builder starter, docs route starter, offline demo starter |

## V4 Browser E2E Suite Target

The V4 browser suite should reproduce the reference 16-spec shape using approved
An App names:

| Spec ID | V4 Spec Name | Required Coverage |
|---|---|---|
| v4_e2e_001 | health | clean boot, no page errors, command registry present |
| v4_e2e_002 | focus_editing | focus survives typing, escape exits editor |
| v4_e2e_003 | search | hit marking, count, cycling, clear |
| v4_e2e_004 | execution | natural language, code, markdown cell outputs |
| v4_e2e_005 | books_cells | create book, add/move/remove cell |
| v4_e2e_006 | persistence | autosave and reload restore |
| v4_e2e_007 | keyboard | shortcut routing through command registry |
| v4_e2e_008 | undo_redo | version-backed undo and redo |
| v4_e2e_009 | templates | six template cards and create from template |
| v4_e2e_010 | run_all_dag | dependency-aware run all |
| v4_e2e_011 | flow_builder | palette, canvas, node drop, execute flow |
| v4_e2e_012 | export_import | export file and import restore/merge |
| v4_e2e_013 | docs_routing | docs routes and hash deep links |
| v4_e2e_014 | guided_tour | tour step navigation and skip |
| v4_e2e_015 | canvas_interaction | drag node, connect edge, chained flow run |
| v4_e2e_016 | layout_parity | notebook/code editor/block editor/tree/table/board/calendar/timeline/diagram/dashboard |

## V4 Creation Rule

Create `wip_dot_v4` only after a release validation report is created and marks
each critical V3 area as either `pass` or `deferred_to_v4_with_owner`.

Suggested branch commands for the user:

```powershell
git checkout wip_dot_v3
git pull
git checkout -b wip_dot_v4
```

## Agent V4 Workspace Rule

Each agent creates a V4 workspace folder in their own branch root after branching
from `wip_dot_v4`.

Required folders:

```text
agent_workspace_v4/
  agent_codex_an_app/
  agent_ui_application/
  agent_lang_and_memory/
```

Each agent workspace must contain:

```text
docs/
proposal/
tests/
reports/
logs/
templates/
app_data/
user_data/
handoff/
```

## V4 Priority Recommendation

| Priority | Owner | Work |
|---|---|---|
| p0 | agent_codex_an_app | V3 release validation inventory, contract coverage, e2e gate, V4 branch readiness report |
| p0 | agent_ui_application | command registry, edit mode, focus preservation, books/cells, browser e2e shell |
| p0 | agent_lang_and_memory | An App Lang command parsing contract for GUI commands and cell execution |
| p1 | agent_codex_an_app | version-backed undo/redo, persistence provider boundary, repository handoff |
| p1 | agent_ui_application | search, template gallery, import/export, docs routing |
| p1 | agent_lang_and_memory | classification/entity extraction for app-building commands |
| p2 | all agents | guided tour, offline vendor assets, advanced diagram/canvas flows, benchmark gate |

## Required V3 Release Validation Commands

```powershell
node --test
node --test test\foundation_and_runtime\*.mjs
node --test test\product_surface\*.mjs
node --test test\integrated_application\*.mjs
node --test test\language_and_knowledge\*.mjs
rg "materialize|materialization|VectorMathUtil|evaluateRule|flattenToVector|\bsrc\b|\bdeps\b" code app_data templates docs proposal reports log test
```

Any scan hit must be classified as active violation, allowed policy mention,
legacy/source-only mention, or false positive.

## Success Criteria For Clean V4 Baseline

- `wip_dot_v3` has no uncommitted files
- all current automated tests pass
- V3 inventory exists
- contract coverage exists
- completed-flow coverage matrix exists
- known V4 gaps are listed with owner and priority
- no active production-code banned-word violations remain in promoted V3 files
- user creates and pushes `wip_dot_v4`
