/**
 * @objective: Transform flat tokens into a hierarchical AST based on grammar shapes.
 * @roadmap: Part of the ourActionLang v2.2.0 deterministic pipeline.
 * @use_cases: Structural analysis of natural language intent.
 * @constraints: Deterministic recursive descent. No AI.
 */
export class ourActionLang_Parser_v2_2_0_ready_Gem {
  constructor(config = {}) {
    this.shapes = config.rules?.shapes ?? [];
    this.directiveKeywords = new Set([
      "def",
      "ui",
      "flow",
      "rule",
      "fact",
      "note",
      "test",
      "meta"
    ]);
  }

  parse(tokens) {
    if (!tokens || tokens.length === 0) return { type: 'root', children: [] };

    const ast = { type: 'root', children: [] };
    let currentIndex = 0;

    while (currentIndex < tokens.length) {
      const match = this.matchShape(tokens, currentIndex);
      if (match) {
        ast.children.push({
          ...match.node,
          id: `ast_node_${ast.children.length}`,
          meta: { startIndex: currentIndex, endIndex: match.nextIndex - 1 }
        });
        currentIndex = match.nextIndex;
      } else {
        // Fallback: literal/unknown node
        ast.children.push({
          id: `ast_node_${ast.children.length}`,
          type: 'literal',
          value: tokens[currentIndex].canonical,
          token_id: tokens[currentIndex].token_id,
          meta: { index: currentIndex }
        });
        currentIndex++;
      }
    }

    return ast;
  }

  parseDirectives(input) {
    if (!input || typeof input !== "string") {
      return { type: "root", parseMode: "directive", children: [] };
    }

    const lines = input.split(/\r?\n/);
    const ast = { type: "root", parseMode: "directive", children: [] };
    const directivePattern = /^\s*-\s*@([a-z]+)\s*:\s*(.*)$/i;

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const match = line.match(directivePattern);
      if (!match) {
        continue;
      }

      const keyword = match[1].toLowerCase();
      const content = (match[2] ?? "").trim();
      const knownKeyword = this.directiveKeywords.has(keyword);

      ast.children.push({
        id: `directive_${i}`,
        type: `directive_${keyword}`,
        attributes: {
          keyword,
          content,
          known_keyword: knownKeyword
        },
        meta: {
          line: i + 1,
          raw: line
        }
      });
    }

    return ast;
  }

  matchShape(tokens, start) {
    for (const shape of this.shapes) {
      const result = this.tryShape(tokens, start, shape);
      if (result) return { node: result.node, nextIndex: result.nextIndex };
    }
    return null;
  }

  tryShape(tokens, start, shape) {
    const node = { type: shape.name, attributes: {} };
    let current = start;

    for (const pattern of shape.patterns) {
      if (current >= tokens.length) {
        if (pattern.optional) continue;
        return null;
      }

      const token = tokens[current];
      
      // Match by token_id or canonical string
      const isMatch = (pattern.token_id && token.token_id === pattern.token_id) ||
                      (pattern.canonical && token.canonical === pattern.canonical);

      if (isMatch) {
        if (pattern.attr) {
          node.attributes[pattern.attr] = token.canonical;
        }
        current++;
      } else if (pattern.optional) {
        continue;
      } else {
        return null;
      }
    }

    return { node, nextIndex: current };
  }
}
