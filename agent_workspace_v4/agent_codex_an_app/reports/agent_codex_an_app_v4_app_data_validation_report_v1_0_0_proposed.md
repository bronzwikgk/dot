# Agent Codex An App V4 App Data Validation Report

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`

## Scope

This report checks the current app data model against the V4 convention:

- `dataset` is a 1D array of approved terms
- `data_map` is a grouped relationship collection
- `data_table` is a CSV-style table of attributes and parameters
- definition files describe each entity, system, user flow, and policy

## Current Dot Coverage

| Area | Status | Finding |
|---|---|---|
| `app_data/product_surface/dataset` | covered | product surface datasets exist as approved names |
| `app_data/product_surface/data_map` | covered | product surface relationships are grouped separately from datasets |
| `app_data/product_surface/data_table` | covered | product surface table data exists separately from term arrays |
| `app_data/product_surface/definition` | covered | product surface definitions exist |
| global application definitions | partial | current app-wide entity/system/user-flow definitions are not yet complete for V4 |
| UI surface definitions | partial | product surface exists, but GUI clone/application-builder parity needs expanded definitions |
| command and shortcut definitions | pending | needed for command registry and keyboard e2e |
| book/cell definitions | pending | needed for notebook/book/cell operations and persistence |
| version state definitions | pending | needed for git-like version system, undo, redo, branch, merge, conflict, audit |
| runtime dependency definitions | pending | needed for dependency resolution and browser entry validation |

## V4 App Data To Create

| Item ID | Target | Required Shape |
|---|---|---|
| v4_app_data_001 | command names | `dataset` 1D array |
| v4_app_data_002 | keyboard shortcut names | `dataset` 1D array |
| v4_app_data_003 | editor mode names | `dataset` 1D array |
| v4_app_data_004 | layout projection names | `dataset` 1D array |
| v4_app_data_005 | book/cell entity types | `dataset` 1D array |
| v4_app_data_006 | runtime dependency types | `dataset` 1D array |
| v4_app_data_007 | version operation names | `dataset` 1D array |
| v4_app_data_008 | command relationships | `data_map` grouped by relationship type |
| v4_app_data_009 | UI flow relationships | `data_map` grouped by relationship type |
| v4_app_data_010 | entity attribute tables | `data_table` CSV-style tables by entity family |

## Finding

The existing product surface app data follows the intended shape. V4 needs new
application-builder app data before implementation is considered complete.
