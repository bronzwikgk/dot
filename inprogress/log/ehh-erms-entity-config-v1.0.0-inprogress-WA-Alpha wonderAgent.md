# ehh Integration of ERM Entities log
Date: 2026-01-01 18:25 UTC

Changes:
- Added `dataset_entity_erms_config.txt` so each ERM entry (Entity, Index, Dataset, Agent, Room, Chat Session, etc.) now has a config schema, policy, and filesystem storage definition.
- `ActionApp` now registers those ERM entities under `/api/v1/<slug>` so backend routes exist for every catalog entry and reuse the shared validator/RBAC helpers.
- Logged the entity validation mapping in the manifest and kept the automations/test wiring unchanged.

User request: I want all those entity config in our system so that we can test them in backend routes
