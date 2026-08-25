# Schema: context_record v1.0.0

Status: draft
Owner: agent_lang_and_memory
Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## Record Shape

```json
{
  "record_type": "context_record",
  "layer": "system | organization | project | domain | session | conversation | entity",
  "ref": "string | null",
  "data": "any | null",
  "session_id": "string",
  "action": "read | update",
  "timestamp": "ISO timestamp"
}
```

## Validation

- layer must be one of 7 context layers
- session_id is required
- action must be read or update
- context resolution declares which layer used (contract_019 validation)

## Related

- contract_019 work_an_app_brain_008
- contract_012 an_memory_reasoning (context inheritance)
