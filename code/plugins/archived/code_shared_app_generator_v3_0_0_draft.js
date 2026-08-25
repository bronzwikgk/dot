import { entity_validator } from "../utilities/code_shared_entity_validator_v3_0_0_draft.js";

class app_generator {
  constructor(config = {}) {
    this.config = config;
    this.validator = config.validator || new entity_validator();
  }

  plan_app(app_entity, related_entities = []) {
    this.validator.assert_valid({ ...app_entity, status: app_entity.status || "draft" });
    for (const entity of related_entities) {
      this.validator.assert_valid({ ...entity, status: entity.status || "draft" });
      this.validator.assert_safe_name(entity.name);
    }
    const routes = related_entities.filter((entity) => entity.type === "route");
    const views = related_entities.filter((entity) => entity.type === "view");
    const components = related_entities.filter((entity) => entity.type === "component");
    return {
      app: app_entity.id,
      files: [
        ...routes.map((entity) => ({ path: `code/routes/${entity.name}.js`, entity: entity.id })),
        ...views.map((entity) => ({ path: `code/views/${entity.name}.js`, entity: entity.id })),
        ...components.map((entity) => ({ path: `code/components/${entity.name}.js`, entity: entity.id }))
      ],
      relationships: related_entities.map((entity) => ({ from: app_entity.id, to: entity.id, type: "contains" }))
    };
  }

  compose_manifest(plan) {
    return JSON.stringify({
      app: plan.app,
      files: plan.files,
      relationships: plan.relationships
    }, null, 2);
  }
}

export { app_generator };
export default app_generator;
