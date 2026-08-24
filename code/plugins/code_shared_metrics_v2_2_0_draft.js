/**
 * @entity metrics
 * @meta project: an_app | file_name: src/core/kernel/metrics.js | version: 1.0.0 | status: draft
 * @objective provide thin wrapper re-exporting create_metrics from logger module.
 * @purpose_and_problem_statement metrics are used across many modules; a dedicated re-export file keeps imports clean.
 * @usage import { create_metrics } from "./metrics.js";
 * @timing imported alongside other kernel modules.
 * @scope_boundaries in_scope: re-export only. out_of_scope: metrics implementation details.
 * @dependencies kernel/logger.
 * @keywords metrics, re-export
 * @invariants re-export preserves original function signature; no additional logic added.
 * @changelog - 2026-08-22: 1.0.0: initial implementation
 */
import { create_metrics as _create_metrics } from "./logger.js";

export const create_metrics = _create_metrics;