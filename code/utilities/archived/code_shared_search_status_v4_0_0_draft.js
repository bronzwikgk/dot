class search_status {
  constructor(config = {}) {
    this.config = search_status.normalize_config(config);
    this.state = {
      type: "search_state",
      query: "",
      hits: [],
      active_index: -1
    };
    this.status_records = [];
  }

  search_workspace(config = {}) {
    const query = String(config.query || "").trim().toLowerCase();
    const records = search_status.normalize_list(config.records);
    const hits = [];
    if (query) {
      for (const record of records) {
        const text = search_status.record_text(record);
        if (text.toLowerCase().includes(query)) {
          hits.push({
            type: "search_hit",
            id: record.id || `hit_${hits.length + 1}`,
            label: record.name || record.id || "unnamed",
            query,
            record_type: record.type || "entity",
            score: query.length / Math.max(text.length, query.length)
          });
        }
      }
    }
    this.state = {
      type: "search_state",
      query,
      hits,
      active_index: hits.length > 0 ? 0 : -1
    };
    this.update_status({
      message: hits.length === 1 ? "1 search result" : `${hits.length} search results`,
      level: "info"
    });
    return search_status.result(true, this.state, []);
  }

  mark_search_hits(config = {}) {
    const hit_ids = search_status.normalize_list(config.hits || this.state.hits).map((hit) => hit.id);
    return search_status.result(true, { query: this.state.query, hit_ids, count: hit_ids.length }, []);
  }

  clear_search_hits() {
    this.state = { type: "search_state", query: "", hits: [], active_index: -1 };
    this.update_status({ message: "search cleared", level: "info" });
    return search_status.result(true, this.state, []);
  }

  move_to_next_hit() {
    if (this.state.hits.length === 0) return search_status.result(false, null, ["no search hits"]);
    this.state.active_index = (this.state.active_index + 1) % this.state.hits.length;
    return search_status.result(true, {
      active_index: this.state.active_index,
      hit: this.state.hits[this.state.active_index]
    }, []);
  }

  update_status(config = {}) {
    const record = {
      type: "status_message",
      level: config.level || "info",
      message: config.message || "",
      created_at: this.config.clock()
    };
    this.status_records.push(record);
    return search_status.result(true, record, []);
  }

  report_error_status(config = {}) {
    return this.update_status({
      level: "error",
      message: config.message || search_status.error_message(config.error || "unknown error")
    });
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      clock: search_status.is_callable(config.clock) ? config.clock : () => new Date().toISOString()
    };
  }

  static record_text(record = {}) {
    return JSON.stringify(record);
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static result(ok, data, errors) {
    return { ok, data: search_status.clone_value(data), errors: errors || [] };
  }

  static error_message(error) {
    return error && error.message ? error.message : String(error);
  }

  static is_callable(value) {
    const tag = Object.prototype.toString.call(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]";
  }
}

export { search_status };
export default search_status;
