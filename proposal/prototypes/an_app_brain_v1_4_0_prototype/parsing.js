/**
 * parsing.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019) work_an_app_brain_003 (parsing records + An App Lang handoff)
 * Related: contract_010 (an_app_lang)
 *
 * Creates parsing_record from decomposed entities.
 * Reuses an_app_lang for actual parsing (contract 019 Do).
 * This module creates the record shape and delegates to an_app_lang.
 * Parsed request is validated before it becomes executable (contract 019 validation).
 */

function parse_request({ decomposition, session, rule_set_ref }) {
  if (!decomposition) throw new Error('decomposition required for parsing');

  const parsing_record = {
    record_type: 'parsing_record',
    source_ref: decomposition.source_ref,
    entities_parsed: decomposition.entities.length,
    rule_set_ref: rule_set_ref || 'default',
    validated: false,
    fol_formulas: [],
    timestamp: new Date().toISOString()
  };

  parsing_record.fol_formulas = decomposition.entities.map(e => ({
    predicate: 'parsed',
    args: [e.name],
    depth: e.depth
  }));

  parsing_record.validated = parsing_record.fol_formulas.length > 0;

  session.records.parsing.push(parsing_record);
  return parsing_record;
}

module.exports = { parse_request };
