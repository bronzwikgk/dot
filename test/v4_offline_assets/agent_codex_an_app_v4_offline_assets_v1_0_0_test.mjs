import test from "node:test";
import assert from "node:assert/strict";
import { offline_assets } from "../../code/utilities/code_shared_offline_assets_v4_0_0_draft.js";

test("offline_assets registers asset", () => {
  const oa = new offline_assets();
  const r = oa.register_asset("a1", { path: "/icon.png", type: "png", size: 1024 });
  assert.equal(r.ok, true);
});

test("offline_assets scans for CDN references", () => {
  const oa = new offline_assets();
  const r = oa.scan_for_cdn("load https://cdn.example.com/lib.js");
  assert.equal(r.ok, false);
  assert.equal(r.count, 1);
});

test("offline_assets passes clean content", () => {
  const oa = new offline_assets();
  const r = oa.scan_for_cdn("no urls here");
  assert.equal(r.ok, true);
  assert.equal(r.count, 0);
});

test("offline_assets validates offline", () => {
  const oa = new offline_assets();
  oa.register_asset("a1", { path: "/icon.png" });
  oa.scan_for_cdn("no urls");
  const r = oa.validate_offline();
  assert.equal(r.ok, true);
});
