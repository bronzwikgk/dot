/**
 * @entity observability
 * @meta project: shared | file_name: code_shared_logger_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide leveled logging with a ring buffer plus counters, timers, and gauges for metrics.
 * @purpose_and_problem_statement inspect_system intent needs bounded history and numbers; unbounded logs leak memory and missing timings hide slow stages.
 * @usage const log_api = new logger(); log_api.info("boot complete"); metrics.timer("compose")();
 * @timing created at boot step three alongside singletons.
 * @scope_boundaries in_scope: ring buffer logs, counters, timers, gauges. out_of_scope: transport to disk.
 * @dependencies none.
 * @keywords log, metric, timer
 * @invariants ring buffer never exceeds its ceiling; counters are monotonic within a run.
 * @changelog - 2026-08-24: 3.0.0: promoted code_shared_logger_v2_2_0_draft to class form; absorbs the metrics shim duty directly (plugin metrics deleted)
 */
class logger {
  constructor(config = {}) {
    this.config = config || {};
    this.ceiling = Number.isFinite(this.config.ceiling) && this.config.ceiling > 0 ? Math.floor(this.config.ceiling) : 200;
    this.lines = [];
  }

  push(level, message_text, details) {
    this.lines.push({ at: new Date().toISOString(), level, message: message_text, details: details ?? null });
    if (this.lines.length > this.ceiling) this.lines.shift();
  }

  debug(message_text, details) { this.push("debug", message_text, details); }
  info(message_text, details) { this.push("info", message_text, details); }
  warn(message_text, details) { this.push("warn", message_text, details); }
  error(message_text, details) { this.push("error", message_text, details); }

  get_logs(level_filter) {
    if (level_filter) return this.lines.filter(l => l.level === level_filter);
    return this.lines.slice();
  }
}

class metrics {
  constructor() {
    this.counters = new Map();
    this.gauges = new Map();
    this.timers = new Map();
  }

  counter(name_value) {
    const next = (this.counters.get(name_value) || 0) + 1;
    this.counters.set(name_value, next);
    return next;
  }

  timer(name_value) {
    const started = Date.now();
    return () => ({ name: name_value, duration_ms: Date.now() - started });
  }

  gauge(name_value, numeric_value) {
    this.gauges.set(name_value, numeric_value);
    return numeric_value;
  }

  snapshot() {
    return {
      counters: Array.from(this.counters.entries()),
      gauges: Array.from(this.gauges.entries()),
      timers: Array.from(this.timers.entries())
    };
  }
}

function create_logger(ceiling = 200) {
  return new logger({ ceiling });
}

function create_metrics() {
  return new metrics();
}

export { logger, metrics, create_logger, create_metrics };
