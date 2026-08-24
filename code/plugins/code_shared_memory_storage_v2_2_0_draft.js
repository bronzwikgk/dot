/**
 * @entity memory_storage
 *
 * @meta
 * project: an_app
 * file_name: src/plugins/providers/storage/memory_storage/index.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * In-memory storage provider using a Map with append-only version history
 *
 * @purpose_and_problem_statement
 * Provides ephemeral in-memory storage with versioning for entities during runtime
 *
 * @usage
 * ```js
 * const store = create_provider();
 * store.append_version({ id: "item1", data: "hello" });
 * const versions = store.read_versions("item1");
 * ```
 *
 * @timing
 * Runs when plugin is activated; operations available throughout session lifetime
 *
 * @scope_boundaries
 * in_scope: in-memory key-value storage with append-only version history
 * out_of_scope: persistence across sessions, disk I/O, network storage
 *
 * @dependencies
 * - None
 *
 * @keywords
 * storage, memory, in-memory, versioning, ephemeral
 *
 * @invariants
 * - Each key maps to an ordered list of versioned snapshots
 * - Versions are append-only; revert truncates later versions
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */

export const manifest = {
  id: "provider_storage_memory",
  version: "1.0.0",
  requires: [],
  permissions: ["store.save", "store.load"],
  provides: {
    types: ["storage"],
    traits: ["persistent"],
    operations: [
      "save_entity",
      "load_entity",
      "delete_stored",
      "list_stored",
      "version_entity",
      "revert_entity",
    ],
    stage_handlers: [],
  },
};

export function activate(ctx) {
  const storage = new Map();

  function save_entity({ key, entity }) {
    const entry = storage.get(key) || { versions: [] };
    entry.versions.push(structuredClone(entity));
    storage.set(key, entry);
    return { success: true };
  }

  function load_entity({ key, version }) {
    const entry = storage.get(key);
    if (!entry) return { success: false, error: "not_found" };
    const idx = version != null ? version : entry.versions.length - 1;
    if (idx < 0 || idx >= entry.versions.length)
      return { success: false, error: "invalid_version" };
    return { success: true, entity: structuredClone(entry.versions[idx]) };
  }

  function delete_stored({ key }) {
    if (!storage.has(key)) return { success: false, error: "not_found" };
    storage.delete(key);
    return { success: true };
  }

  function list_stored() {
    return { success: true, keys: Array.from(storage.keys()) };
  }

  function version_entity({ key }) {
    const entry = storage.get(key);
    if (!entry) return { success: false, error: "not_found" };
    return { success: true, versions: entry.versions.length };
  }

  function revert_entity({ key, version }) {
    const entry = storage.get(key);
    if (!entry) return { success: false, error: "not_found" };
    if (version < 0 || version >= entry.versions.length)
      return { success: false, error: "invalid_version" };
    entry.versions.splice(version + 1);
    return { success: true };
  }

  const operations = {
    save_entity,
    load_entity,
    delete_stored,
    list_stored,
    version_entity,
    revert_entity,
  };

  for (const [name, fn] of Object.entries(operations)) {
    ctx.register_operation(name, fn);
  }

  return { storage };
}

export function create_provider() {
  const store = new Map();

  function append_version(entity) {
    const id = entity.id;
    const versions = store.get(id) || [];
    versions.push(structuredClone(entity));
    store.set(id, versions);
  }

  function read_versions(id) {
    return (store.get(id) || []).map((v) => structuredClone(v));
  }

  function list_all() {
    return Array.from(store.keys());
  }

  return { append_version, read_versions, list_all };
}

export function deactivate(ctx) {
  ctx.unregister_operations([
    "save_entity",
    "load_entity",
    "delete_stored",
    "list_stored",
    "version_entity",
    "revert_entity",
  ]);
}
