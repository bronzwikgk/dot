import test from "node:test";
import assert from "node:assert/strict";
import { an_app_brain, CONTEXT_LAYERS, REASONING_TYPES, RESOLUTION_TYPES, BOUNDARY_ISSUES } from "../../code/plugins/an_app_brain_v1_4_0_draft.js";

test("an_app_brain module loads with ESM import", () => {
  const brain = new an_app_brain();
  assert.ok(brain);
  assert.equal(typeof brain.brain_pipeline, "function");
});

test("an_app_brain exports constants", () => {
  assert.ok(Array.isArray(CONTEXT_LAYERS));
  assert.equal(CONTEXT_LAYERS.length, 7);
  assert.ok(Array.isArray(REASONING_TYPES));
  assert.equal(REASONING_TYPES.length, 5);
  assert.ok(Array.isArray(RESOLUTION_TYPES));
  assert.equal(RESOLUTION_TYPES.length, 7);
  assert.ok(Array.isArray(BOUNDARY_ISSUES));
  assert.ok(BOUNDARY_ISSUES.length > 0);
});

test("an_app_brain accepts config and ports", () => {
  const brain = new an_app_brain(
    { max_depth: 3, max_nodes: 10 },
    { an_app_lang: "mock_lang" }
  );
  assert.equal(brain.config.max_depth, 3);
  assert.equal(brain.config.max_nodes, 10);
  assert.equal(brain.ports.an_app_lang, "mock_lang");
});

test("an_app_brain does not require concrete Agent 1 or Agent 2 modules", () => {
  const brain = new an_app_brain({}, {
    command_intent: null,
    an_app_lang: null,
    an_bot: null,
    an_memory: null,
    knowledge_tree: null,
    brain_coordination: null
  });
  assert.ok(brain);
});

test("an_app_brain brain_pipeline runs with mock ports", async () => {
  const brain = new an_app_brain({}, {
    command_intent: "mock",
    an_app_lang: "mock",
    an_bot: "mock",
    an_memory: "mock",
    knowledge_tree: "mock"
  });
  const result = await brain.brain_pipeline({
    user_input: "test input",
    session_ref: "test_session_001"
  });
  assert.ok(result.session);
  assert.equal(result.session.session_id, "test_session_001");
});
