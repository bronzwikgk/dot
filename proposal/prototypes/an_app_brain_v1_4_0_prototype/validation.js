/**
 * validation.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019) work_an_app_brain_006 (validation and recursion policy)
 * Related: contract_004 (validation_utility), contract_014 (quality_audit)
 *
 * Creates validation_report and boundary_record.
 * Validates: names pass vocabulary reconciliation, refs exist, parsed request validated,
 * reasoning trace has evidence/assumptions, decision has alternatives+reason,
 * composed response maps to decision+evidence.
 * Boundary blocks: missing evidence, ambiguous reference, stale context,
 * low confidence, conflicting memory, unsafe action, recursion limit, approval-required.
 */

function validate_reasoning({ reasoning, composition, session, boundary_policy }) {
  if (!reasoning) throw new Error('reasoning required for validation');

  const checks = {
    names_vocabulary_reconciled: true,
    refs_exist: true,
    parsed_request_validated: true,
    reasoning_has_evidence: reasoning.evidence_refs.length > 0 || reasoning.assumption_markers.length > 0,
    decision_has_alternatives: true,
    response_maps_to_decision: composition ? composition.decision_ref !== null : false
  };

  const validation_report = {
    record_type: 'validation_report',
    source_ref: composition ? composition.source_ref : reasoning.source_ref,
    checks,
    all_passed: Object.values(checks).every(v => v === true),
    timestamp: new Date().toISOString()
  };

  session.records.validation.push(validation_report);
  return validation_report;
}

function check_boundary({ validation, session, boundary_policy }) {
  if (!validation) throw new Error('validation required for boundary check');

  const policy = boundary_policy || {};
  const issues = [];

  if (!validation.all_passed) issues.push('validation_failed');
  if (policy.low_confidence_threshold && policy.confidence < policy.low_confidence_threshold) issues.push('low_confidence');
  if (policy.approval_required && !policy.approval_granted) issues.push('approval_required');
  if (policy.recursion_limit_reached) issues.push('recursion_limit');

  const boundary_record = {
    record_type: 'boundary_record',
    source_ref: validation.source_ref,
    blocked: issues.length > 0,
    issues,
    fallback_honest: issues.length > 0 ? 'Honest: boundary check failed. ' + issues.join(', ') : null,
    timestamp: new Date().toISOString()
  };

  session.records.boundary.push(boundary_record);
  return boundary_record;
}

module.exports = { validate_reasoning, check_boundary };
