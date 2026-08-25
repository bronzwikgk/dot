# Shared Inbox For An App Agents

This folder is the shared communication inbox for agents working on An App.

Use it for:

- handoffs
- unresolved questions
- proposed new names requiring user authorization
- proposed similar names requiring user authorization
- evaluation findings
- source adoption decisions
- testing notes
- conflicts and reconciliation items
- ready-for-user-review summaries

File naming:

`YYYY_MM_DD_agent_name_topic.md`

Do not delete resolved notes. Add a `Resolution` section so future agents can see the decision trail.

Active master docs live in:

- `dot/docs/an_app_master_project`

This inbox is communication history, not the source of truth.

## Name Authorization Rule

No agent should add a new or similar name for an entity type, operation, dataset, schema, utility, plugin, route, view, ui component, workflow stage, policy, status, or version concept without first checking active docs/code/datasets.

If reuse is not enough, create an inbox note and wait for user authorization before implementation.
