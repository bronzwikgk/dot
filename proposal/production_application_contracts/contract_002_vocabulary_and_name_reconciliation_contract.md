# Contract 002: Vocabulary And Name Reconciliation

Status: proposed
Priority: p0
Owner domains: dataset_registry, workflow_system, entity_system, schema_contract, ui_surface
Work items: work_002, work_003, work_009, work_011, work_013, work_018

## Purpose

Reconcile operation, task, pipeline, workflow, entity type, status, block, layout, and view names into approved canonical names with aliases.

## Inputs

- active master docs
- existing code names
- existing dataset names
- reference GUI and An App source names
- learning archive names

## Outputs

- canonical name map
- alias map
- rejected-name list
- proposed-name authorization notes
- conflict report
- doc and log

## Validation

- no camelCase public API names
- no banned terms outside explicit banned-name lists
- source-branded terms such as `neuro_rule` and `rule_engine` remain blocked
  unless the user explicitly authorizes promotion
- controlled operation names such as `optimize`, `optimise`, `evolve`, and
  `mutate` are allowed only with explicit contract boundaries, validation,
  seed policy when relevant, rollback, and audit behavior
- every alias has target canonical name
- every similar name has a reuse/reject/authorize decision
- status values are reconciled against lifecycle, execution, validation, ui, storage, provider, audit, memory, workflow, and version states

## Success Criteria

- `done` and `completed` are reconciled
- product layout names are separated from CSS layout techniques
- block names are mapped to approved block names
- no new active names exist without authorization evidence

## Do

- prefer active master names
- preserve old names as aliases only when needed for import
- document every conflict

## Do Not

- do not rename code without tests and docs
- do not use source names as active names automatically
- do not convert a source term into a new active domain, plugin, utility,
  dataset, operation, or method name without authorization evidence
