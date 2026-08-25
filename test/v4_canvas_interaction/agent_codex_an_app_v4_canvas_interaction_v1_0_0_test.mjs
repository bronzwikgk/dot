import test from "node:test";
import assert from "node:assert/strict";
import { canvas_interaction } from "../../code/utilities/code_shared_canvas_interaction_v4_0_0_draft.js";

test("canvas_interaction adds node", () => {
  const ci = new canvas_interaction();
  const r = ci.add_node("n1", { x: 10, y: 20, type: "action", label: "Start" });
  assert.equal(r.ok, true);
  assert.equal(r.node.x, 10);
});

test("canvas_interaction moves node", () => {
  const ci = new canvas_interaction();
  ci.add_node("n1", { x: 0, y: 0 });
  const r = ci.move_node("n1", 100, 200);
  assert.equal(r.ok, true);
  assert.equal(r.node.x, 100);
});

test("canvas_interaction starts and ends drag", () => {
  const ci = new canvas_interaction();
  ci.add_node("n1", { x: 0, y: 0 });
  ci.start_drag("n1");
  assert.ok(ci.get_drag_state());
  ci.end_drag(50, 50);
  assert.equal(ci.get_drag_state(), null);
  assert.equal(ci.nodes.get("n1").x, 50);
});

test("canvas_interaction cancels drag", () => {
  const ci = new canvas_interaction();
  ci.add_node("n1", { x: 0, y: 0 });
  ci.start_drag("n1");
  ci.cancel_drag();
  assert.equal(ci.get_drag_state(), null);
  assert.equal(ci.nodes.get("n1").x, 0);
});

test("canvas_interaction creates chain", () => {
  const ci = new canvas_interaction();
  ci.add_node("n1");
  ci.add_node("n2");
  const r = ci.create_chain("c1", { node_ids: ["n1", "n2"] });
  assert.equal(r.ok, true);
});

test("canvas_interaction runs chain", () => {
  const ci = new canvas_interaction();
  ci.add_node("n1");
  ci.add_node("n2");
  ci.create_chain("c1", { node_ids: ["n1", "n2"] });
  const r = ci.run_chain("c1");
  assert.equal(r.ok, true);
  assert.equal(r.chain.status, "completed");
  assert.equal(ci.nodes.get("n1").status, "completed");
  assert.equal(ci.nodes.get("n2").status, "completed");
});

test("canvas_interaction validates DAG", () => {
  const ci = new canvas_interaction();
  ci.add_node("n1");
  ci.add_node("n2");
  const r = ci.validate_dag();
  assert.equal(r.ok, true);
  assert.equal(r.node_count, 2);
});

test("canvas_interaction lists nodes and chains", () => {
  const ci = new canvas_interaction();
  ci.add_node("n1");
  ci.add_node("n2");
  ci.create_chain("c1", { node_ids: ["n1", "n2"] });
  assert.equal(ci.list_nodes().length, 2);
  assert.equal(ci.list_chains().length, 1);
});
