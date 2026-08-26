// ============================================================
// FILE: datasets/1_entity_types.js
// ============================================================
export const ENTITY_TYPES = [
  // HTML Elements
  "html", "head", "body", "header", "nav", "main", 
  "aside", "section", "article", "footer",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "span", "div", "a", "button",
  "input", "form", "label", "select", "textarea",
  
  // UI Components (custom)
  "card", "modal", "dropdown", "tabs", "accordion",
  "grid", "flex", "container", "row", "col"
];

// ============================================================
// FILE: datasets/2_relationship_types.js
// ============================================================
export const RELATIONSHIP_TYPES = [
  // Structural
  "structural:contains",
  "structural:is_contained_in",
  "structural:parent_of",
  "structural:child_of",
  "structural:must_contain",
  "structural:may_contain",
  "structural:cannot_contain",
  
  // Behavioral
  "behavioral:triggers",
  "behavioral:is_triggered_by",
  "behavioral:controls",
  "behavioral:is_controlled_by",
  "behavioral:updates",
  "behavioral:is_updated_by",
  
  // Semantic
  "semantic:is_a",
  "semantic:has_a",
  "semantic:is_part_of",
  "semantic:belongs_to"
];

// ============================================================
// FILE: datasets/3_attribute_types.js
// ============================================================
export const ATTRIBUTE_TYPES = [
  // Global
  "id", "class", "style", "title", "lang", "dir",
  
  // HTML Specific  "src", "href", "alt", "type", "name", "value",
  "placeholder", "disabled", "checked", "required",
  
  // ARIA
  "role", "aria-label", "aria-describedby", "aria-hidden",
  
  // Layout
  "display", "position", "width", "height", "margin", "padding"
];

// ============================================================
// FILE: datasets/4_style_tokens.js
// ============================================================
export const STYLE_TOKENS = [
  // Colors
  "color-primary", "color-secondary", "color-success",
  "color-danger", "color-warning", "color-info",
  
  // Spacing
  "spacing-xs", "spacing-sm", "spacing-md", "spacing-lg", "spacing-xl",
  
  // Typography
  "font-family-base", "font-size-base", "font-weight-bold",
  
  // Borders
  "border-radius-sm", "border-radius-md", "border-radius-lg"
];

// ============================================================
// FILE: datasets/5_category_types.js
// ============================================================
export const CATEGORY_TYPES = [
  "root",
  "metadata",
  "sectioning",
  "heading",
  "grouping",
  "text_level",
  "embedded",
  "interactive",
  "form",
  "tabular",
  "scripting"
];