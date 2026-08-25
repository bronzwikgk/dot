# Contract 008: Provider Storage Index

Status: proposed
Priority: p1
Owner domains: provider_system, storage_system, search_index, file_conversion
Owner agent: agent_codex_an_app
Work items: work_006, work_007, work_008

## Purpose

Define providers as entity-backed adapters for storage, index, display, agent, and file import/export behavior.

## Required Records

- provider record
- provider config
- permission record
- storage record
- index record
- import format record
- export format record
- health record
- fallback policy

## Validation

- provider name is approved
- permissions are explicit
- config keys are approved
- health status is tracked
- provider output is proposed until validated
- import/export format is approved

## Success Criteria

- local storage works
- browser storage contract is defined
- optional sync provider remains future-scoped
- index supports full text, property, fuzzy search, autocomplete, rebuild, and stats
- file import/export has format validation

## Do Not

- do not let provider output bypass validation
- do not store credentials in plain records
