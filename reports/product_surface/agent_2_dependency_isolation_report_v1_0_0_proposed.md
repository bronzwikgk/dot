# Agent 2 Dependency Isolation Report

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Related owner agent: agent_ui_application

## Problem

Agent 2 reported that product_surface work appeared dependent on Agent 1
foundation/runtime work and Agent 3 language/memory work.

That was a valid contract issue. The earlier assignment made cross-agent
relationships explicit, but did not clearly separate start dependencies from
integration dependencies.

## Decision

Agent 2 work must proceed through stable contracts, mock ports, fixture records,
and schema-shaped examples. Agent 2 does not wait for Agent 1 or Agent 3 concrete
modules except for final integration and real app e2e validation.

## Mock Ports

- `entity_store_port`
- `runner_port`
- `command_intent_port`
- `template_port`
- `version_port`

## Agent 2 Can Start Now

- ui vocabulary review
- builder entity model
- layout projection rules
- builder shell view planning
- editor and command surfaces
- production template fixtures
- template validation path
- responsive and advanced layout parity reports

## Final Integration Needs

Agent 1 later supplies real entity, runner, version, repository, and e2e ports.
Agent 3 later supplies real command intent, language, bot, memory, and brain
ports.

## Validation

Agent 2 handoff must list:

- mock ports used
- fixture records used
- concrete provider modules intentionally skipped
- real integration methods expected from Agent 1 and Agent 3
- tests run against fixtures
- remaining integration risk
