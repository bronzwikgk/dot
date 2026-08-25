import { parser_intent_actions } from "./dataset/code_shared_validation_word_datasets_v3_0_0_draft.js";

class entity_parser {
  constructor(config = {}) {
    this.config = config;
  }

  parse(text = "") {
    if (text === null || text === undefined) text = "";
    const tokens = this.tokenize(text);
    const entities = [];
    for (let index = 0; index < tokens.length; index += 1) {
      if (tokens[index] === "create" && parser_intent_actions.includes("create") && tokens[index + 1]) {
        const type = tokens[index + 1];
        const name = this.pick_name(tokens, index + 2, type);
        entities.push({ action: "create", type, name });
      }
      if (tokens[index] === "link" && parser_intent_actions.includes("link") && tokens[index + 1] && tokens[index + 2]) {
        entities.push({ action: "link", from: tokens[index + 1], to: tokens[index + 2] });
      }
    }
    return { kind: "entity_intent", tokens, entities };
  }

  pick_name(tokens, start_index, fallback) {
    const skip_words = this.config.name_skip_words || ["called", "named", "as", "with", "the", "a", "an"];
    for (let index = start_index; index < tokens.length; index += 1) {
      if (!skip_words.includes(tokens[index])) return tokens[index];
    }
    return fallback;
  }

  tokenize(text = "") {
    return String(text).toLowerCase().match(/[a-z0-9_./-]+/g) || [];
  }
}

export { entity_parser };
export default entity_parser;
