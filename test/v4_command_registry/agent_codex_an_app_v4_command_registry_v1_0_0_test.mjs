import test from "node:test";
import assert from "node:assert/strict";
import { command_registry } from "../../code/utilities/code_shared_command_registry_v4_0_0_draft.js";

test("command_registry resolves one command through action selector and keyboard", async () => {
  const registry = new command_registry();
  const register_result = registry.register_command({
    id: "run_cell_primary",
    action: "run_cell",
    selector: "[data-action='run_cell']",
    keyboard: { combo: "ctrl+enter", scope: "cell", command_name: "run_cell" },
    method: async (payload) => ({ received: payload.cell_id })
  });

  assert.equal(register_result.ok, true);
  assert.equal(registry.resolve_command_from_action({ action: "run_cell" }).data.id, "run_cell_primary");
  assert.equal(registry.resolve_command_from_selector({ selector: "[data-action='run_cell']" }).data.id, "run_cell_primary");
  assert.equal(registry.resolve_command_from_keyboard({ combo: "ctrl+enter", scope: "cell" }).data.id, "run_cell_primary");

  const execute_result = await registry.execute_command({
    action: "run_cell",
    payload: { cell_id: "cell_1" }
  });

  assert.equal(execute_result.ok, true);
  assert.equal(execute_result.data.output.received, "cell_1");
});

test("command_registry rejects duplicate ids keyboard combos selectors and invalid actions", () => {
  const registry = new command_registry();
  assert.equal(registry.register_command({
    id: "new_book_global",
    action: "new_book",
    selector: "#new_book",
    keyboard: "ctrl+n"
  }).ok, true);

  assert.match(registry.register_command({ id: "new_book_global", action: "new_book" }).errors.join(" "), /duplicate command id/);
  assert.match(registry.register_command({ id: "bad_action", action: "unknown_action" }).errors.join(" "), /not approved/);
  assert.match(registry.register_command({ id: "bad_selector", action: "export_book", selector: "bad selector !" }).errors.join(" "), /invalid/);
  assert.match(registry.register_command({ id: "dupe_keyboard", action: "import_book", keyboard: "ctrl+n" }).errors.join(" "), /duplicate keyboard combo/);
  assert.match(registry.register_command({ id: "dupe_selector", action: "export_book", selector: "#new_book" }).errors.join(" "), /duplicate selector/);
});

test("command_registry returns envelope for missing executable method", async () => {
  const registry = new command_registry({
    commands: [{ id: "search_next_global", action: "search_next", keyboard: "ctrl+g" }]
  });
  const result = await registry.execute_command({ action: "search_next" });

  assert.equal(result.ok, false);
  assert.deepEqual(result.data, null);
  assert.match(result.errors.join(" "), /no executable method/);
});
