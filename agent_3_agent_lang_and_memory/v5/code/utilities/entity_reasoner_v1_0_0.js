// entity_reasoner.js
// Entity reasoner utility

class entity_reasoner {
  constructor(config = {}) {
    this.config = config;
  }

  reason(facts, rules) {
    const findings = [];
    for (const rule of rules || []) {
      if (rule.condition && rule.condition(facts)) {
        findings.push({ rule: rule.name, action: rule.action });
      }
    }
    return findings;
  }

  classify(entity, categories) {
    if (!entity || !categories) return null;
    for (const cat of categories) {
      if (cat.matches && cat.matches(entity)) {
        return cat.name;
      }
    }
    return "unknown";
  }

  evaluate(expression, context) {
    if (!expression) return null;
    if (expression.type === "literal") return expression.value;
    if (expression.type === "variable") return context[expression.name] || null;
    return expression;
  }
}

export default entity_reasoner;
export { entity_reasoner };
