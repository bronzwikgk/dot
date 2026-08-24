/**
 * @entity traverse_utility
 *
 * @meta
 * project: an_app
 * file_name: src/utility/traverse.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * tree walking, flatten, and depth helpers for nested structures.
 *
 * @usage
 * ```js
 * const flat = flatten_tree(root, 'children');
 * const depth = get_depth(root, 'children');
 * ```
 *
 * @keywords
 * traverse, tree, flatten, depth
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
export function flatten_tree(nodes, child_key = 'children') {
  const result = [];
  function walk(list) {
    for (const node of list) {
      result.push(node);
      if (node[child_key] && Array.isArray(node[child_key])) {
        walk(node[child_key]);
      }
    }
  }
  if (Array.isArray(nodes)) walk(nodes);
  else if (nodes) walk([nodes]);
  return result;
}

export function get_depth(node, child_key = 'children') {
  if (!node || !node[child_key] || node[child_key].length === 0) return 0;
  return 1 + Math.max(...node[child_key].map(c => get_depth(c, child_key)));
}

export function walk_tree(node, visitor, child_key = 'children') {
  visitor(node);
  if (node[child_key] && Array.isArray(node[child_key])) {
    for (const child of node[child_key]) {
      walk_tree(child, visitor, child_key);
    }
  }
}

export function filter_tree(nodes, predicate, child_key = 'children') {
  const result = [];
  walk_tree({ [child_key]: nodes }, (node) => {
    if (node[child_key]) return;
    if (predicate(node)) result.push(node);
  }, child_key);
  return result;
}
