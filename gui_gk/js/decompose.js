// decompose.js
// Takes HTML and extracts datasets, datamaps, and data tables

import { datatable_component_attributes } from '../dataset/datatable_gui_components_v1.js';

// Map HTML tags to component types
const TAG_TO_COMPONENT = {
  'header': 'header',
  'nav': 'nav',
  'main': 'main',
  'aside': 'aside',
  'article': 'article',
  'section': 'section',
  'footer': 'footer',
  'h1': 'h1',
  'h2': 'h2',
  'h3': 'h3',
  'h4': 'h4',
  'h5': 'h5',
  'h6': 'h6',
  'p': 'p',
  'ul': 'ul',
  'ol': 'ol',
  'li': 'li',
  'table': 'table',
  'thead': 'thead',
  'tbody': 'tbody',
  'tr': 'tr',
  'th': 'th',
  'td': 'td',
  'form': 'form',
  'fieldset': 'fieldset',
  'label': 'label',
  'input': 'input',
  'button': 'button',
  'select': 'select',
  'textarea': 'textarea',
  'details': 'details',
  'summary': 'summary',
  'figure': 'figure',
  'figcaption': 'figcaption',
  'img': 'img',
  'video': 'video',
  'audio': 'audio',
  'pre': 'pre',
  'code': 'code',
  'blockquote': 'blockquote',
  'cite': 'cite',
  'time': 'time',
  'progress': 'progress',
  'a': 'a',
  'strong': 'strong',
  'em': 'em',
  'span': 'span'
};

// Decompose HTML string into data
function decompose(html_string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html_string, 'text/html');
  const body = doc.body;
  
  const dataset = new Set();
  const datamap = [];
  const datatable = {};
  
  // Traverse DOM
  traverse(body, null, dataset, datamap, datatable);
  
  return {
    dataset: [...dataset],
    datamap,
    datatable
  };
}

// Traverse DOM recursively
function traverse(node, parent_type, dataset, datamap, datatable) {
  if (!node || !node.tagName) return;
  
  const tag = node.tagName.toLowerCase();
  const component_type = TAG_TO_COMPONENT[tag] || tag;
  
  // Add to dataset
  dataset.add(component_type);
  
  // Add relationship to datamap
  if (parent_type) {
    const rel = `${parent_type}_contains_${component_type}_1_n`;
    if (!datamap.includes(rel)) {
      datamap.push(rel);
    }
  }
  
  // Extract attributes for data table
  const attrs = {};
  if (node.id) attrs.id = node.id;
  for (const attr of node.attributes) {
    if (attr.name !== 'id' && attr.name !== 'class' && attr.name !== 'style') {
      attrs[attr.name] = attr.value;
    }
  }
  
  // Extract text content
  const text = getTextContent(node);
  if (text) attrs.text = text;
  
  // Store in datatable
  if (!datatable[component_type]) {
    datatable[component_type] = { tag, ...attrs };
  }
  
  // Check state from attributes
  if (node.hasAttribute('open')) attrs.state = 'expanded';
  if (node.hasAttribute('aria-current')) attrs.state = node.getAttribute('aria-current');
  if (node.hasAttribute('data-state')) attrs.state = node.getAttribute('data-state');
  
  // Traverse children
  for (const child of node.children) {
    traverse(child, component_type, dataset, datamap, datatable);
  }
}

// Get text content (excluding child elements)
function getTextContent(node) {
  let text = '';
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent.trim();
    }
  }
  return text || null;
}

// Decompose from DOM element
function decompose_element(element) {
  const html_string = element.outerHTML;
  return decompose(html_string);
}

// Decompose current page
function decompose_page() {
  return decompose(document.body.outerHTML);
}

export { decompose, decompose_element, decompose_page };
