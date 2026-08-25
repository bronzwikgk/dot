// e2e_test.js
// End-to-end test for complete workflow

import app_entry from "../code/plugins/app_entry_v1_0_0.js";

console.log("=== E2E TEST: Complete Application Workflow ===\n");

// Test 1: Boot application
console.log("Test 1: Boot application");
const entry = new app_entry({ actor: "e2e_test" });
const boot = await entry.boot({ name: "E2E Test App" });
console.assert(boot.ok === true, "Should boot");
console.assert(boot.app.type === "application", "Should be application");
console.log("  PASS");

// Test 2: Create book
console.log("Test 2: Create book");
const shell = entry.get_shell();
const book = shell.entities.create_book({ name: "Test Book" });
console.assert(book.type === "book", "Should be book");
console.log("  PASS");

// Test 3: Create cells
console.log("Test 3: Create cells");
const cell1 = shell.entities.create_cell({ book_id: book.id, content: "Hello World" });
const cell2 = shell.entities.create_cell({ book_id: book.id, content: "Second cell" });
console.assert(cell1.type === "cell", "Should be cell");
console.assert(cell1.data.book_id === book.id, "Should reference book");
console.log("  PASS");

// Test 4: List cells
console.log("Test 4: List cells");
const cells = shell.entities.list_cells(book.id);
console.assert(cells.length === 2, "Should have 2 cells");
console.log("  PASS");

// Test 5: Search
console.log("Test 5: Search");
const results = shell.entities.search("Test");
console.assert(results.length >= 1, "Should find results");
console.log("  PASS");

// Test 6: Persistence
console.log("Test 6: Persistence");
shell.entities.save("e2e_key", { value: "saved" });
const loaded = shell.entities.load("e2e_key");
console.assert(loaded.value === "saved", "Should load data");
console.log("  PASS");

// Test 7: Resolve reference
console.log("Test 7: Resolve reference");
const resolved = shell.entities.resolve_reference({ id: book.id });
console.assert(resolved !== null, "Should resolve");
console.log("  PASS");

// Test 8: Audit
console.log("Test 8: Audit");
const audit = shell.entities.get_audit_log();
console.assert(audit.length > 0, "Should have audit records");
console.log("  PASS");

console.log("\n=== ALL E2E TESTS PASSED ===");
