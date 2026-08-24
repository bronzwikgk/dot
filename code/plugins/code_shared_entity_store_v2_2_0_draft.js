/**
 * @entity entity_store
 * @meta project: an_app | file_name: src/core/kernel/entity_store.js | version: 1.0.0 | status: active | author: ox-alpha
 * @objective cache entities and append immutable versions through any storage provider.
 * @purpose_and_problem_statement silent overwrites lose history; optimistic locking via expected_version makes conflicts explicit and reverts safe.
 * @usage const outcome = await store.save_entity(entity); await store.load_entity(id_value);
 * @timing singleton from boot step three; serves persist and load paths.
 * @scope_boundaries in_scope: cache, versioning, conflict detection. out_of_scope: provider internals.
 * @dependencies kernel/entity, storage provider contract.
 * @keywords store, version, conflict
 * @invariants versions only grow; mismatched expected_version returns a conflict response without writing.
 * @changelog - 2026-08-22: 1.0.0: initial implementation
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_kernel_store = api;
})(typeof self !== "undefined" ? self : globalThis, function () {
  function create_entity_store(provider, entity_api) {
    const cache = new Map();
    async function save_entity(candidate, options = {}) {
      const known = cache.get(candidate.id);
      if (known && options.expected_version !== undefined && options.expected_version !== known.version) {
        return { errors: [{ code: "version_conflict", message: "expected version " + options.expected_version + " but current is " + known.version }] };
      }
      const next = Object.assign({}, candidate, {
        version: (known ? known.version : candidate.version || 0) + 1,
        updated_at: new Date().toISOString()
      });
      await provider.append_version(next);
      cache.set(next.id, next);
      return { data: next };
    }
    async function load_entity(id_value, version_wanted) {
      if (!version_wanted && cache.has(id_value)) return { data: cache.get(id_value) };
      const versions = await provider.read_versions(id_value);
      if (versions.length === 0) return { data: null };
      const chosen = version_wanted
        ? versions.find(one => one.version === version_wanted)
        : versions[versions.length - 1];
      if (chosen) cache.set(chosen.id, chosen);
      return chosen ? { data: chosen } : { errors: [{ code: "missing_version", message: "no version " + version_wanted }] };
    }
    async function list_entities(type_filter) {
      const heads = await provider.list_all();
      return { data: type_filter ? heads.filter(one => one.type === type_filter) : heads };
    }
    async function search_entities(query) {
      const heads = await provider.list_all();
      if (!query) return { data: heads };
      const q = query.toLowerCase();
      return { data: heads.filter(function (one) {
        if (one.type && one.type.toLowerCase().indexOf(q) !== -1) return true;
        if (one.id && one.id.toLowerCase().indexOf(q) !== -1) return true;
        if (one.data) {
          const d = one.data;
          if (d.label && d.label.toLowerCase().indexOf(q) !== -1) return true;
          if (d.title && d.title.toLowerCase().indexOf(q) !== -1) return true;
          if (d.name && d.name.toLowerCase().indexOf(q) !== -1) return true;
          if (d.content && d.content.toLowerCase().indexOf(q) !== -1) return true;
          if (d.text && d.text.toLowerCase().indexOf(q) !== -1) return true;
          if (d.path && d.path.toLowerCase().indexOf(q) !== -1) return true;
        }
        if (one.traits && one.traits.indexOf(q) !== -1) return true;
        return false;
      }) };
    }
    async function revert_entity(id_value, version_wanted) {
      const past = await load_entity(id_value, version_wanted);
      if (past.errors) return past;
      return save_entity(Object.assign({}, past.data));
    }
    function cache_size() { return cache.size; }
    return { save_entity, load_entity, list_entities, search_entities, revert_entity, cache_size };
  }
  return { create_entity_store };
});
