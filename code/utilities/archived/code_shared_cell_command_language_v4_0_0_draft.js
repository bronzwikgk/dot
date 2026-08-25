/**
 * code_shared_cell_command_language_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: contract_010_an_app_lang
 * 
 * Cell command language - uses existing parser infrastructure.
 */

import { action_entity } from "../plugins/code_shared_action_entity_v4_0_0_draft.js";

class cell_command_language {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = config.entities || new action_entity("cell_commands", { actor: this.config.actor });
  }

  async parse_command(text) {
    const parts = text.trim().split(/\s+/);
    const command = parts[0] || "";
    const args = parts.slice(1);
    
    return this.entities.create({
      type: "parsed_command",
      name: command,
      data: { command, args, raw: text },
      operations: ["read", "execute"]
    });
  }

  async execute_command(command_id) {
    const result = await this.entities.read(command_id);
    if (!result.ok) return result;
    await this.entities.update(command_id, { executed_at: new Date().toISOString() });
    return { ok: true, data: result.data, errors: [] };
  }
}

export default cell_command_language;
export { cell_command_language };
