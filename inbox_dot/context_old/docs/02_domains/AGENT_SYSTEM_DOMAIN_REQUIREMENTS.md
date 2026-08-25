# Agent System Domain Requirements

## Purpose

The Agent System domain defines how An App represents agents, agent roles,
skills, menus, flows, profiles, rules, facts, and review behavior as entities.

This domain is needed because the large agent folders contain repeated patterns
that are broader than An Bot chat behavior.

## Collaboration Bus Requirements

Multi-agent collaboration should be treated as an optional agent-system module.
The core pattern is an append-only event bus with governed handoff states.

Agent handoff flow:

1. request
2. acknowledge
3. execute
4. emit_manifest
5. validate
6. close

Bus records should include:

- `id`
- `sender`
- `receiver`
- `task_ref`
- `status`
- `payload_ref`
- `manifest_ref`
- `validation_result`
- `created_at`
- `closed_at`

This module should not bypass normal entity validation, audit, or approval
rules.

## Core Entities

- agent
- skill
- flow
- menu
- profile
- rule
- policy
- fact
- template
- review
- benchmark
- report

## Agent Record Fields

- id
- type
- name
- version
- status
- tags
- purpose
- capability list
- specialty list
- supported language list
- input schema
- output schema
- policy list
- rule list
- related entity list
- default settings
- flow map
- template map

## Skill Record Fields

- id
- name
- purpose
- input shape
- output shape
- validation rules
- risk level
- timeout
- retry policy
- audit level

## Flow Requirements

Agent flows must support:

- named branches
- ordered steps
- step conditions
- payload mapping
- template rendering
- previous step output references
- rule checks after each step
- deterministic logs

## Review Agent Requirements

Review agents must record:

- review focus
- severity scale
- issue list
- score
- suggested fix
- blocking condition
- approval condition

## Dataset Requirements

Add 1D arrays for:

- agent entity type names
- agent profile field names
- skill field names
- flow field names
- review field names
- severity names
- approval action names
- benchmark metric names

## Validation Requirements

- Agent records must have id, type, name, version, purpose, and capability list.
- Skills must declare input and output shape.
- Flows must only reference approved entities.
- Review output must include severity and evidence.
- Risky steps must require policy checks.

## Use Cases

- code review agent
- security review agent
- planner agent
- test runner agent
- documentation updater agent
- result aggregator agent

## Adoption Notes

Learned from large agent folders, especially agent profile YAML, universal
entity templates, feature inventories, and dataset blueprints. Old source names
remain evidence only.
