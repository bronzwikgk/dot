/**
 * reasoning.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019) work_an_app_brain_004 (reasoning and resolution records)
 * Related: contract_012 (an_memory_reasoning)
 *
 * Creates reasoning_trace and resolution_record.
 * Reasoning trace declares: deductive, inductive, abductive, analogical, or causal
 * reasoning type (contract 019 validation).
 * Resolution record declares: coreference, deictic, temporal, entity_ref, route_ref,
 * provider_ref, or placeholder resolution type (contract 019 validation).
 * Reasoning trace includes source evidence or explicit assumption markers (contract 019 validation).
 */

const REASONING_TYPES = ['deductive', 'inductive', 'abductive', 'analogical', 'causal'];
const RESOLUTION_TYPES = ['coreference', 'deictic', 'temporal', 'entity_ref', 'route_ref', 'provider_ref', 'placeholder'];

function reason_about_request({ parsed, session, memory_ref, context_ref }) {
  if (!parsed) throw new Error('parsed required for reasoning');

  const reasoning_trace = {
    record_type: 'reasoning_trace',
    source_ref: parsed.source_ref,
    reasoning_type: 'deductive',
    evidence_refs: memory_ref ? [memory_ref] : [],
    assumption_markers: memory_ref ? [] : ['no_memory_ref_provided'],
    conclusions: parsed.fol_formulas.map(f => ({
      from: f.args[0],
      to: f.predicate,
      confidence: 0.8
    })),
    timestamp: new Date().toISOString()
  };

  session.records.reasoning.push(reasoning_trace);
  return reasoning_trace;
}

function resolve_reference({ reasoning, session, context_ref }) {
  if (!reasoning) throw new Error('reasoning required for resolution');

  const resolution_record = {
    record_type: 'resolution_record',
    source_ref: reasoning.source_ref,
    resolution_type: 'entity_ref',
    context_layer_used: context_ref ? 'context_ref' : 'none',
    resolved_refs: reasoning.conclusions.map(c => ({
      original: c.from,
      resolved: c.to,
      type: 'entity_ref'
    })),
    ambiguous: false,
    timestamp: new Date().toISOString()
  };

  session.records.resolution.push(resolution_record);
  return resolution_record;
}

module.exports = { reason_about_request, resolve_reference, REASONING_TYPES, RESOLUTION_TYPES };
