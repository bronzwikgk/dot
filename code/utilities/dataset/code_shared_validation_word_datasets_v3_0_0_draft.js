const entity_types = [
  "app", "file", "block", "symbol", "plugin", "utility", "route", "view",
  "component", "workflow", "task", "agent", "database", "relationship",
  "artifact", "trigger", "action", "condition", "loop", "memory", "tool",
  "model", "training_run", "prefix", "page", "comment", "credential",
  "variable", "command", "state_store", "user_flow", "test", "dataset",
  "policy", "contract", "doc", "log", "release", "application", "domain",
  "product", "application_blueprint", "application_creation",
  "registry", "route_map", "dataset_manifest", "template_taxonomy",
  "deployment_variant", "lifecycle_transition", "rbac_policy",
  "permission", "role", "audit_log", "organization", "department",
  "person", "employee", "manager", "punch_log", "leave_ledger",
  "payroll_slip", "candidate", "approval_request", "appraisal", "asset",
  "offboarding_process", "training_course", "helpdesk_ticket",
  "starter_template", "sample_pipeline", "layout_projection",
  "render_profile", "single_user", "language_request", "content_tag",
  "autocomplete_suggestion", "query_plan", "extracted_entity",
  "correction_record", "layout_ast", "style_rule", "markup_rule",
  "command_surface", "configuration_profile", "learning_store",
  "learning_metric", "parser_preview_state", "semantic_element_tree",
  "style_tree", "query_renderer", "confidence_policy", "book", "cell",
  "cell_output", "cell_execution", "cell_order", "editor_state",
  "focus_state", "cell_row", "cell_rail", "render_sync_record"
];

const entity_traits = [
  "editable", "storable", "searchable", "resolvable", "executable",
  "composable", "renderable", "decomposable", "traceable", "configurable",
  "callable", "importable", "exportable", "referenceable", "nestable",
  "parallelizable", "communicative", "queryable", "filterable", "sortable",
  "listenable", "activatable", "evaluatable", "iterative", "annotatable",
  "displayable"
];

const operation_names = [
  "create", "read", "update", "delete", "query", "index", "resolve",
  "execute", "compose", "display", "decompose", "log", "explain",
  "validate_config", "call", "import", "export", "diff", "parse",
  "transform", "format", "persist", "respond", "reason", "save_entity",
  "load_entity", "delete_stored", "list_stored", "version_entity",
  "revert_entity", "index_entity", "search_entity", "search_text",
  "search_property", "resolve_entity", "resolve_symbol", "resolve_relation",
  "find_path", "resolve_all", "get_targets", "get_sources",
  "execute_parallel", "execute_sequence", "merge_entities", "display_entity",
  "display_tree", "display_list", "append_entity", "insert_entity",
  "remove_entity", "run_decompose", "handoff_agent", "send_message",
  "filter_entity", "sort_entity", "group_entity", "filter_by_type",
  "sort_by_key", "on_trigger", "emit_event", "activate_entity",
  "deactivate_entity", "configure_entity", "get_config",
  "evaluate_condition", "execute_loop", "call_tool", "list_tools",
  "format_entity", "trace_connections", "get_ancestors", "add_comment",
  "resolve_comment", "list_comments", "import_file", "import_data",
  "export_file", "export_data", "create_application_artifacts",
  "register_application", "register_product", "publish_application",
  "transition_lifecycle", "build_registry", "check_permission",
  "grant_permission", "revoke_permission", "create_person", "update_role",
  "transfer_department", "assign_manager", "punch_in", "punch_out",
  "verify_geofence", "request_leave", "adjust_leave_balance",
  "calculate_payroll", "approve_payroll", "onboard_candidate",
  "reject_candidate", "schedule_interview", "approve_request",
  "reject_request", "submit_appraisal", "finalize_rating", "assign_asset",
  "recover_asset", "commence_exit", "finalize_settlement", "assign_course",
  "submit_score", "optimize", "optimise", "evolve", "mutate"
];

const datatype_names = [
  "text", "number", "boolean", "timestamp", "choice", "list", "map",
  "reference", "markup", "json", "tabular", "graph", "text_document",
  "script_executable", "binary_object"
];

const relationship_types = [
  "contains", "belongs_to", "depends_on", "blocks", "blocked_by", "uses",
  "used_by", "creates", "created_by", "reads", "writes", "calls",
  "called_by", "routes_to", "renders", "validates", "validated_by",
  "generates", "generated_by", "tests", "tested_by", "documents",
  "documented_by", "logs", "logged_by", "configures", "configured_by",
  "owns", "owned_by", "extends", "extended_by", "implements",
  "implemented_by", "triggers", "triggered_by", "publishes",
  "subscribes_to", "maps_to", "derived_from", "replaces", "replaced_by",
  "related_to", "has", "manages", "submits", "receives", "holds",
  "completes", "authorizes", "denies", "creates_artifact", "registered_by",
  "registered_as", "allowed_by", "restricted_by"
];

const relationship_cardinalities = ["one_to_one", "one_to_many", "many_to_one", "many_to_many"];

const lifecycle_statuses = [
  "proposed", "draft", "under_review", "approved", "ready", "active",
  "stable", "production", "deprecated", "archived"
];

const stage_names = [
  "decompose", "validate", "parse", "transform", "reason", "resolve",
  "index", "compose", "execute", "format", "display", "persist", "respond"
];

const pipeline_names = [
  "pipeline_ingest_source", "pipeline_find_information",
  "pipeline_ask_question", "pipeline_transform_content",
  "pipeline_execute_workflow", "pipeline_show_result",
  "pipeline_export_artifact", "pipeline_manage_entities",
  "pipeline_inspect_system", "pipeline_configure_app"
];

const pipeline_stage_names = [
  "create_entity_stage", "index_entity_stage", "search_entity_stage",
  "format_results_stage", "reason_stage", "resolve_stage", "compose_stage",
  "respond_stage", "load_entity_stage", "transform_stage", "index_stage",
  "persist_stage", "load_workflow_stage", "validate_steps_stage",
  "execute_steps_stage", "collect_results_stage", "format_stage",
  "display_stage", "validate_refs_stage", "mutate_stage", "re_index_stage",
  "collect_logs_stage", "collect_metrics_stage", "format_summary_stage",
  "validate_config_stage", "apply_config_stage", "restart_notice_stage"
];

const intent_names = [
  "ingest_source", "find_information", "ask_question", "transform_content",
  "execute_workflow", "show_result", "export_artifact", "manage_entities",
  "inspect_system", "configure_app", "navigate_to_entity", "create_entity",
  "delete_entity", "clone_entity", "export_entity", "import_entity",
  "execute_entity", "inspect_entity", "create_application",
  "create_application_artifacts", "publish_application", "create_domain",
  "define_route_map", "define_dataset_manifest", "select_template",
  "create_template", "assign_role", "check_access", "review_audit_log",
  "create_person", "transfer_department", "calculate_payroll",
  "submit_leave", "approve_request", "assign_asset", "onboard_candidate"
];

const entity_field_names = [
  "id", "type", "name", "version", "status", "config", "attributes",
  "parameters", "relationships", "policies", "contracts", "operations",
  "schemas", "tests", "docs", "logs", "tags", "metadata", "created_at", "updated_at",
  "created_by", "updated_by"
];

const policy_rule_types = [
  "required_status", "required_trait", "required_operation",
  "blocked_status", "allowed_actor", "required_contract"
];

const contract_rule_types = [
  "required_fields", "optional_fields", "required_operations",
  "required_relationships", "input_shape", "output_shape"
];

const schema_field_types = [
  "text", "number", "choice", "list", "map", "reference", "timestamp",
  "markup", "boolean", "json"
];

const schema_constraint_names = [
  "required", "max_length", "min", "max", "integer_only", "options",
  "inner", "target_type", "keys", "format"
];

const diagnostic_levels = ["debug", "info", "warn", "error", "fatal"];

const artifact_types = [
  "code_file", "test_file", "doc_file", "log_file", "dataset_file",
  "config_file", "manifest_file", "route_map_file", "sample_data_file",
  "registry_file", "template_taxonomy_file", "release_checklist_file",
  "audit_log_file", "created_product_folder"
];

const file_roles = [
  "utility", "plugin", "test", "doc", "log", "dataset", "config",
  "runner", "validator", "parser", "generator", "manifest", "route_map",
  "sample_data", "registry", "template_taxonomy", "release_checklist"
];

const module_kinds = ["esm", "commonjs", "browser", "node"];

const test_case_kinds = [
  "constructor", "method", "input_validation", "output_validation",
  "edge_case", "integration", "regression", "snapshot"
];

const name_formats = [
  "snake_case", "snake_path", "semver", "iso_datetime", "relative_path"
];

const version_bump_levels = ["major", "minor", "patch"];

const app_file_groups = [
  "routes", "views", "components", "state", "styles", "tests", "docs",
  "logs", "datasets", "config", "templates", "products", "services",
  "sample_data", "registries"
];

const parser_intent_actions = [
  "create", "link", "update", "delete", "compose", "validate", "reason",
  "resolve", "generate"
];

const reasoner_decision_modes = [
  "highest_score", "first_valid", "all_valid", "explain_only"
];

const adoption_decision_names = ["skip", "adopt", "fix", "review", "defer"];

const application_project_names = ["an_app"];

const application_scope_names = [
  "real_business_application", "application_builder", "product_shell",
  "domain_runtime", "entity_runtime", "template_runtime",
  "workflow_runtime", "validation_runtime"
];

const product_blueprint_parts = [
  "product_config", "route_map", "dataset_manifest", "template_set",
  "sample_data", "registry_entry", "lifecycle_state", "documentation",
  "release_checklist"
];

const deployment_variant_names = [
  "browser", "node_runtime", "node_tui", "apps_script", "tauri_shell",
  "pwa", "static_web", "desktop_shell"
];

const domain_boundary_names = [
  "allowed_cross_domain_imports", "restricted_access_namespaces",
  "taxonomy_registry", "ontology_rules", "dataset_vocabulary_links"
];

const registry_names = [
  "master_registry", "entity_registry", "component_registry",
  "template_registry", "domain_registry", "product_registry",
  "route_registry", "dataset_registry", "command_registry",
  "service_registry"
];

const template_super_type_names = [
  "catalog", "metrics_board", "portfolio", "progress_tracking",
  "assessment", "certification", "model_registry", "export",
  "agent", "workflow", "prompt_chain", "config", "curriculum",
  "lesson", "quiz", "study_book", "learner", "achievement",
  "org_profile", "org_task", "hr_module", "form", "chart_view",
  "trade_execution", "analysis", "decision_tree", "conversation",
  "log_view", "navigation", "workspace", "help", "game",
  "explorer", "entity_workspace"
];

const template_category_names = [
  "market_data", "learning", "analytics", "orchestration", "shell",
  "organization", "fintech", "single_user", "sample_pipeline"
];

const business_domain_names = [
  "organization_management", "human_resources", "payroll", "attendance",
  "recruitment", "approvals", "performance", "asset_management",
  "offboarding", "training", "helpdesk", "audit", "learning_management",
  "financial_technology", "personal_workspace"
];

const starter_template_names = [
  "lms_template", "fintech_organization_template",
  "single_user_template", "organization_management_template",
  "sample_pipeline_template", "documentation_template"
];

const sample_pipeline_names = [
  "create_application_pipeline", "create_application_artifacts_pipeline",
  "dataset_to_template_pipeline", "natural_input_to_entity_pipeline",
  "business_dashboard_pipeline", "approval_workflow_pipeline",
  "learning_progress_pipeline", "financial_record_pipeline",
  "single_user_workspace_pipeline"
];

const layout_projection_names = [
  "json_text_projection", "collapsible_tree_projection",
  "document_projection", "diagram_projection", "dashboard_projection",
  "table_projection", "card_projection", "kanban_projection",
  "calendar_projection", "flowchart_projection", "mindmap_projection"
];

const organization_entity_names = [
  "organization", "department", "person", "employee", "manager", "role",
  "permission", "punch_log", "leave_ledger", "payroll_slip", "candidate",
  "approval_request", "appraisal", "asset", "offboarding_process",
  "training_course", "helpdesk_ticket"
];

const organization_feature_names = [
  "org_chart_viewer", "rbac_policy_manager", "personnel_directory",
  "session_activity_log", "employee_master", "company_master",
  "attendance_leave", "daily_punch_log", "payroll", "ats_onboarding",
  "approvals_hub", "performance_appraisals", "asset_register",
  "offboarding_tracker", "training_lms", "helpdesk_ticketing",
  "dashboard"
];

const rbac_role_names = [
  "owner", "developer", "maintainer", "reporter", "viewer", "admin",
  "guest", "anonymous", "hr_manager", "system_auditor",
  "organization_admin"
];

const permission_action_names = [
  "create", "read", "update", "delete", "approve", "reject", "assign",
  "transfer", "publish", "create_artifacts", "audit", "configure"
];

const config_section_names = [
  "runtime_environment", "ui_layout_integration", "data_resource_bindings",
  "lifecycle_hooks", "compute_footprint", "feature_flags", "variants",
  "meta", "dictionary", "definition", "schema", "policy", "templates",
  "relationships"
];

const content_tag_names = [
  "instruction", "rule", "information", "knowledge"
];

const extractable_entity_names = [
  "email", "phone", "date", "url", "path", "id", "amount", "time",
  "duration", "person_name", "organization_name"
];

const query_intent_names = [
  "find_records", "search_records", "filter_records", "sort_records",
  "group_records", "locate_files", "search_content", "show_related",
  "build_query"
];

const query_target_names = [
  "registry", "dataset", "document", "filesystem", "database",
  "search_index", "url"
];

const layout_rule_names = [
  "column_container", "row_container", "fixed_height", "full_viewport_height",
  "grow_to_fill", "align_center", "align_right", "gap_between_children",
  "padding_all_sides", "bordered_panel", "rounded_panel", "preview_area",
  "editor_area", "last_child_align_right", "parent_child_tree",
  "semantic_element_tree", "status_message_area", "action_button_area",
  "two_panel_layout", "three_panel_layout", "full_height_workspace",
  "scrollable_panel", "min_width_zero"
];

const style_rule_names = [
  "system_font", "monospace_font", "light_background", "medium_background",
  "dark_text", "subtle_border", "blue_action", "white_text",
  "preserve_whitespace", "disable_resize", "auto_overflow",
  "box_sizing_border_box", "zero_margin", "zero_padding", "focus_outline",
  "hover_state", "font_size_small", "line_height_relaxed",
  "font_weight_medium", "no_list_marker", "hidden_overflow",
  "accent_background", "secondary_text", "border_top"
];

const language_config_profile_names = [
  "tagging_profile", "autocomplete_profile", "query_profile",
  "extraction_profile", "layout_profile", "style_profile",
  "corpus_profile", "fallback_profile"
];

const learning_store_names = [
  "base_dictionary", "user_dictionary", "learned_rule_log",
  "feedback_log", "learning_stats", "correction_queue"
];

const language_command_names = [
  "tag", "complete", "query", "extract", "learn", "parse_layout",
  "parse_style", "render_preview", "validate_sentence",
  "translate_sentence", "run_corpus"
];

const confidence_policy_names = [
  "minimum_confidence", "review_below_threshold", "rank_by_confidence",
  "average_confidence", "confidence_by_pattern", "confidence_by_keyword",
  "confidence_by_value_shape"
];

const correction_source_names = [
  "user_correction", "maintainer_correction", "test_correction",
  "agent_review"
];

const autocomplete_context_names = [
  "empty_input", "after_create", "after_update", "after_link",
  "after_render", "after_validate", "entity_context", "template_context",
  "dataset_context", "layout_context", "workflow_context"
];

const parser_workbench_action_names = [
  "tag_content", "complete_text", "build_query", "extract_entity",
  "learn_correction", "parse_layout_text", "parse_style_text",
  "generate_layout_ast", "generate_style_tree", "preview_layout",
  "show_status", "show_learning_stats", "render_command_output"
];

const sentence_intent_type_names = [
  "assertion", "query", "command", "condition", "negation", "comparison",
  "definition", "greeting", "farewell", "confirmation", "rejection",
  "clarification", "compound"
];

const sentence_structure_type_names = [
  "declarative", "interrogative", "imperative", "exclamatory",
  "fragment", "empty"
];

const part_of_speech_names = [
  "noun", "verb", "adjective", "adverb", "pronoun", "preposition",
  "conjunction", "determiner", "interjection", "auxiliary_verb",
  "modal_verb", "qualifier", "particle", "article", "quantifier"
];

const tense_names = [
  "present_simple", "present_continuous", "present_perfect",
  "present_perfect_continuous", "past_simple", "past_continuous",
  "past_perfect", "past_perfect_continuous", "future_simple",
  "future_continuous", "future_perfect", "future_perfect_continuous"
];

const pronoun_type_names = [
  "subject_pronoun", "object_pronoun", "possessive_pronoun",
  "possessive_determiner", "reflexive_pronoun", "demonstrative_pronoun",
  "relative_pronoun", "interrogative_pronoun", "indefinite_pronoun"
];

const figure_of_speech_names = [
  "idiom", "metaphor", "simile", "irony", "sarcasm", "euphemism",
  "collocation"
];

const semantic_role_names = [
  "agent", "patient", "theme", "instrument", "location", "time"
];

const language_exception_names = [
  "irregular_verb", "irregular_noun", "phrasal_verb", "ambiguous_word",
  "homonym", "synonym", "antonym", "contraction", "stopword",
  "compound_word"
];

const sentence_pattern_names = [
  "subject_verb", "subject_verb_object", "subject_verb_complement",
  "subject_verb_object_object", "subject_verb_object_complement",
  "subject_auxiliary_verb_object", "subject_auxiliary_adverb_verb_object"
];

const sentence_completion_method_names = [
  "prefix_completion", "next_word_prediction", "phrase_completion",
  "prompt_completion", "template_completion", "rule_based_completion",
  "contextual_completion", "broken_word_repair"
];

const sentence_similarity_signal_names = [
  "keyword_overlap", "intent_match", "entity_overlap", "topic_overlap",
  "time_decay", "semantic_embedding", "sentence_diff"
];

const template_learning_operation_names = [
  "seed_template", "induce_template", "specialize_template",
  "generalize_template", "merge_templates", "split_template",
  "rank_template", "prune_template"
];

const conversation_boundary_signal_names = [
  "message_similarity", "topic_similarity", "intent_similarity",
  "entity_similarity", "time_gap"
];

const task_schedule_status_names = [
  "unscheduled", "scheduled", "paused", "running", "completed", "failed",
  "cancelled", "retrying"
];

const memory_tier_names = [
  "working_memory", "episodic_memory", "semantic_memory"
];

const knowledge_unit_type_names = [
  "fact", "rule", "concept", "topic", "keyword", "assumption", "learning",
  "relationship", "pattern", "anomaly"
];

const knowledge_source_type_names = [
  "seed", "user_correction", "approved_document", "corpus_row",
  "tool_result", "parser_output", "external_source", "maintainer_entry"
];

const memory_reasoning_mode_names = [
  "forward_reasoning", "backward_reasoning", "proof_trace",
  "gap_detection", "conflict_detection", "recall"
];

const memory_conflict_type_names = [
  "contradictory_fact", "conflicting_rule", "stale_fact",
  "source_disagreement", "impossible_relationship",
  "unexpected_value_shape", "failed_reasoning_path"
];

const memory_learning_status_names = [
  "new", "parsed", "extracted", "validated", "pending_review", "approved",
  "rejected", "promoted", "archived", "expired"
];

const source_file_type_names = [
  "markdown", "text", "json", "javascript", "html", "dataset", "unknown"
];

const source_tree_node_kind_names = [
  "document", "heading", "paragraph", "list_item", "table_row",
  "code_block", "metadata", "comment", "key_value"
];

const source_concept_type_names = [
  "architecture", "language", "english_domain", "bot", "memory",
  "interface", "dataset", "workflow", "policy", "artifact", "test",
  "audit"
];

const source_coverage_status_names = [
  "covered", "partial", "missing", "deferred", "rejected",
  "reference_only", "duplicate", "conflict"
];

const source_match_category_names = [
  "exact_duplicate", "near_duplicate", "broader_than_existing",
  "narrower_than_existing", "related", "conflicting_definition",
  "conflicting_owner", "unrelated", "no_match"
];

const source_conflict_type_names = [
  "duplicate_concept", "competing_owner", "competing_definition",
  "competing_relationship", "stale_source", "unsafe_behavior",
  "missing_evidence", "low_confidence", "partial_overlap"
];

const source_adoption_decision_names = [
  "keep_existing", "accept_source", "accept_both", "merge", "split",
  "link_as_related", "defer", "reject", "ask_review"
];

const source_validation_check_names = [
  "inventory_count", "source_file_ids", "concept_owner",
  "rejection_reason", "target_doc_presence", "dataset_uniqueness",
  "banned_vocabulary", "duplicate_primary_owner", "conflict_decision",
  "audit_presence", "test_result"
];

const dataset_class_names = [
  "word_dataset", "registry_map", "relationship_map", "schema_catalog",
  "rule_catalog"
];

const registry_record_type_names = [
  "concept_record", "schema_record", "contract_record", "policy_record",
  "rule_record", "template_record", "capability_record", "command_record",
  "audit_record", "evidence_record"
];

const tree_node_type_names = [
  "document_node", "semantic_node", "project_node", "render_node",
  "relationship_node"
];

const provenance_field_names = [
  "source_path", "source_id", "section_id", "evidence_id", "confidence",
  "adopted_by", "validation_state"
];

const command_record_field_names = [
  "phrase", "intent", "context", "capability_id", "action_id",
  "risk_level", "confirmation_mode", "status", "outcome"
];

const capability_record_field_names = [
  "id", "name", "domain", "accepted_inputs", "produced_outputs",
  "action_refs", "policy_refs", "test_refs", "owner"
];

const policy_field_names = [
  "condition", "scope", "decision", "severity", "explanation",
  "override_mode"
];

const approval_state_names = [
  "proposed", "reviewed", "approved", "rejected", "deferred",
  "superseded"
];

const quality_gate_names = [
  "inventory_check", "owner_check", "duplicate_check", "conflict_check",
  "validation_check", "adoption_check", "schema_check", "dataset_check",
  "approval_check", "evidence_check"
];

const search_source_names = [
  "local_file", "local_folder", "web_page", "documentation_page",
  "repository", "corpus", "user_note"
];

const repository_operation_names = [
  "inspect", "stage", "commit", "pull", "merge", "tag", "release",
  "deploy", "rollback"
];

const conversion_profile_names = [
  "markdown_to_document_tree", "html_to_document_tree",
  "json_to_entity_tree", "text_to_semantic_tree", "tree_to_document",
  "tree_to_diagram"
];

const recovery_state_names = [
  "missing_field", "invalid_type", "duplicate_id", "unknown_relationship",
  "unsupported_format", "low_confidence", "conflict_detected"
];

const handbook_row_kind_names = [
  "phase", "step", "rule", "gate", "example", "section", "glossary",
  "requirement", "use_case", "transition", "policy"
];

const handbook_section_names = [
  "definition", "purpose", "boundary", "detect", "required_input",
  "required_output", "constraints", "allowed_state", "example",
  "validation", "guard_enforcement", "glossary", "requirements",
  "use_cases", "similar_items", "lifecycle", "transitions", "policies",
  "rules", "change_log"
];

const type_ratification_phase_names = [
  "search", "reserve", "define_shape", "wire_traits",
  "declare_links", "register"
];

const type_ratification_gate_names = [
  "name_clear", "schema_complete", "traits_exist",
  "links_valid", "approved_before_register"
];

const provider_plugin_phase_names = [
  "scaffold", "declare", "implement", "activate_safely",
  "deactivate_cleanly"
];

const provider_plugin_gate_names = [
  "manifest_complete", "contract_exported", "envelope_returned",
  "deactivate_clean", "fallback_honored"
];

const external_workspace_item_type_names = [
  "document", "sheet", "slide", "folder", "file", "range", "tab",
  "presentation"
];

const external_workspace_action_names = [
  "discover", "read", "write", "append", "clear", "create", "update",
  "delete", "export", "sync", "verify"
];

const datatable_field_names = [
  "id", "name", "fields", "indexes", "validation_rules", "status",
  "provenance"
];

const datamap_field_names = [
  "id", "name", "source_entity", "target_entity", "relationship",
  "mapping_rules", "validation_checks", "provenance"
];

const binding_field_names = [
  "id", "name", "dataset_ref", "datatable_ref", "datamap_ref",
  "template_ref", "output_ref", "status"
];

const parser_command_names = [
  "parse", "split", "rebuild", "validate", "export", "status"
];

const parser_plugin_type_names = [
  "entity_parser", "english_parser", "command_line", "api_surface",
  "format_exporter", "validator"
];

const parser_support_entity_names = [
  "parser_application", "config_manager", "knowledge_loader",
  "session_manager", "plugin_loader"
];

const round_trip_validation_gate_names = [
  "input_inventory_count", "parsed_node_count", "exported_artifact_count",
  "rebuild_result_exists", "provenance_preserved", "unsupported_items_reported",
  "integrity_rules_match"
];

const parser_surface_names = [
  "command_line", "api", "plugin_call", "batch_job"
];

const template_family_names = [
  "knowledge_template", "document_template", "report_template",
  "communication_template", "technical_template", "config_template",
  "starter_template", "domain_template", "layout_template", "flow_template"
];

const knowledge_template_type_names = [
  "action_template", "entity_template", "rule_template", "policy_template",
  "flow_template"
];

const document_template_type_names = [
  "specification_template", "design_document_template", "api_document_template",
  "meeting_notes_template", "handbook_template"
];

const report_template_type_names = [
  "weekly_status_template", "sprint_report_template", "test_report_template",
  "incident_report_template", "discovery_report_template", "audit_report_template"
];

const communication_template_type_names = [
  "release_notes_template", "announcement_template", "email_template"
];

const technical_template_type_names = [
  "module_template", "test_template", "config_template"
];

const template_placeholder_field_names = [
  "id", "name", "required", "data_type", "default_value",
  "validation_rule", "example"
];

const action_template_field_names = [
  "action_id", "action_name", "command", "command_template",
  "required_parameters", "optional_parameters", "safety_level",
  "confirmation_level", "description", "similar_words"
];

const entity_template_field_names = [
  "entity_id", "entity_name", "patterns", "validation_rules",
  "synonyms", "description", "examples"
];

const rule_template_field_names = [
  "rule_id", "rule_name", "condition", "consequence", "priority",
  "category", "description"
];

const policy_template_field_names = [
  "policy_id", "policy_name", "policy_condition", "enforcement_action",
  "severity", "scope", "description"
];

const flow_template_field_names = [
  "flow_id", "flow_name", "description", "trigger", "steps",
  "error_handling"
];

const test_report_field_names = [
  "suite_name", "date", "tester_name", "total_tests", "passed",
  "failed", "skipped", "test_id", "description", "status", "notes",
  "expected", "actual", "root_cause", "recommendations"
];

const matching_signal_names = [
  "exact_match", "synonym_match", "pattern_match", "semantic_match"
];

const slot_extraction_mode_names = [
  "positional", "named", "flagged", "natural_language"
];

const command_flow_step_names = [
  "validate_input", "match_intent", "extract_slots", "validate_slots",
  "request_confirmation", "execute_or_dry_run", "respond_with_audit"
];

const capability_creation_step_names = [
  "capture_intent", "draft_capability_spec", "update_registry_records",
  "create_prompt_tests", "run_tests", "evaluate_and_refine",
  "scale_test_set"
];

const boot_sequence_step_names = [
  "detect_runtime", "load_shell_config", "initialize_core_entities",
  "scan_entity_directories", "validate_entity_schemas",
  "build_relationship_graph", "discover_plugins", "validate_signatures",
  "register_plugin_entities", "resolve_requirements", "check_conflicts",
  "initialize_in_order", "call_init_hook", "call_load_hook",
  "call_activate_hook", "emit_ready_event", "accept_user_input",
  "begin_event_processing"
];

const bot_self_description_field_names = [
  "capability_summary", "context_summary", "example_requests",
  "guide_entry", "command_entry"
];

const runtime_guard_names = [
  "error_response_format", "rate_limit_policy",
  "authentication_policy", "authorization_policy",
  "session_persistence_mode", "batch_processing_limit",
  "input_sanitization", "private_data_handling", "retry_policy",
  "memory_cleanup_policy", "state_serialization_format"
];

const benchmark_method_names = [
  "latency_method", "throughput_method", "accuracy_method",
  "concurrent_session_method", "large_graph_traversal_case",
  "failure_scenario_case"
];

const cognitive_node_type_names = [
  "config_node", "memory_node", "knowledge_node", "optimization_node",
  "anomaly_node"
];

const cognitive_loop_step_names = [
  "intake", "parse", "train", "evaluate", "optimize", "benchmark"
];

const knowledge_activation_state_names = [
  "passive", "active", "pending_review", "rejected", "retired"
];

const nlu_matching_method_names = [
  "exact_match", "substring_match", "fuzzy_match", "phonetic_match",
  "lexical_match", "synonym_match", "semantic_match",
  "contextual_semantic_match"
];

const fuzzy_matching_method_names = [
  "levenshtein_distance", "damerau_levenshtein_distance",
  "hamming_distance", "jaro_winkler_similarity"
];

const phonetic_matching_method_names = [
  "soundex", "metaphone", "double_metaphone"
];

const lexical_matching_method_names = [
  "stemming", "lemmatization"
];

const semantic_matching_method_names = [
  "synonym_dictionary", "distributional_semantics",
  "contextual_semantics"
];

const tree_tool_operation_names = [
  "tree_query", "tree_diff", "tree_merge", "patch_generation",
  "patch_application", "change_history"
];

const parser_command_extension_names = [
  "convert", "serve", "watch", "interactive"
];

const parser_error_detail_names = [
  "line_number", "column_number", "error_code", "context_hint",
  "recovery_hint", "source_excerpt"
];

const schema_migration_state_names = [
  "planned", "ready", "running", "completed", "failed", "rolled_back",
  "deprecated"
];

const topic_perspective_field_names = [
  "topic_id", "fact_id", "perspective_name", "explanation",
  "cross_topic_links", "confidence", "provenance"
];

const external_intake_source_type_names = [
  "local_file", "url", "web_page", "json_api", "connected_document",
  "connected_sheet", "connected_slide", "connected_file"
];

const external_intake_adapter_type_names = [
  "local_file_adapter", "url_fetch_adapter", "web_page_adapter",
  "json_api_adapter", "connected_document_adapter", "connected_sheet_adapter",
  "connected_slide_adapter", "connected_file_adapter"
];

const external_intake_field_names = [
  "source_type", "source_identifier", "allowed_protocol", "timeout",
  "maximum_response_size", "retry_policy", "client_identity",
  "authentication_mode", "output_format", "evidence_ref", "error_format"
];

const planning_artifact_type_names = [
  "business_plan", "strategy_goals", "market_customer",
  "governance_risk_compliance", "human_review",
  "operations_reliability", "financial_unit_economics", "data_knowledge",
  "continuous_improvement", "change_version_management",
  "agent_architecture", "investor_one_pager", "market_study",
  "risk_register", "kpi_dashboard", "review_cadence",
  "ninety_day_action_plan", "twelve_month_milestone_plan",
  "archive_rename_manifest"
];

const planning_artifact_field_names = [
  "plan_type", "title", "owner", "scope", "assumptions",
  "sections", "risks", "metrics", "review_cadence", "status"
];

const banned_words = [
  "src", "function", "foreach", "engine", "deps",
  "materialize", "materialization", "neuro_rule", "rule_engine"
];

function validate_word_dataset_arrays(groups) {
  const errors = [];
  for (const [group_name, values] of Object.entries(groups || {})) {
    if (!Array.isArray(values)) continue;
    const seen = new Set();
    for (const value of values) {
      if (typeof value !== "string" || value.trim() !== value || value.length === 0) {
        errors.push(`${group_name} contains invalid value ${JSON.stringify(value)}`);
        continue;
      }
      if (seen.has(value)) errors.push(`${group_name} contains duplicate value ${value}`);
      seen.add(value);
    }
  }
  return { ok: errors.length === 0, errors };
}

export {
  entity_types, entity_traits, operation_names, datatype_names,
  relationship_types, relationship_cardinalities, lifecycle_statuses,
  stage_names, pipeline_names,
  pipeline_stage_names, intent_names, entity_field_names, policy_rule_types,
  contract_rule_types, schema_field_types, schema_constraint_names,
  diagnostic_levels, artifact_types, file_roles, module_kinds,
  test_case_kinds, name_formats, version_bump_levels, app_file_groups,
  parser_intent_actions, reasoner_decision_modes, adoption_decision_names,
  application_project_names, application_scope_names, product_blueprint_parts,
  deployment_variant_names, domain_boundary_names, registry_names,
  template_super_type_names, template_category_names, business_domain_names,
  starter_template_names, sample_pipeline_names, layout_projection_names,
  organization_entity_names, organization_feature_names, rbac_role_names,
  permission_action_names, config_section_names, content_tag_names,
  extractable_entity_names, query_intent_names, query_target_names,
  layout_rule_names, style_rule_names, language_config_profile_names,
  learning_store_names, language_command_names, confidence_policy_names,
  correction_source_names, autocomplete_context_names,
  parser_workbench_action_names, sentence_intent_type_names,
  sentence_structure_type_names, part_of_speech_names, tense_names,
  pronoun_type_names, figure_of_speech_names, semantic_role_names,
  language_exception_names, sentence_pattern_names,
  sentence_completion_method_names, sentence_similarity_signal_names,
  template_learning_operation_names, conversation_boundary_signal_names,
  task_schedule_status_names, memory_tier_names, knowledge_unit_type_names,
  knowledge_source_type_names, memory_reasoning_mode_names,
  memory_conflict_type_names, memory_learning_status_names,
  source_file_type_names, source_tree_node_kind_names,
  source_concept_type_names, source_coverage_status_names,
  source_match_category_names, source_conflict_type_names,
  source_adoption_decision_names, source_validation_check_names,
  dataset_class_names, registry_record_type_names, tree_node_type_names,
  provenance_field_names, command_record_field_names,
  capability_record_field_names, policy_field_names, approval_state_names,
  quality_gate_names, search_source_names, repository_operation_names,
  conversion_profile_names, recovery_state_names, handbook_row_kind_names,
  handbook_section_names, type_ratification_phase_names,
  type_ratification_gate_names, provider_plugin_phase_names,
  provider_plugin_gate_names, external_workspace_item_type_names,
  external_workspace_action_names, datatable_field_names, datamap_field_names,
  binding_field_names, parser_command_names, parser_plugin_type_names,
  parser_support_entity_names, round_trip_validation_gate_names,
  parser_surface_names, template_family_names, knowledge_template_type_names,
  document_template_type_names, report_template_type_names,
  communication_template_type_names, technical_template_type_names,
  template_placeholder_field_names, action_template_field_names,
  entity_template_field_names, rule_template_field_names,
  policy_template_field_names, flow_template_field_names,
  test_report_field_names, matching_signal_names, slot_extraction_mode_names,
  command_flow_step_names, capability_creation_step_names,
  boot_sequence_step_names, bot_self_description_field_names,
  runtime_guard_names, benchmark_method_names, cognitive_node_type_names,
  cognitive_loop_step_names, knowledge_activation_state_names,
  nlu_matching_method_names, fuzzy_matching_method_names,
  phonetic_matching_method_names, lexical_matching_method_names,
  semantic_matching_method_names, tree_tool_operation_names,
  parser_command_extension_names, parser_error_detail_names,
  schema_migration_state_names, topic_perspective_field_names,
  external_intake_source_type_names, external_intake_adapter_type_names,
  external_intake_field_names, planning_artifact_type_names,
  planning_artifact_field_names, banned_words,
  validate_word_dataset_arrays
};
