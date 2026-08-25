# Development Plan Index

## Purpose

This folder turns the current `dot/code` inventory and scratchpad requirements
into a practical development roadmap.

The order is intentional:

1. Inventory the existing code.
2. Map code to documented domains.
3. Identify gaps.
4. Prioritize by foundation risk.
5. Build in small batches.

Development is split into two phases:

- Phase 1 makes `dot` strong as a reusable shared foundation.
- Phase 2 builds An App capabilities on top of that foundation.

## Files

- `00_code_inventory.md`: what exists now in `dot/code`.
- `01_domain_scope_from_docs.md`: what the scratchpad docs require by domain.
- `02_gap_analysis.md`: what exists, what is missing, and what conflicts.
- `03_priority_roadmap.md`: priority order for implementation.
- `04_build_batches.md`: push-sized batches with acceptance checks.
- `05_open_decisions.md`: decisions that must stay visible.
- `06_existing_code_scope_comparison.md`: current code compared with scope and reuse decisions.
- `../02_domains/AN_APP_DOMAIN_USE_CASES.md`: domain-by-domain use cases for the full An App business application.
- `../00_context/INSPIRATION.md`: inspiration software, GitHub repositories, and learning backlog.
- `../00_context/INSPIRATION_REFERENCE_DETAILS.md`: API, schema, dataset, and feature notes from inspiration sources.
- `../00_context/INSPIRATION_FEATURE_MATRIX.md`: cross-product feature, UI, view, state, suggestion, and settings matrix.
- `../02_domains/FINTECH_ORGANIZATION_MANAGEMENT_DOMAIN_REQUIREMENTS.md`: fintech organization management domain scope.
- `../02_domains/ALGO_STOCK_TRADING_DOMAIN_REQUIREMENTS.md`: algorithmic stock trading domain scope.
- `../08_master_project/AN_APP_MASTER_PROJECT_DOCUMENT.md`: consolidated An App project narrative and doctrine.
- `../08_master_project/AN_APP_REQUIREMENTS_AND_SPEC.md`: indexed requirements table and implementation spec.
- `../08_master_project/AN_APP_INPUT_AND_ARTIFACT_CHECKLIST.md`: input and artifact checklist for agents, developers, and maintainers.
- `../08_master_project/AN_APP_PENDING_WORK_TRACKER.md`: live pending-work tracker with status, owner, source, conflicts, and next actions.

Important boundary: language alias datasets help parsing map user words to
approved system names. They are not separate sources of truth.

## Working Rule

Every future batch should follow:

```text
inventory -> scope -> code -> test -> doc -> log -> user push
```
