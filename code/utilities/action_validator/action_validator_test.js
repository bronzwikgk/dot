// action_validator_test.js
// Tests for unified action_validator

import action_validator from "../action_validator/action_validator_v1_0_0.js";

console.log("=== ACTION VALIDATOR TESTS ===\n");

const v = new action_validator({
  lifecycle_statuses: ["draft", "active", "archived"],
  cell_statuses: ["draft", "rendered", "failed"],
  operation_names: ["create", "read", "update", "delete"],
  relationship_types: ["depends_on", "contains", "implements"],
  banned_words: ["admin", "root", "system"],
  schema_field_types: ["text", "number", "boolean", "list", "map", "choice", "reference", "timestamp", "markup"],
  datatype_names: ["text", "number", "boolean"],
  intent_names: ["create", "read", "update", "delete"],
  layout_names: ["jupyter", "notion", "vscode", "diagram"],
  pipeline_names: ["etl", "ml", "report"],
  pipeline_stage_names: ["ingest", "transform", "load"],
  cell_types: ["markdown", "code", "pipeline"],
  semantic_element_names: ["paragraph", "heading", "list", "table"],
  template_ids: ["blog", "document", "application"],
  aria_role_names: ["button", "link", "navigation"],
  gui_action_names: ["click", "hover", "scroll"],
  panel_names: ["editor", "preview", "properties"],
  flow_node_types: ["start", "end", "process", "decision"],
  export_formats: ["json", "csv", "markdown"],
  import_formats: ["json", "csv", "markdown"],
  diagnostic_levels: ["info", "warning", "error"]
});

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL: ${name} - ${err.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || "Assertion failed");
}

// === SCHEMA VALIDATION TESTS ===
console.log("Schema Validation:");

test("validate_schema - valid data", () => {
  const result = v.validate_schema({ name: "test" }, { required: ["name"], properties: { name: { type: "string" } } });
  assert(result.valid === true, "Should be valid");
});

test("validate_schema - missing required", () => {
  const result = v.validate_schema({}, { required: ["name"] });
  assert(result.valid === false, "Should be invalid");
  assert(result.errors.length === 1, "Should have 1 error");
});

test("validate_schema - wrong type", () => {
  const result = v.validate_schema({ count: "not_a_number" }, { properties: { count: { type: "number" } } });
  assert(result.valid === false, "Should be invalid");
});

test("validate_schema - valid email format", () => {
  const result = v.validate_schema({ email: "test@example.com" }, { properties: { email: { type: "string", format: "email" } } });
  assert(result.valid === true, "Should be valid");
});

test("validate_schema - invalid email format", () => {
  const result = v.validate_schema({ email: "not-an-email" }, { properties: { email: { type: "string", format: "email" } } });
  assert(result.valid === false, "Should be invalid");
});

test("validate_schema - enum valid", () => {
  const result = v.validate_schema({ status: "active" }, { properties: { status: { enum: ["active", "inactive"] } } });
  assert(result.valid === true, "Should be valid");
});

test("validate_schema - enum invalid", () => {
  const result = v.validate_schema({ status: "unknown" }, { properties: { status: { enum: ["active", "inactive"] } } });
  assert(result.valid === false, "Should be invalid");
});

test("validate_schema - min_length", () => {
  const result = v.validate_schema({ name: "ab" }, { properties: { name: { type: "string", min_length: 3 } } });
  assert(result.valid === false, "Should be invalid");
});

test("validate_schema - max_length", () => {
  const result = v.validate_schema({ name: "very_long_name" }, { properties: { name: { type: "string", max_length: 5 } } });
  assert(result.valid === false, "Should be invalid");
});

// === RULE EVALUATION TESTS ===
console.log("\nRule Evaluation:");

test("evaluate_rule - simple equality", () => {
  const result = v.evaluate_rule({ left: "{{x}}", operator: "==", right: 5 }, { x: 5 });
  assert(result === true, "Should be true");
});

test("evaluate_rule - simple inequality", () => {
  const result = v.evaluate_rule({ left: "{{x}}", operator: "!=", right: 5 }, { x: 3 });
  assert(result === true, "Should be true");
});

test("evaluate_rule - AND conditions", () => {
  const result = v.evaluate_rule({ conditions: [{ left: "{{x}}", operator: "==", right: 5 }, { left: "{{y}}", operator: "==", right: 10 }] }, { x: 5, y: 10 });
  assert(result === true, "Should be true");
});

test("evaluate_rule - OR conditions", () => {
  const result = v.evaluate_rule({ type: "or", conditions: [{ left: "{{x}}", operator: "==", right: 5 }, { left: "{{y}}", operator: "==", right: 10 }] }, { x: 3, y: 10 });
  assert(result === true, "Should be true");
});

test("evaluate_rule - NOT conditions", () => {
  const result = v.evaluate_rule({ type: "not", conditions: [{ left: "{{x}}", operator: "==", right: 5 }] }, { x: 3 });
  assert(result === true, "Should be true");
});

// === PATH RESOLUTION TESTS ===
console.log("\nPath Resolution:");

test("resolve_value - simple path", () => {
  const result = v.resolve_value("{{name}}", { name: "test" });
  assert(result === "test", "Should resolve to 'test'");
});

test("resolve_value - nested path", () => {
  const result = v.resolve_value("{{user.name}}", { user: { name: "John" } });
  assert(result === "John", "Should resolve to 'John'");
});

test("resolve_value - non-string", () => {
  const result = v.resolve_value(42, {});
  assert(result === 42, "Should return 42");
});

test("resolve_value - plain string", () => {
  const result = v.resolve_value("hello", {});
  assert(result === "hello", "Should return 'hello'");
});

// === ENTITY VALIDATION TESTS ===
console.log("\nEntity Validation:");

test("validate_entity - valid entity", () => {
  const result = v.validate_entity({ id: "test_entity", type: "document", name: "Test" });
  assert(result.ok === true, "Should be valid");
});

test("validate_entity - invalid id format", () => {
  const result = v.validate_entity({ id: "InvalidID", type: "document", name: "Test" });
  assert(result.ok === false, "Should be invalid");
});

test("validate_entity - banned word", () => {
  const result = v.validate_entity({ id: "admin_entity", type: "document", name: "Test" });
  assert(result.ok === false, "Should be invalid");
});

test("validate_entity - invalid status", () => {
  const result = v.validate_entity({ id: "test_entity", type: "document", name: "Test", status: "invalid_status" });
  assert(result.ok === false, "Should be invalid");
});

test("validate_entity - valid status", () => {
  const result = v.validate_entity({ id: "test_entity", type: "document", name: "Test", status: "active" });
  assert(result.ok === true, "Should be valid");
});

// === RELATIONSHIP VALIDATION TESTS ===
console.log("\nRelationship Validation:");

test("validate_relationship - valid", () => {
  const result = v.validate_relationship({ type: "depends_on", to: "other_entity" });
  assert(result.ok === true, "Should be valid");
});

test("validate_relationship - invalid type", () => {
  const result = v.validate_relationship({ type: "invalid_type", to: "other_entity" });
  assert(result.ok === false, "Should be invalid");
});

test("validate_relationship - missing target", () => {
  const result = v.validate_relationship({ type: "depends_on" });
  assert(result.ok === false, "Should be invalid");
});

test("validate_relationship - banned word", () => {
  const result = v.validate_relationship({ type: "depends_on", to: "admin_entity" });
  assert(result.ok === false, "Should be invalid");
});

test("validate_relationship_graph - no cycles", () => {
  const result = v.validate_relationship_graph([
    { id: "a", relationships: [{ type: "depends_on", to: "b" }] },
    { id: "b" }
  ]);
  assert(result.ok === true, "Should be valid");
  assert(result.cycles.length === 0, "Should have no cycles");
});

test("validate_relationship_graph - cycle detected", () => {
  const result = v.validate_relationship_graph([
    { id: "a", relationships: [{ type: "depends_on", to: "b" }] },
    { id: "b", relationships: [{ type: "depends_on", to: "a" }] }
  ]);
  assert(result.ok === false, "Should be invalid");
  assert(result.cycles.length === 1, "Should have 1 cycle");
});

// === DATASET VALIDATION TESTS ===
console.log("\nDataset Validation:");

test("validate_approved_word - valid", () => {
  const result = v.validate_approved_word("datatype_names", "text");
  assert(result.ok === true, "Should be valid");
});

test("validate_approved_word - invalid", () => {
  const result = v.validate_approved_word("datatype_names", "invalid_type");
  assert(result.ok === false, "Should be invalid");
});

test("validate_dataset_group - valid", () => {
  const result = v.validate_dataset_group("datatype_names", ["text", "number", "boolean"]);
  assert(result.ok === true, "Should be valid");
});

test("validate_dataset_group - duplicate", () => {
  const result = v.validate_dataset_group("datatype_names", ["text", "text"]);
  assert(result.ok === false, "Should be invalid");
});

// === NAME VALIDATION TESTS ===
console.log("\nName Validation:");

test("is_snake_name - valid", () => {
  assert(v.is_snake_name("test_name") === true, "Should be valid");
});

test("is_snake_name - invalid", () => {
  assert(v.is_snake_name("TestName") === false, "Should be invalid");
});

test("is_snake_path - valid", () => {
  assert(v.is_snake_path("test.path.name") === true, "Should be valid");
});

test("is_snake_path - invalid", () => {
  assert(v.is_snake_path("Test.Path") === false, "Should be invalid");
});

test("validate_banned_word - clean", () => {
  const result = v.validate_banned_word("hello");
  assert(result.ok === true, "Should be valid");
});

test("validate_banned_word - banned", () => {
  const result = v.validate_banned_word("admin");
  assert(result.ok === false, "Should be invalid");
});

// === REGISTRATION TESTS ===
console.log("\nRegistration:");

test("register - success", () => {
  const result = v.register("manifest_1", "manifest", { entries: [{ type: "route", name: "home", active: true }] });
  assert(result.ok === true, "Should be ok");
});

test("validate_stale - no stale", () => {
  const result = v.validate_stale("manifest_1");
  assert(result.ok === true, "Should be ok");
});

test("validate_stale - with stale", () => {
  v.register("manifest_2", "manifest", { entries: [{ type: "route", name: "home", active: false }] });
  const result = v.validate_stale("manifest_2");
  assert(result.ok === false, "Should be invalid");
  assert(result.count === 1, "Should have 1 stale");
});

test("validate_duplicates - no duplicates", () => {
  const result = v.validate_duplicates("manifest_1");
  assert(result.ok === true, "Should be ok");
});

test("validate_duplicates - with duplicates", () => {
  v.register("manifest_3", "manifest", { entries: [{ type: "route", name: "home" }, { type: "route", name: "home" }] });
  const result = v.validate_duplicates("manifest_3");
  assert(result.ok === false, "Should be invalid");
  assert(result.count === 1, "Should have 1 duplicate");
});

test("validate_policy_rules - valid", () => {
  v.register("policy_1", "policy", { enabled: true, rules: [{ type: "required", field: "name" }] });
  const result = v.validate_policy_rules("policy_1", { name: "test" });
  assert(result.ok === true, "Should be ok");
});

test("validate_policy_rules - missing required", () => {
  const result = v.validate_policy_rules("policy_1", {});
  assert(result.ok === false, "Should be invalid");
});

test("validate_policy_rules - pattern match", () => {
  v.register("policy_2", "policy", { enabled: true, rules: [{ type: "pattern", field: "email", pattern: "^[a-z]+@[a-z]+$" }] });
  const result = v.validate_policy_rules("policy_2", { email: "test@example.com" });
  assert(result.ok === false, "Should be invalid");
});

test("validate_policy_rules - pattern valid", () => {
  const result = v.validate_policy_rules("policy_2", { email: "test@examplecom" });
  assert(result.ok === true, "Should be ok");
});

test("list_registrations - all", () => {
  const result = v.list_registrations();
  assert(result.length >= 5, "Should have at least 5 registrations");
});

test("list_registrations - by type", () => {
  const result = v.list_registrations("policy");
  assert(result.length >= 2, "Should have at least 2 policies");
});

// === ASSERT METHODS ===
console.log("\nAssert Methods:");

test("assert_valid - valid entity", () => {
  const result = v.assert_valid({ id: "test_entity", type: "document", name: "Test" });
  assert(result.ok === true, "Should be valid");
});

test("assert_valid - invalid entity throws", () => {
  let threw = false;
  try {
    v.assert_valid({ id: "InvalidID" });
  } catch (err) {
    threw = true;
  }
  assert(threw === true, "Should throw");
});

test("assert_relationship_type - valid", () => {
  const result = v.assert_relationship_type("depends_on");
  assert(result.ok === true, "Should be valid");
});

test("assert_relationship_type - invalid throws", () => {
  let threw = false;
  try {
    v.assert_relationship_type("invalid_type");
  } catch (err) {
    threw = true;
  }
  assert(threw === true, "Should throw");
});

test("assert_status - valid", () => {
  const result = v.assert_status("active");
  assert(result.ok === true, "Should be valid");
});

test("assert_status - invalid throws", () => {
  let threw = false;
  try {
    v.assert_status("invalid");
  } catch (err) {
    threw = true;
  }
  assert(threw === true, "Should throw");
});

console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
