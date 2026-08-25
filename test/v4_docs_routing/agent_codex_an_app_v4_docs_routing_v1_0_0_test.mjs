import test from "node:test";
import assert from "node:assert/strict";
import { docs_routing } from "../../code/utilities/code_shared_docs_routing_v4_0_0_draft.js";

test("docs_routing registers route", () => {
  const dr = new docs_routing();
  const r = dr.register_route("r1", { title: "Home", module_path: "/docs/home", hash: "home" });
  assert.equal(r.ok, true);
});

test("docs_routing rejects duplicate route", () => {
  const dr = new docs_routing();
  dr.register_route("r1");
  const r = dr.register_route("r1");
  assert.equal(r.ok, false);
});

test("docs_routing navigates to route", () => {
  const dr = new docs_routing();
  dr.register_route("r1", { title: "Home" });
  const r = dr.navigate("r1");
  assert.equal(r.ok, true);
  assert.equal(r.route.id, "r1");
});

test("docs_routing gets deep link", () => {
  const dr = new docs_routing();
  dr.register_route("r1", { hash: "home" });
  assert.equal(dr.get_deep_link("r1"), "#home");
});

test("docs_routing validates routes", () => {
  const dr = new docs_routing();
  dr.register_route("r1", { module_path: "/docs/home" });
  const r = dr.validate_routes();
  assert.equal(r.ok, true);
});

test("docs_routing detects missing path", () => {
  const dr = new docs_routing();
  dr.register_route("r1");
  const r = dr.validate_routes();
  assert.equal(r.ok, false);
});
