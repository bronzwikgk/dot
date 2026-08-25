import { action_entity } from "../plugins/code_shared_action_entity_v3_1_0_draft.js";

const policy_type_names = [
  "cache_policy", "storage_policy", "security_policy", "routing_policy",
  "naming_policy", "create_policy"
];

const cache_scope_names = ["shell", "workspace", "product_surface", "template", "user"];

class policy_cache {
  constructor(config = {}, ports = {}) {
    this.config = policy_cache.normalize_config(config);
    this.entities = ports.entities || new action_entity("shell_cache_entities", {
      actor: this.config.actor,
      allow_unknown_types: true,
      allow_unknown_relationship_types: true,
      allow_unknown_operations: true
    });
    this.audit_records = [];
  }

  validate_policy(config = {}) {
    const policy = config.policy || config;
    const errors = [];
    if (!policy || typeof policy !== "object" || Array.isArray(policy)) errors.push("policy must be an object");
    if (policy && !policy.id) errors.push("policy id is required");
    if (policy && policy.id && !policy_cache.is_snake_path(policy.id)) errors.push("policy id must use snake_path format");
    if (policy && !policy.type) errors.push("policy type is required");
    if (policy && policy.type && !this.config.policy_type_names.includes(policy.type)) errors.push(`policy type '${policy.type}' is not approved`);
    if (policy && policy.scope && !this.config.cache_scope_names.includes(policy.scope)) errors.push(`policy scope '${policy.scope}' is not approved`);
    if (policy && policy.max_entries !== undefined && (!Number.isInteger(policy.max_entries) || policy.max_entries < 1)) errors.push("max_entries must be a positive integer");
    return policy_cache.result(errors.length === 0, policy_cache.clone_value(policy), errors);
  }

  validate_policy_set(config = {}) {
    const policies = policy_cache.normalize_list(config.policies);
    const errors = [];
    const out = [];
    for (const policy of policies) {
      const result = this.validate_policy({ policy });
      if (!result.ok) errors.push(...result.errors);
      else out.push(result.data);
    }
    return policy_cache.result(errors.length === 0, out, errors);
  }

  async create_shell_cache(config = {}) {
    const policies = policy_cache.normalize_list(config.policies || this.config.policies);
    const validation = this.validate_policy_set({ policies });
    if (!validation.ok) return validation;
    const created = await this.entities.create({
      id: config.id || "shell_cache",
      type: "shell_cache",
      name: config.name || "shell_cache",
      status: "active",
      data: { entries: [], max_entries: this.max_entries(validation.data), allowed_scopes: this.allowed_scopes(validation.data) },
      policies: validation.data,
      operations: ["create", "read", "update", "delete", "query"]
    });
    this.audit_cache({ action: "create_shell_cache", entity_id: created.data.id });
    return policy_cache.result(true, created.data, []);
  }

  async write_cache_entry(config = {}) {
    const scope = config.scope || "shell";
    if (!this.config.cache_scope_names.includes(scope)) return policy_cache.result(false, null, [`cache scope '${scope}' is not approved`]);
    if (!config.key || !policy_cache.is_snake_path(config.key)) return policy_cache.result(false, null, ["cache key must use snake_path format"]);
    const cache = await this.ensure_cache(config.cache_id || "shell_cache");
    const entries = policy_cache.normalize_list(cache.data.entries).filter((entry) => !(entry.scope === scope && entry.key === config.key));
    entries.push({ type: "cache_entry", scope, key: config.key, value: policy_cache.clone_value(config.value), updated_at: this.config.clock() });
    const max_entries = cache.data.max_entries || this.config.max_entries;
    while (entries.length > max_entries) entries.shift();
    const updated = await this.entities.update(cache.id, { data: { ...cache.data, entries } });
    this.audit_cache({ action: "write_cache_entry", entity_id: `${scope}.${config.key}` });
    return policy_cache.result(true, updated.data, []);
  }

  async read_cache_entry(config = {}) {
    const cache = await this.ensure_cache(config.cache_id || "shell_cache");
    const entry = policy_cache.normalize_list(cache.data.entries).find((item) => item.scope === (config.scope || "shell") && item.key === config.key);
    return policy_cache.result(Boolean(entry), entry || null, entry ? [] : ["cache entry not found"]);
  }

  async remove_cache_entry(config = {}) {
    const cache = await this.ensure_cache(config.cache_id || "shell_cache");
    const entries = policy_cache.normalize_list(cache.data.entries).filter((entry) => !(entry.scope === (config.scope || "shell") && entry.key === config.key));
    const updated = await this.entities.update(cache.id, { data: { ...cache.data, entries } });
    this.audit_cache({ action: "remove_cache_entry", entity_id: `${config.scope || "shell"}.${config.key}` });
    return policy_cache.result(true, updated.data, []);
  }

  audit_cache(config = {}) {
    const record = {
      type: "audit_log",
      action: config.action || "audit_cache",
      entity_id: config.entity_id || null,
      actor: this.config.actor,
      created_at: this.config.clock()
    };
    this.audit_records.push(record);
    return policy_cache.result(true, record, []);
  }

  async ensure_cache(cache_id) {
    try {
      return await this.entities.read(cache_id);
    } catch {
      const created = await this.create_shell_cache({ id: cache_id });
      return created.data;
    }
  }

  max_entries(policies) {
    const cache_policy = policies.find((policy) => policy.type === "cache_policy" && policy.max_entries);
    return cache_policy ? cache_policy.max_entries : this.config.max_entries;
  }

  allowed_scopes(policies) {
    const cache_policy = policies.find((policy) => policy.type === "cache_policy" && Array.isArray(policy.allowed_scopes));
    return cache_policy ? cache_policy.allowed_scopes : this.config.cache_scope_names;
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      max_entries: config.max_entries || 50,
      policies: policy_cache.normalize_list(config.policies),
      policy_type_names: Array.isArray(config.policy_type_names) ? config.policy_type_names : policy_type_names,
      cache_scope_names: Array.isArray(config.cache_scope_names) ? config.cache_scope_names : cache_scope_names,
      clock: policy_cache.is_callable(config.clock) ? config.clock : () => new Date().toISOString()
    };
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static result(ok, data, errors) {
    return { ok, data: policy_cache.clone_value(data), errors: errors || [] };
  }

  static is_snake_path(value) {
    return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(String(value || ""));
  }

  static is_callable(value) {
    const tag = Object.prototype.toString.call(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]";
  }
}

export { policy_cache, policy_type_names, cache_scope_names };
export default policy_cache;
