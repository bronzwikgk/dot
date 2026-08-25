# Agent Open Code - System Documentation

## Objective

To build and maintain a shared entity-first application model with a modular, testable, and governable runtime system for creating, validating, and managing entity-based applications.

## Purpose

The system provides a foundation for entity-centric application development where:
- Entities are first-class citizens with lifecycle, relationships, and policies
- Code is organized into reusable utilities and plugins
- Validation and governance are built into the core
- Test generation and code inspection are automated
- Workflow execution supports both AST and DAG patterns

## Requirements

### Core Requirements
1. **Entity-First Model**: All application components are represented as entities
2. **Governed Lifecycle**: Entities have approved statuses and transitions
3. **Relationship Management**: Entities can form typed relationships with dependency tracking
4. **Validation-Driven**: Input validation, schema enforcement, and vocabulary control
5. **Test Automation**: Generate baseline tests from code inspection
6. **Workflow Orchestration**: Support both step-based and dependency-based execution

### Technical Requirements
1. **Modular Architecture**: Plugins and utilities are separate concerns
2. **In-Memory Operation**: All state is process-local unless drivers are injected
3. **Deterministic Behavior**: Predictable outputs for same inputs
4. **ESM Compatibility**: Support modern JavaScript module system
5. **Backward Compatibility**: Preserve existing APIs when updating

## Domains

### 1. Entity Management Domain
- **Components**: action_entity, entity_registry, entity_validator
- **Focus**: CRUD operations, lifecycle, relationships, policies, contracts
- **Scope**: Entity creation, validation, storage, and graph management

### 2. Workflow Execution Domain
- **Components**: runner, entity_runner
- **Focus**: Plan execution, DAG scheduling, condition evaluation
- **Scope**: Step-based and dependency-based workflow orchestration

### 3. Data Processing Domain
- **Components**: collection, vector_math, stats
- **Focus**: Array operations, statistical calculations, vector comparisons
- **Scope**: Data manipulation, analysis, and comparison

### 4. Text Processing Domain
- **Components**: text, markdown_pipeline
- **Focus**: Text escaping, tokenization, markdown parsing
- **Scope**: Content processing and document manipulation

### 5. Testing and Inspection Domain
- **Components**: code_inspector, signature_inference, test_generation
- **Focus**: Code analysis, type inference, test creation
- **Scope**: Automated test generation and code quality

### 6. Observability Domain
- **Components**: logger, metrics
- **Focus**: Logging, counting, timing, gauging
- **Scope**: Runtime monitoring and diagnostics

## Use Cases

### Entity System Use Cases
1. **Application Modeling**: Create app entities with routes, views, components
2. **Data Management**: Store and query entity records with relationships
3. **Workflow Automation**: Execute multi-step entity processing pipelines
4. **Graph Validation**: Ensure entity relationships form valid dependency graphs
5. **Policy Enforcement**: Apply business rules to entity operations

### Workflow Use Cases
1. **Data Processing Pipelines**: Extract, transform, load operations
2. **Conditional Automation**: Decision-based workflow routing
3. **Nested Subflows**: Compose smaller workflows into larger ones
4. **Task Scheduling**: Execute tasks in dependency order
5. **Action Budgeting**: Control resource usage across workflows

### Testing Use Cases
1. **Smoke Testing**: Generate basic functional tests
2. **Regression Testing**: Create snapshot-based regression checks
3. **Edge Safety Testing**: Validate error handling behavior
4. **Code Quality Assurance**: Inspect code structure and patterns
5. **Type Inference**: Suggest parameter and return types

## Features

### Entity Features
- **CRUD Operations**: Create, read, update, delete, query
- **Batch Operations**: Process multiple entities at once
- **Lifecycle Management**: Draft, active, deprecated, archived states
- **Relationship Tracking**: Link entities with typed relationships
- **Graph Validation**: Detect cycles and missing dependencies
- **Policy Management**: Attach business rules to entities
- **Contract Management**: Define entity capabilities
- **Version Control**: Track entity changes with semantic versioning
- **Import/Export**: Serialize and deserialize entities

### Workflow Features
- **AST Plans**: Step-based execution with conditions and jumps
- **DAG Plans**: Dependency-based task execution
- **Nested Subflows**: Compose workflows hierarchically
- **Action Budgets**: Control resource usage
- **Depth Limits**: Prevent infinite nesting
- **Session Tracking**: Monitor active workflow execution
- **Input Resolution**: Resolve references between steps/tasks
- **Condition Evaluation**: Gate execution based on rules

### Testing Features
- **Code Inspection**: Analyze JavaScript source structure
- **Signature Inference**: Suggest function parameter types
- **Test Generation**: Create node:test files automatically
- **Template Banks**: Reusable test patterns
- **Sample Banks**: Test data for different types
- **Edge Case Detection**: Identify error-prone code paths

### Utility Features
- **Collection Operations**: Array manipulation and data splitting
- **Vector Math**: Euclidean distance and cosine similarity
- **Statistics**: Mean, standard deviation, confidence intervals
- **Text Processing**: Escaping, tokenization, normalization
- **Markdown Pipeline**: Parse and compose markdown documents

## Conventions

### Naming Conventions
1. **File Naming**: `code_shared_[component]_v[version]_draft.js`
2. **Class Naming**: PascalCase (e.g., `action_entity`, `collection_util`)
3. **Method Naming**: snake_case (e.g., `validate_entity`, `get_relationships`)
4. **Variable Naming**: snake_case (e.g., `entity_id`, `relationship_type`)
5. **Constant Naming**: UPPER_SNAKE_CASE for dataset exports

### Code Structure Conventions
1. **ESM Modules**: Use `export`/`import` syntax
2. **Class-Based**: Utilities and plugins are class-based
3. **Compatibility Aliases**: Maintain backward compatibility
4. **Runtime Contracts**: Document behavior guarantees
5. **Known Limits**: Document current limitations

### Documentation Conventions
1. **Per-File Docs**: Each module has a documentation file
2. **Standard Sections**: File, What It Is, What It Does, When To Use It, Runtime Contract, Known Limits
3. **Test Examples**: Include verification commands
4. **Update Instructions**: Document how to update safely

### Testing Conventions
1. **Smoke Checks**: Verify basic functionality
2. **Focused Checks**: Test specific behaviors
3. **Node ESM Import**: Use `node --input-type=module` for testing
4. **Assertion Library**: Use `node:assert/strict`
5. **Console Output**: Report test results to console

## Policy

### Code Quality Policy
1. **Deterministic Behavior**: All utilities must produce same output for same input
2. **Null Safety**: Handle null/undefined inputs gracefully
3. **Immutability**: Avoid mutating input arrays/objects
4. **Error Handling**: Return structured error results, not exceptions
5. **Backward Compatibility**: Preserve public APIs

### Security Policy
1. **No Secrets**: Never commit secrets or keys
2. **Input Validation**: Validate all external inputs
3. **Vocabulary Control**: Reject banned words in names
4. **Sandboxed Execution**: Limit JavaScript execution scope
5. **Resource Limits**: Enforce action budgets and depth limits

### Governance Policy
1. **Entity Validation**: All entities must pass validation
2. **Relationship Validation**: Relationships must use approved types
3. **Lifecycle Compliance**: Entities must follow status transitions
4. **Graph Integrity**: No cycles allowed in dependency graphs
5. **Policy Enforcement**: Business rules must be attached and evaluated

## Scope

### In Scope
1. **Core Utilities**: Collection, text, stats, vector_math
2. **Entity System**: Action entity, registry, validator, parser, reasoner
3. **Workflow System**: Runner, entity runner
4. **Testing System**: Code inspector, signature inference, test generation
5. **Observability**: Logger, metrics
6. **Datasets**: Validation words, UI words, behavior datasets

### Out of Scope
1. **Distributed Systems**: Multi-process coordination
2. **Persistent Storage**: Database integration
3. **Network Operations**: HTTP servers, WebSocket connections
4. **UI Framework**: User interface components
5. **Deployment**: Containerization, cloud deployment
6. **Security Auditing**: Penetration testing, vulnerability scanning

## Constraints

### Technical Constraints
1. **JavaScript/Node.js**: Runtime environment
2. **ESM Only**: No CommonJS support
3. **In-Memory State**: All state is process-local
4. **No External Dependencies**: Utilities are dependency-free
5. **Limited Schema Validation**: Basic type checking only

### Architectural Constraints
1. **Single Process**: No multi-threading or clustering
2. **Synchronous Execution**: DAG tasks run sequentially
3. **Shallow Caching**: Cache entries are shallow copies
4. **Basic Querying**: Exact equality matching only
5. **Simple Tokenization**: ASCII-oriented text processing

### Business Constraints
1. **Draft Status**: All modules are in draft status
2. **Limited Testing**: Smoke checks, not full test suites
3. **Documentation Gaps**: Some features undocumented
4. **No Migration Tools**: Manual updates required
5. **No Versioning Strategy**: No semantic versioning enforcement

## Context

### System Context
The system is part of a larger application development platform that emphasizes:
- **Entity-First Architecture**: Everything is an entity
- **Governed Development**: Business rules are first-class
- **Automated Testing**: Tests are generated from code inspection
- **Modular Design**: Separation of concerns
- **Runtime Safety**: Limits and validation at runtime

### Technical Context
- **Runtime**: Node.js with ESM modules
- **Language**: JavaScript (no TypeScript)
- **Testing**: node:test with assert/strict
- **Build**: No build step required
- **Dependencies**: None external

### Operational Context
- **Deployment**: Single-process applications
- **State Management**: In-memory with optional driver injection
- **Monitoring**: Basic logging and metrics
- **Scaling**: Horizontal scaling through multiple processes
- **Persistence**: Optional through injected drivers

## Knowledge

### Core Concepts
1. **Entity**: A governed record with type, name, status, relationships, policies
2. **Relationship**: A typed link between entities with attributes
3. **Plugin**: An active capability with business logic
4. **Utility**: A reusable helper function or class
5. **Dataset**: Approved vocabulary and behavior mappings
6. **Plan**: A declared workflow with steps or tasks
7. **Runner**: An execution engine for plans
8. **Validator**: A schema and rule evaluation system

### Design Patterns
1. **Registry Pattern**: Centralized type and trait registration
2. **Strategy Pattern**: Injected drivers for storage and ID generation
3. **Observer Pattern**: Logger and metrics for monitoring
4. **Chain of Responsibility**: Pipeline stages for processing
5. **Composite Pattern**: Nested subflows for workflow composition

### Architectural Patterns
1. **Plugin Architecture**: Separate concerns into plugins and utilities
2. **Dependency Injection**: Pass dependencies through constructors
3. **Interface Segregation**: Small, focused APIs
4. **Fail-Safe Design**: Return structured errors, not exceptions
5. **Deterministic Execution**: Predictable behavior for testing

### Domain Knowledge
1. **Entity Lifecycle**: Draft → Active → Deprecated → Archived
2. **Relationship Types**: Approved vocabulary for entity links
3. **Workflow Patterns**: Sequential, parallel, conditional, nested
4. **Testing Strategies**: Smoke, regression, edge safety, determinism
5. **Validation Approaches**: Schema, rule evaluation, vocabulary control

## Implementation Guidelines

### Adding New Features
1. **Document First**: Create documentation before code
2. **Define Contracts**: Specify runtime behavior guarantees
3. **Test Thoroughly**: Include smoke checks and edge cases
4. **Maintain Compatibility**: Preserve existing public APIs
5. **Update Logs**: Document changes in maintenance logs

### Updating Existing Features
1. **Check Contracts**: Ensure behavior guarantees are preserved
2. **Test Both Paths**: Verify old and new behavior
3. **Update Documentation**: Reflect changes in docs
4. **Version Appropriately**: Use semantic versioning when ready
5. **Communicate Changes**: Update logs and commit messages

### Quality Assurance
1. **Run Tests**: Execute all smoke checks
2. **Verify Contracts**: Ensure runtime guarantees hold
3. **Check Edge Cases**: Test null, empty, and boundary conditions
4. **Validate Documentation**: Ensure docs match implementation
5. **Review Dependencies**: Check for unintended coupling

## Future Considerations

### Short-Term
1. **Unit Tests**: Add comprehensive test suites
2. **Schema Catalog**: Expand validation based on schema contracts
3. **Dataset Registry**: Add owner, count, and validation status
4. **Error Handling**: Improve error messages and recovery
5. **Performance**: Optimize critical paths

### Medium-Term
1. **TypeScript Support**: Add type definitions
2. **Persistent Storage**: Add database drivers
3. **Parallel Execution**: Support concurrent workflow steps
4. **Security Hardening**: Add input sanitization and access control
5. **Monitoring Integration**: Connect to external observability tools

### Long-Term
1. **Distributed Workflows**: Multi-process coordination
2. **Versioned Entities**: Full semantic versioning support
3. **Schema Evolution**: Automated migration tools
4. **Performance Monitoring**: Detailed metrics and profiling
5. **Security Auditing**: Comprehensive audit logging

---

*Document generated from codebase analysis on 2026-08-25*
*Last updated: 2026-08-25*