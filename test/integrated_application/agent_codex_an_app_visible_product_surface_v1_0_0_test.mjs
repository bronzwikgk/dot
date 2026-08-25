import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const read_surface_file = async (file_name) => {
  return readFile(join(process.cwd(), "html", "product_surface", file_name), "utf8");
};

test("visible product surface has required static files and hooks", async () => {
  const html = await read_surface_file("an_app_product_surface_v1_0_0_draft.html");
  assert.ok(html.includes("an_app_product_surface_v1_0_0_draft.css"));
  assert.ok(html.includes("an_app_product_surface_v1_0_0_draft.js"));
  assert.ok(html.includes('id="template_list"'));
  assert.ok(html.includes('id="command_input"'));
  assert.ok(html.includes('id="search_input"'));
  assert.ok(html.includes('id="clear_search_button"'));
  assert.ok(html.includes('id="search_count"'));
  assert.ok(html.includes('id="projection_view"'));
  assert.ok(html.includes('id="an_app_mount"'));
  assert.ok(html.includes('data-mount-target="an_app_mount"'));
  assert.ok(html.includes('data-profile="json_as_document"'));
  assert.ok(html.includes('data-profile="json_as_tree"'));
  assert.ok(html.includes('data-profile="json_as_diagram"'));
  assert.ok(html.includes('data-profile="json_as_table"'));
});

test("visible product surface keeps class based browser controller", async () => {
  const browser_source = await read_surface_file("an_app_product_surface_v1_0_0_draft.js");
  assert.ok(browser_source.includes("class an_app_product_surface_controller"));
  assert.ok(browser_source.includes("__an_app_boot_marker__"));
  assert.ok(browser_source.includes('this.write_boot_marker("started")'));
  assert.ok(browser_source.includes('this.write_boot_marker("ready")'));
  assert.ok(browser_source.includes('status: "failed"'));
  assert.ok(browser_source.includes("search_workspace"));
  assert.ok(browser_source.includes("mark_search_hits"));
  assert.ok(browser_source.includes("move_to_next_hit"));
  assert.equal(browser_source.includes("fun" + "ction "), false);
  assert.equal(browser_source.includes("=>"), false);
});

test("visible product surface css has responsive layout guards", async () => {
  const css = await read_surface_file("an_app_product_surface_v1_0_0_draft.css");
  assert.ok(css.includes("@media (max-width: 900px)"));
  assert.ok(css.includes("@media (max-width: 520px)"));
  assert.ok(css.includes("min-width: 0"));
  assert.ok(css.includes("box-sizing: border-box"));
  assert.ok(css.includes(".search_hit"));
  assert.ok(css.includes(".active_search_hit"));
});
