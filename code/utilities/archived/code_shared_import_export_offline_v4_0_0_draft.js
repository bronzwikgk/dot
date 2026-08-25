import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const allowed_import_formats = ["json", "markdown"];
const allowed_export_formats = ["json", "markdown"];
const executable_cell_types = ["code"];
const blocked_asset_patterns = [
  "https://", "http://", "cdn.", "unpkg.com", "jsdelivr.net",
  "cdnjs.cloudflare.com"
];

class import_export_offline {
  constructor(config = {}) {
    this.config = import_export_offline.normalize_config(config);
  }

  export_workspace(config = {}) {
    const format = config.format || "json";
    if (!allowed_export_formats.includes(format)) {
      return import_export_offline.result(false, null, [`export format '${format}' is not approved`]);
    }
    const state = import_export_offline.clone_plain_object(config.state);
    const record = {
      type: "export_record",
      format,
      exported_at: this.config.clock(),
      state
    };
    const content = format === "json" ? JSON.stringify(record, null, 2) : import_export_offline.to_markdown(record);
    return import_export_offline.result(true, { ...record, content }, []);
  }

  import_workspace(config = {}) {
    const validation = this.validate_import(config);
    if (!validation.ok) return validation;
    const record = validation.data.record;
    return import_export_offline.result(true, {
      type: "import_record",
      format: validation.data.format,
      state: record.state,
      imported_at: this.config.clock(),
      requires_confirmation: this.confirm_executable_import({ state: record.state }).data.requires_confirmation
    }, []);
  }

  validate_import(config = {}) {
    const format = config.format || "json";
    const content = config.content || "";
    const errors = [];
    if (!allowed_import_formats.includes(format)) errors.push(`import format '${format}' is not approved`);
    if (!content || typeof content !== "string") errors.push("import content is required");
    if (errors.length > 0) return import_export_offline.result(false, null, errors);
    if (format !== "json") return import_export_offline.result(true, { format, record: { state: { content } } }, []);
    try {
      const record = JSON.parse(content);
      if (!record || typeof record !== "object" || Array.isArray(record)) return import_export_offline.result(false, null, ["import record must be an object"]);
      if (!record.state || typeof record.state !== "object" || Array.isArray(record.state)) return import_export_offline.result(false, null, ["import state must be an object"]);
      const confirmation = this.confirm_executable_import({ state: record.state, confirmed: config.confirmed });
      if (!confirmation.ok) return confirmation;
      return import_export_offline.result(true, { format, record }, []);
    } catch (error) {
      return import_export_offline.result(false, null, [import_export_offline.error_message(error)]);
    }
  }

  confirm_executable_import(config = {}) {
    const state = config.state || {};
    const cells = import_export_offline.normalize_list(state.cells);
    const executable_cells = cells.filter((cell) => executable_cell_types.includes(cell.cell_type || cell.type));
    if (executable_cells.length > 0 && config.confirmed !== true) {
      return import_export_offline.result(false, {
        type: "executable_import_confirmation",
        requires_confirmation: true,
        cell_ids: executable_cells.map((cell) => cell.id || "unknown_cell")
      }, ["executable cells require confirmation"]);
    }
    return import_export_offline.result(true, {
      type: "executable_import_confirmation",
      requires_confirmation: executable_cells.length > 0,
      cell_ids: executable_cells.map((cell) => cell.id || "unknown_cell")
    }, []);
  }

  validate_asset_inventory(config = {}) {
    const assets = import_export_offline.normalize_list(config.assets);
    const errors = [];
    for (const asset of assets) {
      const path = typeof asset === "string" ? asset : asset.path;
      if (!path) {
        errors.push("asset path is required");
        continue;
      }
      const lower = String(path).toLowerCase();
      for (const pattern of blocked_asset_patterns) {
        if (lower.includes(pattern)) errors.push(`asset '${path}' uses blocked remote reference '${pattern}'`);
      }
    }
    return import_export_offline.result(errors.length === 0, {
      type: "asset_record",
      count: assets.length,
      offline_ready: errors.length === 0
    }, errors);
  }

  create_local_server(config = {}) {
    const port = Number(config.port || this.config.port);
    const root = resolve(config.root || this.config.root);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      return import_export_offline.result(false, null, ["port must be an integer from 1 to 65535"]);
    }
    const server = createServer(async (request, response) => {
      const requested_path = normalize(decodeURIComponent((request.url || "/").split("?")[0]));
      const relative_path = requested_path === "\\" || requested_path === "/" ? this.config.entry_file : requested_path.replace(/^[/\\]+/, "");
      const file_path = resolve(join(root, relative_path));
      response.setHeader("Cache-Control", "no-store");
      if (!file_path.startsWith(root)) {
        response.statusCode = 403;
        response.end("forbidden");
        return;
      }
      try {
        const body = await readFile(file_path);
        response.setHeader("Content-Type", import_export_offline.content_type(file_path));
        response.end(body);
      } catch {
        response.statusCode = 404;
        response.end("not found");
      }
    });
    return import_export_offline.result(true, {
      type: "local_server_record",
      port,
      root,
      no_cache_header: "no-store",
      server
    }, []);
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      port: config.port || 4174,
      root: config.root || process.cwd(),
      entry_file: config.entry_file || "index.html",
      clock: import_export_offline.is_callable(config.clock) ? config.clock : () => new Date().toISOString()
    };
  }

  static to_markdown(record) {
    return `# workspace_export\n\n\`\`\`json\n${JSON.stringify(record.state, null, 2)}\n\`\`\`\n`;
  }

  static content_type(file_path) {
    const extension = extname(file_path).toLowerCase();
    if (extension === ".html") return "text/html; charset=utf-8";
    if (extension === ".css") return "text/css; charset=utf-8";
    if (extension === ".js") return "text/javascript; charset=utf-8";
    if (extension === ".json") return "application/json; charset=utf-8";
    return "text/plain; charset=utf-8";
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static clone_plain_object(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return import_export_offline.clone_value(value);
  }

  static clone_value(value) {
    if (value === undefined || value === null) return value;
    if (value && import_export_offline.is_callable(value.listen)) return "[local_server]";
    if (value && value.server && import_export_offline.is_callable(value.server.listen)) return value;
    return JSON.parse(JSON.stringify(value));
  }

  static result(ok, data, errors) {
    return { ok, data: import_export_offline.clone_value(data), errors: errors || [] };
  }

  static error_message(error) {
    return error && error.message ? error.message : String(error);
  }

  static is_callable(value) {
    const tag = Object.prototype.toString.call(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]";
  }
}

export {
  import_export_offline,
  allowed_import_formats,
  allowed_export_formats,
  executable_cell_types,
  blocked_asset_patterns
};
export default import_export_offline;
