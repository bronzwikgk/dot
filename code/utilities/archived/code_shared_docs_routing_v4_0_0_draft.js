/**
 * code_shared_docs_routing_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_008 (docs routing and deep links)
 *
 * Docs route entity, docs surface, and deep-link validation.
 */

class docs_routing {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.routes = new Map();
    this.selected_route = null;
  }

  register_route(id, { title, module_path, hash } = {}) {
    if (this.routes.has(id)) return { ok: false, errors: [`route '${id}' already exists`] };
    this.routes.set(id, { id, title: title || id, module_path: module_path || null, hash: hash || null, created_at: new Date().toISOString() });
    return { ok: true };
  }

  navigate(route_id) {
    const route = this.routes.get(route_id);
    if (!route) return { ok: false, errors: [`route '${route_id}' not found`] };
    this.selected_route = route_id;
    return { ok: true, route };
  }

  get_deep_link(route_id) {
    const route = this.routes.get(route_id);
    if (!route) return null;
    return `#${route.hash || route_id}`;
  }

  validate_routes() {
    const route_list = [...this.routes.values()];
    const missing_path = route_list.filter((r) => !r.module_path);
    return { ok: missing_path.length === 0, routes_without_path: missing_path, total: route_list.length };
  }

  list_routes() { return [...this.routes.values()]; }
}

export { docs_routing };
