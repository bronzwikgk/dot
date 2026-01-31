// cli_v2_draft_Gem.js
// Gemini: Gem
// Version: 2.0.0
// Status: Draft

// Overview:
// This is a command-line interface (CLI) application that demonstrates how to use the
// generic NLP_Parser_Engine. It dynamically loads a "domain pack" from the file system,
// initializes the engine with that domain's configuration, and then processes a
// user-provided query from the command line.

// Purpose:
// To serve as a client for the NLP_Parser_Engine, showcasing its domain-agnostic
// nature and its ability to be configured at runtime.

// Audience:
// Developers who want to test the engine or use it in a headless/scripted environment.

// Problem Addressed:
// The need for a concrete example of how to load a domain pack and use the
// generic engine to parse queries for that specific domain.

// Use Cases:
// - Running the "stock_queries" parser from the command line.
// - Quickly testing new or modified domain pack configurations without a UI.
// - Integrating the NLP parser into automated scripts.

// Features:
// - Dynamically loads a domain pack from a specified directory.
// - Initializes the NLP_Parser_Engine with the loaded configuration.
// - Parses a query provided as a command-line argument.
// - Outputs the structured results to the console.

// Benefits:
// - Clearly demonstrates the intended use of the generic engine.
// - Confirms the successful separation of the engine from the domain configuration.
// - Provides a useful tool for testing and development.

// System Components:
// - Node.js `fs/promises` for asynchronous file reading.
// - Node.js `path` for constructing file paths.
// - `NLP_Parser_Engine` imported from the engine module.
// - `process.argv` for command-line argument handling.

// Edge Cases:
// - Domain pack directory or files not found.
// - Invalid JSON in configuration files.
// - No query provided by the user.

// Test Cases:
// - `node src/app/cli.js stock_queries "show tech stocks with volume > 10M"`
// - `node src/app/cli.js stock_queries "alert when rsi < 30"`
// - Running the command with an invalid domain name or no query.

import { NLP_Parser_Engine } from '../engine/nlp_parser_engine.js';
import fs from 'fs/promises';
import path from 'path';

// --- Domain Loader ---
async function loadDomainConfig(domainName) {
    const domainPath = path.join('domains', domainName);
    try {
        const schemaPath = path.join(domainPath, 'schema.json');
        const actionsPath = path.join(domainPath, 'actions.json');
        const operatorsPath = path.join(domainPath, 'operators.json');

        const [schema, actions, operators] = await Promise.all([
            fs.readFile(schemaPath, 'utf-8').then(JSON.parse),
            fs.readFile(actionsPath, 'utf-8').then(JSON.parse),
            fs.readFile(operatorsPath, 'utf-8').then(JSON.parse)
        ]);

        return { schema, actions, operators };

    } catch (error) {
        console.error(`Error: Failed to load domain pack "${domainName}".`);
        if (error.code === 'ENOENT') {
            console.error(`Reason: Directory or configuration file not found at path: ${error.path}`);
        } else if (error instanceof SyntaxError) {
             console.error(`Reason: Invalid JSON in one of the configuration files.`);
        } else {
            console.error('An unexpected error occurred:', error);
        }
        return null;
    }
}


// --- Main CLI Logic ---
async function main() {
    const args = process.argv.slice(2);
    const domainName = args[0];
    const query = args[1];

    if (!domainName || !query) {
        console.log("Usage: node src/app/cli.js <domain_name> \"<query>\"");
        console.log("Example: node src/app/cli.js stock_queries \"find tech stocks with price > $500\"");
        process.exit(1);
    }
    
    console.log(`Loading domain: "${domainName}"...`);
    const domainConfig = await loadDomainConfig(domainName);
    
    if (!domainConfig) {
        process.exit(1); // Exit if domain loading failed
    }
    
    console.log("Domain loaded successfully.");

    try {
        const engine = new NLP_Parser_Engine(domainConfig);
        const result = engine.parse(query);

        console.log("\n--- NLP Parser Engine Output ---");
        console.log("Query:", query);

        console.log("\n--- Intermediate Representation (Generic IR) ---");
        console.log(engine.formatIR(result.ir));

        console.log("\n--- Final Executable Rule (JSON) ---");
        console.log(JSON.stringify(result.json, null, 2));

    } catch (error) {
        console.error(`\nError parsing query: ${error.message}`);
        process.exit(1);
    }
}

main();
