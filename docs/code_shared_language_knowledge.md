# code_shared_language_knowledge.md

**Version:** v1.4.0
**Status:** active
**Owner:** agent_codex_an_app
**Merged from:** cell_command_language, an_app_brain

## What It Is

Language parsing and brain coordination: cell command language, An App Brain.

## Components

### cell_command_language
Language parsing for GUI commands and cell execution (natural language, code, markdown).

### an_app_brain
Coordination layer for thinking-like behavior: ingestion, decomposition, parsing, reasoning, resolution, composition, validation, recursion, learning, boundary.

## Runtime Contract

- commands parse to validated records
- brain pipeline uses ports, no duplicate behavior
- boundary checks block/clarify before active changes

## Related Files

- code/utilities/code_shared_cell_command_language_v4_0_0_draft.js
- code/plugins/an_app_brain_v1_4_0_draft.js
