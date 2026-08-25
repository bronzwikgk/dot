# An App Stale V1 V2 Coverage Note

## Purpose

This note evaluates whether the scratchpad already covers the two old An App folders:

- `input_temp/an_app_stale`
- `input_temp/an_app_v2_stale`

The goal is to adopt concepts, not old names or old folder structure.

## Coverage Result

The scratchpad covers the core An App idea, but not every useful detail from the two folders.

Covered well:

- entity-first application builder
- dataset-backed truth
- templates as entities
- workflows and pipelines as entities
- policy-gated adoption
- naming governance
- relationship validation
- lifecycle validation
- layout projection over the same data
- plugin and utility boundaries
- source adoption and review policy
- glossary, taxonomy, ontology, and approved-name direction

Not fully covered yet:

- handbook creation as a first-class governed pipeline
- handbook rows as atomic facts
- one truth rendered into handbook, pipeline doc, and reference output
- type ratification as a named governance flow
- binding, datamap, datatable, and dataset as separate artifact classes
- provider plugin guide as a domain-owned contract
- external workspace bridge contract and safety policy
- gates for handbook creation stages
- row-level traceability law for generated docs

## V1 Material

The first stale folder mostly reinforces decisions already captured in the scratchpad.

Important source themes:

- data is truth and generated artifacts are output
- one entity inventory for files, blocks, symbols, components, workflows, tasks, agents, databases, views, relationships, artifacts, triggers, actions, conditions, loops, memory, tools, credentials, variables, and comments
- operations are generic and trait-driven
- names must be checked before creation
- adoption, review, and defer policies are explicit
- lifecycle transitions are guarded
- plugin manifests define boundary contracts
- watch/update monitoring validates naming, placeholder completion, duplicate entities, and datamap presence
- public content demonstrates each entity type through simple demo documents
- templates exist for definition, dataset, datamap, datatable, and report records

Scratchpad owners:

- `APPLICATION_ENTITY_DOCTRINE.md`
- `CONCEPT_CATALOG.md`
- `DATASET_REGISTRY_REQUIREMENTS.md`
- `SCHEMA_CONTRACT_CATALOG.md`
- `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`
- `TEMPLATE_DOMAIN_REQUIREMENTS.md`
- `UI_SURFACE_DOMAIN_REQUIREMENTS.md`

Remaining V1 action:

- Add datamap, datatable, binding, and handbook artifact schemas to `SCHEMA_CONTRACT_CATALOG.md`.
- Add template families for definition, dataset, datamap, datatable, report, and handbook skeleton.
- Add monitor/update quality gates to `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`.

## V2 Material

The second stale folder has newer and more concrete governance material.

Important source themes:

- handbook creation runs through a staged pipeline
- each fact becomes one row with a stable id
- docs are rendered from rows, not hand-written as untraceable prose
- handbook sections are selected from approved templates
- every row must be reachable from the entry phase
- every rendered sentence should trace back to a row where practical
- type ratification requires search, reserve, shape definition, trait wiring, link declaration, and registration
- a new type should not be registered before its row exists
- provider plugins need manifest, activation, deactivation, envelope output, and fallback checks
- external workspace bridge has request/response contracts, supported actions, errors, limits, and security notes
- spreadsheet/runbook material shows how an agent can follow a governed row-based handbook

Scratchpad owners:

- handbook creation pipeline: `TEMPLATE_DOMAIN_REQUIREMENTS.md`
- row-level traceability and gates: `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`
- type ratification: `DATASET_REGISTRY_REQUIREMENTS.md` and `SCHEMA_CONTRACT_CATALOG.md`
- provider plugin contract: `SCHEMA_CONTRACT_CATALOG.md`
- external workspace bridge: new or future external workspace domain, with security owned by `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`

## New Concepts To Add

| Concept | Meaning | Owner |
| --- | --- | --- |
| handbook | governed document rendered from validated rows and templates | `TEMPLATE_DOMAIN_REQUIREMENTS.md` |
| handbook row | atomic fact, step, rule, phase, gate, or example used to render a handbook | `SCHEMA_CONTRACT_CATALOG.md` |
| datatable | tabular schema artifact with fields, indexes, and validation | `SCHEMA_CONTRACT_CATALOG.md` |
| datamap | mapping artifact connecting source records to target records | `SCHEMA_CONTRACT_CATALOG.md` |
| binding | artifact that connects dataset, datatable, datamap, template, and output | `SCHEMA_CONTRACT_CATALOG.md` |
| type ratification | governed flow for approving new entity types before activation | `DATASET_REGISTRY_REQUIREMENTS.md` |
| external workspace bridge | controlled adapter for connected document, sheet, slide, and file operations | future external workspace domain |
| row traceability law | rendered output should be traceable to source rows and evidence | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` |

## Dataset Additions Needed

- handbook artifact type names
- handbook row kind names
- type ratification phase names
- type ratification gate names
- provider plugin phase names
- provider plugin gate names
- external workspace item type names
- external workspace action names
- binding field names
- datamap field names
- datatable field names

## Canonical Doc Updates Needed

- Add handbook template and row-rendering rules to `TEMPLATE_DOMAIN_REQUIREMENTS.md`.
- Add datatable, datamap, binding, and handbook row schemas to `SCHEMA_CONTRACT_CATALOG.md`.
- Add type ratification update process to `DATASET_REGISTRY_REQUIREMENTS.md`.
- Add row traceability, no orphan rows, slot filling, and graph reachability gates to `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`.
- Add external workspace bridge as a deferred domain or adapter requirement.

## Decision

Do not copy either stale folder. Adopt the governed concepts into the scratchpad:

- V1 is mostly already covered and should be treated as confirmation.
- V2 adds missing implementation-level governance and should be folded into schema, dataset, quality, and template docs.
