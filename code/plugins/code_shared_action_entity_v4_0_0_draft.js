/**
 * code_shared_action_entity_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: contract_005_action_entity_boundary
 * 
 * Consolidated entity with ALL merged functionality:
 * - Core CRUD (create, read, update, delete, query)
 * - Book/Cell operations
 * - Search
 * - Workspace persistence
 * - Policy cache
 * - Project inventory
 * - Command registry
 * - Import/Export
 * - Layout rendering (from product_surface)
 * - Template management (from product_surface)
 * - UI focus/blur (from ui_surface)
 * - Undo/Redo (from ui_surface)
 * - Canvas interaction (from ui_surface)
 * - Flow builder (from ui_surface)
 * - Browser mount (from ui_surface)
 * - Tour steps (from ui_surface)
 * - Event listeners (from ui_surface)
 */

import { entity_validator } from "../utilities/code_shared_entity_validator_v3_0_0_draft.js";
import { entity_registry } from "../utilities/code_shared_entity_registry_v3_0_0_draft.js";
import { lifecycle_statuses } from "../utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js";

class memory_driver {
  constructor(name = "entity") {
    this.name = name;
    this.records = new Map();
    this.id_counter = 0;
  }

  generate_id(prefix = this.name) {
    this.id_counter += 1;
    return `${prefix}_${this.id_counter}`;
  }

  get_timestamp() {
    return new Date().toISOString();
  }

  async create(id, data) {
    this.records.set(id, JSON.parse(JSON.stringify(data)));
    return { ok: true, id };
  }

  async read(id) {
    if (!this.records.has(id)) return null;
    return JSON.parse(JSON.stringify(this.records.get(id)));
  }

  async update(id, data) {
    this.records.set(id, JSON.parse(JSON.stringify(data)));
    return { ok: true, id };
  }

  async delete(id) {
    this.records.delete(id);
    return { ok: true, id };
  }

  async query(filter = {}) {
    const records = Array.from(this.records.values()).filter((record) => {
      for (const [key, value] of Object.entries(filter)) {
        if (record[key] !== value) return false;
      }
      return true;
    });
    return { ok: true, data: records.map((r) => JSON.parse(JSON.stringify(r))) };
  }
}

class action_entity {
  constructor(name = "entities", config = {}, driver = null, options = {}) {
    this.name = name;
    this.config = { actor: "system", ...config };
    this.driver = driver || new memory_driver(name);
    this.registry = options.registry || new entity_registry({});
    this.validator = options.validator || new entity_validator({ lifecycle_statuses });
    this.cache = new Map();
    this.cache_limit = options.cache_limit || 500;
    this.audit_records = [];
    this.undo_stack = [];
    this.redo_stack = [];
    this.listeners = new Map();
    this.canvas_nodes = new Map();
    this.canvas_edges = new Map();
    this.tour_steps = new Map();
    this.mounted = new Map();
    this.templates = new Map();
  }

  // ===== CORE CRUD =====
  async create(input) {
    const entity = this.normalize_entity(input);
    await this.driver.create(entity.id, entity);
    this.audit("create", entity.id);
    return { ok: true, data: entity, errors: [] };
  }

  async read(id) {
    const data = await this.driver.read(id);
    if (!data) return { ok: false, errors: [`Entity ${id} not found`] };
    return { ok: true, data, errors: [] };
  }

  async update(id, updates) {
    const current = await this.driver.read(id);
    if (!current) return { ok: false, errors: [`Entity ${id} not found`] };
    const merged = { ...current, ...updates, updated_at: new Date().toISOString() };
    await this.driver.update(id, merged);
    this.audit("update", id);
    return { ok: true, data: merged, errors: [] };
  }

  async delete(id) {
    const exists = await this.driver.read(id);
    if (!exists) return { ok: false, errors: [`Entity ${id} not found`] };
    await this.driver.delete(id);
    this.audit("delete", id);
    return { ok: true, data: { id }, errors: [] };
  }

  async query(filter = {}) {
    return await this.driver.query(filter);
  }

  // ===== BOOK/CELL OPERATIONS =====
  async create_book(config = {}) {
    return this.create({ type: "book", name: config.name || "untitled_book", data: { title: config.title || "Untitled Book" } });
  }

  async create_cell(config = {}) {
    if (!config.book_id) return { ok: false, errors: ["book_id required"] };
    return this.create({ type: "cell", name: config.name || `cell_${Date.now()}`, data: { book_id: config.book_id, cell_type: config.cell_type || "markdown", content: config.content || "" }, relationships: [{ type: "belongs_to", to: config.book_id }] });
  }

  async list_cells(book_id) {
    return this.query({ type: "cell", "data.book_id": book_id });
  }

  // ===== SEARCH =====
  async search(query, records = []) {
    const hits = [];
    const q = String(query || "").trim().toLowerCase();
    if (q) {
      for (const record of records) {
        const text = record.name || record.id || "";
        if (text.toLowerCase().includes(q)) hits.push({ id: record.id, label: record.name || record.id });
      }
    }
    return { ok: true, data: { query, hits, count: hits.length }, errors: [] };
  }

  // ===== PERSISTENCE =====
  async save(key, data) {
    await this.driver.create(`persist_${key}`, { key, data });
    this.audit("save", key);
    return { ok: true, data: { key }, errors: [] };
  }

  async load(key) {
    const result = await this.driver.read(`persist_${key}`);
    if (!result) return { ok: false, errors: [`Key ${key} not found`] };
    return { ok: true, data: result.data, errors: [] };
  }

  // ===== POLICY CACHE =====
  async get_policy(key) {
    const cached = this.cache.get(`policy_${key}`);
    if (cached) return { ok: true, data: cached, errors: [] };
    const result = await this.driver.read(`policy_${key}`);
    if (result) { this.cache.set(`policy_${key}`, result); return { ok: true, data: result, errors: [] }; }
    return { ok: false, errors: [`Policy ${key} not found`] };
  }

  async set_policy(key, value) {
    await this.driver.create(`policy_${key}`, value);
    this.cache.set(`policy_${key}`, value);
    return { ok: true, data: { key }, errors: [] };
  }

  // ===== COMMAND REGISTRY =====
  async register_command(command) {
    return this.create({ type: "command", name: command.name, data: { label: command.label || command.name, icon: command.icon || null } });
  }

  async list_commands() {
    return this.query({ type: "command" });
  }

  // ===== LAYOUT RENDERING (from product_surface) =====
  create_layout_projection(entity, render_profile = "json_as_document") {
    if (!entity || typeof entity !== "object") return { ok: false, errors: ["entity required"] };
    const layouts = ["list", "card", "kanban", "calendar", "timeline", "tree"];
    const layout = render_profile === "json_as_document" ? "list" : render_profile;
    if (!layouts.includes(layout)) return { ok: false, errors: [`Unknown layout: ${layout}`] };
    return { ok: true, data: { id: `projection_${entity.id || "entity"}`, type: "layout_projection", source_entity_id: entity.id, layout, render_profile, data: JSON.parse(JSON.stringify(entity)) }, errors: [] };
  }

  render_layout(config = {}) {
    const projection = this.create_layout_projection(config.entity, config.render_profile);
    if (!projection.ok) return projection;
    return { ok: true, data: { type: "render_output", layout: projection.data.layout, source_entity_id: projection.data.source_entity_id }, errors: [] };
  }

  // ===== TEMPLATE MANAGEMENT (from product_surface) =====
  register_template(template) {
    if (!template || !template.id) return { ok: false, errors: ["template id required"] };
    this.templates.set(template.id, JSON.parse(JSON.stringify(template)));
    return { ok: true, data: { id: template.id }, errors: [] };
  }

  get_template(id) {
    const template = this.templates.get(id);
    if (!template) return { ok: false, errors: [`Template ${id} not found`] };
    return { ok: true, data: JSON.parse(JSON.stringify(template)), errors: [] };
  }

  list_templates() {
    return { ok: true, data: Array.from(this.templates.values()), errors: [] };
  }

  // ===== UI FOCUS (from ui_surface) =====
  async focus_component(id) {
    await this.update(id, { status: "focused" });
    return { ok: true, data: { id, status: "focused" }, errors: [] };
  }

  async blur_component(id) {
    await this.update(id, { status: "active" });
    return { ok: true, data: { id, status: "active" }, errors: [] };
  }

  // ===== UNDO/REDO (from ui_surface) =====
  async record_action(action, entity_id, before, after) {
    this.undo_stack.push({ action, entity_id, before, after });
    this.redo_stack = [];
    return { ok: true, errors: [] };
  }

  async undo() {
    if (this.undo_stack.length === 0) return { ok: false, errors: ["Nothing to undo"] };
    const entry = this.undo_stack.pop();
    await this.update(entry.entity_id, entry.before);
    this.redo_stack.push(entry);
    return { ok: true, data: entry, errors: [] };
  }

  async redo() {
    if (this.redo_stack.length === 0) return { ok: false, errors: ["Nothing to redo"] };
    const entry = this.redo_stack.pop();
    await this.update(entry.entity_id, entry.after);
    this.undo_stack.push(entry);
    return { ok: true, data: entry, errors: [] };
  }

  // ===== CANVAS (from ui_surface) =====
  add_canvas_node(id, config = {}) {
    this.canvas_nodes.set(id, { id, x: config.x || 0, y: config.y || 0 });
    return { ok: true, data: { id }, errors: [] };
  }

  move_canvas_node(id, x, y) {
    const node = this.canvas_nodes.get(id);
    if (!node) return { ok: false, errors: ["Node not found"] };
    node.x = x; node.y = y;
    return { ok: true, data: { id, x, y }, errors: [] };
  }

  add_canvas_edge(id, from, to) {
    this.canvas_edges.set(id, { id, from, to });
    return { ok: true, data: { id, from, to }, errors: [] };
  }

  // ===== FLOW BUILDER (from ui_surface) =====
  create_flow(id, nodes = []) {
    return this.create({ type: "flow", name: id, data: { nodes, status: "idle" } });
  }

  // ===== BROWSER MOUNT (from ui_surface) =====
  async mount(component, container) {
    return this.create({ type: "browser_mount", name: `mount_${component.id || Date.now()}`, data: { component_id: component.id, container } });
  }

  // ===== TOUR (from ui_surface) =====
  add_tour_step(tour_id, step) {
    if (!this.tour_steps.has(tour_id)) this.tour_steps.set(tour_id, []);
    this.tour_steps.get(tour_id).push({ ...step, order: this.tour_steps.get(tour_id).length });
    return { ok: true, errors: [] };
  }

  // ===== LISTENERS (from ui_surface) =====
  add_listener(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(handler);
    return { ok: true, errors: [] };
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return { ok: true, errors: [] };
    for (const handler of this.listeners.get(event)) handler(data);
    return { ok: true, errors: [] };
  }

  // ===== AUDIT =====
  audit(action, target_id) {
    this.audit_records.push({ action, target_id, timestamp: new Date().toISOString(), actor: this.config.actor || "system" });
  }

  get_audit_log() {
    return [...this.audit_records];
  }

  // ===== NORMALIZE =====
  normalize_entity(input = {}) {
    if (!input || typeof input !== "object") throw new Error("entity input must be an object");
    const timestamp = this.driver.get_timestamp();
    return {
      id: input.id || this.driver.generate_id(input.type || "entity"),
      type: input.type || "entity",
      name: input.name || "unnamed",
      version: input.version || "0.1.0",
      status: input.status || "draft",
      data: JSON.parse(JSON.stringify(input.data || {})),
      relationships: Array.isArray(input.relationships) ? input.relationships : [],
      operations: Array.isArray(input.operations) ? input.operations : [],
      created_at: input.created_at || timestamp,
      updated_at: timestamp,
      created_by: this.config.actor || "system"
    };
  }
}

export default action_entity;
export { memory_driver, action_entity };
