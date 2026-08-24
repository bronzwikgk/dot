# Shared Action Entity Utility

## File

`code/plugins/code_shared_action_entity_v3_0_0_draft.js`

## What It Is

The shared action entity utility provides a small storable entity surface for plugins and shared runtime code. It wraps a storage driver with:

- Create, read, update, delete, and query operations.
- Schema field validation.
- Automatic IDs when none are supplied.
- `createdAt` and `updatedAt` timestamps.
- A bounded LRU-style read cache.
- A built-in memory driver for standalone use.

It is intended to stop plugins from hand-rolling the same persistence wrapper repeatedly.

## What It Does

`ActionEntity` exposes:

- `create(data, options)`
- `read(id, options)`
- `update(id, data, options)`
- `delete(id, options)`
- `query(filter, options)`

When no driver is supplied, the entity lazily creates a private in-memory driver. When a driver is supplied, the driver is expected to provide:

- `generateId()`
- `getTimestamp()`
- `create(id, data, options)`
- `read(id, options)`
- `update(id, data, options)`
- `delete(id, options)`
- `query(filter, options)`

## When To Use It

Use this utility when a plugin or shared component needs a simple collection-like persistence API.

Good use cases:

- Plugin-local collections.
- Runtime records that need create/read/update/delete behavior.
- Tests or prototypes that need memory-backed persistence.
- Entity wrappers with small schema requirements.

Avoid using it for:

- Relational joins.
- Link traversal.
- Transactions.
- Authorization checks.
- Complex indexes.
- Full JSON Schema validation.
- Durable storage unless a durable driver is injected.

## How It Works

Create an entity:

```js
const tasks = new ActionEntity("tasks", {
  schema: {
    title: { required: true },
    status: { enum: ["open", "closed"] },
    due: { type: "date" }
  }
});
```

Create a record:

```js
const created = await tasks.create({
  title: "Write docs",
  status: "open",
  due: "2026-08-24"
});
```

Read it:

```js
const task = await tasks.read(created.data.id);
```

Update it:

```js
await tasks.update(created.data.id, { status: "closed" });
```

Query it:

```js
const openTasks = await tasks.query({ status: "open" });
```

Delete it:

```js
await tasks.delete(created.data.id);
```

## Schema Rules

The built-in schema supports:

- `required: true`
- `type: "date"`
- `enum: [...]`

Example:

```js
const users = new ActionEntity("users", {
  idField: "userId",
  schema: {
    userId: { required: true },
    role: { enum: ["admin", "member"] }
  }
});
```

`idField` defaults to `id`.

## Cache Behavior

The entity keeps a bounded cache of recently read or written records.

The cache:

- Is keyed by the entity ID field.
- Refreshes entries on create, read, update, and query.
- Evicts the oldest entry when it exceeds `cacheLimit`.
- Returns defensive copies so callers cannot mutate cached records by changing returned objects.

Default cache limit is `500`.

```js
const users = new ActionEntity("users", {}, null, { cacheLimit: 100 });
```

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `create()` should create a memory driver if no driver exists.
- Missing IDs should be generated through the driver.
- `createdAt` should be set on create when absent.
- `updatedAt` should be refreshed on every create and update.
- `read()` should throw when the ID is missing.
- `update()` should merge existing data with new data.
- `delete()` should evict the cached record.
- `query()` should refresh cache entries for returned records.
- Returned records should not expose mutable cache or memory-driver internals.
- Cache size should not exceed `cacheLimit`.

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
node --input-type=module -e "import assert from 'node:assert/strict'; import {ActionEntity} from './code/plugins/code_shared_action_entity_v3_0_0_draft.js'; const entity=new ActionEntity('items',{schema:{name:{required:true}, status:{enum:['open','closed']}, due:{type:'date'}}},null,{cacheLimit:2}); await assert.rejects(()=>entity.create({status:'open'}),/name/); await assert.rejects(()=>entity.create({name:'bad',status:'nope'}),/status/); await assert.rejects(()=>entity.create({name:'bad',status:'open',due:'not-a-date'}),/valid date/); const created=await entity.create({name:'alpha',status:'open',due:'2026-08-24'}); assert.equal(created.ok,true); assert.match(created.data.id,/^items_/); const read1=await entity.read(created.data.id); assert.equal(read1.name,'alpha'); read1.name='mutated'; const read2=await entity.read(created.data.id); assert.equal(read2.name,'alpha'); const updated=await entity.update(created.data.id,{status:'closed'}); assert.equal(updated.data.status,'closed'); assert.notEqual(updated.data.updatedAt,undefined); const custom=new ActionEntity('users',{idField:'userId'}); const customCreated=await custom.create({userId:'u1',name:'Ada'}); assert.equal(customCreated.data.userId,'u1'); await entity.create({name:'beta',status:'open'}); await entity.create({name:'gamma',status:'open'}); assert.equal(entity.cache.size,2); const queried=await entity.query({status:'open'}); assert.equal(queried.ok,true); assert.ok(queried.data.length >= 2); queried.data[0].name='query-mutated'; const reread=await entity.read(queried.data[0].id); assert.notEqual(reread.name,'query-mutated'); const deleted=await entity.delete(created.data.id); assert.equal(deleted.ok,true); await assert.rejects(()=>entity.read(created.data.id),/not found/); console.log('action_entity checks passed');"
```

Expected output:

```text
action_entity checks passed
```

## How To Update It

When updating this utility:

1. Preserve the CRUD method names and return shape unless every caller is updated in the same utility pass.
2. Test both the built-in memory driver and any injected driver contract changes.
3. Add focused checks for every new schema rule.
4. Test cache size, cache refresh, and mutation isolation after cache-related changes.
5. Update this document with any new driver method, schema rule, or return contract.
6. Update the matching maintenance log in `log/code_shared_action_entity_v3_0_0_draft.log.md`.
7. Commit only action_entity code, action_entity docs, and action_entity log for the action_entity utility pass.

## Known Limits

- The built-in schema is intentionally small.
- The memory driver is process-local and not durable.
- Defensive copies are shallow record copies.
- Query filtering supports exact equality only.
- There is no transaction or concurrency control layer.
