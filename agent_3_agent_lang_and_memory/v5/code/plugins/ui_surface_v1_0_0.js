/**
 * ui_surface_v1_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Multi-layout rendering over the same data: notebook, code editor,
 * block editor, table, board, calendar, timeline, dashboard, diagram,
 * canvas, website builder, and parser workbench.
 */

import action_entity from "./action_entity_v5_0_0.js";

class ui_surface {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = new action_entity({ actor: this.config.actor });
    this.layouts = new Map();
    this.mounted = new Map();
  }

  register_layout(name, render_fn) {
    this.layouts.set(name, render_fn);
    return { ok: true, name };
  }

  render(entity, layout_name) {
    const render_fn = this.layouts.get(layout_name);
    if (!render_fn) return { ok: false, errors: [`Layout ${layout_name} not found`] };
    return { ok: true, data: render_fn(entity) };
  }

  mount(entity, container, layout) {
    const result = this.render(entity, layout);
    if (!result.ok) return result;
    this.mounted.set(entity.id, { entity, container, layout, rendered: result.data });
    return { ok: true, entity_id: entity.id };
  }

  unmount(entity_id) {
    this.mounted.delete(entity_id);
    return { ok: true };
  }

  get_mounted() {
    return Array.from(this.mounted.values());
  }
}

export default ui_surface;
export { ui_surface };
