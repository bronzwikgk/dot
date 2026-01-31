// nlp_parser_engine_v1_draft_Gem.js
// Gemini: Gem
// Version: 1.0.0
// Status: Draft

// Overview:
// This module provides a generic, domain-agnostic Natural Language Processing (NLP)
// engine. It is designed to parse natural language queries into a structured
// format by orchestrating a series of configurable pipeline stages. The engine's
// behavior is determined entirely by the "domain pack" it is initialized with.

// Purpose:
// To serve as the core parsing framework for various NL2SQL or NL-to-DSL applications.
// It separates the generic parsing workflow from the specific knowledge of any
// particular domain (like stocks, music, etc.), promoting reusability and scalability.

// Audience:
// Developers building applications that need to interpret natural language commands
// within a specific, well-defined domain.

// Problem Addressed:
// The need for a flexible NLP engine that isn't hardcoded to a single domain,
// allowing for rapid development of new parsers by simply creating new configuration files.

// Use Cases:
// - Powering a stock query UI and CLI (as the first implementation).
// - Parsing queries for a music library (e.g., "find rock songs by artists from the 90s").
// - Interpreting commands for a smart home system (e.g., "turn off living room lights in 10 minutes").

// Features:
// - Configurable Pipeline: Executes a series of abstract parsing stages.
// - Domain-Agnostic: Has no built-in knowledge of any specific domain.
// - Dynamic Schema Linking: Uses the loaded domain configuration to link terms.
// - Generic IR/AST Generation: Creates a structured representation of the query.
// - Extensible: New domains can be added by creating new domain packs.

// Benefits:
// - High reusability of the core parsing logic.
// - Rapid development of new parsers for different domains.
// - Centralized and maintainable domain knowledge in configuration files.
// - Clear separation of concerns between the engine and the domain.

// System Components:
// - `NLP_Parser_Engine` class: The main engine.
// - `constructor(domainConfig)`: Initializes the engine with a specific domain's knowledge.
// - `parse(query)`: The main method to process a query.
// - Internal helper methods for each pipeline stage, which rely on the loaded `domainConfig`.

// Edge Cases:
// - `domainConfig` is missing or malformed.
// - Query contains terms not defined in the loaded domain pack.
// - Ambiguous queries that could match multiple intents or schemas.

// Test Cases:
// - Initialize with a "stock" domain pack and parse "show tech stocks > 100".
// - Initialize with a "music" domain pack and parse "find songs by Queen".
// - Test with an empty or invalid query string.

export class NLP_Parser_Engine {
    constructor(domainConfig) {
        if (!domainConfig || !domainConfig.schema || !domainConfig.actions || !domainConfig.operators) {
            throw new Error("Invalid or incomplete domain configuration provided.");
        }
        this.domainConfig = domainConfig;
    }

    parse(query) {
        if (!query || typeof query !== 'string' || query.trim() === '') {
            throw new Error("Invalid query provided. Query must be a non-empty string.");
        }

        const intent = this._recognizeIntent(query);
        const schemaLinks = this._performSchemaLinking(query);
        const subqueries = this._decomposeQuery(query);
        const ir = this._generateIR(query, intent, schemaLinks, subqueries);
        const json = this._convertIRToJSON(ir);

        return {
            intent: intent,
            schemaLinks: schemaLinks,
            subqueries: subqueries,
            ir: ir,
            json: json,
        };
    }

    _recognizeIntent(query) {
        const lowerQuery = query.toLowerCase();
        let bestMatch = { type: 'unknown', confidence: 50 };

        for (const [actionType, actionConfig] of Object.entries(this.domainConfig.actions)) {
            for (const synonym of actionConfig.synonyms) {
                if (lowerQuery.includes(synonym)) {
                    // This is a simple confidence model; a real one would be more complex
                    bestMatch = { type: actionType, confidence: 90 };
                    break;
                }
            }
            if (bestMatch.type !== 'unknown') break;
        }
        return bestMatch;
    }

    _performSchemaLinking(query) {
        const links = [];
        const { entities, fields, values } = this.domainConfig.schema;

        // Link entities
        for (const [entityName, entityConfig] of Object.entries(entities)) {
            for (const synonym of entityConfig.synonyms) {
                if (query.toLowerCase().includes(synonym)) {
                    links.push({ term: synonym, type: 'entity', value: entityName, confidence: 95 });
                }
            }
        }

        // Link fields
        for (const [fieldName, fieldConfig] of Object.entries(fields)) {
            for (const synonym of fieldConfig.synonyms) {
                if (query.toLowerCase().includes(synonym)) {
                    links.push({ term: synonym, type: 'field', value: fieldName, confidence: 95 });
                }
            }
        }
        
        // Link specific values (like sectors in the stock domain)
        if (values) {
            for (const [valueCategory, valueMap] of Object.entries(values)) {
                for (const [valueName, valueSynonyms] of Object.entries(valueMap)) {
                     for (const synonym of valueSynonyms) {
                        if (query.toLowerCase().includes(synonym)) {
                            links.push({ term: synonym, type: 'value', category: valueCategory, value: valueName, confidence: 90 });
                        }
                    }
                }
            }
        }

        return links;
    }

    _decomposeQuery(query) {
        const subqueries = [];
        const logicalOps = this.domainConfig.operators.logical.AND.concat(this.domainConfig.operators.logical.OR);
        const regex = new RegExp(`(${logicalOps.join('|')})`, 'i');
        
        const parts = query.split(regex);

        parts.forEach(part => {
            const trimmed = part.trim();
            if (trimmed && !logicalOps.includes(trimmed.toLowerCase())) {
                subqueries.push({
                    text: trimmed,
                    type: 'condition_fragment', // A generic classification
                });
            }
        });

        return subqueries;
    }
    
    _generateIR(query, intent, schemaLinks, subqueries) {
        const ir = {
            type: 'GenericIR',
            version: '1.0',
            intent: intent.type,
            entities: [],
            filters: [],
            conditions: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                query: query,
                confidence: intent.confidence,
            },
        };

        // Populate entities from schema links
        ir.entities = schemaLinks.filter(l => l.type === 'entity').map(l => ({ type: l.value, source: l.term }));

        // Populate filters from schema links (e.g., sector = 'technology')
        const valueLinks = schemaLinks.filter(l => l.type === 'value');
        valueLinks.forEach(link => {
            ir.filters.push({
                field: link.category,
                operator: '=', // Defaulting to equals for value links
                value: link.value,
                source: link.term,
            });
        });
        
        // Crude condition extraction - this is the most domain-specific part
        // A truly generic engine would need a more abstract way to define this logic
        const comparisonSynonyms = Object.values(this.domainConfig.operators.comparison).flat().join('|');
        const regex = new RegExp(`([\w\s]+)(${comparisonSynonyms})([\$\d\w.,%]+)`, 'gi');

        let match;
        while ((match = regex.exec(query)) !== null) {
            let fieldRaw = match[1].trim();
            let operatorRaw = match[2].trim().toLowerCase();
            let valueRaw = match[3].trim();

            const linkedField = schemaLinks.find(l => l.term.toLowerCase() === fieldRaw.toLowerCase());
            const field = linkedField ? linkedField.value : fieldRaw;
            
            const operator = Object.keys(this.domainConfig.operators.comparison).find(opKey => 
                this.domainConfig.operators.comparison[opKey].includes(operatorRaw)
            ) || operatorRaw;

            ir.conditions.push({
                field: field,
                operator: operator,
                value: this._normalizeValue(valueRaw), // Normalization can be generic
                raw: match[0],
            });
        }

        return ir;
    }
    
    _convertIRToJSON(ir) {
        // This mapping is fairly generic and should work for many domains
        return {
            rule: {
                id: `rule_${Date.now()}`,
                name: `${ir.intent}_rule`,
                type: ir.intent,
                description: `Generated from: ${ir.metadata.query}`,
                createdAt: new Date().toISOString(),
                target_entities: ir.entities,
                structure: {
                    filters: ir.filters,
                    conditions: ir.conditions,
                },
                metadata: {
                    source: 'NLP_Parser_Engine',
                    version: '1.0',
                    confidence: ir.metadata.confidence,
                },
            },
        };
    }

    _normalizeValue(value) {
        if (typeof value !== 'string') return value;

        const originalValue = value.trim();
        // Remove currency, percentage, etc. for parsing, but handle them
        let numericValue = parseFloat(originalValue.replace(/[$,%]/g, ''));

        if (isNaN(numericValue)) return originalValue; // Return original string if not a number

        if (originalValue.toUpperCase().endsWith('M')) return numericValue * 1000000;
        if (originalValue.toUpperCase().endsWith('B')) return numericValue * 1000000000;
        if (originalValue.toUpperCase().endsWith('K')) return numericValue * 1000;
        if (originalValue.endsWith('%')) return numericValue / 100;

        return numericValue;
    }
    
    // Helper to format IR for display, can be used by any client
    formatIR(ir) {
        let output = `// Generic Intermediate Representation\n`;
        output += `// Generated: ${new Date(ir.metadata.generatedAt).toLocaleString()}\n\n`;

        output += `INTENT: ${ir.intent.toUpperCase()}\n`;

        if (ir.entities.length > 0) {
            output += `ENTITIES:\n`;
            ir.entities.forEach(entity => {
                output += `  - ${entity.type} (source: "${entity.source}")\n`;
            });
        }

        if (ir.filters.length > 0) {
            output += `FILTERS:\n`;
            ir.filters.forEach(filter => {
                output += `  - ${filter.field} ${filter.operator} "${filter.value}" (source: "${filter.source}")\n`;
            });
        }

        if (ir.conditions.length > 0) {
            output += `CONDITIONS:\n`;
            ir.conditions.forEach((cond, i) => {
                output += `  ${i + 1}. ${cond.field} ${cond.operator} ${cond.value} (raw: "${cond.raw}")\n`;
            });
        }

        return output;
    }
}
