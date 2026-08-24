/**
 * @entity pool_utility
 *
 * @meta
 * project: an_app
 * file_name: src/utility/pool.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * bounded async parallel executor for controlled concurrency.
 *
 * @usage
 * ```js
 * const results = await run_parallel(tasks, 4);
 * ```
 *
 * @keywords
 * pool, parallel, concurrency, async
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
export async function run_parallel(tasks, max_parallel = 4) {
  const results = [];
  const executing = new Set();
  let index = 0;

  async function run_next() {
    if (index >= tasks.length) return;
    const i = index++;
    const task = tasks[i];
    const promise = Promise.resolve().then(() => task()).then(result => {
      executing.delete(promise);
      results[i] = result;
    });
    executing.add(promise);
    if (executing.size >= max_parallel) {
      await Promise.race(executing);
    }
    await run_next();
  }

  await run_next();
  await Promise.all(executing);
  return results;
}

export async function run_with_limit(fn, items, limit = 4) {
  const tasks = items.map(item => () => fn(item));
  return run_parallel(tasks, limit);
}
