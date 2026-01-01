---
Version: v1.0.0
Status: draft
Agent: Gemini CLI
Last Updated: 2025-12-29
---
# Agent Definition

An **Agent** is the orchestrated system that combines a profile, intelligence, memory/knowledge, context, instructions, and tools to deliver enterprise-grade work on a given task.

## Core Components

*   **Profile** - captures the agent's persona, role boundaries, and any mission-specific preferences supplied by stakeholders.
*   **Brain** - the decision-making engine that reasons over inputs, applies policies, and chooses next actions.
*   **Memory & Knowledge** - persistent artifacts (logs, learned context, domain knowledge) that the agent reuses across interactions.
*   **Context** - the current problem space (files, prior conversations, constraints, scope) that grounds every step.
*   **Instruction** - explicit directives (user requests, policies, templates) that steer the agent's behavior on a per-task basis.
*   **Tools** - scripts, editors, APIs, or other integrations the agent invokes to inspect, modify, or validate the environment.

## Lifecycle

1.  **Room initialization** - Every agent begins work in a dedicated room/environment where it records its activity in an activity log for traceability.
2.  **Scope of Work** - Before deeply acting, the agent drafts a Scope of Work file. Only after a stakeholder or another agent signs off on that plan does work proceed.
3.  **Execution** - The agent follows the approved scope, continuously referencing context, instructions, and tools while enriching the activity log.
4.  **Validation & Hand-off** - Deliverables are validated per the success criteria and documented before the agent signals completion or escalates to another collaborator.

## Behavior Principles

*   Prioritize following the provided briefs, requirements, and specifications over introducing unsolicited ideas.
*   Document every meaningful decision in logs so collaborators understand the agent's rationale.
*   Respect stated constraints; do not delete data unless explicitly permitted.

## Dependencies

*   This agent reference relies on the standard room setup (activity log, scope-of-work approval) and the templates defined under `mat_101/templates`.
*   Tools should be versioned consistently; any integrations pulled in here must be documented with their semantic version and stored alongside the agent's assets.

## Reference Implementation

*   The `mat_101/html/mat_demo.html` test platform launches an agent powered by the Ollama model host; Ollama serves as the agent's **brain**, while this doc supplies the profile, memory/knowledge, and instruction context.
*   That demo HTML exposes the available models list, allows tool invocations (workspace explorers, approval flows), and records actions in the activity log so the agent can make tool calls, manage configuration, and remember which models are supported.
*   Use this reference when building new agents: it shows how to wire profile data, memory logs, and available tool endpoints into the agent lifecycle, keeping the model list and Ollama connection details in sync with the agent definition.

## How to Use an Agent

1.  Create or update the Scope of Work file and obtain stakeholder approval before initiating a task.
2.  Use this definition to prime the agent’s profile, permissions, and tool access in the room setup.
3.  Log every action in the room activity log and follow the lifecycle steps (room init → execution → validation/hand-off).
4.  When updating agent artifacts, append a semantic version suffix to filenames (e.g., `Agent_Definition_v1.2.md`) and note the change in `log/changelog_v1.md`.

## FAQ

*   **Q:** Who approves agent activity?
    **A:** A stakeholder or another agent must approve the Scope of Work before full execution.
*   **Q:** What happens if new tools are needed?
    **A:** Describe the dependency, register its semantic version, and ensure it is listed under Dependencies with justification.
*   **Q:** How are constraints enforced?
    **A:** Constraints live in the Scope of Work and instructions; the agent must reference this section on every task and never delete data unless explicitly told.
