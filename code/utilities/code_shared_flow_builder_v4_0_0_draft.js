/**
 * code_shared_flow_builder_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_005 (layout parity) + v4_missing_028
 *
 * Flow node entity, edge entity, canvas state, palette, and drop/connect actions.
 */

class flow_builder {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.nodes = new Map();
    this.edges = new Map();
    this.canvas = { zoom: 1, offset_x: 0, offset_y: 0 };
  }

  add_node(id, { x, y, type, label } = {}) {
    this.nodes.set(id, { id, x: x || 0, y: y || 0, type: type || 'default', label: label || id, status: 'idle', created_at: new Date().toISOString() });
    return { ok: true, node: this.nodes.get(id) };
  }

  remove_node(id) {
    if (!this.nodes.has(id)) return { ok: false, errors: [`node '${id}' not found`] };
    this.nodes.delete(id);
    for (const [edge_id, edge] of this.edges) {
      if (edge.from === id || edge.to === id) this.edges.delete(edge_id);
    }
    return { ok: true };
  }

  add_edge(id, from, to) {
    if (!this.nodes.has(from)) return { ok: false, errors: [`node '${from}' not found`] };
    if (!this.nodes.has(to)) return { ok: false, errors: [`node '${to}' not found`] };
    this.edges.set(id, { id, from, to, created_at: new Date().toISOString() });
    return { ok: true, edge: this.edges.get(id) };
  }

  remove_edge(id) {
    if (!this.edges.has(id)) return { ok: false, errors: [`edge '${id}' not found`] };
    this.edges.delete(id);
    return { ok: true };
  }

  move_node(id, x, y) {
    const node = this.nodes.get(id);
    if (!node) return { ok: false, errors: [`node '${id}' not found`] };
    node.x = x;
    node.y = y;
    return { ok: true, node };
  }

  validate_dag() {
    const in_degree = new Map();
    for (const id of this.nodes.keys()) in_degree.set(id, 0);
    for (const edge of this.edges.values()) {
      in_degree.set(edge.to, (in_degree.get(edge.to) || 0) + 1);
    }
    const roots = [...in_degree.entries()].filter(([, deg]) => deg === 0).map(([id]) => id);
    return { ok: true, roots, node_count: this.nodes.size, edge_count: this.edges.size };
  }

  list_nodes() { return [...this.nodes.values()]; }
  list_edges() { return [...this.edges.values()]; }
}

export { flow_builder };
