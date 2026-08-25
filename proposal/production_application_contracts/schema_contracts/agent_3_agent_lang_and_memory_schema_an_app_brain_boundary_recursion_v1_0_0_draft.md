# Schema: boundary_record + recursion_trace v1.0.0

Status: draft
Owner: agent_lang_and_memory
Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## boundary_record

```json
{
  "record_type": "boundary_record",
  "source_ref": "string",
  "blocked": "boolean",
  "issues": "array of string",
  "fallback_honest": "string | null",
  "timestamp": "ISO timestamp"
}
```

Issues can be: validation_failed, low_confidence, approval_required, recursion_limit, missing_evidence, ambiguous_reference, stale_context, conflicting_memory, unsafe_action.

## recursion_trace

```json
{
  "record_type": "recursion_trace",
  "goal": "string",
  "depth": "number",
  "max_depth": "number",
  "max_nodes": "number",
  "cycle_detected": "boolean",
  "repeated_state_detected": "boolean",
  "timeout_reached": "boolean",
  "stop_reason": "max_depth | max_nodes | cycle | repeated_state | timeout | null",
  "subgoals": "array",
  "timestamp": "ISO timestamp"
}
```

## Validation

- boundary checks block/clarify: missing evidence, ambiguous, stale, low confidence, conflicting memory, unsafe action, recursion limit, approval-required (contract_019)
- recursion policy: max depth, max nodes, cycle detection, repeated-state, timeout, audit trail, stop reason (contract_019)
- boundary failures produce clarification, blocked result, or explicit assumption (work file validation)
- recursion limits prevent runaway source decomposition (parent contract 007)

## Related

- contract_019 work_an_app_brain_006, work_an_app_brain_008
- contract_004 validation_utility
- contract_014 quality_audit
