import assert from "node:assert/strict";
import test from "node:test";
import {
  workspace_persistence,
  memory_storage
} from "../../code/utilities/code_shared_workspace_persistence_v4_0_0_draft.js";

test("workspace_persistence saves and loads workspace state", async () => {
  const storage = new memory_storage();
  const utility = new workspace_persistence({ clock: () => "2026-08-25T00:00:00.000Z" }, { storage });
  const state = { active_book_id: "book_1", active_cell_id: "cell_1", active_layout: "notebook" };

  const save = await utility.save_workspace({ state });
  const load = await utility.load_workspace();

  assert.equal(save.ok, true);
  assert.equal(load.ok, true);
  assert.deepEqual(load.data.state, state);
});

test("workspace_persistence rejects invalid storage keys", async () => {
  const utility = new workspace_persistence();
  const result = await utility.save_workspace({ key: "Bad Key", state: {} });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /snake_path/);
});

test("workspace_persistence reports storage selftest failure", async () => {
  const failing_storage = {
    set_item: async () => {
      throw new Error("storage denied");
    },
    get_item: async () => null,
    remove_item: async () => null
  };
  const utility = new workspace_persistence({}, { storage: failing_storage });
  const result = await utility.run_storage_selftest();

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /storage denied/);
});

test("workspace_persistence creates version backed undo and redo records", () => {
  const utility = new workspace_persistence({ clock: () => "2026-08-25T00:00:00.000Z" });
  const checkpoint = utility.create_undo_checkpoint({
    entity_id: "cell_1",
    before: { id: "cell_1", content: "before" },
    after: { id: "cell_1", content: "after" }
  });
  const undo = utility.undo_change();
  const redo = utility.redo_change();

  assert.equal(checkpoint.data.type, "version_checkpoint");
  assert.equal(undo.data.type, "undo_record");
  assert.equal(undo.data.state.content, "before");
  assert.equal(redo.data.type, "redo_record");
  assert.equal(redo.data.state.content, "after");
  assert.equal(utility.audit_records.length, 3);
});
