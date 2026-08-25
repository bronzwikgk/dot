import test from "node:test";
import assert from "node:assert/strict";
import { shell_cache } from "../../code/utilities/code_shared_shell_cache_v4_0_0_draft.js";

test("shell_cache sets and gets", () => {
  const sc = new shell_cache();
  sc.set("k1", { value: 42 });
  const r = sc.get("k1");
  assert.equal(r.ok, true);
  assert.equal(r.value.value, 42);
});

test("shell_cache reports missing key", () => {
  const sc = new shell_cache();
  const r = sc.get("missing");
  assert.equal(r.ok, false);
});

test("shell_cache deletes key", () => {
  const sc = new shell_cache();
  sc.set("k1", { value: 1 });
  const r = sc.delete("k1");
  assert.equal(r.ok, true);
  assert.equal(sc.get_size(), 0);
});

test("shell_cache clears all", () => {
  const sc = new shell_cache();
  sc.set("k1", { value: 1 });
  sc.set("k2", { value: 2 });
  sc.clear();
  assert.equal(sc.get_size(), 0);
});

test("shell_cache tracks audit", () => {
  const sc = new shell_cache();
  sc.set("k1", { value: 1 });
  sc.get("k1");
  sc.delete("k1");
  assert.equal(sc.get_audit().length, 3);
});

test("shell_cache reports size", () => {
  const sc = new shell_cache();
  sc.set("k1", { value: 1 });
  sc.set("k2", { value: 2 });
  assert.equal(sc.get_size(), 2);
});
