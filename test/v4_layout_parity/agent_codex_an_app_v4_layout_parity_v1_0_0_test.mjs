import test from "node:test";
import assert from "node:assert/strict";
import { layout_parity, CORE_LAYOUTS, LAYOUT_TO_RENDER_PROFILE } from "../../code/utilities/code_shared_layout_parity_v4_0_0_draft.js";

const parity = new layout_parity();

const sample_entity = {
  id: "entity_001",
  type: "application",
  name: "sample_app",
  data: { title: "My App", version: "1.0.0", features: ["auth", "dashboard"] },
};

test("layout_parity validates approved layout names", () => {
  const result = parity.validate_layout_name("notebook");
  assert.equal(result.ok, true);
});

test("layout_parity rejects unapproved layout names", () => {
  const result = parity.validate_layout_name("fake_layout");
  assert.equal(result.ok, false);
  assert.ok(result.errors.length > 0);
});

test("layout_parity validates approved render profiles", () => {
  const result = parity.validate_render_profile("json_as_notebook");
  assert.equal(result.ok, true);
});

test("layout_parity rejects unapproved render profiles", () => {
  const result = parity.validate_render_profile("json_as_fake");
  assert.equal(result.ok, false);
});

test("layout_parity maps layout to render profile", () => {
  assert.equal(parity.get_render_profile("notebook"), "json_as_notebook");
  assert.equal(parity.get_render_profile("table"), "json_as_table");
  assert.equal(parity.get_render_profile("tree"), "json_as_tree");
  assert.equal(parity.get_render_profile("diagram"), "json_as_diagram");
  assert.equal(parity.get_render_profile("dashboard"), "json_as_dashboard");
});

test("layout_parity returns null for unmapped layout", () => {
  assert.equal(parity.get_render_profile("unknown"), null);
});

test("layout_parity creates layout record", () => {
  const result = parity.create_layout_record(sample_entity, "notebook");
  assert.equal(result.ok, true);
  assert.equal(result.layout_record.entity_id, "entity_001");
  assert.equal(result.layout_record.layout_name, "notebook");
  assert.equal(result.layout_record.render_profile, "json_as_notebook");
  assert.ok(result.layout_record.data_snapshot);
});

test("layout_parity rejects layout record without entity id", () => {
  const result = parity.create_layout_record({}, "notebook");
  assert.equal(result.ok, false);
});

test("layout_parity validates parity across all core layouts", () => {
  const result = parity.validate_parity(sample_entity);
  assert.equal(result.ok, true);
  assert.equal(result.data_intact, true);
  assert.equal(result.summary.total, 10);
  assert.equal(result.summary.passed, 10);
  assert.equal(result.summary.failed, 0);
});

test("layout_parity preserves data across all layouts", () => {
  const entity = { id: "e1", type: "test", data: { nested: { value: 42 } } };
  const result = parity.validate_parity(entity);
  assert.equal(result.data_intact, true);
  assert.deepEqual(entity.data, { nested: { value: 42 } });
});

test("layout_parity validates layout switch preserves data", () => {
  const entity = { id: "e2", type: "test", data: { key: "value" } };
  const result = parity.validate_switch_layout(entity, "notebook", "table");
  assert.equal(result.ok, true);
  assert.equal(result.data_intact, true);
});

test("layout_parity returns all core layouts", () => {
  const layouts = parity.get_all_layouts();
  assert.equal(layouts.length, 10);
  assert.ok(layouts.includes("notebook"));
  assert.ok(layouts.includes("code_editor"));
  assert.ok(layouts.includes("block_editor"));
  assert.ok(layouts.includes("tree"));
  assert.ok(layouts.includes("table"));
  assert.ok(layouts.includes("board"));
  assert.ok(layouts.includes("calendar"));
  assert.ok(layouts.includes("timeline"));
  assert.ok(layouts.includes("diagram"));
  assert.ok(layouts.includes("dashboard"));
});

test("layout_parity returns layout count", () => {
  assert.equal(parity.get_layout_count(), 10);
});

test("layout_parity core layouts match LAYOUT_TO_RENDER_PROFILE keys", () => {
  for (const layout of CORE_LAYOUTS) {
    assert.ok(LAYOUT_TO_RENDER_PROFILE[layout], `missing profile for ${layout}`);
  }
});

test("layout_parity all render profiles are in approved list", () => {
  for (const profile of Object.values(LAYOUT_TO_RENDER_PROFILE)) {
    assert.ok(render_profile_names.includes(profile), `profile ${profile} not approved`);
  }
});

const render_profile_names = ["json_as_notebook", "json_as_text", "json_as_tree", "json_as_document", "json_as_diagram", "json_as_table", "json_as_cards", "json_as_kanban", "json_as_board", "json_as_calendar", "json_as_timeline", "json_as_dashboard", "json_as_flowchart", "json_as_mindmap"];
