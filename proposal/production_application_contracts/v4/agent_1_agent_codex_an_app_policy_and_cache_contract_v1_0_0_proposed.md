# V4 Contract 011: Policy and Cache

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Priority: p1
Domain: foundation_and_runtime

## Purpose

Define cache/storage/security/routing/naming/create policy validation and shell cache via action_entity.

## Required Records

- policy_record
- cache_record
- security_record
- routing_record

## Required Operations

- validate_policy
- read_cache
- write_cache
- audit_cache

## Inputs

- policy_ref
- cache_ref
- security_ref

## Outputs

- policy_record
- cache_record

## Validation

- policies validate before boot
- cache reads/writes through action_entity
- audit records are created

## Success Criteria

- invalid policy names/values fail before boot
- shell cache works through action_entity
- audit records are correct

## Do

- use action_entity for cache
- validate policies before boot
- audit cache operations

## Do Not

- do not bypass policy validation
- do not use cache without audit
- do not allow invalid policy names
