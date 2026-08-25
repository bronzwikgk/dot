// validator.js
// Entity validation utility

class validator {
  constructor(config = {}) {
    this.config = { strict: true, ...config };
  }

  validate_entity(entity) {
    const errors = [];
    if (!entity) { errors.push("entity is required"); return { ok: false, errors }; }
    if (!entity.id) errors.push("id is required");
    if (!entity.type) errors.push("type is required");
    if (!entity.name) errors.push("name is required");
    return { ok: errors.length === 0, errors };
  }

  validate_relationship(rel) {
    const errors = [];
    if (!rel) { errors.push("relationship is required"); return { ok: false, errors }; }
    if (!rel.source) errors.push("source is required");
    if (!rel.target) errors.push("target is required");
    if (!rel.type) errors.push("type is required");
    return { ok: errors.length === 0, errors };
  }

  validate_id(id) {
    if (!id) return { ok: false, errors: ["id is required"] };
    if (typeof id !== "string") return { ok: false, errors: ["id must be string"] };
    return { ok: true, errors: [] };
  }

  validate_type(type, allowed_types) {
    if (!type) return { ok: false, errors: ["type is required"] };
    if (allowed_types && !allowed_types.includes(type)) {
      return { ok: false, errors: [`type '${type}' not in allowed types`] };
    }
    return { ok: true, errors: [] };
  }
}

export default validator;
export { validator };
