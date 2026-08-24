/**
 * @entity id_utility
 * @meta project: gui_v4 | file_name: shared/code/utility/code_shared_id_utility_v1_0_0_active.js | version: 1.0.0 | status: active | author: ox-alpha
 * @objective generate unique identifier strings on any runtime.
 * @purpose_and_problem_statement entities need collision free identity without npm dependencies; runtimes differ in crypto surface.
 * @usage const value = new_id();
 * @timing called during entity creation and run identification.
 * @scope_boundaries in_scope: identifier generation. out_of_scope: formatting, validation.
 * @dependencies runtime crypto only.
 * @keywords identifier, uuid, unique
 * @invariants output matches uuid pattern where crypto supports it.
 * @changelog - 2026-08-22: 1.0.0: initial implementation
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_utility_id = api;
})(typeof self !== "undefined" ? self : globalThis, function () {
  function new_id() {
    var host = null;
    try {
      if (typeof require === "function" && typeof window === "undefined") host = require("crypto");
    } catch (_e) { host = null; }
    if (host && typeof host.randomUUID === "function") return host.randomUUID();
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }
  return { new_id };
});
