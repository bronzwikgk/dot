# App Data

## Purpose

`app_data` is the approved home for durable application data artifacts that are
not executable code.

## Folder Structure

```text
app_data/
  dataset/
  datamap/
  data_table/
```

## Data Types

| Folder | Meaning | Shape |
| --- | --- | --- |
| dataset | Approved word/value lists. | One-dimensional array only. |
| datamap | Relationship collections grouped by relationship type. | Relation groups, source refs, target refs, relationship type, metadata. |
| data_table | Attribute and parameter tables for dataset items. | CSV-style table built from schema for each group or type. |

## Rules

- `dataset` must stay as one-dimensional arrays.
- `datamap` stores relationships grouped by their relationship types.
- `data_table` stores rows with attributes and parameters for items from
  datasets.
- Each `data_table` must name the schema used to build it.
- Code must live under `code`.
- Data must not be hidden inside code unless it is a small embedded default
  required for a utility or plugin to load.
