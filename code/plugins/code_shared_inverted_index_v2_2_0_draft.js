/**
 * @entity inverted_index
 *
 * @meta
 * project: an_app
 * file_name: src/plugins/providers/index/inverted_index/index.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * Text search index provider building an inverted index from entity content
 *
 * @purpose_and_problem_statement
 * Enables full-text and property-based search over indexed entities using an inverted index
 *
 * @usage
 * ```js
 * ctx.register_operation("index_entity", index_entity);
 * ctx.register_operation("search_text", search_text);
 * search_text({ query: "hello world" });
 * ```
 *
 * @timing
 * Runs when plugin is activated; indexing and search operations available throughout session
 *
 * @scope_boundaries
 * in_scope: in-memory inverted index for text and property search
 * out_of_scope: persistent index storage, external search engines, fuzzy matching
 *
 * @dependencies
 * - None
 *
 * @keywords
 * index, search, inverted, text, full-text, property search
 *
 * @invariants
 * - Tokenization normalizes to lowercase alphanumeric terms
 * - Search performs intersection of term sets to find matching entities
 * - Property search indexes each property separately with key:token prefixing
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */

export const manifest = {
  id: "provider_index_inverted",
  version: "1.0.0",
  requires: [],
  permissions: ["store.save", "store.load"],
  provides: {
    types: ["index"],
    traits: ["searchable"],
    operations: ["index_entity", "search_text", "search_property"],
    stage_handlers: [],
  },
};

export function activate(ctx) {
  const index = new Map();
  const property_index = new Map();

  function _tokenize(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 0);
  }

  function _add_to_index(term, entity_id) {
    if (!index.has(term)) index.set(term, new Set());
    index.get(term).add(entity_id);
  }

  function index_entity({ entity_id, content, properties }) {
    const tokens = _tokenize(content);
    for (const token of tokens) _add_to_index(token, entity_id);

    if (properties && typeof properties === "object") {
      for (const [prop_name, prop_value] of Object.entries(properties)) {
        const prop_tokens = _tokenize(prop_value);
        for (const token of prop_tokens) {
          const prop_key = `${prop_name}:${token}`;
          if (!property_index.has(prop_key))
            property_index.set(prop_key, new Set());
          property_index.get(prop_key).add(entity_id);
        }
      }
    }

    return { success: true };
  }

  function search_text({ query }) {
    const tokens = _tokenize(query);
    if (tokens.length === 0) return { success: true, results: [] };
    const sets = tokens.map((t) => index.get(t) || new Set());
    const intersection = sets.reduce((a, b) => {
      const result = new Set();
      for (const id of a) if (b.has(id)) result.add(id);
      return result;
    });
    return { success: true, results: Array.from(intersection) };
  }

  function search_property({ property, query }) {
    const tokens = _tokenize(query);
    if (tokens.length === 0) return { success: true, results: [] };
    const sets = tokens.map(
      (t) => property_index.get(`${property}:${t}`) || new Set()
    );
    const intersection = sets.reduce((a, b) => {
      const result = new Set();
      for (const id of a) if (b.has(id)) result.add(id);
      return result;
    });
    return { success: true, results: Array.from(intersection) };
  }

  const operations = { index_entity, search_text, search_property };

  for (const [name, fn] of Object.entries(operations)) {
    ctx.register_operation(name, fn);
  }

  return { index, property_index };
}

export function deactivate(ctx) {
  ctx.unregister_operations(["index_entity", "search_text", "search_property"]);
}
