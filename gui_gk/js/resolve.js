// resolve.js
// Validates and fills gaps in decomposed data

import { 
  dataset_gui_semantic_elements,
  dataset_gui_hierarchy_levels 
} from '../dataset/dataset_gui_framework_v1.js';

import {
  dataset_gui_relationship_constrains,
  dataset_gui_relationship_requires_id
} from '../dataset/dataset_gui_relationships_v1.js';

import { datatable_component_attributes } from '../dataset/datatable_gui_components_v1.js';

// Resolve and validate decomposed data
function resolve(decomposed_data) {
  const { dataset, datamap, datatable } = decomposed_data;
  const issues = [];
  const resolved = {
    dataset: [...dataset],
    datamap: [...datamap],
    datatable: { ...datatable }
  };
  
  // 1. Validate all components exist in framework
  for (const component of resolved.dataset) {
    if (!datatable_component_attributes[component] && !is_semantic_element(component)) {
      issues.push(`Unknown component: ${component}`);
    }
  }
  
  // 2. Fill missing attributes from data table defaults
  for (const [type, attrs] of Object.entries(resolved.datatable)) {
    const defaults = datatable_component_attributes[type];
    if (defaults) {
      for (const [key, value] of Object.entries(defaults)) {
        if (!attrs[key]) {
          attrs[key] = value;
        }
      }
    }
  }
  
  // 3. Validate relationships against constraints
  for (const rel of resolved.datamap) {
    const parts = rel.split('_contains_');
    if (parts.length === 2) {
      const parent = parts[0];
      const child_with_card = parts[1];
      const child = child_with_card.replace(/_\d+_\d+$/, '');
      
      if (!is_allowed(parent, child)) {
        issues.push(`Constraint violation: ${parent} -> ${child}`);
      }
    }
  }
  
  // 4. Generate missing IDs
  for (const [type, attrs] of Object.entries(resolved.datatable)) {
    if (!attrs.id) {
      attrs.id = `${type}_${Date.now()}`;
    }
  }
  
  // 5. Add missing relationships from hierarchy
  add_hierarchy_relationships(resolved);
  
  return {
    resolved,
    issues,
    valid: issues.length === 0
  };
}

// Check if component is a semantic element
function is_semantic_element(component) {
  const semantic_tags = ['header', 'nav', 'main', 'aside', 'article', 'section', 'footer',
    'h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'table', 'form', 'details',
    'menu', 'blockquote', 'code', 'progress', 'time', 'figure', 'img', 'video', 'audio'];
  return semantic_tags.includes(component);
}

// Check if parent-child relationship is allowed
function is_allowed(parent, child) {
  // Check constrains
  for (const rel of dataset_gui_relationship_constrains) {
    const parts = rel.split('_constrains_');
    if (parts.length === 2) {
      const constrained_parent = parts[0];
      const constrained_child = parts[1].replace(/_\d+_\d+$/, '');
      if (constrained_parent === parent && constrained_child === child) {
        return false;
      }
    }
  }
  return true;
}

// Add hierarchy relationships
function add_hierarchy_relationships(data) {
  const hierarchy_rules = {
    'main': ['aside', 'article'],
    'article': ['header', 'section', 'footer'],
    'section': ['ul', 'ol', 'h2', 'p'],
    'ul': ['li'],
    'ol': ['li']
  };
  
  for (const [parent, children] of Object.entries(hierarchy_rules)) {
    if (data.datatable[parent]) {
      for (const child of children) {
        if (data.datatable[child]) {
          const rel = `${parent}_contains_${child}_1_n`;
          if (!data.datamap.includes(rel)) {
            data.datamap.push(rel);
          }
        }
      }
    }
  }
}

export { resolve };
