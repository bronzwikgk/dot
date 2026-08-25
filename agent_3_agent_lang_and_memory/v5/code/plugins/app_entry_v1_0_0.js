/**
 * app_entry_v1_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Entry point - loads definition, initializes shell, boots runtime
 */

import app_shell from "./app_shell_v4_0_0.js";

class app_entry {
  constructor(config = {}) {
    this.config = config;
    this.shell = null;
  }

  async boot(app_config = {}) {
    this.shell = new app_shell({ actor: this.config.actor || "system" });
    const app = this.shell.boot(app_config);
    return { ok: true, app, shell: this.shell };
  }

  get_shell() {
    return this.shell;
  }
}

export default app_entry;
export { app_entry };
