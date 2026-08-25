# Schema: brain_session v1.0.0

Status: draft
Owner: agent_lang_and_memory
Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## Record Shape

```json
{
  "record_type": "brain_session",
  "session_id": "string (required)",
  "context_ref": "string | null",
  "status": "active | paused | completed | blocked",
  "turns": "array of turn objects",
  "records": {
    "ingestion": "array of ingestion_record",
    "decomposition": "array of decomposition_record",
    "parsing": "array of parsing_record",
    "reasoning": "array of reasoning_trace",
    "resolution": "array of resolution_record",
    "understanding": "array of understanding_record",
    "decision": "array of decision_record",
    "composition": "array of composition_record",
    "validation": "array of validation_report",
    "boundary": "array of boundary_record",
    "score": "array of score_record",
    "improvement": "array of improvement_proposal",
    "evidence": "array of evidence_record",
    "knowledge": "array of knowledge_base_record",
    "failure": "array of failure_record",
    "pattern": "array of pattern_record",
    "recursion": "array of recursion_trace"
  },
  "created_at": "ISO timestamp"
}
```

## Validation

- session_id is required
- status must be one of: active, paused, completed, blocked
- turns array grows with each conversation turn
- records object contains all record type arrays

## Related

- contract_019 work_an_app_brain_008
- contract_011 an_bot_agent (session lifecycle)
