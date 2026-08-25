import { stage_names as default_stage_order } from "../utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js";

const callable_type = typeof (() => {});

class entity_runner {
  constructor(config = {}) {
    this.config = {
      allowed_stage_names: default_stage_order,
      default_stages: config.default_stages || config.stage_order || [],
      stop_on_error: true,
      strict_stages: true,
      ...config
    };
    if (!this.config.stage_order) this.config.stage_order = this.config.allowed_stage_names;
    this.stages = new Map();
  }

  register_stage(name, handler) {
    if (!this.config.allowed_stage_names.includes(name)) throw new Error(`unknown stage '${name}'`);
    if (typeof handler !== callable_type) throw new Error("handler must be callable");
    this.stages.set(name, handler);
    return { ok: true, name };
  }

  async run(input, options = {}) {
    const context = {
      input,
      value: input,
      entities: [],
      diagnostics: [],
      timings: [],
      options
    };
    const requested = options.stages || (this.config.default_stages.length > 0 ? this.config.default_stages : Array.from(this.stages.keys()));
    for (const stage of requested) {
      if (!this.stages.has(stage)) {
        context.diagnostics.push({ stage, level: "error", message: `stage '${stage}' is not registered` });
        if (this.config.stop_on_error || this.config.strict_stages) break;
        continue;
      }
      const started = Date.now();
      try {
        const next = await this.stages.get(stage)(context.value, context);
        if (next !== undefined) context.value = next;
        context.timings.push({ stage, ok: true, ms: Date.now() - started });
      } catch (error) {
        context.diagnostics.push({ stage, level: "error", message: error.message });
        context.timings.push({ stage, ok: false, ms: Date.now() - started });
        if (this.config.stop_on_error) break;
      }
    }
    return { ok: context.diagnostics.every((item) => item.level !== "error"), context, value: context.value };
  }
}

export { entity_runner, default_stage_order };
export default entity_runner;
