/**
 * action_entity_v5_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Consolidated entity system - handles ALL entity types
 * No standalone functions - only class with constructor and methods
 */

import id_generator from "../utilities/id_generator.js";
import validator from "../utilities/validator.js";
import registry from "../utilities/registry.js";

class action_entity {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.id_gen = new id_generator();
    this.validator = new validator();
    this.registry = new registry();
    this.entities = new Map();
    this.audit_records = [];
    this.undo_stack = [];
    this.redo_stack = [];
  }

  // ===== CORE CRUD =====
  create(type, data = {}) {
    const id = this.id_gen.generate(type);
    const entity = {
      id,
      type,
      name: data.name || "unnamed",
      data: data.data || {},
      config: data.config || {},
      attributes: data.attributes || {},
      traits: data.traits || [],
      relationships: data.relationships || [],
      policies: data.policies || [],
      status: data.status || "draft",
      state: data.state || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.entities.set(id, entity);
    this.audit("create", id);
    return entity;
  }

  read(id) {
    return this.entities.get(id) || null;
  }

  update(id, updates) {
    const entity = this.entities.get(id);
    if (!entity) return null;
    Object.assign(entity, updates, { updated_at: new Date().toISOString() });
    this.audit("update", id);
    return entity;
  }

  delete(id) {
    const exists = this.entities.has(id);
    this.entities.delete(id);
    if (exists) this.audit("delete", id);
    return exists;
  }

  query(filter = {}) {
    const results = [];
    for (const entity of this.entities.values()) {
      let match = true;
      for (const [key, value] of Object.entries(filter)) {
        if (entity[key] !== value) { match = false; break; }
      }
      if (match) results.push(entity);
    }
    return results;
  }

  // ===== ENTITY OPERATIONS =====
  create_book(data = {}) {
    return this.create("book", { name: data.name || "untitled_book", data: { title: data.title || "Untitled Book" } });
  }

  create_cell(data = {}) {
    if (!data.book_id) throw new Error("book_id required");
    return this.create("cell", {
      name: data.name || "untitled_cell",
      data: { book_id: data.book_id, cell_type: data.cell_type || "markdown", content: data.content || "" },
      relationships: [{ type: "belongs_to", target: data.book_id }]
    });
  }

  create_template(data = {}) {
    return this.create("template", { name: data.name || "untitled_template", data: { content: data.content || {} } });
  }

  create_workflow(data = {}) {
    return this.create("workflow", { name: data.name || "untitled_workflow", data: { stages: data.stages || [] } });
  }

  create_policy(data = {}) {
    return this.create("policy", { name: data.name || "untitled_policy", data: { rules: data.rules || [] } });
  }

  create_component(data = {}) {
    return this.create("component", { name: data.name || "untitled_component", data: { type: data.type || "div" } });
  }

  // ===== SEARCH =====
  search(query, type = null) {
    const results = [];
    const q = String(query || "").toLowerCase();
    for (const entity of this.entities.values()) {
      if (type && entity.type !== type) continue;
      const name = entity.name || "";
      if (name.toLowerCase().includes(q)) results.push(entity);
    }
    return results;
  }

  // ===== RESOLVE =====
  resolve_reference(ref) {
    if (!ref) return null;
    if (ref.id) return this.read(ref.id);
    if (ref.name) {
      const results = this.search(ref.name, ref.type);
      return results.length > 0 ? results[0] : null;
    }
    return null;
  }

  resolve_expression(expr, context = {}) {
    if (!expr) return null;
    if (expr.type === "entity_ref") return this.resolve_reference(expr);
    if (expr.type === "literal") return expr.value;
    if (expr.type === "variable") return context[expr.name] || null;
    return expr;
  }

  resolve_path(path, context = {}) {
    if (!path) return null;
    const parts = path.split(".");
    let current = context;
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        return null;
      }
    }
    return current;
  }

  resolve_slot(slot, context = {}) {
    if (!slot) return null;
    if (slot.type === "entity") return this.resolve_reference(slot);
    if (slot.type === "expression") return this.resolve_expression(slot, context);
    if (slot.type === "path") return this.resolve_path(slot.path, context);
    if (slot.type === "literal") return slot.value;
    return null;
  }

  resolve_route(route, context = {}) {
    if (!route) return null;
    if (route.path) return this.resolve_path(route.path, context);
    if (route.entity_id) return this.read(route.entity_id);
    return null;
  }

  resolve_provider(provider, context = {}) {
    if (!provider) return null;
    if (provider.id) return this.read(provider.id);
    if (provider.name) {
      const results = this.search(provider.name, "provider");
      return results.length > 0 ? results[0] : null;
    }
    return null;
  }

  // ===== PERSISTENCE =====
  save(key, data) {
    this.entities.set(`persist_${key}`, { key, data, saved_at: new Date().toISOString() });
    return true;
  }

  load(key) {
    const entity = this.entities.get(`persist_${key}`);
    return entity ? entity.data : null;
  }

  // ===== UNDO/REDO =====
  record_action(action, entity_id, before, after) {
    this.undo_stack.push({ action, entity_id, before, after });
    this.redo_stack = [];
  }

  undo() {
    if (this.undo_stack.length === 0) return null;
    const entry = this.undo_stack.pop();
    this.update(entry.entity_id, entry.before);
    this.redo_stack.push(entry);
    return entry;
  }

  redo() {
    if (this.redo_stack.length === 0) return null;
    const entry = this.redo_stack.pop();
    this.update(entry.entity_id, entry.after);
    this.undo_stack.push(entry);
    return entry;
  }

  // ===== AUDIT =====
  audit(action, target_id) {
    this.audit_records.push({
      action,
      target_id,
      timestamp: new Date().toISOString(),
      actor: this.config.actor || "system"
    });
  }

  get_audit_log() {
    return [...this.audit_records];
  }
}

export default action_entity;
export { action_entity };
