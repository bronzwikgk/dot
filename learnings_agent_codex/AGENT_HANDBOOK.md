# Agent Handbook For An App

Agent name for this archive: `agent_codex_an_app`
Active master location: `dot/docs/an_app_master_project`
Learning archive location: `dot/learnings_agent_codex`
Shared inbox: `dot/learnings_agent_codex/shared_inbox`

## 1. Project In Simple English

An App is a real business application platform where every durable or governable thing is an entity. An application is an entity. A document is an entity. A workflow is an entity. A dataset, schema, policy, route, view, book, cell, version, bot session, and agent plan are all entities.

The user wants An App to convert natural English and structured input into validated entity records, run them through a predictable pipeline, and produce usable artifacts such as applications, websites, notebooks, workflows, reports, dashboards, diagrams, domain templates, bots, and business workspaces.

## 2. Source Of Truth

Use these files first:

- `dot/docs/an_app_master_project/an_app_master_project_document.md`
- `dot/docs/an_app_master_project/an_app_requirements_and_spec.md`
- `dot/docs/an_app_master_project/an_app_input_and_artifact_checklist.md`
- `dot/docs/an_app_master_project/an_app_pending_work_tracker.md`

Use this archive second:

- `dot/learnings_agent_codex`

The archive preserves reasoning, source adoption notes, scratchpad code, datasets, and prior experiments. If archive content conflicts with the active master docs, the active master docs win unless the user explicitly reopens that decision.

## 3. Core Doctrine

- Everything durable or governable is an entity.
- Every entity should have identity, type, config, schema, relationships, policy, provenance, status, diagnostics, and validation state.
- Registry behavior is entity behavior.
- State is an entity.
- A book is an entity.
- A cell is an entity.
- A template is an entity.
- A workflow is an entity.
- A version is an entity.
- Prefer existing entity behavior before creating new plugins or utilities.

Doctrine enforcement:

- Before adding any durable item, classify it as an entity or explain why it is temporary runtime-only data.
- Before adding any new entity type, operation, dataset, schema, utility, plugin, route, view, ui component, workflow stage, policy, or status, search the active docs and datasets for an existing approved name.
- If an approved name exists, reuse it.
- If a similar name exists, do not create a new one without explicit user authorization.
- If no approved or similar name exists, create a proposed-name note in the shared inbox and wait for user authorization before making it active.
- Every authorized new name needs owner domain, purpose, boundary, validation rule, and source/evidence.

## 4. Canonical Pipeline

The full pipeline is:

`ingest -> decompose -> parse -> build_ast -> build_dag -> classify -> validate -> reason -> resolve -> plan -> execute -> compose -> display -> persist -> audit -> respond`

Do not add new universal stages casually. If a capability is ui-specific, provider-specific, or export-specific, document it as a supporting capability.

## 5. Current Pending Work

The active tracker is:

`dot/docs/an_app_master_project/an_app_pending_work_tracker.md`

Highest-priority pending groups:

- dataset registry and dataset reconciliation
- operation/task/pipeline/workflow name reconciliation
- entity type reconciliation
- trait dataset and trait-operation relationship map
- relationship metadata and validation
- version record schema and version-system boundary
- diff/conflict utility scope
- provider/storage/index contracts
- ui component, event, layout, style, and token datasets
- An App Lang training-vs-execution policy
- An Memory reasoning trace and episode schema

When starting work, pick one utility, plugin, dataset, schema, or doc batch. Finish it fully before moving to the next one.

## 6. Development Order

Preferred order:

1. Define or reconcile dataset names.
2. Define schema or contract.
3. Build or update utility.
4. Build or update plugin only when utility/entity behavior is not enough.
5. Add or update tests.
6. Add or update docs.
7. Add or update log.
8. Run validation.
9. Tell the user the commit message and whether it is ready to push.

The user commits and pushes through GitHub Desktop.

## 7. Utility Versus Plugin

Utility:

- deterministic helper
- validation, parsing, formatting, extraction, comparison, diff, normalization, or pure transformation
- should avoid owning durable app state
- should usually be class/config/method style

Plugin:

- governed capability
- can call utilities
- can coordinate entity operations
- can execute workflows or mutate records through policy
- should validate input, output, internal state, and policy

Use `action_entity` for entity lifecycle whenever possible. Do not create a separate class just because a thing exists as an entity.

## 8. Naming Conventions

Use snake_case for:

- file names
- class names when project code allows it
- method names
- dataset names
- entity types
- operation names
- field names
- workflow stage names

Avoid introducing new names when an approved existing name can carry the meaning.

New-name authorization gate:

1. Search active docs: `dot/docs/an_app_master_project`.
2. Search active code/datasets: `dot/code`, `dot/dataset_shared_v3`, and any active dataset folder.
3. Search learning archive only for background: `dot/learnings_agent_codex`.
4. Compare exact names, plural/singular forms, aliases, and similar meaning.
5. Reuse the approved existing name when possible.
6. If a new or similar name is still needed, create an inbox note with the proposed name, alternatives found, reason reuse is not enough, owner domain, and requested authorization.
7. Do not implement the new name until the user authorizes it.

Required proposed-name note fields:

- proposed_name
- proposed_kind
- owner_domain
- reason
- existing_names_checked
- similar_names_found
- reuse_decision
- requested_authorization
- affected_files
- validation_plan

Banned or avoidable names include:

- `src`
- `function`
- `foreach`
- `engine`
- `deps`
- `materialize`
- `materialization`
- camelCase public API names such as `evaluateRule` or `flattenToVector`

Approved examples:

- `config`
- `node_runtime`
- `evaluate_rule`
- `flatten_to_vector`
- `action_entity`
- `version_entity`
- `diff_entity`
- `resolve_conflict`

## 9. Documentation Rules

Every promoted utility/plugin/dataset/schema should have:

- one doc in `dot/docs`
- one log in `dot/log`
- clear purpose
- what it does
- when to use it
- how to use it
- input/output contract
- failure behavior
- test strategy
- known limits
- update policy

Do not leave knowledge only in chat. Persist learning in the relevant doc or the shared inbox.

## 10. Testing Strategy

Run tests at the smallest useful boundary first, then broader checks.

For JavaScript modules:

- run module import smoke checks
- run focused behavior checks for changed methods
- run edge cases for null/undefined/empty/object/array/string values
- run generated tests when the utility supports them
- run self-tests for the test-generation utility after changing test-generation code

Known useful commands from `dot`:

```powershell
node .testgen\run_generated_tests.mjs
node .testgen\run_testgen_self_tests.mjs
node --test .testgen\*.test.mjs
```

Last known generated test result:

- `1296` passed
- `0` failed
- `0` skipped

## 11. End-To-End Validation

For an e2e pass, validate these layers:

1. Source intake: every input source is inventoried and counted.
2. Dataset: approved names exist, duplicates are checked, banned words are absent.
3. Schema: required fields and field types validate.
4. Entity: create/read/update/delete/query paths work.
5. Relationship: source/target/type/cardinality rules validate.
6. Pipeline: stages can run in order and report diagnostics.
7. Runner: AST and DAG plans validate and execute safely.
8. Plugin: input/output/internal validation passes.
9. Artifact: docs, logs, outputs, and checklist evidence exist.
10. Version: change record, diff, history, and restore policy are accounted for when relevant.
11. Audit: count, decision, evidence, known limits, and next action are recorded.

Do not claim e2e readiness when only unit tests ran.

## 12. Evaluation Strategy

When evaluating code/docs:

- compare implementation against active docs
- compare docs against source learning
- check duplicate concepts
- check similar names
- check misplaced domain ownership
- check banned/avoidable names
- check old names that should be aliases only
- check public API consistency
- check docs/log/test coverage for each changed item
- separate true conflicts from intentional newer additions

Useful scans:

```powershell
Select-String -Path 'dot\code\**\*.js' -Pattern 'materialize|materialization|flattenToVector|evaluateRule|VectorMathUtil|forEach|\bsrc\b|deps'
```

For docs, scan active docs and the current log too.

## 13. Version Management Doctrine

An App adapts Git concepts at the entity level:

- snapshot
- diff
- branch
- merge
- conflict
- status
- staging
- history
- tag
- restore
- field_provenance

Version records are entities. Use `action_entity` for record lifecycle first. Add a utility or plugin only for version-specific diff, conflict, merge policy, restore safety, or provenance tracing.

## 14. Do

- Read existing code and docs before changing anything.
- Work one utility/plugin/dataset at a time.
- Preserve user or other-agent changes.
- Keep edits scoped.
- Prefer existing project patterns.
- Enforce `everything is an entity` before adding durable state or records.
- Search for existing and similar names before adding any new name.
- Use the shared inbox for proposed names that require authorization.
- Add docs and logs with every promoted change.
- Run tests and report exact results.
- Use the shared inbox for handoffs, blockers, and decisions.
- Give the user a clear commit message when ready.

## 15. Do Not

- Do not overwrite unrelated changes.
- Do not invent new concepts when existing entity/action behavior is enough.
- Do not add a new or similar name without explicit user authorization.
- Do not bypass the entity doctrine by creating hidden durable state outside entity records.
- Do not add new universal pipeline stages without a strong reason.
- Do not treat scratchpad/archive docs as active truth over master docs.
- Do not leave large decisions only in chat.
- Do not claim tests passed if only test files were generated.
- Do not silently accept duplicate names, similar names, or banned words.
- Do not push or commit unless the user explicitly asks; the user manages GitHub Desktop.

## 16. Shared Inbox Protocol

Use:

`dot/learnings_agent_codex/shared_inbox`

Create one Markdown file per message or handoff:

`YYYY_MM_DD_agent_name_topic.md`

Each inbox note should include:

- author
- date
- status
- files touched
- question or decision needed
- evidence
- next action

If a note becomes resolved, add a `Resolution` section instead of deleting the note.

## 17. Ready-To-Push Criteria

Before telling the user to push:

- `git status --short` is reviewed
- changed files are expected
- docs/logs are updated
- tests are run or explicitly reported as not run
- active docs have no duplicate indexed IDs
- banned-name scans are clean for touched code/docs
- commit message is supplied

Recommended commit message format:

`<verb> <area> <purpose>`

Example:

`Add agent handbook and shared inbox`
