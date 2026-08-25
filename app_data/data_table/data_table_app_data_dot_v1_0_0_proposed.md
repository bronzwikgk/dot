# App Data Data Table

## Purpose

This folder stores CSV-style tables for attributes and parameters of dataset
items.

## Shape

A data table is a two-dimensional table. Each row describes one item from a
dataset or a typed group. Columns come from the schema for that group or type.

Typical columns:

```text
id,name,owner_domain,status,description,parameters,policy_ref,source_ref
```

## Rules

- every data table must name its source dataset or group
- every data table must name the schema used to build it
- one row should describe one dataset item or typed item
- attributes and parameters belong here
- relationship edges belong in `app_data/datamap`
- approved values belong in `app_data/dataset`
