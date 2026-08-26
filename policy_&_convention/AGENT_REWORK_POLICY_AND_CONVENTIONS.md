# Agent Rework Policy And Conventions

## Purpose

This document records recent mistakes, rework, and prevention rules for agents
working in this scratchpad and any promoted copy (for example `dot/code`).

The goal is not blame. The goal is to make the next agent faster, cleaner, and
less likely to repeat avoidable work.

This document is the **highest-authority convention file**. When any other doc
conflicts with a rule here, this file wins. Where this file is silent, the
canonical owner doc named below wins.

## Zero-Tolerance Rules (must hold before any change is marked done)

These are non-negotiable. A change that breaks any of them is rejected on
review regardless of how much else it improves.

1. **No "complete" / "covered" / "done" without evidence.** A doc, dataset
   group, batch, or source folder may only be called complete when:
   - every source it covers is listed with a real path and a file/item count,
   - the claim is reconciled against the audit logs in `04_audits_and_logs`,
   - gaps are either patched or explicitly logged as open,
   - tests and scans have actually been run and passed.
   Contradicting an audit log (which is the source of truth for gaps) is a
   blocking violation. See Mistake #9.

2. **Docs and datasets move together.** When a doc introduces or changes an
   approved name, the corresponding 1D dataset MUST already contain it. The doc
   must never claim coverage for a dataset group that does not exist in code.
   See Mistake #7 and Gap #G1.

3. **One concept, one owner.** A concept is defined in exactly one primary owner
   doc. Other docs may reference it but must not redefine it. Adoption notes are
   **source evidence only** and can never be an owner. See Mistake #3 and Gap #G6.

4. **Canonical vocabularies are single-source.** States, registries, trees,
   schemas, and flow stages each have exactly one owning doc (listed under
   `Canonical Vocabularies` below). Domain docs may only reference these; they
   must never invent parallel taxonomies. See Gaps #G2–#G5.

5. **Naming is enforced, not suggested.** Code identifiers and dataset items are
   `snake_case`. Doc filenames are `UPPER_SNAKE_CASE` (deliberate exception, see
   `Naming Convention`). Mixed casing inside one module is forbidden. See
   Mistake #8 and Gap #G7.

6. **Reproducible references only.** Every path, file, dataset, or concept a doc
   cites must resolve from a declared root. Dangling or root-ambiguous references
   are blocking. See Gap #G0.

## Recent Mistakes And Rework

### 1. Mixed Domain Scope Into An App Lang

Mistake: English grammar knowledge was added directly into
`AN_APP_LANG_SCOPE_REQUIREMENTS.md`.

Why it was a problem: An App Lang is a generic language capability. English
grammar is domain knowledge. Mixing them made the language doc too broad and
blurred ownership.

Fix: Created `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` and linked it from An App
Lang.

Convention: When a topic is domain-specific, create or update a domain document.
Keep generic modules generic.

### 2. Used Large Noisy Source Scans

Mistake: A broad scan included dependency folders and produced huge noisy output.

Why it was a problem: It wasted time, made analysis harder, and risked adopting
irrelevant external package details.

Fix: Stopped the noisy scan and switched to narrower first-party docs and
targeted patterns.

Convention: Before scanning reference projects, exclude dependency folders and
generated artifacts. Prefer docs and first-party code.

### 3. Added Requirements Before Separating Ownership

Mistake: Some concepts were patched into the nearest existing doc before deciding
whether they belonged to An App, An App Lang, An Bot, or English Language.

Why it was a problem: It created later cleanup and duplicated concepts across
documents.

Fix: Created a clearer module/domain boundary and the placement rules below.

Convention: Classify the learning before writing it.

### 4. Used Banned Words Accidentally

Mistake: A banned word appeared in an error string in `entity_runner.js`.

Why it was a problem: The project has explicit vocabulary bans. Even incidental
strings create drift.

Fix: Changed the implementation and reran the banned-word scan.

Convention: After edits, always run the banned-word scan. Treat docs, code,
comments, and messages as vocabulary surfaces.

### 5. Relied On "Covered" Too Early

Mistake: The docs were said to be complete before comparing deeply against all
relevant source files.

Why it was a problem: Later references revealed missing details such as intake
security, locked corpus policy, sentence grammar ownership, storage policy, and
API route contracts.

Fix: Repeated source comparison and patched missing requirements.

Convention: Do not say "complete" until the Definition Of Done is satisfied.

### 6. Did Not Create The English Domain Doc First

Mistake: English was treated as extra An App Lang detail instead of its own
domain.

Why it was a problem: The user's core model is "everything is an entity," and a
language is also a domain/entity. English deserves a domain document with its
own datasets and rules.

Fix: Created `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`.

Convention: If a reusable knowledge area has its own vocabulary, lifecycle,
tests, and datasets, it should probably be a domain document.

### 7. Let Dataset And Doc Updates Drift Apart

Mistake: Some requirements were added to docs before matching 1D approved-name
datasets were updated.

Why it was a problem: The project wants validation to come from datasets. Docs
without datasets can become aspirational only.

Fix: Added language-related 1D arrays to `validation_word_datasets.js`.

Convention: When adding a new approved group of names, update both the relevant
requirement document and the approved 1D dataset file. Never claim a dataset
group is covered unless it exists in code (Gap #G1).

### 8. Reused Source Names Too Loosely

Mistake: Some source concepts were initially carried forward too directly.

Why it was a problem: The user wants learning from old projects, not copying old
names or polluted naming.

Fix: Translated source concepts into An App naming and documented what was
changed.

Convention: Adopt concepts, not old product identity. Use approved snake_case
names.

### 9. Declared "Complete" Against The Audit Logs

Mistake: `SCRATCHPAD_DOC_COMPLETENESS_EVALUATION.md` concluded the docs were
"complete as a concept and requirement archive" while the `04_audits_and_logs`
files explicitly say the same scope is "not yet complete" and list open gaps, and
while the same completeness eval still enumerated nine unresolved "Main
Conflicts."

Why it was a problem: It taught downstream agents to trust a "complete" label
that the project's own evidence contradicted, and it violated Mistake #5's own
rule. It also let doc/dataset drift (Gap #G1) be waved through.

Fix: Treat the `04_audits_and_logs` files as the source of truth for gaps. A
"complete" claim must cite the specific audit line that supports it.

Convention: No doc may call itself or another doc "complete," "covered," or
"done" unless every unresolved conflict and gap in the owning audit is either
closed or carried as an explicitly tracked open item. When in doubt, say
"current status" and link the audit, never "complete."

### 10. Let The Source-Adoption Index Diverge From The Audits

Mistake: `SOURCE_ADOPTION_INDEX_AND_VALIDATION_LOG.md` marked b2/b3 as "covered"
with 1–5 inventoried files, while the manual audit counts 645 and 20,088 files
for those same batches and names them the largest remaining gaps. The index also
never added b4/b6/b7 even though its own mandate covers all reviewed sources.

Why it was a problem: An index that overstates coverage hides the exact work
that still needs doing and gives a false "green" signal during promotion.

Fix: Regenerate the index from the audit counts. Every batch (b0–b7) must have a
row with a real file/item count and an honest coverage state.

Convention: A coverage or inventory claim is invalid unless it includes a
count and a resolvable path. Never write "covered" without the underlying
evidence in the same file. When an audit supersedes an index, the index is
wrong and must be corrected, not the other way around.

### 11. Left Source Paths Root-Ambiguous

Mistake: Docs reference `input_temp/`, `inbox_knowledge/`, `gk/gui_v4`, and
`D:/gk_work/feb2026` as if they live inside the scratchpad, but they are
siblings of `scratchpad_entity_system/` at the repository root. Nothing declares
the root, so the references are not reproducible from inside the scratchpad.

Why it was a problem: An agent or reader working in the scratchpad cannot locate
the cited sources, so the citations are effectively dead and unauditable.

Fix: Declare one canonical repository root (see `Source Path Convention`) and
write every source reference as `<repo-root>/<path>`.

Convention: No source reference is valid unless it resolves from the declared
root. Relative paths that assume the scratchpad contains source folders are
forbidden.

### 12. Invented Overlapping Vocabularies (states, registries, trees)

Mistake: The docs accumulated four separate "state" taxonomies (application
lifecycle, knowledge activation, approval, software stage), referenced many
registries not in the doctrine's registry list, and introduced tree terms
(`layout abstract tree`, `style rule tree`, `semantic_element_tree`) outside the
resolved taxonomy — while the `Project Tree Node` schema was assigned an owner
but never written.

Why it was a problem: Parallel taxonomies without a single owner drift apart,
break validation datasets, and make "is this name approved?" unanswerable.

Fix: Established the `Canonical Vocabularies` section as the single source for
states, registries, trees, schemas, and flow stages.

Convention: Any new state word, registry, tree term, schema, or stage must be
added to its owning canonical doc, never inline in a domain doc. A domain doc
that needs a vocabulary item opens an issue against the owner instead of defining
its own.

### 13. Redefined Shared Schemas Inside Domain Docs

Mistake: `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` and
`COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` specified record fields for Audit
Report, Action, and Command that disagree with `SCHEMA_CONTRACT_CATALOG.md`
(the designated schema owner).

Why it was a problem: Two specs for the same record guarantee that one
implementation will not validate against the other, and the drift is invisible
until code is written.

Fix: Made `SCHEMA_CONTRACT_CATALOG.md` the sole owner of record shapes.

Convention: A domain doc references a schema by name and links to the catalog.
It must not list its own field set for a record the catalog already owns. If the
catalog is wrong, fix the catalog.

### 14. Carried Source Typos And Duplicated Words As Canonical

Mistake: Source misspellings propagate as filenames and evidence names
(`actionLable`, `reequirnment`), and docs contain duplicated-word errors
("Artifact artifact creation," "create artifact artifact creator").

Why it was a problem: Typos baked into filenames and canonical references become
permanent, search-breaking debt and imply the bad name is approved vocabulary.

Fix: Proofread before publishing; translate source names, do not copy them
(Mistake #8).

Convention: No typo, duplicated word, or source misspelling may survive into a
published doc, filename, dataset item, or identifier. Run a proofing pass
(Gap #G8).

### 15. Baked camelCase Source Names Into Promotion Cross-References

Mistake: `CODE_PROMOTION_EVALUATION.md` cites scratchpad source as camelCase
(`action_entity.js`, `markdown_pipeline.js`) while `07_development_plan` cites
the promoted snake_case names (`code_shared_action_entity_v3_1_0_draft.js`). The
same modules appear under two naming schemes with no reconciliation, and the
promoted `dot` files were partially renamed so docs and code no longer agree.

Why it was a problem: It reproduces exactly the doc/code drift this policy exists
to prevent, and makes "which name is real?" unanswerable during promotion.

Fix: Promoted names are canonical for cross-references; the promotion mapping is
recorded once in `CODE_PROMOTION_EVALUATION.md` and nowhere else invents names.

Convention: See `Promotion And Rename Convention`. A rename is all-or-nothing;
do not leave a module partially camelCase/snake_case, and update the doc test
commands in the same change.

### 16. Cited Verification Commands That Do Not Run

Mistake: The verification block told agents to run `npm test` / generated smoke
tests, but in the promoted `dot` repo those commands fail (no test script; the
smoke tests use a different runner), so the checks were never actually green.

Why it was a problem: A verification step that cannot run gives false confidence
and violates the "tests passed" part of the Definition Of Done.

Fix: Verification commands are written per target repo and confirmed runnable
before being cited.

Convention: Never cite a test/scan command you have not executed successfully in
the target repo. If the repo has no test harness, say so and list the manual
checks performed instead.

## Source Learning Convention

When learning from a source folder or file:

1. Identify the source path (rooted per `Source Path Convention`).
2. Read docs first.
3. Read first-party code only when docs are incomplete.
4. Ignore dependency folders, generated assets, package locks, and vendor files.
5. Extract concepts, not names.
6. Classify each concept into one owner document.
7. Add datasets for approved 1D word groups.
8. Add data maps or data tables only when relationships or attributes are needed.
9. Record intentionally rejected source ideas.
10. Run tests and scans.

## Learning Placement Policy

Every learning must have one primary owner. A concept may be referenced from
other docs, but it should be defined once.

Use these placement rules:

- Put application philosophy, entity doctrine, lifecycle, artifact creation,
  publishing, and product-wide rules in `APPLICATION_ENTITY_DOCTRINE.md`.
- Put generic language parsing, controlled language, request normalization,
  entity change plans, template parsing, and language-provider routing in
  `AN_APP_LANG_SCOPE_REQUIREMENTS.md`.
- Put English-specific grammar, sentence types, parts of speech, sentence
  completion, sentence similarity, sentence diff, English corpus policy, and
  English template learning in `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`.
- Put conversation UX, sessions, messages, quick actions, tool routing,
  confidence display, corrections, task continuity, and scheduled task chat
  behavior in `AN_BOT_SCOPE_REQUIREMENTS.md`.
- Put durable knowledge, working memory, episodic memory, semantic memory,
  confidence propagation, proof traces, knowledge gaps, conflict handling,
  learning provenance, consolidation, and forgetting in
  `AN_MEMORY_SCOPE_REQUIREMENTS.md`.
- Put approved cross-system names in `code/dataset/validation_word_datasets.js`.
- Put approved interface names in `code/dataset/ui_word_datasets.js`.
- Put scratchpad history, decisions, and document index in `PROJECT_CONTEXT.md`.

Domain rules:

- A domain is a reusable knowledge area with its own vocabulary, datasets, data
  maps, data tables, tests, and update policy.
- A subdomain is a smaller knowledge area inside a domain that still shares the
  parent domain lifecycle.
- A module is a reusable application capability that can be used by many
  domains.
- A plugin is an executable capability that uses utilities, datasets, policies,
  and configs to do work.
- A utility is reusable support logic used by plugins or modules.
- A template is an entity pattern used to create or validate other entities.

Examples:

- English Language is a domain.
- English sentence completion is a subdomain of English Language.
- An App Lang is a module.
- An Bot is a module.
- An Memory is a module.
- Action Entity is a plugin.
- Entity validator is a utility.

When a new learning appears, route it by asking:

- Is it about what An App is? Use application doctrine.
- Is it about understanding language independent of English? Use An App Lang.
- Is it about English vocabulary, grammar, or sentence behavior? Use English
  Language.
- Is it about chat, sessions, user interaction, or tool routing? Use An Bot.
- Is it about storing, proving, recalling, validating, or forgetting knowledge?
  Use An Memory.
- Is it only a word list? Use the approved dataset.
- Is it only a visual/interface name? Use the UI dataset.

Rejected placement:

- Do not put English grammar directly in An App Lang.
- Do not put chat/session behavior in English Language.
- Do not put durable knowledge memory rules only in An Bot.
- Do not put old project names into canonical names.
- Do not duplicate a definition across multiple docs.
- Do not make an adoption note the owner of a concept (it is evidence only).

## Ownership Convention

Use this routing:

- Application-wide architecture goes in `APPLICATION_ENTITY_DOCTRINE.md`.
- Generic language capability goes in `AN_APP_LANG_SCOPE_REQUIREMENTS.md`.
- English grammar and English corpus knowledge goes in
  `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`.
- Conversational agent behavior goes in `AN_BOT_SCOPE_REQUIREMENTS.md`.
- Knowledge memory and learning governance goes in
  `AN_MEMORY_SCOPE_REQUIREMENTS.md`.
- Scratchpad history and links go in `PROJECT_CONTEXT.md`.
- Approved validation names go in `code/dataset/validation_word_datasets.js`.
- Approved UI names go in `code/dataset/ui_word_datasets.js`.

If a new topic does not fit these, create a new module or domain document rather
than overloading an existing one.

**Mandatory doc header.** Every canonical doc MUST begin with an owner block:

```text
Primary owner: <doc name>
Owns: <comma-separated concept list>
Out of scope (see <other doc>): <comma-separated concept list>
Last reconciled with audits: <date or "pending">
```

An adoption note MUST NOT contain an `Owns:` line. It contains `Source:` and
`Learning captured by: <canonical doc>`.

## Naming Convention

Required:

- `snake_case` for ids, class names, method names, dataset items, and code
  filenames unless an existing external literal must be quoted.
- `UPPER_SNAKE_CASE` for **document markdown filenames** (for example
  `APPLICATION_ENTITY_DOCTRINE.md`). This is a deliberate exception to the
  code-filename rule; doc filenames are not code.
- `code` is the project folder word.
- 1D arrays are the default for approved word groups.
- Data maps are for relationships and mappings.
- Data tables are for rows with named attributes.
- Definition documents are for config, schema, policy, and long-form contracts.

Avoid:

- copying old product names as canonical An App names
- adopting near-duplicate names when an approved name exists
- mixing UI names into core validation names
- adding one class per noun when the generic entity model is enough
- mixing `camelCase` and `snake_case` inside a single module or document set

## Canonical Vocabularies (single source of truth)

The following docs are the ONLY owners of their vocabulary. Domain docs reference
them; they do not redefine.

- **Flow stages** — `APPLICATION_ENTITY_DOCTRINE.md` owns the 13 universal
  stages (`decompose, validate, parse, transform, reason, resolve, index,
  compose, execute, format, display, persist, respond`). Every documented
  pipeline (An App Lang, An Bot, Natural Input) MUST map each of its steps onto
  one of these 13, or explicitly record the deviation as an open gap. No other
  doc may define stage names.
- **States** — separate, explicitly named taxonomies, never merged:
  - Application lifecycle: `APPLICATION_ENTITY_DOCTRINE.md`
  - Knowledge activation states: `AN_MEMORY_SCOPE_REQUIREMENTS.md`
  - Approval states: `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`
  - Software/stage lifecycle (only if needed): `AN_APP_LANG` or `ENGLISH`
    as appropriate, linked from the doctrine
  `CONCEPT_CATALOG.md` MUST list all four and state their relationship. A new
  state word goes to its owning doc, never inline.
- **Registries** — `APPLICATION_ENTITY_DOCTRINE.md` owns the canonical registry
  list. It MUST be reconciled against every domain doc; any registry a domain doc
  references (`capability`, `tool`, `policy`, `source`, `schema`, `relationship`,
  `storage`, `theme`, `scheduler`, `api_route`, etc.) MUST be added to that list
  with a one-line definition. Referenced-but-undefined registries are open bugs.
- **Trees** — `CONCEPT_CATALOG.md` owns the tree taxonomy
  (`document tree`, `semantic tree`, `project tree`, `render tree`,
  `relationship graph`). New tree terms are forbidden unless added there.
  `SCHEMA_CONTRACT_CATALOG.md` owns every tree *node* schema; the `Project Tree
  Node` schema MUST be written there before any doc claims project-tree coverage.
- **Schemas / records** — `SCHEMA_CONTRACT_CATALOG.md` is the SOLE owner of
  record shapes (entity, relationship, policy, contract, template, command,
  capability, action, flow, audit report, document tree, semantic tree, project
  tree, render tree, intake, planning artifact). Domain docs reference by name
  and link; they must not list their own field sets.

## Dataset Reconciliation Convention

- `DATASET_REGISTRY_REQUIREMENTS.md` is the inventory of every required 1D
  dataset group. It MUST list each group with: owner doc, target file, and
  status (`present` / `missing`).
- A doc MUST NOT claim a dataset group is covered unless the group exists in
  `validation_word_datasets.js` or `ui_word_datasets.js`.
- Known missing groups (track as open, do not claim covered):
  `repository_stage`, `action_surface`, `search_provider`, `parser_format`,
  `label_category`, `semantic_particle`, `conversation_node`, and any group an
  `03_source_adoption_notes` or `04_audits_and_logs` file lists as "Dataset
  Additions Needed."
- When a domain doc requires a new approved name group, open the dataset file AND
  update the registry inventory in the same change.

## Source Path Convention

- The repository root is the parent of `scratchpad_entity_system/`. Declare it
  once in `PROJECT_CONTEXT.md` as `<repo-root>`.
- All source references use `<repo-root>/input_temp/bN`,
  `<repo-root>/inbox_knowledge/...`, `<repo-root>/gk/gui_v4`, etc.
- Inside the scratchpad, never assume source folders are local children.
- Adoption notes may quote the original source folder name, but every claim must
  also give the rooted path.

## Promotion And Rename Convention

- When promoting scratchpad code to `dot/code`, the mapping is recorded ONCE in
  `CODE_PROMOTION_EVALUATION.md` (scratchpad name → promoted
  `code_shared_*_draft.js` name). No other doc invents promoted names.
- A rename is **all-or-nothing** for a given module: every identifier, filename,
  and doc cross-reference moves together. Do not leave mixed casing.
- After a rename, the doc's own test commands MUST run green. If the change
  requires renaming a local in a doc snippet to avoid an import collision, do
  that in the same edit and note it.
- Promoted names are canonical for all future cross-references.

## Banned Word Convention

The banned-word dataset is the single allowed place to list banned words.

After edits, run the approved banned-word scan using the terms listed in
`code/dataset/validation_word_datasets.js`.

The expected result is no matches outside the banned-word dataset file.

Banned-word checks cover docs, code, comments, dataset items, filenames, and
agent messages.

## Definition Of Done

A task is not complete until:

- relevant source files were read or intentionally skipped with reason and a
  rooted path
- ownership was decided before writing, and the doc header `Owns:`/`Out of
  scope:` is filled in
- docs were updated in the correct place (one owner per concept)
- datasets were updated when new approved word groups were introduced, and the
  registry inventory reflects status
- the change was reconciled against `04_audits_and_logs`; no "complete" claim
  contradicts an audit
- canonical vocabularies (states/registries/trees/schemas/stages) were not
  bypassed; new vocabulary was added to the owner doc, not inline
- all cross-references resolve from the declared root (link check passed)
- proofing passed (no typos, no duplicated words, no source misspellings
  carried as canonical)
- tests passed in the target repo using commands that actually run there
- banned-word scan passed
- final answer states what changed and what remains implementation-only

## Verification Convention

For this scratchpad, run:

```text
node run_generated_action_entity_tests.mjs
```

Also run the approved banned-word scan using the terms listed in
`code/dataset/validation_word_datasets.js`.

Expected:

- generated smoke tests pass
- banned-word scan has no matches outside the allowed dataset file

For the promoted `dot` repo, use the `dot` repo's own test harness. Do NOT cite
`npm test` or scratchpad-specific commands there unless you have run them
successfully in `dot` and they passed.

## Proofing Convention

Before publishing any doc, filename, dataset item, or identifier:

- spell-check; no source misspellings (`Lable`, `reequirnment`) become canonical
- no duplicated words (`Artifact artifact`, `artifact artifact`)
- no copied source-folder names presented as approved vocabulary
- every concept name used in a doc is either an approved dataset item or defined
  once in its owner doc

## Agent Response Convention

When reporting completion:

- say exactly which files changed
- say which source learnings were adopted, with rooted paths
- say which checks were run and in which repo
- distinguish documentation requirements from implemented code
- do not claim implementation is complete when only docs are complete
- never say "complete"/"covered"/"done" unless the Definition Of Done and the
  audit logs support it; otherwise report "current status" with links

## Rework Prevention Checklist

Before editing:

- What source am I learning from? (rooted path)
- Is this architecture, language capability, English domain, bot behavior, UI, or
  validation vocabulary?
- Does this need a new document?
- Does this introduce a new approved 1D dataset? Is it in the registry inventory?
- Am I copying old names or translating concepts?
- Which canonical vocabulary owns any state/registry/tree/schema/stage I touch?
- Will my "complete"/"covered" claim contradict any `04_audits_and_logs` file?

After editing:

- Did I link new docs from `PROJECT_CONTEXT.md`?
- Did I fill the doc owner header (`Owns:` / `Out of scope:`)?
- Did I avoid making an adoption note an owner?
- Did I keep vocabulary in its single owner doc?
- Did I avoid banned words?
- Did I run the target repo's actual tests?
- Did I run generated smoke tests where they exist?
- Did I run the banned-word scan?
- Did I proofread (typos, duplicated words, source-name leakage)?
- Did I explain remaining implementation gaps and open audit items?

## Standing Rule

Prefer a clean boundary over a quick patch.

If a concept has its own users, lifecycle, datasets, validations, and tests, it
deserves its own module or domain document.

When two docs disagree, this file wins. When this file is silent, the canonical
owner doc named in `Learning Placement Policy` wins. When in doubt, log the
conflict as an open item and link the audit — never silently declare it resolved.
