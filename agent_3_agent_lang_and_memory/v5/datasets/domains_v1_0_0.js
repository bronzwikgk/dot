// domains.js
// All domains and subdomains as 1D array

export const domains = [
  "application_shell",
  "entity_system",
  "schema_contract",
  "dataset_registry",
  "quality_audit",
  "an_app_lang",
  "workflow_system",
  "ui_surface",
  "provider_system",
  "storage_system",
  "search_index",
  "version_system",
  "template_domain",
  "an_bot",
  "agent_system",
  "an_app_brain",
  "an_memory",
  "fintech_organization_management",
  "algo_stock_trading"
]

export const domain_relationships = [
  "application_shell_uses_entity_system",
  "application_shell_uses_schema_contract",
  "application_shell_uses_dataset_registry",
  "application_shell_uses_quality_audit",
  "an_app_lang_uses_entity_system",
  "an_app_lang_uses_schema_contract",
  "workflow_system_uses_entity_system",
  "workflow_system_uses_schema_contract",
  "ui_surface_uses_entity_system",
  "ui_surface_uses_version_system",
  "provider_system_uses_entity_system",
  "storage_system_uses_entity_system",
  "search_index_uses_entity_system",
  "version_system_uses_entity_system",
  "template_domain_uses_entity_system",
  "template_domain_uses_schema_contract",
  "an_bot_uses_entity_system",
  "an_bot_uses_an_app_lang",
  "agent_system_uses_entity_system",
  "agent_system_uses_workflow_system",
  "an_app_brain_uses_entity_system",
  "an_app_brain_uses_an_app_lang",
  "an_app_brain_uses_an_memory",
  "an_memory_uses_entity_system",
  "quality_audit_uses_entity_system"
]
