// compose.js
// Builds schema from datasets, datamaps, and data tables

import { datatable_component_attributes } from '../dataset/datatable_gui_components_v1.js';

// Compose schema from resolved data
function compose_from_data(resolved_data) {
  const { dataset, datamap, datatable } = resolved_data;
  
  // Find root component (main or body)
  const root_type = find_root(dataset, datamap);
  
  // Build schema tree
  return build_schema(root_type, datamap, datatable);
}

// Find root component
function find_root(dataset, datamap) {
  // Root is the component that is not contained by anything
  const contained = new Set();
  for (const rel of datamap) {
    const parts = rel.split('_contains_');
    if (parts.length === 2) {
      const child = parts[1].replace(/_\d+_\d+$/, '');
      contained.add(child);
    }
  }
  
  for (const component of dataset) {
    if (!contained.has(component)) {
      return component;
    }
  }
  
  return dataset[0] || 'main';
}

// Build schema tree from datamap
function build_schema(type, datamap, datatable) {
  const attrs = datatable[type] || {};
  const children = [];
  
  // Find children from datamap
  for (const rel of datamap) {
    const parts = rel.split('_contains_');
    if (parts.length === 2) {
      const parent = parts[0];
      const child_with_card = parts[1];
      const child = child_with_card.replace(/_\d+_\d+$/, '');
      
      if (parent === type && datatable[child]) {
        children.push(build_schema(child, datamap, datatable));
      }
    }
  }
  
  return {
    type,
    id: attrs.id || null,
    attributes: attrs,
    content: attrs.text || attrs.label || '',
    children
  };
}

// Compose from HTML (full pipeline step)
function compose_from_html(html_string) {
  // This would call decompose -> resolve -> compose
  // For now, just return a basic schema
  return {
    type: 'main',
    children: []
  };
}

export { compose_from_data, compose_from_html, find_root, build_schema };
