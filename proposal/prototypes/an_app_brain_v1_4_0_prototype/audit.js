/**
 * audit.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019) work_an_app_brain_007 (learning and controlled improvement operations)
 * Related: contract_014 (quality_audit)
 *
 * Creates evidence_record and audit report.
 * Every fact has provenance (source raw + line) (contract 007 success).
 * Audit: full path from input to response (contract 019 success).
 */

function record_evidence({ session, ingestion, reasoning, composition }) {
  const evidence_record = {
    record_type: 'evidence_record',
    session_id: session.session_id,
    ingestion_ref: ingestion ? ingestion.inventory_id : null,
    reasoning_ref: reasoning ? reasoning.source_ref : null,
    composition_ref: composition ? composition.source_ref : null,
    provenance: {
      source: 'brain_session',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  };

  session.records.evidence.push(evidence_record);
  return evidence_record;
}

function audit_brain_session({ session }) {
  const audit_report = {
    record_type: 'audit_report',
    session_id: session.session_id,
    turn_count: session.turns.length,
    records_summary: {
      ingestion: session.records.ingestion.length,
      decomposition: session.records.decomposition.length,
      parsing: session.records.parsing.length,
      reasoning: session.records.reasoning.length,
      resolution: session.records.resolution.length,
      understanding: session.records.understanding.length,
      decision: session.records.decision.length,
      composition: session.records.composition.length,
      validation: session.records.validation.length,
      boundary: session.records.boundary.length,
      score: session.records.score.length,
      improvement: session.records.improvement.length,
      evidence: session.records.evidence.length
    },
    boundary_blocks: session.records.boundary.filter(b => b.blocked).length,
    timestamp: new Date().toISOString()
  };

  return audit_report;
}

module.exports = { record_evidence, audit_brain_session };
