import {
  layout_names,
  render_profile_names,
  input_surface_names,
  editor_component_names,
  preview_state_names,
  validate_ui_word_dataset_arrays
} from "../utilities/dataset/code_shared_ui_word_datasets_v3_0_0_draft.js";

const PRODUCT_SURFACE_ENTITY_TYPES = [
  "application",
  "book",
  "cell",
  "view",
  "route",
  "command",
  "layout_node",
  "render_profile",
  "template",
  "state",
  "workflow",
  "policy"
];

const PRODUCT_TEMPLATE_DOMAINS = [
  "lms",
  "fintech_organization",
  "single_user_workspace",
  "research_workflow",
  "automation_workflow",
  "application_builder"
];

class product_surface {
  constructor(config = {}, ports = {}) {
    this.config = product_surface.normalize_config(config);
    this.ports = product_surface.normalize_ports(ports);
    this.templates = new Map();
    for (const template of product_surface.normalize_list(config.templates)) {
      this.register_template(template);
    }
  }

  register_template(template = {}) {
    const validation = this.validate_template(template);
    if (!validation.ok) {
      throw new Error(validation.errors.join("; "));
    }
    this.templates.set(template.id, product_surface.clone_value(template));
    return { ok: true, template: product_surface.clone_value(template) };
  }

  list_templates(filter = {}) {
    const out = [];
    for (const template of this.templates.values()) {
      if (filter.domain && template.domain !== filter.domain) continue;
      out.push(product_surface.clone_value(template));
    }
    return { ok: true, data: out };
  }

  read_template(id) {
    if (!this.templates.has(id)) {
      return { ok: false, errors: [`template '${id}' not found`] };
    }
    return { ok: true, template: product_surface.clone_value(this.templates.get(id)) };
  }

  instantiate_template(id, overrides = {}) {
    const result = this.read_template(id);
    if (!result.ok) return result;
    const template = result.template;
    const application = product_surface.merge_plain_objects(template.application || {}, overrides.application || {});
    application.id = application.id || `${template.id}_application`;
    application.type = "application";
    application.name = application.name || template.name || template.id;
    application.routes = product_surface.clone_value(template.routes || []);
    application.views = product_surface.clone_value(template.views || []);
    application.workflows = product_surface.clone_value(template.workflows || []);
    application.policies = product_surface.clone_value(template.policies || []);
    application.data = product_surface.merge_plain_objects(template.sample_data || {}, overrides.data || {});
    return {
      ok: true,
      template_id: template.id,
      application,
      entities: this.create_builder_model(application).entities
    };
  }

  create_builder_model(application = {}) {
    const errors = this.validate_application(application).errors;
    if (errors.length > 0) {
      return { ok: false, errors, entities: [] };
    }

    const app = product_surface.normalize_entity(application, "application");
    const entities = [app];
    for (const route of product_surface.normalize_list(application.routes)) {
      entities.push(product_surface.normalize_child_entity(route, "route", app.id));
    }
    for (const view of product_surface.normalize_list(application.views)) {
      entities.push(product_surface.normalize_child_entity(view, "view", app.id));
    }
    for (const workflow of product_surface.normalize_list(application.workflows)) {
      entities.push(product_surface.normalize_child_entity(workflow, "workflow", app.id));
    }
    for (const command of product_surface.normalize_list(application.commands)) {
      entities.push(product_surface.normalize_child_entity(command, "command", app.id));
    }
    for (const state of product_surface.normalize_list(application.states)) {
      entities.push(product_surface.normalize_child_entity(state, "state", app.id));
    }

    return {
      ok: true,
      application: app,
      entities,
      relationships: product_surface.extract_relationships(entities),
      ports: Object.keys(this.ports)
    };
  }

  create_layout_projection(entity = {}, render_profile = "json_as_document") {
    if (entity && entity.entity) return this.create_layout_projection_from_config(entity);
    const errors = [];
    if (!entity || typeof entity !== "object" || Array.isArray(entity)) errors.push("entity must be an object");
    if (!render_profile_names.includes(render_profile)) errors.push(`render_profile '${render_profile}' is not approved`);
    if (errors.length > 0) return { ok: false, errors };
    return {
      ok: true,
      projection: {
        id: `projection_${entity.id || entity.name || "entity"}`,
        type: "layout_projection",
        source_entity_id: entity.id || null,
        render_profile,
        layout: product_surface.layout_for_render_profile(render_profile),
        preview_state: "ready",
        data: product_surface.clone_value(entity)
      }
    };
  }

  create_layout_projection_from_config(config = {}) {
    const entity = config.entity || {};
    const layout = config.layout || product_surface.layout_for_render_profile(config.render_profile || this.config.default_render_profile);
    const layout_validation = this.validate_layout_name({ layout });
    const errors = [];
    if (!entity || typeof entity !== "object" || Array.isArray(entity)) errors.push("entity must be an object");
    errors.push(...layout_validation.errors);
    if (errors.length > 0) return { ok: false, errors };
    return {
      ok: true,
      data: {
        id: `projection_${layout}_${entity.id || entity.name || "entity"}`,
        type: "layout_projection",
        source_entity_id: entity.id || null,
        layout,
        render_profile: config.render_profile || product_surface.render_profile_for_layout(layout),
        preview_state: "ready",
        data: product_surface.clone_value(entity)
      },
      errors: []
    };
  }

  validate_layout_name(config = {}) {
    const layout = typeof config === "string" ? config : config.layout;
    const ok = layout_names.includes(layout);
    return { ok, data: ok ? { layout } : null, errors: ok ? [] : [`layout '${layout}' is not approved`] };
  }

  render_layout(config = {}) {
    const projection = this.create_layout_projection_from_config(config);
    if (!projection.ok) return projection;
    const entity = projection.data.data;
    const layout = projection.data.layout;
    return {
      ok: true,
      data: {
        type: "render_output",
        layout,
        source_entity_id: projection.data.source_entity_id,
        rows: product_surface.rows_for_layout(entity, layout)
      },
      errors: []
    };
  }

  switch_layout(config = {}) {
    const before = product_surface.clone_value(config.entity || {});
    const output = this.render_layout(config);
    if (!output.ok) return output;
    const after = product_surface.clone_value(config.entity || {});
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      return { ok: false, data: null, errors: ["layout switch mutated source entity"] };
    }
    return output;
  }

  compare_layout_output(config = {}) {
    const entity = config.entity || {};
    const layouts = product_surface.normalize_list(config.layouts);
    const outputs = [];
    const errors = [];
    for (const layout of layouts) {
      const output = this.switch_layout({ entity, layout });
      if (!output.ok) errors.push(...output.errors);
      else outputs.push(output.data);
    }
    const ids = new Set(outputs.map((output) => output.source_entity_id));
    if (ids.size > 1) errors.push("layout outputs do not preserve one source entity id");
    return { ok: errors.length === 0, data: { source_entity_id: entity.id || null, outputs }, errors };
  }

  create_command_surface(config = {}) {
    const surface = {
      id: config.id || "command_surface_default",
      type: "command_surface",
      input_surface: config.input_surface || "command_bar",
      command_intent_port: "command_intent_port",
      supported_actions: product_surface.normalize_list(config.supported_actions)
    };
    const errors = [];
    if (!input_surface_names.includes(surface.input_surface)) errors.push("input_surface is not approved");
    return { ok: errors.length === 0, surface, errors };
  }

  create_editor_surface(config = {}) {
    const components = product_surface.normalize_list(config.components || ["json_text_editor", "layout_switcher", "render_profile_picker"]);
    const errors = [];
    for (const component of components) {
      if (!editor_component_names.includes(component)) errors.push(`component '${component}' is not approved`);
    }
    return {
      ok: errors.length === 0,
      errors,
      surface: {
        id: config.id || "editor_surface_default",
        type: "editor_surface",
        components,
        editable: config.editable !== false
      }
    };
  }

  create_preview_path(application = {}) {
    const validation = this.validate_application(application);
    if (!validation.ok) return validation;
    return {
      ok: true,
      preview: {
        id: `preview_${application.id}`,
        type: "app_preview_path",
        application_id: application.id,
        path: `/preview/${application.id}`,
        preview_state: "ready"
      }
    };
  }

  create_ui_e2e_checklist() {
    return {
      ok: true,
      checklist: [
        "builder_boots_from_application_entity",
        "same_data_renders_in_multiple_layouts",
        "book_cell_view_route_state_are_entities",
        "command_surface_uses_mock_command_intent_port",
        "template_expands_to_valid_application_entity",
        "preview_path_is_created",
        "desktop_visual_check_passes",
        "mobile_visual_check_passes"
      ]
    };
  }

  validate_application(application = {}) {
    const errors = [];
    if (!application || typeof application !== "object" || Array.isArray(application)) errors.push("application must be an object");
    if (application.type && application.type !== "application") errors.push("application type must be application");
    if (!application.id) errors.push("application id is required");
    if (!application.name) errors.push("application name is required");
    for (const route of product_surface.normalize_list(application.routes)) {
      if (!route.id && !route.name) errors.push("route requires id or name");
      if (!route.path || !String(route.path).startsWith("/")) errors.push("route path must start with /");
    }
    for (const view of product_surface.normalize_list(application.views)) {
      if (!view.id && !view.name) errors.push("view requires id or name");
      if (view.layout && !layout_names.includes(view.layout)) errors.push(`layout '${view.layout}' is not approved`);
      if (view.render_profile && !render_profile_names.includes(view.render_profile)) errors.push(`render_profile '${view.render_profile}' is not approved`);
    }
    return { ok: errors.length === 0, errors };
  }

  validate_template(template = {}) {
    const errors = [];
    if (!template || typeof template !== "object" || Array.isArray(template)) errors.push("template must be an object");
    if (!template.id) errors.push("template id is required");
    if (!template.name) errors.push("template name is required");
    if (!PRODUCT_TEMPLATE_DOMAINS.includes(template.domain)) errors.push("template domain is not approved");
    if (!template.application || typeof template.application !== "object") errors.push("template application is required");
    const app_validation = template.application ? this.validate_application({
      ...template.application,
      routes: template.routes || template.application.routes || [],
      views: template.views || template.application.views || [],
      workflows: template.workflows || template.application.workflows || []
    }) : { ok: false, errors: [] };
    errors.push(...app_validation.errors);
    return { ok: errors.length === 0, errors };
  }

  validate_datasets() {
    return validate_ui_word_dataset_arrays({
      product_surface_entity_types: PRODUCT_SURFACE_ENTITY_TYPES,
      product_template_domains: PRODUCT_TEMPLATE_DOMAINS,
      layout_names,
      render_profile_names,
      preview_state_names
    });
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      default_render_profile: config.default_render_profile || "json_as_document",
      templates: product_surface.normalize_list(config.templates)
    };
  }

  static normalize_ports(ports = {}) {
    return {
      entity_store_port: ports.entity_store_port || null,
      runner_port: ports.runner_port || null,
      command_intent_port: ports.command_intent_port || null,
      template_port: ports.template_port || null,
      version_port: ports.version_port || null
    };
  }

  static normalize_entity(input = {}, type = "entity") {
    return {
      id: input.id,
      type,
      name: input.name || input.id,
      status: input.status || "draft",
      data: product_surface.clone_value(input.data || {}),
      relationships: product_surface.normalize_list(input.relationships)
    };
  }

  static normalize_child_entity(input = {}, type, parent_id) {
    const id = input.id || `${parent_id}_${type}_${input.name || "item"}`;
    return {
      id,
      type,
      name: input.name || id,
      status: input.status || "draft",
      data: product_surface.clone_value(input.data || {}),
      path: input.path || null,
      layout: input.layout || null,
      render_profile: input.render_profile || null,
      relationships: product_surface.normalize_list(input.relationships).concat([{ type: "belongs_to", to: parent_id }])
    };
  }

  static extract_relationships(entities = []) {
    const out = [];
    for (const entity of entities) {
      for (const relationship of product_surface.normalize_list(entity.relationships)) {
        out.push({
          from: entity.id,
          type: relationship.type,
          to: relationship.to
        });
      }
    }
    return out;
  }

  static layout_for_render_profile(render_profile) {
    const mapping = {
      json_as_notebook: "notebook",
      json_as_text: "code_editor",
      json_as_tree: "tree",
      json_as_document: "block_editor",
      json_as_diagram: "diagram",
      json_as_table: "table",
      json_as_cards: "card_view",
      json_as_kanban: "board",
      json_as_board: "board",
      json_as_calendar: "calendar_view",
      json_as_timeline: "timeline",
      json_as_dashboard: "dashboard",
      json_as_flowchart: "flowchart_view",
      json_as_mindmap: "mindmap_view"
    };
    return mapping[render_profile] || "document_view";
  }

  static render_profile_for_layout(layout) {
    const mapping = {
      notebook: "json_as_document",
      code_editor: "json_as_text",
      block_editor: "json_as_document",
      tree: "json_as_tree",
      table: "json_as_table",
      board: "json_as_kanban",
      calendar: "json_as_calendar",
      timeline: "json_as_document",
      diagram: "json_as_diagram",
      dashboard: "json_as_cards"
    };
    return mapping[layout] || "json_as_document";
  }

  static rows_for_layout(entity = {}, layout = "block_editor") {
    const base = [
      { key: "id", value: entity.id || "" },
      { key: "type", value: entity.type || "" },
      { key: "name", value: entity.name || "" }
    ];
    if (layout === "dashboard") return base.concat([{ key: "status", value: entity.status || "draft" }]);
    if (layout === "calendar") return base.concat([{ key: "date", value: entity.date || entity.created_at || "unscheduled" }]);
    if (layout === "timeline") return base.concat([{ key: "sequence", value: entity.version || "0.1.0" }]);
    if (layout === "board") return base.concat([{ key: "lane", value: entity.status || "draft" }]);
    return base;
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static merge_plain_objects(a = {}, b = {}) {
    return { ...a, ...b };
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }
}

export { product_surface, PRODUCT_SURFACE_ENTITY_TYPES, PRODUCT_TEMPLATE_DOMAINS };
export default product_surface;
