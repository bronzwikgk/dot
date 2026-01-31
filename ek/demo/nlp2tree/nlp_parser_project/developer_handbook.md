# Developer Handbook: NLP Parser Engine

**Version:** 1.0.0
**Audience:** Software developers looking to integrate with, extend, or understand the internal workings of the NLP Parser Engine.

---

## 1. Core Engine Architecture

The heart of the project is the **`NLP_Parser_Engine`**, a domain-agnostic class found in `src/engine/nlp_parser_engine.js`. Its design emphasizes a strict separation between the generic parsing workflow and domain-specific knowledge.

### 1.1. Design Principles

*   **Stateless:** The engine instance does not retain state between `parse()` calls.
*   **Configuration-Driven:** The engine is "unaware" of any specific domain. Its entire behavior is dictated by the `domainConfig` object passed to its constructor.
*   **Synchronous Execution:** The `parse()` method is synchronous and self-contained. Asynchronous operations like loading configurations are handled by the client application *before* initializing the engine.

### 1.2. API Specification

#### `new NLP_Parser_Engine(domainConfig)`

The constructor expects a single argument, `domainConfig`, which is an object containing three properties: `schema`, `actions`, and `operators`. An error will be thrown if this object is not provided or is missing key properties.

#### `.parse(query)`

This is the primary method for processing a query.

*   **Argument:** `query` (string) - The natural language query to be parsed.
*   **Returns:** An `object` containing the complete result of the parsing pipeline:
    ```javascript
    {
      intent: { type: 'screen', confidence: 90 },
      schemaLinks: [ { term: 'price', type: 'field', value: 'price', confidence: 95 } ],
      subqueries: [ { text: 'price > 100', type: 'condition_fragment' } ],
      ir: { /* ... Generic Intermediate Representation object ... */ },
      json: { /* ... Final structured JSON Rule object ... */ }
    }
    ```
*   **Throws:** Throws an `Error` if the query is null, empty, or not a string.

### 1.3. Internal Parsing Pipeline

When `parse()` is called, it executes the following internal methods in sequence:

1.  **`_recognizeIntent(query)`:** Uses the `domainConfig.actions` synonyms to find the best-matching intent.
2.  **`_performSchemaLinking(query)`:** Scans the query for keywords matching synonyms from `domainConfig.schema` (entities, fields, and values) and creates an array of "links."
3.  **`_decomposeQuery(query)`:** A rudimentary stage that splits the query by logical operators defined in `domainConfig.operators`.
4.  **`_generateIR(...)`:** Constructs a generic Intermediate Representation (IR) tree based on the intent and links found. This is the most complex stage, involving regex-based condition extraction.
5.  **`_convertIRToJSON(...)`:** Transforms the generic IR into the final, machine-readable JSON output format.

---

## 2. Programmatic Integration

The engine is designed to be imported as an ES module into any JavaScript application.

### 2.1. Node.js Integration Example

This pattern is used by `src/app/cli.js`.

```javascript
import { NLP_Parser_Engine } from './src/engine/nlp_parser_engine.js';
import fs from 'fs/promises';
import path from 'path';

// 1. Asynchronously load the domain configuration from files
async function loadDomain(domainName) {
    const domainPath = path.join('domains', domainName);
    const [schema, actions, operators] = await Promise.all([
        fs.readFile(path.join(domainPath, 'schema.json'), 'utf-8').then(JSON.parse),
        fs.readFile(path.join(domainPath, 'actions.json'), 'utf-8').then(JSON.parse),
        fs.readFile(path.join(domainPath, 'operators.json'), 'utf-8').then(JSON.parse)
    ]);
    return { schema, actions, operators };
}

// 2. Initialize and use the engine
async function run() {
    const query = "find stocks with rsi < 30";
    const domainConfig = await loadDomain('stock_queries');
    
    const engine = new NLP_Parser_Engine(domainConfig);
    const result = engine.parse(query);

    console.log(JSON.stringify(result.json, null, 2));
}

run();
```

### 2.2. Browser Integration Example

This pattern is used by `src/app/ui_app.js`.

```javascript
import { NLP_Parser_Engine } from './src/engine/nlp_parser_engine.js';

// 1. Asynchronously load the domain configuration using fetch
async function loadDomain(domainName) {
    const domainPath = `../domains/${domainName}`; // Relative path from public/
    const [schema, actions, operators] = await Promise.all([
        fetch(`${domainPath}/schema.json`).then(res => res.json()),
        fetch(`${domainPath}/actions.json`).then(res => res.json()),
        fetch(`${domainPath}/operators.json`).then(res => res.json())
    ]);
    return { schema, actions, operators };
}

// 2. Initialize and use the engine
async function initializeUI() {
    const domainConfig = await loadDomain('stock_queries');
    const engine = new NLP_Parser_Engine(domainConfig);

    document.getElementById('parse-button').addEventListener('click', () => {
        const query = document.getElementById('query-input').value;
        const result = engine.parse(query);
        // Update DOM with result.json
    });
}

initializeUI();
```

---

## 3. Extending and Upgrading the System

The architecture is designed to be extensible.

### 3.1. Improving the Parsing Logic

The current condition extractor (`_generateIR`) uses regular expressions. This is the primary area for improvement. A developer could upgrade the engine by replacing this logic with a more robust parsing library (like `nearley.js` or `chevrotain`) to build a true Abstract Syntax Tree (AST). This would allow for proper handling of nested conditions, operator precedence, and more complex grammatical structures.

### 3.2. Adding a New Pipeline Stage

To add a new stage (e.g., a "Validation" stage), a developer would:
1.  Create a new internal method in `NLP_Parser_Engine`, e.g., `_validateIR(ir)`.
2.  Call this new method from within the main `parse()` method at the appropriate point in the sequence.
3.  The validation logic could be driven by new rules defined in the domain pack (e.g., a `validation_rules.json`).

### 3.3. Enabling Pluggable Domain Logic

A powerful upgrade would be to allow a domain pack to provide its own custom logic.

**Recommended Pattern:**
1.  Allow a domain pack to optionally include a `custom_rules.js` file.
2.  The client application (CLI/UI) would be responsible for dynamically importing this file if it exists.
    ```javascript
    // In client app
    let customRules = {};
    try {
        customRules = await import(`../domains/${domainName}/custom_rules.js`);
    } catch (e) {
        // File doesn't exist, which is fine.
    }
    const engine = new NLP_Parser_Engine(domainConfig, customRules);
    ```
3.  The `NLP_Parser_Engine` constructor would be modified to accept this optional `customRules` object.
4.  Inside the engine, you could then check if a custom implementation exists before falling back to the default.
    ```javascript
    // Inside NLP_Parser_Engine
    _normalizeValue(value) {
        // Use the domain-specific function if it was provided, otherwise use the default.
        if (this.customRules.normalizeValue) {
            return this.customRules.normalizeValue(value);
        }
        // ... default normalization logic ...
    }
    ```
This would allow a domain like "stocks" to provide its specific logic for handling values like "1M" and "5%", while a different domain could use the engine's default, more generic normalization.

---

## 4. Project Directory and Code Guide

*   `/src/engine/`: Contains the core, reusable framework code. Should not contain any domain-specific logic.
*   `/src/app/`: Contains client applications that *use* the engine. These are responsible for loading domain packs.
*   `/domains/`: Contains the domain-specific knowledge configurations. Each subdirectory is a self-contained "dictionary."
*   `/public/`: Contains static assets for the web UI, which is served as a simple static site.
