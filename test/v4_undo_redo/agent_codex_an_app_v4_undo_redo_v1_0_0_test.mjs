import test from "node:test";
import assert from "node:assert/strict";
import { undo_redo } from "../../code/utilities/code_shared_undo_redo_v4_0_0_draft.js";

test("undo_redo records action", () => {
  const ur = new undo_redo();
  const r = ur.record("edit", { entity_id: "e1", before: { x: 0 }, after: { x: 1 } });
  assert.equal(r.ok, true);
  assert.equal(ur.can_undo(), true);
});

test("undo_redo undoes action", () => {
  const ur = new undo_redo();
  ur.record("edit", { entity_id: "e1", before: { x: 0 }, after: { x: 1 } });
  const r = ur.undo();
  assert.equal(r.ok, true);
  assert.deepEqual(r.restored, { x: 0 });
  assert.equal(ur.can_redo(), true);
});

test("undo_redo redoes action", () => {
  const ur = new undo_redo();
  ur.record("edit", { entity_id: "e1", before: { x: 0 }, after: { x: 1 } });
  ur.undo();
  const r = ur.redo();
  assert.equal(r.ok, true);
  assert.deepEqual(r.restored, { x: 1 });
});

test("undo_redo fails on empty undo", () => {
  const ur = new undo_redo();
  const r = ur.undo();
  assert.equal(r.ok, false);
});

test("undo_redo fails on empty redo", () => {
  const ur = new undo_redo();
  const r = ur.redo();
  assert.equal(r.ok, false);
});

test("undo_redo clears redo on new record", () => {
  const ur = new undo_redo();
  ur.record("edit", { entity_id: "e1", before: { x: 0 }, after: { x: 1 } });
  ur.undo();
  ur.record("edit2", { entity_id: "e1", before: { x: 1 }, after: { x: 2 } });
  assert.equal(ur.can_redo(), false);
});
