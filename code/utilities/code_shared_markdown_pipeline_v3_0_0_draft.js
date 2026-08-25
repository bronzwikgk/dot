class markdown_pipeline {
  constructor(config = {}) {
    this.config = config;
  }

  decompose(markdown = "") {
    const lines = String(markdown).split(/\r?\n/);
    const blocks = [];
    for (const line of lines) {
      const heading = /^(#{1,6})\s+(.*)$/.exec(line);
      if (heading) {
        blocks.push({ kind: "heading", level: heading[1].length, text: heading[2], children: [] });
      } else if (/^\s*[-*]\s+/.test(line)) {
        blocks.push({ kind: "list_item", text: line.replace(/^\s*[-*]\s+/, "") });
      } else if (line.trim()) {
        blocks.push({ kind: "paragraph", text: line.trim() });
      }
    }
    return blocks;
  }

  compose(blocks = []) {
    return blocks.map((block) => {
      if (block.kind === "heading") return `${"#".repeat(block.level || 1)} ${block.text}`;
      if (block.kind === "list_item") return `- ${block.text}`;
      return block.text || "";
    }).join("\n");
  }

  parse(markdown = "") {
    return { kind: "markdown_doc", blocks: this.decompose(markdown) };
  }

  run(markdown = "") {
    const parsed = this.parse(markdown);
    return { parsed, text: this.compose(parsed.blocks) };
  }
}

export { markdown_pipeline };
export default markdown_pipeline;
