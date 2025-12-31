// Overview: High-level cache orchestrator that wraps storage providers.
// Purpose: Provide get/set/delete/invalidate mechanics for ActionEntity caching.
// Audience: Entities and framework cache hooks that need TTL awareness.
// Problem Addressed: No uniform caching API across storage media.
// Use Cases: Warm entity cache, purge patterns, and fallback to memory/local storage.
// Features: Provider selection, safe operations, TTL tracking, error suppression.
// Benefits: Keeps sensitive operations unaffected by caching failures.
// User Stories: As an entity I cache results to boost read operations.
// User Flow: Initialize provider, store cached payloads, invalidate via patterns.
// System Components: LocalStorage, MemoryStorage, ActionEntity hooks.
// Edge Cases: Provider initialization errors propagate clearly; pattern invalidation limited to in-memory provider.
// Test Cases: Validate set/get/delete flows with both providers and simulate invalidation.
// Configuration: Accepts provider, ttl, and prefix options.
// Schema: Cached entries stored as { _id, data, timestamp, ttl }.

import LocalStorage from './localStorage.js';
import MemoryStorage from './memoryStorage.js';

class CacheManager {
  constructor(options) {
    this.options = options;
    this.storage = null;
  }

  async initialize() {
    switch (this.options.provider) {
      case 'localStorage':
        this.storage = new LocalStorage({
          prefix: this.options.prefix,
          quota: 5242880
        });
        break;
      case 'memory':
        this.storage = new MemoryStorage({
          maxItems: 1000,
          ttl: this.options.ttl
        });
        break;
      default:
        throw new Error('Unsupported cache provider');
    }

    await this.storage.initialize();
  }

  async get(key) {
    try {
      const result = await this.storage.read({ _id: key });
      return result ? result.data : null;
    } catch (error) {
      return null;
    }
  }

  async set(key, data) {
    try {
      await this.storage.create({
        _id: key,
        data,
        timestamp: Date.now(),
        ttl: Date.now() + this.options.ttl
      });
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  async delete(key) {
    try {
      await this.storage.delete(key);
    } catch (error) {
      // Ignore cache deletion errors
    }
  }

  async invalidatePattern(pattern) {
    if (this.options.provider === 'memory') {
      const memoryStorage = this.storage;
      for (const key of memoryStorage.data.keys()) {
        if (key.includes(pattern)) {
          await this.delete(key);
        }
      }
    }
  }
}

export default CacheManager;
