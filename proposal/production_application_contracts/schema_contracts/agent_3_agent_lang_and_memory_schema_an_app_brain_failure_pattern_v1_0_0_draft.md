# Schema: failure_record + pattern_record v1.0.0

Status: draft
Owner: agent_lang_and_memory
Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## failure_record

```json
{
  "record_type": "failure_record",
  "source_ref": "string | null",
  "failure_type": "boundary | validation | reasoning | parsing | timeout | unknown",
  "reason": "string",
  "details": "any | null",
  "session_id": "string",
  "timestamp": "ISO timestamp"
}
```

## pattern_record

```json
{
  "record_type": "pattern_record",
  "source_ref": "string | null",
  "pattern_type": "recurring_behavior | improvement_opportunity | anomaly | unknown",
  "description": "string",
  "frequency": "number",
  "session_id": "string",
  "timestamp": "ISO timestamp"
}
```

## Validation

- failure records track when boundary, validation, or reasoning fails
- pattern records track recurring behavior for improvement proposals
- improvement proposals require approval before active behavior changes (contract_019)

## Related

- contract_019 work_an_app_brain_007
- contract_017 agent_improvement_cycle
