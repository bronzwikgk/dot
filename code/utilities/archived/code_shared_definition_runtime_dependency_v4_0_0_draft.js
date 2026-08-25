import {
  deployment_variant_names,
  artifact_types,
  lifecycle_statuses
} from "./dataset/code_shared_validation_word_datasets_v3_0_0_draft.js";

const dependency_kind_names = [
  "plugin", "utility", "app_data", "template", "definition"
];

const definition_kind_names = [
  "project_definition", "product_definition"
];

const default_policy_names = [
  "runtime_guard", "feature_flag_guard", "dependency_guard",
  "schema_guard", "relationship_guard"
];

class definition_runtime_dependency {
  constructor(config = {}) {
    this.config = definition_runtime_dependency.normalize_config(config);
  }

  detect_runtime(config = {}) {
    const runtime = config.runtime || config.runtime_name || this.config.runtime_name;
    if (!runtime) return definition_runtime_dependency.result(false, null, ["runtime is required"]);
    if (!this.config.runtime_names.includes(runtime)) {
      return definition_runtime_dependency.result(false, null, [`runtime '${runtime}' is not approved`]);
    }
    return definition_runtime_dependency.result(true, {
      type: "runtime_record",
      name: runtime,
      status: "ready"
    }, []);
  }

  parse_definition(config = {}) {
    const definition = config.definition || config;
    if (!definition_runtime_dependency.is_plain_object(definition)) {
      return definition_runtime_dependency.result(false, null, ["definition must be an object"]);
    }
    const data = {
      id: definition.id || "",
      type: definition.type || "product_definition",
      name: definition.name || definition.id || "",
      version: definition.version || "0.1.0",
      status: definition.status || "draft",
      runtime: definition.runtime || definition.runtime_name || this.config.runtime_name,
      feature_flags: definition_runtime_dependency.normalize_list(definition.feature_flags),
      config: definition_runtime_dependency.clone_plain_object(definition.config),
      dependencies: definition_runtime_dependency.normalize_dependencies(definition.dependencies),
      policies: definition_runtime_dependency.normalize_list(definition.policies),
      schemas: definition_runtime_dependency.normalize_list(definition.schemas),
      patterns: definition_runtime_dependency.normalize_list(definition.patterns),
      shapes: definition_runtime_dependency.normalize_list(definition.shapes),
      defaults: definition_runtime_dependency.clone_plain_object(definition.defaults),
      metadata: definition_runtime_dependency.clone_plain_object(definition.metadata)
    };
    return definition_runtime_dependency.result(true, data, []);
  }

  validate_definition(config = {}) {
    const parsed = this.parse_definition(config);
    if (!parsed.ok) return parsed;
    const definition = parsed.data;
    const errors = [];
    if (!definition.id) errors.push("definition id is required");
    if (definition.id && !definition_runtime_dependency.is_snake_path(definition.id)) errors.push("definition id must use snake_case path format");
    if (!definition.name) errors.push("definition name is required");
    if (!definition_kind_names.includes(definition.type)) errors.push(`definition type '${definition.type}' is not approved`);
    if (!lifecycle_statuses.includes(definition.status)) errors.push(`definition status '${definition.status}' is not approved`);
    errors.push(...this.detect_runtime({ runtime: definition.runtime }).errors);
    errors.push(...this.validate_dependencies({ dependencies: definition.dependencies }).errors);
    for (const policy of definition.policies) {
      const policy_name = typeof policy === "string" ? policy : policy.name;
      if (policy_name && !this.config.policy_names.includes(policy_name)) errors.push(`policy '${policy_name}' is not approved`);
    }
    return definition_runtime_dependency.result(errors.length === 0, definition, errors);
  }

  resolve_definition(config = {}) {
    const validation = this.validate_definition(config);
    if (!validation.ok) return validation;
    const dependencies = this.resolve_runtime_dependencies({ definition: validation.data });
    if (!dependencies.ok) return dependencies;
    const defaults = this.resolve_defaults({
      config: config.config,
      definition: validation.data,
      template: config.template,
      system: config.system
    });
    if (!defaults.ok) return defaults;
    return definition_runtime_dependency.result(true, {
      definition: validation.data,
      dependencies: dependencies.data,
      defaults: defaults.data
    }, []);
  }

  resolve_runtime_dependencies(config = {}) {
    const definition = config.definition || {};
    const dependencies = definition_runtime_dependency.normalize_dependencies(config.dependencies || definition.dependencies);
    const errors = [];
    const records = dependencies.map((item) => this.resolve_dependency_record(item));
    for (const record of records) errors.push(...record.errors);
    errors.push(...definition_runtime_dependency.find_dependency_cycles(dependencies));
    return definition_runtime_dependency.result(errors.length === 0, records.map((item) => item.data).filter(Boolean), errors);
  }

  resolve_defaults(config = {}) {
    const definition = config.definition || {};
    const merged = {
      ...definition_runtime_dependency.clone_plain_object(config.system),
      ...definition_runtime_dependency.clone_plain_object(config.template),
      ...definition_runtime_dependency.clone_plain_object(definition.defaults),
      ...definition_runtime_dependency.clone_plain_object(config.config)
    };
    return definition_runtime_dependency.result(true, {
      type: "default_record",
      values: merged,
      order: ["config", "definition", "template", "system"]
    }, []);
  }

  validate_dependencies(config = {}) {
    const dependencies = definition_runtime_dependency.normalize_dependencies(config.dependencies);
    const errors = [];
    for (const item of dependencies) {
      if (!item.id) errors.push("dependency id is required");
      if (item.id && !definition_runtime_dependency.is_snake_path(item.id)) errors.push(`dependency id '${item.id}' must use snake_case path format`);
      if (!item.kind) errors.push(`dependency '${item.id || "unknown"}' kind is required`);
      if (item.kind && !this.config.dependency_kind_names.includes(item.kind)) errors.push(`dependency kind '${item.kind}' is not approved`);
      if (item.runtime && !this.config.runtime_names.includes(item.runtime)) errors.push(`dependency runtime '${item.runtime}' is not approved`);
    }
    errors.push(...definition_runtime_dependency.find_dependency_cycles(dependencies));
    return definition_runtime_dependency.result(errors.length === 0, dependencies, errors);
  }

  resolve_dependency_record(item = {}) {
    const validation = this.validate_dependencies({ dependencies: [item] });
    if (!validation.ok) return definition_runtime_dependency.result(false, null, validation.errors);
    const data = {
      type: "dependency_record",
      id: item.id,
      kind: item.kind,
      runtime: item.runtime || this.config.runtime_name,
      reference: item.reference || `${item.kind}.${item.id}`,
      optional: Boolean(item.optional),
      relationships: definition_runtime_dependency.normalize_list(item.relationships)
    };
    return definition_runtime_dependency.result(true, data, []);
  }

  static normalize_config(config = {}) {
    return {
      runtime_name: config.runtime_name || "browser",
      runtime_names: Array.isArray(config.runtime_names) ? config.runtime_names : deployment_variant_names,
      dependency_kind_names: Array.isArray(config.dependency_kind_names) ? config.dependency_kind_names : dependency_kind_names,
      policy_names: Array.isArray(config.policy_names) ? config.policy_names : default_policy_names,
      artifact_types: Array.isArray(config.artifact_types) ? config.artifact_types : artifact_types
    };
  }

  static normalize_dependencies(value) {
    return definition_runtime_dependency.normalize_list(value).map((item) => {
      if (typeof item === "string") return { id: item, kind: "definition", relationships: [] };
      return {
        id: item.id || "",
        kind: item.kind || item.type || "",
        runtime: item.runtime || null,
        reference: item.reference || null,
        optional: Boolean(item.optional),
        relationships: definition_runtime_dependency.normalize_list(item.relationships)
      };
    });
  }

  static find_dependency_cycles(dependencies = []) {
    const graph = new Map();
    for (const item of dependencies) {
      graph.set(item.id, definition_runtime_dependency.normalize_list(item.relationships).filter((link) => link && link.type === "depends_on").map((link) => link.to));
    }
    const errors = [];
    const visiting = new Set();
    const visited = new Set();
    const stack = [];
    const visit = (id) => {
      if (visiting.has(id)) {
        const start = stack.indexOf(id);
        errors.push(`dependency cycle detected: ${[...stack.slice(start), id].join(" -> ")}`);
        return;
      }
      if (visited.has(id) || !graph.has(id)) return;
      visiting.add(id);
      stack.push(id);
      for (const next of graph.get(id) || []) visit(next);
      stack.pop();
      visiting.delete(id);
      visited.add(id);
    };
    for (const id of graph.keys()) visit(id);
    return errors;
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static clone_plain_object(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return definition_runtime_dependency.clone_value(value);
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  static result(ok, data, errors) {
    return { ok, data: definition_runtime_dependency.clone_value(data), errors: errors || [] };
  }

  static is_plain_object(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  static is_snake_path(value) {
    return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(String(value || ""));
  }
}

export {
  definition_runtime_dependency,
  dependency_kind_names,
  definition_kind_names,
  default_policy_names
};
export default definition_runtime_dependency;
