# Entity Definition Files

## Purpose

Store definition documents for entity types and entity-shaped records.

## Boundary

Definition files explain the shape, fields, relationships, policies, lifecycle,
validation, and examples for entities. They are not executable code.

## Structure

```text
app_data/definition/
  <subdomain_name>/
    definition_<entity_name>_v<version>_<status>.md
```

## Required Fields

Each entity definition should include:

- entity name
- owner domain
- assigned owner agent
- purpose
- fields
- config
- relationships
- policies
- lifecycle states
- validation rules
- examples
- source refs
- update process

## Rules

- every durable or governable item is an entity
- check approved names before creating a definition
- put flat allowed values in `app_data/dataset`
- put relationship groups in `app_data/datamap`
- put attributes and parameters in `app_data/data_table`
