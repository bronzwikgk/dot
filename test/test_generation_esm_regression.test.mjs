import { test } from "node:test";
import assert from "node:assert/strict";
import { inspect_source_auto } from "../code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js";
import { infer_signatures } from "../code/utilities/test_generation/code_shared_signature_inference_v2_2_0_draft.js";
import { generate_test_plan, render_test_file } from "../code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js";

test("esm named export class keeps acorn path, class target, constructor, and methods", () => {
  const source_text = "export class sample_box { constructor(config={}){this.config=config;} add(value){return value+1;} remove(value){return value-1;} }";
  const inventory = inspect_source_auto(source_text);
  assert.equal(inventory.inspection_mode, "acorn");
  assert.equal(inventory.export_style, "class");
  assert.equal(inventory.export_target, "sample_box");
  assert.ok(inventory.functions.some((entry) => entry.name === "add" && entry.kind === "method"));

  const plan = generate_test_plan(infer_signatures(inventory.functions), [], [], {
    module_kind: "esm",
    export_style: inventory.export_style,
    exported_names: inventory.exported_names,
    export_target: inventory.export_target
  });

  assert.ok(plan.units.some((unit) => unit.kind === "constructor"));
  assert.ok(plan.units.some((unit) => unit.name === "add"));
  assert.ok(plan.units.some((unit) => unit.name === "remove"));

  const rendered = render_test_file(plan, "D:/tmp/sample_box.mjs", "sample_box.snapshots.json", { esm: true });
  assert.ok(rendered.includes("mod.default || mod[\"sample_box\"] || mod"));
});

test("cjs default object class export keeps constructor target", () => {
  const source_text = "class cjs_box { constructor(config={}){this.config=config;} add(value){return value;} }\nmodule.exports = { default: cjs_box };";
  const inventory = inspect_source_auto(source_text);
  assert.equal(inventory.inspection_mode, "acorn");
  assert.equal(inventory.export_style, "class");
  assert.equal(inventory.export_target, "default");

  const plan = generate_test_plan(infer_signatures(inventory.functions), [], [], {
    module_kind: "cjs",
    export_style: inventory.export_style,
    exported_names: inventory.exported_names,
    export_target: inventory.export_target
  });

  assert.ok(plan.units.some((unit) => unit.kind === "constructor"));
  const rendered = render_test_file(plan, "D:/tmp/cjs_box.cjs", "cjs_box.snapshots.json", {});
  assert.ok(rendered.includes("const __ctor = mod.default || mod;"));
});
