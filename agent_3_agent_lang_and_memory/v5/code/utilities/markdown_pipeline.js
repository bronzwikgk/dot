// markdown_pipeline.js
// Markdown pipeline utility

class markdown_pipeline {
  constructor(config = {}) {
    this.config = config;
  }

  parse(text) {
    if (!text) return [];
    const lines = text.split("\n");
    return lines.map(line => ({ type: "line", content: line }));
  }

  render(blocks) {
    if (!blocks) return "";
    return blocks.map(b => b.content || "").join("\n");
  }

  extract_headings(blocks) {
    if (!blocks) return [];
    return blocks.filter(b => b.content && b.content.startsWith("#"));
  }
}

export default markdown_pipeline;
export { markdown_pipeline };
