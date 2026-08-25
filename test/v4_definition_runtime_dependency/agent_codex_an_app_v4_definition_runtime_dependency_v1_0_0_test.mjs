import assert from "node:assert/strict";
import test from "node:test";
import {
  definition_runtime_dependency
} from "../../code/utilities/code_shared_definition_runtime_dependency_v4_0_0_draft.js";

const create_sample_definition = () => ({
  id: "an_app.product_surface",
  type: "product_definition",
  name: "an_app_product_surface",
  version: "1.0.0",
  status: "draft",
  runtime: "browser",
  feature_flags: ["run_all"],
  dependencies: [
    { id: "code_shared_browser_runtime", kind: "utility", runtime: "browser" },
    {
      id: "code_shared_product_surface",
      kind: "plugin",
      runtime: "browser",
      relationships: [{ type: "depends_on", to: "code_shared_browser_runtime" }]
    }
  ],
  policies: ["runtime_guard"],
  schemas: [{ id: "product_surface_schema", fields: {} }],
  patterns: [{ id: "cell_command_pattern" }],
  shapes: [{ id: "dag_execution_shape" }],
  defaults: { layout: "notebook", theme: "light" }
});

test("definition utility resolves a valid product definition", () => {
  const utility = new definition_runtime_dependency();
  const result = utility.resolve_definition({
    definition: create_sample_definition(),
    config: { theme: "dark" },
    template: { layout: "dashboard" },
    system: { density: "compact", theme: "light" }
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.definition.runtime, "browser");
  assert.equal(result.data.dependencies.length, 2);
  assert.equal(result.data.defaults.values.layout, "notebook");
  assert.equal(result.data.defaults.values.theme, "dark");
  assert.equal(result.data.defaults.values.density, "compact");
});

test("definition utility rejects invalid runtime names", () => {
  const utility = new definition_runtime_dependency();
  const definition = create_sample_definition();
  definition.runtime = "browser_magic";
  const result = utility.validate_definition({ definition });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /runtime 'browser_magic' is not approved/);
});

test("definition utility rejects missing required fields", () => {
  const utility = new definition_runtime_dependency();
  const result = utility.validate_definition({ definition: { runtime: "browser" } });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /definition id is required/);
  assert.match(result.errors.join(" "), /definition name is required/);
});

test("definition utility rejects dependency cycles", () => {
  const utility = new definition_runtime_dependency();
  const definition = create_sample_definition();
  definition.dependencies = [
    { id: "a", kind: "utility", relationships: [{ type: "depends_on", to: "b" }] },
    { id: "b", kind: "plugin", relationships: [{ type: "depends_on", to: "a" }] }
  ];
  const result = utility.resolve_runtime_dependencies({ definition });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /dependency cycle detected/);
});
