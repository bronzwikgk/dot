# Shared logger And metrics Utility

## File

`code/plugins/code_shared_logger_v3_0_0_draft.js`

## What It Is

The shared logger and metrics utility provides in-memory observability helpers:

- Leveled logging with a bounded ring buffer.
- Counters.
- Gauges.
- Simple elapsed-time timers.

It is dependency-free and intended for runtime inspection, diagnostics, and lightweight instrumentation.

## What It Does

`logger` exposes:

- `debug(message_text, details)`
- `info(message_text, details)`
- `warn(message_text, details)`
- `error(message_text, details)`
- `get_logs(level_filter)`

`metrics` exposes:

- `counter(name_value)`
- `timer(name_value)`
- `gauge(name_value, numeric_value)`
- `snapshot()`

`snapshot()` returns separate `counters`, `gauges`, and `timers` arrays so a
counter and gauge can safely use the same name.

Factory helpers:

- `create_logger(ceiling)`
- `create_metrics()`

## When To Use It

Use this utility when code needs bounded in-memory logs or simple runtime metrics.

Good use cases:

- Capturing recent runtime events.
- Inspecting plugin behavior during a run.
- Counting events.
- Recording latest gauge values.
- Measuring elapsed time for stages.

Avoid using it for:

- Durable log storage.
- Structured log transport.
- Distributed tracing.
- High-cardinality production metrics.
- Security audit logs.

## logger Behavior

Create a logger:

```js
const logger = new logger({ ceiling: 200 });
```

Add lines:

```js
logger.info("boot complete");
logger.warn("retrying", { attempt: 2 });
```

Read lines:

```js
logger.get_logs();
logger.get_logs("warn");
```

Each line has:

```js
{
  at: "2026-08-24T...",
  level: "info",
  message: "boot complete",
  details: null
}
```

The ring buffer keeps only the newest `ceiling` lines. Invalid or non-positive ceilings fall back to `200`.

Falsy details such as `0` and `false` are preserved. Missing details become `null`.

## metrics Behavior

Counters increment by name:

```js
metrics.counter("hits");
// 1
metrics.counter("hits");
// 2
```

Gauges store the latest value with a `gauge:` prefix:

```js
metrics.gauge("load", 7);
```

Timers return a stop function:

```js
const stop = metrics.timer("compose");
const timing = stop();
// { name: "compose", duration_ms: 12 }
```

Snapshots return a flat array of [name, value] pairs:

```js
metrics.snapshot();
// [["hits", 2], ["gauge:load", 7]]
```

Gauge names are prefixed with `gauge:` in the snapshot to distinguish them from counters.

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `new logger()` must work with no config.
- logger ceiling should be a positive integer, falling back to `200` otherwise.
- logger buffer should never exceed `ceiling`.
- `get_logs()` should return a shallow copy of the line array.
- `get_logs(level)` should filter by exact level.
- Log details should preserve falsy values except missing details, which become `null`.
- Counter values should be monotonic per key within one `metrics` instance.
- Gauges should return the numeric value passed in.
- Timer stop functions should return `{ name, duration_ms }`.
- `create_logger()` should return a `logger`.
- `create_metrics()` should return a `metrics`.

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
node --input-type=module -e "import assert from 'node:assert/strict'; import {logger, metrics, create_logger, create_metrics} from './code/plugins/code_shared_logger_v3_0_0_draft.js'; const log=new logger({ceiling:2}); log.info('one'); log.warn('two',{x:1}); log.error('three'); assert.equal(log.get_logs().length,2); assert.deepEqual(log.get_logs().map(l=>l.message),['two','three']); assert.equal(log.get_logs('warn').length,1); assert.deepEqual(log.get_logs('warn')[0].details,{x:1}); const copy=log.get_logs(); copy.push({}); assert.equal(log.get_logs().length,2); const falsy=new logger({ceiling:3}); falsy.info('zero',0); falsy.info('false',false); assert.equal(falsy.get_logs()[0].details,0); assert.equal(falsy.get_logs()[1].details,false); const made=create_logger(1); made.debug('a'); made.debug('b'); assert.equal(made.get_logs().length,1); const zero=new logger({ceiling:0}); zero.info('still usable'); assert.equal(zero.ceiling,200); assert.equal(zero.get_logs().length,1); const metrics=new metrics(); assert.equal(metrics.counter('hits'),1); assert.equal(metrics.counter('hits'),2); assert.equal(metrics.gauge('load',7),7); assert.deepEqual(metrics.snapshot(),[['hits',2],['gauge:load',7]]); const stop=metrics.timer('stage'); const timing=stop(); assert.equal(timing.name,'stage'); assert.ok(timing.duration_ms>=0); assert.ok(create_metrics() instanceof metrics); console.log('logger checks passed');"
```

Expected output:

```text
logger checks passed
```

## How To Update It

When updating this utility:

1. Keep log line shape stable unless all consumers are updated in the same utility pass.
2. Test ring-buffer eviction whenever ceiling behavior changes.
3. Test falsy details when changing log payload handling.
4. Test counter, gauge, timer, and snapshot behavior when changing metrics storage.
5. Update this document with any new level, metric type, or return shape.
6. Update the matching maintenance log in `log/code_shared_logger_v3_0_0_draft.log.md`.
7. Commit only logger code, logger docs, and logger log for the logger utility pass.

## Known Limits

- Logs are in-memory only.
- metrics are in-memory only.
- Timer uses `Date.now()`.
- Snapshot returns map entries, not an object.
- There is no transport to disk or remote telemetry.
