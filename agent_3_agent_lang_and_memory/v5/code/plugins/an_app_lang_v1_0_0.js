/**
 * an_app_lang_v1_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Language and grammar layer that parses natural English, structured text,
 * DSL-like patterns, commands, and templates into records.
 */

import action_entity from "./action_entity_v5_0_0.js";

class an_app_lang {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = new action_entity({ actor: this.config.actor });
  }

  parse(text) {
    if (!text) return null;
    const tokens = text.trim().split(/\s+/);
    const command = tokens[0] || "";
    const args = tokens.slice(1);
    return this.entities.create("parse_tree", {
      name: `parse_${Date.now()}`,
      data: { command, args, raw: text, token_count: tokens.length }
    });
  }

  to_ast(parse_tree) {
    if (!parse_tree) return null;
    return this.entities.create("ast_record", {
      name: `ast_${parse_tree.id}`,
      data: { parse_tree_id: parse_tree.id, type: "ast" }
    });
  }

  classify(ast_record) {
    if (!ast_record) return null;
    return this.entities.create("intent", {
      name: `intent_${ast_record.id}`,
      data: { ast_id: ast_record.id, type: "user_intent" }
    });
  }

  pipeline(text) {
    const parse_tree = this.parse(text);
    const ast = this.to_ast(parse_tree);
    const intent = this.classify(ast);
    return { parse_tree, ast, intent };
  }
}

export default an_app_lang;
export { an_app_lang };
