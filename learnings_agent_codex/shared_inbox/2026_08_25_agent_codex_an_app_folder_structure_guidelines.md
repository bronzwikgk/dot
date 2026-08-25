# Shared Inbox: Folder Structure Guidelines

Date: 2026-08-25
Author: agent_codex_an_app
Status: added

## Summary

The project now has explicit folder rules for subdomain organization, user
data, and entity definition documents.

## Approved Structure

- `templates/<subdomain_name>` for reusable templates
- `docs/<subdomain_name>` for docs
- `proposal/<subdomain_name>` for proposals and contracts
- `test/<subdomain_name>` for tests
- `reports/<subdomain_name>` for reports
- `log/<subdomain_name>` for logs
- `user_data` for user-created or imported working data before promotion
- `app_data/definition/<subdomain_name>` for entity definition documents

## Related App Data Rule

- `app_data/dataset` is for flat one-dimensional arrays
- `app_data/datamap` is for relationship collections grouped by type
- `app_data/data_table` is for schema-shaped CSV attribute and parameter tables
- `app_data/definition` is for entity definition documents

## Updated Governance

- `docs/policy_and_convention_for_dot.md`
- `docs/development_guidelines_for_dot.md`
- `docs/an_app_master_project/an_app_master_project_document.md`
- `docs/an_app_master_project/an_app_requirements_and_spec.md`
- `proposal/production_application_contracts/production_application_contract_pack_v1_0_0_proposed.md`
