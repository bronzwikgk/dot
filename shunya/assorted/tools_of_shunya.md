# Tools of Shunya

## Overview
`index_tree_parser_v1.7.0_active_Codex.js` is the parser that converts indented `.txt` outlines and XML trees into JSON or XML formats via a schema-driven workflow. It routes all filesystem I/O through `actionFS`, applies schemas asynchronously, and the CLI enforces that inputs contain "index" while emitting versioned outputs in `Inprogress/index/`. Outputs are tracked in `Inprogress/test/parser/` for quick verification.

## Usage
1. From `Inprogress/test`, run:
   ```
   node ../src/utils/index_tree_parser_v1.7.0_active_Codex.js ../index/index_pages_erms.txt ../index/index_pages_erms_v1.7.0.json ../index/index_schema_template_v1.json
   ```
2. Or generate XML (with label `sections`):
   ```
   node ../src/utils/index_tree_parser_v1.7.0_active_Codex.js ../index/index_pages_erms.txt ../index/index_pages_erms_v1.7.0.xml ../index/index_schema_template_v1.json xml label sections
   ```
3. To rehydrate JSON from XML:
   ```
   node ../src/utils/index_tree_parser_v1.7.0_active_Codex.js ../index/index_pages_erms_tree_v1.xml ../index/index_pages_erms_from_xml_v1.7.0.json ../index/index_schema_template_v1.json
   ```

## Configuration
- `INDENT_WIDTH` defaults to 4 spaces.
- CLI defaults target `index_pages_erms.txt` → `index_pages_erms_v1.7.0.json`, but input/output paths and format flags are fully parameterized.
- CLI defaults target `index_pages_erms.txt` → `index_pages_erms_v1.7.0.json`, but providing a format map lets you describe any number of outputs (json/xml/txt).
- Schema can be passed to transform the tree shape; see `Inprogress/index/index_schema_template_v1.json`.

## Schema Guidance
The schema maps fields like `labelKey`/`childrenKey` and explains XML metadata attributes. Use `Inprogress/index/index_xml_schema_v1.json` when generating tag-specific trees for UI templates.

## Testing
- Tests run from `Inprogress/test` and log their success in `Inprogress/log/changelog-20260107-parser-actionfs.md` plus the new `Inprogress/log/changelog-20260108-parser-formatmap.md`.
- Sample inputs/outputs exist in `Inprogress/test/parser/` (now including TXT files).

## Roadmap
- Extend schema adapters for Markdown, YAML, and XML sources.
- Introduce automated regression scripts that diff generated trees against stored snapshots.

## Contact
Any agent can fork off this parser by updating `tools_of_shunya.md` with new usage notes or by copying `index_tree_parser_v1.7.0_active_Codex.js`, routing I/O through `actionFS`, and versioning their variant with the prescribed metadata/comments. For directed help, refer to `Inprogress/ins/agents.ins`.
4. To emit multiple formats at once, supply the format map (key:value pairs):
   ```
   node ../src/utils/index_tree_parser_v1.7.0_active_Codex.js ../index/index_pages_erms.txt <<target map>> ../index/index_schema_template_v1.json
   ```
   Example:
   ```
   node ../src/utils/index_tree_parser_v1.7.0_active_Codex.js ../index/index_pages_erms.txt json:../index/index_pages_erms_v1.7.0.json,xml:../index/index_pages_erms_v1.7.0.xml,txt:../index/index_pages_erms_v1.7.0.txt ../index/index_schema_template_v1.json xml label sections
   ```
