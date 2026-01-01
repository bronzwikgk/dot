# Work Log
- Request: add clear instructions and ensure every config is constant.
- Action: introduced the `instructions` constant array describing how to use the configs and re-exported it with the other constants in `ehh_gk_v1`.
- Result: Consumers now see the recommended workflow (import/export) and know to treat each configuration section as immutable.
- Request: merge the runtime instructions and the agent guidelines into a single unique array.
- Action: consolidated all guidance into one `instructions` array and now export that as the single source of truth while removing the separate `agentInstructions`.
- Result: Consumers see one combined instruction set that covers runtime steps plus agent behaviors.
