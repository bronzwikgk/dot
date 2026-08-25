/**
 * template_system_v1_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Domain templates and artifact templates for LMS, fintech organization,
 * single user, stock trading research, websites, products, reports,
 * flows, and agents.
 */

import action_entity from "./action_entity_v5_0_0.js";

class template_system {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = new action_entity({ actor: this.config.actor });
  }

  register_template(config = {}) {
    return this.entities.create("template", {
      name: config.name || "untitled_template",
      data: { content: config.content || {}, category: config.category || "general" }
    });
  }

  get_template(template_id) {
    return this.entities.read(template_id);
  }

  list_templates(category = null) {
    const filter = category ? { type: "template", "data.category": category } : { type: "template" };
    return this.entities.query(filter);
  }

  instantiate(template_id, overrides = {}) {
    const template = this.entities.read(template_id);
    if (!template) return null;
    return this.entities.create("template", {
      name: `instance_${template.name}`,
      data: { ...template.data, ...overrides, template_id }
    });
  }
}

export default template_system;
export { template_system };
