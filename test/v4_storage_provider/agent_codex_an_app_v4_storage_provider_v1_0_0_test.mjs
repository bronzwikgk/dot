import test from "node:test";
import assert from "node:assert/strict";
import { storage_provider } from "../../code/utilities/code_shared_storage_provider_v4_0_0_draft.js";

test("storage_provider sets and gets", () => {
  const sp = new storage_provider();
  sp.set("k1", { value: 42 });
  const r = sp.get("k1");
  assert.equal(r.ok, true);
  assert.equal(r.value.value, 42);
});

test("storage_provider reports missing key", () => {
  const sp = new storage_provider();
  const r = sp.get("missing");
  assert.equal(r.ok, false);
});

test("storage_provider rejects invalid key", () => {
  const sp = new storage_provider();
  const r = sp.set("", { value: 1 });
  assert.equal(r.ok, false);
});

test("storage_provider selftest passes", () => {
  const sp = new storage_provider();
  const r = sp.selftest();
  assert.equal(r.ok, true);
});

test("storage_provider reports and clears errors", () => {
  const sp = new storage_provider();
  sp.report_error("test", "test error");
  assert.equal(sp.get_errors().length, 1);
  sp.clear_errors();
  assert.equal(sp.get_errors().length, 0);
});

test("storage_provider removes key", () => {
  const sp = new storage_provider();
  sp.set("k1", { value: 1 });
  const r = sp.remove("k1");
  assert.equal(r.ok, true);
  assert.equal(sp.get("k1").ok, false);
});
