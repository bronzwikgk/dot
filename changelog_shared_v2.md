# Changelog - Shared v2

All notable changes to the shared plugins, utilities, and pipeline templates will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Test generation system (first build, zero dependencies):
  - `code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js` - static source inventory (functions, params, jsdoc, traits, export style)
  - `code/utilities/test_generation/code_shared_signature_inference_v2_2_0_draft.js` - param/return types + archetype classification with confidence
  - `code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js` - test plans from template/sample banks + node:test harness renderer
  - `dataset_shared_v2/code/dataset_of_testing_templates_in_shared_v2.dataset` - archetype to property mapping bank
  - `dataset_shared_v2/code/dataset_of_testing_samples_in_shared_v2.dataset` - typed sample values bank (edge values first)
  - `dataset_shared_v2/code/dataset_of_testing_edges_in_shared_v2.dataset` - edge case rule bank (per type edge literals incl NaN, Infinity, null)
  - `pipelines/system_validate_and_test_code_v2_2_0.md` - 7 stage pipeline: observe, inspect, validate_conventions, infer, generate, execute, report
- Generated regression baselines under `tests_generated/` for standard_error, sorting, text and the three test_generation utilities themselves (self hosted; 440 tests green; snapshots in `tests_generated/snapshots/`)
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
- full repo sweep: all 56 code files inventoried and tested; 53 files / 2370 cases green committed as baselines in tests_generated (sweep naming, sweep_report.json included)

### Fixed
- formula.index_to_column hung forever on Infinity input - now throws RangeError
- array_slicing.slidingWindows with negative infinite window size allocated until out of memory - now throws RangeError
- metric_calculation and standard_deviation required pre rename sibling module names - requires repointed
- policy_gate imported old CLI file name - repointed to code_shared_cli
- runtime imported five legacy utility paths - repointed; ValidationPipeline and Config modules do not exist anywhere (open finding)
- inspector: export class declarations were classified named_object - now class style with export_target
- test_generation: class harness falls back to object arg instantiation when no-arg construction throws; esm class ctor resolves by exported name
- code_inspector gained acorn backed `inspect_source_ast` and `inspect_source_auto`: universal syntax coverage (arrow exports, esm export statements, getters, rest and default params, destructuring) with identical inventory shape; vendored single file `test_generation/vendor/acorn.js` (8.14.0, MIT, 232 KB) keeps the zero install property; legacy line parser remains as fallback (FV7)
- test_generation harness can render esm variants: import based preamble, top level await dynamic import, mjs output when target uses esm syntax
- universality verified against hostile synthetic esm/cjs targets (84 + 76 tests green) and real legacy `inbox_code/utility_legacy/nlu.js` inventoried at 39 functions with exact line ranges
- committed baselines regenerated on acorn backend: 500 tests green across six targets

### Findings From First Dogfood Run
- `sorting.bubbleSort` and `sorting.bubbleSortByKey` mutate their input arrays; generated immutability tests caught it. Both excluded from baseline via skip list pending refactor decision (`execute` and `sortByKey` copy inputs and are safe)
- legacy class-style imports carry no jsdoc so confidence is reported as unknown; acceptable, surfaces in review queue
- generated test files embed absolute require paths to targets; regenerate per machine until pipeline stage 5 relativizes paths

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
