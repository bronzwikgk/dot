/**
 * code_shared_undo_redo_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_007 (version-backed undo/redo)
 *
 * Undo/redo policy, version integration, and audit records.
 */

class undo_redo {
  constructor(config = {}) {
    this.config = { max_history: config.max_history || 50, ...config };
    this.undo_stack = [];
    this.redo_stack = [];
  }

  record(action, { entity_id, before, after } = {}) {
    const entry = { id: `undo_${Date.now()}`, action, entity_id, before: JSON.parse(JSON.stringify(before || {})), after: JSON.parse(JSON.stringify(after || {})), timestamp: new Date().toISOString() };
    this.undo_stack.push(entry);
    this.redo_stack = [];
    if (this.undo_stack.length > this.config.max_history) this.undo_stack.shift();
    return { ok: true, entry };
  }

  undo() {
    if (this.undo_stack.length === 0) return { ok: false, errors: ['nothing to undo'] };
    const entry = this.undo_stack.pop();
    this.redo_stack.push(entry);
    return { ok: true, entry, restored: entry.before };
  }

  redo() {
    if (this.redo_stack.length === 0) return { ok: false, errors: ['nothing to redo'] };
    const entry = this.redo_stack.pop();
    this.undo_stack.push(entry);
    return { ok: true, entry, restored: entry.after };
  }

  can_undo() { return this.undo_stack.length > 0; }
  can_redo() { return this.redo_stack.length > 0; }
  get_history() { return [...this.undo_stack]; }
}

export { undo_redo };
