import test from "node:test";
import assert from "node:assert/strict";
import { search_status } from "../../code/utilities/code_shared_search_status_v4_0_0_draft.js";

test("search_status finds workspace records and marks hits", () => {
  const search = new search_status({ clock: () => "2026-08-25T00:00:00.000Z" });
  const result = search.search_workspace({
    query: "course",
    records: [
      { id: "template_lms_v1", type: "template", name: "Learning Course" },
      { id: "template_fintech_v1", type: "template", name: "Payment Review" }
    ]
  });
  const marks = search.mark_search_hits();

  assert.equal(result.ok, true);
  assert.equal(result.data.hits.length, 1);
  assert.deepEqual(marks.data.hit_ids, ["template_lms_v1"]);
});

test("search_status cycles hits and clears state", () => {
  const search = new search_status();
  search.search_workspace({
    query: "template",
    records: [{ id: "a", name: "template one" }, { id: "b", name: "template two" }]
  });

  assert.equal(search.move_to_next_hit().data.hit.id, "b");
  assert.equal(search.move_to_next_hit().data.hit.id, "a");
  assert.equal(search.clear_search_hits().data.hits.length, 0);
  assert.equal(search.move_to_next_hit().ok, false);
});

test("search_status creates structured status and error records", () => {
  const search = new search_status({ clock: () => "2026-08-25T00:00:00.000Z" });
  const status = search.update_status({ message: "ready" });
  const error = search.report_error_status({ message: "storage failed" });

  assert.equal(status.data.type, "status_message");
  assert.equal(error.data.level, "error");
  assert.equal(search.status_records.length, 2);
});
