import assert from "node:assert/strict";
import test from "node:test";
import { project_inventory } from "../../code/utilities/code_shared_project_inventory_v4_0_0_draft.js";

test("project_inventory anchors config paths inside base path", () => {
  const utility = new project_inventory({ base_path: process.cwd() });
  const result = utility.anchor_config_path({ path: "docs/code_shared_product_surface_v3_0_0_draft.md" });

  assert.equal(result.ok, true);
  assert.equal(result.data.relative_path, "docs/code_shared_product_surface_v3_0_0_draft.md");
});

test("project_inventory rejects paths outside base path", () => {
  const utility = new project_inventory({ base_path: process.cwd() });
  const result = utility.anchor_config_path({ path: "../outside.md" });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /inside base_path/);
});

test("project_inventory detects stale manifest entries", () => {
  const utility = new project_inventory({ base_path: process.cwd() });
  const result = utility.validate_manifest_records({
    records: [
      { id: "docs.product_surface", path: "docs/code_shared_product_surface_v3_0_0_draft.md" },
      { id: "docs.missing_doc", path: "docs/missing_doc_v1_0_0_draft.md" }
    ]
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /stale/);
});

test("project_inventory creates docs routes with stable hash links", () => {
  const utility = new project_inventory({ base_path: process.cwd() });
  const result = utility.validate_docs_routes({
    routes: [
      { id: "docs.product_surface", title: "Product Surface", path: "docs/code_shared_product_surface_v3_0_0_draft.md" },
      { id: "docs.workspace_persistence", title: "Workspace Persistence", path: "docs/code_shared_workspace_persistence_v4_0_0_draft.md" }
    ]
  });

  assert.equal(result.ok, true);
  assert.equal(result.data[0].hash, "#docs-product_surface");
  assert.ok(result.data[0].href.endsWith("#docs-product_surface"));
});

test("project_inventory creates combined inventory report", () => {
  const utility = new project_inventory({ base_path: process.cwd() });
  const result = utility.create_inventory_report({
    records: [{ id: "docs.product_surface", path: "docs/code_shared_product_surface_v3_0_0_draft.md" }],
    docs_routes: [{ id: "docs.product_surface", title: "Product Surface", path: "docs/code_shared_product_surface_v3_0_0_draft.md" }]
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.manifest_records.length, 1);
  assert.equal(result.data.docs_routes.length, 1);
});
