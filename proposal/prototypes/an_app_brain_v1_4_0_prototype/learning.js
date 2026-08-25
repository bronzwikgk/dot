/**
 * learning.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019) work_an_app_brain_007 (learning and controlled improvement operations)
 * Related: contract_017 (agent_improvement_cycle)
 *
 * Creates score_record and improvement_proposal.
 * Score policy: explicit denominator, threshold, and seed when generated tests are involved.
 * Improvement proposals require approval before active behavior changes (contract 019 validation).
 * No source-only names promoted into active datasets without authorization.
 */

function score_result({ composition, session, score_policy }) {
  if (!composition) throw new Error('composition required for scoring');

  const policy = score_policy || { denominator: 100, threshold: 0.8 };
  const score_record = {
    record_type: 'score_record',
    source_ref: composition.source_ref,
    score: 0.75,
    denominator: policy.denominator || 100,
    threshold: policy.threshold || 0.8,
    generated_tests: false,
    seed: policy.seed || null,
    timestamp: new Date().toISOString()
  };

  session.records.score.push(score_record);
  return score_record;
}

function create_improvement_proposal({ score, session }) {
  if (!score) throw new Error('score required for improvement proposal');

  const improvement_proposal = {
    record_type: 'improvement_proposal',
    source_ref: score.source_ref,
    proposed_change: score.score < score.threshold ? 'improve_accuracy' : 'no_change_needed',
    approval_required: true,
    approved: false,
    rollback_possible: true,
    timestamp: new Date().toISOString()
  };

  session.records.improvement.push(improvement_proposal);
  return improvement_proposal;
}

module.exports = { score_result, create_improvement_proposal };
