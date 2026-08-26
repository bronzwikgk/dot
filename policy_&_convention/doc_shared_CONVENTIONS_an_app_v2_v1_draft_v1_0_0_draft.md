# CONVENTIONS â€” an_app
## Naming, Files, Headers, Modules, Mutation, Testing

| property | value |
| :--- | :--- |
| document id | `conventions_an_app_v2` |
| file name | `doc_shared_conventions_an_app_v2_draft_v1_0_0_draft.md` |
| date | `2026-08-22` |
| status | draft |
| authority | extends `doc_shared_TAXONOMY_an_app_v1_draft_v1_0_0_draft.md` (r-rules own conflicts); lineage: 6d pipeline convention specification v1 |
| companion | `doc_shared_FLOW_an_app_v1_draft_v1_0_0_draft.md`, `doc_shared_PLUGIN_API_an_app_v1_draft_v"1_0_0"_draft.md`, starter kit templates |

---

## 1. Purpose

One reference for every naming, documentation, structural, and mutation
convention in `an_app`. Where the taxonomy says *what the layers are*, this says
*what every artifact must look like*. Convention ids `cv1...` are citable from
checklists and reviews.

---

## 2. Casing Rules

| # | rule |
| :--- | :--- |
| cv1 | snake_case everywhere: files, folders, functions, variables, keys, ids, events (inherited naming law) |
| cv2 | no camel_case, pascal_case, kebab_case anywhere â€” including string literals that act as identifiers |
| cv3 | no screaming case; states are lowercase words (`pending`, `running`, `done`, `error`) |
| cv4 | no acronyms anywhere â€” identifiers, prose, messages, schemas. Acronym short forms exist only inside machine-generated identifier values (uuid strings, run ids). Human-facing text always spells words out |
| cv5 | system-internal identifier vocabulary (`id`, `uuid`) is permitted solely as internal keys and values inside code, configs, and storage layers; it is never surfaced in rendered content |

Deviation from 6d lineage: 6d allows pascal_case classes and upper_snake states;
an_app forbids both (r6 no classes, cv3).

---

## 3. Artifact Naming Schema

| artifact kind | pattern | example |
| :--- | :--- | :--- |
| documents | `SUBJECT_<scope>_v<N>_<status>.md` | `doc_shared_FLOW_an_app_v1_draft_v1_0_0_draft.md` |
| tests | `test_<scope>_<target>_<status>.js` | `test_an_app_dag_engine_draft.js` |
| configs | `config/<name>.js` exporting one default object | `config/default_config.js` |
| datasets | `dataset_<scope>_<description>_<status>.js` | `dataset_an_app_stop_words_draft.js` |
| schemas | embedded in ontology modules; never standalone json | `ontology/schemas.js` |
| runtime code | plain snake_case, folder gives kind | `kernel/entity_store.js`, `utility/topo_sort.js` |

Rationale for deviation: runtime code carries its version and status in the
self-describing header (`Â§4`), not in the file name â€” renames do not touch
imports. Document-kind prefixes stay reserved for non-code artifacts.

---

## 4. Self-Describing File Header

Every `.js` file opens with one JSDoc block carrying all eleven fields:

```js
/**
 * @entity entity_store
 *
 * @meta
 * project: an_app
 * file_name: src/core/kernel/entity_store.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * cache and version entities over any storage provider.
 *
 * @purpose_and_problem_statement
 * repeated provider round trips and silent overwrites lose history;
 * this module keeps a hot cache and append-only versions.
 *
 * @usage
 * ```js
 * const store = create_entity_store({ ctx });
 * await store.save(entity);
 * ```
 *
 * @timing
 * boot step 3 singleton; serves persist (stage 12) and load paths.
 *
 * @scope_boundaries
 * in_scope: caching, versioning, delegation to providers
 * out_of_scope: provider implementations, query logic
 *
 * @dependencies
 * - kernel/persistence.js
 * - utility/time.js
 *
 * @keywords
 * entity, cache, version, store
 *
 * @invariants
 * - versions are append only; revert creates a new head
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
```

| # | rule |
| :--- | :--- |
| cv6 | all eleven fields present and non-empty in every kernel, plugin, utility, and test file |
| cv7 | `@usage` examples must match real exported signatures (reviewer or script verifies) |
| cv8 | `@keywords` are single lowercase tokens usable for search indexing |

---

## 5. Module Shape Standard (replaces 6d class shape)

No classes (r6). The uniform unit is a factory returning closed-over methods:

```js
export function create_entity_store(config_module) {
  const cache = new Map();                 // private, per instance
  const { ctx } = config_module;

  async function save_entity(entity) { /* ... */ }
  async function load_entity(id) { /* ... */ }

  return { save_entity, load_entity };     // named surface only
}
```

| # | rule |
| :--- | :--- |
| cv9 | exactly one factory per module matching its file name: `create_<module_name>(config_module)` |
| cv10 | first parameter is always one config object; never positional piles |
| cv11 | private state lives in closure variables; nothing hangs off `this` (there is no `this`) |
| cv12 | returned object exposes only named operations consumed by `ctx` wiring |

---

## 6. Markdown Entity Definitions

Entity types are defined once, in ratified ontology documents:

```markdown
### <type_name>

| attribute | type | required | constraint |
| :--- | :--- | :--- | :--- |

```yaml
policy:
  strict_keys: false
  retention_versions: 10
  transitions: []
```
```

| # | rule |
| :--- | :--- |
| cv13 | shape lives in the markdown table; runtime policy lives in the yaml fence; parsers read both |
| cv14 | a type without a ratified markdown definition cannot be registered (rule p6) |

---

## 7. Identifiers and Depth Indexing

| target | format | example |
| :--- | :--- | :--- |
| entity id | uuid v4 | `"9b1deb4d..."` |
| flow step position | `s<stage>[.<index>]...` depth by dots | `s9`, `s9.2`, `s9.2.1` |
| run identity | `<utc_stamp>__<brief_name>__<sequence>` | `20260822T101500__smoke__0001` |
| finding id | `fnd_<run_sequence>_<n>` | `fnd_0001_07` |

| # | rule |
| :--- | :--- |
| cv15 | nested steps append dot indices; depth is visible in the id itself |
| cv16 | run ids sort chronologically as strings; sequences zero padded |

---

## 8. Filesystem Mutation Rules

| # | rule |
| :--- | :--- |
| cv17 | only `boot` and storage/display provider plugins touch raw fs apis directly |
| cv18 | everything else mutates through provider contracts: `save_entity`, `load_entity`, `delete_stored` â€” requested as bus operations, never ad hoc calls |
| cv19 | optimistic locking: mutations carry `expected_version`; mismatch returns a conflict response, never silently overwrites |
| cv20 | artifacts and logs are append only; reverts create new heads; runs write into `runs/<run_id>/` (stage isolation per run) |

This implements agent sandboxing (no raw fs from handlers) and matches
`nfr_sec` intent without extra machinery: the broker is the storage provider,
the mailbox is the message bus.

---

## 9. Parser-Friendly Layout Declaration

The taxonomy folder tree is mirrored as parseable lines so scripts can verify
layout automatically:

```
[root_workspace]/
[src]/[main.js]
[src]/[core]/[boot]
[src]/[core]/[kernel]
[src]/[plugins]/[engines]
[src]/[plugins]/[providers]/[storage]
[src]/[utility]
[config]
[ontology]
[doc]
[runs]
[tests]
```

| # | rule |
| :--- | :--- |
| cv21 | one path per line, bracket tokens only, starting with `[root_workspace]/`; a layout checker diffs disk against these lines (automates taxonomy check t4) |

---

## 10. Testing Conventions

| # | rule |
| :--- | :--- |
| cv22 | all tests live in `tests/`; naming per Â§3; one target per file |
| cv23 | assertions use runtime `assert`; failures throw descriptive messages naming target and expected vs actual |
| cv24 | suites run bare against factories â€” no page, no network, no timers beyond fake clocks |
| cv25 | gate discipline: engine-affecting changes re-pass the full suite before touching real data or merging |

---

## 10a. Display and Name Reservation Rules

| # | rule |
| :--- | :--- |
| cv26 | raw identifier values never appear in content shown to users or developers: displays, responses, reports, exports use human-readable labels and titles. Identifier values live only in trace/log/debug surfaces (sole exception: `inspect_system` trace views) |
| cv27 | check before create: before naming any file, folder, type, trait, link, operation, event, config key, permission, plugin, or intent, search the glossary, ontology registries, and taxonomy name registry. Exact match â†’ reuse it. Similar word â†’ extend that concept's definition instead. Nothing similar â†’ reserve the name by adding a row to the owning document before any code exists |
| cv28 | synonyms are banned: one concept carries one name everywhere (`directory` and `folder` may not coexist); the glossary Â§7 rulings are final |

---

## 11. Compliance Gate Map

Conventions enforced at project phases (see `shared/handbook/HANDBOOK_PROJECT_START`):

| phase gate | conventions checked |
| :--- | :--- |
| vocabulary ratification | cv4, cv5, cv13, cv14, cv28, ontology ng1â€“ng5 (+ synonym merge) |
| name reservation review | cv27 performed against glossary + ontology + taxonomy registry |
| code review | cv1â€“cv12 complete headers, usage/signature match |
| display/response review | cv26 labels not identifiers |
| layout audit | cv21 diff clean |
| pre-merge / pre-run | cv19, cv20, cv22â€“cv25 |
| formula review | cv29â€“cv33 validated; cell references checked against grid bounds |
| delivery | changelog rows exist for every version bump (header field 11) |

---

## 12. Formula Conventions

| # | rule |
| :--- | :--- |
| cv29 | formula expressions are prefixed with `=` in cell values; raw text without `=` is treated as literal string |
| cv30 | cell references use A1 notation: column letter (A-Z) + row number (1+); ranges use `A1:B10` syntax |
| cv31 | formula functions are UPPER_CASE: `SUM`, `AVG`, `IF`, `CONCAT`; custom functions follow the same pattern |
| cv32 | formula errors are findings, not exceptions; invalid syntax returns `#ERROR!`, unknown function returns `#NAME?`, div by zero returns `#DIV/0!` |
| cv33 | formula evaluation is deterministic; same inputs always produce same output; no side effects allowed in formulas |

---

## Change Log

| version | date | change |
| :--- | :--- | :--- |
| 1.0.0-draft | 2026-08-22 | casing, artifact naming, eleven-field header, factory module shape, markdown entity defs, depth ids, mutation broker, layout declaration, testing rules, gate map |
| 1.2.0-draft | 2026-08-22 | added formula conventions cv29â€“cv33; ohm integration |

