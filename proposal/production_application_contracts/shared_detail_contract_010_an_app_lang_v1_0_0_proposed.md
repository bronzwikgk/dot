# Contract 010: An App Lang

Status: proposed
Priority: p1
Owner domain: an_app_lang
Owner agent: agent_lang_and_memory
Work items: work_015, work_016

## Purpose

Convert English, controlled text, commands, structured samples, and definition files into validated entity change plans.

## Required Records

- language_request
- sentence record
- intent record
- command record
- parse_tree
- ast_record
- entity_change_plan
- training record
- execution record

## Validation

- sentence type is approved
- command target resolves
- training content cannot execute
- execution content cannot update memory without approval
- parsed output maps to approved entity, operation, relationship, dataset, schema, and workflow names

## Success Criteria

- parse natural English into candidate entity changes
- classify sentence/intent/domain
- ask clarification when input is incomplete
- support controlled grammar and template patterns
- produce audit-ready parse and reasoning trace

## Do Not

- do not execute training examples
- do not add grammar names without authorization
