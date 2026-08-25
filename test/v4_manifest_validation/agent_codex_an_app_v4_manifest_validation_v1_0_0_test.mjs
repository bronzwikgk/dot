import test from "node:test";
import assert from "node:assert/strict";
import { manifest_validation } from "../../code/utilities/code_shared_manifest_validation_v4_0_0_draft.js";

test("manifest_validation registers manifest", () => {
  const mv = new manifest_validation();
  const r = mv.register_manifest("m1", [{ type: "route", name: "home", active: true }]);
  assert.equal(r.ok, true);
});

test("manifest_validation detects stale entries", () => {
  const mv = new manifest_validation();
  mv.register_manifest("m1", [{ type: "route", name: "old", active: false }]);
  const r = mv.validate_stale("m1");
  assert.equal(r.ok, false);
  assert.equal(r.count, 1);
});

test("manifest_validation detects duplicates", () => {
  const mv = new manifest_validation();
  mv.register_manifest("m1", [
    { type: "route", name: "home", active: true },
    { type: "route", name: "home", active: true },
  ]);
  const r = mv.validate_duplicates("m1");
  assert.equal(r.ok, false);
  assert.equal(r.count, 1);
});

test("manifest_validation passes clean manifest", () => {
  const mv = new manifest_validation();
  mv.register_manifest("m1", [
    { type: "route", name: "home", active: true },
    { type: "route", name: "about", active: true },
  ]);
  const r = mv.validate_all("m1");
  assert.equal(r.ok, true);
});

test("manifest_validation lists manifests", () => {
  const mv = new manifest_validation();
  mv.register_manifest("m1");
  mv.register_manifest("m2");
  assert.deepEqual(mv.list_manifests(), ["m1", "m2"]);
});
