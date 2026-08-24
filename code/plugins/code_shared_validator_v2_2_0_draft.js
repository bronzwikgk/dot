/**
 * @objective: Validate AST and compiled plans against dataset schemas and rules.
 * @roadmap: Lifecycle stage: validate_and_gate.
 */
export class ourActionLang_ValidationPipeline_v2_2_0_ready_Gem {
  constructor(config = {}) {
    this.schemas = config.datasets?.schemas ?? [];
    this.rules = config.datasets?.rules ?? [];
    this.shapes = config.rules?.shapes ?? [];
    this.shapeByName = this.indexBy(this.shapes, "name");
    this.shapeById = this.indexBy(this.shapes, "id");
  }

  validate(ast, plan) {
    const report = {
      stages: {
        schema_resolution: { pass: true, errors: [], warnings: [] },
        rule_fact_evaluation: { pass: true, errors: [], warnings: [] },
        execution_readiness: { pass: true, errors: [], warnings: [] }
      },
      errors: [],
      warnings: [],
      pass: true
    };

    this.validateSchemaResolution(ast, report.stages.schema_resolution);
    this.validateRuleFactEvaluation(plan, report.stages.rule_fact_evaluation);
    this.validateExecutionReadiness(plan, report.stages.execution_readiness);

    for (const stageName of Object.keys(report.stages)) {
      const stage = report.stages[stageName];
      if (stage.errors.length > 0) {
        stage.pass = false;
        report.pass = false;
      }
      report.errors.push(...stage.errors);
      report.warnings.push(...stage.warnings);
    }

    return report;
  }

  validateSchemaResolution(ast, stage) {
    const children = ast?.children ?? [];
    for (let i = 0; i < children.length; i += 1) {
      const node = children[i];
      if (!node || node.type === "literal") {
        continue;
      }
      if (typeof node.type === "string" && node.type.startsWith("directive_")) {
        continue;
      }

      const shape = this.shapeByName[node.type];
      if (!shape) {
        stage.errors.push({
          stage: "schema_resolution",
          code: "UNKNOWN_SHAPE",
          message: `Unknown shape for node type '${node.type}'`
        });
        continue;
      }

      const schema = this.findSchemaForShape(shape.id);
      if (!schema) {
        stage.warnings.push({
          stage: "schema_resolution",
          code: "MISSING_SCHEMA",
          message: `No schema found for shape '${shape.id}'`
        });
        continue;
      }

      const attrs = node.attributes ?? {};
      const required = schema.requiredFields ?? [];
      for (let j = 0; j < required.length; j += 1) {
        const field = required[j];
        if (!(field in attrs)) {
          stage.errors.push({
            stage: "schema_resolution",
            code: "MISSING_REQUIRED_ATTRIBUTE",
            message: `Missing required attribute '${field}' for node '${node.type}'`
          });
        }
      }
    }
  }

  validateRuleFactEvaluation(plan, stage) {
    const actions = Array.isArray(plan) ? plan : [];
    for (let i = 0; i < actions.length; i += 1) {
      const action = actions[i];
      const matchingRules = this.rules.filter((rule) => rule.targetCommand === action.command);

      for (let j = 0; j < matchingRules.length; j += 1) {
        const rule = matchingRules[j];
        const payload = action.payload ?? {};
        const value = payload[rule.field];

        if (rule.type === "required") {
          if (value === undefined || value === null || value === "") {
            stage.errors.push({
              stage: "rule_fact_evaluation",
              code: rule.id,
              message: rule.message,
              command: action.command
            });
          }
        }

        if (rule.type === "maxLength") {
          if (typeof value === "string" && typeof rule.value === "number" && value.length > rule.value) {
            stage.errors.push({
              stage: "rule_fact_evaluation",
              code: rule.id,
              message: rule.message,
              command: action.command
            });
          }
        }
      }
    }
  }

  validateExecutionReadiness(plan, stage) {
    const actions = Array.isArray(plan) ? plan : [];
    for (let i = 0; i < actions.length; i += 1) {
      const action = actions[i];
      if (!action.command || typeof action.command !== "string") {
        stage.errors.push({
          stage: "execution_readiness",
          code: "MISSING_COMMAND",
          message: "Compiled action is missing command"
        });
      }

      if (action.payload && typeof action.payload !== "object") {
        stage.errors.push({
          stage: "execution_readiness",
          code: "INVALID_PAYLOAD",
          message: `Payload for command '${action.command}' must be object`
        });
      }
    }
  }

  findSchemaForShape(shapeId) {
    for (let i = 0; i < this.schemas.length; i += 1) {
      if (this.schemas[i].shapeId === shapeId) {
        return this.schemas[i];
      }
    }
    return null;
  }

  indexBy(items, key) {
    const out = {};
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item && typeof item[key] === "string") {
        out[item[key]] = item;
      }
    }
    return out;
  }
}

export default ourActionLang_ValidationPipeline_v2_2_0_ready_Gem;
