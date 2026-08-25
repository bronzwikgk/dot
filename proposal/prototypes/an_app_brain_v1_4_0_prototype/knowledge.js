/**
 * knowledge.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019)_an_app_brain_domain_v1_0_0_proposed.md
 * Related: contract_018 (knowledge_tree)
 *
 * Creates knowledge_base_record, knowledge_fact, knowledge_formula, knowledge_provenance.
 * Every fact has provenance (source raw + line) (parent contract 007 success).
 * Knowledge tree output feeds docs, datasets, and planning (parent contract 007 success).
 */

function create_knowledge_base_record({ session, source_ref }) {
  const knowledge_base_record = {
    record_type: 'knowledge_base_record',
    source_ref: source_ref || null,
    session_id: session.session_id,
    facts_count: 0,
    formulas_count: 0,
    status: 'active',
    timestamp: new Date().toISOString()
  };

  if (!session.records.knowledge) session.records.knowledge = [];
  session.records.knowledge.push(knowledge_base_record);
  return knowledge_base_record;
}

function create_knowledge_fact({ session, source_ref, predicate, args, confidence }) {
  const knowledge_fact = {
    record_type: 'knowledge_fact',
    source_ref: source_ref || null,
    predicate: predicate || 'unknown',
    args: args || [],
    confidence: confidence || 0.8,
    provenance_ref: null,
    timestamp: new Date().toISOString()
  };

  const provenance = create_knowledge_provenance({ session, source_ref, fact_ref: predicate });
  knowledge_fact.provenance_ref = provenance.provenance_id;

  return knowledge_fact;
}

function create_knowledge_formula({ session, source_ref, formula_type, body }) {
  const knowledge_formula = {
    record_type: 'knowledge_formula',
    source_ref: source_ref || null,
    formula_type: formula_type || 'fol',
    body: body || '',
    validated: false,
    timestamp: new Date().toISOString()
  };

  return knowledge_formula;
}

function create_knowledge_provenance({ session, source_ref, fact_ref }) {
  const knowledge_provenance = {
    record_type: 'knowledge_provenance',
    source_ref: source_ref || null,
    fact_ref: fact_ref || null,
    provenance_id: 'prov_' + session.session_id + '_' + Date.now(),
    source_type: 'brain_session',
    timestamp: new Date().toISOString()
  };

  return knowledge_provenance;
}

module.exports = {
  create_knowledge_base_record,
  create_knowledge_fact,
  create_knowledge_formula,
  create_knowledge_provenance
};
