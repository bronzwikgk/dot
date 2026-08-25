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
    this.search_state = { query: "", hits: [], active_index: -1 };
    this.command_records = [];
  }

  boot() {
    this.write_boot_marker("started");
    this.nodes.mount = document.getElementById("an_app_mount");
    if (!this.nodes.mount) {
      this.report_boot_error("mount target 'an_app_mount' not found");
      return;
    }
    this.nodes.template_list = document.getElementById("template_list");
    this.nodes.command_input = document.getElementById("command_input");
    this.nodes.run_button = document.getElementById("run_button");
    this.nodes.search_input = document.getElementById("search_input");
    this.nodes.clear_search_button = document.getElementById("clear_search_button");
    this.nodes.search_count = document.getElementById("search_count");
    this.nodes.cell_editor = document.getElementById("cell_editor");
    this.nodes.cell_output = document.getElementById("cell_output");
    this.nodes.run_cell_button = document.getElementById("run_cell_button");
    this.nodes.run_all_button = document.getElementById("run_all_button");
    this.nodes.app_name = document.getElementById("app_name");
    this.nodes.preview_path = document.getElementById("preview_path");
    this.nodes.summary_grid = document.getElementById("summary_grid");
    this.nodes.projection_title = document.getElementById("projection_title");
    this.nodes.projection_view = document.getElementById("projection_view");
    this.nodes.audit_view = document.getElementById("audit_view");
    this.nodes.validation_label = document.getElementById("validation_label");
    this.nodes.profile_buttons = Array.from(document.querySelectorAll("[data-profile]"));
    this.nodes.run_button.addEventListener("click", this.handle_run_click.bind(this));
    this.nodes.command_input.addEventListener("keydown", this.handle_command_keydown.bind(this));
    this.nodes.search_input.addEventListener("input", this.handle_search_input.bind(this));
    this.nodes.search_input.addEventListener("keydown", this.handle_search_keydown.bind(this));
    this.nodes.clear_search_button.addEventListener("click", this.clear_search_hits.bind(this));
    this.nodes.run_cell_button.addEventListener("click", this.handle_run_cell_click.bind(this));
    this.nodes.run_all_button.addEventListener("click", this.handle_run_all_click.bind(this));
    this.nodes.cell_editor.addEventListener("focus", this.enter_edit_mode.bind(this));
    this.nodes.cell_editor.addEventListener("blur", this.exit_edit_mode.bind(this));
    document.addEventListener("keydown", this.handle_global_keydown.bind(this));
    for (const button of this.nodes.profile_buttons) {
      button.addEventListener("click", this.handle_profile_click.bind(this));
    }
    this.register_default_commands();
    this.render_all();
    this.write_boot_marker("ready");
  }

  write_boot_marker(status) {
    window.__an_app_boot_marker__ = {
      type: "boot_marker",
      status,
      ready: status === "ready",
      failed: status === "failed"
    };
  }

  report_boot_error(message) {
    window.__an_app_boot_marker__ = {
      type: "boot_marker",
      status: "failed",
      ready: false,
      failed: true,
      detail: message
    };
    if (this.nodes.validation_label) this.nodes.validation_label.textContent = "boot failed";
  }

  handle_command_keydown(event) {
    if (event.key === "Enter") this.execute_command({ action: "run_cell" });
  }

  handle_run_click() {
    this.execute_command({ selector: "#run_button", action: "run_cell" });
  }

  handle_run_cell_click() {
    this.execute_command({ selector: "#run_cell_button", action: "run_cell" });
  }

  handle_run_all_click() {
    this.execute_command({ selector: "#run_all_button", action: "run_all" });
  }

  handle_search_input(event) {
    this.search_workspace(event.currentTarget.value);
  }

  handle_search_keydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.execute_command({ action: "search_next" });
    }
  }

  handle_global_keydown(event) {
    const combo = this.event_combo(event);
    const command = this.resolve_command_from_keyboard(combo);
    if (!command) return;
    event.preventDefault();
    this.execute_command({ keyboard: combo, action: command.action });
  }

  handle_template_click(event) {
    this.active_template_id = event.currentTarget.dataset.template_id;
    this.render_all();
  }

  handle_profile_click(event) {
    this.active_profile = event.currentTarget.dataset.profile;
    this.render_all();
  }

  register_default_commands() {
    this.register_command({
      id: "run_cell_from_button",
      action: "run_cell",
      selector: "#run_button",
      keyboard: "ctrl+enter",
      method: "run_command"
    });
    this.register_command({
      id: "run_cell_from_cell_rail",
      action: "run_cell",
      selector: "#run_cell_button",
      keyboard: "ctrl+s",
      method: "run_active_cell"
    });
    this.register_command({
      id: "run_all_from_cell_rail",
      action: "run_all",
      selector: "#run_all_button",
      keyboard: "ctrl+shift+enter",
      method: "run_all_cells"
    });
    this.register_command({
      id: "search_next_from_keyboard",
      action: "search_next",
      selector: "#search_input",
      keyboard: "enter",
      method: "move_to_next_hit"
    });
    this.register_command({
      id: "clear_search_from_button",
      action: "blur_editor",
      selector: "#clear_search_button",
      keyboard: "escape",
      method: "clear_search_hits"
    });
  }

  register_command(config) {
    this.command_records.push({
      type: "command_record",
      id: config.id,
      action: config.action,
      selector: config.selector,
      keyboard: config.keyboard,
      method: config.method
    });
  }

  resolve_command_from_action(action) {
    for (const record of this.command_records) {
      if (record.action === action) return record;
    }
    return null;
  }

  resolve_command_from_selector(selector) {
    for (const record of this.command_records) {
      if (record.selector === selector) return record;
    }
    return null;
  }

  resolve_command_from_keyboard(combo) {
    for (const record of this.command_records) {
      if (record.keyboard === combo) return record;
    }
    return null;
  }

  execute_command(config) {
    let command = null;
    if (config.selector) command = this.resolve_command_from_selector(config.selector);
    if (!command && config.keyboard) command = this.resolve_command_from_keyboard(config.keyboard);
    if (!command) command = this.resolve_command_from_action(config.action);
    if (!command || !command.method || !this[command.method]) {
      this.nodes.validation_label.textContent = "command unavailable";
      return { ok: false, data: null, errors: ["command unavailable"] };
    }
    this[command.method]();
    return { ok: true, data: { command_id: command.id }, errors: [] };
  }

  run_command() {
    const command_text = this.nodes.command_input.value || "";
    this.active_template_id = this.select_template_from_command(command_text);
    this.nodes.validation_label.textContent = "command parsed";
    this.render_all();
  }

  run_active_cell() {
    const value = this.nodes.cell_editor.value || "";
    this.nodes.cell_output.textContent = `Output: ${value}`;
    this.nodes.validation_label.textContent = "cell executed";
    this.restore_editor_focus();
  }

  run_all_cells() {
    const plan = this.create_run_all_plan();
    const outputs = [];
    for (const task of plan.tasks) {
      outputs.push(`${task.task_id}:${task.action}`);
    }
    this.nodes.cell_output.textContent = `Run all: ${outputs.join(", ")}`;
    this.nodes.validation_label.textContent = "run all completed";
    this.restore_editor_focus();
  }

  create_run_all_plan() {
    return {
      type: "execution_plan",
      kind: "dag",
      tasks: [
        { task_id: "parse_cell", action: "parse" },
        { task_id: "execute_cell", action: "run_cell", dependencies: ["parse_cell"] },
        { task_id: "render_output", action: "display", dependencies: ["execute_cell"] }
      ]
    };
  }

  enter_edit_mode() {
    this.editor_mode = "edit";
    this.active_cell_id = "cell_demo_1";
  }

  exit_edit_mode() {
    this.editor_mode = "command";
  }

  restore_editor_focus() {
    if (this.editor_mode !== "edit") return;
    this.nodes.cell_editor.focus();
  }

  event_combo(event) {
    const keys = [];
    if (event.ctrlKey) keys.push("ctrl");
    if (event.altKey) keys.push("alt");
    if (event.shiftKey) keys.push("shift");
    keys.push(String(event.key || "").toLowerCase());
    return keys.join("+");
  }

  search_workspace(query) {
    const value = String(query || "").trim().toLowerCase();
    const records = this.workspace_records();
    const hits = [];
    if (value) {
      for (const record of records) {
        if (JSON.stringify(record).toLowerCase().includes(value)) {
          hits.push({ id: record.id, type: "search_hit", label: record.name || record.id });
        }
      }
    }
    this.search_state = { query: value, hits, active_index: hits.length > 0 ? 0 : -1 };
    this.mark_search_hits();
    this.update_search_count();
  }

  mark_search_hits() {
    const hit_ids = [];
    for (const hit of this.search_state.hits) hit_ids.push(hit.id);
    for (const node of Array.from(document.querySelectorAll("[data-record-id]"))) {
      const record_id = node.getAttribute("data-record-id");
      const is_hit = hit_ids.includes(record_id);
      node.classList.toggle("search_hit", is_hit);
      node.classList.toggle("active_search_hit", is_hit && record_id === this.active_search_hit_id());
    }
  }

  clear_search_hits() {
    this.search_state = { query: "", hits: [], active_index: -1 };
    this.nodes.search_input.value = "";
    this.mark_search_hits();
    this.update_search_count();
  }

  move_to_next_hit() {
    if (this.search_state.hits.length === 0) return;
    this.search_state.active_index = (this.search_state.active_index + 1) % this.search_state.hits.length;
    this.mark_search_hits();
  }

  update_search_count() {
    const count = this.search_state.hits.length;
    this.nodes.search_count.textContent = count === 1 ? "1 result" : `${count} results`;
    this.nodes.validation_label.textContent = count === 0 && this.search_state.query ? "no search results" : "ready";
  }

  active_search_hit_id() {
    const hit = this.search_state.hits[this.search_state.active_index];
    return hit ? hit.id : null;
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
    this.mark_search_hits();
    this.update_search_count();
  }

  render_templates() {
    this.nodes.template_list.replaceChildren();
    for (const template of this.templates) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = template.id === this.active_template_id ? "template_button active" : "template_button";
      button.dataset.template_id = template.id;
      button.setAttribute("data-record-id", template.id);
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
      row.setAttribute("data-record-id", `${template.id}_${group[0].toLowerCase()}`);
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
      row.setAttribute("data-record-id", `${template.id}_${entity}`);
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
      node.setAttribute("data-record-id", `${template.id}_${flow}`);
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
      row.setAttribute("data-record-id", `${template.id}_${row_value[0]}`);
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

  workspace_records() {
    const records = [];
    for (const template of this.templates) {
      records.push({ id: template.id, type: "template", name: template.name, domain: template.domain });
      for (const entity of template.entities) records.push({ id: `${template.id}_${entity}`, type: "entity", name: entity });
      for (const flow of template.flows) records.push({ id: `${template.id}_${flow}`, type: "flow", name: flow });
      for (const layout of template.layouts) records.push({ id: `${template.id}_${layout}`, type: "layout", name: layout });
    }
    return records;
  }
}

const an_app_product_surface = new an_app_product_surface_controller({
  templates: product_surface_templates
});

an_app_product_surface.boot();
