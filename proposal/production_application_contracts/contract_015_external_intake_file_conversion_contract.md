# Contract 015: External Intake File Conversion

Status: proposed
Priority: p2
Owner domains: external_intake, file_conversion
Owner agent: agent_lang_and_memory
Work items: work_008, work_020

## Purpose

Define import/export and external intake behavior while keeping provider-backed intake governed and deferred where appropriate.

## Required Records

- intake record
- source record
- import format record
- export format record
- provider record
- conversion report
- validation report

## Validation

- source type is approved
- file format is approved
- imported data is proposed until validated
- conversion errors are explicit
- external provider permissions are explicit
- deferred providers remain marked deferred

## Success Criteria

- JSON, Markdown, CSV, XML import paths are defined
- JSON, Markdown, HTML, PDF, XML export paths are defined
- RSS feed discovery is documented as deferred provider-backed intake
- conversion outputs map to entity records or rejected findings

## Do Not

- do not ingest external content directly into active truth
- do not hide unsupported formats
