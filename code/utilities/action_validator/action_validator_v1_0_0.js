/**
 * action_validator_v1_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Unified validator combining:
 * - validator: schema validation, rule evaluation, path resolution
 * - entity_validator: entity validation, relationships, datasets, naming
 * - manifest_validation: registration staleness and duplicates
 * - policy_validation: policy rule enforcement
 */

import vm from 'node:vm';

class action_validator {
  constructor(config = {}) {
    this.config = {
      allow_unknown_types: false,
      allow_unknown_relationship_types: false,
      allow_unknown_operations: false,
      near_duplicate_distance: 2,
      condition_timeout_ms: 100,
      ...config
    };
    this.registrations = new Map();
    this.formats = {
      email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
      date: /^\d{4}-\d{2}-\d{2}$/
    };
  }

  // === SCHEMA VALIDATION ===

  validate_schema(data, schema) {
    const errors = [];
    if (!schema || typeof schema !== 'object') return { valid: true, errors: [] };
    const payload = data || {};

    if (schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
          errors.push({ field, message: `Field '${field}' is required` });
        }
      }
    }

    if (schema.properties) {
      for (const key in schema.properties) {
        if (payload[key] !== undefined) {
          const prop_schema = schema.properties[key] || {};
          const value = payload[key];

          if (prop_schema.type) {
            const actual_type = Array.isArray(value) ? 'array' : typeof value;
            if (actual_type !== prop_schema.type) {
              errors.push({ field: key, message: `Expected type ${prop_schema.type}, got ${actual_type}` });
            }
          }

          if (prop_schema.format && this.formats[prop_schema.format] && typeof value === "string" && !this.formats[prop_schema.format].test(value)) {
            errors.push({ field: key, message: `Invalid format ${prop_schema.format}` });
          }

          if (prop_schema.type === 'string') {
            if (prop_schema.min_length && value.length < prop_schema.min_length) errors.push({ field: key, message: `Min length ${prop_schema.min_length}` });
            if (prop_schema.max_length && value.length > prop_schema.max_length) errors.push({ field: key, message: `Max length ${prop_schema.max_length}` });
          }

          if (Array.isArray(prop_schema.enum) && !prop_schema.enum.includes(value)) {
            errors.push({ field: key, message: `Expected one of ${prop_schema.enum.join(', ')}` });
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  evaluate_rule(rule, context) {
    if (!rule) return true;
    context = context || {};

    if (Array.isArray(rule.conditions)) {
      if (rule.type === 'or') {
        return rule.conditions.some(condition => this.evaluate_rule(condition, context));
      }
      if (rule.type === 'not') {
        return !this.evaluate_rule(rule.conditions[0], context);
      }
      if (rule.conditions.length === 0) return true;
      return rule.conditions.every(condition => this.evaluate_rule(condition, context));
    }

    if (rule.condition && typeof rule.condition === 'string') {
      try {
        const code = `result = (${rule.condition})`;
        const sandbox = { ...context, result: false };
        vm.createContext(sandbox);
        vm.runInContext(code, sandbox, { timeout: this.config.condition_timeout_ms || 100 });
        return sandbox.result;
      } catch (err) {
        if (this.config.log_vm_errors) {
          console.error('[action_validator] VM Error:', err.message);
        }
        return false;
      }
    }

    const left = this.resolve_value(rule.left, context);
    const right = this.resolve_value(rule.right, context);
    const op = rule.operator;

    switch (op) {
      case '==': return left == right;
      case '===': return left === right;
      case '!=': return left != right;
      case '!==': return left !== right;
      case '>': return left > right;
      case '<': return left < right;
      case '>=': return left >= right;
      case '<=': return left <= right;
      case 'contains': return Array.isArray(left) && left.includes(right);
      default: return false;
    }
  }

  resolve_value(path, context) {
    if (typeof path !== 'string') return path;
    context = context || {};
    if (path.startsWith('{{') && path.endsWith('}}')) {
      const clean_path = path.slice(2, -2).trim();
      return clean_path.split('.').reduce((acc, part) => {
        if (acc === null || acc === undefined) return undefined;
        return acc[part];
      }, context);
    }
    return path;
  }

  // === ENTITY VALIDATION ===

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
    for (const schema of normalize_list(entity && entity.schemas)) {
      errors.push(...this.validate_entity_against_schema(entity, schema).errors);
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

  // === RELATIONSHIP VALIDATION ===

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

  validate_relationship_graph(entities = []) {
    const errors = [];
    if (!Array.isArray(entities)) return { ok: false, errors: ["entities must be an array"], cycles: [] };
    const ids = new Set();
    for (const entity of entities) {
      if (!this.is_plain_object(entity)) {
        errors.push("graph entity must be an object");
        continue;
      }
      if (!entity.id) {
        errors.push("graph entity id is required");
        continue;
      }
      if (ids.has(entity.id)) errors.push(`duplicate entity id '${entity.id}'`);
      ids.add(entity.id);
    }
    for (const entity of entities) {
      if (!this.is_plain_object(entity)) continue;
      for (const relationship of normalize_list(entity.relationships)) {
        const relationship_result = this.validate_relationship(relationship);
        errors.push(...relationship_result.errors.map((error) => `${entity.id}: ${error}`));
        if (relationship && relationship.to && !ids.has(relationship.to)) {
          errors.push(`${entity.id} has missing relationship target ${relationship.to}`);
        }
      }
    }
    const cycles = detect_relationship_cycles(entities);
    for (const cycle of cycles) errors.push(`cycle detected: ${cycle.join(" -> ")}`);
    return { ok: errors.length === 0, errors, cycles };
  }

  validate_relationship_type(type) {
    const ok = this.is_snake_name(type) && (
      this.config.allow_unknown_relationship_types ||
      this.config.relationship_types?.includes(type)
    );
    return { ok, type };
  }

  // === DATASET VALIDATION ===

  validate_approved_word(group_name, value) {
    const list = this.config[group_name] || [];
    const suggestions = list.filter((item) => edit_distance(item, value) <= this.config.near_duplicate_distance);
    return { ok: list.includes(value) && this.validate_banned_word(value).ok, group_name, value, suggestions };
  }

  validate_enum_field(field_name, value, group_name) {
    const result = this.validate_approved_word(group_name, value);
    return {
      ok: result.ok,
      field_name,
      value,
      group_name,
      errors: result.ok ? [] : [`${field_name} '${value}' is not approved for ${group_name}`],
      suggestions: result.suggestions
    };
  }

  validate_dataset_group(group_name, values) {
    const errors = [];
    if (!this.is_snake_name(group_name)) errors.push("dataset group name must use snake_case");
    if (!Array.isArray(values)) {
      errors.push(`${group_name} must be an array`);
      return { ok: false, group_name, count: 0, unique_count: 0, errors };
    }
    const seen = new Set();
    for (const value of values) {
      if (typeof value !== "string") {
        errors.push(`${group_name} contains non-string value ${JSON.stringify(value)}`);
        continue;
      }
      if (value.trim() !== value || value.length === 0) errors.push(`${group_name} contains invalid value ${JSON.stringify(value)}`);
      if (!this.is_snake_name(value) && !this.is_snake_path(value)) errors.push(`${group_name} value '${value}' must use snake_case or snake_path`);
      if (group_name !== "banned_words") {
        const banned_result = this.validate_banned_word(value);
        if (!banned_result.ok) errors.push(`${group_name} value '${value}' contains banned vocabulary ${banned_result.found.join(", ")}`);
      }
      if (seen.has(value)) errors.push(`${group_name} contains duplicate value '${value}'`);
      seen.add(value);
    }
    return { ok: errors.length === 0, group_name, count: values.length, unique_count: seen.size, errors };
  }

  validate_dataset_groups(groups = {}) {
    const reports = [];
    const errors = [];
    for (const [group_name, values] of Object.entries(groups || {})) {
      if (!Array.isArray(values)) continue;
      const report = this.validate_dataset_group(group_name, values);
      reports.push(report);
      errors.push(...report.errors);
    }
    return { ok: errors.length === 0, group_count: reports.length, reports, errors };
  }

  // === SCHEMA RECORD VALIDATION ===

  validate_schema_record(schema) {
    const errors = [];
    if (!this.is_plain_object(schema)) return { ok: false, errors: ["schema must be an object"] };
    if (!schema.id) errors.push("schema id is required");
    if (schema.id && !this.is_snake_path(schema.id)) errors.push("schema id must use snake_case path format");
    if (schema.type && !this.config.schema_field_types?.includes(schema.type)) errors.push(`schema type '${schema.type}' is invalid`);
    if (schema.fields !== undefined && !this.is_plain_object(schema.fields)) errors.push("schema fields must be an object");
    for (const [field_name, field_schema] of Object.entries(schema.fields || {})) {
      if (!this.is_snake_name(field_name)) errors.push(`schema field '${field_name}' must use snake_case`);
      if (!this.is_plain_object(field_schema)) {
        errors.push(`schema field '${field_name}' must be an object`);
        continue;
      }
      if (field_schema.type && !this.config.schema_field_types?.includes(field_schema.type)) {
        errors.push(`schema field '${field_name}' type '${field_schema.type}' is invalid`);
      }
      if (field_schema.dataset && !this.is_snake_name(field_schema.dataset)) {
        errors.push(`schema field '${field_name}' dataset must use snake_case`);
      }
    }
    return { ok: errors.length === 0, errors };
  }

  validate_entity_against_schema(entity, schema) {
    const errors = [];
    const schema_result = this.validate_schema_record(schema);
    if (!schema_result.ok) return schema_result;
    for (const [field_name, field_schema] of Object.entries(schema.fields || {})) {
      const value = entity ? entity[field_name] : undefined;
      if (field_schema.required && value === undefined) {
        errors.push(`field '${field_name}' is required`);
        continue;
      }
      if (value === undefined) continue;
      if (!this.validate_value_type(value, field_schema.type || "text")) errors.push(`field '${field_name}' must be ${field_schema.type}`);
      if (field_schema.dataset) errors.push(...this.validate_enum_field(field_name, value, field_schema.dataset).errors);
      if (Array.isArray(field_schema.options) && !field_schema.options.includes(value)) errors.push(`field '${field_name}' is not an approved option`);
    }
    return { ok: errors.length === 0, errors };
  }

  validate_value_type(value, type) {
    if (type === "text" || type === "choice" || type === "reference" || type === "timestamp" || type === "markup") return typeof value === "string";
    if (type === "number") return typeof value === "number" && Number.isFinite(value);
    if (type === "boolean") return typeof value === "boolean";
    if (type === "list") return Array.isArray(value);
    if (type === "map" || type === "json") return this.is_plain_object(value);
    return true;
  }

  // === NAME VALIDATION ===

  validate_operation_name(name) {
    const ok = this.is_snake_name(name) && this.validate_banned_word(name).ok && (
      this.config.allow_unknown_operations ||
      this.config.operation_names?.includes(name)
    );
    return { ok, name };
  }

  validate_safe_name(name) {
    return { ok: this.is_snake_name(name) && this.validate_banned_word(name).ok, name };
  }

  validate_banned_word(value) {
    const normalized = String(value || "").toLowerCase();
    const parts = normalized.split(/[^a-z0-9]+/).filter(Boolean);
    const found = (this.config.banned_words || []).filter((word) => normalized === word || parts.includes(word));
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

  is_snake_name(value) {
    return /^[a-z][a-z0-9_]*$/.test(String(value || ""));
  }

  is_snake_path(value) {
    return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(String(value || ""));
  }

  is_plain_object(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  // === STATUS VALIDATION ===

  validate_status(status) {
    return { ok: (this.config.lifecycle_statuses || []).includes(status), status };
  }

  validate_cell_status(status) {
    return { ok: (this.config.cell_statuses || []).includes(status), status };
  }

  // === CONVENIENCE VALIDATORS ===

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

  // === REGISTRATION (MANIFEST + POLICY) ===

  register(id, type, config = {}) {
    this.registrations.set(id, { id, type, ...config, registered_at: new Date().toISOString() });
    return { ok: true };
  }

  validate_stale(id) {
    const reg = this.registrations.get(id);
    if (!reg) return { ok: false, errors: [`registration '${id}' not found`] };
    const stale = (reg.entries || []).filter((e) => !e.active);
    return { ok: stale.length === 0, stale_entries: stale, count: stale.length };
  }

  validate_duplicates(id) {
    const reg = this.registrations.get(id);
    if (!reg) return { ok: false, errors: [`registration '${id}' not found`] };
    const seen = new Set();
    const duplicates = [];
    for (const entry of (reg.entries || [])) {
      const key = `${entry.type}:${entry.name}`;
      if (seen.has(key)) duplicates.push(entry);
      seen.add(key);
    }
    return { ok: duplicates.length === 0, duplicates, count: duplicates.length };
  }

  validate_policy_rules(id, input) {
    const policy = this.registrations.get(id);
    if (!policy) return { ok: false, errors: [`policy '${id}' not found`] };
    if (!policy.enabled) return { ok: true, skipped: true };
    const errors = [];
    for (const rule of (policy.rules || [])) {
      if (rule.type === 'required' && !input[rule.field]) errors.push(`${rule.field} is required`);
      if (rule.type === 'pattern' && input[rule.field] && !new RegExp(rule.pattern).test(input[rule.field])) errors.push(`${rule.field} does not match pattern`);
    }
    return { ok: errors.length === 0, errors };
  }

  validate_registration(id, input = null) {
    const stale = this.validate_stale(id);
    const dups = this.validate_duplicates(id);
    const policy = input ? this.validate_policy_rules(id, input) : { ok: true };
    return { ok: stale.ok && dups.ok && policy.ok, stale, duplicates: dups, policy };
  }

  list_registrations(type = null) {
    if (type) {
      return [...this.registrations.values()].filter((r) => r.type === type);
    }
    return [...this.registrations.values()];
  }

  // === ASSERT METHODS ===

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

const detect_relationship_cycles = (entities) => {
  const graph = new Map();
  for (const entity of entities || []) {
    if (!entity || !entity.id) continue;
    graph.set(entity.id, normalize_list(entity.relationships).filter((item) => item && item.type === "depends_on").map((item) => item.to));
  }
  const cycles = [];
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const visit = (id) => {
    if (visiting.has(id)) {
      const start = stack.indexOf(id);
      cycles.push([...stack.slice(start), id]);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    stack.push(id);
    for (const next of graph.get(id) || []) {
      if (graph.has(next)) visit(next);
    }
    stack.pop();
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of graph.keys()) visit(id);
  return cycles;
};

export { action_validator };
export default action_validator;
