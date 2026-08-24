/**
 * @entity global_context
 * @meta project: gui_v4 | file_name: shared/code/core/kernel/code_shared_global_context_v1_0_0_active.js | version: 1.0.0 | status: active | author: ox-alpha
 * @objective assemble the one frozen facade handed to every plugin at activation.
 * @purpose_and_problem_statement rule r2 forbids direct kernel imports; g1 freezes the context while registries inside stay open; g4 lets permissions deny capabilities with error responses instead of throws.
 * @usage const ctx = build_global_context({ config, env, bus, store });
 * @timing built once at boot step eight.
 * @scope_boundaries in_scope: facade assembly and permission gating. out_of_scope: what plugins do with access.
 * @dependencies kernel modules.
 * @keywords context, facade, permission
 * @invariants facade members are readonly after boot; denied capability calls return error responses.
 * @changelog - 2026-08-22: 1.0.0: initial implementation
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_kernel_context = api;
})(typeof self !== "undefined" ? self : globalThis, function () {
  function deny(topic_label) {
    return { errors: [{ code: "permission_denied", message: "capability not granted: " + topic_label }] };
  }
  function build_global_context(parts) {
    const permissions = new Set((parts.config.permissions || ["bus.*", "entities.read", "log.*"]));
    const allowed = (needle) => {
      for (const one of permissions) {
        if (one === needle) return true;
        if (one.endsWith(".*") && needle.startsWith(one.slice(0, -1))) return true;
      }
      return false;
    };
    const state_shelves = new Map();
    const ctx = {
      config: Object.freeze(parts.config),
      env: Object.freeze(parts.env),
      types: parts.registries.types,
      traits: parts.registries.traits,
      ops: parts.registries.operations,
      templates: parts.registries.templates,
      get bus() {
        if (!allowed("bus.send")) return { send: async () => deny("bus.send"), on: () => () => {}, emit: async () => deny("bus.send") };
        return parts.bus;
      },
      entities: {
        create_entity: parts.entity_api.create_entity,
        carries_trait: parts.entity_api.carries_trait,
        list: allowed("entities.read") ? parts.store.list_entities : async () => deny("entities.read"),
        save: allowed("entities.write") ? parts.store.save_entity : async () => deny("entities.write")
      },
      store: {
        save: allowed("store.save") ? parts.store.save_entity : async () => deny("store.save"),
        load: allowed("store.load") ? parts.store.load_entity : async () => deny("store.load"),
        list: allowed("store.load") ? parts.store.list_entities : async () => deny("store.load"),
        revert: allowed("store.save") ? parts.store.revert_entity : async () => deny("store.save")
      },
      log: {
        debug: m => parts.log.debug(m), info: m => parts.log.info(m),
        warn: m => parts.log.warn(m), error: m => parts.log.error(m),
        get_logs: parts.log.get_logs
      },
      metrics: parts.metrics,
      state(id_value) {
        if (!state_shelves.has(id_value)) state_shelves.set(id_value, {});
        return state_shelves.get(id_value);
      }
    };
    return Object.freeze(ctx);
  }
  return { build_global_context };
});
