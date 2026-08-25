/**
 * code_shared_manifest_validation_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_007 (manifest/inventory validation)
 *
 * Validates manifests and route/action registrations for stale entries
 * and duplicate bindings.
 */

class manifest_validation {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.manifests = new Map();
  }

  register_manifest(id, entries = []) {
    this.manifests.set(id, { id, entries, registered_at: new Date().toISOString() });
    return { ok: true };
  }

  validate_stale(manifest_id) {
    const manifest = this.manifests.get(manifest_id);
    if (!manifest) return { ok: false, errors: [`manifest '${manifest_id}' not found`] };
    const stale = manifest.entries.filter((e) => !e.active);
    return { ok: stale.length === 0, stale_entries: stale, count: stale.length };
  }

  validate_duplicates(manifest_id) {
    const manifest = this.manifests.get(manifest_id);
    if (!manifest) return { ok: false, errors: [`manifest '${manifest_id}' not found`] };
    const seen = new Set();
    const duplicates = [];
    for (const entry of manifest.entries) {
      const key = `${entry.type}:${entry.name}`;
      if (seen.has(key)) duplicates.push(entry);
      seen.add(key);
    }
    return { ok: duplicates.length === 0, duplicates, count: duplicates.length };
  }

  validate_all(manifest_id) {
    const stale = this.validate_stale(manifest_id);
    const dups = this.validate_duplicates(manifest_id);
    return { ok: stale.ok && dups.ok, stale, duplicates: dups };
  }

  list_manifests() { return [...this.manifests.keys()]; }
}

export { manifest_validation };
