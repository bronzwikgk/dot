/**
 * code_shared_ui_surface_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: contract_009_ui_surface
 * 
 * Consolidated UI surface with merged utilities:
 * - editor_focus (merged)
 * - undo_redo (merged)
 * - listener_view_frame (merged)
 * - layout_parity (merged)
 * - guided_tour (merged)
 * - canvas_interaction (merged)
 * - flow_builder (merged)
 * - browser_runtime (merged)
 */

import { action_entity } from "./code_shared_action_entity_v4_0_0_draft.js";

class ui_surface {
  constructor(config = {}, ports = {}) {
    this.config = { actor: "system", ...config };
    this.entities = ports.entities || new action_entity("ui_entities", { actor: this.config.actor });
    this.undo_stack = [];
    this.redo_stack = [];
    this.listeners = new Map();
    this.tour_steps = new Map();
    this.canvas_nodes = new Map();
    this.canvas_edges = new Map();
    this.mounted = new Map();
  }

  // ===== EDITOR FOCUS (merged) =====
  async focus_component(id) {
    const result = await this.entities.read(id);
    if (!result.ok) return result;
    await this.entities.update(id, { status: "focused" });
    this.audit("focus", id);
    return { ok: true, data: { id, status: "focused" }, errors: [] };
  }

  async blur_component(id) {
    const result = await this.entities.read(id);
    if (!result.ok) return result;
    await this.entities.update(id, { status: "active" });
    this.audit("blur", id);
    return { ok: true, data: { id, status: "active" }, errors: [] };
  }

  // ===== UNDO/REDO (merged) =====
  async record_action(action, entity_id, before, after) {
    this.undo_stack.push({ action, entity_id, before, after, timestamp: new Date().toISOString() });
    this.redo_stack = [];
    return { ok: true, errors: [] };
  }

  async undo() {
    if (this.undo_stack.length === 0) return { ok: false, errors: ["Nothing to undo"] };
    const entry = this.undo_stack.pop();
    await this.entities.update(entry.entity_id, entry.before);
    this.redo_stack.push(entry);
    this.audit("undo", entry.entity_id);
    return { ok: true, data: entry, errors: [] };
  }

  async redo() {
    if (this.redo_stack.length === 0) return { ok: false, errors: ["Nothing to redo"] };
    const entry = this.redo_stack.pop();
    await this.entities.update(entry.entity_id, entry.after);
    this.undo_stack.push(entry);
    this.audit("redo", entry.entity_id);
    return { ok: true, data: entry, errors: [] };
  }

  // ===== LISTENER/VIEW FRAME (merged) =====
  add_listener(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(handler);
    return { ok: true, errors: [] };
  }

  remove_listener(event, handler) {
    if (!this.listeners.has(event)) return { ok: false, errors: ["Event not found"] };
    const handlers = this.listeners.get(event);
    const index = handlers.indexOf(handler);
    if (index > -1) handlers.splice(index, 1);
    return { ok: true, errors: [] };
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return { ok: true, errors: [] };
    for (const handler of this.listeners.get(event)) {
      handler(data);
    }
    return { ok: true, errors: [] };
  }

  // ===== LAYOUT PARITY (merged) =====
  validate_layout(entity, layout) {
    const layouts = ["list", "card", "kanban", "calendar", "timeline", "tree"];
    if (!layouts.includes(layout)) return { ok: false, errors: [`Unknown layout: ${layout}`] };
    return { ok: true, data: { entity_id: entity.id, layout }, errors: [] };
  }

  // ===== GUIDED TOUR (merged) =====
  add_tour_step(tour_id, step) {
    if (!this.tour_steps.has(tour_id)) this.tour_steps.set(tour_id, []);
    this.tour_steps.get(tour_id).push({ ...step, order: this.tour_steps.get(tour_id).length });
    return { ok: true, errors: [] };
  }

  get_tour_step(tour_id, step_index) {
    const steps = this.tour_steps.get(tour_id) || [];
    if (step_index >= steps.length) return { ok: false, errors: ["Step not found"] };
    return { ok: true, data: steps[step_index], errors: [] };
  }

  // ===== CANVAS INTERACTION (merged) =====
  add_canvas_node(id, config = {}) {
    this.canvas_nodes.set(id, { id, x: config.x || 0, y: config.y || 0, type: config.type || "default" });
    return { ok: true, data: { id }, errors: [] };
  }

  move_canvas_node(id, x, y) {
    const node = this.canvas_nodes.get(id);
    if (!node) return { ok: false, errors: ["Node not found"] };
    node.x = x;
    node.y = y;
    return { ok: true, data: { id, x, y }, errors: [] };
  }

  add_canvas_edge(id, from, to) {
    this.canvas_edges.set(id, { id, from, to });
    return { ok: true, data: { id, from, to }, errors: [] };
  }

  // ===== FLOW BUILDER (merged) =====
  create_flow(id, nodes = []) {
    return this.entities.create({
      type: "flow",
      name: id,
      data: { nodes, status: "idle" },
      operations: ["create", "read", "update", "execute"]
    });
  }

  async execute_flow(flow_id) {
    const result = await this.entities.read(flow_id);
    if (!result.ok) return result;
    await this.entities.update(flow_id, { status: "running" });
    this.audit("execute_flow", flow_id);
    return { ok: true, data: { flow_id, status: "running" }, errors: [] };
  }

  // ===== BROWSER RUNTIME (merged) =====
  async mount(component, container) {
    return this.entities.create({
      type: "browser_mount",
      name: `mount_${component.id || Date.now()}`,
      data: { component_id: component.id, container, mounted_at: new Date().toISOString() },
      operations: ["read", "update", "delete"]
    });
  }

  async unmount(component_id) {
    return this.entities.delete(`mount_${component_id}`);
  }

  async get_mounted() {
    return this.entities.query({ type: "browser_mount" });
  }

  // ===== AUDIT =====
  audit(action, target_id) {
    this.entities.audit_records.push({
      action,
      target_id,
      timestamp: new Date().toISOString(),
      actor: this.config.actor || "system"
    });
  }
}

export default ui_surface;
export { ui_surface };
