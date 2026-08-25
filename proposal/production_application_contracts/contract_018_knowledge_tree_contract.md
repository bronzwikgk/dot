# Contract 018: Knowledge Tree

Status: proposed
Priority: p1
Owner domains: an_memory, an_app_lang, entity_system
Owner agent: agent_lang_and_memory
Source coverage: github_dump/dump/inbox_AnGitAgent_inbox

## Purpose

Define how source documents, conversations, code snippets, datasets, diagrams, and generated summaries become navigable knowledge-tree and knowledge-graph artifacts.

The source inbox contains combined knowledge tree files, tree use cases, recursive semantic learning notes, and diagrams. An App should adopt the artifact pattern, not the source naming wholesale.

## Related Contracts

- contract_001_dataset_registry_contract.md
- contract_002_vocabulary_and_name_reconciliation_contract.md
- contract_003_entity_relationship_trait_contract.md
- contract_010_an_app_lang_contract.md
- contract_012_an_memory_reasoning_contract.md
- contract_014_quality_audit_e2e_contract.md
- contract_015_external_intake_file_conversion_contract.md

## Required Records

- source_record
- source_node
- knowledge_node
- relationship_record
- pattern_record
- evidence_record
- summary_record
- coverage_record
- diagram_record
- adoption_decision

## Required Operations

- ingest_source
- parse_source
- build_tree
- classify_node
- extract_relationships
- extract_patterns
- attach_evidence
- compare_node
- merge_node
- create_summary
- create_coverage_report
- validate_tree

## Inputs

- source_ref
- source_type
- parse_policy
- classification_policy
- relationship_policy
- vocabulary_policy
- evidence_policy
- merge_policy

## Outputs

- source_node list
- knowledge_node list
- relationship_record list
- pattern_record list
- summary_record
- coverage_report
- adoption_decision list

## Validation

- every source file receives an inventory id
- every adopted node has source evidence
- every relationship type is approved or proposed
- every new name passes vocabulary reconciliation
- every summary maps back to source nodes
- merge decisions preserve conflict records
- diagram records include source and target artifact refs
- skipped large folders are logged with reason and count

## Success Criteria

- can turn a document or source folder into indexed nodes
- can classify nodes by domain, entity type, artifact type, and relationship type
- can compare incoming nodes against existing docs and datasets
- can report covered, missing, duplicate, conflicting, and proposed items
- can produce an adoption decision list that an agent or user can review
- can preserve source evidence for later audit

## Do

- keep source inventory countable and stable
- use approved datasets for node type, domain, relationship, status, and artifact labels
- treat diagrams as source artifacts when they explain a workflow or relationship
- route implementation to existing utilities/plugins before proposing new code

## Do Not

- do not merge similar nodes without a conflict or reuse decision
- do not add source terms directly into active datasets without authorization
- do not drop nested files from inventory unless a large-folder skip policy is recorded
- do not use a generated summary as sole evidence

## Handoff Notes

This contract is for future development of governed source learning. It does not revive the removed source-adoption pipeline. It records the reusable requirement: source inputs should become indexed, comparable, auditable knowledge artifacts before any adoption.
