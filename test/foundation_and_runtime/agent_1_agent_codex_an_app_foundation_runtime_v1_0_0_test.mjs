import test from "node:test";
import assert from "node:assert/strict";
import { app_shell } from "../../code/plugins/code_shared_app_shell_v3_0_0_draft.js";
import { version_system } from "../../code/plugins/code_shared_version_system_v3_0_0_draft.js";
import { repository_operations } from "../../code/plugins/code_shared_repository_operations_v3_0_0_draft.js";

test("app_shell boots application entity with route view and audit", async () => {
  const shell = new app_shell({ actor: "agent_codex_an_app" });
  const result = await shell.boot({
    id: "sample_application",
    type: "application",
    name: "sample_application",
    routes: [{ id: "sample_route", name: "sample_route", path: "/" }],
    views: [{ id: "sample_view", name: "sample_view", layout: "dashboard" }]
  });

  assert.equal(result.ok, true);
  assert.equal(result.application.id, "sample_application");
  assert.equal(result.records.length, 2);
  assert.equal(result.audit.type, "audit_log");
  assert.equal(result.boot.status, "completed");
});

test("app_shell rejects invalid application before runtime work", async () => {
  const shell = new app_shell();
  const result = await shell.boot({ id: "bad_application" });

  assert.equal(result.ok, false);
  assert.equal(result.status, "failed");
  assert.match(result.errors.join(" "), /name is required/);
});

test("app_shell rejects duplicate children and invalid workflow plans", async () => {
  const shell = new app_shell();
  const result = await shell.boot({
    id: "bad_application_plan",
    type: "application",
    name: "bad_application_plan",
    routes: [
      { id: "same_child", name: "same_child", path: "/" },
      { id: "same_child", name: "same_child", path: "relative" }
    ],
    workflows: [{ id: "bad_workflow", name: "bad_workflow", plan: { kind: "ast", steps: [{ action: "noop" }] } }]
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /duplicate child id/);
  assert.match(result.errors.join(" "), /route path must start with/);
  assert.match(result.errors.join(" "), /plan is invalid/);
});

test("version_system snapshots diffs and restores an entity", async () => {
  const versions = new version_system({ actor: "agent_codex_an_app" });
  const entity = { id: "sample_entity", type: "utility", name: "sample_entity", attributes: { count: 1 } };
  const snapshot = await versions.snapshot_entity(entity, { version_id: "version_sample_entity_1", summary: "initial" });

  assert.equal(snapshot.ok, true);
  assert.equal(snapshot.data.data.attributes.count, 1);

  const diff = versions.diff_entity(entity, { ...entity, attributes: { count: 2 } });
  assert.equal(diff.ok, true);
  assert.equal(diff.change_count, 1);

  const restore = versions.restore_entity(snapshot.data);
  assert.equal(restore.ok, true);
  assert.equal(restore.entity.id, "sample_entity");
});

test("version_system detects three way merge conflict and invalid restore", () => {
  const versions = new version_system({ actor: "agent_codex_an_app" });
  const base = { id: "merge_entity", name: "merge_entity", attributes: { count: 1 } };
  const current = { id: "merge_entity", name: "merge_entity", attributes: { count: 2 } };
  const incoming = { id: "merge_entity", name: "merge_entity", attributes: { count: 3 } };
  const merge = versions.merge_entity(base, incoming, { current });

  assert.equal(merge.ok, false);
  assert.equal(merge.conflict_count, 1);
  assert.throws(() => versions.restore_entity({ id: "bad_version", type: "version_record", attributes: { entity_id: "x" } }), /data must be an object/);
});

test("repository_operations inspects status and validates commit proposal", async () => {
  const repo = new repository_operations({ repository_path: process.cwd(), actor: "agent_codex_an_app" });
  const status = await repo.inspect_status();
  assert.equal(status.ok, true);
  assert.equal(Array.isArray(status.changed_files), true);

  const proposal = repo.create_commit_proposal({
    message: "implement agent one foundation runtime",
    reason: "agent_1_foundation_contract",
    changed_files: status.changed_files,
    validation: { ok: true },
    tests: ["node --test test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs"]
  });
  assert.equal(proposal.ok, true);
  assert.equal(proposal.proposal.type, "commit_proposal");
});

test("repository_operations blocks mutating git commands", async () => {
  const repo = new repository_operations({ repository_path: process.cwd(), actor: "agent_codex_an_app" });
  await assert.rejects(() => repo.run_git(["commit", "-m", "blocked"], process.cwd()), /not allowed/);
});
