// Overview: Browser localStorage adapter implementing CRUD semantics for cached entities.
// Purpose: Offer a lightweight, synchronous storage backend for cache managers.
// Audience: CacheManager, testing utilities, offline-capable features.
// Problem Addressed: Missing persistent caching layer in browser during runtime.
// Use Cases: Creating, reading, updating, and deleting serialized items under a prefix.
// Features: JSON serialization, prefix scoping, simple filtering, auto ID generation.
// Benefits: Fast lookups and persistence inside supported browsers.
// User Stories: As a cache I store response snapshots for re-use.
// User Flow: Initialize, store data with generated keys, query by filters, update/delete as needed.
// System Components: CacheManager, ActionEntity caching hooks.
// Edge Cases: Handles unsupported environments via initialization error.
// Test Cases: Validate CRUD operations and filter accuracy with prefixed keys.
// Configuration: Requires prefix and optional quota settings via options.
// Schema: Stores objects keyed by `${prefix}${_id}` containing JSON payloads.

class LocalStorage {
  constructor(options) {
    this.prefix = options.prefix;
    this.quota = options.quota;
  }

  async initialize() {
    if (typeof localStorage === 'undefined') {
      throw new Error('LocalStorage not supported');
    }
    return Promise.resolve();
  }

  async create(data) {
    const id = data._id || this.generateId();
    const key = this.prefix + id;
    const item = { ...data, _id: id };

    localStorage.setItem(key, JSON.stringify(item));
    return item;
  }

  async read(query) {
    const results = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key));

          let match = true;
          Object.keys(query).forEach(filterKey => {
            if (item[filterKey] !== query[filterKey]) {
              match = false;
            }
          });

          if (match) {
            results.push(item);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }

    if (query._id) {
      return results[0] || null;
    }

    return results;
  }

  async update(id, data) {
    const key = this.prefix + id;
    const existing = localStorage.getItem(key);

    if (!existing) {
      throw new Error('Record not found');
    }

    const updated = { ...JSON.parse(existing), ...data };
    localStorage.setItem(key, JSON.stringify(updated));

    return updated;
  }

  async delete(id) {
    const key = this.prefix + id;
    localStorage.removeItem(key);
    return { id, deleted: true };
  }

  generateId() {
    return 'ls_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

export default LocalStorage;
