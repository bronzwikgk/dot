import { action_entity } from "../plugins/code_shared_action_entity_v3_1_0_draft.js";

class book_cell_operations {
  constructor(config = {}, ports = {}) {
    this.config = book_cell_operations.normalize_config(config);
    this.entities = ports.entities || new action_entity("book_cell_entities", {
      actor: this.config.actor
    });
    this.audit_records = [];
  }

  async create_book(config = {}) {
    const book = await this.entities.create({
      id: config.id,
      type: "book",
      name: config.name || config.id || "untitled_book",
      data: { title: config.title || config.name || "Untitled Book" },
      relationships: [],
      operations: ["create", "read", "update", "delete", "query"]
    });
    this.audit("create_book", book.data.id);
    return book_cell_operations.result(true, book.data, []);
  }

  async create_cell(config = {}) {
    const book_id = config.book_id;
    if (!book_id) return book_cell_operations.result(false, null, ["book_id is required"]);
    const order = await this.next_cell_order(book_id);
    const cell = await this.entities.create({
      id: config.id,
      type: "cell",
      name: config.name || config.id || `cell_${order}`,
      data: {
        book_id,
        cell_type: config.cell_type || "markdown",
        content: config.content || "",
        output: null,
        order
      },
      relationships: [{ type: "belongs_to", to: book_id }],
      operations: ["create", "read", "update", "delete", "execute"]
    });
    this.audit("create_cell", cell.data.id);
    return book_cell_operations.result(true, cell.data, []);
  }

  async update_cell(config = {}) {
    if (!config.id) return book_cell_operations.result(false, null, ["cell id is required"]);
    const current = await this.entities.read(config.id);
    const data = {
      ...current.data,
      cell_type: config.cell_type || current.data.cell_type,
      content: Object.prototype.hasOwnProperty.call(config, "content") ? config.content : current.data.content
    };
    const updated = await this.entities.update(config.id, { data });
    this.audit("update_cell", config.id);
    return book_cell_operations.result(true, updated.data, []);
  }

  async move_cell(config = {}) {
    if (!config.id) return book_cell_operations.result(false, null, ["cell id is required"]);
    if (!Number.isInteger(config.order) || config.order < 0) return book_cell_operations.result(false, null, ["order must be a non-negative integer"]);
    const cell = await this.entities.read(config.id);
    const siblings = await this.cells_for_book(cell.data.book_id);
    const reordered = siblings.filter((item) => item.id !== config.id);
    reordered.splice(config.order, 0, cell);
    for (let index = 0; index < reordered.length; index += 1) {
      await this.entities.update(reordered[index].id, { data: { ...reordered[index].data, order: index } });
    }
    this.audit("move_cell", config.id);
    return book_cell_operations.result(true, { type: "cell_order", book_id: cell.data.book_id, cell_ids: reordered.map((item) => item.id) }, []);
  }

  async remove_cell(config = {}) {
    if (!config.id) return book_cell_operations.result(false, null, ["cell id is required"]);
    const cell = await this.entities.read(config.id);
    await this.entities.delete(config.id);
    const siblings = await this.cells_for_book(cell.data.book_id);
    for (let index = 0; index < siblings.length; index += 1) {
      await this.entities.update(siblings[index].id, { data: { ...siblings[index].data, order: index } });
    }
    this.audit("remove_cell", config.id);
    return book_cell_operations.result(true, { removed_id: config.id, book_id: cell.data.book_id }, []);
  }

  async execute_cell(config = {}) {
    if (!config.id) return book_cell_operations.result(false, null, ["cell id is required"]);
    const cell = await this.entities.read(config.id);
    const kind = cell.data.cell_type || "markdown";
    if (kind === "code" && config.confirmed !== true) {
      return book_cell_operations.result(false, null, ["code cell execution requires confirmation"]);
    }
    const output = this.create_output(cell, config);
    await this.entities.update(config.id, { data: { ...cell.data, output } });
    this.audit("execute_cell", config.id);
    return book_cell_operations.result(true, {
      type: "cell_execution",
      cell_id: config.id,
      output
    }, []);
  }

  async clear_cell_output(config = {}) {
    if (!config.id) return book_cell_operations.result(false, null, ["cell id is required"]);
    const cell = await this.entities.read(config.id);
    const updated = await this.entities.update(config.id, { data: { ...cell.data, output: null } });
    this.audit("clear_cell_output", config.id);
    return book_cell_operations.result(true, updated.data, []);
  }

  create_output(cell = {}, config = {}) {
    const kind = cell.data.cell_type || "markdown";
    const content = cell.data.content || "";
    let value = content;
    if (kind === "markdown") value = { rendered_text: content };
    if (kind === "natural_language") value = { response: content.trim() ? `noted: ${content}` : "noted" };
    if (kind === "code") value = { execution_mode: "confirmed", source_length: content.length };
    return {
      type: "cell_output",
      cell_id: cell.id,
      cell_type: kind,
      value,
      created_at: this.config.clock()
    };
  }

  async next_cell_order(book_id) {
    const cells = await this.cells_for_book(book_id);
    return cells.length;
  }

  async cells_for_book(book_id) {
    const result = await this.entities.query({ relationship: book_id });
    return result.data
      .filter((entity) => entity.type === "cell")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  }

  audit(action, entity_id) {
    this.audit_records.push({
      type: "audit_log",
      action,
      entity_id,
      actor: this.config.actor,
      created_at: this.config.clock()
    });
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      clock: book_cell_operations.is_callable(config.clock) ? config.clock : () => new Date().toISOString()
    };
  }

  static result(ok, data, errors) {
    return { ok, data: book_cell_operations.clone_value(data), errors: errors || [] };
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static is_callable(value) {
    const tag = Object.prototype.toString.call(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]";
  }
}

export { book_cell_operations };
export default book_cell_operations;
