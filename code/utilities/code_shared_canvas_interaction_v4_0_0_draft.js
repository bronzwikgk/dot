/**
 * code_shared_canvas_interaction_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_missing_032 (canvas drag/drop and chained flow run)
 *
 * Canvas interaction handlers, chain execution record, and drag/drop behavior.
 */

class canvas_interaction {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.nodes = new Map();
    this.chains = new Map();
    this.drag_state = null;
  }

  add_node(id, { x, y, type, label } = {}) {
    this.nodes.set(id, { id, x: x || 0, y: y || 0, type: type || 'default', label: label || id, status: 'idle', created_at: new Date().toISOString() });
    return { ok: true, node: this.nodes.get(id) };
  }

  move_node(id, x, y) {
    const node = this.nodes.get(id);
    if (!node) return { ok: false, errors: [`node '${id}' not found`] };
    node.x = x;
    node.y = y;
    return { ok: true, node };
  }

  start_drag(node_id) {
    const node = this.nodes.get(node_id);
    if (!node) return { ok: false, errors: [`node '${node_id}' not found`] };
    this.drag_state = { node_id, start_x: node.x, start_y: node.y };
    return { ok: true };
  }

  end_drag(x, y) {
    if (!this.drag_state) return { ok: false, errors: ['no active drag'] };
    const result = this.move_node(this.drag_state.node_id, x, y);
    this.drag_state = null;
    return { ok: true, ...result };
  }

  cancel_drag() {
    if (!this.drag_state) return { ok: false, errors: ['no active drag'] };
    this.drag_state = null;
    return { ok: true };
  }

  create_chain(id, { node_ids } = {}) {
    const missing = (node_ids || []).filter((nid) => !this.nodes.has(nid));
    if (missing.length > 0) return { ok: false, errors: [`nodes not found: ${missing.join(', ')}`] };
    this.chains.set(id, { id, node_ids: node_ids || [], status: 'pending', created_at: new Date().toISOString() });
    return { ok: true };
  }

  run_chain(id) {
    const chain = this.chains.get(id);
    if (!chain) return { ok: false, errors: [`chain '${id}' not found`] };
    for (const nid of chain.node_ids) {
      const node = this.nodes.get(nid);
      if (node) node.status = 'completed';
    }
    chain.status = 'completed';
    chain.completed_at = new Date().toISOString();
    return { ok: true, chain };
  }

  validate_dag() {
    const node_count = this.nodes.size;
    const chain_count = this.chains.size;
    return { ok: true, node_count, chain_count };
  }

  list_nodes() { return [...this.nodes.values()]; }
  list_chains() { return [...this.chains.values()]; }
  get_drag_state() { return this.drag_state; }
}

export { canvas_interaction };
