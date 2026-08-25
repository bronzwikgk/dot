# Gap Analysis

## Purpose

This file compares existing `dot/code` against the scratchpad domain scope.

## Strong Existing Foundation

- Existing workflow runner supports AST plans, DAG tasks, conditions, nested
  flows, budgets, sessions, and topological sorting.
- Existing workflow validator supports schemas, rule evaluation, and path
  resolution.
- Existing action entity `v3_0_0` provides stable CRUD behavior.
- Existing test generation tools can inspect code, infer signatures, and create
  generated tests.
- Promoted entity system adds richer entity records, approved vocabulary,
  registry lookups, simple parsing, simple reasoning, app manifest planning,
  and markdown parsing.

## Main Gaps

### Testing Gaps

- Promoted entity-system files are not in generated-test manifest.
- `package.json` has no test scripts.
- No focused contract tests exist for relationships, graph cycles, schema
  enforcement, template-driven artifact creation, or parser confidence.

### Dataset Gaps

- Dataset arrays exist, but there is no registry report.
- Dataset groups do not yet declare owner docs in entity records.
- Relationship maps are checked manually, not by reusable utility methods.
- Language alias datasets exist in scratchpad staging, but they need map records
  to approved core datasets before promotion.

### Schema Gaps

- Schema catalog exists only as documentation.
- Existing entity validator does not yet enforce every schema in the schema
  catalog.
- No schema records exist as importable data.

### Entity Gaps

- `action_entity v3_1_0` is advanced but not fully tested.
- `v3_0_0` and `v3_1_0` need a compatibility report before replacement.
- Relationship cardinality and inverse validation are not complete.

### runner Gaps

- Existing runner and entity runner have a documented boundary, but no adapter
  connects simple stage pipelines to full workflow plans.

### Product Gaps

- App generator emits only a manifest plan, not created artifacts.
- Template-driven artifact creation does not exist yet.
- Command/capability records do not exist yet.
- Bot, memory, language, UI render profile, and external intake modules are
  documented but mostly not coded.

## Conflicts To Watch

- Do not let source-adoption automation become active again unless explicitly
  requested. It is deferred.
- Do not replace the existing runner until the current workflow tests and entity
  runner tests pass together.
- Do not replace `action_entity v3_0_0` until old callers are checked.
- Do not mix UI vocabulary into core validation vocabulary.
- Do not treat generated tests as proof of correctness without focused contract
  tests.
- Do not promote language alias datasets as new sources of truth. They must map
  to existing approved system names.
