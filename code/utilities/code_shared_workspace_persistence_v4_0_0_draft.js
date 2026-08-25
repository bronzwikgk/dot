class workspace_persistence {
  constructor(config = {}, ports = {}) {
    this.config = workspace_persistence.normalize_config(config);
    this.storage = ports.storage || new memory_storage();
    this.undo_stack = [];
    this.redo_stack = [];
    this.audit_records = [];
  }

  validate_storage_key(config = {}) {
    const key = typeof config === "string" ? config : config.key;
    const ok = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(String(key || ""));
    return workspace_persistence.result(ok, ok ? { type: "storage_record", key } : null, ok ? [] : ["storage key must use snake_path format"]);
  }

  async run_storage_selftest(config = {}) {
    const key = config.key || `${this.config.key}.selftest`;
    const validation = this.validate_storage_key({ key });
    if (!validation.ok) return validation;
    try {
      await this.storage.set_item(key, JSON.stringify({ ok: true }));
      const value = await this.storage.get_item(key);
      await this.storage.remove_item(key);
      const ok = value === JSON.stringify({ ok: true });
      return workspace_persistence.result(ok, { type: "storage_record", key, status: ok ? "ready" : "failed" }, ok ? [] : ["storage selftest failed"]);
    } catch (error) {
      return workspace_persistence.result(false, { type: "storage_record", key, status: "failed" }, [workspace_persistence.error_message(error)]);
    }
  }

  async save_workspace(config = {}) {
    const key = config.key || this.config.key;
    const validation = this.validate_storage_key({ key });
    if (!validation.ok) return validation;
    const state = workspace_persistence.clone_value(config.state || {});
    const record = {
      type: "storage_record",
      key,
      state,
      saved_at: this.config.clock(),
      actor: this.config.actor
    };
    try {
      await this.storage.set_item(key, JSON.stringify(record));
      this.audit("save_workspace", key);
      return workspace_persistence.result(true, record, []);
    } catch (error) {
      return workspace_persistence.result(false, record, [workspace_persistence.error_message(error)]);
    }
  }

  async load_workspace(config = {}) {
    const key = config.key || this.config.key;
    const validation = this.validate_storage_key({ key });
    if (!validation.ok) return validation;
    try {
      const text = await this.storage.get_item(key);
      if (!text) return workspace_persistence.result(true, { type: "storage_record", key, state: null }, []);
      const record = JSON.parse(text);
      this.audit("load_workspace", key);
      return workspace_persistence.result(true, record, []);
    } catch (error) {
      return workspace_persistence.result(false, null, [workspace_persistence.error_message(error)]);
    }
  }

  create_undo_checkpoint(config = {}) {
    const before = workspace_persistence.clone_value(config.before || {});
    const after = workspace_persistence.clone_value(config.after || {});
    const checkpoint = {
      id: config.id || `version_checkpoint_${this.undo_stack.length + 1}`,
      type: "version_checkpoint",
      entity_id: config.entity_id || before.id || after.id || null,
      before,
      after,
      created_at: this.config.clock(),
      actor: this.config.actor
    };
    this.undo_stack.push(checkpoint);
    this.redo_stack = [];
    this.audit("create_undo_checkpoint", checkpoint.entity_id);
    return workspace_persistence.result(true, checkpoint, []);
  }

  undo_change() {
    const checkpoint = this.undo_stack.pop();
    if (!checkpoint) return workspace_persistence.result(false, null, ["undo stack is empty"]);
    this.redo_stack.push(checkpoint);
    const data = {
      type: "undo_record",
      checkpoint_id: checkpoint.id,
      entity_id: checkpoint.entity_id,
      state: workspace_persistence.clone_value(checkpoint.before),
      audit: this.audit("undo_change", checkpoint.entity_id)
    };
    return workspace_persistence.result(true, data, []);
  }

  redo_change() {
    const checkpoint = this.redo_stack.pop();
    if (!checkpoint) return workspace_persistence.result(false, null, ["redo stack is empty"]);
    this.undo_stack.push(checkpoint);
    const data = {
      type: "redo_record",
      checkpoint_id: checkpoint.id,
      entity_id: checkpoint.entity_id,
      state: workspace_persistence.clone_value(checkpoint.after),
      audit: this.audit("redo_change", checkpoint.entity_id)
    };
    return workspace_persistence.result(true, data, []);
  }

  audit(action, entity_id) {
    const record = {
      type: "audit_log",
      action,
      entity_id: entity_id || null,
      actor: this.config.actor,
      created_at: this.config.clock()
    };
    this.audit_records.push(record);
    return workspace_persistence.clone_value(record);
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      key: config.key || "an_app.workspace",
      clock: workspace_persistence.is_callable(config.clock) ? config.clock : () => new Date().toISOString()
    };
  }

  static result(ok, data, errors) {
    return { ok, data: workspace_persistence.clone_value(data), errors: errors || [] };
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static error_message(error) {
    return error && error.message ? error.message : String(error);
  }

  static is_callable(value) {
    const tag = Object.prototype.toString.call(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]";
  }
}

class memory_storage {
  constructor() {
    this.records = new Map();
  }

  async set_item(key, value) {
    this.records.set(key, value);
  }

  async get_item(key) {
    return this.records.has(key) ? this.records.get(key) : null;
  }

  async remove_item(key) {
    this.records.delete(key);
  }
}

export { workspace_persistence, memory_storage };
export default workspace_persistence;
