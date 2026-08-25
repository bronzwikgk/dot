# File Conversion Domain Requirements

## Purpose

The File Conversion domain defines how An App converts one supported input
format into one or more output formats while preserving structure, provenance,
and policy decisions.

This domain is needed because file conversion appears as its own mature scope:
format detection, parsing, normalized trees, writer targets, policy wrappers,
capability matrices, and conversion reports.

## Core Entities

- input file
- parsed model
- normalized tree
- conversion profile
- conversion manifest
- capability matrix
- feature fact
- target writer
- conversion rule
- conversion report
- preservation summary
- tree query
- tree diff
- tree merge
- schema migration support
- streaming parse mode
- parser watch mode

## Supported Input Formats

- JSON
- text
- CSV
- XML
- YAML
- Markdown
- CSS
- array list
- tree
- folder

## Supported Output Views

- JSON
- Markdown
- YAML
- text
- HTML
- module wrapper
- folder tree
- manifest

## Conversion Pipeline

- detect format
- parse input
- build parsed model
- normalize tree
- extract feature facts
- evaluate policy
- render target
- validate output
- write artifacts
- emit report

## Policy Requirements

Conversion policy should define:

- strict mode
- permissive mode
- metadata-only fallback
- preservation priorities
- target capability matrix
- unsupported feature behavior
- rule decision trace
- loss summary

## Known Edge Cases

- YAML multiline strings
- YAML anchors and aliases
- real-world HTML nesting
- CSV delimiter variation
- headerless CSV
- XML namespaces
- XML self-closing tags
- content-based detection
- large file streaming
- circular references
- deep nesting
- binary file detection

## Tree Tool Requirements

Tree tooling should support:

- path-based node selection
- type-based node selection
- attribute-based filtering
- query result manipulation
- structural diff
- three-way merge with conflict reporting
- patch generation
- patch application
- change history

## Parser Scale Requirements

Large inputs should support:

- streaming parse mode
- repeated-parse cache
- memory usage measurement
- line-specific error reports
- context-aware recovery hints
- watch mode for file changes

## Dataset Requirements

Add 1D arrays for:

- conversion input format names
- conversion output format names
- conversion pipeline stage names
- conversion profile names
- feature fact names
- preservation status names
- data loss risk names
- conversion error names
- writer type names

## Validation Requirements

- Conversion report must include rule trace and preservation summary.
- Strict mode must block known high-risk data loss.
- Same input and config must produce the same report.
- Unsupported features must not be marked preserved.
- Large inputs must respect size and depth limits.

## Use Cases

- one format to many outputs
- folder to tree
- document to normalized tree
- conversion report for audit
- template-rendered tree document

## Adoption Notes

Learned from file conversion folders, conditional tree conversion flows,
conversion policy proposals, importer docs, and bug reports.
