# External Intake Domain Requirements

## Purpose

The External Intake domain owns controlled intake from local files, URLs, web pages, APIs, and connected workspaces.

## Scope

This domain includes:

- URL fetch adapters
- local file intake
- connected workspace bridge adapters
- HTML text cleaning
- JSON response extraction
- outgoing link discovery
- source normalization
- citation and evidence capture
- timeout, size, and retry policy
- private-data and security policy

## Intake Contract

Every intake operation must define:

- source type
- source identifier
- allowed protocol
- timeout
- maximum response size
- retry policy
- user agent or client identity
- authentication mode when needed
- output format
- evidence record
- error format

## Safety Requirements

External intake must:

- reject unsupported protocols
- avoid shell-built commands for remote fetch work
- enforce maximum response size
- enforce timeout
- preserve source URL or file path as evidence
- record fetch time and status
- clean HTML only as a derived view, not as the only retained record
- keep private-data handling policy visible

## Adapter Types

Initial adapter types:

- local_file_adapter
- url_fetch_adapter
- web_page_adapter
- json_api_adapter
- connected_document_adapter
- connected_sheet_adapter
- connected_slide_adapter
- connected_file_adapter

## Output Records

External intake should produce:

- raw source record
- normalized text record
- extracted metadata record
- link discovery record
- evidence record
- error record when failed
