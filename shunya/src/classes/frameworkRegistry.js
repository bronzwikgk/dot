// Overview: Central registry that retains the ActionFramework class reference across modules.
// Purpose: Provide a lightweight accessor for logging and monitoring helpers without circular imports.
// Audience: Framework modules needing cross-references to shared static helpers.
// Problem Addressed: Circular dependency between ActionFramework and auxiliary components.
// Use Cases: Registering the framework class after definition, retrieving it for hooks or error logging.
// Features: Stores a single class reference, exposes getters/setters, handles null safety.
// Benefits: Simplifies access to shared helpers and keeps the reference consistent across modules.
// User Stories: As a module I can retrieve the framework class once it is registered.
// User Flow: ActionFramework registers itself during initialization, other modules query when needed.
// System Components: ActionFramework, ActionEntity, ActionError, cache utilities.
// Edge Cases: Queries before registration return null to avoid crashes.
// Test Cases: Ensure register/get pair works and null is returned when unregistered.
// Configuration: None required; registry works with existing runtime config.
// Schema: Not applicable.

let frameworkClass = null;

export function registerFramework(framework) {
  frameworkClass = framework;
}

export function getFrameworkClass() {
  return frameworkClass;
}
