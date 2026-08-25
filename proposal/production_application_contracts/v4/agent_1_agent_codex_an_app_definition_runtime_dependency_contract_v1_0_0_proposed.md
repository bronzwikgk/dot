# V4 Contract 010: Definition, Runtime, and Dependency

Date: 2026-08-25
Status: active
Owner agent: agent_codex_an_app
Priority: p0
Domain: foundation_and_runtime

## Purpose

Define project/product definition file schema, allowed runtime, dependency resolver, and default resolver.

## Required Records

- project_definition_record
- dependency_record
- policy_record
- default_record
- mount_target_record

## Required Operations

- load_definition
- resolve_dependencies
- resolve_defaults
- validate_definition

## Inputs

- definition_ref
- runtime_ref
- dependency_ref

## Outputs

- project_definition_record
- dependency_record

## Validation

- definition file validates against schema
- dependencies resolve correctly
- defaults are applied
- runtime detection works

## Success Criteria

- definition schema validates
- dependency resolution works
- runtime detection works
- defaults resolve correctly

## Do

- use entity doctrine for definitions
- validate before boot
- resolve dependencies at boot

## Do Not

- do not skip definition validation
- do not bypass dependency resolver
- do not hardcode defaults
