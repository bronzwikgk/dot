# An Rule Bot Doc Dataset Adoption Note

## Scope

Reviewed selected documentation, registry, rule, and report files from
`input_temp/b7/AnRuleBot`.

This pass focused on capability registries, action registries, rulebooks,
policies, templates, safety, context, knowledge ingestion, and tests.

## Files Reviewed

- `input_temp/b7/AnRuleBot/doc/README.md`
- `input_temp/b7/AnRuleBot/doc/CAPABILITIES.md`
- `input_temp/b7/AnRuleBot/doc/FEATURES.md`
- `input_temp/b7/AnRuleBot/doc/KNOWLEDGE.md`
- `input_temp/b7/AnRuleBot/doc/manifest_ARuleBot_v1-1-0_active.md`
- `input_temp/b7/AnRuleBot/doc/doc_ARuleBot_v1-1-0_active.md`
- `input_temp/b7/AnRuleBot/doc/rules/README.md`
- `input_temp/b7/AnRuleBot/doc/rules/ARB-RULEBOOK.rules`
- `input_temp/b7/AnRuleBot/inbox_anrulebot/faq_bot/v2/registries/actions.txt`
- `input_temp/b7/AnRuleBot/inbox_anrulebot/faq_bot/v2/registries/capabilities.txt`
- `input_temp/b7/AnRuleBot/inbox_anrulebot/faq_bot/v2/registries/entities.txt`
- `input_temp/b7/AnRuleBot/inbox_anrulebot/faq_bot/v2/registries/parameters.txt`
- `input_temp/b7/AnRuleBot/inbox_anrulebot/faq_bot/v2/registries/policies.txt`
- `input_temp/b7/AnRuleBot/inbox_anrulebot/faq_bot/v2/registries/rules.txt`
- `input_temp/b7/AnRuleBot/inbox_anrulebot/faq_bot/v2/registries/templates.txt`
- `input_temp/b7/AnRuleBot/inbox_anrulebot/faq_bot/v2/registries/tests.txt`

## What This Folder Is About

This folder describes a rule-based conversational command assistant.

In simple English:

- a user writes a natural English request
- the bot matches it to a capability
- the capability maps to an action
- required parameters are extracted
- risk and policy checks run
- missing parameters trigger clarification
- risky actions require confirmation
- allowed actions run under an environment profile
- the result is logged and context is updated

This is directly useful for An Bot and An App Lang.

## Adopted Concepts

### Registry Set

Required registries:

- capability registry
- action registry
- entity type registry
- parameter type registry
- policy registry
- rule registry
- template registry
- project template registry
- test registry

Adoption target:

- `AN_BOT_SCOPE_REQUIREMENTS.md`
- `APPLICATION_ENTITY_DOCTRINE.md`
- dataset files

### Capability Record

Required fields:

- id
- name
- description
- similar phrases
- patterns
- required parameters
- optional parameters
- linked action
- risk
- examples

### Action Record

Required fields:

- id
- name
- description
- type
- output template
- risk
- notes
- optional project template

### Rule Record

Required fields:

- id
- name
- description
- condition
- result action
- priority
- explanation
- examples

### Policy Record

Required fields:

- id
- name
- description
- condition
- enforcement
- severity
- scope

### Template Record

Required fields:

- id
- text
- slot names
- linked action or response purpose

### Safety Model

Required risk levels:

- low
- medium
- high
- critical

Required safety behavior:

- destructive work requires explicit confirmation
- high-risk work requires confirmation
- missing parameters require clarification
- policy violations are blocked or escalated
- all executions are logged
- dry run is the default for risky work

### Conversation Context

Required context fields:

- last command
- last entity
- last location
- turn history
- session id
- pronoun resolution target
- context reset marker

### Knowledge Organization

Knowledge groups:

- actions
- entities
- rules
- policies
- templates

Knowledge behavior:

- load knowledge from editable text files
- detect changes
- re-ingest only changed files
- store knowledge hierarchically
- expose search and retrieval

## Dataset Additions Needed

Add or extend 1D arrays for:

- bot registry group names
- capability field names
- action field names
- parameter field names
- policy field names
- rule field names
- template field names
- project template field names
- bot test field names
- risk level names
- confirmation mode names
- context field names
- knowledge group names
- environment profile names

## Documentation Updates Needed

1. `AN_BOT_SCOPE_REQUIREMENTS.md`
   - Add the full registry model.
   - Add capability to action mapping.
   - Add safety and confirmation model.
   - Add context field model.

2. `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
   - Add pattern to capability parsing.
   - Add parameter extraction and clarification rules.

3. `APPLICATION_ENTITY_DOCTRINE.md`
   - Add registry records as entity-backed definition types.

4. `AN_MEMORY_SCOPE_REQUIREMENTS.md`
   - Add bot knowledge ingestion and hierarchical knowledge storage.

## Decision

Adopt the registry-driven bot design and safety model. Keep old names as
evidence only. This folder should drive An Bot registry design, command safety,
clarification behavior, and testable capability records.
