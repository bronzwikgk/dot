# Contract 017: Agent Improvement Cycle

Status: proposed
Priority: p1
Owner domains: an_bot, quality_audit, an_memory
Source coverage: github_dump/dump/inbox_AnGitAgent_inbox

## Purpose

Define a governed improvement loop for agents, rules, prompts, templates, tests, and configs.

The source inbox describes a loop of test, measure, identify, adjust, and learn. In An App this must be deterministic, auditable, entity-based, and approval-aware.

## Related Contracts

- contract_002_vocabulary_and_name_reconciliation_contract.md
- contract_004_validation_utility_contract.md
- contract_007_workflow_pipeline_runner_contract.md
- contract_011_an_bot_agent_contract.md
- contract_012_an_memory_reasoning_contract.md
- contract_014_quality_audit_e2e_contract.md

## Required Records

- improvement_cycle_record
- rule_record
- assertion_record
- test_case_record
- test_result_record
- score_record
- failure_record
- pattern_record
- improvement_proposal
- approval_gate
- audit_report

## Required Operations

- run_self_check
- calculate_score
- identify_failure_pattern
- create_improvement_proposal
- validate_improvement_proposal
- approve_improvement
- apply_improvement
- rollback_improvement
- record_pattern
- compare_score
- audit_cycle

## Inputs

- target_entity_ref
- rule_set_ref
- test_set_ref
- score_policy
- threshold_policy
- approval_policy
- failure_history_ref
- current_config_ref
- proposed_change

## Outputs

- score_record
- failure_record
- pattern_record
- improvement_proposal
- audit_report
- updated_entity_ref
- rollback_ref

## Validation

- target entity exists
- rule set exists and uses approved names
- test set exists and has deterministic seed when generated
- score policy has explicit denominator and threshold
- proposed changes pass schema, dataset, name, and policy validation
- generated tests include seed and source failure refs
- improvement cannot apply when score gets worse unless explicitly approved as an experiment
- rollback ref exists before a governed mutation is applied
- `optimize`, `optimise`, `evolve`, and `mutate` behavior has explicit score,
  seed, policy, rollback, and audit boundaries when used
- every cycle has audit evidence

## Success Criteria

- can measure quality with a reproducible score
- can identify weak rules, recurring failures, and repeated patterns
- can create improvement proposals without applying them automatically
- can generate tests from failures with stable seed behavior
- can apply approved improvements and keep rollback evidence
- can compare before/after score and produce a clear audit report

## Do

- treat rule, test, score, failure, proposal, and audit output as entities
- use existing validation utility behavior before mutation
- use `action_entity` for record lifecycle
- require approval for changes that alter active behavior
- keep random or exploratory changes behind seed, policy, and audit records

## Do Not

- do not let an agent rewrite its own active rules without approval
- do not use unseeded mutation in production workflows
- do not treat a higher score as sufficient without regression checks
- do not introduce source-specific names when approved An App names already cover the concept
- do not claim production readiness from one score alone

## Handoff Notes

The source inbox uses terms such as optimizer and evolution. In An App, adopt
the useful behavior as a governed improvement cycle with score records,
proposals, approval gates, rollback, and audit.

Allowed controlled operation names:

- `optimize`
- `optimise`
- `evolve`
- `mutate`

Blocked source-branded names for active implementation:

- `neuro_rule`
- `rule_engine`
