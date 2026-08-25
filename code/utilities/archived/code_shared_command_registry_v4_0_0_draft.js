/**
 * code_shared_command_registry_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: contract_010_an_app_lang
 * 
 * Command registry - now uses action_entity for storage.
 */

import { action_entity } from "../plugins/code_shared_action_entity_v4_0_0_draft.js";

class command_registry {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = config.entities || new action_entity("command_registry", { actor: this.config.actor });
  }

  async register_command(command) {
    return this.entities.create({
      type: "command",
      name: command.name,
      data: {
        label: command.label || command.name,
        icon: command.icon || null,
        action: command.action || null,
        shortcut: command.shortcut || null
      },
      operations: ["read", "update", "delete", "execute"]
    });
  }

  async get_command(id) {
    return this.entities.read(id);
  }

  async list_commands() {
    return this.entities.query({ type: "command" });
  }

  async execute_command(id) {
    const result = await this.entities.read(id);
    if (!result.ok) return result;
    await this.entities.update(id, { last_executed: new Date().toISOString() });
    return { ok: true, data: result.data, errors: [] };
  }
}

export default command_registry;
export { command_registry };
