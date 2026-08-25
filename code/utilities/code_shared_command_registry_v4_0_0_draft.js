import {
  gui_action_names,
  keyboard_command_names
} from "./dataset/code_shared_ui_word_datasets_v3_0_0_draft.js";

class command_registry {
  constructor(config = {}) {
    this.config = command_registry.normalize_config(config);
    this.records = new Map();
    this.keyboard_bindings = new Map();
    this.selector_bindings = new Map();
    for (const command of command_registry.normalize_list(config.commands)) {
      const result = this.register_command(command);
      if (!result.ok) throw new Error(result.errors.join("; "));
    }
  }

  register_command(config = {}) {
    const validation = this.validate_command(config);
    if (!validation.ok) return validation;
    const record = command_registry.normalize_command(config, this.config.actor);
    this.records.set(record.id, record);
    for (const binding of record.bindings.keyboard) {
      this.keyboard_bindings.set(command_registry.keyboard_key(binding), record.id);
    }
    for (const binding of record.bindings.selector) {
      this.selector_bindings.set(binding.selector, record.id);
    }
    return command_registry.result(true, record, []);
  }

  validate_command(config = {}) {
    const errors = [];
    if (!config || typeof config !== "object" || Array.isArray(config)) errors.push("command config must be an object");
    const id = config.id || config.action;
    const action = config.action || config.id;
    if (!id) errors.push("command id is required");
    if (!action) errors.push("command action is required");
    if (id && this.records.has(id)) errors.push(`duplicate command id '${id}'`);
    if (action && !this.config.approved_actions.includes(action)) errors.push(`command action '${action}' is not approved`);

    for (const binding of command_registry.normalize_keyboard_bindings(config.keyboard)) {
      if (!binding.combo) errors.push("keyboard combo is required");
      const key = command_registry.keyboard_key(binding);
      if (this.keyboard_bindings.has(key)) errors.push(`duplicate keyboard combo '${binding.combo}'`);
      if (binding.command_name && !keyboard_command_names.includes(binding.command_name)) {
        errors.push(`keyboard command '${binding.command_name}' is not approved`);
      }
    }

    for (const binding of command_registry.normalize_selector_bindings(config.selector)) {
      if (!binding.selector) errors.push("selector is required");
      if (binding.selector && !command_registry.is_valid_selector(binding.selector)) errors.push(`selector '${binding.selector}' is invalid`);
      if (binding.selector && this.selector_bindings.has(binding.selector)) errors.push(`duplicate selector '${binding.selector}'`);
    }

    return command_registry.result(errors.length === 0, { id, action }, errors);
  }

  resolve_command_from_action(config = {}) {
    const action = typeof config === "string" ? config : config.action;
    for (const record of this.records.values()) {
      if (record.action === action) return command_registry.result(true, record, []);
    }
    return command_registry.result(false, null, [`command action '${action}' not found`]);
  }

  resolve_command_from_selector(config = {}) {
    const selector = typeof config === "string" ? config : config.selector;
    const id = this.selector_bindings.get(selector);
    if (!id) return command_registry.result(false, null, [`selector '${selector}' not found`]);
    return command_registry.result(true, this.records.get(id), []);
  }

  resolve_command_from_keyboard(config = {}) {
    const binding = typeof config === "string" ? { combo: config } : config;
    const id = this.keyboard_bindings.get(command_registry.keyboard_key(binding));
    if (!id) return command_registry.result(false, null, [`keyboard combo '${binding.combo}' not found`]);
    return command_registry.result(true, this.records.get(id), []);
  }

  async execute_command(config = {}) {
    const lookup = this.find_command_record(config);
    if (!lookup.ok) return command_registry.result(false, null, lookup.errors);
    const record = lookup.record;
    if (!command_registry.is_callable(record.method)) {
      return command_registry.result(false, null, [`command '${record.id}' has no executable method`]);
    }
    try {
      const data = await record.method(config.payload || {}, record);
      return command_registry.result(true, { command: command_registry.clone_value(record), output: data }, []);
    } catch (error) {
      return command_registry.result(false, null, [error && error.message ? error.message : String(error)]);
    }
  }

  list_commands(config = {}) {
    const records = Array.from(this.records.values()).filter((record) => {
      if (config.scope && record.scope !== config.scope) return false;
      if (config.action && record.action !== config.action) return false;
      return true;
    });
    return command_registry.result(true, records, []);
  }

  resolve_command(config = {}) {
    const lookup = this.find_command_record(config);
    if (!lookup.ok) return command_registry.result(false, null, lookup.errors);
    return command_registry.result(true, lookup.record, []);
  }

  find_command_record(config = {}) {
    if (config.id && this.records.has(config.id)) return { ok: true, record: this.records.get(config.id), errors: [] };
    if (config.action) {
      for (const record of this.records.values()) {
        if (record.action === config.action) return { ok: true, record, errors: [] };
      }
      return { ok: false, record: null, errors: [`command action '${config.action}' not found`] };
    }
    if (config.selector) {
      const id = this.selector_bindings.get(config.selector);
      if (id) return { ok: true, record: this.records.get(id), errors: [] };
      return { ok: false, record: null, errors: [`selector '${config.selector}' not found`] };
    }
    if (config.combo) {
      const id = this.keyboard_bindings.get(command_registry.keyboard_key(config));
      if (id) return { ok: true, record: this.records.get(id), errors: [] };
      return { ok: false, record: null, errors: [`keyboard combo '${config.combo}' not found`] };
    }
    return { ok: false, record: null, errors: ["command reference is required"] };
  }

  static normalize_command(config = {}, actor = "agent_codex_an_app") {
    const id = config.id || config.action;
    return {
      id,
      type: "command_record",
      name: config.name || id,
      action: config.action || id,
      scope: config.scope || "global",
      status: config.status || "active",
      bindings: {
        keyboard: command_registry.normalize_keyboard_bindings(config.keyboard),
        selector: command_registry.normalize_selector_bindings(config.selector)
      },
      method: config.method || null,
      metadata: command_registry.clone_plain_object(config.metadata),
      created_by: config.created_by || actor,
      updated_by: config.updated_by || actor
    };
  }

  static normalize_keyboard_bindings(value) {
    return command_registry.normalize_list(value).map((item) => {
      if (typeof item === "string") return { combo: item, scope: "global" };
      return { combo: item.combo, scope: item.scope || "global", command_name: item.command_name || null };
    });
  }

  static normalize_selector_bindings(value) {
    return command_registry.normalize_list(value).map((item) => {
      if (typeof item === "string") return { selector: item };
      return { selector: item.selector };
    });
  }

  static keyboard_key(binding = {}) {
    return `${binding.scope || "global"}:${String(binding.combo || "").toLowerCase()}`;
  }

  static is_valid_selector(selector) {
    if (typeof selector !== "string" || selector.trim() !== selector || selector.length === 0) return false;
    if (typeof document !== "undefined" && document.querySelector) {
      try {
        document.querySelector(selector);
        return true;
      } catch {
        return false;
      }
    }
    return /^[#.[]?[a-zA-Z0-9_\-:[\]="'.\s>]+$/.test(selector);
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      approved_actions: Array.isArray(config.approved_actions) ? config.approved_actions : gui_action_names
    };
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static clone_plain_object(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return command_registry.clone_value(value);
  }

  static clone_value(value) {
    if (value === undefined || command_registry.is_callable(value)) return value;
    return JSON.parse(JSON.stringify(value));
  }

  static result(ok, data, errors) {
    return { ok, data: command_registry.clone_value(data), errors: errors || [] };
  }

  static is_callable(value) {
    const tag = Object.prototype.toString.call(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]";
  }
}

export { command_registry };
export default command_registry;
