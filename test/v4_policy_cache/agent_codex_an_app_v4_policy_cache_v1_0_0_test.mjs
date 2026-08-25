import assert from "node:assert/strict";
import test from "node:test";
import { policy_cache } from "../../code/utilities/code_shared_policy_cache_v4_0_0_draft.js";

const policy = { id: "policy.cache_default", type: "cache_policy", scope: "shell", max_entries: 2 };

test("policy_cache validates approved policies", () => {
  const utility = new policy_cache();
  const valid = utility.validate_policy({ policy });
  const invalid = utility.validate_policy({ policy: { id: "policy.bad", type: "magic_policy" } });

  assert.equal(valid.ok, true);
  assert.equal(invalid.ok, false);
  assert.match(invalid.errors.join(" "), /not approved/);
});

test("policy_cache creates shell cache as an entity", async () => {
  const utility = new policy_cache({ policies: [policy] });
  const cache = await utility.create_shell_cache();

  assert.equal(cache.ok, true);
  assert.equal(cache.data.type, "shell_cache");
  assert.equal(cache.data.data.max_entries, 2);
});

test("policy_cache writes reads removes and audits entries", async () => {
  const utility = new policy_cache({ policies: [policy], clock: () => "2026-08-25T00:00:00.000Z" });
  await utility.create_shell_cache();
  const written = await utility.write_cache_entry({ scope: "shell", key: "active.template", value: { id: "template_1" } });
  const read = await utility.read_cache_entry({ scope: "shell", key: "active.template" });
  const removed = await utility.remove_cache_entry({ scope: "shell", key: "active.template" });

  assert.equal(written.ok, true);
  assert.equal(read.data.value.id, "template_1");
  assert.equal(removed.ok, true);
  assert.ok(utility.audit_records.length >= 3);
});

test("policy_cache enforces max entries", async () => {
  const utility = new policy_cache({ policies: [policy] });
  await utility.create_shell_cache();
  await utility.write_cache_entry({ key: "entry.one", value: 1 });
  await utility.write_cache_entry({ key: "entry.two", value: 2 });
  const cache = await utility.write_cache_entry({ key: "entry.three", value: 3 });

  assert.equal(cache.data.data.entries.length, 2);
  assert.equal(cache.data.data.entries[0].key, "entry.two");
});
