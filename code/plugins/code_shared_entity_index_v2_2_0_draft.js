/**
 * @entity entity_index
 * @meta project: an_app | file_name: src/core/kernel/entity_index.js | version: 1.0.0 | status: draft
 * @objective provide search facade over index provider with fallback to store memory search.
 * @purpose_and_problem_statement searching entities needs a unified interface regardless of whether an external index provider exists.
 * @usage const index = create_entity_index({ provider, store }); await index.search_text("query");
 * @timing created after entity store and optional index provider are available.
 * @scope_boundaries in_scope: text search, property search, index/remove operations. out_of_scope: provider implementation details.
 * @dependencies kernel/entity_store, optional index provider.
 * @keywords search, index, facade
 * @invariants falls back to store memory search when provider is null; all methods return results or empty arrays.
 * @changelog - 2026-08-22: 1.0.0: initial implementation
 */
export function create_entity_index({ provider, store }) {
  const active_provider = provider || null;
  const memory_store = store;

  async function search_text(query) {
    if (!query || query.trim().length === 0) {
      return { data: [] };
    }
    if (active_provider && typeof active_provider.search_text === "function") {
      return await active_provider.search_text(query);
    }
    if (memory_store && typeof memory_store.search_entities === "function") {
      return await memory_store.search_entities(query);
    }
    return { data: [] };
  }

  async function search_property(key, value) {
    if (!key) {
      return { data: [] };
    }
    if (active_provider && typeof active_provider.search_property === "function") {
      return await active_provider.search_property(key, value);
    }
    if (memory_store && typeof memory_store.list_entities === "function") {
      const result = await memory_store.list_entities();
      const entities = result.data || [];
      const matches = entities.filter(function (entity) {
        if (entity[key] !== undefined && entity[key] === value) {
          return true;
        }
        if (entity.data && entity.data[key] !== undefined && entity.data[key] === value) {
          return true;
        }
        if (entity.attributes && entity.attributes[key] !== undefined && entity.attributes[key] === value) {
          return true;
        }
        return false;
      });
      return { data: matches };
    }
    return { data: [] };
  }

  async function index_entity(entity) {
    if (!entity || !entity.id) {
      return { errors: [{ code: "invalid_entity", message: "entity must have an id" }] };
    }
    if (active_provider && typeof active_provider.index_entity === "function") {
      return await active_provider.index_entity(entity);
    }
    return { data: { indexed: entity.id } };
  }

  async function remove_entity(id_value) {
    if (!id_value) {
      return { errors: [{ code: "missing_id", message: "entity id is required" }] };
    }
    if (active_provider && typeof active_provider.remove_entity === "function") {
      return await active_provider.remove_entity(id_value);
    }
    return { data: { removed: id_value } };
  }

  return {
    search_text,
    search_property,
    index_entity,
    remove_entity
  };
}