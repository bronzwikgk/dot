/**
 * @entity text
 * @meta project: shared | file_name: code_shared_text_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @changelog - 2026-08-24: 3.0.0: promoted from v2 text utility to class form
 */
export class TextUtil {
  constructor(config = {}) { this.config = config || {}; }
  escape_text(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  join_mapped(items, map_function) {
    if (!items || items.length === 0) return "";
    return items.map(map_function).join("");
  }
  tokenize(text_value) {
    return String(text_value || "").toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 1);
  }
  normalize_spaces(value) { return String(value || "").replace(/\s+/g, " ").trim(); }
}
export function escape_text(v) { return new TextUtil().escape_text(v); }
export function tokenize(v) { return new TextUtil().tokenize(v); }
export function normalize_spaces(v) { return new TextUtil().normalize_spaces(v); }
export function join_mapped(items, fn) { return new TextUtil().join_mapped(items, fn); }
export default TextUtil;
