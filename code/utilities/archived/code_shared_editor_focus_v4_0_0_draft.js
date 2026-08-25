class editor_focus {
  constructor(config = {}) {
    this.config = editor_focus.normalize_config(config);
    this.state = {
      mode: "command",
      active_cell_id: null,
      focus: null,
      render_records: []
    };
  }

  enter_edit_mode(config = {}) {
    this.state.mode = "edit";
    this.state.active_cell_id = config.cell_id || this.state.active_cell_id;
    return editor_focus.result(true, this.create_editor_state(), []);
  }

  exit_edit_mode(config = {}) {
    this.state.mode = "command";
    if (config.clear_active_cell) this.state.active_cell_id = null;
    return editor_focus.result(true, this.create_editor_state(), []);
  }

  capture_focus(config = {}) {
    const focus = {
      type: "focus_state",
      cell_id: config.cell_id || this.state.active_cell_id || null,
      selector: config.selector || null,
      selection_start: editor_focus.number_or_null(config.selection_start),
      selection_end: editor_focus.number_or_null(config.selection_end),
      captured_at: this.config.clock()
    };
    this.state.focus = focus;
    return editor_focus.result(true, focus, []);
  }

  restore_focus(config = {}) {
    const focus = config.focus || this.state.focus;
    if (!focus) return editor_focus.result(false, null, ["focus state is required"]);
    if (focus.cell_id && this.state.active_cell_id && focus.cell_id !== this.state.active_cell_id) {
      return editor_focus.result(false, null, ["focus cell does not match active cell"]);
    }
    return editor_focus.result(true, { ...editor_focus.clone_value(focus), restored_at: this.config.clock() }, []);
  }

  sync_cell_view(config = {}) {
    const cell = config.cell || {};
    const previous = config.previous || {};
    const preserve_active = this.state.mode === "edit" && this.state.active_cell_id === cell.id;
    const record = {
      type: "render_sync_record",
      cell_id: cell.id || null,
      preserve_active,
      should_rebuild: !preserve_active && JSON.stringify(cell) !== JSON.stringify(previous),
      synced_at: this.config.clock()
    };
    this.state.render_records.push(record);
    return editor_focus.result(true, record, []);
  }

  validate_cell_row_layout(config = {}) {
    const errors = [];
    if (!config || typeof config !== "object" || Array.isArray(config)) errors.push("layout config must be an object");
    if (config.rail_inside_content === true) errors.push("cell rail must be outside cell content");
    if (config.rail_overlaps_content === true) errors.push("cell rail must not overlap content");
    if (config.content_min_width_zero !== true) errors.push("cell content must allow min width zero");
    if (config.row_display && !["grid", "flex"].includes(config.row_display)) errors.push("cell row display must be grid or flex");
    return editor_focus.result(errors.length === 0, {
      type: "cell_row",
      rail: { type: "cell_rail", outside_content: config.rail_inside_content !== true },
      content_min_width_zero: config.content_min_width_zero === true
    }, errors);
  }

  can_handle_keyboard(config = {}) {
    if (config.combo === "escape") return editor_focus.result(true, { action: "exit_edit_mode" }, []);
    if (config.combo === "ctrl+s" && this.state.mode === "edit") return editor_focus.result(true, { action: "save_edit" }, []);
    if (config.combo === "ctrl+s") return editor_focus.result(false, null, ["save requires edit mode"]);
    return editor_focus.result(false, null, ["keyboard combo is not handled by editor focus"]);
  }

  create_editor_state() {
    return {
      type: "editor_state",
      mode: this.state.mode,
      active_cell_id: this.state.active_cell_id
    };
  }

  static normalize_config(config = {}) {
    return {
      actor: config.actor || "agent_codex_an_app",
      clock: editor_focus.is_callable(config.clock) ? config.clock : () => new Date().toISOString()
    };
  }

  static number_or_null(value) {
    return Number.isFinite(value) ? value : null;
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static result(ok, data, errors) {
    return { ok, data: editor_focus.clone_value(data), errors: errors || [] };
  }

  static is_callable(value) {
    const tag = Object.prototype.toString.call(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]";
  }
}

export { editor_focus };
export default editor_focus;
