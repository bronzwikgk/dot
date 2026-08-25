# An Bot Scope And Requirements

## Purpose

An Bot is the conversational agent module inside An App.

## Bot Self Description

The bot should be able to introduce itself in plain English.

The welcome message should:

- describe what it can do
- explain that capabilities are defined in governed records
- mention multi-session and multi-turn context when enabled
- show safe example requests
- expose help, guide, and command entry points

## Context Defaults

Default conversation context may start with:

- context window: 10 turns
- short-term session memory
- session-based persistence

These values should be configurable and visible in bot diagnostics.

Its job is to let a user talk to An App, inspect what the system understood,
run approved tools, review confidence, manage sessions, and guide application
changes through validated entity plans.

An Bot is not a separate product. It is a reusable bot capability used by An App
and domain templates. It sits beside An App Lang. An App Lang understands
language; An Bot manages conversation, session, tool use, feedback, and
agent-facing workflow.

## Position In An App

Flow:

```text
user message
-> an_bot
-> session and context load
-> an_app_lang
-> parsed intent and entity plan
-> confidence and findings
-> tool or entity action proposal
-> entity_validator
-> action_entity
-> response, log, learning record
```

An Bot should never mutate application state directly. It should create a
proposed action, show confidence and findings, then pass approved changes
through validation.

## Source Learning

An Bot learns from chat UI references, agent-bot references, task-continuity
notes, sentence automation notes, and rulebot capability dictionaries.

Source-specific project names are not adopted. Useful bot concepts are
translated into An Bot entities, datasets, maps, tables, components, and tests.

## Core Responsibilities

- chat-first user interface
- session memory
- conversation history
- tool routing
- tool result display
- confidence display
- structured understanding preview
- quick action shortcuts
- feedback capture
- correction review
- stats and health display
- exportable conversation record
- self-description
- profile-aware help
- domain-aware examples
- secure message intake
- API-backed bot access
- in-app about and changelog views

## Required Entities

An Bot should model these as entities:

- bot_session
- bot_message
- bot_response
- bot_tool_request
- bot_tool_result
- bot_action_proposal
- bot_confidence_report
- bot_context_snapshot
- bot_feedback_record
- bot_correction_record
- bot_learning_record
- bot_stats_snapshot
- bot_health_status
- bot_quick_action
- bot_example_prompt
- bot_profile
- bot_stage
- bot_goal
- bot_capability
- bot_self_definition
- bot_conversation_export
- bot_api_route
- bot_security_check
- bot_rate_limit_record
- bot_storage_policy
- bot_changelog_entry
- bot_about_section
- bot_tool_category
- bot_command_example
- bot_conversation_boundary_result
- bot_task_context
- bot_scheduled_task
- bot_task_run
- bot_capability_dictionary_entry
- bot_capability_trigger
- bot_capability_pattern
- bot_capability_constraint

## Required Datasets

An Bot needs approved 1D datasets for:

- message role names
- message type names
- tool status names
- confidence band names
- quick action names
- session status names
- bot profile names
- lifecycle stage names
- goal category names
- feedback type names
- correction status names
- response format names
- context item names
- health status names
- export format names
- bot API route names
- bot security check names
- bot storage policy names
- bot tool category names
- bot documentation section names
- bot command example names
- conversation boundary signal names
- task schedule status names
- bot capability dictionary names
- bot capability trigger names
- bot capability constraint names

## Required Data Maps

An Bot needs relationship/mapping data for:

- message text to language request
- intent to quick action
- intent to tool request
- tool request to tool result
- response to confidence report
- correction record to learning record
- profile to goals
- profile to lifecycle stages
- stage to goals
- example prompt to intent
- session to messages
- session to context snapshot
- bot capability to approved tool
- action proposal to entity change plan
- API route to bot operation
- security check to intake stage
- tool category to tool names
- command phrase to tool request
- changelog entry to version
- about section to capability
- boundary result to task context
- task context to active session
- scheduled task to task run
- task run to audit entry
- capability dictionary entry to trigger
- capability dictionary entry to pattern
- capability dictionary entry to constraint
- capability dictionary entry to tool request

## Required Data Tables

An Bot needs tabular definitions for:

- bot sessions
- bot messages
- tool requests
- tool results
- quick actions
- example prompts
- profile goals
- lifecycle stages
- feedback records
- correction records
- learning records
- confidence reports
- stats snapshots
- health snapshots
- API route definitions
- security check records
- rate limit records
- storage policies
- changelog entries
- about sections
- command examples
- conversation boundary scoring rows
- task context rows
- scheduled task rows
- task run rows
- capability dictionary entries
- capability triggers
- capability patterns
- capability constraints

## Required Components

An Bot should be made from reusable utilities and plugins:

- conversation_manager
- session_manager
- message_store
- context_loader
- tool_router
- tool_registry_adapter
- response_formatter
- confidence_presenter
- structured_preview_builder
- quick_action_provider
- feedback_collector
- correction_reviewer
- learning_record_writer
- stats_collector
- health_reporter
- export_manager
- self_description_provider
- profile_goal_provider
- bot_security_checker
- rate_limit_checker
- api_route_adapter
- changelog_provider
- about_section_provider
- screenshot_tool_adapter
- ui_inspection_tool_adapter
- style_update_tool_adapter
- conversation_boundary_detector
- task_context_manager
- task_resolver
- task_scheduler
- task_runner
- capability_dictionary
- capability_matcher
- parameter_extractor

## Conversation Requirements

Every user message should create a structured bot_message with:

- id
- session id
- role
- type
- text
- timestamp
- related intent
- related entities
- confidence report
- findings
- tool request ids
- action proposal id
- security check id
- rate limit record id

Supported message roles:

- user
- assistant
- tool
- system

Supported message types:

- chat
- tool_request
- tool_result
- action_proposal
- clarification
- correction
- diagnostic
- export
- status
- documentation

## Intake Security Requirements

Every incoming user message should pass through intake checks before intent
matching or tool routing.

Required intake checks:

- rate limit check
- text sanitization
- blocked phrase check
- private data policy check
- tool permission check
- mutation approval check

Security checks should produce structured findings. A blocked message should
return a clear explanation and should not create an action proposal.

Normalization should include:

- trim whitespace
- normalize casing
- remove unsupported control characters
- detect homophone or near-word candidates when configured
- preserve the original text for audit

## Session Requirements

An Bot should preserve useful session state:

- current session id
- active task id
- active task topic
- active task intent
- active task entities
- last message text
- last message timestamp
- message count
- recent activity
- storage use
- active profile
- active domain
- active application
- active workflow
- recent tools
- recent action proposals
- unresolved findings
- current theme profile
- stored statistics
- structured preview state

Session controls:

- create session
- save session
- load previous session
- clear current session
- clear all sessions
- export session

The session system should auto-save after meaningful interaction.

Storage rules:

- local storage may be used for browser-only prototypes
- production storage must be selected by deployment profile
- maximum saved sessions should be policy-driven
- old sessions may rotate out only when the storage policy allows it
- session recovery should restore messages, stats, active theme, and preview
  state
- storage use should be visible as normal, warning, or full

## Conversation Boundary Requirements

An Bot should decide whether each message starts a new task or continues the
active task.

Boundary results should include:

- id
- session id
- message id
- boundary value
- confidence
- reasons
- related task id
- suggested next action

Boundary signals should be configurable and explainable:

- message similarity
- topic similarity
- intent similarity
- entity similarity
- time gap

Reference weighting may start as:

- message similarity: 0.35
- topic similarity: 0.25
- intent similarity: 0.20
- entity similarity: 0.15
- time gap: 0.05

Below the configured continuation threshold, An Bot should create a new task
context. Above the threshold, An Bot should update the active task context.
Every decision should store the signal values so a user or maintainer can see
why the boundary decision happened.

## Task Context Requirements

A task context stores the active work thread inside a session.

Each task context should include:

- id
- session id
- topic
- intent
- entities
- status
- schedule
- pause state
- last message id
- last message timestamp
- confidence report id
- audit id

Required task context operations:

- create task context
- update task context
- get active task context
- expire task context
- clone task context
- link message to task context
- snapshot task context
- roll back task context

Task contexts should be isolated by session. A task from one session must not
receive messages, timers, logs, or tool results from another session.

## Scheduled Task Requirements

An Bot may create scheduled tasks only through validated action proposals.

Scheduled tasks should support:

- interval schedule
- basic calendar schedule
- human-readable schedule aliases
- pause
- resume
- trigger now
- unregister
- retry with backoff
- idempotent run keys
- audit record

Task runs should record:

- scheduled task id
- session id
- task context id
- start timestamp
- finish timestamp
- status
- retry count
- input summary
- output summary
- findings
- audit id

## Tool Requirements

Tools should be represented as approved entities. A bot may suggest or run a
tool only when the tool is registered and permitted.

Each tool should define:

- name
- purpose
- input contract
- output contract
- permission policy
- timeout policy
- result format
- failure format
- audit behavior
- category
- natural command phrases
- quick action availability

Tool outputs should be shown as structured bot_tool_result records, not only
plain text.

Reference tool categories to support as approved tool entities:

- theme tools
- screenshot tools
- export tools
- style update tools
- session tools
- inspection tools
- statistics tools

Reference tool examples:

- switch to dark theme
- switch to light theme
- switch to blue theme
- capture conversation image
- inspect current markup
- export conversation
- clear conversation
- save session
- update style property
- show statistics
- show session information

Screenshot tools should define a primary capture method and a fallback method.
Export tools should include metadata such as session id, timestamp, message
count, and stats.

## Capability Dictionary Requirements

An Bot should maintain an approved capability dictionary for routing user
messages to tool requests and action proposals.

Each capability dictionary entry should include:

- id
- name
- description
- category
- priority
- requires confirmation
- similar names
- patterns
- triggers
- constraints
- allowed targets
- blocked targets
- related tool ids
- related action ids
- confidence policy
- audit policy

The dictionary should support:

- file and artifact management capability
- navigation capability
- process and task monitoring capability
- text search capability
- system status capability
- command execution flow
- context management flow
- error recovery flow
- user input processing activity
- intent matching activity
- parameter extraction activity

Capability matching should produce:

- matched capability id
- matched trigger
- matched pattern
- extracted parameters
- confidence
- required confirmation
- findings
- suggested clarification

Constraints should be data-backed. Destructive actions, private data access,
system-level actions, and mutation requests must pass policy and approval checks
before an action proposal can be executed.

## Confidence Requirements

An Bot should show confidence when the answer depends on parsing, matching,
retrieval, or tool output.

Confidence bands:

- high
- medium
- low

Low-confidence results should ask for review or clarification before mutation.

Confidence reports should include:

- score
- band
- reason
- matched pattern
- missing data
- suggested correction

Reference confidence bands:

- high: score above 80 percent
- medium: score above 60 percent through 80 percent
- low: score up to 60 percent

## Structured Preview Requirements

An Bot should let the user inspect how the system understood a message.

Preview views:

- parsed intent
- extracted entities
- slots
- relationships
- proposed action
- tool request
- findings
- tree view
- current knowledge tree
- matched question
- matched keywords
- matched pattern
- available feature tags

This preview should use An App Lang output and should not create a separate
understanding path.

## Quick Action Requirements

An Bot should expose common actions as approved shortcuts.

Examples:

- show session info
- show parsed tree
- show findings
- run validation
- export conversation
- create correction
- show related docs
- show tool result
- show stats
- switch theme
- capture conversation
- inspect current markup
- clear conversation
- save session
- load previous session

Quick actions should map to approved intents and tools.

## Feedback And Learning Requirements

An Bot should capture feedback without silently changing approved behavior.

Feedback examples:

- answer helpful
- answer not helpful
- wrong intent
- wrong entity
- wrong relationship
- wrong tool
- missing context
- unsafe suggestion

Correction workflow:

1. capture correction
2. store correction record
3. connect it to the original message and response
4. create learning record
5. mark it pending review
6. validate proposed vocabulary or rule change
7. promote only after approval

## Self-Description Requirements

An Bot should know and expose:

- name
- purpose
- version
- active domain
- active profile
- available capabilities
- available tools
- known limits
- current session state
- learning policy

Self-description should be data-backed, not hand-written differently in each
screen.

## Profile And Stage Requirements

An Bot can support domain-specific help through profiles, stages, and goals.

For the software lifecycle domain, useful profile concepts include:

- product manager
- developer
- devops specialist
- quality specialist
- security specialist
- architect
- database administrator
- data specialist
- reliability specialist
- platform specialist
- user experience specialist
- support specialist
- technical writer
- release manager
- compliance specialist
- mobile developer
- machine learning specialist
- analytics specialist
- bot maintainer

Useful stage concepts include:

- ideation
- analysis
- design
- development
- testing
- deployment
- operation
- maintenance
- retirement

These are examples for a domain template. The generic bot module should support
any domain profile, stage, and goal dataset.

## User Interface Requirements

An Bot UI should support:

- chat panel
- message input
- quick tools panel
- structured preview panel
- tool output panel
- stats panel
- session panel
- docs panel
- examples panel
- profile panel
- health panel
- about panel
- changelog panel
- tool categories panel
- storage information panel
- recent sessions panel
- API reference panel

Useful interaction behavior:

- send on Enter
- allow multi-line message input
- disable input while processing
- show processing indicator
- auto-scroll current conversation
- show confidence badge
- show tool output
- show session status
- show recent sessions
- show storage use
- show available tools
- show in-app docs
- show version changelog

Semantic UI requirements:

- prefer meaningful elements for app structure
- dialog may be used for focused chat or demo flows
- output may be used for message history
- details and summary may be used for profile and docs sections
- table may be used for stage coverage
- navigation should expose docs, examples, profiles, and stats
- keyboard navigation should work for tabs, inputs, and example prompts

## Documentation Requirements

An Bot should have docs for:

- what it is
- where it sits in An App
- how it uses An App Lang
- how sessions work
- how conversation boundaries are detected
- how task contexts are created and updated
- how scheduled tasks are approved and run
- how tools are registered
- how confidence works
- how corrections become learning records
- how profiles and stages are modeled
- how to add a domain template
- how to test bot behavior
- how to update approved datasets
- how API routes are exposed
- how intake security works
- how storage policy works
- how tool categories are added
- how about and changelog content is produced

In-app documentation sections:

- features
- demo
- profiles
- examples
- stages
- architecture
- quick start
- configuration
- API reference
- changelog

Reference API routes:

- create chat message
- get profile goals
- get stage tasks
- get bot self-description
- get available tools
- export session

## Test Requirements

Required tests:

- session create/save/load tests
- message persistence tests
- conversation export tests
- tool routing tests
- denied tool tests
- tool output formatting tests
- confidence band tests
- structured preview tests
- quick action mapping tests
- feedback capture tests
- correction review tests
- profile goal lookup tests
- stage goal lookup tests
- self-description tests
- stats snapshot tests
- health status tests
- intake security tests
- rate limit tests
- storage rotation tests
- session recovery tests
- screenshot fallback tests
- style update permission tests
- API route tests
- about section tests
- changelog tests
- semantic UI structure tests
- conversation boundary scoring tests
- task context isolation tests
- scheduled task registration tests
- scheduled task pause and resume tests
- task run audit tests

## Integration Requirements

An Bot must integrate with:

- an_app_lang
- entity_validator
- action_entity
- entity_registry
- tool registry
- diagnostics system
- audit log
- metrics log
- docs registry
- template registry
- profile and stage datasets
- API route registry
- storage adapter registry
- security policy registry
- theme profile registry
- scheduler adapter registry
- task context registry

## Non-Goals

An Bot should not:

- bypass validation
- mutate entities without approval policy
- invent approved names automatically
- hide low-confidence results
- store private data without policy
- treat demo examples as production facts
- couple one domain template to the generic bot module

## Minimum Complete V1

Minimum V1 should support:

- create a session
- store user and assistant messages
- call An App Lang for one message
- classify one message as new task or continuation
- create or update one task context
- show parsed intent and findings
- create one action proposal
- route one approved tool
- show one tool result
- show confidence band
- export conversation JSON
- capture one correction
- store correction as pending review
- show bot self-description
- show one profile goal lookup from dataset
- run one intake security check
- enforce one rate limit policy
- restore one session from storage
- expose one bot API route
- show one about section
- show one changelog entry
- execute one screenshot fallback path
- validate one semantic UI structure
- dry run one scheduled task through approval and audit

## Adoption From Reference Files

Adopted learning:

- chat-first surface
- session memory and auto-save
- local storage prototype behavior
- maximum saved session rotation
- session recovery after reload
- tool routing from natural language
- structured tool output
- tool categories
- theme, screenshot, export, style update, session, inspection, and statistics
  tools
- confidence badges
- structured tree preview
- keyword, pattern, and feature-tag matching
- synonym expansion and stop-word removal
- quick tools panel
- stats and health panel
- session controls
- conversation export
- storage cleanup and backup behavior
- in-app about and changelog content
- self-description
- profile, stage, and goal catalogs
- processing pipeline with receive, security, normalize, intent, entity,
  context, response, learn, and log stages
- rate limiting, sanitization, blocked phrase checks, lowercase, trim, and
  homophone normalization
- API access for chat, profile goals, and stage tasks
- feedback and correction learning loop
- semantic UI layout using meaningful elements
- example prompts as data
- domain templates for role-specific help
- conversation boundary detection using similarity, topic, intent, entity, and
  time signals
- weighted boundary scoring with stored reasons
- session-bound task context for continuing work
- scheduled task creation, pause, resume, retry, and audit behavior
- multi-session task isolation

Changed for An App:

- old project names are not adopted
- hardcoded examples become datasets and templates
- tool-specific commands become tool entities with contracts
- demo text becomes sample data, not product truth
- learning records require validation before promotion
- browser-only local storage is treated as prototype storage, not the only
  storage option
