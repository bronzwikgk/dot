# code_shared_an_app_brain_v1_4_0_draft.md

**Version:** v1.4.0
**Status:** proposed
**Owner:** agent_lang_and_memory
**Contract:** shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md
**Parent contract:** agent_3_agent_lang_and_memory_parent_007_memory_knowledge_tree_system_contract.md

## What It Is

Coordination layer for thinking-like behavior inside An App. An integration domain, NOT a duplicate parser, memory, bot, or runner.

## What It Does

- Manages `brain_session` lifecycle with 7 context layers
- Creates `ingestion_record`, `decomposition_record`, `parsing_record` for source intake
- Creates `reasoning_trace` (5 types: deductive/inductive/abductive/analogical/causal)
- Creates `resolution_record` (7 types: coreference/deictic/temporal/entity_ref/route_ref/provider_ref/placeholder)
- Creates `understanding_record` (intent/implication/gap), `decision_record` (alternatives+reason), `composition_record`
- Creates `validation_report` and `boundary_record` (blocks on missing evidence/ambiguous/stale/low confidence/unsafe/recursion/approval-required)
- Creates `recursion_trace` (max depth/max nodes/cycle/repeated-state/timeout/audit/stop reason)
- Creates `score_record` and `improvement_proposal` (approval required, rollback possible)
- Creates `evidence_record` with provenance and `audit_report` for full path trace

## When To Use

- Multiturn conversation with context awareness
- Reasoning over memory + evidence + current context
- Source ingestion with boundary checks and recursion limits
- Controlled improvement proposals without self-applying

## Runtime Contract

- Reuses: `an_app_lang` (parse), `an_memory` + `knowledge_tree` (memory), `an_bot` (session), `agent_improvement_cycle` (score/improve), `workflow_pipeline_runner` (stage flow)
- All names pass vocabulary reconciliation
- Session/context/evidence/memory refs exist when required
- Parsed request validated before executable
- Reasoning trace includes evidence or assumption markers
- Decision record includes alternatives, selected action, reason
- Composed response maps back to decision and evidence
- Boundary checks block/clarify before active changes
- Improvement proposals require approval

## Known Limits

- No direct execution - delegates to existing utilities
- No source-only names promoted into active datasets
- `optimize`/`evolve`/`mutate` only as controlled operations with validation, seed, rollback, audit

## How Tested

- Unit: each module creates correct record shape with required fields
- Integration: full pipeline produces all records and audit report
- Boundary: blocked sessions return honest fallback

## Related Files

- `dot/code/plugins/an_app_brain_v1_4_0/an_app_brain.js`
- `dot/code/plugins/an_app_brain_v1_4_0/session.js`
- `dot/code/plugins/an_app_brain_v1_4_0/ingestion.js`
- `dot/code/plugins/an_app_brain_v1_4_0/decomposition.js`
- `dot/code/plugins/an_app_brain_v1_4_0/parsing.js`
- `dot/code/plugins/an_app_brain_v1_4_0/reasoning.js`
- `dot/code/plugins/an_app_brain_v1_4_0/composition.js`
- `dot/code/plugins/an_app_brain_v1_4_0/validation.js`
- `dot/code/plugins/an_app_brain_v1_4_0/recursion.js`
- `dot/code/plugins/an_app_brain_v1_4_0/learning.js`
- `dot/code/plugins/an_app_brain_v1_4_0/audit.js`
- `dot/code/plugins/an_app_brain_v1_4_0/context.js`
- `dot/code/plugins/an_app_brain_v1_4_0/decision.js`
- `dot/proposal/production_application_contracts/shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md`
