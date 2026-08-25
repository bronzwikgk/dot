# Schema: reasoning_trace + resolution_record v1.0.0

Status: draft
Owner: agent_lang_and_memory
Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## reasoning_trace

```json
{
  "record_type": "reasoning_trace",
  "source_ref": "string",
  "reasoning_type": "deductive | inductive | abductive | analogical | causal",
  "evidence_refs": "array of string",
  "assumption_markers": "array of string",
  "conclusions": "array of {from, to, confidence}",
  "timestamp": "ISO timestamp"
}
```

## resolution_record

```json
{
  "record_type": "resolution_record",
  "source_ref": "string",
  "resolution_type": "coreference | deictic | temporal | entity_ref | route_ref | provider_ref | placeholder",
  "context_layer_used": "string",
  "resolved_refs": "array of {original, resolved, type}",
  "ambiguous": "boolean",
  "timestamp": "ISO timestamp"
}
```

## Validation

- reasoning trace declares type: deductive/inductive/abductive/analogical/causal (contract_019)
- resolution record declares type: coreference/deictic/temporal/entity_ref/route_ref/provider_ref/placeholder (contract_019)
- reasoning trace includes evidence or assumption markers (contract_019)
- context resolution declares layer used (contract_019)

## Related

- contract_019 work_an_app_brain_004
- contract_012 an_memory_reasoning
