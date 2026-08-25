# Action Http Fetch Coverage Note

## Purpose

This note covers `input_temp/b6/actionHttpFetch`.

The folder contains one utility file for fetching remote or local content, cleaning HTML, parsing selected JSON summaries, and discovering simple outgoing links.

## Concepts To Adopt

- external intake adapter
- local file fallback
- URL fetch policy
- user agent setting
- redirect following
- max response size
- JSON summary extraction
- HTML text cleaning
- outgoing link discovery
- fetch failure reporting

## Owners

- external intake and evidence: `EXTERNAL_INTAKE_DOMAIN_REQUIREMENTS.md`
- search and source normalization: `ACTION_SEARCH_DOC_DATASET_ADOPTION_NOTE.md`
- runtime/security gates: `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`
- memory evidence retention: `AN_MEMORY_SCOPE_REQUIREMENTS.md`

## Decision

Adopt the external intake shape and safety requirements. Do not adopt shell-command fetch mechanics as the preferred implementation; future code should use a safe adapter with timeout, size limit, URL validation, and audit logging.
