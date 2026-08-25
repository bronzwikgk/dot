# User Flows - V5 Implementation

**Version:** v5.0.0
**Status:** proposed
**Owner:** agent_3_agent_lang_and_memory
**Date:** 2026-08-26

---

## 1. User Flow Catalog

| Flow ID | User Flow | Pipeline Path | Backend Method | Status |
|---|---|---|---|---|
| flow_001 | Create book | ingest, validate, plan, execute, display, persist, audit, respond | create_book | Ready |
| flow_002 | Create book from template | ingest, resolve, validate, execute, display, persist, audit, respond | create_book + get_template | Ready |
| flow_003 | Import file | ingest, validate, persist, audit, respond | save + create | Ready |
| flow_004 | Export file | read, compose, persist, audit, respond | load + read | Ready |
| flow_005 | Save | persist, audit, respond | save | Ready |
| flow_006 | Undo | read, update, audit, respond | undo | Ready |
| flow_007 | Redo | read, update, audit, respond | redo | Ready |
| flow_008 | Move cell up | validate, update, audit, respond | update order | Ready |
| flow_009 | Move cell down | validate, update, audit, respond | update order | Ready |
| flow_010 | Delete cell | validate, delete, audit, respond | delete | Ready |
| flow_011 | Create text cell | validate, execute, display, persist, audit, respond | create_cell | Ready |
| flow_012 | Create pipeline cell | validate, execute, display, persist, audit, respond | create_cell | Ready |
| flow_013 | Create code cell | validate, execute, display, persist, audit, respond | create_cell | Ready |
| flow_014 | Insert component | validate, execute, display, persist, audit, respond | create_component | Ready |
| flow_015 | Insert filter | validate, execute, display, persist, audit, respond | query | Ready |
| flow_016 | Run active cell | validate, execute, audit, respond | execute | Ready |
| flow_017 | Run selected cells | validate, execute, audit, respond | execute | Ready |
| flow_018 | Run all cells | validate, execute, audit, respond | execute | Ready |
| flow_019 | Execute DAG | resolve, validate, plan, execute, audit, respond | execute_flow | Ready |
| flow_020 | Execute flow | resolve, validate, plan, execute, audit, respond | execute_flow | Ready |
| flow_021 | Reset outputs | validate, execute, audit, respond | update outputs | Ready |
| flow_022 | Switch to Jupyter | display, audit, respond | render_layout | Ready |
| flow_023 | Switch to Notion | display, audit, respond | render_layout | Ready |
| flow_024 | Switch to VSCode | display, audit, respond | render_layout | Ready |
| flow_025 | Switch to Flow Builder | display, audit, respond | render_layout | Ready |
| flow_026 | Toggle sidebar | state, audit, respond | state toggle | Ready |
| flow_027 | Global search | ingest, resolve, validate, execute, display, audit, respond | search | Ready |
| flow_028 | Show templates panel | read, display, audit, respond | list_templates | Ready |
| flow_029 | Start tour | read, display, audit, respond | add_tour_step | Ready |
| flow_030 | Open settings | read, display, audit, respond | read config | Ready |

---

## 2. Entity Types Used

| Entity Type | Used In Flows | Backend Method |
|---|---|---|
| book | flow_001, flow_002, flow_003, flow_004, flow_005 | create_book, read, update, delete |
| cell | flow_008-013, flow_016-018 | create_cell, list_cells, update, delete |
| template | flow_002, flow_028 | get_template, list_templates |
| workflow | flow_019, flow_020 | execute_flow |
| component | flow_014 | create_component |
| command | flow_027 | search |
| view | flow_022-025 | render_layout |
| state | flow_026 | update state |
| config | flow_030 | read config |

---

## 3. Backend Methods Available

| Method | Description | Flows Using |
|---|---|---|
| create(type, data) | Create any entity | all |
| read(id) | Read entity | all |
| update(id, updates) | Update entity | flow_006-009 |
| delete(id) | Delete entity | flow_010 |
| query(filter) | Query entities | flow_015 |
| search(query) | Search entities | flow_027 |
| create_book(data) | Create book | flow_001, 002 |
| create_cell(data) | Create cell | flow_011-013 |
| create_component(data) | Create component | flow_014 |
| list_cells(book_id) | List cells | flow_016-018 |
| resolve_reference(ref) | Resolve reference | flow_019, 020 |
| save(key, data) | Persist data | flow_003, 005 |
| load(key) | Load data | flow_004 |
| undo() | Undo action | flow_006 |
| redo() | Redo action | flow_007 |
| record_action(action, id, before, after) | Record for undo | flow_006, 007 |
| audit(action, target_id) | Audit log | all |
| get_audit_log() | Get audit | flow_030 |

---

## 4. CSS Available

| File | Purpose |
|---|---|
| reset.css | Browser reset |
| tokens.css | Design tokens |
| shared.css | Component styles |
| app.css | Layout styles |
| book.css | Content styles |

---

## 5. Datasets Available

| Dataset | Items | Purpose |
|---|---|---|
| entity_types_v1_0_0 | 50 | All entity types |
| relationships_v1_0_0 | 41 | All relationships |
| states_v1_0_0 | 104 | All state values |
| pipeline_stages_v1_0_0 | 16 | Pipeline stages |
| attributes_v1_0_0 | 73 | Entity attributes |
| ui_states_v1_0_0 | 35 | UI states |
| layout_names_v1_0_0 | 26 | Layout names |
| domains_v1_0_0 | 19 | Domains |
| datamap_entity_relationships_v1_0_0 | 41 | Entity relationships |
| datamap_user_intents_v1_0_0 | 29 | User intents |
| datamap_system_operations_v1_0_0 | 48 | System operations |

---

*Version history: v5.0.0 - Initial user flows documentation*
