import test from "node:test";
import assert from "node:assert/strict";
import { listener_view_frame } from "../../code/utilities/code_shared_listener_view_frame_v4_0_0_draft.js";

test("listener_view_frame registers listener", () => {
  const lvf = new listener_view_frame();
  const r = lvf.register_listener("l1", { event: "click", handler: () => {}, target: "#btn" });
  assert.equal(r.ok, true);
});

test("listener_view_frame removes listener", () => {
  const lvf = new listener_view_frame();
  lvf.register_listener("l1", { event: "click", handler: () => {} });
  const r = lvf.remove_listener("l1");
  assert.equal(r.ok, true);
});

test("listener_view_frame registers view_frame", () => {
  const lvf = new listener_view_frame();
  const r = lvf.register_view_frame("v1", { element_id: "app", layout: "notebook" });
  assert.equal(r.ok, true);
});

test("listener_view_frame resolves view_frame", () => {
  const lvf = new listener_view_frame();
  lvf.register_view_frame("v1", { element_id: "app" });
  const r = lvf.resolve_view_frame("v1");
  assert.equal(r.ok, true);
  assert.equal(r.view_frame.element_id, "app");
});

test("listener_view_frame gets listeners for event", () => {
  const lvf = new listener_view_frame();
  lvf.register_listener("l1", { event: "click", handler: () => {} });
  lvf.register_listener("l2", { event: "load", handler: () => {} });
  const clicks = lvf.get_listeners_for_event("click");
  assert.equal(clicks.length, 1);
  assert.equal(clicks[0].id, "l1");
});

test("listener_view_frame validates all", () => {
  const lvf = new listener_view_frame();
  lvf.register_listener("l1", { event: "click", handler: () => {} });
  lvf.register_view_frame("v1", { element_id: "app" });
  const r = lvf.validate_all();
  assert.equal(r.ok, true);
});
