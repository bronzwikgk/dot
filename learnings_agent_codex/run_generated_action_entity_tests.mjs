import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspect_source_auto } from "../dot/code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js";
import { infer_signatures } from "../dot/code/utilities/test_generation/code_shared_signature_inference_v2_2_0_draft.js";
import { generate_test_plan, render_test_file } from "../dot/code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const dot_root = path.resolve(root, "../dot");
const target = path.join(root, "code/action_entity.js");
const out_dir = path.join(root, ".generated_tests");

const entries_from_dataset = (file) => {
  const text = fs.readFileSync(file, "utf8");
  const out = [];
  const re = /"((?:[^"\\]|\\.)*\|\|(?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    out.push(JSON.parse('"' + match[1] + '"'));
  }
  return out;
};

fs.mkdirSync(out_dir, { recursive: true });

const templates = entries_from_dataset(path.join(dot_root, "dataset_shared_v3/code/dataset_of_testing_templates_in_shared_v2.dataset"));
const samples = entries_from_dataset(path.join(dot_root, "dataset_shared_v3/code/dataset_of_testing_samples_in_shared_v2.dataset"));
const edges = entries_from_dataset(path.join(dot_root, "dataset_shared_v3/code/dataset_of_testing_edges_in_shared_v2.dataset"));
const source = fs.readFileSync(target, "utf8");
const inventory = inspect_source_auto(source);
const signatures = infer_signatures(inventory.functions);
const plan = generate_test_plan(signatures, templates, samples, {
  target,
  module_kind: "esm",
  export_style: inventory.export_style,
  exported_names: inventory.exported_names,
  file_flags: { has_module_state: inventory.has_module_state },
  edge_bank_strings: edges
});

const base = "scratch_action_entity";
fs.writeFileSync(
  path.join(out_dir, `${base}.test.mjs`),
  render_test_file(plan, target, `${base}.snapshots.json`, { esm: true })
);
fs.writeFileSync(
  path.join(out_dir, `${base}.plan.json`),
  JSON.stringify({
    inventory: {
      export_style: inventory.export_style,
      exported_names: inventory.exported_names,
      functions: inventory.functions.map((item) => ({ name: item.name, kind: item.kind, container: item.container }))
    },
    summary: plan.summary
  }, null, 2)
);

console.log("generated scratch action_entity tests", JSON.stringify(plan.summary));
