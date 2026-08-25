import assert from "node:assert/strict";
import test from "node:test";
import { entity_registry } from "../code/entity_registry.js";
import { entity_validator } from "../code/entity_validator.js";
import { entity_runner } from "../code/entity_runner.js";
import { markdown_pipeline } from "../code/markdown_pipeline.js";
import { entity_parser } from "../code/entity_parser.js";
import { entity_reasoner } from "../code/entity_reasoner.js";
import { app_generator } from "../code/app_generator.js";
import {
  datatype_names,
  entity_types,
  intent_names,
  pipeline_stage_names,
  relationship_types,
  stage_names,
  banned_words
} from "../code/dataset/validation_word_datasets.js";
import {
  cell_types,
  flow_node_types,
  layout_names,
  semantic_element_names
} from "../code/dataset/ui_word_datasets.js";

test("registry describes types by traits and operations", () => {
  const registry = new entity_registry();
  const view = registry.describe_type("view");
  assert.ok(entity_types.includes("view"));
  assert.ok(view.traits.includes("renderable"));
  assert.ok(view.operations.includes("display"));
  assert.ok(registry.describe_type("workflow").operations.includes("execute"));
  assert.ok(registry.describe_type("trigger").operations.includes("emit_event"));
});

test("validator checks naming, registry, policies, and contracts", () => {
  const registry = new entity_registry();
  const validator = new entity_validator();
  const valid = validator.validate({
    id: "view.home",
    type: "view",
    status: "active",
    policies: [{ name: "must_be_active", required_status: "active" }],
    contracts: [{ name: "base", required_fields: ["id", "type"] }]
  }, registry);
  assert.equal(valid.ok, true);
  const invalid = validator.validate({ id: "View.Home", type: "missing" }, registry);
  assert.equal(invalid.ok, false);
});

test("relationship type dataset drives relationship validation", () => {
  const validator = new entity_validator();
  assert.ok(relationship_types.includes("depends_on"));
  assert.equal(validator.validate_relationship_type("depends_on").ok, true);
  assert.equal(validator.validate_relationship_type("random_link").ok, false);
  assert.equal(validator.validate_operation_name("execute").ok, true);
  assert.equal(validator.validate_operation_name("made_up_operation").ok, false);
  const banned_dependency_alias = banned_words.find((word) => word.startsWith("de") && word.endsWith("ps"));
  assert.equal(validator.validate_banned_word(banned_dependency_alias).ok, false);
});

test("single validation word dataset exposes stage names", () => {
  assert.ok(stage_names.includes("decompose"));
  assert.ok(stage_names.includes("respond"));
  assert.ok(datatype_names.includes("json"));
  assert.ok(intent_names.includes("execute_workflow"));
  assert.ok(pipeline_stage_names.includes("validate_steps_stage"));
});

test("separate ui word dataset exposes approved gui names", () => {
  const validator = new entity_validator();
  assert.ok(layout_names.includes("diagram"));
  assert.ok(cell_types.includes("pipeline"));
  assert.ok(flow_node_types.includes("renderer"));
  assert.ok(semantic_element_names.includes("article"));
  assert.equal(validator.validate_layout_name("block_editor").ok, true);
  assert.equal(validator.validate_layout_name("block_workspace").ok, false);
  assert.equal(validator.validate_no_near_duplicate("layout_names", "block_editr").ok, false);
  assert.equal(validator.validate_cell_type("flow").ok, true);
  assert.equal(validator.validate_flow_node_type("renderer").ok, true);
  assert.equal(validator.validate_semantic_element_name("div").ok, false);
});

test("runner executes registered universal stages", async () => {
  const runner = new entity_runner();
  assert.deepEqual(runner.config.stage_order, stage_names);
  runner.register_stage("decompose", (value) => String(value).split(" "));
  runner.register_stage("compose", (value) => value.join("_"));
  const result = await runner.run("hello world", { stages: ["decompose", "compose"] });
  assert.equal(result.ok, true);
  assert.equal(result.value, "hello_world");
});

test("runner reports requested stages that are not registered", async () => {
  const runner = new entity_runner();
  const result = await runner.run("hello", { stages: ["parse"] });
  assert.equal(result.ok, false);
  assert.match(result.context.diagnostics[0].message, /not registered/);
});

test("markdown pipeline decomposes and composes docs", () => {
  const pipeline = new markdown_pipeline();
  const result = pipeline.run("# Title\n- item\nText");
  assert.equal(result.parsed.blocks.length, 3);
  assert.match(result.text, /# Title/);
});

test("parser and reasoner turn plain intent into entity knowledge", () => {
  const parser = new entity_parser();
  const parsed = parser.parse("create view home and link app.demo view.home");
  assert.equal(parsed.entities[0].type, "view");
  const registry = new entity_registry();
  const reasoner = new entity_reasoner();
  const result = reasoner.reason({ id: "view.home", type: "view" }, registry);
  assert.equal(result.can_display, true);
  const unknown = reasoner.reason({ id: "thing.one", type: "thing" }, registry);
  assert.equal(unknown.ok, false);
});

test("app generator creates a code based manifest plan", () => {
  const generator = new app_generator();
  const plan = generator.plan_app(
    { id: "app.demo", type: "app", name: "demo" },
    [
      { id: "route.home", type: "route", name: "home" },
      { id: "view.home", type: "view", name: "home" },
      { id: "component.nav", type: "component", name: "nav" }
    ]
  );
  assert.equal(plan.files.length, 3);
  assert.match(generator.compose_manifest(plan), /code\/views\/home\.js/);
  assert.throws(
    () => generator.plan_app(
      { id: "app.demo", type: "app", name: "demo" },
      [{ id: "view.bad", type: "view", name: "BadName" }]
    ),
    /must use snake_case/
  );
});
