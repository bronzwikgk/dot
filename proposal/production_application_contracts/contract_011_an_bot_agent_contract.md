# Contract 011: An Bot Agent

Status: proposed
Priority: p1
Owner domains: an_bot, agent_system

## Purpose

Define the bot and agent layer that keeps session context, interprets commands, asks for approval, runs tasks, and returns artifacts.

## Required Records

- bot_session
- agent
- agent_task
- command
- approval_gate
- handoff
- agent_run_record
- artifact
- audit_report

## Validation

- command is approved
- actor has permission
- approval gate is explicit for risky changes
- generated artifact passes checklist
- session context is recoverable
- all agent actions are audited

## Success Criteria

- continue prior task context
- distinguish new task from continuation
- pause/resume/cancel task
- hand off to another agent through shared inbox
- create artifacts with validation evidence

## Do Not

- do not let agents mutate active docs/code without logs
- do not bypass approval gates
