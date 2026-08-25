import test from "node:test";
import assert from "node:assert/strict";
import { editor_focus } from "../../code/utilities/code_shared_editor_focus_v4_0_0_draft.js";

test("editor_focus gates save by edit mode and exits on escape", () => {
  const focus = new editor_focus({ clock: () => "2026-08-25T00:00:00.000Z" });

  assert.equal(focus.can_handle_keyboard({ combo: "ctrl+s" }).ok, false);
  assert.equal(focus.enter_edit_mode({ cell_id: "cell_1" }).data.mode, "edit");
  assert.equal(focus.can_handle_keyboard({ combo: "ctrl+s" }).data.action, "save_edit");
  assert.equal(focus.can_handle_keyboard({ combo: "escape" }).data.action, "exit_edit_mode");
  assert.equal(focus.exit_edit_mode({ clear_active_cell: true }).data.mode, "command");
});

test("editor_focus preserves active cell during render sync", () => {
  const focus = new editor_focus({ clock: () => "2026-08-25T00:00:00.000Z" });
  focus.enter_edit_mode({ cell_id: "cell_1" });
  const capture = focus.capture_focus({ selector: "#cell_1_editor", selection_start: 1, selection_end: 2 });
  const restore = focus.restore_focus();
  const sync = focus.sync_cell_view({ cell: { id: "cell_1", value: "a" }, previous: { id: "cell_1", value: "b" } });

  assert.equal(capture.ok, true);
  assert.equal(restore.ok, true);
  assert.equal(sync.data.preserve_active, true);
  assert.equal(sync.data.should_rebuild, false);
});

test("editor_focus validates rail outside cell content", () => {
  const focus = new editor_focus();
  const valid = focus.validate_cell_row_layout({
    row_display: "grid",
    content_min_width_zero: true,
    rail_inside_content: false,
    rail_overlaps_content: false
  });
  const invalid = focus.validate_cell_row_layout({
    content_min_width_zero: false,
    rail_inside_content: true,
    rail_overlaps_content: true
  });

  assert.equal(valid.ok, true);
  assert.equal(invalid.ok, false);
  assert.match(invalid.errors.join(" "), /outside cell content/);
  assert.match(invalid.errors.join(" "), /min width zero/);
});
