# Action Search Doc Dataset Adoption Note

## Scope

Reviewed configuration and known search provider material from
`input_temp/b6/actionSearch`.

This pass focused on provider configuration, external knowledge intake,
normalization, query transforms, provider mappings, and audit needs.

## Files Reviewed

- `input_temp/b6/actionSearch/config/actionSearch_providers_v1_1_0_ready_Gem.config.js`
- `input_temp/b6/actionSearch/code/ActionSearch_core_v1_1_0_ready_Gem.js`

## What This Folder Is About

This folder defines a configurable external search utility.

In simple English:

- define search providers in config
- transform a query for each provider
- fetch results
- map provider-specific fields into a common result shape
- attach provider identity and timing/audit data
- use external search when local knowledge is not enough

This is useful for An Memory, An Bot, and research/verification workflows.

## Adopted Concepts

### Provider Config

Required fields:

- provider id
- provider name
- enabled flag
- response type
- URL template
- mapping
- query transform
- array path
- extraction patterns

### Search Runtime Config

Required fields:

- user agent
- timeout
- max results per provider
- provider list

### Normalized Knowledge Result

Required fields:

- title
- snippet
- link
- thumbnail
- author
- provider id
- provider name
- query
- retrieved timestamp

### Provider Types

Provider types:

- JSON object
- JSON array
- XML pattern
- feed
- HTML adapter

### Search Use Cases

Use search when:

- local confidence is low
- facts need verification
- source comparison is needed
- academic/reference lookup is needed
- trend or news-like input must be refreshed

## Dataset Additions Needed

Add or extend 1D arrays for:

- search provider field names
- search runtime config field names
- normalized result field names
- provider type names
- query transform names
- external verification reason names
- search audit field names

## Documentation Updates Needed

1. `AN_MEMORY_SCOPE_REQUIREMENTS.md`
   - Add external knowledge intake.
   - Add normalized search result shape.
   - Add source confidence and provenance expectations.

2. `AN_BOT_SCOPE_REQUIREMENTS.md`
   - Add low-confidence external lookup behavior.

3. `APPLICATION_ENTITY_DOCTRINE.md`
   - Add search provider config and search result as entity-backed records.

## Decision

Adopt the provider configuration and normalized search result model. External
providers should remain adapters, not core truth.
