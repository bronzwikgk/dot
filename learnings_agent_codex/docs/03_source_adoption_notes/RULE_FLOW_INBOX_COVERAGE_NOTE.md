# Rule Flow Inbox Coverage Note

## Purpose

This note covers `inbox_knowledge/rule&flow`.

The folder has 27 files across four groups:

- NLU logic
- learner brain
- flow requirements
- concept manifestos

The goal is to adopt reusable concepts into An App, not old project names or old implementation structure.

## Coverage Result

Most concepts are already covered by the current scratchpad, especially:

- natural language to intent
- capability matching
- context tracking
- memory and learning governance
- entity-first records
- document tree and semantic tree
- parser workbench
- template validation
- quality gates
- UI tree/editor layouts

New or sharper concepts found:

- five cognitive node families
- deterministic cognitive loop
- passive to active knowledge promotion
- semantic particle as smallest logic unit
- relationship density as a growth metric
- tree query language
- structural diff and merge for trees
- schema migration and backward compatibility
- line-specific parse errors with rich context
- streaming parse mode for huge files
- parser watch mode
- type generation from tree schemas
- form generation from schemas
- NLU matching method catalog
- topic perspective links
- multi-view knowledge organization

## Source Groups

### NLU Logic

Adopt:

- exact matching
- substring matching
- fuzzy matching
- phonetic matching
- lexical matching
- synonym matching
- semantic matching
- contextual semantic matching
- lemmatization preference over crude stemming
- co-reference resolution using context

Do not make external model use mandatory. Semantic matching should be optional and provider-backed.

### Learner Brain

Adopt five cognitive node families:

- config node
- memory node
- knowledge node
- optimization node
- anomaly node

Adopt cognitive loop:

1. intake
2. parse
3. train
4. evaluate
5. optimize
6. benchmark

Adopt knowledge states:

- passive
- active
- retired
- rejected
- pending review

### Flow Requirements

Adopt tree parser scope:

- rich error reporting
- command surface
- performance benchmark
- schema validation
- type generation
- plugin registration
- template inheritance
- tree query
- tree diff and merge
- schema migration
- editor support
- format conversion
- form generation
- documentation examples

### Concept Manifestos

Adopt only the durable ideas:

- memory should be organized by topics and perspectives
- facts can appear in multiple topic views
- cross-topic links should be bidirectional when useful
- tools can be learned as entities with purpose and usage
- learning by doing should store feedback as reviewable knowledge
- teaching behavior should be guided by learner state and topic context

## Concepts To Adopt

| Concept | Meaning | Owner |
| --- | --- | --- |
| cognitive node | Specialized memory/learning entity family with a distinct responsibility. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` |
| semantic particle | Smallest independent logic unit extracted from input. | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` |
| passive knowledge | Knowledge stored but not yet allowed for inference. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` |
| active knowledge | Reviewed knowledge allowed for inference. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` |
| relationship density | Metric for growth of useful links in memory. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` |
| tree query | Query language for finding nodes by path, type, attribute, or pattern. | `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` |
| tree diff | Structural comparison of two trees. | `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` |
| tree merge | Combining tree changes with conflict handling. | `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` |
| schema migration | Moving records from one schema version to another with compatibility notes. | `SCHEMA_CONTRACT_CATALOG.md` |
| topic perspective | Topic-specific view over a shared fact or relationship. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` |

## Dataset Additions Needed

- cognitive node type names
- cognitive loop step names
- knowledge activation state names
- NLU matching method names
- fuzzy matching method names
- phonetic matching method names
- lexical matching method names
- semantic matching method names
- tree tool operation names
- parser command extension names
- parser error detail names
- schema migration state names
- topic perspective field names

## Canonical Updates Needed

- Add cognitive node types and passive/active promotion to An Memory.
- Add NLU matching method catalog to An App Lang.
- Add tree query, diff, merge, and migration to File Conversion and schema docs.
- Add relationship density and benchmark gates to Quality Audit.
- Add parser watch and rich error detail to parser command datasets.

## Decision

Adopt this folder as a concept-deepening batch. It does not replace current docs. It strengthens An Memory, An App Lang, File Conversion, Quality Audit, and Schema Contract Catalog.
