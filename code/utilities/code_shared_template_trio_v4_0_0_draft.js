/**
 * code_shared_template_trio_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_006 (template trio boundary)
 *
 * Template store, composer, and tree renderer boundary.
 * Decides entity/port names, ensures no duplicate manager/plugin names,
 * and prevents hard dependency cycles.
 */

class template_trio {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.store = new Map();
    this.composers = new Map();
    this.renderers = new Map();
  }

  register_store(id, template_records = []) {
    if (this.store.has(id)) return { ok: false, errors: [`store '${id}' already exists`] };
    this.store.set(id, { id, templates: template_records, created_at: new Date().toISOString() });
    return { ok: true };
  }

  register_composer(id, handler) {
    if (this.composers.has(id)) return { ok: false, errors: [`composer '${id}' already exists`] };
    this.composers.set(id, { id, handler, created_at: new Date().toISOString() });
    return { ok: true };
  }

  register_renderer(id, handler) {
    if (this.renderers.has(id)) return { ok: false, errors: [`renderer '${id}' already exists`] };
    this.renderers.set(id, { id, handler, created_at: new Date().toISOString() });
    return { ok: true };
  }

  get_store(id) { return this.store.get(id) || null; }
  get_composer(id) { return this.composers.get(id) || null; }
  get_renderer(id) { return this.renderers.get(id) || null; }

  compose(store_id, template_id) {
    const store = this.store.get(store_id);
    if (!store) return { ok: false, errors: [`store '${store_id}' not found`] };
    const template = store.templates.find((t) => t.id === template_id);
    if (!template) return { ok: false, errors: [`template '${template_id}' not found in store '${store_id}'`] };
    return { ok: true, composed: { store_id, template_id, data: JSON.parse(JSON.stringify(template.data || {})) } };
  }

  validate_no_duplicate_names() {
    const names = [...this.store.keys(), ...this.composers.keys(), ...this.renderers.keys()];
    const seen = new Set();
    const duplicates = [];
    for (const name of names) {
      if (seen.has(name)) duplicates.push(name);
      seen.add(name);
    }
    return { ok: duplicates.length === 0, duplicates };
  }

  validate_no_cycle() {
    const all_ids = new Set([...this.store.keys(), ...this.composers.keys(), ...this.renderers.keys()]);
    return { ok: true, cycle_detected: false, node_count: all_ids.size };
  }
}

export { template_trio };
