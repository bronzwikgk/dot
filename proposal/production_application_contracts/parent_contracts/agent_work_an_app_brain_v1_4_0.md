# Agent Work: An App Brain v1.4.0

Date: 2026-08-25
Status: proposed
Owner agent: agent_lang_and_memory
Reviewer: agent_codex_an_app
Priority: p1

## Purpose

Turn the `an_app_brain` subdomain contract into implementable schema,
validation, and test-ready work without creating duplicate parser, memory, bot,
runner, or source-adoption code.

## Source

- `proposal/an_brain_domain_proposal.md`
- `dot/proposal/production_application_contracts/contract_019_an_app_brain_domain_contract.md`
- `dot/docs/code_shared_an_app_brain_v1_4_0_draft.md`

## Work Items

| Work Id | Scope | Priority | Success Criteria |
| --- | --- | --- | --- |
| work_an_app_brain_001 | ingestion records | p0 | raw input becomes source-backed ingestion_record |
| work_an_app_brain_002 | decomposition records | p0 | recursive split has node ids, depth, and stop reason |
| work_an_app_brain_003 | parsing records | p0 | An App Lang output is linked and validated |
| work_an_app_brain_004 | reasoning and resolution | p1 | reasoning_trace and resolution_record include evidence and type |
| work_an_app_brain_005 | composition and understanding | p1 | response output links to decision, understanding, and evidence |
| work_an_app_brain_006 | validation and recursion | p1 | recursion has max depth, cycle checks, timeout, and audit |
| work_an_app_brain_007 | learning and controlled operations | p1 | optimize/evolve/mutate use explicit score, seed, rollback, and audit |
| work_an_app_brain_008 | context and boundary | p0 | seven context layers and boundary checks are schema-backed |
| work_an_app_brain_009 | knowledge-tree handoff | p1 | knowledge nodes preserve source evidence and coverage decisions |

## Do

- use approved name `an_app_brain`
- treat records as entities
- reuse existing `an_app_lang`, `an_memory`, `an_bot`, `knowledge_tree`,
  `workflow_pipeline_runner`, validation, and `action_entity` boundaries
- define schemas before plugin work
- add tests before claiming implementation readiness

## Do Not

- do not create an `an_app_brain` plugin before schema and validation work
- do not use the source name as the active domain name
- do not use source-branded blocked names as active names
- do not allow self-improvement to apply changes without approval

## Validation

- all new record names exist in the master spec or are submitted for approval
- all controlled operations have explicit policy
- all reasoning outputs have evidence, assumptions, and confidence
- all recursion has limits and stop reason
- all boundary failures produce clarification, blocked result, or explicit assumption
