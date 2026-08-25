# Quality Audit Domain Requirements

## Purpose

The Quality Audit domain owns validation, coverage, risk, conflict handling, approval state, and evidence retention.

## Scope

This domain includes:

- validation gates
- quality gates
- audit reports
- source coverage reports
- conflict records
- gap records
- approval states
- risk levels
- evidence records
- recommendation records
- API error formats
- rate limits
- rollback checks
- security checks
- performance benchmark methods

## Two-Stage Validation

Stage one validates coverage:

- inventory exists
- source items are counted
- source items have owners
- skipped items have reasons
- repeated concepts are mapped to canonical owners

Stage two validates adoption:

- adopted concepts appear in canonical docs or datasets
- conflicts have decisions
- dataset values pass validation
- schema records have required fields
- unresolved gaps have owners

## Quality Gate Names

Approved gate names should include:

- inventory_check
- owner_check
- duplicate_check
- conflict_check
- validation_check
- adoption_check
- schema_check
- dataset_check
- approval_check
- evidence_check

## Approval States

Approved approval states should include:

- proposed
- reviewed
- approved
- rejected
- deferred
- superseded

## Conflict Contract

Every conflict record must include:

- conflict type
- affected concepts
- source evidence
- current owner
- proposed owner
- decision options
- chosen decision
- reason
- approval state

## Gap Contract

Every gap record must include:

- gap type
- missing item
- owning domain
- source evidence
- risk
- recommendation
- approval state

## Capability Quality Gates

Capability quality gates should check:

- weighted score rules exist
- tie-breaking rules exist
- required slots are declared
- missing-slot clarification exists
- risk level is declared
- confirmation mode is declared
- dry run behavior exists for risky work
- rollback or undo behavior is declared when applicable
- output contract exists
- audit fields are present
- prompt tests include happy path, missing slot, risky, and negative cases

## API And Runtime Guard Requirements

Runtime-facing capabilities should define:

- error response format
- rate limit policy
- authentication and authorization policy when exposed outside local use
- session persistence mode
- batch processing limits
- input sanitization rules
- private-data handling rules
- retry policy
- memory cleanup policy
- state serialization format

## Benchmark Requirements

Benchmarks should define:

- test dataset
- latency method
- throughput method
- accuracy method
- concurrent session method
- large graph traversal case
- failure scenario case
- relationship density metric
- parser scale case
- precision
- recall
- frequency
- complexity
- reproducible seed or deterministic run note
- versioned input and output references

## Learning Quality Gates

Learning quality gates should check:

- passive knowledge is not used for inference
- active knowledge has confidence and provenance
- anomaly records are created for contradictions
- relationship density is measured without forcing artificial links
- optimization changes are reversible
- benchmark results are tied to the version tested
- hypotheses are staged before promotion
- source trust changes are explained
- repair actions have before and after evidence
- promotion and demotion write audit records

## Audit Report Contract

Every audit report must include:

- scope
- inventory count
- covered count
- gap count
- conflict count
- deferred count
- recommendation count
- evidence references
- next action list

## Acceptance Framework Requirements

Each domain, template, plugin, utility, and generated application should define
acceptance criteria before it is marked active.

Acceptance criteria should include:

- indexed criterion id
- criterion name
- domain or owner
- measurable target
- verification method
- priority
- pass/fail result
- evidence reference

Acceptance score categories:

- completeness
- benchmark
- structural_integrity
- doctrine_alignment

No score can override a blocking rejection criterion.

## Rejection Criteria Requirements

Rejection criteria are non-negotiable failure conditions.

Examples for An App:

- banned word introduced
- unapproved name introduced
- schema validation failed
- relationship cycle found where acyclic order is required
- missing provenance for generated artifact
- undocumented public method
- validation skipped without approved reason
- generated artifact cannot be traced to source, template, or user instruction
- runtime dependency violates application definition policy

Each rejection record should include:

- `id`
- `criterion`
- `owner`
- `severity`
- `verification_method`
- `evidence_ref`
- `required_resolution`

## Row Traceability Requirements

Generated documentation should be traceable to governed rows when practical.

Quality gates should check:

- every required row has an id
- every link target resolves
- every required template slot is filled
- every rendered section has row evidence or an explicit generated-note reason
- no orphan rows remain unless they are deferred with reason
- graph cycles are reported when the output requires acyclic order

## Monitor Gate Requirements

Monitor gates should catch:

- duplicate entity ids
- unfilled template placeholders
- invalid names
- missing datamaps for mapped output
- invalid imports or unresolved references
- lifecycle transitions without approval

Active systems should also define warning and critical thresholds.

Monitor records should include:

- metric name
- warning threshold
- critical threshold
- sample window
- response action
- owner
- latest result
- latest evidence

Useful monitor categories:

- validation failure rate
- unresolved relationship count
- duplicate name count
- unapproved vocabulary count
- stale memory count
- response latency
- generated artifact failure count
- rollback count

## Template Maintenance Gate Requirements

Template quality gates should check:

- version exists
- status exists
- required placeholders are declared
- required placeholders are filled during artifact creation
- examples exist
- validation rules exist
- old templates are reviewed before approval
- generated output records template version

## Round Trip Validation Requirements

Round trip validation proves that parser output can be rebuilt or exported
without silent content loss.

The gate should check:

- input inventory count
- parsed node count
- exported artifact count
- rebuild result exists
- source spans or provenance are preserved
- known unsupported items are reported
- rebuilt output matches required integrity rules

## Dataset Updates Needed

- Add quality gate names.
- Add approval state names.
- Add conflict type names.
- Add gap type names.
- Add audit report field names.
- Add risk level names.
- Add memory type names.
- Add verification status names.
- Add repair action names.
- Add acceptance category names.
- Add rejection reason names.
- Add monitor metric names.
- Add source trust factor names.
