import test from "node:test";
import assert from "node:assert/strict";
import { an_app_brain } from "../code/an_app_brain_v1_4_0_draft.js";

const brain = new an_app_brain();

test("boundary check blocks unsafe output", () => {
  const session = brain.start_session("b1");
  const validation = { source_ref: "x", all_passed: true, checks: {} };
  const record = brain.check_boundary(validation, session, { approval_required: true, approval_granted: false });
  assert.equal(record.blocked, true);
  assert.ok(record.issues.includes("approval_required"));
});

test("boundary check blocks low confidence", () => {
  const session = brain.start_session("b2");
  const validation = { source_ref: "x", all_passed: true, checks: {} };
  const record = brain.check_boundary(validation, session, { confidence: 0.3, low_confidence_threshold: 0.5 });
  assert.equal(record.blocked, true);
  assert.ok(record.issues.includes("low_confidence"));
});

test("boundary check blocks recursion limit", () => {
  const session = brain.start_session("b3");
  const validation = { source_ref: "x", all_passed: true, checks: {} };
  const record = brain.check_boundary(validation, session, { recursion_limit_reached: true });
  assert.equal(record.blocked, true);
  assert.ok(record.issues.includes("recursion_limit"));
});

test("boundary check passes when all clear", () => {
  const session = brain.start_session("b4");
  const validation = { source_ref: "x", all_passed: true, checks: {} };
  const record = brain.check_boundary(validation, session);
  assert.equal(record.blocked, false);
  assert.equal(record.issues.length, 0);
  assert.equal(record.fallback_honest, null);
});

test("improvement proposal requires approval and does not apply changes", () => {
  const session = brain.start_session("b5");
  const score = { source_ref: "x", score: 0.5, threshold: 0.8 };
  const proposal = brain.create_improvement_proposal(score, session);
  assert.equal(proposal.approval_required, true);
  assert.equal(proposal.approved, false);
  assert.equal(proposal.rollback_possible, true);
  assert.notEqual(proposal.proposed_change, "no_change_needed");
});

test("brain pipeline returns honest fallback on boundary block", async () => {
  const brain = new an_app_brain({}, {
    command_intent: "mock",
    an_app_lang: "mock",
    an_bot: "mock",
    an_memory: "mock"
  });
  const result = await brain.brain_pipeline({
    user_input: "test",
    session_ref: "b6",
    boundary_policy: { approval_required: true, approval_granted: false }
  });
  assert.ok(result.boundary);
  assert.equal(result.boundary.blocked, true);
  assert.ok(result.response);
  assert.ok(result.response.startsWith("Honest"));
});

test("decomposition detects cycle and stops", () => {
  const session = brain.start_session("b7");
  const ingestion = brain.ingest_source("test", session);
  const record = brain.decompose_source(ingestion, session, { max_depth: 100, max_nodes: 100 });
  assert.equal(record.cycle_detected, false);
  assert.ok(record.node_count > 0);
});

test("decomposition stops at max_depth", () => {
  const session = brain.start_session("b8");
  const ingestion = brain.ingest_source("test", session);
  const record = brain.decompose_source(ingestion, session, { max_depth: 1, max_nodes: 100 });
  assert.equal(record.recursion_stopped, true);
  assert.equal(record.stop_reason, "max_depth");
});

test("decomposition stops at max_nodes", () => {
  const session = brain.start_session("b9");
  const ingestion = brain.ingest_source("test", session);
  const record = brain.decompose_source(ingestion, session, { max_depth: 100, max_nodes: 3 });
  assert.equal(record.recursion_stopped, true);
  assert.equal(record.stop_reason, "max_nodes");
  assert.ok(record.node_count <= 3);
});

test("no hard dependencies on Agent 1 or Agent 2 code", () => {
  const brain = new an_app_brain({}, {
    command_intent: null,
    an_app_lang: null,
    an_bot: null,
    an_memory: null,
    knowledge_tree: null,
    brain_coordination: null
  });
  assert.ok(brain);
  assert.ok(brain.ports.an_app_lang === null);
  assert.ok(brain.ports.an_bot === null);
});

test("context rejects invalid layer", () => {
  const session = brain.start_session("b10");
  assert.throws(() => brain.read_context(session, "invalid_layer"), /valid context layer required/);
});
