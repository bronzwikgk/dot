/**
 * code_shared_listener_view_frame_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_012 (entry, mount, view frame, default listeners)
 *
 * Listener entity, event binding map, and view_frame definition.
 */

class listener_view_frame {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.listeners = new Map();
    this.view_frames = new Map();
  }

  register_listener(id, { event, handler, target } = {}) {
    this.listeners.set(id, { id, event: event || 'click', handler: handler || null, target: target || '*', enabled: true, created_at: new Date().toISOString() });
    return { ok: true };
  }

  remove_listener(id) {
    if (!this.listeners.has(id)) return { ok: false, errors: [`listener '${id}' not found`] };
    this.listeners.delete(id);
    return { ok: true };
  }

  register_view_frame(id, { element_id, layout, default_content } = {}) {
    this.view_frames.set(id, { id, element_id: element_id || `view_${id}`, layout: layout || 'document_view', default_content: default_content || '', created_at: new Date().toISOString() });
    return { ok: true };
  }

  resolve_view_frame(id) {
    const vf = this.view_frames.get(id);
    if (!vf) return { ok: false, errors: [`view_frame '${id}' not found`] };
    return { ok: true, view_frame: vf };
  }

  get_listeners_for_event(event) {
    return [...this.listeners.values()].filter((l) => l.event === event && l.enabled);
  }

  validate_all() {
    const listener_list = [...this.listeners.values()];
    const vf_list = [...this.view_frames.values()];
    const missing_handler = listener_list.filter((l) => !l.handler);
    const missing_element = vf_list.filter((v) => !v.element_id);
    return { ok: missing_handler.length === 0 && missing_element.length === 0, listeners_without_handler: missing_handler.length, view_frames_without_element: missing_element.length };
  }

  list_listeners() { return [...this.listeners.values()]; }
  list_view_frames() { return [...this.view_frames.values()]; }
}

export { listener_view_frame };
