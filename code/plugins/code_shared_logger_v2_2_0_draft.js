/**
 * @entity observability
 * @meta project: gui_v4 | file_name: shared/code/core/kernel/code_shared_observability_v1_0_0_active.js | version: 1.0.0 | status: active | author: ox-alpha
 * @objective provide leveled logging with a ring buffer plus counters and timers for metrics.
 * @purpose_and_problem_statement inspect_system intent needs bounded history and numbers; unbounded logs leak memory and missing timings hide slow stages.
 * @usage log_api.info("boot complete"); metrics_api.timer("compose")();
 * @timing created at boot step three alongside singletons.
 * @scope_boundaries in_scope: ring buffer logs, counters, timers. out_of_scope: transport to disk.
 * @dependencies none.
 * @keywords log, metric, timer
 * @invariants ring buffer never exceeds its ceiling; counters are monotonic within a run.
 * @changelog - 2026-08-22: 1.0.0: initial implementation combining logger and metrics duties
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_kernel_observability = api;
})(typeof self !== "undefined" ? self : globalThis, function () {
  function create_logger(ceiling = 200) {
    const lines = [];
    function push(level, message_text, details) {
      lines.push({ at: new Date().toISOString(), level, message: message_text, details: details || null });
      if (lines.length > ceiling) lines.shift();
    }
    return {
      debug: (m, d) => push("debug", m, d),
      info: (m, d) => push("info", m, d),
      warn: (m, d) => push("warn", m, d),
      error: (m, d) => push("error", m, d),
      get_logs: (level_filter) => level_filter ? lines.filter(l => l.level === level_filter) : lines.slice()
    };
  }
  function create_metrics() {
    const counters = new Map();
    function counter(name_value) {
      const next = (counters.get(name_value) || 0) + 1;
      counters.set(name_value, next);
      return next;
    }
    function timer(name_value) {
      const started = Date.now();
      return () => ({ name: name_value, duration_ms: Date.now() - started });
    }
    function gauge(name_value, numeric_value) { counters.set("gauge:" + name_value, numeric_value); return numeric_value; }
    function snapshot() { return Array.from(counters.entries()); }
    return { counter, timer, gauge, snapshot };
  }
  return { create_logger, create_metrics };
});
