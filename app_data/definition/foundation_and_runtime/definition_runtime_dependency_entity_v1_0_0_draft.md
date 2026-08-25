# Runtime Dependency Definition Entity

Status: draft
Owner: agent_codex_an_app

## Purpose

This entity describes the approved shape for project and product definition
records. It lets An App validate metadata, runtime, feature flags, config,
dependencies, policies, schemas, patterns, shapes, and defaults before the
application shell or product surface consumes them.

## Required Fields

| Field | Required | Notes |
| --- | --- | --- |
| id | yes | snake_path definition id |
| type | yes | `project_definition` or `product_definition` |
| name | yes | readable name |
| version | yes | semantic version string |
| status | yes | approved lifecycle status |
| runtime | yes | approved runtime name |
| dependencies | no | plugin, utility, app_data, template, or definition records |

## Validation

- Runtime names must come from the approved runtime dataset.
- Dependency kind names must come from the approved dependency-kind dataset.
- Dependency ids must use snake_path format.
- Dependency relationships with `depends_on` must not form cycles.
- Every utility result must return `{ ok, data, errors }`.

## Related Code

- `code/utilities/code_shared_definition_runtime_dependency_v4_0_0_draft.js`
- `test/v4_definition_runtime_dependency/agent_codex_an_app_v4_definition_runtime_dependency_v1_0_0_test.mjs`
