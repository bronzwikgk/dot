# Schema: decomposition_record v1.0.0

Status: draft
Owner: agent_lang_and_memory
Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## Record Shape

```json
{
  "record_type": "decomposition_record",
  "source_ref": "string (inventory_id)",
  "entities": "array of {name, depth}",
  "relationships": "array",
  "actions": "array",
  "depth": "number",
  "node_count": "number",
  "recursion_stopped": "boolean",
  "stop_reason": "max_depth | max_nodes | null",
  "timestamp": "ISO timestamp"
}
```

## Validation

- source_ref must reference valid inventory_id
- recursion policy: max depth, max nodes, cycle detection, timeout
- recursion limits prevent runaway source decomposition (parent contract 007 success)
- stop_reason declared when recursion stops (contract_019 validation)

## Related

- contract_019 work_an_app_brain_002
- contract_007 workflow_pipeline_runner (recursive split)
