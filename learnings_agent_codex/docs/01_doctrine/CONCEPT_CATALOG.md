# Concept Catalog

## Purpose

This catalog folds repeated ideas from adoption notes and domain docs into one approved concept index. A concept is defined once here, then owned by a domain doc or catalog.

## Concept Ownership

| Concept | Meaning | Primary Owner | Related Owners |
| --- | --- | --- | --- |
| entity | Any named thing An App can store, validate, relate, render, execute, or explain. | `APPLICATION_ENTITY_DOCTRINE.md` | all docs |
| domain | Entity family and policy boundary. Domains organize entity types, datasets, templates, rules, and views. | `APPLICATION_ENTITY_DOCTRINE.md` | domain docs |
| word dataset | One-dimensional approved vocabulary array used for validation. | `DATASET_REGISTRY_REQUIREMENTS.md` | dataset files |
| registry map | Structured catalog of records keyed by id or name. | `DATASET_REGISTRY_REQUIREMENTS.md` | schema catalog |
| relationship map | Approved edge list or pair list connecting known ids. | `DATASET_REGISTRY_REQUIREMENTS.md` | application doctrine |
| schema | Required shape for a record or tree node. | `SCHEMA_CONTRACT_CATALOG.md` | all docs |
| contract | Promise a plugin, utility, flow, or entity must satisfy at its boundary. | `SCHEMA_CONTRACT_CATALOG.md` | quality/audit |
| policy | Rule set that decides whether an operation is allowed, blocked, warned, or requires approval. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | schema catalog |
| rule | Single condition and decision record inside a policy or validation catalog. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | command/capability |
| validation gate | Checkpoint that validates input, output, relationships, policy, and audit evidence. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | dataset registry |
| quality gate | Review checkpoint for completeness, coverage, risk, conflict, and approval state. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | source adoption index |
| approval state | Proposed, reviewed, approved, rejected, deferred, or superseded state. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | memory |
| command | User-facing phrase or structured request. | `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` | bot, language |
| capability | Approved ability the system can perform. | `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` | agent system |
| action | Executable step selected by a capability. | `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` | application doctrine |
| flow | Ordered or conditional set of actions. | `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` | template domain |
| bot | Conversational module inside An App. | `AN_BOT_SCOPE_REQUIREMENTS.md` | agent system |
| agent | Worker, reviewer, or profile entity that can perform or evaluate work. | `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md` | bot |
| memory | Governed knowledge store with provenance, confidence, conflict, and review state. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | language, bot |
| evidence record | Source-backed proof item used by audit, memory, and source adoption. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | quality/audit |
| correction record | User or reviewer correction awaiting acceptance, rejection, or consolidation. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | bot, language |
| document tree | Parsed structure of one input document. | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | file conversion |
| semantic tree | Meaning-level structure extracted from text, data, or UI definitions. | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | memory |
| project tree | Merged structure across many files or folders. | `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` | source adoption |
| render tree | UI/output-ready structure for one view or layout. | `UI_SURFACE_DOMAIN_REQUIREMENTS.md` | file conversion |
| relationship graph | Cross-node and cross-entity links. | `APPLICATION_ENTITY_DOCTRINE.md` | memory |
| template | Reusable entity plan that can create domains, apps, flows, views, or records. | `TEMPLATE_DOMAIN_REQUIREMENTS.md` | application doctrine |
| starter template | Ready-to-use template for a person, organization, domain, or product. | `TEMPLATE_DOMAIN_REQUIREMENTS.md` | application doctrine |
| sample pipeline | Example flow used for learning, testing, demos, and starter artifact creation. | `TEMPLATE_DOMAIN_REQUIREMENTS.md` | command/capability |
| layout | Approved way to view the same data. | `UI_SURFACE_DOMAIN_REQUIREMENTS.md` | UI datasets |
| render profile | Rules that say how data appears in a layout. | `UI_SURFACE_DOMAIN_REQUIREMENTS.md` | template domain |
| input surface | User entry area such as command bar, chat panel, form panel, editor, or drop zone. | `UI_SURFACE_DOMAIN_REQUIREMENTS.md` | bot |
| search provider | Local or external source adapter that returns normalized evidence. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | source adoption |
| repository operation | Safe repository action with policy, report, and approval requirements. | `REPOSITORY_OPERATIONS_DOMAIN_REQUIREMENTS.md` | quality/audit |
| conversion profile | Format-to-format conversion rule with preservation and validation expectations. | `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` | language |
| handbook | Governed document rendered from validated rows, templates, and bindings. | `TEMPLATE_DOMAIN_REQUIREMENTS.md` | quality/audit |
| handbook row | Atomic fact, phase, step, rule, gate, or example used to render a handbook. | `SCHEMA_CONTRACT_CATALOG.md` | template domain |
| datatable | Tabular schema artifact with fields, indexes, and validation rules. | `SCHEMA_CONTRACT_CATALOG.md` | dataset registry |
| datamap | Mapping artifact connecting source records, target records, fields, and relationship rules. | `SCHEMA_CONTRACT_CATALOG.md` | language |
| binding | Artifact that connects dataset, datatable, datamap, template, and output target. | `SCHEMA_CONTRACT_CATALOG.md` | template domain |
| type ratification | Governed approval flow for new entity types before activation. | `DATASET_REGISTRY_REQUIREMENTS.md` | quality/audit |
| row traceability law | Rendered output should trace back to source rows and evidence. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | template domain |
| external workspace bridge | Controlled adapter for connected documents, sheets, slides, and files. | `EXTERNAL_INTAKE_DOMAIN_REQUIREMENTS.md` | quality/audit |
| external intake | Controlled intake from local files, URLs, web pages, APIs, and connected workspaces. | `EXTERNAL_INTAKE_DOMAIN_REQUIREMENTS.md` | memory |
| parser application | Application entity that coordinates parser config, plugins, knowledge, and session state. | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | command/capability |
| parser plugin | Plugin that provides parsing, validation, export, or command surface behavior. | `SCHEMA_CONTRACT_CATALOG.md` | application doctrine |
| round trip validation | Parse, export, rebuild, and compare to prove content integrity. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | file conversion |
| parser command | Approved command for parser work such as parse, split, rebuild, validate, export, or status. | `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` | language |
| knowledge loader | Support entity that loads approved knowledge folders or datasets for parser use. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | language |
| parser session | Session record tracking parser config, loaded plugins, active work, and output history. | `SCHEMA_CONTRACT_CATALOG.md` | bot |
| cognitive node | Specialized memory and learning entity family with a distinct responsibility. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | quality/audit |
| semantic particle | Smallest independent logic unit extracted from input. | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` | memory |
| passive knowledge | Knowledge stored but not yet allowed for inference. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | quality/audit |
| active knowledge | Reviewed knowledge allowed for inference. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | quality/audit |
| relationship density | Metric for growth of useful links in memory. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | memory |
| tree query | Query language for finding nodes by path, type, attribute, or pattern. | `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` | language |
| tree diff | Structural comparison of two trees. | `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` | schema catalog |
| tree merge | Combining tree changes with conflict handling. | `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md` | quality/audit |
| schema migration | Moving records from one schema version to another with compatibility notes. | `SCHEMA_CONTRACT_CATALOG.md` | quality/audit |
| topic perspective | Topic-specific view over a shared fact or relationship. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | bot |
| hypothesis staging | Temporary holding state for extracted rules, schemas, relations, templates, or app ideas before they are trusted. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | quality/audit |
| promotion lifecycle | Governed movement from draft or staged record to validated, active, deprecated, rejected, or archived record. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | schema catalog |
| dual source validation | Validation pattern that compares a proposed record against at least two evidence channels when available. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | memory |
| source trust dynamics | Confidence policy that raises or lowers trust in sources based on validation, contradiction, freshness, and review history. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | quality/audit |
| repair action | Controlled correction operation such as specialize, generalize, split, merge, reclassify, demote, rollback, or retry. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` | quality/audit |
| rejection criterion | Non-negotiable failure condition that blocks approval or activation. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | policy |
| acceptance score | Weighted quality score calculated from completeness, benchmark, structure, and doctrine gates. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | template domain |
| continuous monitoring gate | Post-activation watch rule with warning threshold, critical threshold, and required response. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` | memory |
| experiment | Versioned entity used to test hypotheses, rules, filters, templates, datasets, and outputs. | `EXPERIMENT_DOMAIN_REQUIREMENTS.md` | quality/audit |
| experiment run | Executed instance of an experiment version with config, inputs, outputs, findings, metrics, and audit evidence. | `EXPERIMENT_DOMAIN_REQUIREMENTS.md` | runner |
| expression template | Template with placeholders and score rules used to discover concrete candidate expressions. | `TEMPLATE_DOMAIN_REQUIREMENTS.md` | experiment |
| finding | Evidence-backed result from a run, audit, comparison, or validation process. | `EXPERIMENT_DOMAIN_REQUIREMENTS.md` | memory |
| fintech organization | Business domain entity for products, customers, accounts, payments, compliance, reconciliation, and reports. | `FINTECH_ORGANIZATION_MANAGEMENT_DOMAIN_REQUIREMENTS.md` | quality/audit |
| reconciliation run | Fintech operation that matches transactions, payments, payouts, settlements, and ledger entries. | `FINTECH_ORGANIZATION_MANAGEMENT_DOMAIN_REQUIREMENTS.md` | runner |
| trading strategy | Versioned set of data requirements, signals, rules, risk constraints, and report expectations. | `ALGO_STOCK_TRADING_DOMAIN_REQUIREMENTS.md` | experiment |
| backtest | Historical simulation run for a trading strategy version against market data. | `ALGO_STOCK_TRADING_DOMAIN_REQUIREMENTS.md` | experiment |

## Consolidation Rules

- Define a concept here when it appears in more than one doc.
- Put behavior details in the primary owner, not in every adoption note.
- Adoption notes may keep source evidence and lessons, but should point to the canonical owner for active requirements.
- New concept names must pass approved vocabulary checks before adoption.
- Similar names should resolve to one preferred concept unless the distinction changes behavior.

## Pending Concept Decisions

- Search providers and URL fetch adapters belong to External Intake. Memory owns evidence retention after intake.
- Decide whether source adoption remains deferred or becomes a first-class quality/audit flow later.
- Decide whether project tree belongs to file conversion only, or also becomes a core application doctrine concept.
