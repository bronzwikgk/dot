/**
 * @entity intent_registry
 * @meta project: an_app | file_name: shared/code/core/code_shared_intent_registry_v1_0_0_draft.js | version: 1.0.0 | status: draft | author: ox-alpha
 * @objective map user intents to pipeline stages; dispatcher runs the correct pipeline.
 * @changelog - 2026-08-22: 1.0.0: initial implementation
 */
"use strict";
var INTENT_REGISTRY = (function () {
  var intents = {};

  function register(intent_id, spec) {
    intents[intent_id] = {
      id: intent_id,
      phrases: spec.phrases || [],
      input_shape: spec.input_shape || {},
      stages: spec.stages || [],
      response_shape: spec.response_shape || {},
      validate: spec.validate || function () { return {ok: true}; }
    };
  }

  function lookup(phrase) {
    var lower = phrase.toLowerCase();
    for (var id in intents) {
      var intent = intents[id];
      for (var i = 0; i < intent.phrases.length; i++) {
        if (lower.indexOf(intent.phrases[i].toLowerCase()) !== -1) return intent;
      }
    }
    return null;
  }

  function get(intent_id) { return intents[intent_id] || null; }
  function all() { return Object.keys(intents); }

  return { register: register, lookup: lookup, get: get, all: all };
})();

if (typeof window !== "undefined") window.INTENT_REGISTRY = INTENT_REGISTRY;
if (typeof module === "object" && module.exports) module.exports = INTENT_REGISTRY;
