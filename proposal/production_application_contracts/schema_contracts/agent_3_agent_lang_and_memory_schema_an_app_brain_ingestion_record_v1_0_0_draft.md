# Schema: ingestion_record v1.0.0

Status: draft
Owner: agent_lang_and_memory
Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## Record Shape

```json
{
  "record_type": "ingestion_record",
  "source_type": "text | json | multi_line_text | unknown",
  "raw_length": "number",
  "memory_ref": "string | null",
  "inventory_id": "string (generated)",
  "session_id": "string",
  "status": "ingested",
  "timestamp": "ISO timestamp"
}
```

## Validation

- source_type is auto-detected from input
- inventory_id is generated as inv_{session_id}_{count}
- every source receives an inventory id (parent contract 007 success)

## Related

- contract_019 work_an_app_brain_001
- contract_018 knowledge_tree (source intake)
