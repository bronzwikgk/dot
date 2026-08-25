import { action_entity } from "./code_shared_action_entity_v3_1_0_draft.js";

class version_system {
  constructor(config = {}, options = {}) {
    this.config = { actor: config.actor || "agent_codex_an_app", ...config };
    this.entity_store = options.entity_store || new action_entity("version_records", {
      actor: this.config.actor,
      allow_unknown_types: true,
      allow_unknown_relationship_types: true,
      allow_unknown_operations: true
    });
  }

  async snapshot_entity(entity, options = {}) {
    version_system.assert_plain_object(entity, "entity");
    if (!entity.id) throw new Error("entity id is required");
    const version_id = options.version_id || `version_${entity.id}_${Date.now()}`;
    const record = {
      id: version_id,
      type: "version_record",
      name: version_id,
      status: "active",
      relationships: [{ type: "documents", to: entity.id, attributes: { reason: "snapshot" } }],
      attributes: {
        entity_id: entity.id,
        parent_version_ids: version_system.normalize_list(options.parent_version_ids),
        summary: options.summary || "snapshot_entity",
        created_by: options.actor || this.config.actor,
        created_at: new Date().toISOString(),
        validation_result: options.validation_result || { ok: true }
      },
      data: version_system.clone_value(entity)
    };
    version_system.assert_valid_version_record(record);
    return this.entity_store.create(record);
  }

  diff_entity(before, after) {
    version_system.assert_plain_object(before, "before entity");
    version_system.assert_plain_object(after, "after entity");
    const changes = [];
    const keys = version_system.unique_list(Object.keys(before).concat(Object.keys(after)));
    for (const key of keys) {
      const left = before[key];
      const right = after[key];
      if (JSON.stringify(left) !== JSON.stringify(right)) {
        changes.push({ path: key, before: version_system.clone_value(left), after: version_system.clone_value(right) });
      }
    }
    return { ok: true, type: "diff_record", changes, change_count: changes.length };
  }

  async branch_entity(entity, options = {}) {
    version_system.assert_plain_object(entity, "entity");
    if (!entity.id) throw new Error("entity id is required");
    const branch_id = options.branch_id || `branch_${entity.id}_${Date.now()}`;
    const record = {
      id: branch_id,
      type: "branch_record",
      name: branch_id,
      status: "active",
      relationships: [{ type: "documents", to: entity.id, attributes: { reason: "branch" } }],
      attributes: {
        entity_id: entity.id,
        base_version_id: options.base_version_id || null,
        branch_status: options.branch_status || "draft",
        owner: options.owner || this.config.actor
      }
    };
    version_system.assert_valid_branch_record(record);
    return this.entity_store.create(record);
  }

  merge_entity(base, incoming, options = {}) {
    version_system.assert_plain_object(base, "base entity");
    version_system.assert_plain_object(incoming, "incoming entity");
    const current = options.current || base;
    version_system.assert_plain_object(current, "current entity");
    const conflicts = [];
    const merged = version_system.clone_value(current);
    const keys = version_system.unique_list(Object.keys(base).concat(Object.keys(current), Object.keys(incoming)));
    for (const key of keys) {
      if (key === "id") continue;
      const base_value = base[key];
      const current_value = current[key];
      const incoming_value = incoming[key];
      const current_changed = JSON.stringify(base_value) !== JSON.stringify(current_value);
      const incoming_changed = JSON.stringify(base_value) !== JSON.stringify(incoming_value);
      const same_change = JSON.stringify(current_value) === JSON.stringify(incoming_value);
      if (current_changed && incoming_changed && !same_change) {
        conflicts.push({
          path: key,
          base: version_system.clone_value(base_value),
          current: version_system.clone_value(current_value),
          incoming: version_system.clone_value(incoming_value),
          status: "needs_review"
        });
        continue;
      }
      if (incoming_changed) merged[key] = version_system.clone_value(incoming_value);
    }
    return {
      ok: conflicts.length === 0,
      type: "merge_record",
      merged,
      conflicts,
      conflict_count: conflicts.length,
      validation_result: conflicts.length === 0 ? { ok: true } : { ok: false, errors: ["merge conflicts require review"] }
    };
  }

  restore_entity(version_record, options = {}) {
    version_system.assert_plain_object(version_record, "version record");
    version_system.assert_valid_version_record(version_record);
    if (!version_record.data) throw new Error("version record data is required");
    return {
      ok: true,
      type: "restore_record",
      mode: options.mode || "draft",
      approval_ref: options.approval_ref || null,
      entity: version_system.clone_value(version_record.data),
      audit: {
        restored_from: version_record.id,
        actor: options.actor || this.config.actor,
        created_at: new Date().toISOString()
      }
    };
  }

  trace_provenance(records = []) {
    const trace = [];
    for (const record of version_system.normalize_list(records)) {
      if (!record || !record.data) continue;
      trace.push({
        version_id: record.id,
        entity_id: record.attributes ? record.attributes.entity_id : null,
        created_by: record.attributes ? record.attributes.created_by : null,
        created_at: record.attributes ? record.attributes.created_at : null,
        summary: record.attributes ? record.attributes.summary : null
      });
    }
    return { ok: true, type: "provenance_trace", trace };
  }

  static assert_plain_object(value, label) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static unique_list(items) {
    return Array.from(new Set(items));
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static assert_valid_version_record(record) {
    const errors = [];
    if (!record.id) errors.push("version record id is required");
    if (record.type !== "version_record") errors.push("version record type must be version_record");
    if (!record.attributes || !record.attributes.entity_id) errors.push("version record entity_id is required");
    if (!record.data || typeof record.data !== "object" || Array.isArray(record.data)) errors.push("version record data must be an object");
    if (errors.length > 0) throw new Error(errors.join("; "));
  }

  static assert_valid_branch_record(record) {
    const errors = [];
    if (!record.id) errors.push("branch record id is required");
    if (record.type !== "branch_record") errors.push("branch record type must be branch_record");
    if (!record.attributes || !record.attributes.entity_id) errors.push("branch record entity_id is required");
    if (errors.length > 0) throw new Error(errors.join("; "));
  }
}

export { version_system };
export default version_system;
