// components.js
// Generic component definitions for the semantic UI framework

export const COMPONENT_TYPES = {
  HEADER: "header",
  NAV: "nav",
  ASIDE: "aside",
  ARTICLE: "article",
  SECTION: "section",
  FOOTER: "footer",
  UL: "ul",
  OL: "ol",
  LI: "li",
  TABLE: "table",
  FORM: "form",
  DETAILS: "details"
};

export const component_definitions = {
  [COMPONENT_TYPES.HEADER]: {
    tag: "header",
    children: ["nav", "h1", "button"],
    required: ["nav"]
  },
  [COMPONENT_TYPES.NAV]: {
    tag: "nav",
    children: ["menu", "a", "button"],
    required: ["menu"]
  },
  [COMPONENT_TYPES.ASIDE]: {
    tag: "aside",
    children: ["section"],
    required: ["section"]
  },
  [COMPONENT_TYPES.ARTICLE]: {
    tag: "article",
    children: ["header", "section", "footer"],
    required: ["section"]
  },
  [COMPONENT_TYPES.SECTION]: {
    tag: "section",
    children: ["h1", "h2", "h3", "p", "ul", "ol", "table", "form", "details", "article", "section"],
    required: []
  },
  [COMPONENT_TYPES.FOOTER]: {
    tag: "footer",
    children: ["p", "nav"],
    required: ["p"]
  },
  [COMPONENT_TYPES.UL]: {
    tag: "ul",
    children: ["li"],
    required: ["li"]
  },
  [COMPONENT_TYPES.LI]: {
    tag: "li",
    children: ["section", "article", "a", "p", "em", "strong"],
    required: []
  },
  [COMPONENT_TYPES.TABLE]: {
    tag: "table",
    children: ["thead", "tbody", "tr", "th", "td"],
    required: ["thead", "tbody"]
  },
  [COMPONENT_TYPES.FORM]: {
    tag: "form",
    children: ["fieldset", "label", "input", "button", "select", "textarea"],
    required: ["fieldset"]
  },
  [COMPONENT_TYPES.DETAILS]: {
    tag: "details",
    children: ["summary", "p", "ul"],
    required: ["summary"]
  }
};
