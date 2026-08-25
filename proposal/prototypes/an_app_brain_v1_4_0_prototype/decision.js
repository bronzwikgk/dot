/**
 * decision.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019) work_an_app_brain_005 (composition and understanding records)
 * Related: contract_011 (an_bot_agent)
 *
 * Creates decision_record.
 * Decision record includes alternatives, selected action, and reason (contract 019 validation).
 * Decision created before execution (contract 019 success).
 */

function decide_next_action({ understanding, session, approval_policy }) {
  if (!understanding) throw new Error('understanding required for decision');

  const alternatives = understanding.implications.map(imp => ({
    action: 'respond_' + imp,
    reason: imp
  }));

  const decision_record = {
    record_type: 'decision_record',
    source_ref: understanding.source_ref,
    alternatives,
    selected_action: alternatives.length > 0 ? alternatives[0].action : 'fallback_honest',
    reason: understanding.gaps.length > 0 ? 'gaps_detected' : 'proceed',
    approval_required: approval_policy ? approval_policy.required : false,
    approved: false,
    timestamp: new Date().toISOString()
  };

  session.records.decision.push(decision_record);
  return decision_record;
}

module.exports = { decide_next_action };
