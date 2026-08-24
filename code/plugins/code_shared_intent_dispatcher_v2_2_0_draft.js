/**
 * @entity intent_dispatcher
 * @meta project: an_app | file_name: shared/code/core/code_shared_intent_dispatcher_v1_1_0_draft.js | version: 1.1.0 | status: draft | author: ox-alpha
 * @objective run a registered intent through its pipeline stages with registry validation.
 * @changelog - 2026-08-22: 1.1.0: added registry validation
 */
"use strict";
var INTENT_DISPATCHER = (function () {
  var pipeline_runner = (typeof an_kernel_pipeline !== "undefined") ? an_kernel_pipeline : null;
  var intent_registry = (typeof INTENT_REGISTRY !== "undefined") ? INTENT_REGISTRY : null;
  var registry_loader = (typeof PIPELINE_REGISTRY_LOADER !== "undefined") ? PIPELINE_REGISTRY_LOADER : null;

  async function run_intent(intent_id, input, options) {
    var intent = intent_registry.get(intent_id);
    if (!intent) return { ok: false, error: "unknown intent: " + intent_id };

    var reg_validation = registry_loader.validate_intent(intent_id);
    if (!reg_validation.ok) return { ok: false, error: "registry validation failed: " + reg_validation.error };

    var validation = intent.validate(input);
    if (!validation.ok) return { ok: false, error: "validation failed", details: validation };
    var stages = intent.stages.map(function (stage_spec) {
      if (typeof stage_spec === "function") return pipeline_runner.define_stage({ id: stage_spec.name || "anonymous", execute: stage_spec });
      return pipeline_runner.define_stage(stage_spec);
    });
    try {
      var outcome = await pipeline_runner.run_pipeline(stages, input, options || {});
      return { ok: true, result: outcome.result, metrics: outcome.ctx.metrics };
    } catch (caught) {
      return { ok: false, error: caught.message || String(caught) };
    }
  }

  function register_intent(spec) {
    intent_registry.register(spec.id, spec);
  }

  return { run_intent: run_intent, register_intent: register_intent };
})();

if (typeof window !== "undefined") window.INTENT_DISPATCHER = INTENT_DISPATCHER;
if (typeof module === "object" && module.exports) module.exports = INTENT_DISPATCHER;
