import { action_entity } from "./code_shared_action_entity_v3_1_0_draft.js";
import { runner } from "./code_shared_runner_v3_0_0_draft.js";

class app_shell {
  constructor(config = {}, options = {}) {
    this.config = app_shell.normalize_config(config);
    this.entity_store = options.entity_store || new action_entity("app_shell_entities", {
      actor: this.config.actor,
      allow_unknown_types: true,
      allow_unknown_relationship_types: true,
      allow_unknown_operations: true
    });
    this.runner = options.runner || new runner({
      actions: options.actions || null,
      validator: options.validator || null,
      limits: this.config.limits || {}
    });
    this.boots = new Map();
  }

  async boot(application_entity = {}, options = {}) {
    const validation = this.validate_application_entity(application_entity);
    if (!validation.ok) {
      return this.create_boot_result("failed", null, validation.errors, []);
    }

    const app_result = await this.entity_store.create({
      ...application_entity,
      type: application_entity.type || "application",
      status: application_entity.status || "active"
    });
    const app_record = app_result.data;
    const created_records = [];

    for (const route of app_shell.normalize_list(application_entity.routes)) {
      created_records.push((await this.entity_store.create(app_shell.normalize_child_entity(route, "route", app_record.id))).data);
    }
    for (const view of app_shell.normalize_list(application_entity.views)) {
      created_records.push((await this.entity_store.create(app_shell.normalize_child_entity(view, "view", app_record.id))).data);
    }
    for (const provider of app_shell.normalize_list(application_entity.providers)) {
      created_records.push((await this.entity_store.create(app_shell.normalize_child_entity(provider, "provider", app_record.id))).data);
    }
    for (const workflow of app_shell.normalize_list(application_entity.workflows)) {
      if (workflow.name && workflow.plan) this.runner.register_plan(workflow.name, workflow.plan);
      created_records.push((await this.entity_store.create(app_shell.normalize_child_entity(workflow, "workflow", app_record.id))).data);
    }

    const audit_record = await this.create_audit_record(app_record, created_records, options);
    const route_ids = [];
    const view_ids = [];
    const provider_ids = [];
    const workflow_ids = [];
    for (const record of created_records) {
      if (record.type === "route") route_ids.push(record.id);
      if (record.type === "view") view_ids.push(record.id);
      if (record.type === "provider") provider_ids.push(record.id);
      if (record.type === "workflow") workflow_ids.push(record.id);
    }
    const boot_record = {
      id: `boot_${Date.now()}`,
      application_id: app_record.id,
      status: "completed",
      routes: route_ids,
      views: view_ids,
      providers: provider_ids,
      workflows: workflow_ids,
      audit_id: audit_record.id
    };
    this.boots.set(boot_record.id, app_shell.clone_value(boot_record));
    return { ok: true, status: "completed", application: app_record, records: created_records, audit: audit_record, boot: boot_record };
  }

  validate_application_entity(application_entity = {}) {
    const errors = [];
    if (!application_entity || typeof application_entity !== "object" || Array.isArray(application_entity)) errors.push("application entity must be an object");
    if (application_entity && application_entity.type && application_entity.type !== "application" && application_entity.type !== "app") errors.push("application entity type must be application or app");
    if (application_entity && !application_entity.id) errors.push("application entity id is required");
    if (application_entity && !application_entity.name) errors.push("application entity name is required");
    const child_ids = new Set();
    for (const route of app_shell.normalize_list(application_entity && application_entity.routes)) {
      errors.push(...app_shell.validate_child_record(route, "route", child_ids));
      if (route && !route.path) errors.push("route requires path");
      if (route && route.path && !String(route.path).startsWith("/")) errors.push("route path must start with /");
    }
    for (const view of app_shell.normalize_list(application_entity && application_entity.views)) {
      errors.push(...app_shell.validate_child_record(view, "view", child_ids));
      if (!view.layout && !view.render_profile) errors.push("view requires layout or render_profile");
    }
    for (const provider of app_shell.normalize_list(application_entity && application_entity.providers)) {
      errors.push(...app_shell.validate_child_record(provider, "provider", child_ids));
    }
    for (const workflow of app_shell.normalize_list(application_entity && application_entity.workflows)) {
      errors.push(...app_shell.validate_child_record(workflow, "workflow", child_ids));
      if (workflow && workflow.plan) {
        try {
          this.runner._validate_plan_contract(this.runner._prepare_plan(workflow.plan));
        } catch (error) {
          errors.push(`workflow '${workflow.name || workflow.id || "unnamed_workflow"}' plan is invalid: ${error.message}`);
        }
      }
    }
    return { ok: errors.length === 0, errors };
  }

  async create_audit_record(application, records, options = {}) {
    const audit = {
      id: `audit_${application.id}_${Date.now()}`,
      type: "audit_log",
      name: `boot_audit_${application.id}`,
      status: "active",
      relationships: [{ type: "documents", to: application.id, attributes: { reason: "boot_audit" } }],
      attributes: {
        event: "boot_application",
        record_count: records.length,
        actor: options.actor || this.config.actor,
        created_at: new Date().toISOString()
      }
    };
    return (await this.entity_store.create(audit)).data;
  }

  create_boot_result(status, application, errors, records) {
    return { ok: status === "completed", status, application, errors, records, audit: null };
  }

  async get_state() {
    const result = await this.entity_store.query();
    return { ok: true, data: result.data, boots: Array.from(this.boots.values()).map(app_shell.clone_value) };
  }

  static normalize_config(config) {
    return {
      actor: config.actor || "agent_codex_an_app",
      limits: config.limits || {}
    };
  }

  static normalize_child_entity(input, type, application_id) {
    const name = input.name || input.id || `${type}_${Date.now()}`;
    return {
      ...input,
      id: input.id || `${application_id}.${name}`,
      type,
      name,
      status: input.status || "active",
      relationships: app_shell.normalize_list(input.relationships).concat([{ type: "belongs_to", to: application_id, attributes: {} }])
    };
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static validate_child_record(record, type, seen_ids) {
    const errors = [];
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      errors.push(`${type} must be an object`);
      return errors;
    }
    if (!record.id && !record.name) errors.push(`${type} requires id or name`);
    const id = record.id || record.name;
    if (id && seen_ids.has(id)) errors.push(`duplicate child id '${id}'`);
    if (id) seen_ids.add(id);
    return errors;
  }
}

export { app_shell };
export default app_shell;
