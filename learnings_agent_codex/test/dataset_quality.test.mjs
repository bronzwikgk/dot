import assert from "node:assert/strict";
import test from "node:test";
import * as core_sets from "../code/dataset/validation_word_datasets.js";
import * as ui_sets from "../code/dataset/ui_word_datasets.js";
import * as behavior_sets from "../code/dataset/entity_behavior_datasets.js";

test("all dataset exports are 1d arrays of unique strings", () => {
  for (const [name, values] of Object.entries({ ...core_sets, ...ui_sets })) {
    assert.equal(Array.isArray(values), true, `${name} must be an array`);
    assert.equal(values.every((value) => typeof value === "string"), true, `${name} must contain strings`);
    assert.equal(new Set(values).size, values.length, `${name} must be unique`);
  }
});

test("behavior mapping datasets are 2 item string pairs", () => {
  for (const [name, values] of Object.entries(behavior_sets)) {
    assert.equal(Array.isArray(values), true, `${name} must be an array`);
    assert.equal(values.every((pair) => Array.isArray(pair) && pair.length === 2), true, `${name} must contain pairs`);
    assert.equal(values.every((pair) => pair.every((value) => typeof value === "string")), true, `${name} pairs must contain strings`);
  }
});

test("approved datasets do not contain banned words", () => {
  const banned = new Set(core_sets.banned_words);
  for (const [name, values] of Object.entries({ ...core_sets, ...ui_sets })) {
    if (name === "banned_words") continue;
    const matches = values.filter((value) => banned.has(value));
    assert.deepEqual(matches, [], `${name} contains banned words`);
  }
});
