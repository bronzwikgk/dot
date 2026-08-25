# V4 Contract 008: Import, Export, and Offline

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Priority: p1
Domain: foundation_and_runtime

## Purpose

Define file import/export, local static server, and offline asset policy.

## Required Records

- export_record
- import_record
- asset_record
- server_config_record

## Required Operations

- export_file
- import_file
- validate_offline
- start_server

## Inputs

- file_ref
- asset_ref
- server_config

## Outputs

- export_record
- import_record

## Validation

- export produces valid file
- import restores/merges correctly
- offline browser run passes
- no CDN references

## Success Criteria

- export file works
- import restore/merge works
- offline e2e passes
- zero CDN references

## Do

- use entity doctrine for import/export
- validate before import
- scan for CDN references

## Do Not

- do not allow unvalidated import
- do not use CDN in production
- do not skip offline validation
