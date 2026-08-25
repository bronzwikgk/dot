// entity_parser.js
// Entity parser utility

class entity_parser {
  constructor(config = {}) {
    this.config = config;
  }

  parse(text) {
    if (!text) return null;
    const parts = text.trim().split(/\s+/);
    const action = parts[0] || "";
    const args = parts.slice(1);
    return { action, args, raw: text };
  }

  tokenize(text) {
    if (!text) return [];
    return text.trim().split(/\s+/).filter(t => t.length > 0);
  }

  pick_name(tokens, start = 0, fallback = "unnamed") {
    if (!tokens || tokens.length === 0) return fallback;
    const name = tokens.slice(start).join(" ");
    return name || fallback;
  }
}

export default entity_parser;
export { entity_parser };
