import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { access } from "node:fs/promises";

const source_adoption_trial_runner_path = "../code/source_adoption_pipeline/trial_runner.js";

async function load_source_adoption_trial_runner(t) {
  try {
    await access(new URL(source_adoption_trial_runner_path, import.meta.url));
  } catch (error) {
    t.skip("source adoption pipeline is deferred and not present in this branch");
    return null;
  }
  const module = await import(source_adoption_trial_runner_path);
  return module.source_adoption_trial_runner;
}

test("source adoption trial inventories b3 and creates recommendations", async (t) => {
  const source_adoption_trial_runner = await load_source_adoption_trial_runner(t);
  if (!source_adoption_trial_runner) return;
  const runner = new source_adoption_trial_runner({
    batch_id: "test_b3",
    root_path: path.resolve("."),
    input_paths: ["../input_temp/b3"],
    log_path: "code/source_adoption_pipeline/logs/test_b3_report.md"
  });
  const result = await runner.run();
  assert.equal(result.inventory.file_count, 1);
  assert.ok(result.incoming_concepts.length > 0);
  assert.ok(result.incoming_items.length > result.incoming_concepts.length);
  assert.equal(result.recommendations.length, result.incoming_concepts.length);
  assert.equal(result.validation.every((check) => check.ok), true);
  assert.equal(result.doc_profiles.length, 1);
  assert.equal(result.doc_profiles[0].project, "source_batch_b3");
  assert.ok(result.incoming_items.some((item) => item.item_kind === "risk"));
  assert.ok(result.recommendations.some((item) => item.owner === "APPLICATION_ENTITY_DOCTRINE.md"));
});

test("source adoption trial inventories all current input batches", async (t) => {
  const source_adoption_trial_runner = await load_source_adoption_trial_runner(t);
  if (!source_adoption_trial_runner) return;
  const runner = new source_adoption_trial_runner({
    batch_id: "test_all_batches",
    root_path: path.resolve("."),
    input_paths: ["../input_temp/b0", "../input_temp/b1", "../input_temp/b2", "../input_temp/b3"],
    log_path: "code/source_adoption_pipeline/logs/test_all_batches_report.md"
  });
  const result = await runner.run();
  assert.equal(result.inventory.file_count, 29);
  assert.ok(result.incoming_items.length >= 150);
  assert.ok(result.incoming_concepts.length >= 50);
  assert.ok(result.incoming_items.some((item) => item.item_kind === "dataset"));
  assert.ok(result.incoming_items.some((item) => item.item_kind === "entity"));
  assert.ok(result.incoming_items.some((item) => item.item_kind === "policy"));
  assert.ok(result.incoming_items.some((item) => item.item_kind === "relationship"));
  assert.equal(result.validation.every((check) => check.ok), true);
});
