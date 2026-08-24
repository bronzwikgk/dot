/**
 * @objective: Transform AST into an executable DumbScript plan.
 * @roadmap: Part of the ourActionLang v2.2.0 deterministic pipeline.
 * @use_cases: Translating natural language intent to system actions.
 * @constraints: Adheres to DumbScript v3 action schemas.
 */
export class ourActionLang_Compiler_v2_2_0_ready_Gem {
  constructor(config = {}) {
    this.actionMap = config.rules?.actionMap ?? {};
  }

  compile(ast) {
    if (!ast || ast.type !== 'root') return [];

    const plan = [];
    for (const node of ast.children) {
      const actionTemplate = this.actionMap[node.type];
      if (actionTemplate) {
        plan.push(this.resolveAction(node, actionTemplate));
      }
    }
    return plan;
  }

  resolveAction(node, template) {
    const action = { ...template };
    // Replace placeholders in payload with node attributes
    if (action.payload) {
      action.payload = JSON.parse(JSON.stringify(action.payload)); // Deep clone
      for (const [key, value] of Object.entries(node.attributes)) {
        this.deepReplace(action.payload, `{{${key}}}`, value);
      }
    }
    return action;
  }

  deepReplace(obj, placeholder, value) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        this.deepReplace(obj[key], placeholder, value);
      } else if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(placeholder, value);
      }
    }
  }
}
