// validate.js
// Validation script for datasets, relationships, and data tables

import { 
  dataset_gui_page_types,
  dataset_gui_layout_types,
  dataset_gui_component_types,
  dataset_gui_hierarchy_levels,
  dataset_gui_semantic_elements
} from '../dataset/dataset_gui_framework_v1.js';

import {
  dataset_gui_relationship_contains,
  dataset_gui_relationship_uses_component,
  dataset_gui_relationship_renders,
  dataset_gui_relationship_belongs_to_category,
  dataset_gui_relationship_constrains,
  dataset_gui_relationship_requires_id
} from '../dataset/dataset_gui_relationships_v1.js';

import { datatable_component_attributes } from '../dataset/datatable_gui_components_v1.js';

// Parse relationship string
function parse_rel(rel) {
  const parts = rel.split('_');
  const cardinality = parts[parts.length - 1];
  const without_card = parts.slice(0, -1).join('_');
  
  const types = ['contains', 'uses_component', 'renders', 'belongs_to_category', 'constrains', 'requires_id', 'supports_layout', 'styled_by'];
  for (const type of types) {
    if (without_card.includes(type)) {
      const [source, target] = without_card.split(type);
      return { source, relationship: type, target, cardinality };
    }
  }
  return null;
}

// Validate all datasets
function validate_datasets() {
  console.log('=== DATASET VALIDATION ===');
  const checks = [
    { name: 'page_types', data: dataset_gui_page_types, count: 5 },
    { name: 'layout_types', data: dataset_gui_layout_types, count: 6 },
    { name: 'component_types', data: dataset_gui_component_types, count: 6 },
    { name: 'hierarchy_levels', data: dataset_gui_hierarchy_levels, count: 5 },
    { name: 'semantic_elements', data: dataset_gui_semantic_elements, count: 20 }
  ];
  
  let allOk = true;
  for (const check of checks) {
    const ok = check.data && check.data.length >= check.count;
    console.log(`  ${check.name}: ${ok ? 'OK' : 'FAIL'} (${check.data?.length || 0} items)`);
    if (!ok) allOk = false;
  }
  return allOk;
}

// Validate all relationships
function validate_relationships() {
  console.log('\n=== RELATIONSHIP VALIDATION ===');
  const rels = [
    { name: 'contains', data: dataset_gui_relationship_contains },
    { name: 'uses_component', data: dataset_gui_relationship_uses_component },
    { name: 'renders', data: dataset_gui_relationship_renders },
    { name: 'belongs_to_category', data: dataset_gui_relationship_belongs_to_category },
    { name: 'constrains', data: dataset_gui_relationship_constrains },
    { name: 'requires_id', data: dataset_gui_relationship_requires_id }
  ];
  
  let allOk = true;
  for (const rel of rels) {
    const count = rel.data?.length || 0;
    const ok = count > 0;
    console.log(`  ${rel.name}: ${ok ? 'OK' : 'FAIL'} (${count} relationships)`);
    if (!ok) allOk = false;
  }
  return allOk;
}

// Validate data tables
function validate_data_tables() {
  console.log('\n=== DATA TABLE VALIDATION ===');
  const count = Object.keys(datatable_component_attributes).length;
  const ok = count > 0;
  console.log(`  component_attributes: ${ok ? 'OK' : 'FAIL'} (${count} entries)`);
  return ok;
}

// Validate HTML structure
function validate_html() {
  console.log('\n=== HTML STRUCTURE VALIDATION ===');
  
  // Check for forbidden elements
  const divs = document.querySelectorAll('div, span');
  const classes = document.querySelectorAll('[class]');
  const inlineStyles = document.querySelectorAll('[style]');
  
  console.log(`  div/span: ${divs.length === 0 ? 'OK' : 'FAIL'} (${divs.length} found)`);
  console.log(`  classes: ${classes.length === 0 ? 'OK' : 'FAIL'} (${classes.length} found)`);
  console.log(`  inline styles: ${inlineStyles.length === 0 ? 'OK' : 'FAIL'} (${inlineStyles.length} found)`);
  
  // Check data attributes
  const components = document.querySelectorAll('[data-component]');
  const ids = document.querySelectorAll('[data-id]');
  console.log(`  data-component: ${components.length > 0 ? 'OK' : 'FAIL'} (${components.length} elements)`);
  console.log(`  data-id: ${ids.length > 0 ? 'OK' : 'FAIL'} (${ids.length} elements)`);
  
  // Check hierarchy
  const hasMain = document.querySelector('main') !== null;
  const hasArticle = document.querySelector('article') !== null;
  const hasHeader = document.querySelector('header') !== null;
  const hasFooter = document.querySelector('footer') !== null;
  const hasAside = document.querySelector('aside') !== null;
  
  console.log(`  main: ${hasMain ? 'OK' : 'FAIL'}`);
  console.log(`  article: ${hasArticle ? 'OK' : 'FAIL'}`);
  console.log(`  header: ${hasHeader ? 'OK' : 'FAIL'}`);
  console.log(`  footer: ${hasFooter ? 'OK' : 'FAIL'}`);
  console.log(`  aside: ${hasAside ? 'OK' : 'FAIL'}`);
  
  return divs.length === 0 && classes.length === 0 && components.length > 0;
}

// Run all validations
function validate_all() {
  console.log('========================================');
  console.log('AN APP FRAMEWORK VALIDATION');
  console.log('========================================\n');
  
  const results = {
    datasets: validate_datasets(),
    relationships: validate_relationships(),
    data_tables: validate_data_tables(),
    html: validate_html()
  };
  
  console.log('\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  
  const allOk = Object.values(results).every(v => v);
  for (const [name, ok] of Object.entries(results)) {
    console.log(`  ${name}: ${ok ? 'PASS' : 'FAIL'}`);
  }
  
  console.log(`\nOverall: ${allOk ? 'ALL PASSED' : 'SOME FAILED'}`);
  return allOk;
}

export { validate_all, validate_datasets, validate_relationships, validate_data_tables, validate_html };
