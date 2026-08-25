import test from "node:test";
import assert from "node:assert/strict";
import { policy_validation } from "../../code/utilities/code_shared_policy_validation_v4_0_0_draft.js";

test("policy_validation registers policy", () => {
  const pv = new policy_validation();
  const r = pv.register_policy("p1", { type: "naming", rules: [{ type: "required", field: "name" }] });
  assert.equal(r.ok, true);
});

test("policy_validation validates passing input", () => {
  const pv = new policy_validation();
  pv.register_policy("p1", { rules: [{ type: "required", field: "name" }] });
  const r = pv.validate_policy("p1", { name: "test" });
  assert.equal(r.ok, true);
});

test("policy_validation validates failing input", () => {
  const pv = new policy_validation();
  pv.register_policy("p1", { rules: [{ type: "required", field: "name" }] });
  const r = pv.validate_policy("p1", {});
  assert.equal(r.ok, false);
  assert.ok(r.errors[0].includes("name"));
});

test("policy_validation validates all policies", () => {
  const pv = new policy_validation();
  pv.register_policy("p1", { rules: [{ type: "required", field: "name" }] });
  pv.register_policy("p2", { rules: [{ type: "required", field: "id" }] });
  const r = pv.validate_all({ name: "test", id: "1" });
  assert.equal(r.ok, true);
});

test("policy_validation skips disabled policy", () => {
  const pv = new policy_validation();
  pv.register_policy("p1", { rules: [{ type: "required", field: "name" }], enabled: false });
  const r = pv.validate_policy("p1", {});
  assert.equal(r.ok, true);
  assert.equal(r.skipped, true);
});
