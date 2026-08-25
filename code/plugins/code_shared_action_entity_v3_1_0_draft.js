import { entity_validator } from "../utilities/code_shared_entity_validator_v3_0_0_draft.js";
import { entity_registry } from "../utilities/code_shared_entity_registry_v3_0_0_draft.js";
import { lifecycle_statuses } from "../utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js";

class memory_driver {
  constructor(name = "entity") {
    this.name = name;
    this.records = new Map();
    this.id_counter = 0;
  }

  generate_id(prefix = this.name) {
    this.id_counter += 1;
    return `${prefix}_${this.id_counter}`;
  }

  get_timestamp() {
    return new Date().toISOString();
  }

  async create(id, data) {
    this.records.set(id, clone_value(data));
    return { ok: true, id };
  }

  async read(id) {
    if (!this.records.has(id)) return null;
    return clone_value(this.records.get(id));
  }

  async update(id, data) {
    this.records.set(id, clone_value(data));
    return { ok: true, id };
  }

  async delete(id) {
    this.records.delete(id);
    return { ok: true, id };
  }

  async query(filter = {}) {
    const records = Array.from(this.records.values()).filter((record) => matches_filter(record, filter));
    return { ok: true, data: records.map(clone_value) };
  }
}

class action_entity {
  constructor(name = "entities", config = {}, driver = null, options = {}) {
    this.name = name;
    this.config = normalize_config(config);
    this.driver = normalize_driver(driver || new memory_driver(name), name);
    this.registry = options.registry || new entity_registry(this.config.registry || {});
    this.validator = options.validator || new entity_validator({
      allow_unknown_types: this.config.allow_unknown_types,
      allow_unknown_relationship_types: this.config.allow_unknown_relationship_types,
      relationship_types: this.config.relationship_types,
      lifecycle_statuses
    });
    this.cache = new Map();
    this.cache_limit = options.cache_limit || this.config.cache_limit || 500;
  }

  normalize_entity(input = {}) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new Error("entity input must be an object");
    }
    if (input.dependencies && !this.config.allow_legacy_dependencies) {
      throw new Error("legacy dependencies input is disabled; use relationships with depends_on");
    }
    const banned_result = this.validator.validate_no_banned_words([input.id, input.type, input.name, ...normalize_list(input.operations).map((operation) => typeof operation === "string" ? operation : operation.name)]);
    if (!banned_result.ok) throw new Error("entity input contains banned vocabulary: " + banned_result.found.join(", "));
    const timestamp = this.driver.get_timestamp();
    const entity = {
      id: input.id || this.driver.generate_id(input.type || "entity"),
      type: input.type || this.config.default_type || "utility",
      name: input.name || input.id || "unnamed_entity",
      version: input.version || "0.1.0",
      status: input.status || "draft",
      config: clone_plain_object(input.config),
      attributes: clone_plain_object(input.attributes),
      parameters: clone_plain_object(input.parameters),
      relationships: normalize_relationships(input.relationships, input.dependencies),
      policies: normalize_list(input.policies),
      contracts: normalize_list(input.contracts),
      operations: normalize_list(input.operations),
      tests: normalize_list(input.tests),
      docs: normalize_list(input.docs),
      logs: normalize_list(input.logs),
      tags: normalize_list(input.tags),
      metadata: clone_plain_object(input.metadata),
      created_at: input.created_at || timestamp,
      updated_at: input.updated_at || input.created_at || timestamp,
      created_by: input.created_by || this.config.actor || "system",
      updated_by: input.updated_by || this.config.actor || "system"
    };
    return entity;
  }

  validate_entity(entity) {
    const result = this.validator.validate_entity(entity, this.registry);
    if (!result.ok) {
      throw new Error(result.errors.join("; "));
    }
    return result;
  }

  validate_input(input) {
    return this.validator.validate_input(input, this.registry);
  }

  validate_output(output) {
    return this.validator.validate_output(output, this.registry);
  }

  async create(data, options = {}) {
    const entity = this.normalize_entity(data);
    this.validate_entity(entity);
    const result = await this.driver.create(entity.id, entity, options);
    this.touch_cache(entity.id, entity);
    return { ...result, data: with_derived_fields(entity) };
  }

  async read(id, options = {}) {
    if (this.cache.has(id)) {
      const cached = this.cache.get(id);
      this.touch_cache(id, cached);
      return with_derived_fields(cached);
    }
    const entity = await this.driver.read(id, options);
    if (!entity) throw new Error(`${this.name} '${id}' not found`);
    this.touch_cache(id, entity);
    return with_derived_fields(entity);
  }

  async update(id, data, options = {}) {
    const existing = await this.read(id, options);
    const patch = normalize_update_patch(data || {});
    const merged_input = deep_merge(strip_derived_fields(existing), patch);
    const merged = this.normalize_entity(merged_input);
    merged.id = existing.id;
    merged.created_at = existing.created_at;
    merged.created_by = existing.created_by;
    merged.updated_at = this.driver.get_timestamp();
    merged.updated_by = (data && data.updated_by) || this.config.actor || "system";
    this.validate_entity(merged);
    const result = await this.driver.update(id, merged, options);
    this.touch_cache(id, merged);
    return { ...result, data: with_derived_fields(merged) };
  }

  async delete(id, options = {}) {
    this.cache.delete(id);
    return this.driver.delete(id, options);
  }

  async query(filter = {}, options = {}) {
    const result = await this.driver.query(filter, options);
    const records = Array.isArray(result) ? result : result.data || [];
    const expanded = records.map(with_derived_fields);
    for (const record of expanded) this.touch_cache(record.id, record);
    return Array.isArray(result) ? expanded.map(clone_value) : { ...result, data: expanded.map(clone_value) };
  }

  async create_batch(items = []) {
    if (!Array.isArray(items)) throw new Error("create_batch expects an array");
    const out = [];
    for (const item of items) out.push(await this.create(item));
    return out;
  }

  async update_batch(items = []) {
    if (!Array.isArray(items)) throw new Error("update_batch expects an array");
    const out = [];
    for (const item of items) out.push(await this.update(item.id, item));
    return out;
  }

  async query_batch(filters = []) {
    if (!Array.isArray(filters)) throw new Error("query_batch expects an array");
    const out = [];
    for (const filter of filters) out.push(await this.query(filter));
    return out;
  }

  async set_status(id, status) {
    this.validator.assert_status(status);
    return this.update(id, { status });
  }

  async draft(id) { return this.set_status(id, "draft"); }
  async activate(id) { return this.set_status(id, "active"); }
  async deprecate(id) { return this.set_status(id, "deprecated"); }
  async archive(id) { return this.set_status(id, "archived"); }

  async link_entities(from_id, to_id, type, attributes = {}) {
    this.validator.assert_relationship_type(type);
    const source = await this.read(from_id);
    const relationship = { type, to: to_id, attributes: clone_plain_object(attributes) };
    const relationship_result = this.validator.validate_relationship(relationship);
    if (!relationship_result.ok) throw new Error(relationship_result.errors.join("; "));
    const relationships = source.relationships.filter((item) => !(item.type === type && item.to === to_id));
    relationships.push(relationship);
    return this.update(from_id, { relationships });
  }

  async add_relationship(id, relationship = {}) {
    return this.link_entities(id, relationship.to, relationship.type, relationship.attributes || {});
  }

  async unlink_entities(from_id, to_id, type = null) {
    const source = await this.read(from_id);
    const relationships = source.relationships.filter((item) => {
      if (item.to !== to_id) return true;
      if (type && item.type !== type) return true;
      return false;
    });
    return this.update(from_id, { relationships });
  }

  async remove_relationship(id, relationship = {}) {
    return this.unlink_entities(id, relationship.to, relationship.type || null);
  }

  async get_relationships(id, type = null) {
    const entity = await this.read(id);
    return entity.relationships.filter((item) => !type || item.type === type).map(clone_value);
  }

  async get_dependencies(id) {
    const entity = await this.read(id);
    return relationships_to_dependencies(entity.relationships);
  }

  async get_dependents(id) {
    const result = await this.query();
    return result.data.filter((entity) => {
      const relationships = entity.relationships || [];
      return relationships.some((item) => item.type === "depends_on" && item.to === id);
    });
  }

  async add_policy(id, policy) {
    const entity = await this.read(id);
    return this.update(id, { policies: unique_list([...entity.policies, policy]) });
  }

  async remove_policy(id, policy) {
    const entity = await this.read(id);
    return this.update(id, { policies: entity.policies.filter((item) => item !== policy) });
  }

  async add_contract(id, contract) {
    const entity = await this.read(id);
    return this.update(id, { contracts: unique_list([...entity.contracts, contract]) });
  }

  async add_operation(id, operation) {
    const entity = await this.read(id);
    const operation_name = typeof operation === "string" ? operation : operation.name;
    this.validator.assert_operation_name(operation_name);
    return this.update(id, { operations: unique_list([...entity.operations, operation]) });
  }

  diff_entities(before, after) {
    const changes = [];
    const keys = unique_list([...Object.keys(before || {}), ...Object.keys(after || {})]);
    for (const key of keys) {
      if (JSON.stringify(before ? before[key] : undefined) !== JSON.stringify(after ? after[key] : undefined)) {
        changes.push({ field: key, before: clone_value(before ? before[key] : undefined), after: clone_value(after ? after[key] : undefined) });
      }
    }
    return changes;
  }

  bump_version(entity, level = "patch") {
    const parts = String(entity.version || "0.0.0").split(".").map((part) => Number(part) || 0);
    if (level === "major") return `${parts[0] + 1}.0.0`;
    if (level === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }

  async validate_graph() {
    const result = await this.query();
    const entities = result.data;
    const ids = new Set(entities.map((entity) => entity.id));
    const errors = [];
    for (const entity of entities) {
      for (const relationship of entity.relationships || []) {
        if (!ids.has(relationship.to)) errors.push(`${entity.id} has missing relationship target ${relationship.to}`);
      }
    }
    const cycles = detect_cycles(entities);
    for (const cycle of cycles) errors.push(`cycle detected: ${cycle.join(" -> ")}`);
    return { ok: errors.length === 0, errors, cycles };
  }

  export_entity(entity) {
    return JSON.stringify(entity, null, 2);
  }

  async import_entity(text, options = {}) {
    const entity = this.normalize_entity(JSON.parse(text));
    this.validate_entity(entity);
    const result = await this.driver.create(entity.id, entity, options);
    this.touch_cache(entity.id, entity);
    return { ...result, data: with_derived_fields(entity) };
  }

  touch_cache(key, value) {
    if (!key) return;
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, clone_value(value));
    if (this.cache.size > this.cache_limit) {
      const oldest_key = this.cache.keys().next().value;
      this.cache.delete(oldest_key);
    }
  }
}

const normalize_config = (config = {}) => {
  return {
    ...config,
    allow_unknown_types: Boolean(config.allow_unknown_types),
    allow_unknown_relationship_types: Boolean(config.allow_unknown_relationship_types),
    allow_legacy_dependencies: Boolean(config.allow_legacy_dependencies)
  };
};

const normalize_driver = (driver, name) => {
  if (!driver) return new memory_driver(name);
  return driver;
};

const normalize_update_patch = (data) => {
  const patch = { ...data };
  if (Object.prototype.hasOwnProperty.call(patch, "dependencies")) delete patch.dependencies;
  return patch;
};

const strip_derived_fields = (data) => {
  const out = { ...data };
  if (Object.prototype.hasOwnProperty.call(out, "dependencies")) delete out.dependencies;
  return out;
};

const normalize_list = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value.map(clone_value) : [clone_value(value)];
};

const clone_plain_object = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return clone_value(value);
};

const normalize_relationships = (relationships, dependencies) => {
  const out = normalize_list(relationships);
  for (const dependency of normalize_list(dependencies)) {
    if (!out.some((item) => item && item.type === "depends_on" && item.to === dependency)) {
      out.push({ type: "depends_on", to: dependency, attributes: {} });
    }
  }
  return out;
};

const relationships_to_dependencies = (relationships) => {
  return unique_list(normalize_list(relationships).filter((item) => item && item.type === "depends_on").map((item) => item.to));
};

const with_derived_fields = (entity) => {
  const out = clone_value(entity);
  out.dependencies = relationships_to_dependencies(out.relationships);
  return out;
};

const clone_value = (value) => {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
};

const matches_filter = (record, filter = {}) => {
  return Object.entries(filter).every(([key, value]) => {
    if (key === "tag") return (record.tags || []).includes(value);
    if (key === "policy") return (record.policies || []).includes(value);
    if (key === "contract") return (record.contracts || []).includes(value);
    if (key === "dependency") return relationships_to_dependencies(record.relationships).includes(value);
    if (key === "relationship") return (record.relationships || []).some((item) => item.type === value || item.to === value);
    return record[key] === value;
  });
};

const deep_merge = (base, patch) => {
  const out = clone_value(base || {});
  for (const [key, value] of Object.entries(patch || {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && out[key] && typeof out[key] === "object" && !Array.isArray(out[key])) {
      out[key] = deep_merge(out[key], value);
    } else {
      out[key] = clone_value(value);
    }
  }
  return out;
};

const unique_list = (items) => {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = JSON.stringify(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
};

const detect_cycles = (entities) => {
  const graph = new Map();
  for (const entity of entities) {
    graph.set(entity.id, [
      ...(entity.relationships || []).filter((item) => item.type === "depends_on").map((item) => item.to)
    ]);
  }
  const cycles = [];
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const visit = (id) => {
    if (visiting.has(id)) {
      const start = stack.indexOf(id);
      cycles.push([...stack.slice(start), id]);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    stack.push(id);
    for (const next of graph.get(id) || []) {
      if (graph.has(next)) visit(next);
    }
    stack.pop();
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of graph.keys()) visit(id);
  return cycles;
};

export { action_entity, memory_driver };
export default action_entity;
