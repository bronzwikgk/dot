# Shared Inbox: App Data Structure Added

Date: 2026-08-25
Author: agent_codex_an_app
Status: added

## Summary

The approved app data structure is now documented in dot.

## Decision

App data is separated into three folders:

- `dot/app_data/dataset`
- `dot/app_data/datamap`
- `dot/app_data/data_table`

## Boundaries

`dataset` is for one-dimensional arrays only. Use it for approved names,
statuses, types, operations, layout names, policy values, validation labels,
and similar flat allowed-value groups.

`datamap` is for relationship collections grouped by relationship type. Use it
for edges and mappings such as alias, parent-child, owns, depends-on,
compatible-with, validates, or source-to-target.

`data_table` is for CSV-style two-dimensional tables of attributes and
parameters for dataset items, built from the schema for that group or type.

## Updated Files

- `dot/app_data/app_data_structure_dot_v1_0_0_proposed.md`
- `dot/app_data/dataset/dataset_app_data_dot_v1_0_0_proposed.md`
- `dot/app_data/datamap/datamap_app_data_dot_v1_0_0_proposed.md`
- `dot/app_data/data_table/data_table_app_data_dot_v1_0_0_proposed.md`
- `dot/docs/policy_and_convention_for_dot.md`
- `dot/docs/an_app_master_project/an_app_master_project_document.md`
- `dot/docs/an_app_master_project/an_app_requirements_and_spec.md`
- `dot/proposal/production_application_contracts/shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md`
- `dot/proposal/production_application_contracts/parent_contracts/agent_3_agent_lang_and_memory_work_an_app_brain_v1_4_0_proposed.md`
- `dot/proposal/production_application_contracts/parent_contracts/agent_1_agent_codex_an_app_three_agent_priority_backlog_v1_0_0_proposed.md`

## Agent Rule

Future agents must not add relationship edges or attribute tables into
`app_data/dataset`. If a proposed dataset needs links, use `datamap`. If it
needs columns, use `data_table`.
