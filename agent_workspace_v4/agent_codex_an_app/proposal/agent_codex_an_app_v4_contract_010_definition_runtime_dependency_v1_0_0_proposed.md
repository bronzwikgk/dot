# V4 Contract 010: Definition Runtime Dependency

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_035, v4_missing_036

## Goal

Define how an An App project/product definition file describes metadata,
allowed runtime, feature flags, definitions, shapes, patterns, schema, config,
runtime-based dependencies, and policies.

## Required Entities

- project_definition
- product_definition
- runtime_record
- dependency_record
- feature_flag
- policy_record
- schema_record
- shape_record
- pattern_record
- default_record

## Required App Data

- dataset of allowed runtime names
- dataset of dependency kind names
- dataset of feature flag names
- dataset of policy names
- datamap from definition to dependencies
- datamap from runtime to allowed dependency kinds
- data table of definition attributes
- data table of dependency attributes
- definition docs for each entity

## Required Methods

- detect_runtime(config)
- parse_definition(config)
- validate_definition(config)
- resolve_definition(config)
- resolve_runtime_dependencies(config)
- resolve_defaults(config)

## Success Criteria

- invalid runtime names fail validation
- missing required definition fields fail validation
- runtime dependency records resolve to plugin, utility, app_data, template, or definition references
- dependency cycles fail validation
- defaults resolve in this order: config value, definition value, template value, system default
- every result returns structured `{ ok, data, errors }`

## Tests

- definition parser tests
- dependency resolver tests
- runtime detection tests
- invalid/missing/cycle tests

## Do Not

- do not introduce duplicate names for dependencies
- do not use banned shorthand names
- do not resolve dependencies by ad hoc string matching when app_data can drive validation
