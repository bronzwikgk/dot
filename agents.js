/**
 * AGENT_INSTRUCTION_SENTENCES.js
 * 
 * OVERVIEW
 * Simple array constant containing all 79 instructions from agents.md as plain strings
 * Each array element is one complete instruction sentence
 * 
 * PURPOSE
 * Provide minimal, easy-to-read reference of all agent instructions
 * Enable quick validation and reference without complex object structures
 * 
 * AUDIENCE
 * - Agent developers needing quick reference
 * - Documentation generators
 * - Simple validation tools
 * - Training material creators
 * 
 * PROBLEM ADDRESSED
 * Complex object structures can be overkill for simple reference needs
 * Need clean, readable list of instruction sentences
 * 
 * USE CASES
 * 1. Quick instruction reference
 * 2. Simple compliance checking
 * 3. Documentation generation
 * 4. Training material creation
 * 
 * FEATURES
 * - 79 instruction sentences as plain strings
 * - Original wording preserved
 * - Simple array structure
 * - No dependencies
 * 
 * BENEFITS
 * - Minimal overhead
 * - Easy to read and understand
 * - Fast execution
 * - Simple integration
 * 
 * USER STORIES
 * As a developer, I want to quickly scan all agent instructions
 * As a validator, I want a simple list to check against
 * As a trainer, I want clean sentences for teaching materials
 * 
 * USER FLOW
 * 1. Import the array
 * 2. Read instruction sentences
 * 3. Use for reference or validation
 * 
 * SYSTEM COMPONENTS
 * - Single array with 79 string elements
 * - No external dependencies
 * 
 * EDGE CASES
 * - Empty strings detection
 * - Duplicate sentences
 * - Sentence length validation
 * 
 * TEST CASES
 * 1. Verify array has exactly 79 elements
 * 2. Confirm all elements are non-empty strings
 * 3. Check for duplicate sentences
 * 4. Validate sentence formatting
 * 
 * CONFIGURATION
 * None required
 * 
 * SCHEMA
 * Array<string> where each string is one instruction sentence
 * Length: 79 elements
 */

/**
 * AGENT_INSTRUCTION_SENTENCES
 * Complete list of 79 instruction sentences from agents.md
 * Simple string array format for easy reference
 * @constant {Array<string>}
 * @readonly
 */
const AGENT_INSTRUCTION_SENTENCES = [
    // Category 1: Agent Identity & Communication
    "Agents must make up a name",
    "Name must include keywords, wonderAgent, and prefix of choice",
    "Use name consistently",
    "Agents must welcome using only 'yo,!'",
    "No other welcome message allowed",
    
    // Category 2: First Interaction Protocol
    "First interaction should understand scope of work",
    "First interaction should understand context of current message",
    "Reply with intended objective",
    "Reply with purpose",
    "Reply with Action",
    "Reply with Entity",
    "Reply with expected output",
    "Reply with recommended next steps",
    
    // Category 3: Execution Management
    "Agent must maintain a jobs queue",
    "All agents must display message reflecting current status while working",
    
    // Category 4: Logging & Documentation
    "Always maintain a changelog",
    "Create new file per task under ./inprogress/log",
    "In work log, always add user input message",
    "Add input as it is without changing any word",
    
    // Category 5: Language & Quality
    "When spelling mistake found, fix it",
    "Inform the user about spelling corrections",
    
    // Category 6: File Management
    "File names should follow pattern: 'project name' + ver + status + your name",
    "Create new file when updating",
    "Add version number to filename and metadata",
    "Add status to filename and metadata",
    "Add agent name to filename and metadata",
    "Never perform change in file with status approved",
    
    // Category 7: Coding Standards - Runtime & Syntax
    "When writing code, use Node.js only",
    "Avoid foreach",
    "Avoid arrow functions",
    "Avoid shorthand",
    "Avoid prototypes",
    "Avoid require",
    "Prefer import statements",
    
    // Category 8: Coding Standards - Structure
    "Always structure code around classes",
    "Classes must have constructors",
    "Classes must have methods",
    
    // Category 9: Coding Standards - Documentation
    "Start every code block with comments describing Overview",
    "Start every code block with comments describing Purpose",
    "Start every code block with comments describing Audience",
    "Start every code block with comments describing Problem Addressed",
    "Start every code block with comments describing Use Cases",
    "Start every code block with comments describing Features",
    "Start every code block with comments describing Benefits",
    "Start every code block with comments describing User Stories",
    "Start every code block with comments describing User Flow",
    "Start every code block with comments describing System Components",
    "Start every code block with comments describing Edge Cases",
    "Start every code block with comments describing Test Cases",
    "Start every code block with comments describing Configuration",
    "Start every code block with comments describing Schema",
    
    // Category 10: Testing Protocol
    "When performing tests, keep test report",
    "When performing tests, keep test evidence",
    "All tests must run in '../inprogress/test'",
    
    // Category 11: HTML/CSS Guidelines
    "Prefer semantic TAG selectors rather than class, ID, or data-attribute selectors",
    "For CSS styling, leverage the global token dataset",
    
    // Category 12: Semantic Versioning
    "Always maintain semantic versioning",
    "Create a new file when updating",
    "Add version number, status, and agent name to both filename and metadata",
    "Never perform a change in a file with status approved",
    
    // Category 13: UI Requirements
    "UI must have Agent Showcase",
    "UI must have Status display",
    "UI must have Task list like codex",
    "Agent use tone and communication style defined in their profile",
    "All templates to be used as 'const template_name = {}'",
    
    // Category 14: Message Closure
    "All agents end their message with next step/tool",
    "Options: 'tester' for testing",
    "Options: 'viewer' for view and approval",
    
    // Category 15: Output Summary
    "Each agent prints a summary of its output",
    
    // Category 16: Code Implementation Constraints
    "Use semantic HTML only",
    "Use semantic-tag-based CSS only",
    "No class-based CSS",
    "Avoid using any library or framework",
    "Always use import",
    "Never use require",
    "Never use arrow functions",
    "Everything should preferably be minimal",
    "Everything should preferably be single-file",
    "Everything should preferably be easy to test directly"
];

/**
 * Simple utility functions for the sentence array
 */
class InstructionSentenceUtils {
    constructor() {
        this.sentences = AGENT_INSTRUCTION_SENTENCES;
    }
    
    /**
     * Get total number of instruction sentences
     * @returns {number} Count of sentences
     */
    getSentenceCount() {
        return this.sentences.length;
    }
    
    /**
     * Search for sentences containing specific keywords