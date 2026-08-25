// pipeline.js
// Full pipeline: decompose -> resolve -> compose -> render

import { decompose } from './decompose.js';
import { resolve } from './resolve.js';
import { compose_from_data } from './compose.js';
import { render } from './render.js';

// Full pipeline: HTML -> Data -> Schema -> HTML
function pipeline(html_string) {
  console.log('=== PIPELINE START ===');
  
  // Step 1: Decompose HTML to data
  console.log('1. Decomposing HTML...');
  const decomposed = decompose(html_string);
  console.log(`   Dataset: ${decomposed.dataset.length} components`);
  console.log(`   Datamap: ${decomposed.datamap.length} relationships`);
  console.log(`   DataTable: ${Object.keys(decomposed.datatable).length} entries`);
  
  // Step 2: Resolve and validate
  console.log('2. Resolving data...');
  const resolved = resolve(decomposed);
  console.log(`   Valid: ${resolved.valid}`);
  console.log(`   Issues: ${resolved.issues.length}`);
  
  // Step 3: Compose schema
  console.log('3. Composing schema...');
  const schema = compose_from_data(resolved.resolved);
  console.log(`   Root: ${schema.type}`);
  console.log(`   Children: ${schema.children.length}`);
  
  // Step 4: Render HTML
  console.log('4. Rendering HTML...');
  const html = render(schema);
  console.log(`   Output: ${html.length} characters`);
  
  console.log('=== PIPELINE END ===');
  
  return {
    decomposed: resolved.resolved,
    schema,
    html,
    issues: resolved.issues
  };
}

// Pipeline with validation
function pipeline_with_validation(html_string) {
  const result = pipeline(html_string);
  
  console.log('\n=== VALIDATION ===');
  console.log(`Decomposed: ${result.decomposed.dataset.length} components`);
  console.log(`Schema valid: ${result.schema.type !== undefined}`);
  console.log(`HTML generated: ${result.html.length > 0}`);
  console.log(`Issues: ${result.issues.length}`);
  
  if (result.issues.length > 0) {
    console.log('\nIssues:');
    for (const issue of result.issues) {
      console.log(`  - ${issue}`);
    }
  }
  
  return result;
}

export { pipeline, pipeline_with_validation };
