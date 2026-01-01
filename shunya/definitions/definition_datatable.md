---
Version: v1.0.0
Status: draft
Agent: Gemini CLI
Last Updated: 2025-12-29
---
# Definition: Datatable

## Core Definition
A datatable is a structured tabular representation that contains values of attributes for each item in a dataset. Each datatable row corresponds to a dataset item, and each column corresponds to an attribute as defined in the schema/structure file of the relevant dataset item.

## Relation to Dataset
*   **Dataset**: Collection of items (single values).
*   **Datatable**: Expands dataset items into tabular form using attribute schemas.
*   **Dataindex**: Maps relationships between dataset items.

## Discovery
Datatables are discovered after a dataset is defined. Each dataset item points to its schema/structure file, which specifies its attributes. These attributes become columns in the datatable.

## Definition Process
1.  Identify dataset items.
2.  Locate structure/schema file for each item.
3.  Expand attributes into datatable columns.
4.  Populate rows with values for each dataset item.

## Structure
*   **Row**: Represents one dataset item.
*   **Column**: Represents one attribute defined in item schema.
*   **Cell**: Actual value of attribute for that dataset item.

## Naming
*   **Convention**: `<project>-datatable-<entity>-v<semver>.yml`
*   **Example**: `tms-datatable-stockActions-v1.0.0.yml`

## Semantic Versioning
Datatables follow standard semantic versioning rules:
*   **MAJOR**: Schema change.
*   **MINOR**: Attribute addition/modification.
*   **PATCH**: Fixes or minor clarifications.

## Evaluation
**Checklist**:
*   Ensure every dataset item is represented as row.
*   Ensure every attribute from schema file is included as column.
*   Validate values against schema types.
*   Check completeness (no missing required attributes).

## Storage
*   **Format**: YAML or CSV
*   **Location**: `form/datatable/`
*   **Persistence**:
    *   **Options**: browser, fs, gdrive
    *   **Default**: fs

## Auditing
*   Maintain changelog for attribute/column changes.
*   Validate consistency with dataset and schema definitions.
*   Log version updates with reasons.

## Update Process
*   Add/remove/modify attributes only via schema update.
*   Propagate schema changes to datatable.
*   Increment version accordingly.
