# Contract 001: Dataset Registry

Status: proposed
Priority: p0
Owner domain: dataset_registry
Owner agent: agent_codex_an_app
Work items: work_001

## Purpose

Create the canonical app data registry so every approved word list, relationship map, attribute table, alias list, banned list, status list, ui list, system list, domain list, and validation list has one traceable home.

## Related Files

- `dot/docs/an_app_master_project/an_app_pending_work_tracker.md`
- `dot/docs/an_app_master_project/an_app_requirements_and_spec.md`
- `dot/app_data/dataset`
- `dot/app_data/datamap`
- `dot/app_data/data_table`
- `dot/code/utilities/dataset`
- `dot/dataset_shared_v3`
- `dot/learnings_agent_codex/dataset`

## Inputs

- existing dataset files
- source-derived dataset candidates
- active banned and approved names
- owner domain decisions

## Outputs

- dataset registry records
- dataset group records
- datamap registry records
- data_table registry records
- dataset ownership map
- duplicate/similar-name report
- adoption/rejection notes
- doc and log

## Validation

- every dataset has id, name, owner_domain, status, source_refs, values, count, and validation result
- one-dimensional word datasets remain flat arrays
- datamap files contain relationship collections grouped by relationship type
- data_table files contain two-dimensional rows shaped by the schema for the group or type
- relationship edges are stored in datamap, not dataset
- attributes and parameters are stored in data_table, not dataset
- duplicate values are reported
- similar names are reported before adoption
- banned names are rejected unless listed only as banned values
- no new dataset group becomes active without user authorization

## Success Criteria

- all active dataset groups are inventoried
- all active datamap groups are inventoried
- all active data_table files are inventoried
- registry count equals file scan count
- duplicate report is reviewable
- every active dataset has an owner domain
- validation utility can consume the registry

## Do

- reuse approved dataset names
- record aliases separately from active names
- keep source-only names marked as source-only

## Do Not

- do not merge unrelated datasets just because values overlap
- do not create new active names from source files without authorization
- do not hide duplicate or similar names
