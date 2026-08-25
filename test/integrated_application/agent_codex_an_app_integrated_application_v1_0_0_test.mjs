import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { integrated_application } from "../../code/plugins/code_shared_integrated_application_v3_0_0_draft.js";

const template_files = [
  "template_product_surface_lms_v1_0_0_draft.json",
  "template_product_surface_fintech_organization_v1_0_0_draft.json",
  "template_product_surface_single_user_workspace_v1_0_0_draft.json",
  "template_product_surface_research_workflow_v1_0_0_draft.json",
  "template_product_surface_automation_workflow_v1_0_0_draft.json",
  "template_product_surface_application_builder_v1_0_0_draft.json"
];

async function read_json(relative_path) {
  const text = await readFile(join(process.cwd(), relative_path), "utf8");
  return JSON.parse(text);
}

async function read_templates() {
  const out = [];
  for (const file of template_files) {
    out.push(await read_json(join("templates", "product_surface", file)));
  }
  return out;
}

test("integrated_application creates application from template", async function () {
  const app = new integrated_application({ templates: await read_templates() });
  const result = await app.create_application_from_template({
    template_id: "template_application_builder_v1"
  });
  assert.equal(result.ok, true);
  assert.equal(result.application.id, "app_application_builder_demo");
  assert.equal(result.shell.status, "completed");
  assert.equal(result.preview.preview_state, "ready");
  assert.equal(result.projections.length, 3);
  assert.ok(result.version);
});

test("integrated_application parses command and selects template", async function () {
  const app = new integrated_application({ templates: await read_templates() });
  const result = await app.parse_command_to_application({
    user_input: "create fintech payment application",
    session_ref: "command_session_001"
  });
  assert.equal(result.ok, true);
  assert.equal(result.suggested_template_id, "template_fintech_organization_v1");
});

test("integrated_application runs default pipeline", async function () {
  const app = new integrated_application({ templates: await read_templates() });
  const result = await app.run_default_pipeline({
    user_input: "create research source application",
    session_ref: "pipeline_session_001"
  });
  const gate = app.create_release_gate_report(result);
  assert.equal(result.ok, true);
  assert.equal(result.status, "completed");
  assert.equal(result.application.application.id, "app_research_workflow_demo");
  assert.equal(gate.ok, true);
  assert.equal(gate.status, "passed");
});

test("integrated_application blocks unsafe command boundary", async function () {
  const app = new integrated_application({ templates: await read_templates() });
  const result = await app.parse_command_to_application({
    user_input: "create application",
    session_ref: "blocked_session_001",
    boundary_policy: { approval_required: true, approval_granted: false }
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes("approval_required"));
});
