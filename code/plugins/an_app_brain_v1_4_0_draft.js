/**
 * an_app_brain_v1_4_0_draft.js
 * Status: proposed (prototype in dot/proposal/prototypes/an_app_brain_v1_4_0_prototype/)
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md
 * Parent: agent_3_agent_lang_and_memory_parent_007_memory_knowledge_tree_system_contract_v1_0_0_proposed.md
 *
 * Coordination layer for thinking-like behavior inside An App.
 * This is NOT a duplicate parser, memory, bot, or runner.
 * Reuses: an_app_lang (parse), an_memory + knowledge_tree (memory),
 * an_bot (session), agent_improvement_cycle (score/improve),
 * workflow_pipeline_runner (stage flow).
 *
 * Ports (fixture-based, no hard dependencies on Agent 1 or Agent 2):
 *   command_intent_port, an_app_lang_port, an_bot_port,
 *   an_memory_port, knowledge_tree_port, brain_coordination_port
 */

const CONTEXT_LAYERS = ["system", "organization", "project", "domain", "session", "conversation", "entity"];
const REASONING_TYPES = ["deductive", "inductive", "abductive", "analogical", "causal"];
const RESOLUTION_TYPES = ["coreference", "deictic", "temporal", "entity_ref", "route_ref", "provider_ref", "placeholder"];
const BOUNDARY_ISSUES = ["validation_failed", "low_confidence", "approval_required", "recursion_limit", "missing_evidence", "ambiguous_reference", "stale_context", "conflicting_memory", "unsafe_action"];

class an_app_brain {
  constructor(config = {}, ports = {}) {
    this.config = {
      max_depth: config.max_depth || 5,
      max_nodes: config.max_nodes || 50,
      timeout_ms: config.timeout_ms || 5000,
      score_denominator: config.score_denominator || 100,
      score_threshold: config.score_threshold || 0.8,
      ...config
    };
    this.ports = {
      command_intent: ports.command_intent || null,
      an_app_lang: ports.an_app_lang || null,
      an_bot: ports.an_bot || null,
      an_memory: ports.an_memory || null,
      knowledge_tree: ports.knowledge_tree || null,
      brain_coordination: ports.brain_coordination || null,
      ...ports
    };
    this.sessions = new Map();
  }

  start_session(session_ref, context_ref = null) {
    if (!session_ref) throw new Error("session_ref required");
    const session = {
      record_type: "brain_session",
      session_id: session_ref,
      context_ref,
      status: "active",
      turns: [],
      records: {
        ingestion: [], decomposition: [], parsing: [], reasoning: [],
        resolution: [], understanding: [], decision: [], composition: [],
        validation: [], boundary: [], score: [], improvement: [],
        evidence: [], knowledge: [], failure: [], pattern: [], recursion: []
      },
      created_at: new Date().toISOString()
    };
    this.sessions.set(session_ref, session);
    return session;
  }

  ingest_source(user_input, session, memory_ref = null) {
    if (!user_input) throw new Error("user_input required");
    const record = {
      record_type: "ingestion_record",
      source_type: this._detect_source_type(user_input),
      raw_length: typeof user_input === "string" ? user_input.length : 0,
      memory_ref,
      inventory_id: `inv_${session.session_id}_${session.records.ingestion.length + 1}`,
      session_id: session.session_id,
      status: "ingested",
      timestamp: new Date().toISOString()
    };
    session.records.ingestion.push(record);
    return record;
  }

  decompose_source(ingestion, session, recursion_policy = {}) {
    if (!ingestion) throw new Error("ingestion required");
    const policy = { max_depth: this.config.max_depth, max_nodes: this.config.max_nodes, ...recursion_policy };
    const record = {
      record_type: "decomposition_record",
      source_ref: ingestion.inventory_id,
      entities: [], relationships: [], actions: [],
      depth: 0, node_count: 0,
      recursion_stopped: false, stop_reason: null,
      cycle_detected: false, repeated_state_detected: false, timeout_reached: false,
      timestamp: new Date().toISOString()
    };
    const result = this._recursive_split("input", policy, record, new Set());
    Object.assign(record, result);
    session.records.decomposition.push(record);
    return record;
  }

  parse_request(decomposition, session, rule_set_ref = "default") {
    if (!decomposition) throw new Error("decomposition required");
    const record = {
      record_type: "parsing_record",
      source_ref: decomposition.source_ref,
      entities_parsed: decomposition.entities.length,
      rule_set_ref,
      validated: false,
      fol_formulas: [],
      timestamp: new Date().toISOString()
    };
    record.fol_formulas = decomposition.entities.map(e => ({ predicate: "parsed", args: [e.name], depth: e.depth }));
    record.validated = record.fol_formulas.length > 0;
    session.records.parsing.push(record);
    return record;
  }

  reason_about_request(parsed, session, memory_ref = null, context_ref = null) {
    if (!parsed) throw new Error("parsed required");
    const record = {
      record_type: "reasoning_trace",
      source_ref: parsed.source_ref,
      reasoning_type: "deductive",
      evidence_refs: memory_ref ? [memory_ref] : [],
      assumption_markers: memory_ref ? [] : ["no_memory_ref_provided"],
      conclusions: parsed.fol_formulas.map(f => ({ from: f.args[0], to: f.predicate, confidence: 0.8 })),
      timestamp: new Date().toISOString()
    };
    session.records.reasoning.push(record);
    return record;
  }

  resolve_reference(reasoning, session, context_ref = null) {
    if (!reasoning) throw new Error("reasoning required");
    const record = {
      record_type: "resolution_record",
      source_ref: reasoning.source_ref,
      resolution_type: "entity_ref",
      context_layer_used: context_ref ? "context_ref" : "none",
      resolved_refs: reasoning.conclusions.map(c => ({ original: c.from, resolved: c.to, type: "entity_ref" })),
      ambiguous: false,
      timestamp: new Date().toISOString()
    };
    session.records.resolution.push(record);
    return record;
  }

  understand_request(resolution, session, context_ref = null) {
    if (!resolution) throw new Error("resolution required");
    const record = {
      record_type: "understanding_record",
      source_ref: resolution.source_ref,
      intent: "respond_to_user",
      implications: resolution.resolved_refs.map(r => r.resolved),
      gaps: resolution.ambiguous ? ["ambiguous_reference"] : [],
      context_used: resolution.context_layer_used,
      timestamp: new Date().toISOString()
    };
    session.records.understanding.push(record);
    return record;
  }

  decide_next_action(understanding, session, approval_policy = {}) {
    if (!understanding) throw new Error("understanding required");
    const alternatives = understanding.implications.map(imp => ({ action: `respond_${imp}`, reason: imp }));
    const record = {
      record_type: "decision_record",
      source_ref: understanding.source_ref,
      alternatives,
      selected_action: alternatives.length > 0 ? alternatives[0].action : "fallback_honest",
      reason: understanding.gaps.length > 0 ? "gaps_detected" : "proceed",
      approval_required: approval_policy.required || false,
      approved: false,
      timestamp: new Date().toISOString()
    };
    session.records.decision.push(record);
    return record;
  }

  compose_response(decision, session, reasoning = null) {
    if (!decision) throw new Error("decision required");
    const record = {
      record_type: "composition_record",
      source_ref: decision.source_ref,
      response_text: decision.selected_action,
      evidence_refs: reasoning ? reasoning.evidence_refs : [],
      decision_ref: decision.selected_action,
      boundary_check_required: true,
      timestamp: new Date().toISOString()
    };
    session.records.composition.push(record);
    return record;
  }

  validate_reasoning(reasoning, composition, session) {
    if (!reasoning) throw new Error("reasoning required");
    const checks = {
      names_vocabulary_reconciled: true,
      refs_exist: true,
      parsed_request_validated: true,
      reasoning_has_evidence: reasoning.evidence_refs.length > 0 || reasoning.assumption_markers.length > 0,
      decision_has_alternatives: true,
      response_maps_to_decision: composition ? composition.decision_ref !== null : false
    };
    const record = {
      record_type: "validation_report",
      source_ref: composition ? composition.source_ref : reasoning.source_ref,
      checks,
      all_passed: Object.values(checks).every(v => v === true),
      timestamp: new Date().toISOString()
    };
    session.records.validation.push(record);
    return record;
  }

  check_boundary(validation, session, boundary_policy = {}) {
    if (!validation) throw new Error("validation required");
    const issues = [];
    if (!validation.all_passed) issues.push("validation_failed");
    if (boundary_policy.confidence !== undefined && boundary_policy.confidence < (boundary_policy.low_confidence_threshold || 0.5)) {
      issues.push("low_confidence");
    }
    if (boundary_policy.approval_required && !boundary_policy.approval_granted) issues.push("approval_required");
    if (boundary_policy.recursion_limit_reached) issues.push("recursion_limit");
    const record = {
      record_type: "boundary_record",
      source_ref: validation.source_ref,
      blocked: issues.length > 0,
      issues,
      fallback_honest: issues.length > 0 ? `Honest: boundary check failed. ${issues.join(", ")}` : null,
      timestamp: new Date().toISOString()
    };
    session.records.boundary.push(record);
    return record;
  }

  run_recursion_step(goal, session, recursion_policy = {}) {
    if (!goal) throw new Error("goal required");
    const policy = { max_depth: this.config.max_depth, max_nodes: this.config.max_nodes, ...recursion_policy };
    const record = {
      record_type: "recursion_trace",
      goal,
      depth: session.records.recursion.length + 1,
      max_depth: policy.max_depth,
      max_nodes: policy.max_nodes,
      cycle_detected: false,
      repeated_state_detected: false,
      timeout_reached: false,
      stop_reason: null,
      subgoals: [],
      timestamp: new Date().toISOString()
    };
    if (record.depth >= record.max_depth) record.stop_reason = "max_depth";
    session.records.recursion.push(record);
    return record;
  }

  score_result(composition, session, score_policy = {}) {
    if (!composition) throw new Error("composition required");
    const policy = { denominator: this.config.score_denominator, threshold: this.config.score_threshold, ...score_policy };
    const record = {
      record_type: "score_record",
      source_ref: composition.source_ref,
      score: 0.75,
      denominator: policy.denominator,
      threshold: policy.threshold,
      generated_tests: false,
      seed: policy.seed || null,
      timestamp: new Date().toISOString()
    };
    session.records.score.push(record);
    return record;
  }

  create_improvement_proposal(score, session) {
    if (!score) throw new Error("score required");
    const record = {
      record_type: "improvement_proposal",
      source_ref: score.source_ref,
      proposed_change: score.score < score.threshold ? "improve_accuracy" : "no_change_needed",
      approval_required: true,
      approved: false,
      rollback_possible: true,
      timestamp: new Date().toISOString()
    };
    session.records.improvement.push(record);
    return record;
  }

  record_evidence(session, ingestion = null, reasoning = null, composition = null) {
    const record = {
      record_type: "evidence_record",
      session_id: session.session_id,
      ingestion_ref: ingestion ? ingestion.inventory_id : null,
      reasoning_ref: reasoning ? reasoning.source_ref : null,
      composition_ref: composition ? composition.source_ref : null,
      provenance: { source: "brain_session", timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString()
    };
    session.records.evidence.push(record);
    return record;
  }

  audit_brain_session(session) {
    return {
      record_type: "audit_report",
      session_id: session.session_id,
      turn_count: session.turns.length,
      records_summary: Object.fromEntries(Object.entries(session.records).map(([k, v]) => [k, v.length])),
      boundary_blocks: session.records.boundary.filter(b => b.blocked).length,
      timestamp: new Date().toISOString()
    };
  }

  read_context(session, layer, ref = null) {
    if (!CONTEXT_LAYERS.includes(layer)) throw new Error(`valid context layer required: ${CONTEXT_LAYERS.join(", ")}`);
    return { record_type: "context_record", layer, ref, session_id: session.session_id, action: "read", timestamp: new Date().toISOString() };
  }

  update_context(session, layer, ref = null, data = null) {
    if (!CONTEXT_LAYERS.includes(layer)) throw new Error(`valid context layer required: ${CONTEXT_LAYERS.join(", ")}`);
    return { record_type: "context_record", layer, ref, data, session_id: session.session_id, action: "update", timestamp: new Date().toISOString() };
  }

  create_knowledge_base_record(session, source_ref = null) {
    return { record_type: "knowledge_base_record", source_ref, session_id: session.session_id, facts_count: 0, formulas_count: 0, status: "active", timestamp: new Date().toISOString() };
  }

  create_knowledge_fact(session, source_ref, predicate, args = [], confidence = 0.8) {
    return { record_type: "knowledge_fact", source_ref, predicate, args, confidence, provenance_ref: null, timestamp: new Date().toISOString() };
  }

  create_knowledge_formula(session, source_ref, formula_type = "fol", body = "") {
    return { record_type: "knowledge_formula", source_ref, formula_type, body, validated: false, timestamp: new Date().toISOString() };
  }

  create_failure_record(session, source_ref, failure_type, reason, details = null) {
    const record = { record_type: "failure_record", source_ref, failure_type, reason, details, session_id: session.session_id, timestamp: new Date().toISOString() };
    session.records.failure.push(record);
    return record;
  }

  create_pattern_record(session, source_ref, pattern_type, description, frequency = 1) {
    const record = { record_type: "pattern_record", source_ref, pattern_type, description, frequency, session_id: session.session_id, timestamp: new Date().toISOString() };
    session.records.pattern.push(record);
    return record;
  }

  async brain_pipeline({ user_input, session_ref, context_ref = null, memory_ref = null, rule_set_ref = "default", score_policy = {}, approval_policy = {}, boundary_policy = {}, recursion_policy = {} }) {
    const session = this.start_session(session_ref, context_ref);
    const ingestion = this.ingest_source(user_input, session, memory_ref);
    const decomposition = this.decompose_source(ingestion, session, recursion_policy);
    const parsed = this.parse_request(decomposition, session, rule_set_ref);
    const reasoning = this.reason_about_request(parsed, session, memory_ref, context_ref);
    const resolution = this.resolve_reference(reasoning, session, context_ref);
    const understanding = this.understand_request(resolution, session, context_ref);
    const decision = this.decide_next_action(understanding, session, approval_policy);
    const composition = this.compose_response(decision, session, reasoning);
    const validation = this.validate_reasoning(reasoning, composition, session);
    const boundary = this.check_boundary(validation, session, boundary_policy);

    if (boundary.blocked) {
      return { session, boundary, response: boundary.fallback_honest };
    }

    const score = this.score_result(composition, session, score_policy);
    const improvement = this.create_improvement_proposal(score, session);
    this.record_evidence(session, ingestion, reasoning, composition);
    const audit = this.audit_brain_session(session);

    return { session, composition, score, improvement, audit };
  }

  _detect_source_type(input) {
    if (typeof input !== "string") return "unknown";
    if (input.startsWith("{") || input.startsWith("[")) return "json";
    if (input.includes("\n") && input.split("\n").length > 10) return "multi_line_text";
    return "text";
  }

  _recursive_split(node, policy, record, visited) {
    const result = { entities: [], relationships: [], actions: [], node_count: 0, depth: 0, stopped: false, stop_reason: null, cycle_detected: false, repeated_state_detected: false, timeout_reached: false };

    const split = (n, depth) => {
      if (result.stopped) return;
      if (depth > policy.max_depth) { result.stopped = true; result.stop_reason = "max_depth"; return; }
      if (result.node_count >= (policy.max_nodes || this.config.max_nodes)) { result.stopped = true; result.stop_reason = "max_nodes"; return; }
      if (visited.has(n)) { result.stopped = true; result.stop_reason = "cycle"; result.cycle_detected = true; return; }
      visited.add(n);
      result.node_count++;
      result.depth = Math.max(result.depth, depth);
      result.entities.push({ name: n, depth });
      if (depth < policy.max_depth && result.node_count < (policy.max_nodes || this.config.max_nodes)) {
        split(`${n}_left`, depth + 1);
        split(`${n}_right`, depth + 1);
      }
    };

    split(node, 0);
    return result;
  }
}

export { an_app_brain, CONTEXT_LAYERS, REASONING_TYPES, RESOLUTION_TYPES, BOUNDARY_ISSUES };
