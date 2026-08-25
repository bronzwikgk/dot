/**
 * failure_and_pattern.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md
 * Related: contract_017 (agent_improvement_cycle)
 *
 * Creates failure_record and pattern_record.
 * Failure: tracks when boundary, validation, or reasoning fails.
 * Pattern: tracks recurring behavior for improvement proposals.
 */

function create_failure_record({ session, source_ref, failure_type, reason, details }) {
  const failure_record = {
    record_type: 'failure_record',
    source_ref: source_ref || null,
    failure_type: failure_type || 'unknown',
    reason: reason || 'no_reason_provided',
    details: details || null,
    session_id: session.session_id,
    timestamp: new Date().toISOString()
  };

  if (!session.records.failure) session.records.failure = [];
  session.records.failure.push(failure_record);
  return failure_record;
}

function create_pattern_record({ session, source_ref, pattern_type, description, frequency }) {
  const pattern_record = {
    record_type: 'pattern_record',
    source_ref: source_ref || null,
    pattern_type: pattern_type || 'recurring_behavior',
    description: description || '',
    frequency: frequency || 1,
    session_id: session.session_id,
    timestamp: new Date().toISOString()
  };

  if (!session.records.pattern) session.records.pattern = [];
  session.records.pattern.push(pattern_record);
  return pattern_record;
}

module.exports = { create_failure_record, create_pattern_record };
