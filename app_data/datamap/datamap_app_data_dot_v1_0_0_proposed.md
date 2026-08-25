# App Data Datamap

## Purpose

This folder stores relationship collections grouped by relationship type.

## Shape

A datamap is a collection of relationship records grouped by type.

Conceptual shape:

```text
relationship_type
source_ref
target_ref
cardinality
inverse_type
policy_ref
status
```

## Rules

- relationship types must come from approved relationship datasets
- source and target refs must point to entities or approved dataset items
- relationship groups must be countable and auditable
- cardinality should be explicit when required
- conflicting relationship records must create conflict records, not silent overwrite
- do not store item attributes here; use `app_data/data_table`
