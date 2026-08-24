/**
 * @entity topo_sort_utility
 *
 * @meta
 * project: an_app
 * file_name: src/utility/topo_sort.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * topological sort and cycle detection for dependency graphs.
 *
 * @usage
 * ```js
 * const sorted = topological_sort(nodes, get_deps);
 * const has_cycle = detect_cycle(nodes, get_deps);
 * ```
 *
 * @keywords
 * topological, sort, cycle, dependency, graph
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
export function topological_sort(nodes, get_deps) {
  const visited = new Set();
  const visiting = new Set();
  const result = [];

  function visit(node) {
    const id = typeof node === 'string' ? node : node.id;
    if (visited.has(id)) return;
    if (visiting.has(id)) throw new Error(`Cycle detected involving ${id}`);
    visiting.add(id);
    const deps = get_deps(node);
    for (const dep of (deps || [])) {
      const dep_node = typeof dep === 'string' ? dep : dep;
      visit(dep_node);
    }
    visiting.delete(id);
    visited.add(id);
    result.push(node);
  }

  for (const node of nodes) {
    visit(node);
  }
  return result;
}

export function detect_cycle(nodes, get_deps) {
  try {
    topological_sort(nodes, get_deps);
    return false;
  } catch (e) {
    return e.message.startsWith('Cycle detected');
  }
}
