import test from "node:test";
import assert from "node:assert/strict";
import { cell_command_language } from "../../code/utilities/code_shared_cell_command_language_v4_0_0_draft.js";

test("cell_command_language maps text to approved command with evidence", () => {
  const language = new cell_command_language();
  const parsed = language.parse_command_text({ text: "run markdown cell" });

  assert.equal(parsed.ok, true);
  assert.equal(parsed.data.intent.command_name, "run_cell");
  assert.equal(parsed.data.plan.status, "ready");
  assert.equal(parsed.data.plan.cell_language_record.cell_type, "markdown");
  assert.ok(parsed.data.confidence > 0.7);
  assert.ok(parsed.data.evidence.length > 0);
});

test("cell_command_language creates run all execution plan", () => {
  const language = new cell_command_language({ approved_actions: ["run_all", "run_cell"] });
  const parsed = language.parse_command_text({ text: "run all cells" });

  assert.equal(parsed.ok, true);
  assert.equal(parsed.data.plan.command_name, "run_all");
  assert.equal(parsed.data.plan.steps[0].action, "run_all");
});

test("cell_command_language returns clarification for unknown text", () => {
  const language = new cell_command_language();
  const parsed = language.parse_command_text({ text: "maybe later" });

  assert.equal(parsed.ok, true);
  assert.equal(parsed.data.intent.needs_clarification, true);
  assert.equal(parsed.data.plan.status, "clarification_required");
});

test("cell_command_language rejects unapproved execution plan", () => {
  const language = new cell_command_language();
  const result = language.validate_execution_plan({
    plan: { type: "execution_plan", command_name: "unknown_action", steps: [{ step_id: "x", action: "unknown_action" }] }
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /not approved/);
});
