/**
 * @entity schema_registry
 *
 * @meta
 * project: an_app
 * file_name: src/core/kernel/schema_registry.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * per-type attribute schemas used by the validate stage.
 *
 * @purpose_and_problem_statement
 * central registry of attribute shapes per entity type for validation.
 *
 * @usage
 * ```js
 * const registry = create_schema_registry();
 * registry.register_schema('file', file_schema);
 * const result = registry.validate_entity(entity);
 * ```
 *
 * @timing
 * boot step 6; schemas registered from ontology at startup.
 *
 * @scope_boundaries
 * in_scope: schema registration, validation against schemas
 * out_of_schema: schema definition language, complex nested validation
 *
 * @dependencies
 * - utility/schema.js
 *
 * @keywords
 * schema, registry, validate, attribute
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
export function create_schema_registry() {
  const schemas = new Map();

  function register_schema(type_name, schema) {
    schemas.set(type_name, schema);
    return { data: { registered: type_name } };
  }

  function lookup_schema(type_name) {
    return schemas.get(type_name) || null;
  }

  function validate_entity(entity) {
    const schema = schemas.get(entity.type);
    if (!schema) return { data: true };
    const errors = [];
    const known_keys = new Set(Object.keys(schema.attributes || {}));
    for (const key of Object.keys(entity.attributes || {})) {
      if (!known_keys.has(key)) {
        errors.push({ code: 'unknown_attribute', field: key, message: `Unknown attribute: ${key}`, severity: schema.strict_keys ? 'error' : 'finding' });
      }
    }
    for (const [attr_name, rules] of Object.entries(schema.attributes || {})) {
      const value = (entity.attributes || {})[attr_name];
      if (rules.required && (value === undefined || value === null)) {
        errors.push({ code: 'missing_required', field: attr_name, message: `${attr_name} is required` });
        continue;
      }
      if (value === undefined || value === null) continue;
      if (rules.type === 'text' && typeof value !== 'string') {
        errors.push({ code: 'type_mismatch', field: attr_name, message: `${attr_name} must be text` });
      }
      if (rules.type === 'number' && typeof value !== 'number') {
        errors.push({ code: 'type_mismatch', field: attr_name, message: `${attr_name} must be number` });
      }
      if (rules.type === 'boolean' && typeof value !== 'boolean') {
        errors.push({ code: 'type_mismatch', field: attr_name, message: `${attr_name} must be boolean` });
      }
      if (rules.type === 'choice' && rules.options && !rules.options.includes(value)) {
        errors.push({ code: 'invalid_option', field: attr_name, message: `${attr_name} must be one of: ${rules.options.join(', ')}` });
      }
      if (rules.max_length && typeof value === 'string' && value.length > rules.max_length) {
        errors.push({ code: 'too_long', field: attr_name, message: `${attr_name} exceeds max length ${rules.max_length}` });
      }
    }
    return errors.length > 0 ? { errors } : { data: true };
  }

  return { register_schema, lookup_schema, validate_entity, schemas };
}
