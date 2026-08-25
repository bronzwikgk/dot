import test from "node:test";
import assert from "node:assert/strict";
import { static_server } from "../../code/utilities/code_shared_static_server_v4_0_0_draft.js";

test("static_server starts and stops", () => {
  const ss = new static_server();
  assert.equal(ss.get_status(), "stopped");
  ss.start();
  assert.equal(ss.get_status(), "running");
  ss.stop();
  assert.equal(ss.get_status(), "stopped");
});

test("static_server adds route", () => {
  const ss = new static_server();
  const r = ss.add_route("/", () => "home");
  assert.equal(r.ok, true);
  assert.deepEqual(ss.list_routes(), ["/"]);
});

test("static_server gets no-cache headers", () => {
  const ss = new static_server({ no_cache: true });
  const h = ss.get_headers();
  assert.equal(h["Cache-Control"], "no-cache, no-store, must-revalidate");
});

test("static_server validates config", () => {
  const ss = new static_server({ port: 8080 });
  const r = ss.validate_config();
  assert.equal(r.ok, true);
});

test("static_server rejects invalid port", () => {
  const ss = new static_server({ port: -1 });
  const r = ss.validate_config();
  assert.equal(r.ok, false);
});
