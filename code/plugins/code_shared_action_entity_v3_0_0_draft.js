/**
 * @entity action_entity
 * @meta project: shared | file_name: code_shared_action_entity_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide the storable entity surface: create, read, update, delete, query with an lru cache and schema validation.
 * @purpose_and_problem_statement every ontology type inherits storable; entities need one driver-backed crud surface so plugins never hand-roll persistence.
 * @usage const users = new action_entity("users", { schema }, new memory_driver()); await users.create({ name: "x" });
 * @timing instantiated by plugins at activation for their own collections.
 * @scope_boundaries in_scope: crud, query passthrough, lru cache, schema field validation. out_of_scope: link traversal, trait gating, transport drivers other than the built-in memory driver.
 * @dependencies none (driver injected; memory_driver included for standalone use).
 * @keywords entity, crud, cache, storage
 * @invariants cached entries are always the latest written payload; cache never exceeds its limit; updatedAt is refreshed on every write.
 * @changelog - 2026-08-24: 3.0.0: promoted action_entity_v4.0.0 to shared class form; global driver injection hack removed in favor of constructor injection; built-in memory_driver added so the entity is self-sufficient without a storage plugin
 */
class memory_driver {
  constructor(name) {
    this.name = name || 'memory';
    this.records = new Map();
    this.idCounter = 0;
  }

  generateId() {
    this.idCounter += 1;
    return `${this.name}_${this.idCounter}`;
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  async create(id, data) {
    this.records.set(id, { ...data });
    return { ok: true, id };
  }

  async read(id) {
    const record = this.records.get(id);
    if (!record) return null;
    return { ...record };
  }

  async update(id, data) {
    this.records.set(id, { ...data });
    return { ok: true, id };
  }

  async delete(id) {
    this.records.delete(id);
    return { ok: true, id };
  }

  async query(filter = {}) {
    let records = Array.from(this.records.values());
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      records = records.filter(record => keys.every(key => record[key] === filter[key]));
    }
    return { ok: true, data: records.map(record => ({ ...record })) };
  }
}

export class action_entity {
  constructor(name, config = {}, driver = null, options = {}) {
    this.name = name;
    this.config = config || {};
    this.driver = driver;
    this.cache = new Map();
    this.cacheLimit = options.cacheLimit || this.config.cacheLimit || 500;
  }

  _cloneRecord(value) {
    if (!value || typeof value !== 'object') return value;
    return { ...value };
  }

  _touchCache(key, value) {
    if (!key) return;
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, this._cloneRecord(value));
    if (this.cache.size > this.cacheLimit) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  _validate(data) {
    const schema = this.config.schema;
    if (!schema) return;
    const errors = [];
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`Field '${field}' is required.`);
      }
      if (value !== undefined && value !== null && rules.type === 'date' && isNaN(Date.parse(value))) {
        errors.push(`Field '${field}' must be a valid date.`);
      }
      if (rules.enum && value !== undefined && value !== null && !rules.enum.includes(value)) {
        errors.push(`Field '${field}' must be one of: ${rules.enum.join(', ')}.`);
      }
    }
    if (errors.length > 0) throw new Error(errors.join(' '));
  }

  _idField() {
    return this.config.idField || 'id';
  }

  async create(data, options = {}) {
    if (!this.driver) this.driver = new memory_driver(this.name);
    const idField = this._idField();
    const timestamp = this.driver.getTimestamp();
    const payload = { ...(data || {}) };

    if (!payload[idField]) {
      payload[idField] = this.driver.generateId();
    }
    if (!payload.createdAt) payload.createdAt = timestamp;
    payload.updatedAt = timestamp;

    this._validate(payload);

    const result = await this.driver.create(payload[idField], payload, options);
    this._touchCache(payload[idField], payload);
    return { ...result, data: payload };
  }

  async read(id, options = {}) {
    if (!this.driver) this.driver = new memory_driver(this.name);
    if (this.cache.has(id)) {
      const cached = this.cache.get(id);
      this._touchCache(id, cached);
      return this._cloneRecord(cached);
    }
    const result = await this.driver.read(id, options);
    if (!result) throw new Error(`${this.name} with id '${id}' not found.`);
    this._touchCache(id, result);
    return this._cloneRecord(result);
  }

  async update(id, data, options = {}) {
    if (!this.driver) this.driver = new memory_driver(this.name);
    const existing = await this.read(id, options);
    const merged = { ...existing, ...(data || {}) };
    merged.updatedAt = this.driver.getTimestamp();
    this._validate(merged);
    const result = await this.driver.update(id, merged, options);
    this._touchCache(id, merged);
    return { ...result, data: merged };
  }

  async delete(id, options = {}) {
    if (!this.driver) this.driver = new memory_driver(this.name);
    this.cache.delete(id);
    return this.driver.delete(id, options);
  }

  async query(filter = {}, options = {}) {
    if (!this.driver) this.driver = new memory_driver(this.name);
    const result = await this.driver.query(filter, options);
    const records = Array.isArray(result) ? result : (result && result.data ? result.data : []);
    const idField = this._idField();
    for (const record of records) {
      if (record && record[idField] !== undefined) {
        this._touchCache(record[idField], record);
      }
    }
    if (Array.isArray(result)) {
      return records.map(record => this._cloneRecord(record));
    }
    if (result && result.data) {
      return { ...result, data: records.map(record => this._cloneRecord(record)) };
    }
    return result;
  }
}

export { memory_driver };
export default action_entity;
