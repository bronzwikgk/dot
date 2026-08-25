/**
 * composition.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: contract_019 work_an_app_brain_005 (composition and understanding records)
 * Related: contract_010 (an_app_lang), contract_011 (an_bot_agent)
 *
 * Creates understanding_record and composition_record.
 * Understanding: intent, implication, gap detection.
 * Composed response maps back to decision and evidence (contract 019 validation).
 */

function understand_request({ resolution, session, context_ref }) {
  if (!resolution) throw new Error('resolution required for understanding');

  const understanding_record = {
    record_type: 'understanding_record',
    source_ref: resolution.source_ref,
    intent: 'respond_to_user',
    implications: resolution.resolved_refs.map(r => r.resolved),
    gaps: resolution.ambiguous ? ['ambiguous_reference'] : [],
    context_used: resolution.context_layer_used,
    timestamp: new Date().toISOString()
  };

  session.records.understanding.push(understanding_record);
  return understanding_record;
}

function compose_response({ decision, session, reasoning }) {
  if (!decision) throw new Error('decision required for composition');

  const composition_record = {
    record_type: 'composition_record',
    source_ref: decision.source_ref,
    response_text: decision.selected_action,
    evidence_refs: reasoning ? reasoning.evidence_refs : [],
    decision_ref: decision.selected_action,
    boundary_check_required: true,
    timestamp: new Date().toISOString()
  };

  session.records.composition.push(composition_record);
  return composition_record;
}

module.exports = { understand_request, compose_response };
