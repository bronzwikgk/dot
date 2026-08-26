// datamap_gui_components_v1.js
// Relationships between components

// ===== HEADER RELATIONSHIPS =====
export const datamap_header_contains = [
  "header_contains_brand_name_1_1",
  "header_contains_nav_menu_1_1",
  "header_contains_search_form_0_1",
  "header_contains_window_controls_1_1"
];

// ===== NAV MENU RELATIONSHIPS =====
export const datamap_nav_menu_contains = [
  "nav_menu_contains_file_menu_1_1",
  "nav_menu_contains_edit_menu_1_1",
  "nav_menu_contains_insert_menu_1_1",
  "nav_menu_contains_run_menu_1_1",
  "nav_menu_contains_view_menu_1_1",
  "nav_menu_contains_help_menu_1_1"
];

// ===== MENU ITEM RELATIONSHIPS =====
export const datamap_file_menu_contains = [
  "file_menu_contains_new_book_1_1",
  "file_menu_contains_new_from_templates_1_1",
  "file_menu_contains_import_1_1",
  "file_menu_contains_export_1_1",
  "file_menu_contains_save_1_1",
  "file_menu_contains_settings_1_1"
];

export const datamap_edit_menu_contains = [
  "edit_menu_contains_undo_1_1",
  "edit_menu_contains_redo_1_1",
  "edit_menu_contains_move_cell_up_1_1",
  "edit_menu_contains_move_cell_down_1_1",
  "edit_menu_contains_delete_cell_1_1"
];

export const datamap_insert_menu_contains = [
  "insert_menu_contains_text_cell_1_1",
  "insert_menu_contains_pipeline_cell_1_1",
  "insert_menu_contains_code_cell_1_1",
  "insert_menu_contains_component_1_1",
  "insert_menu_contains_filter_1_1"
];

export const datamap_run_menu_contains = [
  "run_menu_contains_run_active_1_1",
  "run_menu_contains_run_selected_1_1",
  "run_menu_contains_run_all_1_1",
  "run_menu_contains_execute_dag_1_1",
  "run_menu_contains_execute_flow_1_1",
  "run_menu_contains_reset_1_1"
];

export const datamap_view_menu_contains = [
  "view_menu_contains_jupyter_layout_1_1",
  "view_menu_contains_notion_layout_1_1",
  "view_menu_contains_vscode_layout_1_1",
  "view_menu_contains_flow_builder_1_1",
  "view_menu_contains_toggle_sidebar_1_1"
];

export const datamap_help_menu_contains = [
  "help_menu_contains_about_1_1",
  "help_menu_contains_getting_started_1_1",
  "help_menu_contains_api_docs_1_1"
];

// ===== ASIDE RELATIONSHIPS =====
export const datamap_aside_contains = [
  "aside_contains_quick_access_1_1",
  "aside_contains_explorer_1_1",
  "aside_contains_templates_1_1",
  "aside_contains_tags_1_1",
  "aside_contains_trash_1_1"
];

export const datamap_quick_access_contains = [
  "quick_access_contains_favorites_1_1",
  "quick_access_contains_recent_1_1",
  "quick_access_contains_archived_1_1"
];

export const datamap_explorer_contains = [
  "explorer_contains_component_library_1_1",
  "explorer_contains_getting_started_1_1",
  "explorer_contains_api_reference_1_1"
];

export const datamap_template_contains = [
  "templates_contains_notebook_1_1",
  "templates_contains_code_1_1",
  "templates_contains_flow_1_1",
  "templates_contains_meeting_notes_1_1"
];

export const datamap_tag_contains = [
  "tags_contains_reference_1_1",
  "tags_contains_draft_1_1"
];

export const datamap_trash_contains = [
  "trash_contains_deleted_items_1_1"
];

// ===== ARTICLE RELATIONSHIPS =====
export const datamap_article_contains = [
  "article_contains_header_1_1",
  "article_contains_section_1_n",
  "article_contains_footer_1_1"
];

export const datamap_section_contains = [
  "section_contains_ul_1_n",
  "section_contains_h2_1_n",
  "section_contains_p_1_n"
];

export const datamap_ul_contains = [
  "ul_contains_li_1_n"
];

export const datamap_li_contains = [
  "li_contains_section_0_n",
  "li_contains_article_0_n"
];

// ===== COLLECTION RELATIONSHIPS =====
export const datamap_collection_contains = [
  "page_title_contains_h1_1_1",
  "page_title_contains_p_1_1",
  "text_blocks_contains_paragraph_1_n",
  "text_blocks_contains_headings_1_n",
  "text_blocks_contains_quote_1_n",
  "text_blocks_contains_code_1_n",
  "list_blocks_contains_bulleted_list_1_n",
  "list_blocks_contains_numbered_list_1_n",
  "list_blocks_contains_todo_list_1_n",
  "list_blocks_contains_toggle_1_n",
  "media_blocks_contains_image_1_n",
  "media_blocks_contains_video_1_n",
  "media_blocks_contains_audio_1_n",
  "media_blocks_contains_file_1_n",
  "media_blocks_contains_embed_1_n",
  "database_blocks_contains_table_1_n",
  "database_blocks_contains_board_1_n",
  "database_blocks_contains_gallery_1_n",
  "database_blocks_contains_calendar_1_n",
  "database_blocks_contains_timeline_1_n",
  "form_blocks_contains_contact_form_1_n",
  "form_blocks_contains_progress_bars_1_n",
  "layout_blocks_contains_columns_1_n",
  "layout_blocks_contains_breadcrumb_1_n",
  "layout_blocks_contains_child_page_1_n",
  "team_updates_contains_design_system_v2_1_n",
  "team_updates_contains_q3_performance_1_n"
];
