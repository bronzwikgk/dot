import test from "node:test";
import assert from "node:assert/strict";
import { import_confirmation } from "../../code/utilities/code_shared_import_confirmation_v4_0_0_draft.js";

test("import_confirmation requests import", () => {
  const ic = new import_confirmation();
  const r = ic.request_import("i1", { content: "code", type: "code", requires_confirmation: true });
  assert.equal(r.ok, true);
  assert.equal(r.record.status, "pending");
});

test("import_confirmation confirms import", () => {
  const ic = new import_confirmation();
  ic.request_import("i1", { type: "code", requires_confirmation: true });
  const r = ic.confirm_import("i1");
  assert.equal(r.ok, true);
  assert.equal(r.record.confirmed, true);
});

test("import_confirmation rejects import", () => {
  const ic = new import_confirmation();
  ic.request_import("i1", { type: "code" });
  const r = ic.reject_import("i1");
  assert.equal(r.ok, true);
  assert.equal(r.record.status, "rejected");
});

test("import_confirmation validates unconfirmed", () => {
  const ic = new import_confirmation();
  ic.request_import("i1", { type: "code", requires_confirmation: true });
  const r = ic.validate_import("i1");
  assert.equal(r.ok, false);
});

test("import_confirmation validates confirmed", () => {
  const ic = new import_confirmation();
  ic.request_import("i1", { type: "code", requires_confirmation: true });
  ic.confirm_import("i1");
  const r = ic.validate_import("i1");
  assert.equal(r.ok, true);
});
