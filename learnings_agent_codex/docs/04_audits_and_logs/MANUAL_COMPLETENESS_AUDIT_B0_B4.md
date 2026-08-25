# Manual Completeness Audit B0 B4

## Purpose

This document records the manual completeness check of current scratchpad docs
against recursive inputs under:

- `input_temp/b0`
- `input_temp/b1`
- `input_temp/b2`
- `input_temp/b3`
- `input_temp/b4`

The goal is to make sure every nested folder is accounted for, every
concept-bearing file group has an adoption decision, and no useful learning is
left behind.

## Audit Method

The audit used recursive file inventory, extension grouping, high-signal file
review, and current-doc search. Files were sorted into coverage groups:

- `directly_covered`: already represented in scratchpad docs.
- `partially_covered`: broad idea exists, but detailed scope or requirement is
  missing.
- `reference_only`: kept as evidence or inspiration, not adopted as canonical
  project vocabulary.
- `future_module`: valuable, but should become a later module, utility, or
  plugin requirement.
- `not_concept_source`: package files, runtime output, binary media, generated
  output, or repeated archive material that is inventoried but not manually
  adopted line-by-line.

This keeps the audit recursive and complete while avoiding false adoption from
large package or runtime trees.

## Recursive Inventory

| Batch | Recursive files | Bytes | Main shape |
| --- | ---: | ---: | --- |
| b0 | 5 | 55,839 | English sentence corpus, sentence type data, handbook, sentence detector, parser page |
| b1 | 18 | 88,770 | sentence prediction, sentence completion, keywords, grammar, similarity, task continuity |
| b2 | 645 | 19,318,620 | agent rules, command packs, role profiles, localized docs, benchmark/input files |
| b3 | 20,088 | 121,457,064 | parser archives, DSL notes, local package trees, benchmark docs, logs, examples |
| b4 | 13 | 36,522 | parser, search, CLI, tester rules, tester decision trees |

## Batch B0 Result

Status: mostly covered.

Files accounted:

- `dataset_corpus_english_sentences.txt`
- `dataset_type_sentence.txt`
- `handbook_english_sentences.md`
- `is-sentence.js`
- `parsing tools.html`

Current coverage:

- `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md` covers sentence purpose, sentence
  type, grammar references, completion, ambiguity, and domain rules.
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md` covers parser workbench, parsing tools,
  text-to-structure, corpus references, and canonical parse output.
- `SOURCE_ADOPTION_INDEX_AND_VALIDATION_LOG.md` records direct b0 adoption.

Remaining gaps:

- Add exact sentence corpus item schema.
- Add exact sentence detector acceptance tests.
- Add parser workbench test matrix from the HTML page.

Decision: keep as English Language domain foundation and An App Lang parser
foundation.

## Batch B1 Result

Status: mostly covered with implementation gaps.

Files accounted:

- all 15 JSON notes
- 3 JavaScript helpers

Current coverage:

- Sentence intent types, incomplete sentence handling, symbolic template
  learning, keyword extraction, sentence completion, and similarity are covered
  across `AN_APP_LANG_SCOPE_REQUIREMENTS.md`,
  `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`, `AN_BOT_SCOPE_REQUIREMENTS.md`,
  and `AN_MEMORY_SCOPE_REQUIREMENTS.md`.

Remaining gaps:

- Add formal keyword extraction dataset schema.
- Add completion candidate scoring schema.
- Add incomplete prompt detector test set.
- Add optional semantic similarity adapter contract.

Decision: adopt deterministic grammar, keyword, completion, and intent concepts
now; keep provider-based similarity optional.

## Batch B2 Result

Status: partially covered.

Important nested groups found:

- agent role profile docs
- command catalog docs
- multilingual command and agent docs
- action-agent constraint trees
- remediation proposal
- framework spec
- benchmark and conversation inputs
- raw rule and legacy note archives
- profile and context pack material
- media/reference assets

Current coverage:

- `AN_BOT_SCOPE_REQUIREMENTS.md` covers task continuity, security checks,
  command routing, agent roles, scheduler ideas, and audit.
- `APPLICATION_ENTITY_DOCTRINE.md` covers everything as an entity, command
  registry, workflow, templates, layouts, schemas, policies, and logs.
- `AN_MEMORY_SCOPE_REQUIREMENTS.md` covers promotion, working memory, audit,
  confidence, and reference capture.

Remaining gaps:

- Add an agent role catalog requirement with capability, boundary, handoff, and
  review responsibility fields.
- Add a command catalog requirement with command purpose, input shape, output
  shape, policy, audit, and examples.
- Add a localization policy for command and role docs.
- Add a profile/context pack requirement.
- Add benchmark input handling and report expectations.
- Add media/reference asset handling policy.
- Add remediation proposal tracking as a first-class entity type.

Decision: adopt b2 as An Bot plus command catalog plus agent role catalog
requirements. Do not copy old project names into canonical vocabulary.

## Batch B3 Result

Status: partially covered, with the largest remaining gap.

Important nested groups found:

- parser archive material
- DSL docs and examples
- parser config files
- dictionary, entity, query, tagging config
- plan shape utility notes
- universal iterator utility notes
- browser automation bridge material
- benchmark docs
- test strategy docs
- project manifests and roadmaps
- runtime logs and generated reports
- large package trees and maps

Current coverage:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md` covers grammar, parse tree, semantic tree,
  corpus, DSL-like input, command surface, parser adapters, output renderers,
  and language-domain requirements.
- `APPLICATION_ENTITY_DOCTRINE.md` covers entities, relationships, app
  assembly, layout lenses, validation, and artifact creation.
- `AN_MEMORY_SCOPE_REQUIREMENTS.md` covers remembered facts, promotion, and
  traceable learning.

Remaining gaps:

- Add a separate DSL and grammar domain section inside An App Lang.
- Add parser adapter contract details for multi-format input.
- Add plan shape utility requirement.
- Add universal iterator utility requirement.
- Add browser automation bridge adapter policy.
- Add benchmark evidence retention policy.
- Add archive-to-current comparison policy for parser docs.
- Add test strategy links for parser, DSL, memory, and generated app output.

Decision: adopt b3 as the main evidence batch for An App Lang parser maturity,
DSL scope, utility scope, and benchmark policy. Package and runtime material is
inventoried but not adopted line-by-line.

## Batch B4 Result

Status: partially covered and highly relevant.

Files accounted:

- action parser text notes
- action search demo, config, core, and test files
- ActionFlow CLI file
- action tester rules
- action tester decision trees

Current coverage:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md` covers command surface, parser adapters,
  schemas, canonical parse output, and test requirements.
- `AN_BOT_SCOPE_REQUIREMENTS.md` covers bot security, command routing,
  tool requests, audit, and workflow handling.
- `APPLICATION_ENTITY_DOCTRINE.md` covers command registry, schemas, validation,
  testing, and logs.

Remaining gaps:

- Add action parser requirements: detect, parse, normalize, validate, transform,
  compile, optional execute, export.
- Add adapter capability fields: can handle, parse result, diagnostics,
  recovery, streaming, position preservation, link/table support.
- Add canonical model versioning and migration policy.
- Add fail-fast and fail-soft validation modes.
- Add run id, stage timing, lineage, and target output logs.
- Add search provider module scope: provider config, normalized knowledge node,
  latency audit, result merging, cache policy, external verification use.
- Add CLI shell scope: run flow, create flow, benchmark creator, model roster,
  output scoring, and leaderboard report.
- Add tester decision gate scope: format check, security gate, artifact
  discovery, unit validation, final emit gate.

Decision: adopt b4 as concrete requirement detail for parser, search, CLI, and
tester gates. Old names remain evidence names only.

## Current Completeness Score

| Area | Status | Notes |
| --- | --- | --- |
| English Language domain | high | B0 and B1 are well represented; exact schemas still needed. |
| An App Lang | medium high | Main ideas covered; b3 and b4 require more detailed parser and DSL requirements. |
| An Bot | medium high | Core scope covered; b2 role and command catalogs need formal fields. |
| An Memory | medium | Concepts covered; provider similarity and evidence retention need sharper contracts. |
| Application doctrine | high | Entity-first model covers the target direction well. |
| Utility/plugin requirements | medium | Validation exists; parser, search, iterator, plan shape, browser bridge need more detail. |
| Audit/index discipline | medium | Direct b0 and b1 index is strong; recursive b2 and b3 need grouped index expansion. |

## Required Doc Updates

1. Update `AN_APP_LANG_SCOPE_REQUIREMENTS.md` with parser adapter, canonical
   model versioning, DSL and grammar domain, fail-fast/fail-soft modes, and
   stage lineage.
2. Update `AN_BOT_SCOPE_REQUIREMENTS.md` with agent role catalog, command
   catalog, context pack, localization, and tester gate requirements.
3. Update `AN_MEMORY_SCOPE_REQUIREMENTS.md` with evidence retention, benchmark
   report retention, optional similarity adapter, and knowledge node rules.
4. Update `APPLICATION_ENTITY_DOCTRINE.md` with command catalog, role catalog,
   search provider, CLI shell, parser adapter, and tester gate as entity types.
5. Update `SOURCE_ADOPTION_INDEX_AND_VALIDATION_LOG.md` with recursive grouped
   entries for b2, b3, and b4.
6. Keep package, runtime, media, and generated trees counted under
   `not_concept_source` with a reason.

## Two Stage Validation

Stage 1 inventory validation:

- All five input batches were scanned recursively.
- File counts were recorded by batch.
- Extension shapes were checked.
- Nested high-signal folders were identified.
- Large package/runtime trees were classified instead of ignored.

Stage 2 coverage validation:

- Current scratchpad docs were searched for parser, command, schema, adapter,
  security, benchmark, and decision concepts.
- Covered concepts were mapped to existing docs.
- Missing concepts were listed as doc updates.
- Old names were kept as evidence names only.

## Final Finding

The existing scratchpad docs are directionally strong and capture the core
project doctrine, but they are not yet complete against recursive b0 through b4.
The biggest gaps are detailed catalogs and contracts:

- role catalog
- command catalog
- parser adapter contract
- canonical model versioning
- search provider module
- CLI shell module
- tester decision gates
- DSL and grammar details
- benchmark and evidence retention

These should be added before we call the documentation complete.
