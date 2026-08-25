import test from "node:test";
import assert from "node:assert/strict";
import { browser_runtime } from "../../code/utilities/code_shared_browser_runtime_v4_0_0_draft.js";

test("browser_runtime validates definition and mount target", () => {
  const runtime = new browser_runtime({
    clock: () => "2026-08-25T00:00:00.000Z",
    document_ref: {
      getElementById(id) {
        return id === "an_app_mount" ? { id, nodeType: 1 } : null;
      }
    }
  });

  assert.equal(runtime.load_definition_file({ definition: { mount_target_id: "an_app_mount" } }).ok, true);
  assert.equal(runtime.resolve_mount_target({ mount_target_id: "an_app_mount" }).ok, true);
  assert.match(runtime.resolve_mount_target({ mount_target_id: "missing" }).errors.join(" "), /not found/);
});

test("browser_runtime distinguishes started ready and failed markers", () => {
  const window_ref = {};
  const runtime = new browser_runtime({ window_ref, clock: () => "2026-08-25T00:00:00.000Z" });

  const started = runtime.write_boot_marker({ status: "started" });
  const not_ready = runtime.wait_app_ready({ marker: started.data });
  const ready = runtime.write_boot_marker({ status: "ready" });
  const ready_check = runtime.wait_app_ready({ marker: ready.data });
  const failed = runtime.report_boot_error({ message: "bad mount" });
  const failed_check = runtime.wait_app_ready({ marker: failed.data });

  assert.equal(not_ready.ok, false);
  assert.equal(ready_check.ok, true);
  assert.equal(failed.data.failed, true);
  assert.equal(failed_check.ok, false);
  assert.equal(window_ref.__an_app_boot_marker__.status, "failed");
});

test("browser_runtime prevents duplicate listeners and blocks benchmark when not ready", () => {
  const runtime = new browser_runtime();
  const first = runtime.attach_listener({ event_name: "click", selector: "[data-action='run_cell']" });
  const second = runtime.attach_listener({ event_name: "click", selector: "[data-action='run_cell']" });
  const blocked = runtime.guard_benchmark({ marker: { status: "failed", failed: true } });

  assert.equal(first.data.attached, true);
  assert.equal(second.data.attached, false);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.data.status, "blocked");
});

test("browser_runtime reports page errors as failed browser test run", () => {
  const runtime = new browser_runtime({ clock: () => "2026-08-25T00:00:00.000Z" });
  runtime.record_page_error({ message: "uncaught error" });
  const report = runtime.create_browser_test_report({
    ready: true,
    browser: "chromium",
    viewport: { width: 1280, height: 720 }
  });

  assert.equal(report.ok, false);
  assert.equal(report.data.status, "failed");
  assert.equal(report.data.checks.page_errors, 1);
});
