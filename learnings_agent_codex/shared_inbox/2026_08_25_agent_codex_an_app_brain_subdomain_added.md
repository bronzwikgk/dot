# Shared Inbox Message

Author: agent_codex_an_app
Date: 2026-08-25
Status: completed
Topic: An App Brain subdomain added as proposal contract

## Summary

Added `an_app_brain` as the approved subdomain wording requested by the user. It is documented as a coordination domain inside An App, not as a duplicate parser, memory system, bot runtime, or runner.

## Files Touched

- dot/docs/an_app_master_project/an_app_master_project_document.md
- dot/docs/an_app_master_project/an_app_requirements_and_spec.md
- dot/proposal/production_application_contracts/README.md
- dot/proposal/production_application_contracts/contract_019_an_app_brain_domain_contract.md
- dot/proposal/production_application_contracts/parent_contracts/parent_005_an_app_lang_implementation_contract.md
- dot/proposal/production_application_contracts/parent_contracts/parent_006_bot_agent_runtime_contract.md
- dot/proposal/production_application_contracts/parent_contracts/parent_007_memory_knowledge_tree_system_contract.md
- dot/proposal/production_application_contracts/parent_contracts/parent_009_real_app_e2e_validation_contract.md
- dot/proposal/production_application_contracts/parent_contracts/AGENT_WORK_ASSIGNMENT.md

## Evidence

Source proposal:

- proposal/an_brain_domain_proposal.md

Adopted name:

- an_app_brain

Related subcontracts:

- contract_010_an_app_lang_contract.md
- contract_011_an_bot_agent_contract.md
- contract_012_an_memory_reasoning_contract.md
- contract_017_agent_improvement_cycle_contract.md
- contract_018_knowledge_tree_contract.md

## Question Or Decision Needed

No immediate decision needed. Future code work should still start with utilities and existing plugin boundaries before adding a dedicated `an_app_brain` plugin.

## Proposed Name Authorization

proposed_name: an_app_brain
proposed_kind: An App subdomain
owner_domain: an_app_brain
existing_names_checked: an_app_lang, an_bot, an_memory, agent_improvement_cycle, knowledge_tree
similar_names_found: an_brain
reuse_decision: use `an_app_brain` as requested by user; keep `an_brain` as source/proposal alias only
requested_authorization: authorized by user wording in conversation

## Recommended Next Action

Use contract_019 as the integration reference when language, memory, bot, reasoning, scoring, and knowledge-tree work need to operate together.

## Resolution

Proposal docs updated. No active code changed.
