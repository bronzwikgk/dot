import test from "node:test";
import assert from "node:assert/strict";
import { guided_tour } from "../../code/utilities/code_shared_guided_tour_v4_0_0_draft.js";

test("guided_tour registers tour", () => {
  const gt = new guided_tour();
  const r = gt.register_tour("t1", { title: "Welcome Tour" });
  assert.equal(r.ok, true);
});

test("guided_tour adds step", () => {
  const gt = new guided_tour();
  gt.register_tour("t1");
  const r = gt.add_step("t1", "s1", { target: "#btn", title: "Click here", position: 1 });
  assert.equal(r.ok, true);
});

test("guided_tour starts tour", () => {
  const gt = new guided_tour();
  gt.register_tour("t1");
  gt.add_step("t1", "s1", { position: 1 });
  gt.add_step("t1", "s2", { position: 2 });
  const r = gt.start_tour("t1");
  assert.equal(r.ok, true);
  assert.equal(r.step_count, 2);
});

test("guided_tour navigates next", () => {
  const gt = new guided_tour();
  gt.register_tour("t1");
  gt.add_step("t1", "s1", { position: 1 });
  gt.add_step("t1", "s2", { position: 2 });
  gt.start_tour("t1");
  const r = gt.next_step();
  assert.equal(r.ok, true);
  assert.equal(r.step_index, 1);
});

test("guided_tour navigates prev", () => {
  const gt = new guided_tour();
  gt.register_tour("t1");
  gt.add_step("t1", "s1", { position: 1 });
  gt.add_step("t1", "s2", { position: 2 });
  gt.start_tour("t1");
  gt.next_step();
  const r = gt.prev_step();
  assert.equal(r.ok, true);
  assert.equal(r.step_index, 0);
});

test("guided_tour skips tour", () => {
  const gt = new guided_tour();
  gt.register_tour("t1");
  gt.add_step("t1", "s1", { position: 1 });
  gt.start_tour("t1");
  const r = gt.skip_tour();
  assert.equal(r.ok, true);
  assert.equal(gt.get_current_step(), null);
});

test("guided_tour fails next at end", () => {
  const gt = new guided_tour();
  gt.register_tour("t1");
  gt.add_step("t1", "s1", { position: 1 });
  gt.start_tour("t1");
  const r = gt.next_step();
  assert.equal(r.ok, false);
});

test("guided_tour fails prev at start", () => {
  const gt = new guided_tour();
  gt.register_tour("t1");
  gt.add_step("t1", "s1", { position: 1 });
  gt.start_tour("t1");
  const r = gt.prev_step();
  assert.equal(r.ok, false);
});

test("guided_tour lists tours", () => {
  const gt = new guided_tour();
  gt.register_tour("t1");
  gt.register_tour("t2");
  assert.equal(gt.list_tours().length, 2);
});
