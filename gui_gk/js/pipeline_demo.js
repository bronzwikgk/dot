// pipeline_demo.js
// Demo of the full decompose -> resolve -> compose -> render pipeline

import { pipeline_with_validation } from './pipeline.js';

// Sample HTML to decompose
const sample_html = `
<main>
  <aside>
    <section>
      <h2>Navigation</h2>
      <nav>
        <a href="#">Home</a>
        <a href="#">About</a>
      </nav>
    </section>
  </aside>
  <article>
    <header>
      <nav>
        <menu>
          <li><a href="#">Tab 1</a></li>
          <li><a href="#">Tab 2</a></li>
        </menu>
      </nav>
    </header>
    <section>
      <section>
        <h1>My Document</h1>
        <p>This is a sample document.</p>
      </section>
      <section>
        <h2>Section 1</h2>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </section>
    </section>
    <footer>
      <p>Footer content</p>
    </footer>
  </article>
</main>
`;

// Run pipeline
console.log('Input HTML:');
console.log(sample_html);
console.log('\n--- RUNNING PIPELINE ---\n');

const result = pipeline_with_validation(sample_html);

console.log('\n--- OUTPUT HTML ---\n');
console.log(result.html);
