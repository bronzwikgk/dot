# Experiment Domain Requirements

## Purpose

The Experiment domain defines how An App creates, versions, runs, compares,
and audits experiments.

An experiment is an entity. Its versions, runs, inputs, rules, filters,
findings, reports, charts, and templates are also entities.

## Core Entities

- experiment
- experiment_version
- experiment_run
- experiment_template
- expression_template
- rule_node
- filter_node
- source_dataset
- derived_feature
- finding
- run_report
- chart_panel
- comparison_panel

## Required Capabilities

The Experiment domain should support:

- create experiment
- create experiment from template
- create experiment version
- duplicate experiment node
- disable experiment node
- delete experiment node through policy
- import experiment
- open experiment
- run experiment through the shared runner
- validate hypothesis
- compare experiment versions
- persist every run with config and evidence
- show run output in tabs
- produce summary, table, chart, and finding views

## Pipeline

Experiment execution should use the shared An App pipeline:

1. ingest experiment input
2. parse rules and filters
3. build tree and DAG
4. classify node types
5. validate schemas and policies
6. resolve datasets and derived features
7. execute through runner
8. compose report
9. display selected layout
10. persist run log
11. audit lineage

## Template-Guided Expression Discovery

Experiments may use expression templates to discover candidate rules.

The system should:

- select approved templates
- fill placeholders from approved options or bounded ranges
- test generated candidates
- score candidates by precision, recall, frequency, and complexity
- cluster similar candidates
- stage candidates as hypotheses
- promote only validated candidates

## UI Requirements

Experiment UI should support:

- notebook layout
- collapsible tree layout
- code editor layout
- dashboard layout
- chart layout
- linked chart panels
- table output
- tabbed run results
- version comparison
- playback over time when the dataset supports time order

Chart requirements are deferred until UI implementation, but the domain should
reserve support for line, candle, scatter, histogram, comparison, two
dimensional, and three dimensional views.

## Contracts

Every experiment run must include:

- `id`
- `experiment_ref`
- `version_ref`
- `input_refs`
- `config`
- `started_at`
- `completed_at`
- `status`
- `output_refs`
- `finding_refs`
- `metric_refs`
- `audit_ref`

Every finding must include:

- `id`
- `run_ref`
- `finding_type`
- `summary`
- `evidence_refs`
- `confidence`
- `validation_result`
- `next_action`

## Non-Goals

The Experiment domain should not:

- bypass shared runner or validator
- create separate state storage when `action_entity` can store records
- promote discovered expressions without validation
- hide failed runs
- hardcode domain-specific math into the generic experiment shell

## Minimum Complete V1

Minimum V1 should support:

- create one experiment
- create one experiment version
- run one deterministic pipeline
- persist one run record
- create one finding
- compare two runs
- render summary and table views
- write one audit record
