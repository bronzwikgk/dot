// ui_app_v1_draft_Gem.js
// Gemini: Gem
// Version: 1.0.0
// Status: Draft

// Overview:
// This script provides the client-side application logic for the NLP Parser Engine web UI.
// It is responsible for dynamically loading a domain pack, initializing the generic
// NLP_Parser_Engine, handling all user interactions, and rendering the results and
// pipeline visualizations in the DOM.

// Purpose:
// To act as the "application layer" for the web UI, connecting the user interface
// defined in index.html with the reusable parsing engine.

// Audience:
// End-users of the web application and frontend developers working on the UI.

// Problem Addressed:
// The need for a dedicated script to manage the UI state, user events, and data flow
// between the browser and the parsing engine, separate from the core engine logic.

// Use Cases:
// - Fetching and loading domain configurations on page load.
// - Handling the "Parse Query" button click to process user input.
// - Updating the UI to display the IR, JSON, and pipeline simulation.
// - Managing tab navigation.

// Features:
// - Asynchronous initialization to load domain configurations.
// - Event-driven architecture for user interactions.
// - Renders parsing results and simulates the agent pipeline for user feedback.
// - Clear separation from the HTML structure and the core parsing engine.

// Benefits:
// - Decouples UI logic from the core engine, improving maintainability.
// - Provides a clean and modern client-side application structure using ES modules.
// - Demonstrates how a client application consumes the generic NLP_Parser_Engine.

// System Components:
// - `NLP_Parser_Engine` (imported from the engine module).
// - `fetch` API for loading JSON configuration files.
// - DOM manipulation functions for updating the UI.
// - Event listeners for button clicks and other interactions.

// Edge Cases:
// - Failure to load domain configuration files (e.g., network error, 404).
// - Errors thrown by the parsing engine during query processing.
// - User interaction before the application has finished initializing.

// Test Cases:
// - Verify the loading indicator disappears and the main content appears on successful init.
// - Enter a query and click "Parse," then check that all output panels are updated.
// - Switch between the "Query Parser" and "Agent Pipeline" tabs.

import { NLP_Parser_Engine } from '../engine/nlp_parser_engine.js';

const DOM = {
    domainName: document.getElementById('domain-name'),
    loadingIndicator: document.getElementById('loading-indicator'),
    mainContent: document.getElementById('main-content'),
    nlQuery: document.getElementById('nlQuery'),
    parseBtn: document.getElementById('parse-btn'),
    irOutput: document.getElementById('irOutput'),
    jsonOutput: document.getElementById('jsonOutput'),
    tabBtnQuery: document.getElementById('tab-btn-query'),
    tabBtnPipeline: document.getElementById('tab-btn-pipeline'),
    queryTab: document.getElementById('query-tab'),
    pipelineTab: document.getElementById('pipeline-tab'),
};

let engine; // To hold the initialized parser engine instance

// --- Domain Loader for Browser ---
async function loadDomainConfig(domainName) {
    // In a browser, paths are relative to the HTML file
    const domainPath = `../domains/${domainName}`;
    try {
        const [schema, actions, operators] = await Promise.all([
            fetch(`${domainPath}/schema.json`).then(res => res.json()),
            fetch(`${domainPath}/actions.json`).then(res => res.json()),
            fetch(`${domainPath}/operators.json`).then(res => res.json())
        ]);
        return { schema, actions, operators };
    } catch (error) {
        console.error(`Failed to load domain pack "${domainName}":`, error);
        DOM.loadingIndicator.textContent = `Error: Could not load domain "${domainName}". Check console for details.`;
        return null;
    }
}

// --- UI Interaction Handlers ---
function switchTab(tabName) {
    const isQueryTab = tabName === 'query';
    DOM.tabBtnQuery.classList.toggle('active', isQueryTab);
    DOM.queryTab.classList.toggle('active', isQueryTab);
    
    DOM.tabBtnPipeline.classList.toggle('active', !isQueryTab);
    DOM.pipelineTab.classList.toggle('active', !isQueryTab);
}

async function handleParseQuery() {
    const query = DOM.nlQuery.value.trim();
    if (!query) {
        alert('Please enter a query.');
        return;
    }

    try {
        const result = engine.parse(query);
        DOM.irOutput.textContent = engine.formatIR(result.ir);
        DOM.jsonOutput.textContent = JSON.stringify(result.json, null, 2);

        await runPipelineVisualization(result);
        switchTab('pipeline');

    } catch (error) {
        alert(`Parsing Error: ${error.message}`);
        console.error("Parsing Error:", error);
    }
}

// --- Pipeline Visualization ---
function resetPipelineVisualization() {
    ['intentAgent', 'schemaAgent', 'decomposeAgent', 'synthesisAgent'].forEach(id => {
        const agentEl = document.getElementById(id);
        if (agentEl) {
            agentEl.querySelector('.status-badge').className = 'status-badge status-pending';
            agentEl.querySelector('.agent-output').textContent = '...';
        }
    });
     document.getElementById('intentAgent').querySelector('.agent-output').textContent = 'Waiting for query...';
}

function updateAgent(agentId, status, message) {
    return new Promise(resolve => {
        setTimeout(() => {
            const agentEl = document.getElementById(agentId);
            if (agentEl) {
                agentEl.querySelector('.status-badge').className = `status-badge status-${status}`;
                agentEl.querySelector('.agent-output').textContent = message;
            }
            resolve();
        }, 600); // Shorter delay for a snappier UI feel
    });
}

async function runPipelineVisualization(parseResult) {
    resetPipelineVisualization();
    const { intent, schemaLinks, subqueries } = parseResult;

    await updateAgent('intentAgent', 'processing', 'Analyzing intent...');
    await updateAgent('intentAgent', 'success', `Intent: ${intent.type} (Confidence: ${intent.confidence}%)`);

    await updateAgent('schemaAgent', 'processing', 'Linking to schema...');
    const linkedTerms = schemaLinks.map(l => l.term).join(', ') || 'None';
    await updateAgent('schemaAgent', 'success', `Linked ${schemaLinks.length} terms: ${linkedTerms}`);

    await updateAgent('decomposeAgent', 'processing', 'Decomposing query...');
    await updateAgent('decomposeAgent', 'success', `Decomposed into ${subqueries.length} fragments.`);

    await updateAgent('synthesisAgent', 'processing', 'Generating IR and JSON Rule...');
    await updateAgent('synthesisAgent', 'success', 'Successfully generated final rule.');
}


// --- Application Initialization ---
async function initializeApp() {
    const domainName = "stock_queries"; // Hardcoded for this UI
    DOM.domainName.textContent = domainName;

    const domainConfig = await loadDomainConfig(domainName);
    if (!domainConfig) return; // Stop if loading failed

    try {
        engine = new NLP_Parser_Engine(domainConfig);
        console.log("NLP Parser Engine Initialized Successfully.");
    } catch (error) {
        DOM.loadingIndicator.textContent = `Error: Could not initialize parser engine. ${error.message}`;
        return;
    }
    
    // Setup event listeners
    DOM.parseBtn.addEventListener('click', handleParseQuery);
    DOM.tabBtnQuery.addEventListener('click', () => switchTab('query'));
    DOM.tabBtnPipeline.addEventListener('click', () => switchTab('pipeline'));
    
    // Show main content
    DOM.loadingIndicator.style.display = 'none';
    DOM.mainContent.style.display = 'block';
    DOM.nlQuery.value = 'Show me tech stocks with price > $100 and volume > 1M';
}

// --- Run the App ---
document.addEventListener('DOMContentLoaded', initializeApp);
