class entity_reasoner {
  constructor(config = {}) {
    this.config = config;
  }

  reason(entity, registry = null) {
    const known_type = !registry || registry.has_type(entity.type);
    const traits = known_type ? entity.traits || (registry && registry.describe_type(entity.type).traits) || [] : [];
    const operations = known_type && registry ? registry.operations_for_type(entity.type) : entity.operations || [];
    return {
      ok: known_type,
      id: entity.id,
      type: entity.type,
      traits,
      operations,
      diagnostics: known_type ? [] : [`unknown type '${entity.type}'`],
      can_execute: operations.includes("execute") || operations.includes("call"),
      can_display: operations.includes("display")
    };
  }

  resolve(entity, need) {
    const operations = entity.operations || [];
    if (operations.includes(need)) return { ok: true, via: "operation", need };
    if ((entity.traits || []).includes(need)) return { ok: true, via: "trait", need };
    return { ok: false, reason: `cannot resolve '${need}'` };
  }

  explain(result) {
    if (result.ok === false) return result.reason;
    return `${result.id || "entity"} supports ${normalize_list(result.operations).join(", ")}`;
  }

  decide(options = []) {
    const sorted = [...options].sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    return sorted[0] || null;
  }
}

const normalize_list = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export { entity_reasoner };
export default entity_reasoner;
