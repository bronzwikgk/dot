import test from "node:test";
import assert from "node:assert/strict";
import { template_gallery } from "../../code/utilities/code_shared_template_gallery_v4_0_0_draft.js";

test("template_gallery registers template", () => {
  const tg = new template_gallery();
  const r = tg.register_template("t1", { name: "App Starter", category: "app" });
  assert.equal(r.ok, true);
});

test("template_gallery creates card", () => {
  const tg = new template_gallery();
  tg.register_template("t1", { name: "App Starter" });
  const r = tg.create_card("t1");
  assert.equal(r.ok, true);
  assert.equal(r.card.template_name, "App Starter");
});

test("template_gallery removes card", () => {
  const tg = new template_gallery();
  tg.register_template("t1");
  const card = tg.create_card("t1");
  const r = tg.remove_card(card.card.id);
  assert.equal(r.ok, true);
  assert.equal(tg.list_cards().length, 0);
});

test("template_gallery lists templates", () => {
  const tg = new template_gallery();
  tg.register_template("t1");
  tg.register_template("t2");
  assert.equal(tg.list_templates().length, 2);
});
