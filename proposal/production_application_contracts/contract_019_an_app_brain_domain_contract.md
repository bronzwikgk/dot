# Contract 019: An App Brain Domain

Status: proposed
Priority: p1
Owner domain: an_app_brain
Owner agent: agent_lang_and_memory
Source coverage: proposal/an_brain_domain_proposal.md v1.4.0, github_dump/dump/inbox_AnGitAgent_inbox

## Purpose

Define `an_app_brain` as an An App subdomain that coordinates language
parsing, memory, reasoning, resolution, decision records, response composition,
conversation context, quality scoring, learning, recursion limits, boundary
checks, and governed improvement proposals.

This is an integration domain, not a duplicate parser, memory system, bot, or standalone plugin. It should reuse existing An App utilities, plugins, datasets, schemas, and contracts first.

## Related Contracts

- contract_002_vocabulary_and_name_reconciliation_contract.md
- contract_004_validation_utility_contract.md
- contract_007_workflow_pipeline_runner_contract.md
- contract_010_an_app_lang_contract.md
- contract_011_an_bot_agent_contract.md
- contract_012_an_memory_reasoning_contract.md
- contract_014_quality_audit_e2e_contract.md
- contract_017_agent_improvement_cycle_contract.md
- contract_018_knowledge_tree_contract.md

## Required Records

- brain_session
- context_record
- ingestion_record
- decomposition_record
- parsing_record
- knowledge_base_record
- knowledge_fact
- knowledge_formula
- knowledge_provenance
- reasoning_trace
- resolution_record
- decision_record
- composition_record
- understanding_record
- validation_report
- recursion_trace
- boundary_record
- score_record
- failure_record
- pattern_record
- improvement_proposal
- evidence_record

## Required Operations

- start_brain_session
- ingest_source
- decompose_source
- read_context
- update_context
- parse_request
- reason_about_request
- resolve_reference
- understand_request
- decide_next_action
- compose_response
- validate_reasoning
- check_boundary
- run_recursion_step
- score_result
- create_improvement_proposal
- record_evidence
- audit_brain_session

## Inputs

- user_input
- session_ref
- context_ref
- memory_ref
- language_request_ref
- rule_set_ref
- evidence_ref
- score_policy
- approval_policy
- boundary_policy
- recursion_policy

## Outputs

- brain_session
- parsed_request_ref
- reasoning_trace
- resolution_record
- decision_record
- response_record
- score_record
- improvement_proposal
- boundary_record
- audit_report

## Validation

- all names pass vocabulary reconciliation
- session, context, evidence, and memory refs exist when required
- parsed request is validated before it becomes executable
- reasoning trace includes source evidence or explicit assumption markers
- decision record includes alternatives, selected action, and reason
- composed response maps back to decision and evidence
- context resolution declares whether it used system, organization, project,
  domain, session, conversation, or entity context
- reasoning trace declares deductive, inductive, abductive, analogical, or
  causal reasoning type
- resolution record declares coreference, deictic, temporal, entity_ref,
  route_ref, provider_ref, or placeholder resolution type
- boundary checks block or clarify missing evidence, ambiguous reference, stale
  context, low confidence, conflicting memory, unsafe action, recursion limit,
  and approval-required cases
- recursion policy has max depth, max node count, cycle detection,
  repeated-state detection, timeout, audit trail, and stop reason
- score policy has explicit denominator, threshold, and seed when generated tests are involved
- improvement proposals require approval before active behavior changes
- no source-only names are promoted into active datasets without authorization

## Success Criteria

- can maintain multiturn context through `brain_session`
- can parse a request through `an_app_lang` and pass validated records to workflows
- can reason with memory, evidence, and current context
- can resolve temporal and contextual references through explicit context layers
- can create a decision record before execution
- can compose a response from structured records
- can score output and create an improvement proposal without self-applying it
- can stop recursion safely with an auditable reason
- can respond honestly when a boundary check fails
- can audit the full path from input to response

## Do

- reuse `an_app_lang` for parsing
- reuse `an_memory` and `knowledge_tree` records for source-backed memory
- reuse `an_bot` for session/task/approval behavior
- reuse `agent_improvement_cycle` for scoring and improvement proposals
- reuse `workflow_pipeline_runner` for executable stage flow
- use `action_entity` for durable record lifecycle

## Do Not

- do not build a duplicate parser, memory system, bot runtime, or runner
- do not add source-branded names such as `neuro_rule` or `rule_engine` as
  active product names without authorization
- do not use `optimize`, `optimise`, `evolve`, or `mutate` as vague module
  names; use them only as controlled operations with validation, seed policy
  when relevant, rollback, and audit
- do not allow this domain to self-modify active behavior without approval
- do not claim reasoning correctness without evidence, assumptions, and audit

## Handoff Notes

`an_app_brain` is the coordination layer for thinking-like behavior inside An App. It should make the product feel coherent across language, memory, bot, reasoning, and improvement work, while still keeping each behavior owned by its existing utility, plugin, dataset, or contract boundary.

## Work Tasks

| Work Id | Scope | Priority | Related Contract |
| --- | --- | --- | --- |
| work_an_app_brain_001 | ingestion records and source intake boundary | p0 | contract_007, contract_018 |
| work_an_app_brain_002 | decomposition records and recursive split policy | p0 | contract_007, contract_018 |
| work_an_app_brain_003 | parsing records and An App Lang handoff | p0 | contract_010 |
| work_an_app_brain_004 | reasoning and resolution records | p1 | contract_012 |
| work_an_app_brain_005 | composition and understanding records | p1 | contract_010, contract_011 |
| work_an_app_brain_006 | validation and recursion policy | p1 | contract_004, contract_014 |
| work_an_app_brain_007 | learning and controlled improvement operations | p1 | contract_017 |
| work_an_app_brain_008 | context layers and boundary checks | p0 | contract_011, contract_012 |
| work_an_app_brain_009 | knowledge-tree builder handoff | p1 | contract_018 |
