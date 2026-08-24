/**
 * @entity terminal_renderer
 *
 * @meta
 * project: an_app
 * file_name: src/plugins/providers/display/terminal_renderer/index.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * CLI display provider outputting plain text to console
 *
 * @purpose_and_problem_statement
 * Renders entities as formatted plain text to the terminal for CLI-based interaction
 *
 * @usage
 * ```js
 * display_entity({ entity: { name: "test", value: 42 }, title: "Result" });
 * ```
 *
 * @timing
 * Runs when plugin is activated; display operations available on demand throughout session
 *
 * @scope_boundaries
 * in_scope: plain-text console output with key-value formatting
 * out_of_scope: rich UI rendering, HTML output, graphical displays
 *
 * @dependencies
 * - None
 *
 * @keywords
 * display, terminal, cli, renderer, console, plain text
 *
 * @invariants
 * - Null or undefined entities return empty string
 * - Objects are serialized with aligned key-value columns
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */

export const manifest = {
  id: "provider_display_terminal",
  version: "1.0.0",
  requires: [],
  permissions: ["display.write"],
  provides: {
    types: ["display"],
    traits: ["renderable"],
    operations: ["display_entity", "format_entity"],
    stage_handlers: [],
  },
};

export function activate(ctx) {
  function display_entity({ entity, title }) {
    const formatted = format_entity({ entity });
    const header = title ? `\n--- ${title} ---` : "";
    console.log(`${header}\n${formatted}`);
    return { success: true };
  }

  function format_entity({ entity }) {
    if (entity == null) return "";
    if (typeof entity === "string") return entity;

    const lines = [];
    const entries = Object.entries(entity);
    const max_key = entries.reduce(
      (max, [k]) => Math.max(max, k.length),
      0
    );

    for (const [key, value] of entries) {
      const display_val =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      lines.push(`${key.padEnd(max_key)}: ${display_val}`);
    }

    return lines.join("\n");
  }

  const operations = { display_entity, format_entity };

  for (const [name, fn] of Object.entries(operations)) {
    ctx.register_operation(name, fn);
  }

  return {};
}

export function deactivate(ctx) {
  ctx.unregister_operations(["display_entity", "format_entity"]);
}
