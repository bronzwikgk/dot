import test from "node:test";
import assert from "node:assert/strict";
import { template_trio } from "../../code/utilities/code_shared_template_trio_v4_0_0_draft.js";

test("template_trio registers store", () => {
  const trio = new template_trio();
  const r = trio.register_store("s1", [{ id: "t1", data: { name: "app" } }]);
  assert.equal(r.ok, true);
});

test("template_trio rejects duplicate store", () => {
  const trio = new template_trio();
  trio.register_store("s1");
  const r = trio.register_store("s1");
  assert.equal(r.ok, false);
});

test("template_trio registers composer", () => {
  const trio = new template_trio();
  const r = trio.register_composer("c1", () => {});
  assert.equal(r.ok, true);
});

test("template_trio registers renderer", () => {
  const trio = new template_trio();
  const r = trio.register_renderer("r1", () => {});
  assert.equal(r.ok, true);
});

test("template_trio composes template", () => {
  const trio = new template_trio();
  trio.register_store("s1", [{ id: "t1", data: { key: "value" } }]);
  const r = trio.compose("s1", "t1");
  assert.equal(r.ok, true);
  assert.equal(r.composed.data.key, "value");
});

test("template_trio validates no duplicate names", () => {
  const trio = new template_trio();
  trio.register_store("s1");
  trio.register_composer("c1");
  trio.register_renderer("r1");
  const r = trio.validate_no_duplicate_names();
  assert.equal(r.ok, true);
});

test("template_trio detects duplicate names", () => {
  const trio = new template_trio();
  trio.register_store("same");
  trio.register_composer("same");
  const r = trio.validate_no_duplicate_names();
  assert.equal(r.ok, false);
  assert.ok(r.duplicates.includes("same"));
});

test("template_trio validates no cycle", () => {
  const trio = new template_trio();
  trio.register_store("s1");
  trio.register_composer("c1");
  const r = trio.validate_no_cycle();
  assert.equal(r.ok, true);
  assert.equal(r.cycle_detected, false);
});
