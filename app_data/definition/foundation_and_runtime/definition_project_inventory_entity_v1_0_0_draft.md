# Project Inventory Entity

Status: draft
Owner: agent_codex_an_app

## Purpose

Project inventory validates file records, anchors relative config paths to a
known base path, detects stale manifest entries, and creates docs route links
with stable hash values.

## Entities

- `config_path_record`
- `manifest_record`
- `docs_route`
- `inventory_report`

## Validation

- Record ids must use snake_path format.
- Relative paths must resolve inside the configured base path.
- Required manifest paths must exist.
- Docs route hashes must be unique.
