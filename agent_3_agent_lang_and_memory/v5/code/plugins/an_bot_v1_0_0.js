/**
 * an_bot_v1_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Conversation, command, session, task, approval, and automation interface.
 */

import action_entity from "./action_entity_v5_0_0.js";

class an_bot {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = new action_entity({ actor: this.config.actor });
  }

  create_session(config = {}) {
    return this.entities.create("bot_session", {
      name: `session_${Date.now()}`,
      data: { user: config.user || "anonymous", status: "active" }
    });
  }

  send_message(session_id, message) {
    const session = this.entities.read(session_id);
    if (!session) return null;
    this.entities.update(session_id, {
      data: { ...session.data, last_message: message, timestamp: new Date().toISOString() }
    });
    return this.entities.create("command", {
      name: `cmd_${Date.now()}`,
      data: { session_id, message, status: "received" }
    });
  }

  execute_command(command_id) {
    const command = this.entities.read(command_id);
    if (!command) return null;
    this.entities.update(command_id, { data: { ...command.data, status: "executed" } });
    return command;
  }

  end_session(session_id) {
    this.entities.update(session_id, { data: { status: "ended" } });
  }
}

export default an_bot;
export { an_bot };
