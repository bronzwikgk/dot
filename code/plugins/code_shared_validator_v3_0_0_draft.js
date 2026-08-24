/**
 * @entity validator
 * @meta project: shared | file_name: code_shared_validator_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide schema validation, rule evaluation with sandboxed conditions, and path value resolution.
 * @purpose_and_problem_statement execute_workflow needs one gate that validates payloads and evaluates flow conditions; scattered validators drifted apart.
 * @usage const v = new Validator(); v.validate(data, schema); v.evaluateRule(rule, context); v.resolveValue("{{input.x}}", context);
 * @timing used by the flow engine before each step and at activation.
 * @scope_boundaries in_scope: schema validation, rule operators, vm-sandboxed condition strings, mustache-style path resolution. out_of_scope: storage schemas, dsl artifact gating (separate concern).
 * @dependencies none (node:vm for sandboxed conditions).
 * @keywords validate, rule, condition, resolve, schema
 * @invariants validation never throws on malformed data; vm failures evaluate to false, never propagate.
 * @changelog - 2026-08-24: 3.0.0: promoted actionValidator_v1_1_0 to shared class form; resolveValue made public for flow engine use
 */
import vm from 'node:vm';

export class Validator {
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

    if (schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
          errors.push({ field, message: `Field '${field}' is required` });
        }
      }
    }

    if (schema.properties) {
      for (const key in schema.properties) {
        if (data[key] !== undefined) {
          const propSchema = schema.properties[key];
          const value = data[key];

          if (propSchema.type) {
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            if (actualType !== propSchema.type) {
              errors.push({ field: key, message: `Expected type ${propSchema.type}, got ${actualType}` });
            }
          }

          if (propSchema.type === 'string') {
            if (propSchema.minLength && value.length < propSchema.minLength) errors.push({ field: key, message: `Min length ${propSchema.minLength}` });
            if (propSchema.maxLength && value.length > propSchema.maxLength) errors.push({ field: key, message: `Max length ${propSchema.maxLength}` });
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  evaluateRule(rule, context) {
    if (!rule) return true;

    if (rule.condition && typeof rule.condition === 'string') {
      try {
        const code = rule.condition.includes('=') ? rule.condition : `result = (${rule.condition})`;
        const sandbox = { ...context, result: false };
        vm.createContext(sandbox);
        vm.runInContext(code, sandbox);
        return sandbox.result;
      } catch (err) {
        console.error('[Validator] VM Error:', err.message);
        return false;
      }
    }

    const left = this.resolveValue(rule.left, context);
    const right = this.resolveValue(rule.right, context);
    const op = rule.operator;

    switch (op) {
      case '==': return left == right;
      case '===': return left === right;
      case '>': return left > right;
      case '<': return left < right;
      case 'contains': return Array.isArray(left) && left.includes(right);
      default: return false;
    }
  }

  resolveValue(path, context) {
    if (typeof path !== 'string') return path;
    if (path.startsWith('{{') && path.endsWith('}}')) {
      const cleanPath = path.slice(2, -2).trim();
      return cleanPath.split('.').reduce((acc, part) => acc && acc[part], context);
    }
    return path;
  }

  _resolveValue(path, context) {
    return this.resolveValue(path, context);
  }
}

export default Validator;
