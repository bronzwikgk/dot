import { app_shell } from "./code_shared_app_shell_v3_0_0_draft.js";
import { product_surface } from "./code_shared_product_surface_v3_0_0_draft.js";
import { version_system } from "./code_shared_version_system_v3_0_0_draft.js";
import { an_app_brain } from "./an_app_brain_v1_4_0_draft.js";

class integrated_application {
  constructor(config = {}, ports = {}) {
    this.config = integrated_application.normalize_config(config);
    this.ports = integrated_application.normalize_ports(ports);
    this.product_surface = ports.product_surface || new product_surface({
      actor: this.config.actor,
      templates: this.config.templates
    }, this.ports.product_surface_ports);
    this.app_shell = ports.app_shell || new app_shell({ actor: this.config.actor });
    this.version_system = ports.version_system || new version_system({ actor: this.config.actor });
    this.an_app_brain = ports.an_app_brain || new an_app_brain({}, {
      command_intent: this.ports.command_intent_port,
      an_app_lang: this.ports.an_app_lang_port,
      an_bot: this.ports.an_bot_port,
      an_memory: this.ports.an_memory_port,
      knowledge_tree: this.ports.knowledge_tree_port
    });
  }

  async create_application_from_template(config = {}) {
    const template_id = config.template_id || this.config.default_template_id;
    const template_result = this.product_surface.instantiate_template(template_id, config.overrides || {});
    if (!template_result.ok) return template_result;

    const application = template_result.application;
    const shell_result = await this.app_shell.boot(application, { actor: this.config.actor });
    if (!shell_result.ok) return shell_result;

    const version_result = await this.version_system.snapshot_entity(application, {
      reason: "create_application_from_template"
    });
    const preview_result = this.product_surface.create_preview_path(application);
    const document_projection = this.product_surface.create_layout_projection(application, "json_as_document");
    const diagram_projection = this.product_surface.create_layout_projection(application, "json_as_diagram");
    const table_projection = this.product_surface.create_layout_projection(application, "json_as_table");

    return {
      ok: true,
      application,
      entities: template_result.entities,
      shell: shell_result.boot,
      audit: shell_result.audit,
      version: version_result.data,
      preview: preview_result.preview,
      projections: [
        document_projection.projection,
        diagram_projection.projection,
        table_projection.projection
      ]
    };
  }

  async parse_command_to_application(config = {}) {
    const user_input = config.user_input || "";
    if (!user_input) return { ok: false, errors: ["user_input is required"] };
    const brain_result = await this.an_app_brain.brain_pipeline({
      user_input,
      session_ref: config.session_ref || "integrated_application_session",
      context_ref: config.context_ref || "product_surface",
      boundary_policy: config.boundary_policy || {}
    });
    if (brain_result.boundary && brain_result.boundary.blocked) {
      return { ok: false, brain: brain_result, errors: brain_result.boundary.issues };
    }
    return {
      ok: true,
      brain: brain_result,
      suggested_template_id: this.select_template_from_text(user_input)
    };
  }

  async run_default_pipeline(config = {}) {
    const command_result = await this.parse_command_to_application({
      user_input: config.user_input || "create application builder",
      session_ref: config.session_ref || "default_pipeline_session"
    });
    if (!command_result.ok) return command_result;
    const application_result = await this.create_application_from_template({
      template_id: config.template_id || command_result.suggested_template_id,
      overrides: config.overrides || {}
    });
    if (!application_result.ok) return application_result;
    return {
      ok: true,
      command: command_result,
      application: application_result,
      status: "completed"
    };
  }

  select_template_from_text(text = "") {
    const value = String(text).toLowerCase();
    if (value.includes("course") || value.includes("learning") || value.includes("lms")) return "template_lms_v1";
    if (value.includes("finance") || value.includes("fintech") || value.includes("payment")) return "template_fintech_organization_v1";
    if (value.includes("research") || value.includes("source")) return "template_research_workflow_v1";
    if (value.includes("automation") || value.includes("schedule")) return "template_automation_workflow_v1";
    if (value.includes("workspace") || value.includes("single")) return "template_single_user_workspace_v1";
    return this.config.default_template_id;
  }

  create_release_gate_report(results = {}) {
    const checks = {
      command_ok: Boolean(results.command && results.command.ok),
      application_ok: Boolean(results.application && results.application.ok),
      shell_completed: Boolean(results.application && results.application.shell && results.application.shell.status === "completed"),
      preview_ready: Boolean(results.application && results.application.preview && results.application.preview.preview_state === "ready"),
      projections_ready: Boolean(results.application && Array.isArray(results.application.projections) && results.application.projections.length >= 3)
    };
    return {
      ok: integrated_application.all_true(checks),
      type: "release_gate_report",
      checks,
      status: integrated_application.all_true(checks) ? "passed" : "failed"
    };
  }

  static all_true(checks = {}) {
    for (const value of Object.values(checks)) {
      if (value !== true) return false;
    }
    return true;
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      templates: Array.isArray(config.templates) ? config.templates : [],
      default_template_id: config.default_template_id || "template_application_builder_v1"
    };
  }

  static normalize_ports(ports = {}) {
    return {
      command_intent_port: ports.command_intent_port || null,
      an_app_lang_port: ports.an_app_lang_port || null,
      an_bot_port: ports.an_bot_port || null,
      an_memory_port: ports.an_memory_port || null,
      knowledge_tree_port: ports.knowledge_tree_port || null,
      product_surface_ports: ports.product_surface_ports || {}
    };
  }
}

export { integrated_application };
export default integrated_application;
