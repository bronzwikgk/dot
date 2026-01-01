---
Version: v1.0.0
Status: draft
Agent: Gemini CLI
Last Updated: 2025-12-29
---
# Definition: Datamap

A **Datamap** captures relationships and implicit mappings between various datasets (e.g., tags to roles, routes to handlers). Datamaps are created *after* the related datasets exist, often as part of a generation or processing flow (e.g., as documented in `pari/flow/create_generate.txt`).

## Storage and Naming Conventions

*   Datamaps are stored as versioned `.js` files under the `pari/datamap/` directory.
*   Files and exported constants related to datamaps should use the `datamap` prefix.
    *   **Example Filename**: `datasmap_html_complete_implicit_aria_roles_v1.js`
    *   **Example Exported Constant**: `DATAMAP_HTML_COMPLETE_IMPLICIT_ARIA_ROLES_V1`

## Usage Guidelines

*   Always reference the datamap definition when adding new relationships. This ensures that new mappings accurately mirror the dataset inputs and that the create/generate flow is properly documented.
