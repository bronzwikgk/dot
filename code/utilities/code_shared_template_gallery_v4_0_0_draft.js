/**
 * code_shared_template_gallery_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_006 (template store/composer/renderer) + v4_missing_026
 *
 * Template gallery view with card entity/layout and template create action.
 */

class template_gallery {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.templates = new Map();
    this.cards = new Map();
  }

  register_template(id, { name, description, category, icon } = {}) {
    this.templates.set(id, { id, name: name || id, description: description || '', category: category || 'general', icon: icon || 'template', created_at: new Date().toISOString() });
    return { ok: true };
  }

  create_card(template_id) {
    const template = this.templates.get(template_id);
    if (!template) return { ok: false, errors: [`template '${template_id}' not found`] };
    const card_id = `card_${template_id}_${Date.now()}`;
    const card = { id: card_id, template_id, template_name: template.name, status: 'active', created_at: new Date().toISOString() };
    this.cards.set(card_id, card);
    return { ok: true, card };
  }

  remove_card(card_id) {
    if (!this.cards.has(card_id)) return { ok: false, errors: [`card '${card_id}' not found`] };
    this.cards.delete(card_id);
    return { ok: true };
  }

  list_templates() { return [...this.templates.values()]; }
  list_cards() { return [...this.cards.values()]; }
  get_template(id) { return this.templates.get(id) || null; }
}

export { template_gallery };
