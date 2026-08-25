const action_word_names = [
  "create", "read", "update", "delete", "query", "validate", "compose",
  "decompose", "parse", "render", "approve", "reject",
  "defer", "archive", "ingest", "normalize", "link", "compile",
  "export", "audit", "detect_mode"
];

const entity_word_names = [
  "app", "entity", "template", "dataset", "schema", "policy", "contract",
  "relationship", "workflow", "command", "capability", "action", "view",
  "component", "route", "experiment", "experiment_version",
  "experiment_run", "finding", "expression_template"
];

const relationship_word_names = [
  "contains", "depends_on", "uses", "validates", "generates", "owns",
  "references", "maps_to", "derived_from", "blocked_by", "implements"
];

const layout_word_names = [
  "notebook", "code_editor", "block_editor", "document_view",
  "collapsible_tree", "diagram", "dashboard", "table_view", "list_view",
  "gallery_view", "card_view", "board_view", "kanban_view",
  "calendar_view", "timeline_view", "canvas_view", "form_view",
  "chat_view", "workflow_canvas", "website_builder", "database_view",
  "chart_view", "split_view", "diff_view", "parser_workbench",
  "language_workbench", "chart_layout"
];

const template_word_names = [
  "starter_template", "domain_template", "layout_template", "flow_template",
  "document_template", "entity_template", "business_template",
  "report_template", "knowledge_template", "technical_template"
];

const dataset_word_names = [
  "word_dataset", "registry_map", "relationship_map", "schema_catalog",
  "rule_catalog", "validation_dataset", "ui_dataset", "behavior_dataset"
];

const workflow_word_names = [
  "stage", "step", "task", "flow", "pipeline", "trigger", "condition",
  "approval_gate", "rollback_plan", "audit_record"
];

const policy_word_names = [
  "allow", "block", "warn", "require_approval", "require_review",
  "require_evidence", "require_confirmation", "rate_limit", "retry"
];

const status_word_names = [
  "proposed", "draft", "reviewed", "approved", "ready", "active",
  "stable", "staged", "validated", "deprecated", "archived", "rejected",
  "deferred"
];

const preposition_word_names = [
  "to", "from", "with", "without", "for", "by", "in", "on", "at",
  "into", "through", "between", "under", "over", "before", "after"
];

const stop_word_names = [
  "a", "an", "the", "and", "or", "but", "if", "then", "else", "of",
  "is", "are", "was", "were", "be", "been", "being"
];

const ambiguity_warning_names = [
  "multiple_intents", "multiple_targets", "multiple_domains",
  "multiple_relationships", "unclear_scope", "unclear_owner"
];

const near_match_warning_names = [
  "similar_name_found", "similar_type_found", "similar_template_found",
  "similar_command_found", "similar_dataset_found"
];

const parse_warning_names = [
  "incomplete_sentence", "unknown_word", "unknown_phrase",
  "unsupported_structure", "low_confidence_parse", "missing_slot"
];

const grammar_template_names = [
  "simple_command", "conditional_command", "compound_command",
  "definition_sentence", "comparison_sentence", "clarification_question"
];

const expression_operation_names = [
  "equals", "not_equals", "greater_than", "less_than",
  "greater_than_or_equal", "less_than_or_equal", "contains", "matches"
];

const document_section_names = [
  "purpose", "scope", "inputs", "outputs", "requirements", "contracts",
  "examples", "validation", "testing", "known_limits", "changelog"
];

const corpus_category_names = [
  "golden_sentence", "grammar_example", "command_example",
  "correction_example", "negative_example", "edge_case"
];

const corpus_source_names = [
  "user_input", "source_document", "handbook", "dataset_file",
  "template_file", "audit_note", "manual_entry"
];

const warning_code_names = [
  "warn_ambiguous_intent", "warn_missing_slot", "warn_near_match",
  "warn_low_confidence", "warn_unsupported_layout", "warn_policy_review"
];

const error_code_names = [
  "error_missing_required_field", "error_invalid_type", "error_duplicate_id",
  "error_unknown_relationship", "error_unresolved_reference",
  "error_policy_blocked"
];

const fallback_policy_names = [
  "ask_clarification", "use_default", "defer_to_review",
  "block_until_approved", "choose_highest_confidence"
];

const cache_operation_names = [
  "get", "set", "delete", "clear", "refresh", "invalidate", "warm"
];

const cache_status_names = [
  "hit", "miss", "stale", "fresh", "expired", "invalidated", "warming"
];

const preposition_slot_names = [
  "target", "source", "owner", "domain", "time", "location", "method",
  "constraint", "relationship", "output"
];

const data_shape_category_names = [
  "scalar", "list", "table", "tree", "graph", "document", "record",
  "matrix", "timeline", "diagram", "ast", "dag"
];

const command_target_family_names = [
  "file", "folder", "code", "doc", "test", "dataset", "entity",
  "template", "experiment", "view", "report"
];

const experiment_entity_names = [
  "experiment", "experiment_version", "experiment_run",
  "experiment_template", "expression_template", "rule_node",
  "filter_node", "source_dataset", "derived_feature", "finding",
  "run_report", "chart_panel", "comparison_panel"
];

const experiment_action_names = [
  "create_experiment", "create_version", "duplicate_node",
  "disable_node", "delete_node", "import_experiment", "open_experiment",
  "run_experiment", "validate_hypothesis", "compare_versions"
];

const expression_template_type_names = [
  "single_feature_threshold", "two_feature_and", "feature_ratio",
  "temporal_sequence", "contextual", "exclusion", "multi_timeframe",
  "cross_entity"
];

const finding_type_names = [
  "summary", "metric_change", "pattern_found", "cluster_found",
  "correlation_found", "validation_failed", "hypothesis_supported",
  "hypothesis_rejected"
];

const chart_type_names = [
  "line", "candle", "scatter", "histogram", "comparison",
  "two_dimensional", "three_dimensional"
];

const block_type_names = [
  "paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list",
  "numbered_list", "checklist", "toggle", "quote", "callout", "divider",
  "code_block", "equation", "table", "image", "video", "audio", "file",
  "bookmark", "embed", "page_reference", "block_reference", "backlink",
  "relation", "property", "tag", "mention", "comment", "footnote",
  "citation", "database", "command_block", "workflow_block",
  "pipeline_block", "entity_block", "schema_block", "dataset_block",
  "policy_block", "template_block", "experiment_block", "output_block",
  "preview_block", "audit_block"
];

const database_view_type_names = [
  "table_view", "list_view", "board_view", "kanban_view", "calendar_view",
  "timeline_view", "gallery_view", "chart_view", "form_view",
  "dashboard_view"
];

const navigation_surface_names = [
  "workspace_switcher", "project_switcher", "application_switcher",
  "sidebar_tree", "page_tree", "block_tree", "entity_explorer",
  "file_explorer", "collection_explorer", "breadcrumb", "tab_bar",
  "command_palette", "quick_switcher", "search_results", "backlink_panel",
  "graph_view", "canvas_zoom", "history", "recently_opened",
  "pinned_items", "favorites"
];

const component_state_names = [
  "idle", "focused", "hovered", "active", "selected", "editing",
  "dragging", "resizing", "connecting", "loading", "empty", "dirty",
  "saving", "saved", "validating", "valid", "warning", "error",
  "blocked", "disabled", "read_only", "pending_approval", "running",
  "completed", "failed", "cancelled", "archived"
];

const suggestion_type_names = [
  "command_suggestion", "approved_name_suggestion", "block_type_suggestion",
  "property_suggestion", "relation_suggestion", "template_suggestion",
  "schema_field_suggestion", "dataset_value_suggestion",
  "route_suggestion", "workflow_node_suggestion", "shortcut_suggestion",
  "setting_suggestion"
];

const correction_type_names = [
  "spelling_correction", "near_match_correction",
  "banned_word_replacement", "casing_correction",
  "separator_correction", "synonym_correction", "missing_slot_suggestion",
  "incomplete_command_suggestion"
];

const ui_setting_group_names = [
  "appearance", "theme", "density", "layout", "accessibility",
  "keyboard_shortcuts", "editor", "block_editor", "code_editor", "canvas",
  "workflow_canvas", "table_view", "dashboard", "notifications",
  "autosuggest", "autocorrect", "validation", "audit_visibility"
];

const ui_compiler_stage_names = [
  "decompose", "parse", "transform", "reason", "resolve", "compose",
  "inject"
];

const html_tag_category_names = [
  "document_section", "block_text", "inline_text", "tabular_grid",
  "ordered_unordered_list", "form_input", "interactive_action",
  "interactive_element", "media_embed", "layout_container",
  "navigation_bar", "page_metadata", "web_component", "metadata_element"
];

const html_tag_names = [
  "html", "head", "body", "main", "section", "article", "header",
  "footer", "aside", "nav", "address", "h1", "h2", "h3", "h4", "h5",
  "h6", "p", "pre", "blockquote", "em", "strong", "small", "code",
  "kbd", "mark", "time", "data", "span", "table", "thead", "tbody",
  "tfoot", "tr", "td", "th", "caption", "colgroup", "col", "ul", "ol",
  "menu", "li", "dl", "dt", "dd", "label", "input", "select",
  "textarea", "option", "optgroup", "datalist", "search", "a", "button",
  "progress", "meter", "details", "summary", "dialog", "img", "video",
  "audio", "iframe", "embed", "picture", "source", "track", "map",
  "area", "figure", "figcaption", "form", "fieldset", "legend", "slot"
];

const html_singleton_tag_names = [
  "html", "head", "body", "main"
];

const layout_node_type_names = [
  "element", "text", "repeater", "template", "slot", "fragment"
];

const route_segment_names = [
  "user_type", "book_id", "cell_id", "view_id", "entity_id",
  "project_id", "application_id"
];

const design_token_names = [
  "background", "foreground", "primary", "secondary", "muted", "accent",
  "border", "radius", "spacing", "font_size", "line_height", "shadow",
  "surface", "focus_ring"
];

const ui_lifecycle_state_names = [
  "unmounted", "initializing", "mounted", "rendering", "rendered",
  "updating", "updated", "destroying"
];

const ui_event_type_names = [
  "click", "change", "input", "submit", "keydown", "keyup", "focus",
  "blur", "hashchange", "load"
];

const ui_input_type_names = [
  "text", "search", "number", "email", "password", "checkbox", "radio",
  "file", "hidden", "submit", "button"
];

const ui_output_type_names = [
  "html_fragment", "text_node", "json_string", "jsonl_stream",
  "alert_dialog"
];

const fintech_entity_names = [
  "fintech_organization", "business_unit", "product", "customer",
  "account", "transaction", "ledger_entry", "payment", "payout",
  "settlement", "invoice", "subscription", "fee", "pricing_plan",
  "risk_case", "compliance_case", "kyc_record", "aml_check",
  "approval_request", "control", "integration", "webhook",
  "reconciliation_run", "exception_queue"
];

const fintech_product_type_names = [
  "payments", "lending", "subscription_billing", "wallet",
  "wealth_management", "insurance", "compliance", "reporting"
];

const transaction_type_names = [
  "charge", "refund", "payment", "payout", "transfer", "fee",
  "adjustment", "settlement", "reversal"
];

const account_type_names = [
  "customer_account", "merchant_account", "ledger_account",
  "settlement_account", "revenue_account", "fee_account"
];

const payment_status_names = [
  "created", "pending", "authorized", "captured", "settled", "failed",
  "refunded", "reversed", "cancelled"
];

const compliance_case_type_names = [
  "kyc_review", "aml_review", "fraud_review", "sanctions_review",
  "risk_review", "audit_review"
];

const trading_entity_names = [
  "trading_workspace", "market_data_source", "symbol", "timeframe",
  "market_bar", "feature", "derived_feature", "indicator", "signal",
  "rule", "strategy", "strategy_version", "backtest",
  "walk_forward_test", "paper_trade_run", "trade", "position", "order",
  "risk_rule", "portfolio", "benchmark", "regime"
];

const market_data_field_names = [
  "timestamp", "open", "high", "low", "close", "volume", "symbol",
  "timeframe", "source_ref"
];

const timeframe_names = [
  "one_minute", "five_minutes", "fifteen_minutes", "one_hour",
  "one_day", "one_week", "one_month"
];

const order_side_names = [
  "buy", "sell", "short", "cover"
];

const strategy_status_names = [
  "draft", "staged", "backtested", "validated", "rejected",
  "deprecated", "archived"
];

const backtest_metric_names = [
  "total_return", "annualized_return", "win_rate", "profit_factor",
  "sharpe_ratio", "sortino_ratio", "calmar_ratio", "maximum_drawdown",
  "expectancy", "average_win", "average_loss", "trade_count",
  "exposure", "turnover", "slippage", "commission", "latency"
];

const data_quality_issue_names = [
  "missing_bar", "duplicate_bar", "invalid_price", "invalid_volume",
  "out_of_order_timestamp", "missing_source", "unsupported_timeframe"
];

const parser_host_target_names = [
  "local_runtime", "browser_runtime", "worker_runtime", "server_runtime",
  "test_runtime", "app_shell"
];

const phrase_type_names = [
  "noun_phrase", "verb_phrase", "prepositional_phrase",
  "adjective_phrase", "adverb_phrase", "clause", "fragment"
];

const article_words = ["a", "an", "the"];

const determiner_words = [
  "this", "that", "these", "those", "each", "every", "some", "any",
  "all", "no"
];

const conjunction_words = [
  "and", "or", "but", "because", "although", "while", "when", "if",
  "unless"
];

const modal_words = [
  "can", "could", "may", "might", "must", "shall", "should", "will",
  "would"
];

const auxiliary_words = [
  "am", "is", "are", "was", "were", "be", "been", "being", "do",
  "does", "did", "have", "has", "had"
];

const negator_words = [
  "no", "not", "never", "none", "nothing", "neither", "nor", "without"
];

const connector_words = [
  "then", "also", "next", "finally", "however", "therefore", "meanwhile",
  "otherwise"
];

const marker_words = [
  "who", "what", "when", "where", "why", "how", "if", "please",
  "define", "explain"
];

const message_role_names = [
  "user", "assistant", "system", "developer", "tool", "agent", "reviewer"
];

const message_type_names = [
  "request", "response", "clarification", "approval_request",
  "tool_result", "status_update", "error_report"
];

const tool_status_names = [
  "available", "unavailable", "running", "completed", "failed", "blocked",
  "cancelled"
];

const confidence_band_names = [
  "very_low", "low", "medium", "high", "very_high", "certain"
];

const quick_action_names = [
  "approve", "reject", "edit", "retry", "explain", "show_diff",
  "run_test", "open_doc"
];

const session_status_names = [
  "new", "active", "paused", "waiting_for_user", "waiting_for_tool",
  "completed", "failed", "archived"
];

const bot_profile_names = [
  "user_helper", "developer_helper", "maintainer_helper", "reviewer_helper",
  "domain_helper"
];

const lifecycle_stage_names = [
  "intake", "understanding", "planning", "review", "execution",
  "validation", "completion"
];

const goal_category_names = [
  "learn", "build", "fix", "review", "organize", "test", "document",
  "publish"
];

const feedback_type_names = [
  "positive", "negative", "correction", "preference", "missing_detail",
  "confusing_response"
];

const correction_status_names = [
  "proposed", "accepted", "rejected", "needs_review", "applied",
  "superseded"
];

const response_format_names = [
  "plain_text", "markdown", "json", "table", "checklist", "diff",
  "report"
];

const context_item_names = [
  "current_goal", "recent_message", "active_file", "selected_entity",
  "pending_decision", "test_result", "user_preference"
];

const health_status_names = [
  "healthy", "degraded", "blocked", "failing", "unknown", "recovering"
];

const bot_api_route_names = [
  "create_session", "send_message", "list_messages", "run_action",
  "approve_action", "reject_action", "export_conversation"
];

const bot_security_check_names = [
  "input_sanitized", "permission_checked", "rate_limit_checked",
  "private_data_checked", "approval_checked"
];

const bot_storage_policy_names = [
  "session_only", "persist_history", "persist_summary",
  "redact_sensitive", "do_not_store"
];

const bot_tool_category_names = [
  "code", "document", "repository", "search", "test", "file",
  "application"
];

const bot_documentation_section_names = [
  "welcome", "help", "examples", "capabilities", "limits", "changelog",
  "privacy"
];

const bot_command_example_names = [
  "create_app", "explain_code", "run_tests", "review_docs",
  "update_dataset", "draft_template"
];

const bot_capability_dictionary_names = [
  "capability_name", "trigger_phrase", "pattern", "constraint",
  "tool_reference", "example_prompt"
];

const bot_capability_trigger_names = [
  "exact_phrase", "intent_match", "pattern_match", "quick_action",
  "scheduled_task"
];

const bot_capability_constraint_names = [
  "requires_approval", "requires_file", "requires_domain",
  "local_only", "read_only", "write_allowed"
];

const anomaly_type_names = [
  "contradiction", "missing_evidence", "low_confidence", "stale_fact",
  "invalid_relationship", "unexpected_output"
];

const proof_status_names = [
  "not_checked", "supported", "weakly_supported", "contradicted",
  "needs_review"
];

const memory_type_names = [
  "working_memory", "episodic_memory", "semantic_memory",
  "procedural_memory"
];

const verification_status_names = [
  "untested", "verified", "contradicted", "deprecated", "blocked",
  "needs_review"
];

const consolidation_action_names = [
  "merge", "split", "promote", "defer", "archive", "supersede",
  "request_review"
];

const repair_action_names = [
  "specialize", "generalize", "split", "merge", "reclassify", "demote",
  "rollback", "retry", "request_review"
];

const forgetting_reason_names = [
  "expired", "superseded", "user_requested", "low_confidence",
  "policy_required", "duplicate"
];

const source_reliability_band_names = [
  "unknown", "low", "medium", "high", "primary", "verified"
];

const recall_mode_names = [
  "exact", "semantic", "recent", "by_topic", "by_entity", "by_source",
  "by_confidence"
];

const validation_result_names = [
  "pass", "fail", "warning", "skipped", "blocked", "needs_review"
];

const risk_level_names = [
  "none", "low", "medium", "high", "critical"
];

const conflict_type_names = [
  "name_conflict", "schema_conflict", "relationship_conflict",
  "policy_conflict", "ownership_conflict", "meaning_conflict"
];

const gap_type_names = [
  "missing_dataset", "missing_schema", "missing_test", "missing_doc",
  "missing_owner", "missing_evidence"
];

const audit_report_field_names = [
  "scope", "inventory_count", "covered_count", "gap_count",
  "conflict_count", "deferred_count", "recommendation_count",
  "evidence_refs", "next_actions"
];

const acceptance_category_names = [
  "completeness", "benchmark", "structural_integrity",
  "doctrine_alignment"
];

const rejection_reason_names = [
  "banned_word", "unapproved_name", "schema_failed",
  "relationship_cycle", "missing_provenance", "undocumented_method",
  "validation_skipped", "runtime_policy_violation"
];

const monitor_metric_names = [
  "validation_failure_rate", "unresolved_relationship_count",
  "duplicate_name_count", "unapproved_vocabulary_count",
  "stale_memory_count", "response_latency",
  "generated_artifact_failure_count", "rollback_count"
];

const source_trust_factor_names = [
  "validation_result", "contradiction_count", "freshness",
  "review_history", "source_authority", "provenance_quality"
];

const confirmation_mode_names = [
  "none", "auto", "ask_once", "ask_every_time", "review_required",
  "blocked"
];

const command_status_names = [
  "received", "parsed", "matched", "needs_clarification",
  "waiting_for_approval", "approved", "executed", "failed"
];

const action_outcome_names = [
  "success", "failure", "partial_success", "skipped", "blocked",
  "cancelled"
];

const command_template_type_names = [
  "create_command", "update_command", "delete_command", "query_command",
  "review_command", "test_command", "publish_command"
];

export {
  action_word_names, entity_word_names, relationship_word_names,
  layout_word_names, template_word_names, dataset_word_names,
  workflow_word_names, policy_word_names, status_word_names,
  preposition_word_names, stop_word_names, ambiguity_warning_names,
  near_match_warning_names, parse_warning_names, grammar_template_names,
  expression_operation_names, document_section_names, corpus_category_names,
  corpus_source_names, warning_code_names, error_code_names,
  fallback_policy_names, cache_operation_names, cache_status_names,
  preposition_slot_names, data_shape_category_names,
  parser_host_target_names, phrase_type_names, article_words,
  determiner_words, conjunction_words, modal_words, auxiliary_words,
  negator_words, connector_words, marker_words, message_role_names,
  message_type_names, tool_status_names, confidence_band_names,
  quick_action_names, session_status_names, bot_profile_names,
  lifecycle_stage_names, goal_category_names, feedback_type_names,
  correction_status_names, response_format_names, context_item_names,
  health_status_names, bot_api_route_names, bot_security_check_names,
  bot_storage_policy_names, bot_tool_category_names,
  bot_documentation_section_names, bot_command_example_names,
  bot_capability_dictionary_names, bot_capability_trigger_names,
  bot_capability_constraint_names, anomaly_type_names, proof_status_names,
  consolidation_action_names, forgetting_reason_names,
  source_reliability_band_names, recall_mode_names, validation_result_names,
  risk_level_names, conflict_type_names, gap_type_names,
  audit_report_field_names, confirmation_mode_names, command_status_names,
  action_outcome_names, command_template_type_names, memory_type_names,
  verification_status_names, repair_action_names, acceptance_category_names,
  rejection_reason_names, monitor_metric_names, source_trust_factor_names,
  command_target_family_names, experiment_entity_names,
  experiment_action_names, expression_template_type_names,
  finding_type_names, chart_type_names, block_type_names,
  database_view_type_names, navigation_surface_names, component_state_names,
  suggestion_type_names, correction_type_names, ui_setting_group_names,
  ui_compiler_stage_names, html_tag_category_names, html_tag_names,
  html_singleton_tag_names, layout_node_type_names, route_segment_names,
  design_token_names, ui_lifecycle_state_names, ui_event_type_names,
  ui_input_type_names, ui_output_type_names,
  fintech_entity_names, fintech_product_type_names, transaction_type_names,
  account_type_names, payment_status_names, compliance_case_type_names,
  trading_entity_names, market_data_field_names, timeframe_names,
  order_side_names, strategy_status_names, backtest_metric_names,
  data_quality_issue_names
};
