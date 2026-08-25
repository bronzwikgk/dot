import { existsSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

class project_inventory {
  constructor(config = {}) {
    this.config = project_inventory.normalize_config(config);
  }

  anchor_config_path(config = {}) {
    const base_path = resolve(config.base_path || this.config.base_path);
    const input_path = config.path || "";
    if (!input_path || typeof input_path !== "string") {
      return project_inventory.result(false, null, ["path is required"]);
    }
    const resolved_path = resolve(base_path, input_path);
    const relation = relative(base_path, resolved_path);
    if (relation.startsWith("..") || relation === "..") {
      return project_inventory.result(false, null, ["path must stay inside base_path"]);
    }
    return project_inventory.result(true, {
      type: "config_path_record",
      base_path,
      input_path,
      resolved_path,
      relative_path: relation.split(sep).join("/")
    }, []);
  }

  validate_manifest_records(config = {}) {
    const base_path = resolve(config.base_path || this.config.base_path);
    const records = project_inventory.normalize_list(config.records);
    const errors = [];
    const out = [];
    const seen = new Set();
    for (const record of records) {
      const validation = this.validate_manifest_record({ ...record, base_path });
      if (!validation.ok) errors.push(...validation.errors);
      else out.push(validation.data);
      if (record && record.id) {
        if (seen.has(record.id)) errors.push(`duplicate manifest id '${record.id}'`);
        seen.add(record.id);
      }
    }
    return project_inventory.result(errors.length === 0, out, errors);
  }

  validate_manifest_record(config = {}) {
    const errors = [];
    if (!config.id) errors.push("manifest id is required");
    if (config.id && !project_inventory.is_snake_path(config.id)) errors.push(`manifest id '${config.id}' must use snake_path format`);
    if (!config.path) errors.push("manifest path is required");
    const anchored = config.path ? this.anchor_config_path({ base_path: config.base_path, path: config.path }) : { ok: false, errors: [] };
    if (config.path && !anchored.ok) errors.push(...anchored.errors);
    const resolved_path = anchored.ok ? anchored.data.resolved_path : null;
    const exists = resolved_path ? existsSync(resolved_path) : false;
    if (config.required !== false && !exists) errors.push(`manifest path '${config.path}' is stale`);
    return project_inventory.result(errors.length === 0, {
      type: "manifest_record",
      id: config.id || null,
      path: config.path || null,
      resolved_path,
      exists,
      status: exists ? "active" : "stale"
    }, errors);
  }

  create_docs_route(config = {}) {
    const id = config.id || "";
    const path = config.path || "";
    const title = config.title || id;
    const anchored = this.anchor_config_path({ base_path: config.base_path || this.config.base_path, path });
    if (!anchored.ok) return anchored;
    if (!id || !project_inventory.is_snake_path(id)) {
      return project_inventory.result(false, null, ["docs route id must use snake_path format"]);
    }
    const hash = `#${id.replace(/\./g, "-")}`;
    return project_inventory.result(true, {
      type: "docs_route",
      id,
      title,
      path: anchored.data.relative_path,
      hash,
      href: `${anchored.data.relative_path}${hash}`
    }, []);
  }

  validate_docs_routes(config = {}) {
    const routes = project_inventory.normalize_list(config.routes);
    const errors = [];
    const out = [];
    const hashes = new Set();
    for (const route of routes) {
      const created = this.create_docs_route(route);
      if (!created.ok) {
        errors.push(...created.errors);
        continue;
      }
      if (hashes.has(created.data.hash)) errors.push(`duplicate docs route hash '${created.data.hash}'`);
      hashes.add(created.data.hash);
      out.push(created.data);
    }
    return project_inventory.result(errors.length === 0, out, errors);
  }

  create_inventory_report(config = {}) {
    const manifest = this.validate_manifest_records(config);
    const routes = this.validate_docs_routes({ routes: config.docs_routes || [] });
    const errors = [...manifest.errors, ...routes.errors];
    return project_inventory.result(errors.length === 0, {
      type: "inventory_report",
      manifest_records: manifest.data || [],
      docs_routes: routes.data || [],
      stale_count: (manifest.data || []).filter((record) => record.status === "stale").length
    }, errors);
  }

  static normalize_config(config = {}) {
    return {
      base_path: resolve(config.base_path || process.cwd())
    };
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static result(ok, data, errors) {
    return { ok, data: project_inventory.clone_value(data), errors: errors || [] };
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static is_snake_path(value) {
    return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(String(value || ""));
  }
}

export { project_inventory };
export default project_inventory;
