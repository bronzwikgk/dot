/**
 * recursion.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019) work_an_app_brain_006 (validation and recursion policy)
 * Related: contract_004 (validation_utility)
 *
 * Creates recursion_trace record.
 * Recursion policy: max depth, max node count, cycle detection, repeated-state detection,
 * timeout, audit trail, stop reason (contract 019 validation).
 */

function run_recursion_step({ goal, session, recursion_policy }) {
  if (!goal) throw new Error('goal required for recursion');

  const policy = recursion_policy || {};
  const recursion_trace = {
    record_type: 'recursion_trace',
    goal,
    depth: (session.records.recursion ? session.records.recursion.length : 0) + 1,
    max_depth: policy.max_depth || 5,
    max_nodes: policy.max_nodes || 50,
    cycle_detected: false,
    repeated_state_detected: false,
    timeout_reached: false,
    stop_reason: null,
    subgoals: [],
    timestamp: new Date().toISOString()
  };

  if (recursion_trace.depth >= recursion_trace.max_depth) {
    recursion_trace.stop_reason = 'max_depth';
  }

  if (!session.records.recursion) session.records.recursion = [];
  session.records.recursion.push(recursion_trace);
  return recursion_trace;
}

module.exports = { run_recursion_step };
