# Aast Parser Readme Coverage Note

## Purpose

This note evaluates `input_temp/b7/AAstParser/README_ast_parser.md` against the current scratchpad docs.

The goal is to adopt useful concepts while keeping An App naming and structure clean.

## Source Summary

The README describes an entity-first parser application for files, documents, tree nodes, configs, templates, and policies.

Important concepts:

- every parsed item is an entity
- parsing behavior can be described in English definitions
- type definitions, rule definitions, and flow definitions are parsed into system behavior
- plugins provide entity operations, English parsing, and command line access
- parser supports command line and API access
- parsing should support round-trip validation
- every transformation should retain provenance
- app wrapper coordinates config, plugin loading, knowledge loading, and session state
- core commands include parse, split, rebuild, validate, export, and status

## Already Covered

Covered in current scratchpad:

- entity-first architecture: `APPLICATION_ENTITY_DOCTRINE.md`
- English-defined application changes: `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- document tree, semantic tree, project tree, and render tree: `CONCEPT_CATALOG.md`
- tree node schemas: `SCHEMA_CONTRACT_CATALOG.md`
- plugin and utility boundary idea: `APPLICATION_ENTITY_DOCTRINE.md`
- provenance and evidence: `AN_MEMORY_SCOPE_REQUIREMENTS.md`
- CLI and parser adapter idea: `MANUAL_COMPLETENESS_AUDIT_B0_B4.md` and `SOURCE_ADOPTION_PIPELINE_SCOPE.md`
- large-folder AAstParser summary: `LARGE_FOLDER_DOC_DATASET_ADOPTION_NOTE.md`

## Gaps Found

Not fully explicit before this note:

- parser application wrapper as its own entity
- parser plugin contract
- parser command vocabulary
- round-trip validation as a named quality gate
- split and rebuild commands as first-class parser operations
- config manager, knowledge manager, and session manager as parser support entities
- parser API surface as separate from command line surface

## Concepts To Adopt

| Concept | Meaning | Owner |
| --- | --- | --- |
| parser application | Application entity that coordinates parser config, plugins, knowledge, and session state. | `AN_APP_LANG_SCOPE_REQUIREMENTS.md` |
| parser plugin | Plugin that adds a parsing, validation, export, or command surface capability. | `SCHEMA_CONTRACT_CATALOG.md` |
| round trip validation | Parse, export, rebuild, and compare to prove content integrity. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` |
| parser command | Approved command such as parse, split, rebuild, validate, export, or status. | `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md` |
| knowledge loader | Support entity that loads approved knowledge folders or datasets for parser use. | `AN_MEMORY_SCOPE_REQUIREMENTS.md` |
| parser session | Session record that tracks parser state, active config, loaded plugins, and output history. | `SCHEMA_CONTRACT_CATALOG.md` |

## Dataset Additions Needed

- parser command names
- parser plugin type names
- parser support entity names
- round-trip validation gate names
- parser surface names

## Decision

Adopt the README as confirmation for the An App Lang parser direction, plus add the missing command, plugin, session, and round-trip validation vocabulary.
