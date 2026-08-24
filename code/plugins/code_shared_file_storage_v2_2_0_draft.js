/**
 * @entity file_storage
 *
 * @meta
 * project: an_app
 * file_name: src/plugins/providers/storage/file_storage/index.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * Local filesystem storage provider reading and writing JSON files
 *
 * @purpose_and_problem_statement
 * Persists entities to the local filesystem as JSON with append-only version history
 *
 * @usage
 * ```js
 * const store = create_provider("./data");
 * store.append_version({ id: "item1", data: "hello" });
 * const versions = store.read_versions("item1");
 * ```
 *
 * @timing
 * Runs when plugin is activated; disk I/O performed on each save, load, or list operation
 *
 * @scope_boundaries
 * in_scope: local filesystem JSON storage with version history and directory management
 * out_of_scope: remote storage, database backends, binary file formats
 *
 * @dependencies
 * - node:fs (readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync)
 * - node:path (join, dirname)
 *
 * @keywords
 * storage, filesystem, json, versioning, persistent, local
 *
 * @invariants
 * - Each entity is stored as a separate JSON file keyed by its key
 * - Version history is stored in a _versions subdirectory per key
 * - Versions are append-only; revert truncates later versions
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";

export const manifest = {
  id: "provider_storage_file",
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
  const base_path = ctx.config?.base_path || "./data";

  function _ensure_dir(filePath) {
    const dir = dirname(filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  function _version_path(key) {
    return join(base_path, "_versions", `${key}.json`);
  }

  function _entity_path(key) {
    return join(base_path, `${key}.json`);
  }

  function _read_versions(key) {
    const vp = _version_path(key);
    if (!existsSync(vp)) return [];
    return JSON.parse(readFileSync(vp, "utf-8"));
  }

  function _write_versions(key, versions) {
    const vp = _version_path(key);
    _ensure_dir(vp);
    writeFileSync(vp, JSON.stringify(versions, null, 2), "utf-8");
  }

  function save_entity({ key, entity }) {
    const versions = _read_versions(key);
    versions.push(structuredClone(entity));
    _write_versions(key, versions);
    const ep = _entity_path(key);
    _ensure_dir(ep);
    writeFileSync(ep, JSON.stringify(entity, null, 2), "utf-8");
    return { success: true };
  }

  function load_entity({ key, version }) {
    const versions = _read_versions(key);
    if (versions.length === 0) return { success: false, error: "not_found" };
    const idx = version != null ? version : versions.length - 1;
    if (idx < 0 || idx >= versions.length)
      return { success: false, error: "invalid_version" };
    return { success: true, entity: structuredClone(versions[idx]) };
  }

  function delete_stored({ key }) {
    const ep = _entity_path(key);
    const vp = _version_path(key);
    if (existsSync(ep)) unlinkSync(ep);
    if (existsSync(vp)) unlinkSync(vp);
    return { success: true };
  }

  function list_stored() {
    if (!existsSync(base_path)) return { success: true, keys: [] };
    const keys = readdirSync(base_path)
      .filter((f) => f.endsWith(".json") && f !== "_versions")
      .map((f) => f.replace(/\.json$/, ""));
    return { success: true, keys };
  }

  function version_entity({ key }) {
    const versions = _read_versions(key);
    if (versions.length === 0) return { success: false, error: "not_found" };
    return { success: true, versions: versions.length };
  }

  function revert_entity({ key, version }) {
    const versions = _read_versions(key);
    if (versions.length === 0) return { success: false, error: "not_found" };
    if (version < 0 || version >= versions.length)
      return { success: false, error: "invalid_version" };
    const truncated = versions.slice(0, version + 1);
    _write_versions(key, truncated);
    const ep = _entity_path(key);
    _ensure_dir(ep);
    writeFileSync(ep, JSON.stringify(truncated[version], null, 2), "utf-8");
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

  return { base_path };
}

export function create_provider(base_path = "./data") {
  function _version_path(id) {
    return join(base_path, "_versions", `${id}.json`);
  }

  function _ensure_dir(filePath) {
    const dir = dirname(filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  function _read_versions(id) {
    const vp = _version_path(id);
    if (!existsSync(vp)) return [];
    return JSON.parse(readFileSync(vp, "utf-8"));
  }

  function _write_versions(id, versions) {
    const vp = _version_path(id);
    _ensure_dir(vp);
    writeFileSync(vp, JSON.stringify(versions, null, 2), "utf-8");
  }

  function append_version(entity) {
    const id = entity.id;
    const versions = _read_versions(id);
    versions.push(structuredClone(entity));
    _write_versions(id, versions);
  }

  function read_versions(id) {
    return _read_versions(id).map((v) => structuredClone(v));
  }

  function list_all() {
    const vpDir = join(base_path, "_versions");
    if (!existsSync(vpDir)) return [];
    return readdirSync(vpDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
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
