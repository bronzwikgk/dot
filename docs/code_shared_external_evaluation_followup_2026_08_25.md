# Shared External Evaluation Follow-Up

## Purpose

This note records the confirmed findings from an external evaluation of
`dot/code` and the fixes applied before commit.

## Confirmed And Fixed

| Finding | Resolution |
| --- | --- |
| `entity_runner.run()` failed by default because allowed stages and requested stages were conflated. | `entity_runner` now separates allowed stage names from default requested stages. With no requested stages, it runs registered stages. |
| Unknown DAG task types returned an error object as a successful task result. | `runner` now throws `[SYS-06]` when a DAG task has no registered task type or executable action. |
| `collection_util` treated seed `0` as missing. | `collection_util` now preserves seed `0` with nullish fallback. |
| `action_entity` v3.1 docs listed relationship methods that were not present. | Added `add_relationship` and `remove_relationship` wrappers and documented both wrapper and direct link methods. |
| `action_entity` v3.1 driver hooks changed during migration. | v3.1 now adapts older drivers that expose `generate_id` and `get_timestamp`, while keeping snake_case hooks internally. |
| `link_entities` required target existence even though graph validation owns target resolution. | Links can now be created before targets exist; `validate_graph()` reports missing targets. |
| Anonymous `export default class` was not handled by legacy inspection. | `code_inspector` now recognizes anonymous default classes and feeds constructor test generation correctly. |
| Markdown pipeline docs said non-heading lines become text blocks. | Docs now match code: bullet lines become `list_item`; other non-empty lines become `paragraph`. |

## Tested

Targeted checks passed for:

- entity runner default registered-stage execution
- runner unknown DAG task failure
- collection seed `0`
- action entity old-driver compatibility
- action entity relationship wrappers and graph validation
- default class inspection and constructor test-plan creation

The generated Node test suite also passed:

```text
1300 pass
0 fail
```

## Remaining Deferred Items

The evaluation included smaller items that were not part of this batch:

- deeper test-generation snapshot guard review
- direct `entity_validator` status policy decision
- metrics counter/gauge separation
- richer generated tests for promoted v3.1 modules
