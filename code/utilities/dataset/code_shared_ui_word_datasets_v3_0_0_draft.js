const layout_names = [
  "notebook", "code_editor", "block_editor", "diagram", "dashboard",
  "fullscreen", "tabbed_window", "aside_panel", "browser_shell",
  "terminal_shell", "text_editor", "collapsible_tree", "document_view",
  "table_view", "card_view", "kanban_view", "calendar_view",
  "flowchart_view", "mindmap_view", "canvas_view", "grid_view",
  "form_view", "chat_view", "timeline_view", "tree_grid_view",
  "split_editor", "preview_view", "settings_view", "docs_view",
  "explorer_view", "parser_workbench", "language_workbench",
  "layout_ast_view", "style_tree_view"
];

const cell_types = ["markdown", "code", "pipeline", "flow", "raw_data", "output"];

const flow_node_types = [
  "trigger", "data", "parser", "transform", "generator", "validator",
  "renderer", "output", "entity_node", "page_node", "file_node",
  "folder_node", "symbol_node", "triple_node"
];

const cell_statuses = ["pending", "running", "done", "error"];

const gui_action_names = [
  "run_cell", "copy_link", "move_up", "move_down", "delete_cell",
  "switch_book", "close_book", "add_block", "create_template", "demo_next",
  "demo_prev", "demo_skip", "new_book", "export_book", "import_book",
  "undo_action", "redo_action", "blur_editor", "search_next",
  "tag_content", "complete_text", "build_query", "extract_entity",
  "learn_correction", "parse_layout_text", "parse_style_text",
  "generate_layout_ast", "generate_style_tree", "preview_layout",
  "show_status", "show_learning_stats", "render_command_output"
];

const panel_names = [
  "templates", "explorer", "settings", "search", "docs", "products",
  "account", "rbac", "datatypes", "dashboard", "people", "payroll",
  "attendance", "approvals", "assets", "training", "helpdesk",
  "audit", "parser", "language", "preview", "ast", "corrections",
  "command_output", "learning_stats", "status"
];

const template_ids = [
  "blank", "ci_cd", "data_analytics", "api_docs", "project_wiki",
  "data_flow", "catalog", "metrics_board", "portfolio",
  "progress_tracking", "assessment", "certification", "model_registry",
  "export", "agent", "workflow", "prompt_chain", "config", "curriculum",
  "lesson", "quiz", "study_book", "learner", "achievement",
  "org_profile", "org_task", "hr_module", "form", "chart_view",
  "trade_execution", "analysis", "decision_tree", "conversation",
  "log_view", "navigation", "workspace", "help", "game", "explorer",
  "entity_workspace", "lms_template", "fintech_organization_template",
  "single_user_template", "organization_management_template",
  "sample_pipeline_template", "documentation_template",
  "parser_workbench_template", "language_workbench_template",
  "layout_parser_template"
];

const export_formats = ["json", "html", "csv", "pdf", "ohm"];

const import_formats = ["json", "ohm", "markdown"];

const keyboard_command_names = [
  "run_cell", "new_book", "export_book", "import_book", "undo_action",
  "redo_action", "blur_editor", "search_next"
];

const semantic_element_names = [
  "header", "main", "section", "article", "aside", "footer", "nav",
  "details", "summary", "button", "textarea", "figure", "figcaption",
  "table", "canvas", "template", "form", "input", "select", "dialog",
  "menu", "search"
];

const aria_role_names = [
  "menubar", "sidebar", "statusbar", "tab", "tabpanel", "button",
  "dialog", "listbox"
];

const editor_component_names = [
  "tab_bar", "code_editor", "doc_editor", "status_bar", "workspace",
  "split_editor", "header", "aside", "article", "footer", "tabs",
  "toast", "modal", "core_canvas_grid", "core_tree_grid",
  "financial_candlestick_chart", "analytics_plotly_chart",
  "workflow_block_canvas", "core_notebook_canvas", "chat_bubble",
  "message_editor", "diff_viewer", "payroll_slip_card",
  "helpdesk_ticket_card", "progress_meter", "course_grid",
  "lesson_list", "video_player", "progress_bar", "question_card",
  "timer", "stat_card", "badge", "form", "select", "toggle", "button",
  "candlestick_chart", "table", "code_block", "upload", "tree_view",
  "agent_card", "message_list", "flow_editor", "timeline",
  "date_picker", "json_text_editor", "collapsible_tree_view",
  "block_document_view", "diagram_renderer", "layout_switcher",
  "render_profile_picker", "same_data_viewer", "natural_text_editor",
  "style_text_editor", "ast_tree_view", "layout_preview",
  "content_tag_panel", "autocomplete_panel", "query_builder_panel",
  "entity_extraction_panel", "correction_log_panel",
  "command_output_panel", "learning_stats_panel", "preview_status_message",
  "semantic_tree_view", "style_rule_panel"
];

const layout_modifier_names = [
  "card_grid", "list_view", "sidebar_layout", "tabbed_layout",
  "form_layout", "css_grid", "flex_layout", "same_data_multi_layout",
  "projection_layout", "read_only_layout", "editable_layout"
];

const render_profile_names = [
  "json_as_text", "json_as_tree", "json_as_document", "json_as_diagram",
  "json_as_table", "json_as_cards", "json_as_kanban",
  "json_as_calendar", "json_as_flowchart", "json_as_mindmap"
];

const input_surface_names = [
  "command_bar", "prompt_panel", "chat_panel", "form_panel",
  "table_editor", "tree_editor", "code_editor", "block_editor",
  "file_drop_zone", "search_panel", "settings_panel"
];

const accessibility_state_names = [
  "labelled", "described", "focusable", "disabled", "expanded",
  "collapsed", "selected", "invalid", "required", "readonly"
];

const interaction_state_names = [
  "idle", "hover", "focus", "active", "disabled", "loading",
  "success", "warning", "error", "empty"
];

const preview_state_names = [
  "not_ready", "ready", "rendering", "rendered", "stale", "invalid",
  "unsupported"
];

function validate_ui_word_dataset_arrays(groups) {
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
  layout_names, cell_types, flow_node_types, cell_statuses,
  gui_action_names, panel_names, template_ids, export_formats,
  import_formats, keyboard_command_names, semantic_element_names,
  aria_role_names, editor_component_names, layout_modifier_names,
  render_profile_names, input_surface_names, accessibility_state_names,
  interaction_state_names, preview_state_names,
  validate_ui_word_dataset_arrays
};
