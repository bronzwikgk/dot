// utilities_test.js
// Unit tests for all utilities

import id_generator from "../code/utilities/id_generator_v1_0_0.js";
import validator from "../code/utilities/validator_v1_0_0.js";
import registry from "../code/utilities/registry_v1_0_0.js";
import vector_math from "../code/utilities/vector_math_v1_0_0.js";
import entity_parser from "../code/utilities/entity_parser_v1_0_0.js";

// Test 1: ID Generator
console.log("Test 1: ID Generator");
const idGen = new id_generator();
const id1 = idGen.generate("book");
const id2 = idGen.generate("book");
console.assert(id1 !== id2, "IDs should be unique");
console.assert(id1.startsWith("book_"), "ID should start with type");
console.log("  PASS");

// Test 2: Validator
console.log("Test 2: Validator");
const val = new validator();
const valid = val.validate_entity({ id: "1", type: "book", name: "test" });
console.assert(valid.ok === true, "Should validate");
const invalid = val.validate_entity({ });
console.assert(invalid.ok === false, "Should fail");
console.log("  PASS");

// Test 3: Registry
console.log("Test 3: Registry");
const reg = new registry();
reg.register_type("book", { description: "Notebook" });
const bookType = reg.get_type("book");
console.assert(bookType !== null, "Should find type");
console.assert(reg.list_types().length === 1, "Should have 1 type");
console.log("  PASS");

// Test 4: Vector Math
console.log("Test 4: Vector Math");
const vm = new vector_math();
const dist = vm.distance([1, 2, 3], [4, 5, 6]);
console.assert(dist > 0, "Distance should be positive");
const sim = vm.similarity([1, 0], [1, 0]);
console.assert(sim === 1, "Similar vectors should have similarity 1");
console.log("  PASS");

// Test 5: Entity Parser
console.log("Test 5: Entity Parser");
const parser = new entity_parser();
const parsed = parser.parse("create book My Book");
console.assert(parsed.action === "create", "Action should be create");
console.assert(parsed.args.length === 2, "Should have 2 args");
console.log("  PASS");

console.log("\n=== ALL UTILITIES TESTS PASSED ===");
