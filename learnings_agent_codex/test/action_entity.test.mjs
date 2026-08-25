import assert from "node:assert/strict";
import test from "node:test";
import { action_entity } from "../code/action_entity.js";

test("normalizes universal entity shape", async () => {
  const store = new action_entity("scratch");
  const created = await store.create({ id: "app.demo", type: "app", name: "Demo" });
  assert.equal(created.data.id, "app.demo");
  assert.equal(created.data.status, "draft");
  assert.deepEqual(created.data.relationships, []);
  assert.deepEqual(created.data.config, {});
});

test("raw input validation does not accept missing required fields by default", () => {
  const store = new action_entity("scratch");
  const result = store.validate_input({});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /id is required/);
  assert.match(result.errors.join("\n"), /type is required/);
});

test("rejects non snake_case ids and operations", async () => {
  const store = new action_entity("scratch");
  await assert.rejects(
    () => store.create({ id: "App.Bad", type: "app", operations: ["runApp"] }),
    /id must use snake_case path format/
  );
  await assert.rejects(
    () => store.create({ id: "app.bad", type: "app", operations: ["runApp"] }),
    /operation 'runApp' is not allowed/
  );
});

test("links entities and reports dependencies", async () => {
  const store = new action_entity("scratch");
  await store.create({ id: "app.demo", type: "app" });
  await store.create({ id: "component.toolbar", type: "component" });
  await store.link_entities("app.demo", "component.toolbar", "depends_on");
  assert.deepEqual(await store.get_dependencies("app.demo"), ["component.toolbar"]);
  const dependents = await store.get_dependents("component.toolbar");
  assert.equal(dependents[0].id, "app.demo");
});

test("uses validator dataset for relationship type checks", async () => {
  const store = new action_entity("scratch");
  await store.create({ id: "app.demo", type: "app" });
  await store.create({ id: "view.home", type: "view" });
  await store.link_entities("app.demo", "view.home", "renders");
  await assert.rejects(
    () => store.link_entities("app.demo", "view.home", "made_up_link"),
    /relationship type 'made_up_link' is not allowed/
  );
});

test("detects missing graph targets and cycles", async () => {
  const store = new action_entity("scratch", { allow_legacy_dependencies: true });
  await store.create({ id: "app.a", type: "app", dependencies: ["app.b"] });
  await store.create({ id: "app.b", type: "app", dependencies: ["app.a", "app.missing"] });
  const graph = await store.validate_graph();
  assert.equal(graph.ok, false);
  assert.match(graph.errors.join("\n"), /missing relationship target app\.missing/);
  assert.match(graph.errors.join("\n"), /cycle detected/);
});

test("treats dependencies as derived from depends_on relationships", async () => {
  const store = new action_entity("scratch", { allow_legacy_dependencies: true });
  await store.create({ id: "app.demo", type: "app", dependencies: ["view.home"] });
  await store.create({ id: "view.home", type: "view" });
  assert.deepEqual(await store.get_dependencies("app.demo"), ["view.home"]);
  await store.unlink_entities("app.demo", "view.home", "depends_on");
  assert.deepEqual(await store.get_dependencies("app.demo"), []);
  const stored = await store.driver.read("app.demo");
  assert.equal(Object.prototype.hasOwnProperty.call(stored, "dependencies"), false);
});

test("rejects legacy dependencies unless migration mode is enabled", async () => {
  const store = new action_entity("scratch");
  await assert.rejects(
    () => store.create({ id: "app.demo", type: "app", dependencies: ["view.home"] }),
    /legacy dependencies input is disabled/
  );
});

test("supports lifecycle, policy, contract, diff, and version helpers", async () => {
  const store = new action_entity("scratch");
  const created = await store.create({ id: "utility.parser", type: "utility", version: "1.2.3" });
  await store.activate("utility.parser");
  await store.add_policy("utility.parser", "policy.snake_case");
  await store.add_contract("utility.parser", "contract.parser_correctness");
  const entity = await store.read("utility.parser");
  assert.equal(entity.status, "active");
  assert.deepEqual(entity.policies, ["policy.snake_case"]);
  assert.equal(store.bump_version(entity, "minor"), "1.3.0");
  const changes = store.diff_entities(created.data, entity);
  assert.ok(changes.some((change) => change.field === "status"));
});

test("imports and exports normalized entity json", async () => {
  const store = new action_entity("scratch");
  const entity = store.import_entity('{"id":"view.home","type":"view","name":"Home"}');
  const text = store.export_entity(entity);
  assert.match(text, /"id": "view.home"/);
  assert.match(text, /"relationships": \[\]/);
});

test("import validates parsed entity", () => {
  const store = new action_entity("scratch");
  assert.throws(
    () => store.import_entity('{"id":"View.Bad","type":"view"}'),
    /id must use snake_case path format/
  );
});
