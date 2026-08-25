import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { product_surface } from "../../code/plugins/code_shared_product_surface_v3_0_0_draft.js";

const template_files = [
  "template_product_surface_lms_v1_0_0_draft.json",
  "template_product_surface_fintech_organization_v1_0_0_draft.json",
  "template_product_surface_single_user_workspace_v1_0_0_draft.json",
  "template_product_surface_research_workflow_v1_0_0_draft.json",
  "template_product_surface_automation_workflow_v1_0_0_draft.json",
  "template_product_surface_application_builder_v1_0_0_draft.json"
];

const read_json = async (relative_path) => {
  const text = await readFile(join(process.cwd(), relative_path), "utf8");
  return JSON.parse(text);
};

const read_templates = async () => {
  const templates = [];
  for (const file of template_files) {
    templates.push(await read_json(join("templates", "product_surface", file)));
  }
  return templates;
};

test("product_surface validates built in datasets", () => {
  const surface = new product_surface();
  const result = surface.validate_datasets();
  assert.equal(result.ok, true);
});

test("product_surface registers all required templates", async () => {
  const templates = await read_templates();
  const surface = new product_surface({ templates });
  const result = surface.list_templates();
  assert.equal(result.ok, true);
  assert.equal(result.data.length, 6);
});

test("product_surface instantiates application builder template", async () => {
  const templates = await read_templates();
  const surface = new product_surface({ templates }, {
    entity_store_port: "mock",
    runner_port: "mock",
    command_intent_port: "mock",
    template_port: "mock",
    version_port: "mock"
  });
  const result = surface.instantiate_template("template_application_builder_v1");
  assert.equal(result.ok, true);
  assert.equal(result.application.type, "application");
  assert.ok(result.entities.length >= 5);
  assert.ok(result.entities.some((entity) => entity.type === "route"));
  assert.ok(result.entities.some((entity) => entity.type === "view"));
});

test("product_surface rejects invalid route path", () => {
  const surface = new product_surface();
  const result = surface.create_builder_model({
    id: "bad_app",
    type: "application",
    name: "bad_application",
    routes: [{ id: "route_bad", name: "bad_route", path: "missing_slash" }]
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes("route path must start with /"));
});

test("product_surface projects same entity into multiple layouts", () => {
  const surface = new product_surface();
  const entity = { id: "entity_001", type: "application", name: "demo_application" };
  const document_projection = surface.create_layout_projection(entity, "json_as_document");
  const diagram_projection = surface.create_layout_projection(entity, "json_as_diagram");
  const table_projection = surface.create_layout_projection(entity, "json_as_table");
  assert.equal(document_projection.ok, true);
  assert.equal(diagram_projection.ok, true);
  assert.equal(table_projection.ok, true);
  assert.equal(document_projection.projection.layout, "block_editor");
  assert.equal(diagram_projection.projection.layout, "diagram");
  assert.equal(table_projection.projection.layout, "table");
});

test("product_surface renders all required layouts without mutating source entity", () => {
  const surface = new product_surface();
  const entity = { id: "entity_001", type: "application", name: "demo_application", status: "draft" };
  const before = JSON.stringify(entity);
  const layouts = ["notebook", "code_editor", "block_editor", "tree", "table", "board", "calendar", "timeline", "diagram", "dashboard"];
  const result = surface.compare_layout_output({ entity, layouts });

  assert.equal(result.ok, true);
  assert.equal(JSON.stringify(entity), before);
  assert.equal(result.data.outputs.length, layouts.length);
  assert.equal(new Set(result.data.outputs.map((output) => output.source_entity_id)).size, 1);
  assert.deepEqual(result.data.outputs.map((output) => output.layout), layouts);
});

test("product_surface rejects unapproved layout names", () => {
  const surface = new product_surface();
  const result = surface.render_layout({
    entity: { id: "entity_001", type: "application", name: "demo_application" },
    layout: "workspace_magic"
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /not approved/);
});

test("product_surface creates command editor preview and e2e contracts", () => {
  const surface = new product_surface();
  const command = surface.create_command_surface({ input_surface: "command_bar" });
  const editor = surface.create_editor_surface({ components: ["json_text_editor", "layout_switcher"] });
  const preview = surface.create_preview_path({ id: "app_001", type: "application", name: "demo_application" });
  const checklist = surface.create_ui_e2e_checklist();
  assert.equal(command.ok, true);
  assert.equal(editor.ok, true);
  assert.equal(preview.ok, true);
  assert.ok(preview.preview.path.endsWith("/app_001"));
  assert.ok(checklist.checklist.includes("template_expands_to_valid_application_entity"));
});
