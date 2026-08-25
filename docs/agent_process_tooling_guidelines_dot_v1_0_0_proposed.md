# Agent Process Tooling Guidelines For dot

Date: 2026-08-25
Owner agent: agent_codex_an_app
Status: proposed

## Purpose

Define which available tools can help with architecture planning, team
coordination, specifications, and development planning.

## Available Tooling

| Tooling | Use | Boundary |
| --- | --- | --- |
| `multi_agent_v1` | Coordinate bounded parallel agent work after the user has approved multiple agents or delegated work. | Use only for clear side tasks with separate write areas or independent reviews. Do not hand off the immediate blocker. |
| Figma tools | Create or inspect visual architecture diagrams, product surface maps, layout plans, and design-system views when the user asks for a diagram or visual design artifact. | Follow Figma skill requirements before using Figma tools. Do not use Figma for normal markdown specs. |
| InternalCore task tools | Create or inspect external task records if the user wants task management outside the repo. | Do not use without user direction for external tracking. Repo docs remain the source of truth for this batch. |
| local docs and contracts | Define architecture, requirements, specs, contracts, work packets, reports, and handoffs. | This is the default planning system for dot. |

## Default Planning Process

Use this process before implementation:

1. read the current conversation and newest user correction
2. read `docs/policy_and_convention_for_dot.md`
3. read `docs/development_guidelines_for_dot.md`
4. read the active master docs
5. read the related parent contract and detail contracts
6. check shared inbox for conflicts or handoffs
7. identify owner agent, domain, subdomain, app data shape, and file location
8. write or update the smallest needed scope, contract, schema, or report
9. validate names, banned words, folder placement, and requirement mappings
10. only then implement code or app data

## When To Use Multi-Agent Work

Use multi-agent work when:

- the user has approved multiple agents
- tasks are independent
- each agent has a separate write area
- each agent has an assigned owner name
- each task has parent/detail contracts
- outputs can be reviewed without blocking the immediate local task

Do not use multi-agent work when:

- the next step depends on the result immediately
- the task is ambiguous
- two agents would edit the same file group
- the contract does not name the owner agent
- the work needs a user authorization decision first

## Architecture And Spec Outputs

Preferred outputs:

- requirement table with ids
- entity definition document
- schema contract
- app data shape decision
- parent contract
- detail contract
- implementation plan
- validation report
- handoff note

## Efficiency Rules

- use existing docs and datasets before creating new wording
- keep planning docs indexed by id
- keep contracts rigid and short enough to hand to another agent
- add examples only when they reduce ambiguity
- use reports for findings and contracts for required work
- do not create a new name for a concept already covered by an approved term
