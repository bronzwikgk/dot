Project: projectname
Version: 1.0.20
Status: inprogress
Agent: WA-Alpha wonderAgent

User message: retae all config filesfill in demo data

## Summary
- Added `shunya/ehh/demo/demoApp.config` to capture demo runtime strategy, globals, seeded entities, routes, and storage samples so every config file is backed by concrete data for the demo flow described in your instructions.

## Jobs Queue
1. Ensure automation that loads `demoApp.config` applies the runtime strategy and global variables before the demo is bootstrapped.
2. Keep evolving the manifest/fragments if the demo introduces new code locations or helpers.
3. Document any additional data sheets required for future demo cycles once they arise.

## Status
- Manifest/data update only; no tests were run.
