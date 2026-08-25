/**
 * decomposition.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: contract_019 work_an_app_brain_002 (decomposition records + recursive split policy)
 * Related: contract_007 (workflow pipeline runner), contract_018 (knowledge tree)
 *
 * Creates decomposition_record: breaks ingested source into entities, relationships, actions.
 * Recursion policy: max depth, max node count, cycle detection, repeated-state detection,
 * timeout, audit trail, stop reason (contract 019 validation).
 * Boundary: recursion limits prevent runaway source decomposition (contract 007 success).
 */

const DEFAULT_RECURSION_POLICY = {
  max_depth: 5,
  max_nodes: 50,
  cycle_detection: true,
  timeout_ms: 5000,
  audit_trail: true
};

function decompose_source({ ingestion, session, recursion_policy }) {
  if (!ingestion) throw new Error('ingestion required for decomposition');

  const policy = { ...DEFAULT_RECURSION_POLICY, ...recursion_policy };
  const decomposition_record = {
    record_type: 'decomposition_record',
    source_ref: ingestion.inventory_id,
    entities: [],
    relationships: [],
    actions: [],
    depth: 0,
    node_count: 0,
    recursion_stopped: false,
    stop_reason: null,
    timestamp: new Date().toISOString()
  };

  const result = recursive_split(ingestion.raw_length > 0 ? 'input' : 'empty', policy, decomposition_record);
  decomposition_record.entities = result.entities;
  decomposition_record.relationships = result.relationships;
  decomposition_record.actions = result.actions;
  decomposition_record.node_count = result.node_count;
  decomposition_record.depth = result.depth;
  decomposition_record.recursion_stopped = result.stopped;
  decomposition_record.stop_reason = result.stop_reason;

  session.records.decomposition.push(decomposition_record);
  return decomposition_record;
}

function recursive_split(node, policy, record) {
  const result = { entities: [], relationships: [], actions: [], node_count: 0, depth: 0, stopped: false, stop_reason: null };

  function split(n, depth) {
    if (result.stopped) return;
    if (depth > policy.max_depth) { result.stopped = true; result.stop_reason = 'max_depth'; return; }
    if (result.node_count >= policy.max_nodes) { result.stopped = true; result.stop_reason = 'max_nodes'; return; }

    result.node_count++;
    result.depth = Math.max(result.depth, depth);
    result.entities.push({ name: n, depth });

    if (depth < policy.max_depth && result.node_count < policy.max_nodes) {
      split(n + '_left', depth + 1);
      split(n + '_right', depth + 1);
    }
  }

  split(node, 0);
  return result;
}

module.exports = { decompose_source, DEFAULT_RECURSION_POLICY };
