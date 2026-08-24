/**
 * @entity message_bus
 * @meta project: an_app | file_name: src/core/kernel/message_bus.js | version: 1.0.0 | status: active | author: ox-alpha
 * @objective route request response messages and broadcast events between plugins without imports.
 * @purpose_and_problem_statement rule r3 forbids plugin to plugin imports; the bus is the only channel, and handlers never throw (p1) so failures ride inside envelopes.
 * @usage const unsubscribe = bus.on("topic", handler); const result = await bus.send("topic", payload);
 * @timing created before any subscriber exists (boot step four).
 * @scope_boundaries in_scope: topics, envelopes, error containment. out_of_scope: transport, persistence.
 * @dependencies none.
 * @keywords bus, message, event
 * @invariants send never throws; failures return { errors } envelopes; unknown topics report cleanly.
 * @changelog - 2026-08-22: 1.0.0: initial implementation
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_kernel_bus = api;
})(typeof self !== "undefined" ? self : globalThis, function () {
  function create_message_bus() {
    const routes = new Map();
    async function send(topic, payload) {
      const handlers = routes.get(topic);
      if (!handlers || handlers.length === 0) {
        return { errors: [{ severity: "error", code: "unknown_topic", message: "no handler for topic: " + topic }] };
      }
      try {
        const results = [];
        for (const one_handler of handlers) {
          results.push(await one_handler({ topic, payload }));
        }
        return { data: results.length === 1 ? results[0] : results };
      } catch (caught) {
        return { errors: [{ severity: "error", code: "handler_failure", message: String(caught && caught.message || caught), topic }] };
      }
    }
    function on(topic, handler_function) {
      if (!routes.has(topic)) routes.set(topic, []);
      routes.get(topic).push(handler_function);
      return () => off(topic, handler_function);
    }
    function off(topic, handler_function) {
      const handlers = routes.get(topic) || [];
      const at = handlers.indexOf(handler_function);
      if (at !== -1) handlers.splice(at, 1);
    }
    function emit(event_name, event_payload) {
      return send("event." + event_name, event_payload);
    }
    function topics() {
      return Array.from(routes.keys());
    }
    return { send, on, off, emit, topics };
  }
  return { create_message_bus };
});
