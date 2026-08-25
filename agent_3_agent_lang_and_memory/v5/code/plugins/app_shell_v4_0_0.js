/**
 * app_shell_v4_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Runtime shell - loads definition, config, routes, mounts UI
 */

import action_entity from "./action_entity_v5_0_0.js";

class app_shell {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = new action_entity({ actor: this.config.actor });
    this.routes = new Map();
    this.mounted = new Map();
  }

  boot(app_config = {}) {
    const app = this.entities.create("application", {
      name: app_config.name || "untitled_app",
      data: app_config
    });
    return app;
  }

  register_route(path, handler) {
    this.routes.set(path, handler);
  }

  navigate(path) {
    const handler = this.routes.get(path);
    if (!handler) return { ok: false, errors: [`Route ${path} not found`] };
    return { ok: true, path };
  }

  mount(component, container) {
    this.mounted.set(component.id, { component, container });
    return { ok: true, id: component.id };
  }

  unmount(id) {
    this.mounted.delete(id);
    return { ok: true };
  }

  get_mounted() {
    return Array.from(this.mounted.values());
  }
}

export default app_shell;
export { app_shell };
