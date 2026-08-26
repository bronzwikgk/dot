// render.js
// TRULY GENERIC render - all logic from datasets, datamaps, data tables

import { datatable_component_attributes } from '../dataset/datatable_gui_components_v1.js';

// ===== GENERIC RENDER =====
// Takes any schema, looks up everything from data, outputs HTML
// NO hardcoded component logic

function render(schema) {
  if (!schema || !schema.type) return '';
  
  // 1. Look up component in data table
  const attrs = datatable_component_attributes[schema.type];
  
  // 2. Get tag from data table (or use type as tag)
  const tag = attrs?.tag || schema.type;
  
  // 3. Build opening tag with attributes from data table
  let html = `<${tag}`;
  
  // Add id from data table or schema
  if (schema.id || attrs?.id) {
    html += ` id="${schema.id || attrs.id}"`;
  }
  
  // Add all attributes from data table
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'tag' || key === 'text' || key === 'content') continue;
      if (key === 'items' || key === 'columns' || key === 'rows') continue;
      html += ` ${key}="${value}"`;
    }
  }
  
  // Add schema attributes (override data table)
  if (schema.attributes) {
    for (const [key, value] of Object.entries(schema.attributes)) {
      html += ` ${key}="${value}"`;
    }
  }
  
  html += '>';
  
  // 4. Add content from data table or schema
  if (attrs?.text) {
    html += attrs.text;
  } else if (attrs?.label) {
    html += attrs.label;
  } else if (attrs?.h1) {
    html += `<h1>${attrs.h1}</h1>`;
  } else if (attrs?.h2) {
    html += `<h2>${attrs.h2}</h2>`;
  } else if (attrs?.h3) {
    html += `<h3>${attrs.h3}</h3>`;
  } else if (attrs?.p) {
    html += `<p>${attrs.p}</p>`;
  } else if (schema.content) {
    html += schema.content;
  }
  
  // 5. Add children from schema
  if (schema.children) {
    for (const child of schema.children) {
      html += render(child);
    }
  }
  
  // 6. Add items from data table (for lists)
  if (attrs?.items) {
    for (const item of attrs.items) {
      if (typeof item === 'string') {
        html += `<li>${item}</li>`;
      } else if (item.text) {
        html += `<li${item.state ? ` data-state="${item.state}"` : ''}>${item.text}</li>`;
      }
    }
  }
  
  // 7. Add table rows from data table
  if (attrs?.rows) {
    for (const row of attrs.rows) {
      html += '<tr>';
      for (const cell of row) {
        html += `<td>${cell}</td>`;
      }
      html += '</tr>';
    }
  }
  
  html += `</${tag}>`;
  return html;
}

// ===== COMPOSE =====
// Builds component tree from schema using only data

function compose(schema, parent = null) {
  if (!schema || !schema.type) return { valid: false, errors: ['Invalid'] };
  
  const errors = [];
  const attrs = datatable_component_attributes[schema.type];
  
  if (!attrs) {
    errors.push(`Unknown: ${schema.type}`);
  }
  
  const children = [];
  if (schema.children) {
    for (const child of schema.children) {
      const result = compose(child, schema.type);
      if (result.valid) children.push(result.component);
      else errors.push(...result.errors);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    component: { type: schema.type, id: schema.id, attributes: schema.attributes, content: schema.content, children }
  };
}

// ===== COMPOSE AND RENDER =====
function compose_and_render(schema) {
  const result = compose(schema);
  if (!result.valid) return { html: '', errors: result.errors };
  return { html: render(result.component), errors: [] };
}

export { render, compose, compose_and_render };
