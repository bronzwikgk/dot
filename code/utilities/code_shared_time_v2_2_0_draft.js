/**
 * @entity time_utility
 *
 * @meta
 * project: an_app
 * file_name: src/utility/time.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * timestamp creation, duration formatting, and utc helpers.
 *
 * @purpose_and_problem_statement
 * consistent time handling across the app without external dependencies.
 *
 * @usage
 * ```js
 * const now = utc_now();
 * const elapsed = format_duration(12345);
 * ```
 *
 * @timing
 * used by entity timestamps, metrics, run ids.
 *
 * @scope_boundaries
 * in_scope: utc timestamps, duration formatting, iso strings
 * out_of_scope: timezone conversion, calendar math
 *
 * @dependencies
 * none (pure)
 *
 * @keywords
 * time, timestamp, duration, utc
 *
 * @invariants
 * - all timestamps are utc in iso format
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
export function utc_now() {
  return new Date().toISOString();
}

export function format_duration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

export function parse_iso(iso_string) {
  return new Date(iso_string);
}

export function to_timestamp(date) {
  return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
}
