// dataset_gui_relationships_v1.js
// Relationship datasets using compact notation
//
// Format: source_relationship_target_cardinality
// Cardinality: 1_1 = one-to-one, 1_n = one-to-many, n_1 = many-to-one, n_n = many-to-many, 0_n = zero-to-many

// ===== HIERARCHY RELATIONSHIPS (complete) =====
export const dataset_gui_relationship_contains = [
  // Editor > Book
  "editor_contains_book_1_n",
  // Book > Header, Section, Footer
  "book_contains_header_1_1",
  "book_contains_section_1_n",
  "book_contains_footer_1_1",
  // Main > Aside, Article
  "main_contains_aside_0_1",
  "main_contains_article_1_n",
  // Header > Nav
  "header_contains_nav_1_n",
  // Section > ul, ol, h2, p, article, table, form, figure, details
  "section_contains_ul_1_n",
  "section_contains_ol_1_n",
  "section_contains_h2_1_n",
  "section_contains_p_1_n",
  "section_contains_article_0_n",
  "section_contains_table_0_n",
  "section_contains_form_0_n",
  "section_contains_figure_0_n",
  "section_contains_details_0_n",
  // Article > Section, Header, Footer, h1, p
  "article_contains_section_1_n",
  "article_contains_header_1_1",
  "article_contains_footer_1_1",
  "article_contains_h1_1_1",
  "article_contains_p_0_n",
  // Aside > Section, Nav, details
  "aside_contains_section_1_n",
  "aside_contains_nav_1_n",
  "aside_contains_details_0_n",
  // Footer > p, Nav
  "footer_contains_p_1_n",
  "footer_contains_nav_0_1",
  // UL > LI
  "ul_contains_li_1_n",
  // OL > LI
  "ol_contains_li_1_n",
  // LI > Section, Article, a, p, em, strong, ul, ol, img
  "li_contains_section_0_n",
  "li_contains_article_0_n",
  "li_contains_a_0_n",
  "li_contains_p_0_n",
  "li_contains_em_0_n",
  "li_contains_strong_0_n",
  "li_contains_ul_0_n",
  "li_contains_ol_0_n",
  "li_contains_img_0_n",
  // P > a, em, strong, span, code, time
  "p_contains_a_0_n",
  "p_contains_em_0_n",
  "p_contains_strong_0_n",
  "p_contains_span_0_n",
  "p_contains_code_0_n",
  "p_contains_time_0_n",
  // Table > caption, colgroup, thead, tbody, tfoot
  "table_contains_caption_0_1",
  "table_contains_colgroup_0_1",
  "table_contains_thead_1_1",
  "table_contains_tbody_1_1",
  "table_contains_tfoot_0_1",
  // Thead, Tbody, Tfoot > TR
  "thead_contains_tr_1_n",
  "tbody_contains_tr_1_n",
  "tfoot_contains_tr_1_n",
  // TR > TH, TD
  "tr_contains_th_0_n",
  "tr_contains_td_0_n",
  // Form > label, input, button, select, textarea, fieldset
  "form_contains_label_0_n",
  "form_contains_input_0_n",
  "form_contains_button_0_n",
  "form_contains_select_0_n",
  "form_contains_textarea_0_n",
  "form_contains_fieldset_0_n",
  // Fieldset > legend, label, input
  "fieldset_contains_legend_0_1",
  "fieldset_contains_label_0_n",
  "fieldset_contains_input_0_n",
  // Details > Summary, p, ul, section
  "details_contains_summary_1_1",
  "details_contains_p_0_n",
  "details_contains_ul_0_n",
  "details_contains_section_0_n",
  // Figure > img, figcaption, video, audio
  "figure_contains_img_0_1",
  "figure_contains_figcaption_0_1",
  "figure_contains_video_0_1",
  "figure_contains_audio_0_1",
  // Picture > source, img
  "picture_contains_source_1_n",
  "picture_contains_img_1_1"
];

// ===== PAGE TYPE TO LAYOUT RELATIONSHIPS =====
export const dataset_gui_relationship_supports_layout = [
  "website_supports_layout_list_1_n",
  "website_supports_layout_card_1_n",
  "blog_supports_layout_list_1_n",
  "blog_supports_layout_card_1_n",
  "blog_supports_layout_timeline_0_n",
  "document_supports_layout_list_1_n",
  "document_supports_layout_workflowy_tree_0_n",
  "application_supports_layout_list_1_n",
  "application_supports_layout_kanban_0_n",
  "application_supports_layout_card_0_n",
  "saas_dashboard_supports_layout_kanban_1_n",
  "saas_dashboard_supports_layout_calendar_0_n",
  "saas_dashboard_supports_layout_timeline_0_n",
  "saas_dashboard_supports_layout_card_0_n"
];

// ===== PAGE TYPE TO COMPONENT RELATIONSHIPS =====
export const dataset_gui_relationship_uses_component = [
  "website_uses_component_content_collection_1_n",
  "website_uses_component_content_block_1_n",
  "website_uses_component_content_cell_1_n",
  "blog_uses_component_content_collection_1_n",
  "blog_uses_component_content_block_1_n",
  "blog_uses_component_content_cell_1_n",
  "document_uses_component_content_collection_1_n",
  "document_uses_component_content_block_1_n",
  "document_uses_component_content_cell_1_n",
  "application_uses_component_content_collection_1_n",
  "application_uses_component_content_block_1_n",
  "application_uses_component_content_cell_1_n",
  "saas_dashboard_uses_component_content_collection_1_n",
  "saas_dashboard_uses_component_content_block_1_n",
  "saas_dashboard_uses_component_content_cell_1_n"
];

// ===== LAYOUT TO COMPONENT TYPE RELATIONSHIPS =====
export const dataset_gui_relationship_layout_uses_component = [
  "list_uses_component_content_collection_1_n",
  "list_uses_component_content_block_1_n",
  "list_uses_component_content_cell_1_n",
  "card_uses_component_content_collection_1_n",
  "card_uses_component_content_block_1_n",
  "card_uses_component_content_cell_1_n",
  "kanban_uses_component_content_collection_1_n",
  "kanban_uses_component_content_block_1_n",
  "kanban_uses_component_content_cell_1_n",
  "calendar_uses_component_content_collection_1_n",
  "calendar_uses_component_content_block_1_n",
  "calendar_uses_component_content_cell_1_n",
  "workflowy_tree_uses_component_content_collection_1_n",
  "workflowy_tree_uses_component_content_block_1_n",
  "workflowy_tree_uses_component_content_cell_1_n",
  "timeline_uses_component_content_collection_1_n",
  "timeline_uses_component_content_block_1_n",
  "timeline_uses_component_content_cell_1_n"
];

// ===== LAYOUT TO ELEMENT RELATIONSHIPS =====
export const dataset_gui_relationship_renders = [
  "list_renders_ul_1_n",
  "list_renders_ol_1_n",
  "list_renders_li_1_n",
  "card_renders_article_1_n",
  "card_renders_figure_1_n",
  "card_renders_figcaption_1_1",
  "kanban_renders_section_1_n",
  "kanban_renders_ul_1_n",
  "kanban_renders_li_1_n",
  "calendar_renders_table_1_1",
  "calendar_renders_thead_1_1",
  "calendar_renders_tbody_1_1",
  "calendar_renders_tr_1_n",
  "calendar_renders_td_1_n",
  "workflowy_tree_renders_details_1_n",
  "workflowy_tree_renders_summary_1_1",
  "workflowy_tree_renders_ul_1_n",
  "workflowy_tree_renders_li_1_n",
  "timeline_renders_table_1_1",
  "timeline_renders_progress_1_n",
  "timeline_renders_time_1_n"
];

// ===== COMPONENT TO CATEGORY RELATIONSHIPS =====
export const dataset_gui_relationship_belongs_to_category = [
  "header_belongs_to_sectioning_content",
  "nav_belongs_to_sectioning_content",
  "main_belongs_to_sectioning_content",
  "aside_belongs_to_sectioning_content",
  "section_belongs_to_sectioning_content",
  "article_belongs_to_sectioning_content",
  "footer_belongs_to_sectioning_content",
  "h1_belongs_to_heading_content",
  "h2_belongs_to_heading_content",
  "h3_belongs_to_heading_content",
  "h4_belongs_to_heading_content",
  "h5_belongs_to_heading_content",
  "h6_belongs_to_heading_content",
  "p_belongs_to_flow_content",
  "blockquote_belongs_to_flow_content",
  "ul_belongs_to_flow_content",
  "ol_belongs_to_flow_content",
  "li_belongs_to_flow_content",
  "a_belongs_to_interactive_content",
  "button_belongs_to_interactive_content",
  "details_belongs_to_interactive_content",
  "summary_belongs_to_interactive_content",
  "input_belongs_to_form_associated_content",
  "form_belongs_to_form_associated_content",
  "label_belongs_to_form_associated_content",
  "select_belongs_to_form_associated_content",
  "textarea_belongs_to_form_associated_content",
  "img_belongs_to_embedded_content",
  "video_belongs_to_embedded_content",
  "audio_belongs_to_embedded_content",
  "figure_belongs_to_palpable_content",
  "table_belongs_to_palpable_content",
  "code_belongs_to_phrasing_content",
  "em_belongs_to_phrasing_content",
  "strong_belongs_to_phrasing_content",
  "time_belongs_to_phrasing_content",
  "span_belongs_to_phrasing_content",
  "progress_belongs_to_form_associated_content",
  "fieldset_belongs_to_form_associated_content",
  "legend_belongs_to_form_associated_content"
];

// ===== COMPONENT TO CSS TOKEN RELATIONSHIPS =====
export const dataset_gui_relationship_styled_by = [
  "header_styled_by_color_bg_surface",
  "header_styled_by_border_width_default",
  "aside_styled_by_color_bg_surface",
  "aside_styled_by_sidebar_width",
  "footer_styled_by_color_bg_surface",
  "footer_styled_by_border_width_default",
  "section_styled_by_color_bg_body",
  "article_styled_by_width_full",
  "ul_styled_by_space_5",
  "li_styled_by_space_5",
  "li_styled_by_radius_lg",
  "h1_styled_by_font_size_4xl",
  "h2_styled_by_font_size_2xl",
  "h3_styled_by_font_size_xl",
  "p_styled_by_font_size_base",
  "a_styled_by_color_text_muted",
  "button_styled_by_color_brand_primary",
  "input_styled_by_border_width_default",
  "table_styled_by_font_size_sm",
  "progress_styled_by_progress_height",
  "details_styled_by_space_2",
  "summary_styled_by_font_size_sm"
];

// ===== VALIDATION CONSTRAINTS (what CANNOT be nested) =====
export const dataset_gui_relationship_constrains = [
  "p_constrains_section_0_0",
  "p_constrains_article_0_0",
  "p_constrains_header_0_0",
  "p_constrains_footer_0_0",
  "h1_constrains_h1_0_0",
  "h1_constrains_h2_0_0",
  "h1_constrains_h3_0_0",
  "h2_constrains_h1_0_0",
  "h2_constrains_h2_0_0",
  "h3_constrains_h1_0_0",
  "button_constrains_button_0_0",
  "a_constrains_a_0_0",
  "table_constrains_table_0_0",
  "form_constrains_form_0_0",
  "details_constrains_details_0_0",
  "figure_constrains_figure_0_0"
];

// ===== COMPONENT TYPE RELATIONSHIPS =====
export const dataset_gui_relationship_component_contains = [
  "workspace_contains_editor_1_n",
  "editor_contains_content_collection_1_n",
  "content_collection_contains_content_block_1_n",
  "content_block_contains_content_cell_1_n"
];

// ===== HIERARCHY LEVEL TO CSS SELECTOR =====
export const dataset_gui_relationship_has_selector = [
  "editor_has_selector_body_main",
  "book_has_selector_body_main_article",
  "collection_has_selector_article_section_section",
  "block_has_selector_article_section_section_ul",
  "cell_has_selector_article_section_section_ul_li"
];

// ===== COMPONENT TO ID RULE =====
// Rule: Every major component must have unique id + index
export const dataset_gui_relationship_requires_id = [
  "editor_requires_id_1_1",
  "book_requires_id_1_1",
  "collection_requires_id_1_n",
  "block_requires_id_1_n",
  "cell_requires_id_1_n",
  "header_requires_id_1_1",
  "nav_requires_id_0_n",
  "aside_requires_id_0_1",
  "footer_requires_id_0_1",
  "section_requires_id_1_n",
  "article_requires_id_0_n",
  "ul_requires_id_1_n",
  "ol_requires_id_0_n",
  "li_requires_id_1_n",
  "table_requires_id_0_n",
  "form_requires_id_0_n",
  "details_requires_id_0_n",
  "figure_requires_id_0_n"
];
