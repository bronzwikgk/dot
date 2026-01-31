# NLP Parser Engine - Project Design and Specification

**Version:** 1.0.0
**Date:** 31 January 2026
**Author:** Gemini

---

## 1. Overview

### 1.1. Project Philosophy

This project provides a generic, domain-agnostic Natural Language Processing (NLP) engine. The core philosophy is to separate the parsing **logic** from the domain **knowledge**. The engine itself is a reusable framework that understands how to execute a parsing pipeline. The specific "personality" or knowledge of a domain (e.g., stocks, music, calendar events) is provided at runtime through external configuration files called **Domain Packs**.

This design allows for rapid development of new parsers for different domains without modifying the core engine code.

### 1.2. Core Components

The system is comprised of three primary components:

1.  **The NLP Parser Engine:** The heart of the framework. A JavaScript class that accepts a domain configuration and uses it to parse natural language queries into structured JSON.
2.  **Domain Packs:** The "brains" of the operation. A set of structured JSON files that define the vocabulary, entities, actions, and rules for a specific domain.
3.  **Applications (Clients):** The consumers of the engine. These can be a Command-Line Interface (CLI), a web-based User Interface (UI), a server-side API, or any other application that needs to interpret natural language.

---

## 2. Architecture

### 2.1. System Data Flow

The data flow is consistent across all client applications:

1.  **Initialization:**
    *   The client application (e.g., the CLI or Web UI) loads a **Domain Pack** from the file system.
    *   The client instantiates the **NLP Parser Engine**, passing the loaded domain configuration into its constructor.

2.  **Execution:**
    *   The user provides a natural language query to the client application.
    *   The client calls the engine's `parse(query)` method.
    *   The engine executes its internal pipeline using the domain configuration to interpret the query.
    *   The engine returns a structured result (including the final JSON) to the client.

3.  **Presentation:**
    *   The client application presents the structured result to the user (e.g., printing to the console or displaying in a browser).

![Architectural Flow](https://i.imgur.com/example.png)  <!-- Placeholder for a real diagram -->

### 2.2. Directory Structure

The project is organized to reflect this separation of concerns:

```
/nlp_parser_project/
|
├── src/
│   ├── engine/
│   │   └── nlp_parser_engine.js      // The generic engine
│   └── app/
│       ├── cli.js                    // CLI application logic
│       └── ui_app.js                 // Web UI application logic
│
├── domains/
│   └── stock_queries/
│       ├── schema.json
│       ├── actions.json
│       └── operators.json
│
└── public/
    └── index.html                    // The web UI shell
```

---

## 3. Component Specifications

### 3.1. NLP Parser Engine (`nlp_parser_engine.js`)

*   **Purpose:** To provide a domain-agnostic pipeline for parsing natural language.
*   **Class:** `NLP_Parser_Engine`
*   **API:**
    *   `constructor(domainConfig)`: Initializes the engine. Expects a `domainConfig` object containing `schema`, `actions`, and `operators`. Throws an error if the config is invalid.
    *   `parse(query)`: The main method. Takes a string query and returns a result object containing the `intent`, `ir` (Intermediate Representation), and final `json`.
*   **Internal Pipeline Stages:**
    1.  **Intent Recognition:** Identifies the primary goal of the query (e.g., `screen`, `alert`) based on `actions.json`.
    2.  **Schema Linking:** Identifies and tags known words in the query (entities, fields, values) based on `schema.json`.
    3.  **Decomposition:** Breaks the query into logical fragments based on `operators.json`.
    4.  **IR Generation:** Creates a generic, structured Intermediate Representation of the query's meaning.
    5.  **JSON Synthesis:** Converts the IR into a final, machine-readable JSON object.

### 3.2. Domain Packs

*   **Purpose:** To provide the specific knowledge required to parse queries for a single domain. A domain pack is a directory containing the following configuration files.

#### 3.2.1. `schema.json`
Defines the objects, properties, and values within the domain.

*   `entities`: The primary nouns of the domain.
    *   `"stock": { "synonyms": ["stocks", "shares"] }`
*   `fields`: The properties of the entities.
    *   `"price": { "type": "number", "synonyms": ["price", "cost"] }`
*   `values`: Specific categorical values and their synonyms.
    *   `"sector": { "technology": ["tech", "software"] }`

#### 3.2.2. `actions.json`
Defines the user's possible intents. The key is the action's canonical name, and `synonyms` are keywords that trigger it.

*   `"screen": { "synonyms": ["find", "show", "list"] }`

#### 3.2.3. `operators.json`
Defines logical and comparison operators and their natural language equivalents.

*   `"comparison": { ">": ["greater than", "above"] }`
*   `"logical": { "AND": ["and", "&"] }`

### 3.3. Applications (Clients)

#### 3.3.1. CLI (`cli.js`)
*   **Purpose:** A command-line tool for developers to test the engine or use it in scripts.
*   **Usage:** `node src/app/cli.js <domain_name> "<query>"`
*   **Functionality:**
    1.  Loads the specified domain pack.
    2.  Initializes the engine.
    3.  Parses the query from the command-line arguments.
    4.  Prints the formatted IR and JSON output to the console.

#### 3.3.2. Web UI (`index.html` & `ui_app.js`)
*   **Purpose:** A rich, interactive web interface for demonstrating the parser's capabilities.
*   **Functionality:**
    1.  On load, it fetches the `stock_queries` domain pack.
    2.  Initializes the engine.
    3.  Provides a text area for user input.
    4.  On "Parse Query", it calls the engine and displays the IR and JSON results.
    5.  It includes a "pipeline" tab to visualize the internal stages the engine went through, providing educational insight.

---

## 4. How to Extend the Framework

Creating a parser for a new domain is straightforward:

1.  **Create a New Domain Directory:** Inside the `domains/` folder, create a new directory (e.g., `music_library`).
2.  **Define the Domain:** Create the three configuration files (`schema.json`, `actions.json`, `operators.json`) inside your new directory.
    *   **`schema.json`:** Define entities like `song` and `artist`, and fields like `genre`, `release_year`.
    *   **`actions.json`:** Define actions like `find` and `play`.
    *   **`operators.json`:** Define relevant operators.
3.  **Use the New Domain:** Run the CLI or modify the Web UI to load your new domain pack.
    *   `node src/app/cli.js music_library "find rock songs from the 90s"`

The core engine `nlp_parser_engine.js` requires no modification.

---

## 5. Setup and Usage

### 5.1. Prerequisites

*   **Node.js:** Required to run the CLI application and for dependency management.

### 5.2. Using the Command-Line Interface (CLI)

1.  Navigate to the project root in your terminal:
    ```bash
    cd D:\gk\atmas\agent_workspace\gem\nlp_parser_project
    ```
2.  Run the CLI with the desired domain and query:
    ```bash
    node src/app/cli.js stock_queries "find tech stocks where volume is greater than 10M"
    ```

### 5.3. Using the Web User Interface (UI)

1.  Open the `public/index.html` file directly in a modern web browser.
2.  The application will load the `stock_queries` domain by default.
3.  Enter a query into the text box and click "Parse Query".

---

## 6. Future Improvements (Roadmap)

*   **Advanced Parsing Logic:** Replace the current regex-based condition extractor in the engine with a more robust solution that can build a true Abstract Syntax Tree (AST), allowing for nested conditions (e.g., `(A and B) or C`).
*   **Domain Pack Validation:** Implement a schema for the domain pack files themselves, so the engine can validate a configuration when it's loaded.
*   **Pluggable Domain Logic:** Allow domain packs to include an optional `rules.js` file, which could provide domain-specific functions (like custom value normalization) that the engine can dynamically use if present.
*   **Error Recovery:** Improve the engine's ability to handle ambiguous queries or terms not found in the schema, potentially by suggesting corrections.
