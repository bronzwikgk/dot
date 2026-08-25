import test from "node:test";
import assert from "node:assert/strict";
import { book_cell_operations } from "../../code/utilities/code_shared_book_cell_operations_v4_0_0_draft.js";

test("book_cell_operations creates book and ordered cells as entities", async () => {
  const operations = new book_cell_operations({ clock: () => "2026-08-25T00:00:00.000Z" });
  const book = await operations.create_book({ id: "book_1", name: "book_1" });
  const first = await operations.create_cell({ id: "cell_1", book_id: book.data.id, cell_type: "markdown", content: "hello" });
  const second = await operations.create_cell({ id: "cell_2", book_id: book.data.id, cell_type: "natural_language", content: "summarize this" });

  assert.equal(book.data.type, "book");
  assert.equal(first.data.type, "cell");
  assert.equal(first.data.data.order, 0);
  assert.equal(second.data.data.order, 1);
  assert.equal(operations.audit_records.length, 3);
});

test("book_cell_operations updates moves removes and stabilizes order", async () => {
  const operations = new book_cell_operations({ clock: () => "2026-08-25T00:00:00.000Z" });
  const book = await operations.create_book({ id: "book_2", name: "book_2" });
  await operations.create_cell({ id: "cell_a", book_id: book.data.id, content: "a" });
  await operations.create_cell({ id: "cell_b", book_id: book.data.id, content: "b" });
  await operations.update_cell({ id: "cell_b", content: "updated" });
  const moved = await operations.move_cell({ id: "cell_b", order: 0 });
  await operations.remove_cell({ id: "cell_b" });
  const remaining = await operations.cells_for_book(book.data.id);

  assert.deepEqual(moved.data.cell_ids, ["cell_b", "cell_a"]);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].data.order, 0);
});

test("book_cell_operations executes cells with code confirmation guard", async () => {
  const operations = new book_cell_operations({ clock: () => "2026-08-25T00:00:00.000Z" });
  const book = await operations.create_book({ id: "book_3", name: "book_3" });
  await operations.create_cell({ id: "cell_markdown", book_id: book.data.id, cell_type: "markdown", content: "# Title" });
  await operations.create_cell({ id: "cell_code", book_id: book.data.id, cell_type: "code", content: "1 + 1" });

  const markdown = await operations.execute_cell({ id: "cell_markdown" });
  const blocked = await operations.execute_cell({ id: "cell_code" });
  const confirmed = await operations.execute_cell({ id: "cell_code", confirmed: true });
  const cleared = await operations.clear_cell_output({ id: "cell_code" });

  assert.equal(markdown.ok, true);
  assert.equal(markdown.data.output.type, "cell_output");
  assert.equal(blocked.ok, false);
  assert.match(blocked.errors.join(" "), /requires confirmation/);
  assert.equal(confirmed.ok, true);
  assert.equal(cleared.data.data.output, null);
});
