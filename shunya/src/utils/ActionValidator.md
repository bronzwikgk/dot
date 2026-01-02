---
title: ActionValidator Specification
status: living
version: 1.0
component: ActionValidator
---

# ActionValidator

## Summary
Schema-based validation utility.

## Responsibilities
- Validates configs/payloads against JSON schemas.
- Enforces rules for required fields, data types, and formats.
- Throws detailed, structured errors when validation fails.
- Ensures data integrity before persistence or response formatting.
