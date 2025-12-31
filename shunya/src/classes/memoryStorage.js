// Overview: In-memory map-based storage for fast, ephemeral caching.
// Purpose: Provide TTL-aware storage when browser storage is unavailable.
// Audience: CacheManager and runtime diagnostics.
// Problem Addressed: Missing volatile caching layer with eviction.
// Use Cases: Cache hits, pattern invalidation, short-lived dataset access.
// Features: Max item control, TTL tracking, periodic cleanup.
// Benefits: Ensures predictable cache size and automatic expiration.
// User Stories: As a cache I keep recent entries and auto-drop expired ones.
// User Flow: Store entries, lookup by filters, auto-clean expired keys.
// System Components: CacheManager, ActionEntity cache hooks.
// Edge Cases: Cleanup ensures stale entries removed even when maxItems reached.
// Test Cases: Validate TTL, eviction order, CRUD operations.
// Configuration: Accepts maxItems and ttl in options.
// Schema: Map of {_id: data} with expiry timestamps.

class MemoryStorage {
  constructor(options) {
    this.data = new Map();
    this.maxItems = options.maxItems;
    this.ttl = options.ttl;
    this.expiry = new Map();

    setInterval(() => this.cleanup(), 60000);
  }

  async initialize() {
    return Promise.resolve();
  }

  async create(data) {
    const id = data._id || this.generateId();
    const item = { ...data, _id: id };

    if (this.data.size >= this.maxItems) {
      const oldestKey = this.data.keys().next().value;
      this.data.delete(oldestKey);
      this.expiry.delete(oldestKey);
    }

    this.data.set(id, item);
    this.expiry.set(id, Date.now() + this.ttl);

    return item;
  }

  async read(query) {
    const results = [];

    for (const item of this.data.values()) {
      let match = true;

      Object.keys(query).forEach(key => {
        if (item[key] !== query[key]) {
          match = false;
        }
      });

      if (match) {
        results.push(item);
      }
    }

    if (query._id) {
      return results[0] || null;
    }

    return results;
  }

  async update(id, data) {
    const existing = this.data.get(id);

    if (!existing) {
      throw new Error('Record not found');
    }

    const updated = { ...existing, ...data };
    this.data.set(id, updated);
    this.expiry.set(id, Date.now() + this.ttl);

    return updated;
  }

  async delete(id) {
    this.data.delete(id);
    this.expiry.delete(id);
    return { id, deleted: true };
  }

  generateId() {
    return 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  cleanup() {
    const now = Date.now();

    for (const [id, expiry] of this.expiry.entries()) {
      if (now > expiry) {
        this.data.delete(id);
        this.expiry.delete(id);
      }
    }
  }
}

export default MemoryStorage;
