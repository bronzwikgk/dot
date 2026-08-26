// data_tables.js
// Data tables defining attributes and properties for each item

export const component_attributes = {
  header: {
    tag: "header",
    styles: ["background", "border-bottom", "padding", "display", "align-items"],
    children_types: ["nav", "h1", "button"]
  },
  nav: {
    tag: "nav",
    styles: ["display", "gap", "align-items"],
    children_types: ["menu", "a", "button"]
  },
  aside: {
    tag: "aside",
    styles: ["width", "background", "border-right", "padding", "overflow"],
    children_types: ["section"]
  },
  article: {
    tag: "article",
    styles: ["flex", "display", "flex-direction", "overflow"],
    children_types: ["header", "section", "footer"]
  },
  section: {
    tag: "section",
    styles: ["margin", "padding", "max-width"],
    children_types: ["h1", "h2", "h3", "p", "ul", "ol", "table", "form", "details"]
  },
  footer: {
    tag: "footer",
    styles: ["background", "border-top", "padding", "display", "justify-content"],
    children_types: ["p", "nav"]
  },
  ul: {
    tag: "ul",
    styles: ["list-style", "margin", "padding"],
    children_types: ["li"]
  },
  li: {
    tag: "li",
    styles: ["padding", "border-bottom"],
    children_types: ["section", "article", "a", "p"]
  },
  table: {
    tag: "table",
    styles: ["width", "border-collapse"],
    children_types: ["thead", "tbody", "tr", "th", "td"]
  },
  form: {
    tag: "form",
    styles: [],
    children_types: ["fieldset", "label", "input", "button"]
  },
  details: {
    tag: "details",
    styles: [],
    children_types: ["summary", "p", "ul"]
  }
};

export const page_type_attributes = {
  website: {
    font_family: "Georgia, serif",
    brand_color: "#0066cc",
    header_bg: "#ffffff",
    aside_bg: "#f8f9fa",
    scroll_container: "body"
  },
  blog: {
    font_family: "Helvetica, sans-serif",
    brand_color: "#e74c3c",
    header_bg: "#ffffff",
    aside_bg: "#f8f9fa",
    scroll_container: "article"
  },
  document: {
    font_family: "Palatino, serif",
    brand_color: "#2c3e50",
    header_bg: "#2c3e50",
    aside_bg: "#f8f9fa",
    scroll_container: "article > section"
  },
  application: {
    font_family: "Segoe UI, sans-serif",
    brand_color: "#2ea44f",
    header_bg: "#24292e",
    aside_bg: "#f6f8fa",
    scroll_container: "aside"
  },
  saas_dashboard: {
    font_family: "Inter, sans-serif",
    brand_color: "#6366f1",
    header_bg: "#1e293b",
    aside_bg: "#f8fafc",
    scroll_container: "none"
  }
};
