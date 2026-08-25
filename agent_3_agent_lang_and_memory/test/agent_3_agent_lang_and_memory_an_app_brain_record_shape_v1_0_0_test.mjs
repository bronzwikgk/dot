import test from "node:test";
import assert from "node:assert/strict";
import { an_app_brain } from "../../code/plugins/an_app_brain_v1_4_0_draft.js";

const brain = new an_app_brain();

test("brain_session record includes required fields", () => {
  const session = brain.start_session("s1", "ctx1");
  assert.equal(session.record_type, "brain_session");
  assert.equal(session.session_id, "s1");
  assert.equal(session.context_ref, "ctx1");
  assert.equal(session.status, "active");
  assert.ok(session.turns);
  assert.ok(session.records);
  assert.ok(session.created_at);
});

test("ingestion_record includes session_id and inventory_id", () => {
  const session = brain.start_session("s2");
  const record = brain.ingest_source("hello world", session);
  assert.equal(record.record_type, "ingestion_record");
  assert.equal(record.session_id, "s2");
  assert.ok(record.inventory_id);
  assert.ok(record.inventory_id.startsWith("inv_s2_"));
  assert.equal(record.source_type, "text");
});

test("decomposition_record respects max_depth", () => {
  const session = brain.start_session("s3");
  const ingestion = brain.ingest_source("test", session);
  const record = brain.decompose_source(ingestion, session, { max_depth: 2, max_nodes: 100 });
  assert.equal(record.record_type, "decomposition_record");
  assert.ok(record.depth <= 2);
  assert.ok(record.node_count > 0);
});

test("decomposition_record respects max_nodes", () => {
  const session = brain.start_session("s4");
  const ingestion = brain.ingest_source("test", session);
  const record = brain.decompose_source(ingestion, session, { max_depth: 100, max_nodes: 5 });
  assert.equal(record.record_type, "decomposition_record");
  assert.ok(record.node_count <= 5);
});

test("decomposition detects cycle", () => {
  const session = brain.start_session("s5");
  const ingestion = brain.ingest_source("test", session);
  const record = brain.decompose_source(ingestion, session, { max_depth: 100, max_nodes: 100 });
  assert.equal(record.record_type, "decomposition_record");
  assert.ok(record.cycle_detected !== undefined);
});

test("parsing_record links to decomposition", () => {
  const session = brain.start_session("s6");
  const ingestion = brain.ingest_source("test", session);
  const decomposition = brain.decompose_source(ingestion, session);
  const record = brain.parse_request(decomposition, session);
  assert.equal(record.record_type, "parsing_record");
  assert.equal(record.source_ref, decomposition.source_ref);
  assert.ok(record.fol_formulas.length > 0);
});

test("reasoning_trace has reasoning_type", () => {
  const session = brain.start_session("s7");
  const ingestion = brain.ingest_source("test", session);
  const decomposition = brain.decompose_source(ingestion, session);
  const parsed = brain.parse_request(decomposition, session);
  const record = brain.reason_about_request(parsed, session);
  assert.equal(record.record_type, "reasoning_trace");
  assert.ok(REASONING_TYPES.includes(record.reasoning_type));
});

test("resolution_record has resolution_type", () => {
  const session = brain.start_session("s8");
  const ingestion = brain.ingest_source("test", session);
  const decomposition = brain.decompose_source(ingestion, session);
  const parsed = brain.parse_request(decomposition, session);
  const reasoning = brain.reason_about_request(parsed, session);
  const record = brain.resolve_reference(reasoning, session);
  assert.equal(record.record_type, "resolution_record");
  assert.ok(RESOLUTION_TYPES.includes(record.resolution_type));
});

test("understanding_record has intent and gaps", () => {
  const session = brain.start_session("s9");
  const ingestion = brain.ingest_source("test", session);
  const decomposition = brain.decompose_source(ingestion, session);
  const parsed = brain.parse_request(decomposition, session);
  const reasoning = brain.reason_about_request(parsed, session);
  const resolution = brain.resolve_reference(reasoning, session);
  const record = brain.understand_request(resolution, session);
  assert.equal(record.record_type, "understanding_record");
  assert.ok(record.intent);
  assert.ok(Array.isArray(record.gaps));
});

test("decision_record has alternatives and reason", () => {
  const session = brain.start_session("s10");
  const ingestion = brain.ingest_source("test", session);
  const decomposition = brain.decompose_source(ingestion, session);
  const parsed = brain.parse_request(decomposition, session);
  const reasoning = brain.reason_about_request(parsed, session);
  const resolution = brain.resolve_reference(reasoning, session);
  const understanding = brain.understand_request(resolution, session);
  const record = brain.decide_next_action(understanding, session);
  assert.equal(record.record_type, "decision_record");
  assert.ok(Array.isArray(record.alternatives));
  assert.ok(record.selected_action);
  assert.ok(record.reason);
});

test("validation_report checks all fields", () => {
  const session = brain.start_session("s11");
  const ingestion = brain.ingest_source("test", session);
  const decomposition = brain.decompose_source(ingestion, session);
  const parsed = brain.parse_request(decomposition, session);
  const reasoning = brain.reason_about_request(parsed, session);
  const composition = brain.compose_response({ source_ref: "x", selected_action: "y", decision_ref: "y", evidence_refs: [], boundary_check_required: true }, session, reasoning);
  const record = brain.validate_reasoning(reasoning, composition, session);
  assert.equal(record.record_type, "validation_report");
  assert.ok(record.checks);
  assert.equal(typeof record.all_passed, "boolean");
});

test("boundary_record blocks on validation_failed", () => {
  const session = brain.start_session("s12");
  const validation = { source_ref: "x", all_passed: false, checks: {} };
  const record = brain.check_boundary(validation, session);
  assert.equal(record.record_type, "boundary_record");
  assert.equal(record.blocked, true);
  assert.ok(record.issues.includes("validation_failed"));
  assert.ok(record.fallback_honest);
});

test("recursion_trace has max_depth and stop_reason", () => {
  const session = brain.start_session("s13");
  const record = brain.run_recursion_step("goal1", session, { max_depth: 1 });
  assert.equal(record.record_type, "recursion_trace");
  assert.equal(record.depth, 1);
  assert.equal(record.max_depth, 1);
  assert.equal(record.stop_reason, "max_depth");
});

test("score_record has denominator and threshold", () => {
  const session = brain.start_session("s14");
  const composition = { source_ref: "x" };
  const record = brain.score_result(composition, session);
  assert.equal(record.record_type, "score_record");
  assert.equal(record.denominator, 100);
  assert.equal(record.threshold, 0.8);
});

test("improvement_proposal requires approval", () => {
  const session = brain.start_session("s15");
  const score = { source_ref: "x", score: 0.5, threshold: 0.8 };
  const record = brain.create_improvement_proposal(score, session);
  assert.equal(record.record_type, "improvement_proposal");
  assert.equal(record.approval_required, true);
  assert.equal(record.approved, false);
  assert.equal(record.rollback_possible, true);
});

test("evidence_record has provenance", () => {
  const session = brain.start_session("s16");
  const record = brain.record_evidence(session);
  assert.equal(record.record_type, "evidence_record");
  assert.ok(record.provenance);
  assert.ok(record.provenance.source);
});

test("context_record has layer and action", () => {
  const session = brain.start_session("s17");
  const record = brain.read_context(session, "project");
  assert.equal(record.record_type, "context_record");
  assert.equal(record.layer, "project");
  assert.equal(record.action, "read");
});

test("knowledge_base_record has status", () => {
  const session = brain.start_session("s18");
  const record = brain.create_knowledge_base_record(session);
  assert.equal(record.record_type, "knowledge_base_record");
  assert.equal(record.status, "active");
});

test("failure_record tracks failure_type", () => {
  const session = brain.start_session("s19");
  const record = brain.create_failure_record(session, "source_ref", "boundary", "test failure");
  assert.equal(record.record_type, "failure_record");
  assert.equal(record.failure_type, "boundary");
  assert.equal(record.reason, "test failure");
});

test("pattern_record tracks frequency", () => {
  const session = brain.start_session("s20");
  const record = brain.create_pattern_record(session, "source_ref", "recurring_behavior", "test pattern", 5);
  assert.equal(record.record_type, "pattern_record");
  assert.equal(record.frequency, 5);
});

test("audit_report summarizes all record types", () => {
  const session = brain.start_session("s21");
  brain.ingest_source("test", session);
  const audit = brain.audit_brain_session(session);
  assert.equal(audit.record_type, "audit_report");
  assert.equal(audit.session_id, "s21");
  assert.equal(audit.records_summary.ingestion, 1);
  assert.equal(audit.boundary_blocks, 0);
});

const REASONING_TYPES = ["deductive", "inductive", "abductive", "analogical", "causal"];
const RESOLUTION_TYPES = ["coreference", "deictic", "temporal", "entity_ref", "route_ref", "provider_ref", "placeholder"];
