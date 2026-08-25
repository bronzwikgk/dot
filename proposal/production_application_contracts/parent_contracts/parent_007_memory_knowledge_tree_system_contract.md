# Parent Contract 007: Memory Knowledge Tree System

Status: proposed
Priority: p1
Owner agent: agent_lang_and_memory
Delivery lane: language_and_knowledge

## Goal

Build the memory and knowledge-tree system that turns sources into indexed nodes, evidence records, relationships, summaries, coverage reports, and adoption decisions.

## Subcontracts

- ../contract_001_dataset_registry_contract.md
- ../contract_002_vocabulary_and_name_reconciliation_contract.md
- ../contract_003_entity_relationship_trait_contract.md
- ../contract_010_an_app_lang_contract.md
- ../contract_012_an_memory_reasoning_contract.md
- ../contract_014_quality_audit_e2e_contract.md
- ../contract_015_external_intake_file_conversion_contract.md
- ../contract_018_knowledge_tree_contract.md
- ../contract_019_an_app_brain_domain_contract.md

## Required Output

- source record schema
- source node schema
- knowledge node schema
- evidence record schema
- knowledge base record schema
- boundary record schema
- recursion trace schema
- relationship extraction path
- source coverage report
- adoption decision list
- memory conflict behavior

## Success Criteria

- every source receives an inventory id
- every adopted node has evidence
- similar nodes create reuse/conflict decisions
- skipped large folders are logged with reason and count
- summaries map back to source nodes
- knowledge tree output can feed docs, datasets, and planning
- boundary checks block unclear source adoption before active changes
- recursion limits prevent runaway source decomposition

## Do Not

- do not revive removed source-adoption code without approval
- do not treat summaries as sole evidence
- do not promote source names directly into active datasets
