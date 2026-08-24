/**
 * @entity collection_utility
 *
 * @meta
 * project: an_app
 * file_name: src/utility/collection.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * group_by, sort_by, unique, deep_merge helpers for arrays and objects.
 *
 * @usage
 * ```js
 * const groups = group_by(items, 'type');
 * const sorted = sort_by(items, 'name');
 * const merged = deep_merge(a, b);
 * ```
 *
 * @keywords
 * collection, group, sort, unique, merge
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
export function group_by(items, key) {
  const result = {};
  for (const item of items) {
    const k = typeof key === 'function' ? key(item) : item[key];
    if (!result[k]) result[k] = [];
    result[k].push(item);
  }
  return result;
}

export function sort_by(items, key, direction = 'ascending') {
  return [...items].sort((a, b) => {
    const a_val = typeof key === 'function' ? key(a) : a[key];
    const b_val = typeof key === 'function' ? key(b) : b[key];
    const cmp = a_val < b_val ? -1 : a_val > b_val ? 1 : 0;
    return direction === 'descending' ? -cmp : cmp;
  });
}

export function unique(items, key) {
  if (!key) return [...new Set(items)];
  const seen = new Set();
  return items.filter(item => {
    const k = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function deep_merge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deep_merge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
