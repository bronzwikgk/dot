import assert from "node:assert/strict";
import test from "node:test";
import { get } from "node:http";
import { join } from "node:path";
import { import_export_offline } from "../../code/utilities/code_shared_import_export_offline_v4_0_0_draft.js";

const read_url = (url) => new Promise((resolve, reject) => {
  get(url, (response) => {
    let body = "";
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      resolve({ status: response.statusCode, headers: response.headers, body });
    });
  }).on("error", reject);
});

test("import_export_offline exports and imports restorable json", () => {
  const utility = new import_export_offline({ clock: () => "2026-08-25T00:00:00.000Z" });
  const state = { active_book_id: "book_1", cells: [{ id: "cell_1", cell_type: "markdown", content: "hello" }] };
  const exported = utility.export_workspace({ state });
  const imported = utility.import_workspace({ content: exported.data.content });

  assert.equal(exported.ok, true);
  assert.equal(imported.ok, true);
  assert.deepEqual(imported.data.state, state);
});

test("import_export_offline requires confirmation for executable imported cells", () => {
  const utility = new import_export_offline();
  const exported = utility.export_workspace({
    state: { cells: [{ id: "cell_code", cell_type: "code", content: "1 + 1" }] }
  });
  const blocked = utility.import_workspace({ content: exported.data.content });
  const confirmed = utility.import_workspace({ content: exported.data.content, confirmed: true });

  assert.equal(blocked.ok, false);
  assert.match(blocked.errors.join(" "), /require confirmation/);
  assert.equal(confirmed.ok, true);
  assert.equal(confirmed.data.requires_confirmation, true);
});

test("import_export_offline rejects remote asset references", () => {
  const utility = new import_export_offline();
  const result = utility.validate_asset_inventory({
    assets: ["html/product_surface/an_app_product_surface_v1_0_0_draft.css", "https://cdn.example/app.js"]
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /blocked remote reference/);
});

test("import_export_offline creates no-cache local static server", async () => {
  const utility = new import_export_offline({
    root: join(process.cwd(), "html", "product_surface"),
    entry_file: "an_app_product_surface_v1_0_0_draft.html",
    port: 0
  });
  const created = utility.create_local_server({ port: 0 });
  assert.equal(created.ok, true);
  await new Promise((resolve) => created.data.server.listen(0, resolve));
  try {
    const address = created.data.server.address();
    const response = await read_url(`http://127.0.0.1:${address.port}/`);
    assert.equal(response.status, 200);
    assert.equal(response.headers["cache-control"], "no-store");
    assert.match(response.body, /An App Product Surface/);
  } finally {
    await new Promise((resolve) => created.data.server.close(resolve));
  }
});
