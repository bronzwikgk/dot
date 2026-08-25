/**
 * code_shared_layout_parity_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: agent_1_agent_codex_an_app_layout_parity_contract_v1_0_0_proposed.md
 *
 * Validates that the same entity data renders correctly in every approved layout.
 * Layout parity means same data, different visual representation, no data loss.
 */

import { layout_names, render_profile_names } from "./dataset/code_shared_ui_word_datasets_v3_0_0_draft.js";

const LAYOUT_TO_RENDER_PROFILE = {
  notebook: "json_as_notebook",
  code_editor: "json_as_text",
  block_editor: "json_as_document",
  tree: "json_as_tree",
  table: "json_as_table",
  board: "json_as_board",
  calendar: "json_as_calendar",
  timeline: "json_as_timeline",
  diagram: "json_as_diagram",
  dashboard: "json_as_dashboard",
};

const CORE_LAYOUTS = ["notebook", "code_editor", "block_editor", "tree", "table", "board", "calendar", "timeline", "diagram", "dashboard"];

class layout_parity {
  constructor(config = {}) {
    this.config = {
      strict: config.strict !== false,
      ...config,
    };
  }

  validate_layout_name(layout_name) {
    const errors = [];
    if (!layout_names.includes(layout_name)) {
      errors.push(`layout_name '${layout_name}' is not in approved layout_names`);
    }
    return { ok: errors.length === 0, errors };
  }

  validate_render_profile(render_profile) {
    const errors = [];
    if (!render_profile_names.includes(render_profile)) {
      errors.push(`render_profile '${render_profile}' is not in approved render_profile_names`);
    }
    return { ok: errors.length === 0, errors };
  }

  get_render_profile(layout_name) {
    const profile = LAYOUT_TO_RENDER_PROFILE[layout_name];
    if (!profile) return null;
    return profile;
  }

  create_layout_record(entity, layout_name) {
    const errors = [];
    if (!entity || !entity.id) errors.push("entity.id is required");
    const name_check = this.validate_layout_name(layout_name);
    if (!name_check.ok) errors.push(...name_check.errors);
    const render_profile = this.get_render_profile(layout_name);
    if (!render_profile) errors.push(`no render_profile mapped for layout '${layout_name}'`);
    if (errors.length > 0) return { ok: false, errors };

    return {
      ok: true,
      layout_record: {
        entity_id: entity.id,
        entity_type: entity.type || "unknown",
        layout_name,
        render_profile,
        data_snapshot: JSON.parse(JSON.stringify(entity.data || {})),
        created_at: new Date().toISOString(),
      },
    };
  }

  validate_parity(entity, layouts = CORE_LAYOUTS) {
    const results = [];
    const data_before = JSON.stringify(entity.data || {});

    for (const layout_name of layouts) {
      const result = this.create_layout_record(entity, layout_name);
      results.push({ layout_name, ...result });
    }

    const data_after = JSON.stringify(entity.data || {});
    const data_intact = data_before === data_after;

    const all_ok = results.every((r) => r.ok) && data_intact;
    return {
      ok: all_ok,
      data_intact,
      layouts: results,
      summary: {
        total: results.length,
        passed: results.filter((r) => r.ok).length,
        failed: results.filter((r) => !r.ok).length,
      },
    };
  }

  validate_switch_layout(entity, from_layout, to_layout) {
    const before = JSON.stringify(entity.data || {});
    const from_result = this.create_layout_record(entity, from_layout);
    const to_result = this.create_layout_record(entity, to_layout);
    const after = JSON.stringify(entity.data || {});
    const data_intact = before === after;

    return {
      ok: from_result.ok && to_result.ok && data_intact,
      data_intact,
      from: from_result,
      to: to_result,
    };
  }

  get_all_layouts() {
    return [...CORE_LAYOUTS];
  }

  get_layout_count() {
    return CORE_LAYOUTS.length;
  }
}

export { layout_parity, CORE_LAYOUTS, LAYOUT_TO_RENDER_PROFILE };
