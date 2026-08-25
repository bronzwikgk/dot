/**
 * code_shared_static_server_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_contract_008 (local static server hardening)
 *
 * Local server utility with no-cache policy and port/env handling.
 */

class static_server {
  constructor(config = {}) {
    this.config = { port: config.port || 3000, no_cache: config.no_cache !== false, ...config };
    this.routes = new Map();
    this.status = 'stopped';
  }

  add_route(path, handler) {
    this.routes.set(path, handler);
    return { ok: true };
  }

  start() {
    this.status = 'running';
    return { ok: true, port: this.config.port, no_cache: this.config.no_cache };
  }

  stop() {
    this.status = 'stopped';
    return { ok: true };
  }

  get_headers() {
    const headers = { 'Content-Type': 'text/html' };
    if (this.config.no_cache) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }
    return headers;
  }

  validate_config() {
    const errors = [];
    if (!this.config.port || this.config.port < 1 || this.config.port > 65535) errors.push('invalid port');
    return { ok: errors.length === 0, errors };
  }

  get_status() { return this.status; }
  list_routes() { return [...this.routes.keys()]; }
}

export { static_server };
