# Universal Testing Console - Route Select
Version: 1.0.0
Status: inprogress
Agent: WA-Alpha wonderAgent

## Summary
- Allow the testing console visitor to choose both the API route (populated from `/routes-config`) and the entity configuration (e.g., `entity_user_register_config.json` or `entity_user_session_config.json`) before running a test.

## Actions
1. Added route/entity selects inside the `load-routes` section and wired `load-routes` to populate the route list plus the dropdown options.
2. Updated the run test button to require a selected route and entity config and to mention those choices in the log message so testers know which route/entity combination is executed.

## Next Steps
- Reload the universal console, click “Load Routes,” pick a route and entity config, create a test, and run it to see the new context-aware log output.
