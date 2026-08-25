# Shared Markdown Pipeline Log

## 2026-08-25

Promoted markdown pipeline utility from `scratchpad_entity_system/code`.

### Added

- Markdown block decomposition.
- Heading and text block parsing.
- Markdown composition.
- Round-trip runner.

### Decision

Keep as a utility. It is a simple line-based parser and not yet the full
document-tree parser.

### Verification

- Module import from promoted path passed.
