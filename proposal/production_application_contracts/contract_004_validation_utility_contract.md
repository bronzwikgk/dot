# Contract 004: Validation Utility

Status: proposed
Priority: p0
Owner domain: quality_audit
Work items: validation layer for work_001 through work_025

## Purpose

Provide deterministic validation methods that plugins can call for names, datasets, schemas, relationships, entities, policies, statuses, versions, and artifacts.

## Related Existing Code

- `dot/code/plugins/code_shared_validator_v3_0_0_draft.js`
- `dot/code/utilities/code_shared_entity_validator_v3_0_0_draft.js`
- `dot/code/utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js`

## Required Methods

- `validate_name`
- `validate_dataset`
- `validate_dataset_registry`
- `validate_schema`
- `validate_entity`
- `validate_relationship`
- `validate_status`
- `validate_policy`
- `validate_version`
- `validate_artifact`
- `validate_contract`
- `validate_no_similar_name_without_authorization`

## Inputs

- candidate record
- schema/contract
- approved datasets
- context
- policy

## Outputs

- `{ ok, status, errors, warnings, hints, data }`
- diagnostics with stable codes
- audit-ready validation summary

## Validation

- falsy values such as `0`, `false`, and empty string must be handled intentionally
- unknown dataset/status/entity/relationship names must fail
- duplicate and similar names must be reported
- proposed names require authorization evidence
- compound validation rules must work

## Success Criteria

- action_entity can call validation before mutation
- runner can call validation before executing plans
- dataset registry validation passes against active datasets
- tests cover null, empty, missing, duplicate, similar, banned, valid, invalid, and authorized cases

## Do Not

- do not mutate input records
- do not mix validation with persistence
- do not silently pass unknown names
