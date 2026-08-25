import test from "node:test";
import assert from "node:assert/strict";
import { export_import } from "../../code/utilities/code_shared_export_import_v4_0_0_draft.js";

test("export_import exports file", () => {
  const ei = new export_import();
  const r = ei.export_file("e1", { data: { key: "value" }, format: "json", filename: "test.json" });
  assert.equal(r.ok, true);
  assert.equal(r.record.format, "json");
});

test("export_import imports file", () => {
  const ei = new export_import();
  const r = ei.import_file("i1", { data: { key: "value" } });
  assert.equal(r.ok, true);
  assert.equal(r.record.status, "imported");
});

test("export_import validates import", () => {
  const ei = new export_import();
  ei.import_file("i1", { data: {} });
  const r = ei.validate_import("i1");
  assert.equal(r.ok, true);
});

test("export_import lists exports and imports", () => {
  const ei = new export_import();
  ei.export_file("e1", { data: {} });
  ei.import_file("i1", { data: {} });
  assert.equal(ei.list_exports().length, 1);
  assert.equal(ei.list_imports().length, 1);
});
