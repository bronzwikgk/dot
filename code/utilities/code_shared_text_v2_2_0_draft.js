/**
 * @entity text_utility
 * @meta project: gui_v4 | file_name: shared/code/utility/code_shared_text_utility_v1_0_0_active.js | version: 1.0.0 | status: active | author: ox-alpha
 * @objective escape text for safe interpolation and tokenize for indexing.
 * @purpose_and_problem_statement rendering inserts user text into markup and the index needs searchable words; both need one trusted implementation.
 * @usage const safe = escape_text(raw); const words = tokenize(text);
 * @timing escaping during compose; tokenizing during index stage.
 * @scope_boundaries in_scope: escaping, casing, splitting. out_of_scope: stemming, language detection.
 * @dependencies none.
 * @keywords escape, tokenize, text
 * @invariants escaped output contains no raw angle brackets or quotes from input.
 * @changelog - 2026-08-22: 1.0.0: initial implementation
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_utility_text = api;
})(typeof self !== "undefined" ? self : globalThis, function () {
  function escape_text(value) {
    return String(value)
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  function join_mapped(items, map_function) {
    return items.map(map_function).join("");
  }
  function tokenize(text_value) {
    return String(text_value || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(word => word.length > 1);
  }
  function normalize_spaces(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }
  return { escape_text, join_mapped, tokenize, normalize_spaces };
});
