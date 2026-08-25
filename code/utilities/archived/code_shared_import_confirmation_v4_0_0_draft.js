/**
 * code_shared_import_confirmation_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_008 (import confirmation for executable code cells)
 *
 * Import policy entity, executable-cell warning state, and confirmation surface.
 */

class import_confirmation {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.imports = new Map();
  }

  request_import(id, { content, type, requires_confirmation } = {}) {
    const record = {
      id,
      content: content || '',
      type: type || 'text',
      requires_confirmation: requires_confirmation || type === 'code',
      confirmed: false,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.imports.set(id, record);
    return { ok: true, record };
  }

  confirm_import(id) {
    const record = this.imports.get(id);
    if (!record) return { ok: false, errors: [`import '${id}' not found`] };
    if (record.requires_confirmation && !record.confirmed) {
      record.confirmed = true;
      record.status = 'confirmed';
      return { ok: true, record };
    }
    return { ok: true, record };
  }

  reject_import(id) {
    const record = this.imports.get(id);
    if (!record) return { ok: false, errors: [`import '${id}' not found`] };
    record.status = 'rejected';
    return { ok: true, record };
  }

  validate_import(id) {
    const record = this.imports.get(id);
    if (!record) return { ok: false, errors: [`import '${id}' not found`] };
    if (record.requires_confirmation && !record.confirmed) return { ok: false, errors: ['confirmation required'] };
    return { ok: true, record };
  }

  list_imports() { return [...this.imports.values()]; }
}

export { import_confirmation };
