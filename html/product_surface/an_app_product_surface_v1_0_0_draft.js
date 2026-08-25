const product_surface_templates = [
  {
    id: "template_application_builder_v1",
    name: "Application Builder",
    domain: "application_builder",
    entities: ["application", "template", "flow", "view", "component", "dataset"],
    flows: ["command_to_structure", "template_to_application", "application_preview"],
    layouts: ["json_as_document", "json_as_tree", "json_as_diagram", "json_as_table"]
  },
  {
    id: "template_lms_v1",
    name: "Learning Management",
    domain: "lms",
    entities: ["organization", "course", "lesson", "learner", "assessment", "certificate"],
    flows: ["course_authoring", "learner_progress", "assessment_review"],
    layouts: ["json_as_document", "json_as_tree", "json_as_dashboard", "json_as_calendar"]
  },
  {
    id: "template_fintech_organization_v1",
    name: "Fintech Organization",
    domain: "fintech_organization",
    entities: ["organization", "account", "customer", "payment", "ledger_entry", "policy"],
    flows: ["customer_onboarding", "payment_review", "ledger_audit"],
    layouts: ["json_as_document", "json_as_table", "json_as_dashboard", "json_as_timeline"]
  },
  {
    id: "template_research_workflow_v1",
    name: "Research Workflow",
    domain: "research_workflow",
    entities: ["project", "source", "note", "claim", "evidence", "report"],
    flows: ["source_intake", "evidence_mapping", "report_generation"],
    layouts: ["json_as_document", "json_as_tree", "json_as_diagram", "json_as_board"]
  },
  {
    id: "template_automation_workflow_v1",
    name: "Automation Workflow",
    domain: "automation_workflow",
    entities: ["trigger", "action", "schedule", "condition", "run", "audit_event"],
    flows: ["schedule_trigger", "condition_check", "run_audit"],
    layouts: ["json_as_diagram", "json_as_table", "json_as_timeline", "json_as_dashboard"]
  },
  {
    id: "template_single_user_workspace_v1",
    name: "Single User Workspace",
    domain: "single_user_workspace",
    entities: ["user", "workspace", "book", "cell", "note", "task"],
    flows: ["capture_note", "organize_book", "task_review"],
    layouts: ["json_as_document", "json_as_tree", "json_as_board", "json_as_calendar"]
  }
];

class an_app_product_surface_controller {
  constructor(config = {}) {
    this.templates = Array.isArray(config.templates) ? config.templates : [];
    this.active_template_id = config.active_template_id || "template_application_builder_v1";
    this.active_profile = config.active_profile || "json_as_document";
    this.nodes = {};
  }

  boot() {
    this.nodes.template_list = document.getElementById("template_list");
    this.nodes.command_input = document.getElementById("command_input");
    this.nodes.run_button = document.getElementById("run_button");
    this.nodes.app_name = document.getElementById("app_name");
    this.nodes.preview_path = document.getElementById("preview_path");
    this.nodes.summary_grid = document.getElementById("summary_grid");
    this.nodes.projection_title = document.getElementById("projection_title");
    this.nodes.projection_view = document.getElementById("projection_view");
    this.nodes.audit_view = document.getElementById("audit_view");
    this.nodes.validation_label = document.getElementById("validation_label");
    this.nodes.profile_buttons = Array.from(document.querySelectorAll("[data-profile]"));
    this.nodes.run_button.addEventListener("click", this.run_command.bind(this));
    this.nodes.command_input.addEventListener("keydown", this.handle_command_keydown.bind(this));
    for (const button of this.nodes.profile_buttons) {
      button.addEventListener("click", this.handle_profile_click.bind(this));
    }
    this.render_all();
  }

  handle_command_keydown(event) {
    if (event.key === "Enter") this.run_command();
  }

  handle_template_click(event) {
    this.active_template_id = event.currentTarget.dataset.template_id;
    this.render_all();
  }

  handle_profile_click(event) {
    this.active_profile = event.currentTarget.dataset.profile;
    this.render_all();
  }

  run_command() {
    const command_text = this.nodes.command_input.value || "";
    this.active_template_id = this.select_template_from_command(command_text);
    this.nodes.validation_label.textContent = "command parsed";
    this.render_all();
  }

  select_template_from_command(command_text) {
    const value = String(command_text).toLowerCase();
    if (value.includes("course") || value.includes("learning") || value.includes("lms")) return "template_lms_v1";
    if (value.includes("finance") || value.includes("fintech") || value.includes("payment")) return "template_fintech_organization_v1";
    if (value.includes("research") || value.includes("source")) return "template_research_workflow_v1";
    if (value.includes("automation") || value.includes("schedule")) return "template_automation_workflow_v1";
    if (value.includes("workspace") || value.includes("single")) return "template_single_user_workspace_v1";
    return "template_application_builder_v1";
  }

  current_template() {
    for (const template of this.templates) {
      if (template.id === this.active_template_id) return template;
    }
    return this.templates[0];
  }

  render_all() {
    const template = this.current_template();
    this.render_templates();
    this.render_profile_tabs();
    this.render_summary(template);
    this.render_projection(template);
    this.render_audit(template);
  }

  render_templates() {
    this.nodes.template_list.replaceChildren();
    for (const template of this.templates) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = template.id === this.active_template_id ? "template_button active" : "template_button";
      button.dataset.template_id = template.id;
      button.textContent = template.name;
      button.addEventListener("click", this.handle_template_click.bind(this));
      this.nodes.template_list.appendChild(button);
    }
  }

  render_profile_tabs() {
    for (const button of this.nodes.profile_buttons) {
      button.classList.toggle("active", button.dataset.profile === this.active_profile);
    }
  }

  render_summary(template) {
    this.nodes.app_name.textContent = `${template.domain}_application`;
    this.nodes.preview_path.textContent = `/preview/app_${template.domain}_demo`;
    const items = [
      ["Entities", template.entities.length],
      ["Flows", template.flows.length],
      ["Layouts", template.layouts.length],
      ["Status", "ready"]
    ];
    this.nodes.summary_grid.replaceChildren();
    for (const item of items) {
      const box = document.createElement("div");
      box.className = "summary_item";
      const value = document.createElement("strong");
      const label = document.createElement("span");
      value.textContent = item[1];
      label.textContent = item[0];
      box.append(value, label);
      this.nodes.summary_grid.appendChild(box);
    }
  }

  render_projection(template) {
    const title = this.profile_title(this.active_profile);
    this.nodes.projection_title.textContent = title;
    this.nodes.projection_view.replaceChildren();
    if (this.active_profile === "json_as_tree") this.render_tree(template);
    else if (this.active_profile === "json_as_diagram") this.render_diagram(template);
    else if (this.active_profile === "json_as_table") this.render_table(template);
    else this.render_blocks(template);
  }

  render_blocks(template) {
    const groups = [
      ["Domain", template.domain],
      ["Entities", template.entities.join(", ")],
      ["Flows", template.flows.join(", ")],
      ["Layouts", template.layouts.join(", ")]
    ];
    for (const group of groups) {
      const row = document.createElement("div");
      row.className = "block_row";
      row.textContent = `${group[0]}: ${group[1]}`;
      this.nodes.projection_view.appendChild(row);
    }
  }

  render_tree(template) {
    const root = document.createElement("div");
    root.className = "tree_row";
    root.style.setProperty("--indent", "0px");
    root.textContent = template.name;
    this.nodes.projection_view.appendChild(root);
    for (const entity of template.entities) {
      const row = document.createElement("div");
      row.className = "tree_row";
      row.style.setProperty("--indent", "24px");
      row.textContent = entity;
      this.nodes.projection_view.appendChild(row);
    }
  }

  render_diagram(template) {
    const wrapper = document.createElement("div");
    wrapper.className = "diagram_view";
    for (const flow of template.flows) {
      const node = document.createElement("div");
      node.className = "diagram_node";
      node.textContent = `${template.domain} -> ${flow}`;
      wrapper.appendChild(node);
    }
    this.nodes.projection_view.appendChild(wrapper);
  }

  render_table(template) {
    const table = document.createElement("table");
    table.className = "table_view";
    const body = document.createElement("tbody");
    const rows = [
      ["domain", template.domain],
      ["entities", template.entities.join(", ")],
      ["flows", template.flows.join(", ")],
      ["layouts", template.layouts.join(", ")]
    ];
    for (const row_value of rows) {
      const row = document.createElement("tr");
      const key = document.createElement("th");
      const value = document.createElement("td");
      key.textContent = row_value[0];
      value.textContent = row_value[1];
      row.append(key, value);
      body.appendChild(row);
    }
    table.appendChild(body);
    this.nodes.projection_view.appendChild(table);
  }

  render_audit(template) {
    const rows = [
      ["template", template.id],
      ["branch", "dot_agent_codex_an_app_v1"],
      ["pipeline", "command_to_application"],
      ["validation", "passed"]
    ];
    this.nodes.audit_view.replaceChildren();
    for (const row of rows) {
      const term = document.createElement("dt");
      const value = document.createElement("dd");
      term.textContent = row[0];
      value.textContent = row[1];
      this.nodes.audit_view.append(term, value);
    }
  }

  profile_title(profile) {
    const titles = {
      json_as_document: "Block Editor",
      json_as_tree: "Tree",
      json_as_diagram: "Diagram",
      json_as_table: "Table"
    };
    return titles[profile] || "Block Editor";
  }
}

const an_app_product_surface = new an_app_product_surface_controller({
  templates: product_surface_templates
});

an_app_product_surface.boot();
