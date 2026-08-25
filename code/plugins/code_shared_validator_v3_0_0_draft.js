/**
 * @entity validator
 * @meta project: shared | file_name: code_shared_validator_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide schema validation, rule evaluation with sandboxed conditions, and path value resolution.
 * @purpose_and_problem_statement execute_workflow needs one gate that validates payloads and evaluates flow conditions; scattered validators drifted apart.
 * @usage const v = new validator(); v.validate(data, schema); v.evaluate_rule(rule, context); v.resolve_value("{{input.x}}", context);
 * @timing used by the flow engine before each step and at activation.
 * @scope_boundaries in_scope: schema validation, rule operators, vm-sandboxed condition strings, mustache-style path resolution. out_of_scope: storage schemas, dsl artifact gating (separate concern).
 * @dependencies none (node:vm for sandboxed conditions).
 * @keywords validate, rule, condition, resolve, schema
 * @invariants validation never throws on malformed data; vm failures evaluate to false, never propagate.
 * @changelog - 2026-08-24: 3.0.0: promoted actionvalidator_v1_1_0 to shared class form; resolve_value made public for flow engine use
 */
import vm from 'node:vm';

export class validator {
  constructor(config) {
    this.config = config || {};
    this.version = '3.0.0';
    this.formats = {
      email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
      date: /^\d{4}-\d{2}-\d{2}$/
    };
  }

  validate(data, schema) {
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
          console.error('[validator] VM Error:', err.message);
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
}

export default validator;
