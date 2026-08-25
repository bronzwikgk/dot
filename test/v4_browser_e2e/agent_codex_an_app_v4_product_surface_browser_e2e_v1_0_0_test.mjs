import test from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { chromium } from "playwright";

const surface_url = pathToFileURL(join(process.cwd(), "html", "product_surface", "an_app_product_surface_v1_0_0_draft.html")).href;

test("product surface browser e2e validates boot search keyboard focus and layout", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const page_errors = [];
    page.on("pageerror", (error) => page_errors.push(error.message));

    await page.goto(surface_url);
    await page.waitForFunction(() => window.__an_app_boot_marker__ && window.__an_app_boot_marker__.ready === true);

    const marker = await page.evaluate(() => window.__an_app_boot_marker__);
    assert.equal(marker.status, "ready");
    assert.equal(page_errors.length, 0);

    await page.fill("#search_input", "learning");
    await page.waitForSelector(".search_hit");
    assert.equal(await page.textContent("#search_count"), "1 result");

    const first_active = await page.locator(".active_search_hit").first().textContent();
    await page.press("#search_input", "Enter");
    const second_active = await page.locator(".active_search_hit").first().textContent();
    assert.equal(first_active, second_active);

    await page.fill("#cell_editor", "create fintech dashboard");
    await page.focus("#cell_editor");
    await page.keyboard.press("Control+S");
    await page.waitForFunction(() => document.getElementById("cell_output").textContent.includes("create fintech dashboard"));
    assert.equal(await page.evaluate(() => document.activeElement.id), "cell_editor");

    await page.fill("#cell_editor", "create fintech dashboard updated");
    await page.keyboard.press("Control+Z");
    await page.waitForFunction(() => document.getElementById("cell_editor").value === "create fintech dashboard");
    await page.keyboard.press("Control+Y");
    await page.waitForFunction(() => document.getElementById("cell_editor").value === "create fintech dashboard updated");

    await page.keyboard.press("Control+Shift+Enter");
    await page.waitForFunction(() => document.getElementById("cell_output").textContent.includes("render_output:display"));

    const layout_checks = [
      ["json_as_notebook", "Notebook", ".notebook_row"],
      ["json_as_text", "Code Editor", ".code_editor_view"],
      ["json_as_document", "Block Editor", ".block_row"],
      ["json_as_tree", "Tree", ".tree_row"],
      ["json_as_table", "Table", ".table_view"],
      ["json_as_board", "Board", ".board_card"],
      ["json_as_calendar", "Calendar", ".calendar_event"],
      ["json_as_timeline", "Timeline", ".timeline_view"],
      ["json_as_diagram", "Diagram", ".diagram_node"],
      ["json_as_dashboard", "Dashboard", ".dashboard_metric"]
    ];
    for (const check of layout_checks) {
      await page.click(`[data-profile="${check[0]}"]`);
      await page.waitForSelector(check[2]);
      assert.equal(await page.textContent("#projection_title"), check[1]);
    }

    await page.reload();
    await page.waitForFunction(() => window.__an_app_boot_marker__ && window.__an_app_boot_marker__.ready === true);
    assert.equal(await page.inputValue("#cell_editor"), "create fintech dashboard updated");
    assert.equal(await page.textContent("#projection_title"), "Dashboard");

    await page.keyboard.press("Escape");
    assert.equal(await page.textContent("#search_count"), "0 results");

    const rail_box = await page.locator(".cell_rail").boundingBox();
    const body_box = await page.locator(".cell_body").boundingBox();
    assert.ok(rail_box.x + rail_box.width <= body_box.x);
  } finally {
    await browser.close();
  }
});

test("product surface browser e2e validates mobile layout", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(surface_url);
    await page.waitForFunction(() => window.__an_app_boot_marker__ && window.__an_app_boot_marker__.ready === true);

    const rail_box = await page.locator(".cell_rail").boundingBox();
    const body_box = await page.locator(".cell_body").boundingBox();
    const dimensions = await page.evaluate(() => ({
      scroll_width: document.documentElement.scrollWidth,
      inner_width: window.innerWidth
    }));
    assert.ok(body_box.y > rail_box.y);
    assert.ok(dimensions.scroll_width <= dimensions.inner_width);
  } finally {
    await browser.close();
  }
});
