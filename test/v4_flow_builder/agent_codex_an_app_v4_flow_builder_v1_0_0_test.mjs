import test from "node:test";
import assert from "node:assert/strict";
import { flow_builder } from "../../code/utilities/code_shared_flow_builder_v4_0_0_draft.js";

test("flow_builder adds node", () => {
  const fb = new flow_builder();
  const r = fb.add_node("n1", { x: 10, y: 20, type: "action", label: "Start" });
  assert.equal(r.ok, true);
  assert.equal(r.node.x, 10);
});

test("flow_builder removes node and edges", () => {
  const fb = new flow_builder();
  fb.add_node("n1");
  fb.add_node("n2");
  fb.add_edge("e1", "n1", "n2");
  fb.remove_node("n1");
  assert.equal(fb.list_nodes().length, 1);
  assert.equal(fb.list_edges().length, 0);
});

test("flow_builder adds edge", () => {
  const fb = new flow_builder();
  fb.add_node("n1");
  fb.add_node("n2");
  const r = fb.add_edge("e1", "n1", "n2");
  assert.equal(r.ok, true);
});

test("flow_builder rejects edge to missing node", () => {
  const fb = new flow_builder();
  fb.add_node("n1");
  const r = fb.add_edge("e1", "n1", "missing");
  assert.equal(r.ok, false);
});

test("flow_builder moves node", () => {
  const fb = new flow_builder();
  fb.add_node("n1", { x: 0, y: 0 });
  const r = fb.move_node("n1", 100, 200);
  assert.equal(r.ok, true);
  assert.equal(r.node.x, 100);
});

test("flow_builder validates DAG", () => {
  const fb = new flow_builder();
  fb.add_node("n1");
  fb.add_node("n2");
  fb.add_edge("e1", "n1", "n2");
  const r = fb.validate_dag();
  assert.equal(r.ok, true);
  assert.ok(r.roots.includes("n1"));
});
