# Parent Contract 006: Bot Agent Runtime

Status: proposed
Priority: p1
Owner agent: agent_lang_and_memory
Delivery lane: language_and_knowledge

## Goal

Build the bot and agent runtime that keeps session context, plans tasks, asks for approvals, executes workflows, records artifacts, and hands off work through shared inbox records.

## Subcontracts

- ../contract_004_validation_utility_contract.md
- ../contract_005_action_entity_boundary_contract.md
- ../contract_007_workflow_pipeline_runner_contract.md
- ../contract_010_an_app_lang_contract.md
- ../contract_011_an_bot_agent_contract.md
- ../contract_012_an_memory_reasoning_contract.md
- ../contract_014_quality_audit_e2e_contract.md
- ../contract_017_agent_improvement_cycle_contract.md
- ../contract_019_an_app_brain_domain_contract.md

## Required Output

- bot session schema
- agent task schema
- approval gate schema
- task plan and run records
- pause/resume/cancel behavior
- shared inbox handoff behavior
- agent audit behavior

## Success Criteria

- can distinguish new task from continuation
- can ask for approval before risky mutation
- can run workflow tasks and record audit output
- can pause/resume/cancel
- can hand off to another agent with complete context
- can record improvement proposals without self-applying them

## Do Not

- do not let agents mutate active code/docs without logs
- do not let an agent rewrite its active behavior without approval
- do not drop user context during handoff
