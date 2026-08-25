import test from "node:test";
import assert from "node:assert/strict";
import { config_anchoring } from "../../code/utilities/code_shared_config_anchoring_v4_0_0_draft.js";

test("config_anchoring registers source", () => {
  const ca = new config_anchoring();
  const r = ca.register_source("s1", { base_path: "/app", config_path: "/config" });
  assert.equal(r.ok, true);
});

test("config_anchoring resolves path", () => {
  const ca = new config_anchoring();
  ca.register_source("s1", { base_path: "/app" });
  const r = ca.resolve_path("s1", "config/settings.json");
  assert.equal(r.ok, true);
  assert.equal(r.resolved_path, "/app/config/settings.json");
});

test("config_anchoring rejects traversal", () => {
  const ca = new config_anchoring();
  ca.register_source("s1", { base_path: "/app" });
  const r = ca.resolve_path("s1", "../etc/passwd");
  assert.equal(r.ok, false);
  assert.ok(r.errors[0].includes("traversal"));
});

test("config_anchoring validates paths", () => {
  const ca = new config_anchoring();
  ca.register_source("s1", { base_path: "/app", config_path: "/config" });
  const r = ca.validate_paths();
  assert.equal(r.ok, true);
});
