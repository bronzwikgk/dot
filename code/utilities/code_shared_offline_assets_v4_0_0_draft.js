/**
 * code_shared_offline_assets_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_008 (offline icon/package asset policy)
 *
 * Asset dataset, vendor folder policy, and no-CDN scan.
 */

class offline_assets {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.assets = new Map();
    this.cdn_references = [];
  }

  register_asset(id, { path, type, size } = {}) {
    this.assets.set(id, { id, path: path || `/${id}`, type: type || 'unknown', size: size || 0, registered_at: new Date().toISOString() });
    return { ok: true };
  }

  scan_for_cdn(content) {
    const cdn_pattern = /https?:\/\/[^\s]+\.(js|css|png|jpg|svg|woff|woff2)/gi;
    const matches = content.match(cdn_pattern) || [];
    this.cdn_references = matches;
    return { ok: matches.length === 0, cdn_references: matches, count: matches.length };
  }

  validate_offline() {
    const asset_list = [...this.assets.values()];
    const missing = asset_list.filter((a) => !a.path);
    return { ok: missing.length === 0 && this.cdn_references.length === 0, assets: asset_list.length, cdn_count: this.cdn_references.length };
  }

  list_assets() { return [...this.assets.values()]; }
}

export { offline_assets };
