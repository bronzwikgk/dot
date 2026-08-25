/**
 * code_shared_config_anchoring_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_010 (relative config path anchoring)
 *
 * Config source resolver utility and path policy.
 */

class config_anchoring {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.sources = new Map();
  }

  register_source(id, { base_path, config_path } = {}) {
    this.sources.set(id, { id, base_path: base_path || '/', config_path: config_path || '/', anchored_at: new Date().toISOString() });
    return { ok: true };
  }

  resolve_path(source_id, relative_path) {
    const source = this.sources.get(source_id);
    if (!source) return { ok: false, errors: [`source '${source_id}' not found`] };
    if (relative_path.includes('..')) return { ok: false, errors: ['path traversal rejected'] };
    const resolved = `${source.base_path}/${relative_path}`.replace(/\/+/g, '/');
    return { ok: true, resolved_path: resolved };
  }

  validate_paths() {
    const source_list = [...this.sources.values()];
    const invalid = source_list.filter((s) => !s.base_path || !s.config_path);
    return { ok: invalid.length === 0, invalid_sources: invalid };
  }

  list_sources() { return [...this.sources.values()]; }
}

export { config_anchoring };
