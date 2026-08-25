/**
 * code_shared_storage_provider_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_007 (persistence, undo, redo) + v4_contract_004 (search/status)
 *
 * Storage provider boundary, storage key validation, selftest, and error surfacing.
 */

class storage_provider {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.store = new Map();
    this.errors = [];
  }

  set(key, value) {
    if (!key || typeof key !== 'string') return { ok: false, errors: ['invalid key'] };
    this.store.set(key, JSON.parse(JSON.stringify(value)));
    return { ok: true };
  }

  get(key) {
    if (!this.store.has(key)) return { ok: false, errors: [`key '${key}' not found`] };
    return { ok: true, value: JSON.parse(JSON.stringify(this.store.get(key))) };
  }

  remove(key) {
    if (!this.store.has(key)) return { ok: false, errors: [`key '${key}' not found`] };
    this.store.delete(key);
    return { ok: true };
  }

  selftest() {
    const test_key = '__selftest__';
    const set_result = this.set(test_key, { test: true });
    const get_result = this.get(test_key);
    const remove_result = this.remove(test_key);
    const valid = set_result.ok && get_result.ok && remove_result.ok;
    return { ok: valid, set: set_result, get: get_result, remove: remove_result };
  }

  report_error(error_type, message) {
    this.errors.push({ type: error_type, message, timestamp: new Date().toISOString() });
    return { ok: true, error_count: this.errors.length };
  }

  get_errors() { return [...this.errors]; }
  clear_errors() { this.errors = []; return { ok: true }; }
}

export { storage_provider };
