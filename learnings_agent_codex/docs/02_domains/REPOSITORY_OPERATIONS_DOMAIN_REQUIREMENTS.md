# Repository Operations Domain Requirements

## Purpose

The Repository Operations domain defines safe, auditable repository and
deployment behavior for An App.

This domain is needed because repository work has its own risk model, artifacts,
rulebooks, manifests, remote targets, and phase gates.

## Core Entities

- repository
- branch
- commit
- tag
- remote target
- deployment flow
- deployment manifest
- quality report
- delivery report
- phase gate
- rulebook
- artifact

## Repository Flow Stages

- security audit
- integrity check
- remote sync
- cloud push
- artifact generation
- delivery report
- deployment report

## Required Safety Rules

- Security scan must run before remote write.
- Integrity checks must run before deployment.
- Force push is disabled by default.
- Tag push must be explicit.
- Remote target must be approved.
- Rule conflicts must fail with a report.
- Most specific rule wins when rule precedence is clear.

## Entity Template Requirements

Repository and deployment templates should include:

- id
- name
- project
- version
- generated timestamp
- artifact list
- status
- quality checks
- deployment target
- rollback note

## Dataset Requirements

Add 1D arrays for:

- repository entity names
- repository operation names
- repository stage names
- phase gate names
- artifact type names
- deployment manifest field names
- report field names
- rule precedence names
- conflict result names

## Validation Requirements

- Deployment manifest must include id, version, generated timestamp, and
  artifact list.
- Dataset records must be arrays of unique strings when declared as datasets.
- Rulebook index must declare precedence.
- Conflict behavior must be explicit.

## Use Cases

- local repository audit
- deployment manifest creation
- release checklist generation
- rulebook validation
- delivery report creation

## Adoption Notes

Learned from repository operation folders, canonical phase artifacts, dataset
rulebooks, entity templates, and deployment manifests. Provider-specific hosting
names are adapter choices, not core domain names.
