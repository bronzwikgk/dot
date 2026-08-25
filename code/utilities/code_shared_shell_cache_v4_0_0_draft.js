/**
 * code_shared_shell_cache_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_011 (shell cache backed by action_entity)
 *
 * Shell cache entity, action_entity cache integration, and audit records.
 */

class shell_cache {
  constructor(config = {}) {
    this.config = { ttl: config.ttl || 300000, ...config };
    this.cache = new Map();
    this.audit = [];
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return { ok: false, errors: [`key '${key}' not found`] };
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return { ok: false, errors: ['cache expired'] };
    }
    this.audit.push({ action: 'get', key, timestamp: new Date().toISOString() });
    return { ok: true, value: JSON.parse(JSON.stringify(entry.value)) };
  }

  set(key, value) {
    this.cache.set(key, { value: JSON.parse(JSON.stringify(value)), timestamp: Date.now() });
    this.audit.push({ action: 'set', key, timestamp: new Date().toISOString() });
    return { ok: true };
  }

  delete(key) {
    const existed = this.cache.delete(key);
    this.audit.push({ action: 'delete', key, timestamp: new Date().toISOString() });
    return { ok: true, existed };
  }

  clear() {
    this.cache.clear();
    this.audit.push({ action: 'clear', timestamp: new Date().toISOString() });
    return { ok: true };
  }

  get_audit() { return [...this.audit]; }
  get_size() { return this.cache.size; }
}

export { shell_cache };
