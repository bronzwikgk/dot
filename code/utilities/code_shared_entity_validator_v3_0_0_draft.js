import {
  datatype_names,
  diagnostic_levels,
  intent_names,
  lifecycle_statuses as default_lifecycle_statuses,
  operation_names,
  pipeline_names,
  pipeline_stage_names,
  relationship_types as default_relationship_types,
  banned_words
} from "./dataset/code_shared_validation_word_datasets_v3_0_0_draft.js";
import {
  aria_role_names,
  cell_statuses,
  cell_types,
  export_formats,
  flow_node_types,
  gui_action_names,
  import_formats,
  layout_names,
  panel_names,
  semantic_element_names,
  template_ids
} from "./dataset/code_shared_ui_word_datasets_v3_0_0_draft.js";

class entity_validator {
  constructor(config = {}) {
    this.config = {
      allow_unknown_types: false,
      allow_unknown_relationship_types: false,
      allow_unknown_operations: false,
      near_duplicate_distance: 2,
      ...config,
      banned_words: config.banned_words || banned_words,
      datatype_names: config.datatype_names || datatype_names,
      diagnostic_levels: config.diagnostic_levels || diagnostic_levels,
      export_formats: config.export_formats || export_formats,
      flow_node_types: config.flow_node_types || flow_node_types,
      gui_action_names: config.gui_action_names || gui_action_names,
      import_formats: config.import_formats || import_formats,
      intent_names: config.intent_names || intent_names,
      layout_names: config.layout_names || layout_names,
      operation_names: config.operation_names || operation_names,
      panel_names: config.panel_names || panel_names,
      pipeline_names: config.pipeline_names || pipeline_names,
      pipeline_stage_names: config.pipeline_stage_names || pipeline_stage_names,
      relationship_types: config.relationship_types || default_relationship_types,
      lifecycle_statuses: config.lifecycle_statuses || default_lifecycle_statuses,
      cell_statuses: config.cell_statuses || cell_statuses,
      cell_types: config.cell_types || cell_types,
      semantic_element_names: config.semantic_element_names || semantic_element_names,
      template_ids: config.template_ids || template_ids,
      aria_role_names: config.aria_role_names || aria_role_names
    };
  }

  validate_entity(entity, registry = null) {
    const errors = [];
    if (!this.is_plain_object(entity)) errors.push("entity must be an object");
    if (entity && !this.is_snake_path(entity.id)) errors.push("id must use snake_case path format");
    if (entity && !this.validate_no_banned_words([entity.id, entity.type, entity.name]).ok) errors.push("entity contains banned vocabulary");
    if (entity && !this.is_snake_name(entity.type)) errors.push("type must use snake_case");
    if (registry && entity && !this.config.allow_unknown_types && !registry.has_type(entity.type)) errors.push(`unknown type '${entity.type}'`);
    if (entity && entity.status !== undefined && !this.validate_status(entity.status).ok) errors.push(`status '${entity.status}' is invalid`);
    for (const operation of normalize_list(entity && entity.operations)) {
      const operation_name = typeof operation === "string" ? operation : operation.name;
      const operation_result = this.validate_operation_name(operation_name);
      if (operation_name && !operation_result.ok) errors.push(`operation '${operation_name}' is not allowed`);
    }
    for (const relationship of normalize_list(entity && entity.relationships)) {
      errors.push(...this.validate_relationship(relationship).errors);
    }
    for (const policy of normalize_list(entity && entity.policies)) {
      if (typeof policy === "object" && policy.required_status && entity.status !== policy.required_status) {
        errors.push(`policy '${policy.name || "unnamed_policy"}' requires status '${policy.required_status}'`);
      }
    }
    for (const contract of normalize_list(entity && entity.contracts)) {
      const missing = normalize_list(contract.required_fields).filter((field) => entity[field] === undefined);
      if (missing.length > 0) errors.push(`contract '${contract.name || "unnamed_contract"}' missing ${missing.join(", ")}`);
    }
    return { ok: errors.length === 0, errors };
  }

  validate_raw_input(input, registry = null) {
    const errors = [];
    if (!this.is_plain_object(input)) errors.push("input must be an object");
    if (input && !input.id) errors.push("id is required");
    if (input && !input.type) errors.push("type is required");
    if (input && !this.validate_no_banned_words([input.id, input.type, input.name]).ok) errors.push("input contains banned vocabulary");
    if (input && input.id && !this.is_snake_path(input.id)) errors.push("id must use snake_case path format");
    if (input && input.type && !this.is_snake_name(input.type)) errors.push("type must use snake_case");
    if (registry && input && input.type && !this.config.allow_unknown_types && !registry.has_type(input.type)) errors.push(`unknown type '${input.type}'`);
    for (const relationship of normalize_list(input && input.relationships)) {
      errors.push(...this.validate_relationship(relationship).errors);
    }
    return { ok: errors.length === 0, errors };
  }

  validate(entity, registry = null) {
    return this.validate_entity(entity, registry);
  }

  validate_relationship(relationship) {
    const errors = [];
    if (!this.is_plain_object(relationship)) {
      errors.push("relationship must be an object");
      return { ok: false, errors };
    }
    if (!this.validate_relationship_type(relationship.type).ok) errors.push(`relationship type '${relationship.type}' is not allowed`);
    if (!this.validate_no_banned_words([relationship.type, relationship.to]).ok) errors.push("relationship contains banned vocabulary");
    if (!relationship.to) errors.push("relationship target is required");
    if (relationship.to && !this.is_snake_path(relationship.to)) errors.push("relationship target must use snake_case path format");
    return { ok: errors.length === 0, errors };
  }

  validate_relationship_type(type) {
    const ok = this.is_snake_name(type) && (
      this.config.allow_unknown_relationship_types ||
      this.config.relationship_types.includes(type)
    );
    return { ok, type };
  }

  validate_status(status) {
    return { ok: this.config.lifecycle_statuses.includes(status), status };
  }

  validate_cell_status(status) {
    return { ok: this.config.cell_statuses.includes(status), status };
  }

  validate_datatype_name(name) {
    return this.validate_approved_word("datatype_names", name);
  }

  validate_diagnostic_level(name) {
    return this.validate_approved_word("diagnostic_levels", name);
  }

  validate_export_format(name) {
    return this.validate_approved_word("export_formats", name);
  }

  validate_flow_node_type(name) {
    return this.validate_approved_word("flow_node_types", name);
  }

  validate_gui_action_name(name) {
    return this.validate_approved_word("gui_action_names", name);
  }

  validate_import_format(name) {
    return this.validate_approved_word("import_formats", name);
  }

  validate_intent_name(name) {
    return this.validate_approved_word("intent_names", name);
  }

  validate_layout_name(name) {
    return this.validate_approved_word("layout_names", name);
  }

  validate_panel_name(name) {
    return this.validate_approved_word("panel_names", name);
  }

  validate_pipeline_name(name) {
    return this.validate_approved_word("pipeline_names", name);
  }

  validate_pipeline_stage_name(name) {
    return this.validate_approved_word("pipeline_stage_names", name);
  }

  validate_cell_type(name) {
    return this.validate_approved_word("cell_types", name);
  }

  validate_semantic_element_name(name) {
    return this.validate_approved_word("semantic_element_names", name);
  }

  validate_template_id(name) {
    return this.validate_approved_word("template_ids", name);
  }

  validate_aria_role_name(name) {
    return this.validate_approved_word("aria_role_names", name);
  }

  validate_approved_word(group_name, value) {
    const list = this.config[group_name] || [];
    const suggestions = list.filter((item) => edit_distance(item, value) <= this.config.near_duplicate_distance);
    return { ok: list.includes(value) && this.validate_banned_word(value).ok, group_name, value, suggestions };
  }

  validate_operation_name(name) {
    const ok = this.is_snake_name(name) && this.validate_banned_word(name).ok && (
      this.config.allow_unknown_operations ||
      this.config.operation_names.includes(name)
    );
    return { ok, name };
  }

  validate_safe_name(name) {
    return { ok: this.is_snake_name(name) && this.validate_banned_word(name).ok, name };
  }

  validate_banned_word(value) {
    const normalized = String(value || "").toLowerCase();
    const parts = normalized.split(/[^a-z0-9]+/).filter(Boolean);
    const found = this.config.banned_words.filter((word) => normalized === word || parts.includes(word));
    return { ok: found.length === 0, value, found };
  }

  validate_no_banned_words(values = []) {
    const found = normalize_list(values).filter((value) => !this.validate_banned_word(value).ok);
    return { ok: found.length === 0, found };
  }

  validate_no_near_duplicate(group_name, value) {
    const result = this.validate_approved_word(group_name, value);
    return { ok: result.ok || result.suggestions.length === 0, group_name, value, suggestions: result.suggestions };
  }

  validate_input(input, registry = null) {
    return this.validate_raw_input(input, registry);
  }

  validate_output(output, registry = null) {
    return this.validate_entity(output, registry);
  }

  assert_valid(entity, registry = null) {
    const result = this.validate_entity(entity, registry);
    if (!result.ok) throw new Error(result.errors.join("; "));
    return result;
  }

  assert_relationship_type(type) {
    const result = this.validate_relationship_type(type);
    if (!result.ok) throw new Error(`relationship type '${type}' is not allowed`);
    return result;
  }

  assert_status(status) {
    const result = this.validate_status(status);
    if (!result.ok) throw new Error(`status '${status}' is invalid`);
    return result;
  }

  assert_operation_name(name) {
    const result = this.validate_operation_name(name);
    if (!result.ok) throw new Error(`operation '${name}' is not allowed`);
    return result;
  }

  assert_safe_name(name) {
    const result = this.validate_safe_name(name);
    if (!result.ok) throw new Error(`name '${name}' must use snake_case`);
    return result;
  }

  is_snake_name(value) {
    return /^[a-z][a-z0-9_]*$/.test(String(value || ""));
  }

  is_snake_path(value) {
    return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(String(value || ""));
  }

  is_plain_object(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }
}

const normalize_list = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const edit_distance = (left, right) => {
  const a = String(left || "");
  const b = String(right || "");
  const rows = Array.from({ length: a.length + 1 }, () => []);
  for (let i = 0; i <= a.length; i += 1) rows[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
    }
  }
  return rows[a.length][b.length];
};

export { entity_validator };
export default entity_validator;
