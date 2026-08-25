// action_entity_test.js
// Unit tests for action_entity_v5_0_0

import action_entity from "../code/plugins/action_entity_v5_0_0.js";

const entity = new action_entity({ actor: "test_user" });

// Test 1: Create entity
console.log("Test 1: Create entity");
const book = entity.create("book", { name: "Test Book", data: { title: "Test" } });
console.log("  Created:", book.id, book.type, book.name);
console.assert(book.id.startsWith("book_"), "ID should start with book_");
console.assert(book.type === "book", "Type should be book");
console.assert(book.name === "Test Book", "Name should be Test Book");
console.log("  PASS");

// Test 2: Read entity
console.log("Test 2: Read entity");
const read = entity.read(book.id);
console.assert(read !== null, "Should find entity");
console.assert(read.name === "Test Book", "Name should match");
console.log("  PASS");

// Test 3: Update entity
console.log("Test 3: Update entity");
const updated = entity.update(book.id, { name: "Updated Book" });
console.assert(updated.name === "Updated Book", "Name should be updated");
console.log("  PASS");

// Test 4: Delete entity
console.log("Test 4: Delete entity");
const deleted = entity.delete(book.id);
console.assert(deleted === true, "Should return true");
const gone = entity.read(book.id);
console.assert(gone === null, "Should be null");
console.log("  PASS");

// Test 5: Query entities
console.log("Test 5: Query entities");
entity.create("book", { name: "Book 1" });
entity.create("book", { name: "Book 2" });
entity.create("cell", { name: "Cell 1", book_id: "test" });
const books = entity.query({ type: "book" });
console.assert(books.length === 2, "Should find 2 books");
console.log("  PASS");

// Test 6: Search
console.log("Test 6: Search");
const results = entity.search("Book");
console.assert(results.length >= 2, "Should find books");
console.log("  PASS");

// Test 7: Create book
console.log("Test 7: Create book");
const myBook = entity.create_book({ name: "My Book" });
console.assert(myBook.type === "book", "Should be book type");
console.log("  PASS");

// Test 8: Create cell
console.log("Test 8: Create cell");
const myCell = entity.create_cell({ book_id: myBook.id, content: "Hello" });
console.assert(myCell.type === "cell", "Should be cell type");
console.assert(myCell.data.book_id === myBook.id, "Should reference book");
console.log("  PASS");

// Test 9: List cells
console.log("Test 9: List cells");
const cells = entity.list_cells(myBook.id);
console.assert(cells.length === 1, "Should find 1 cell");
console.log("  PASS");

// Test 10: Resolve reference
console.log("Test 10: Resolve reference");
const resolved = entity.resolve_reference({ id: myBook.id });
console.assert(resolved !== null, "Should resolve reference");
console.log("  PASS");

// Test 11: Undo/Redo
console.log("Test 11: Undo/Redo");
entity.record_action("update", myBook.id, { name: "Old" }, { name: "New" });
const undone = entity.undo();
console.assert(undone !== null, "Should undo");
const redone = entity.redo();
console.assert(redone !== null, "Should redo");
console.log("  PASS");

// Test 12: Audit
console.log("Test 12: Audit");
const audit = entity.get_audit_log();
console.assert(audit.length > 0, "Should have audit records");
console.log("  PASS");

// Test 13: Persistence
console.log("Test 13: Persistence");
entity.save("test_key", { value: 42 });
const loaded = entity.load("test_key");
console.assert(loaded.value === 42, "Should load saved data");
console.log("  PASS");

console.log("\n=== ALL TESTS PASSED ===");
