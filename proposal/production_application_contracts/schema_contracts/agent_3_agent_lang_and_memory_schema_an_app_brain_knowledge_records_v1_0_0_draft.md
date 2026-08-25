# Schema: knowledge records v1.0.0

Status: draft
Owner: agent_lang_and_memory
Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

## knowledge_base_record

```json
{
  "record_type": "knowledge_base_record",
  "source_ref": "string | null",
  "session_id": "string",
  "facts_count": "number",
  "formulas_count": "number",
  "status": "active | archived",
  "timestamp": "ISO timestamp"
}
```

## knowledge_fact

```json
{
  "record_type": "knowledge_fact",
  "source_ref": "string | null",
  "predicate": "string",
  "args": "array",
  "confidence": "number (0-1)",
  "provenance_ref": "string",
  "timestamp": "ISO timestamp"
}
```

## knowledge_formula

```json
{
  "record_type": "knowledge_formula",
  "source_ref": "string | null",
  "formula_type": "fol | horn | clause",
  "body": "string",
  "validated": "boolean",
  "timestamp": "ISO timestamp"
}
```

## knowledge_provenance

```json
{
  "record_type": "knowledge_provenance",
  "source_ref": "string | null",
  "fact_ref": "string | null",
  "provenance_id": "string (generated)",
  "source_type": "string",
  "timestamp": "ISO timestamp"
}
```

## Validation

- every fact has provenance (source raw + line) (parent contract 007 success)
- knowledge tree output feeds docs, datasets, and planning (parent contract 007 success)

## Related

- contract_019 (knowledge_base_record, knowledge_fact, knowledge_formula, knowledge_provenance)
- contract_018 knowledge_tree
