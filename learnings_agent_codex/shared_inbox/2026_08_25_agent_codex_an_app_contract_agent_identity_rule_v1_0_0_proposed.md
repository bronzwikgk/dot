# Shared Inbox: Contract Agent Identity Rule

Date: 2026-08-25
Author: agent_codex_an_app
Status: added

## Summary

All detail contracts now include an explicit `Owner agent` field.

## Rule

Every contract and handoff must name:

- acting agent name
- assigned owner agent name

Before editing, each acting agent must cross-check:

- current conversation
- master docs
- policy docs
- parent contract
- detail contracts
- shared inbox

The cross-check must look for convention violations, banned names, pending
decisions, and user corrections.

## Validation

Checked all 19 detail contracts under:

`dot/proposal/production_application_contracts/contract_*.md`

Each contract now has an `Owner agent` line.
