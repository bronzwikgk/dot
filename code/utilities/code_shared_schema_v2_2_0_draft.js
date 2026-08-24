/**
 * @entity schema_utility
 *
 * @meta
 * project: an_app
 * file_name: src/utility/schema.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * validate objects against schema maps with constraint checking.
 *
 * @purpose_and_problem_statement
 * attribute validation for entity types without external dependencies.
 *
 * @usage
 * ```js
 * const result = validate_against_schema(data, schema);
 * ```
 *
 * @timing
 * used by validate stage and entity type handlers.
 *
 * @scope_boundaries
 * in_scope: type checking, constraint validation, required field checks
 * out_of_scope: schema definition language, complex nested validation
 *
 * @dependencies
 * none (pure)
 *
 * @keywords
 * schema, validate, constraint, attribute
 *
 * @invariants
 * - returns { data } or { errors } never throws
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
export function validate_against_schema(data, schema) {
  const errors = [];
  if (!schema || typeof schema !== 'object') {
    return { data: true };
  }
  for (const [key, rules] of Object.entries(schema)) {
    if (rules.required && (data[key] === undefined || data[key] === null)) {
      errors.push({ code: 'missing_required', field: key, message: `${key} is required` });
      continue;
    }
    if (data[key] === undefined || data[key] === null) continue;
    const value = data[key];
    if (rules.type && typeof value !== rules.type) {
      errors.push({ code: 'type_mismatch', field: key, message: `${key} must be ${rules.type}, got ${typeof value}` });
    }
    if (rules.max_length && typeof value === 'string' && value.length > rules.max_length) {
      errors.push({ code: 'too_long', field: key, message: `${key} exceeds max length ${rules.max_length}` });
    }
    if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
      errors.push({ code: 'too_small', field: key, message: `${key} must be >= ${rules.min}` });
    }
    if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
      errors.push({ code: 'too_large', field: key, message: `${key} must be <= ${rules.max}` });
    }
    if (rules.options && !rules.options.includes(value)) {
      errors.push({ code: 'invalid_option', field: key, message: `${key} must be one of: ${rules.options.join(', ')}` });
    }
  }
  return errors.length > 0 ? { errors } : { data: true };
}

export function merge_schemas(base, override) {
  return { ...base, ...override };
}
