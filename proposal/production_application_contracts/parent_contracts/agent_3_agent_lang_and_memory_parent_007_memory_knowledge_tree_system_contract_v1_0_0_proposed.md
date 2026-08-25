# Parent Contract 007: Memory Knowledge Tree System

Status: proposed
Priority: p1
Owner agent: agent_lang_and_memory
Delivery lane: language_and_knowledge

## Goal

Build the memory and knowledge-tree system that turns sources into indexed nodes, evidence records, relationships, summaries, coverage reports, and adoption decisions.

## Subcontracts

- ../shared_detail_contract_001_dataset_registry_v1_0_0_proposed.md
- ../shared_detail_contract_002_vocabulary_and_name_reconciliation_v1_0_0_proposed.md
- ../shared_detail_contract_003_entity_relationship_trait_v1_0_0_proposed.md
- ../shared_detail_contract_010_an_app_lang_v1_0_0_proposed.md
- ../shared_detail_contract_012_an_memory_reasoning_v1_0_0_proposed.md
- ../shared_detail_contract_014_quality_audit_e2e_v1_0_0_proposed.md
- ../shared_detail_contract_015_external_intake_file_conversion_v1_0_0_proposed.md
- ../shared_detail_contract_018_knowledge_tree_v1_0_0_proposed.md
- ../shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md

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
