# Changelog - Shared v2

All notable changes to the shared plugins, utilities, and pipeline templates will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Imported 18 math/statistics utilities from ohm_model legacy batch (SH-024..SH-041), renamed to convention:
  - cosine_similarity, euclidean_distance, entropy, pmi, z_score_normalization
  - standard_deviation, standard_error, mean_calculation, weighted_mean, weighted_vote
  - confidence_interval, metric_calculation, sorting, filtering
  - array_concatenation, array_slicing, label_generation, train_test_split
- Imported 10 utilities from an_app legacy (`an_app_stale/src/utility`, `src/core/formula`), renamed to convention:
  - collection, id, text, serialize, schema, topo_sort, traverse, time, pool, formula
- Imported 14 plugins from an_app legacy kernel, boot and provider layers, renamed to convention:
  - global_context, plugin_host, message_bus, logger, metrics
  - entity_store, entity_index, schema_registry
  - providers: file_storage, memory_storage, inverted_index, terminal_renderer
  - intent_dispatcher, intent_registry
- Added git integration guide with version-per-branch model (`doc/git_integration_shared.md`)
- Added VERSION file (2.0.0) and initial branch model (master, v2, wip_dot)

### Changed
- None

### Deprecated
- `code_shared_entity_index_v2_2_0_draft.js` is staged for merge into `code_shared_index_builder_v2_2_0_draft.js` pending review; do not build new dependencies against it

### Known Overlaps To Review
- `transform_engine` concept vs existing transformer utility (transform_engine stayed in legacy)
- legacy ast_parser/doc_parser vs existing parser utility (stayed in legacy)

---

## [2.0.0] - 2026-08-24

### Added
- Initial import from Runtime_ourActionLang lineage, renamed to convention:
  - Plugins: runtime, runner, validator, policy_gate, index_builder, cli
  - Utilities: tokenizer, parser, compiler, resolver, transformer
- Created pipelines folder for MD pipeline templates (empty, templates pending)
