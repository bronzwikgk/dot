---
Version: v1.0.0
Status: draft
Agent: Gemini CLI
Last Updated: 2025-12-29
---

# Entity Definition
An Entity is a structured data model that represents a business object in the system, complete with schema validation, storage configuration, access policies, lifecycle hooks, and side effects.

## Core Components
* Schema - defines the structure, data types, validation rules, and relationships of the entity.
* Storage Configuration - specifies how and where the entity data is persisted (file system, database, local storage).
* Access Policy - controls who can perform CRUD operations via Role-Based Access Control (RBAC).
* Hooks - functions executed before/after entity operations (e.g., beforeCreate, afterCreate).
* Cache Hints - caching strategy for the entity data (TTL, cache keys).
* Side Effects - actions triggered by entity operations (e.g., navigation, notifications, events).
* Dataset Bindings - links to datasets used for UI rendering or data aggregation.

Entity Configuration Structure
```javascript
// Example from entity_collection_config.js
export const entityCollectionConfig = {
  id: "string",          // Unique identifier
  name: "string",        // Human-readable name
  type: "string",        // Entity type (collection, user, etc.)
  schemaRef: "path",     // Reference to schema definition
  dbSchema: object,      // Inline schema definition
  storage: { ... },      // Storage driver and path
  cacheHints: { ... },   // Caching rules
  policy: { ... },       // RBAC policies
  hooks: { ... },        // Lifecycle hooks
  sideEffects: { ... },  // Triggered actions
  datasetBindings: []    // Linked datasets
};
```
## Lifecycle
* Schema Validation - Entity data is validated against the defined schema before any operation.
* Policy Check - User role is verified against RBAC rules.
* Hook Execution - Pre-operation hooks (e.g., beforeCreate) are executed.
* Storage Operation - Data is persisted according to the storage configuration.
* Post-Operation Hooks - Post-operation hooks (e.g., afterCreate) run.
* Side Effects Trigger - Any defined side effects are executed (events, navigation, cache refresh).
* Cache Update - Cache is updated according to cacheHints.

## Behavior Principles
* All entities must have a unique id and a defined schema.
* Storage configuration must be explicitly declared and consistent across environments.
* RBAC policies should follow the principle of least privilege.
* Hooks should be pure functions where possible, idempotent, and documented for side effects.
* Cache keys should be predictable and versioned to prevent collisions.

## Dependencies
* Entity definitions rely on the schema validation system (../schema/).
* Storage drivers must be compatible with the declared driver type.
* Hooks and side effects depend on the event system and must be registered.
* Dataset bindings require corresponding dataset definitions.

## Reference Implementation
Example 1: Collection Entity
```javascript
// See: entity_collection_config.js
```
Uses localstorage driver for browser persistence

Implements RBAC with user and admin roles

Includes cache hints with 5-minute TTL

Example 2: User Register Entity
```json
// See: entity_user_register_config.json
```
Uses file system (fs) storage

Includes password hashing and stripping hooks

Triggers email notifications on user registration

## How to Create a New Entity
* Define the Schema - Create a schema file in ../schema/ with validation rules.
* Create Configuration - Make a config file (.js or .json) following the structure above.
* Implement Hooks - Write any custom hooks referenced in the configuration.
* Register Entity - Ensure the entity is registered in the system's entity registry.
* Test Thoroughly - Validate CRUD operations, policies, hooks, and side effects.
* Document - Add entity documentation and update any dataset bindings.

## FAQ
*   **Q:** What's the difference between schemaRef and dbSchema?
    **A:** schemaRef points to an external schema file; dbSchema contains the schema inline.

*   **Q:** Can entities have relationships?
    **A:** Yes, define them in dbSchema.relationships with cardinality and foreign keys.

*   **Q:** How are hooks executed?
    **A:** Hooks run synchronously in the order defined; ensure they're idempotent where possible.

*   **Q:** What happens if cache hints conflict?
    **A:** The system uses the most specific cache key; document overlaps in the entity definition.
