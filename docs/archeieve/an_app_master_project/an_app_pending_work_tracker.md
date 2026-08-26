# An App Pending Work Tracker

## Purpose

This document is the live work tracker for An App planning and development. It records pending items, current status, owner domain, source evidence, conflicts, and next action.

Status values:

- `adopted`: accepted into docs or scope
- `pending`: accepted as needed but not yet defined enough
- `needs_reconciliation`: useful source item conflicts with approved names or existing structure
- `deferred`: useful later but not needed for the next implementation batch
- `blocked`: cannot proceed without a decision
- `done`: completed and validated

## Source Inventory

Reviewed source folder:

`D:\0dot1_Aug_2016_master\gk\shared\experiments\an_app_v5\dataset_an_app_v5`

Dataset folder shape:

| Source Folder | File Count | Role |
| --- | ---: | --- |
| code | 4 | code, entity, behavior, schema, type vocabulary |
| system | 5 | config, dsl, error, provider, value vocabulary |
| ui | 5 | component, event, layout, style, token vocabulary |

Total reviewed dataset files: 14.

Total detected dataset groups: 77.

## Dataset Group Inventory

| Source Area | Dataset Group | Count | Status | Owner Domain | Next Action |
| --- | --- | ---: | --- | --- | --- |
| code | operations | 93 | needs_reconciliation | workflow_system | Compare with approved operation names and `verb_entity` policy. |
| code | tasks | 55 | needs_reconciliation | workflow_system | Split task names from pipeline stage names. |
| code | pipelines | 13 | needs_reconciliation | workflow_system | Map source pipeline names to canonical An App pipeline catalog. |
| code | intents | 124 | pending | an_app_lang | Adopt as intent dataset candidate after duplicate/similar-name review. |
| code | workflows | 4 | needs_reconciliation | workflow_system | Old names need alias/deprecation decisions. |
| code | entity_types | 31 | needs_reconciliation | entity_system | Compare with Entity Type Catalog and add missing approved names. |
| code | traits | 33 | pending | entity_system | Create canonical trait dataset and trait-operation map. |
| code | relationships | 20 | needs_reconciliation | entity_system | Compare with relationship_word_names and add cardinality/inverse metadata. |
| code | content_entities | 4 | adopted | schema_contract | Covered by entity/schema catalog; keep as source evidence. |
| code | code_entities | 2 | adopted | schema_contract | Covered by schema catalog. |
| code | workflow_entities | 7 | adopted | schema_contract | Covered by schema catalog. |
| code | agent_entities | 3 | adopted | schema_contract | Covered by agent/memory docs. |
| code | data_entities | 3 | adopted | schema_contract | Covered by schema catalog. |
| code | system_entities | 6 | adopted | schema_contract | Covered by schema catalog. |
| code | ui_entities | 4 | needs_reconciliation | ui_surface | Normalize `extension` vs plugin/provider terms. |
| code | plugin_entities | 2 | adopted | schema_contract | Covered by plugin/utility distinction. |
| code | data_types | 16 | needs_reconciliation | schema_contract | Compare with schema field type datasets. |
| code | data_shapes | 14 | pending | schema_contract | Add shape validation dataset if missing. |
| system | permission_strings | 23 | pending | provider_system | Define permission namespace/action policy. |
| system | config_keys | 23 | pending | schema_contract | Define config key registry and owner scopes. |
| system | metric_names | 10 | pending | quality_audit | Add metrics to quality target measurement plan. |
| system | dsl_keywords | 16 | needs_reconciliation | an_app_lang | Normalize keyword aliases and avoid source-specific names. |
| system | pipeline_stages | 13 | needs_reconciliation | workflow_system | Map to canonical stage catalog; do not replace canonical stages. |
| system | node_types | 8 | pending | workflow_system | Add workflow node type dataset. |
| system | error_codes | 20 | pending | quality_audit | Align with An App Lang validation codes and generic diagnostics. |
| system | warning_codes | 10 | pending | quality_audit | Align with warning code registry. |
| system | info_codes | 10 | pending | quality_audit | Add info code registry. |
| system | log_levels | 5 | adopted | quality_audit | Already aligned with debug/info/warn/error/fatal. |
| system | storage_providers | 5 | pending | storage_system | Define provider records and optional dependency policy. |
| system | index_providers | 4 | pending | search_index | Define search/index provider records. |
| system | display_providers | 5 | pending | ui_surface | Define display provider records. |
| system | agent_providers | 4 | pending | agent_system | Keep provider output as proposed until validated. |
| system | file_formats | 8 | pending | file_conversion | Align with import/export contracts. |
| system | export_formats | 6 | pending | file_conversion | Add export format validation. |
| system | import_formats | 5 | pending | file_conversion | Add import format validation. |
| system | status_values | 4 | needs_reconciliation | schema_contract | Map `done` to approved `completed` or mark alias. |
| system | credential_types | 4 | pending | provider_system | Add credential type dataset with security policy. |
| system | variable_scopes | 3 | pending | workflow_system | Add scope dataset. |
| system | memory_scopes | 3 | pending | an_memory | Add scope dataset. |
| system | region_roles | 4 | pending | ui_surface | Map to ui region names. |
| system | block_kinds | 10 | needs_reconciliation | ui_surface | Map to approved block_type_names. |
| system | priority_values | 3 | needs_reconciliation | quality_audit | Normalize uppercase P0/P1/P2 to lowercase if active names require snake_case. |
| system | direction_values | 2 | adopted | ui_surface | Useful for sorting/navigation. |
| system | memory_retention | 3 | pending | an_memory | Add retention policy dataset. |
| ui | component_types | 51 | pending | ui_surface | Compare with component/block datasets and add approved names. |
| ui | event_types | 39 | pending | ui_surface | Expand current ui_event_type_names. |
| ui | layout_types | 16 | needs_reconciliation | ui_surface | Separate CSS layout techniques from product layout names. |
| ui | theme_values | 4 | adopted | ui_surface | Already aligned with settings/theme. |
| ui | state_values | 20 | needs_reconciliation | ui_surface | Map to component_state_names and lifecycle states. |
| ui | size_values | 11 | pending | ui_surface | Add size token dataset. |
| ui | spacing_values | 7 | pending | ui_surface | Add spacing token dataset. |
| ui | color_values | 16 | pending | ui_surface | Add semantic color token dataset. |
| ui | font_values | 8 | pending | ui_surface | Add font token dataset. |
| ui | font_size_values | 8 | pending | ui_surface | Add font size token dataset. |
| ui | font_weight_values | 8 | pending | ui_surface | Add font weight token dataset. |
| ui | border_radius_values | 6 | pending | ui_surface | Add border radius token dataset. |
| ui | shadow_values | 6 | pending | ui_surface | Add shadow token dataset. |
| ui | animation_values | 8 | pending | ui_surface | Add animation token dataset. |
| ui | transition_values | 5 | pending | ui_surface | Add transition token dataset. |
| ui | z_index_values | 10 | pending | ui_surface | Add z-index token dataset. |
| ui | breakpoint_values | 5 | pending | ui_surface | Add breakpoint token dataset. |
| ui | container_values | 6 | pending | ui_surface | Add container token dataset. |
| ui | cursor_values | 13 | pending | ui_surface | Add cursor token dataset. |
| ui | position_values | 5 | pending | ui_surface | Add position token dataset. |
| ui | display_values | 7 | pending | ui_surface | Add display token dataset. |
| ui | overflow_values | 4 | pending | ui_surface | Add overflow token dataset. |
| ui | text_align_values | 4 | pending | ui_surface | Add text alignment token dataset. |
| ui | vertical_align_values | 4 | pending | ui_surface | Add vertical alignment token dataset. |
| ui | white_space_values | 5 | pending | ui_surface | Add white-space token dataset. |
| ui | word_break_values | 3 | pending | ui_surface | Add word-break token dataset. |
| ui | object_fit_values | 5 | pending | ui_surface | Add object-fit token dataset. |
| ui | resize_values | 4 | pending | ui_surface | Add resize token dataset. |
| ui | appearance_values | 2 | pending | ui_surface | Add appearance token dataset. |
| ui | user_select_values | 4 | pending | ui_surface | Add user-select token dataset. |
| ui | pointer_events_values | 2 | pending | ui_surface | Add pointer-events token dataset. |

## Pending Work Items

| Work Id | Item | Status | Owner Domain | Priority | Source | Next Action |
| --- | --- | --- | --- | --- | --- | --- |
| work_001 | Build canonical dataset registry from source groups and scratchpad datasets. | pending | dataset_registry | p0 | an_app_v5 datasets | Create registry records with owner, source, count, active/deferred state. |
| work_002 | Reconcile operation/task/pipeline/workflow names. | needs_reconciliation | workflow_system | p0 | code behaviors dataset | Separate generic operations, task names, pipeline names, and workflow names. |
| work_003 | Reconcile entity_types with Entity Type Catalog. | needs_reconciliation | entity_system | p0 | code entities dataset | Add missing entity types or record aliases/deprecations. |
| work_004 | Create trait dataset and trait-operation relationship map. | pending | entity_system | p0 | code entities dataset | Define trait schema and map operations enabled by each trait. |
| work_005 | Reconcile relationship names and add relationship metadata. | needs_reconciliation | entity_system | p0 | code entities dataset | Add inverse/cardinality/source-target rules where needed. |
| work_006 | Add system permission/config/metric datasets. | pending | provider_system | p1 | system config dataset | Define permission string, config key, and metric validation rules. |
| work_007 | Add provider datasets and provider contract records. | pending | provider_system | p1 | system providers dataset | Define storage/index/display/agent provider schemas and optional dependency policy. |
| work_008 | Add file import/export format datasets. | pending | file_conversion | p1 | system providers dataset | Map formats to import/export capabilities and validation rules. |
| work_009 | Reconcile status values with approved lifecycle/status datasets. | needs_reconciliation | schema_contract | p1 | system values dataset | Decide if `done` is alias for `completed`. |
| work_010 | Add variable scope, memory scope, credential type, and retention datasets. | pending | an_memory | p1 | system values dataset | Split owner between memory, provider, workflow, and security policy. |
| work_011 | Reconcile block_kinds with approved block_type_names. | needs_reconciliation | ui_surface | p1 | system values dataset | Map source block kinds to approved block names. |
| work_012 | Add detailed ui component and event datasets. | pending | ui_surface | p1 | ui component/event datasets | Expand current ui dataset with approved components/events. |
| work_013 | Separate product layout names from CSS layout technique names. | needs_reconciliation | ui_surface | p1 | ui layouts dataset | Keep notebook/code_editor/etc. separate from css_grid/css_flex/etc. |
| work_014 | Add ui style and token datasets. | pending | ui_surface | p1 | ui styles/tokens datasets | Add semantic token groups after duplicate review. |
| work_015 | Define requirement-to-user-flow derivation pipeline. | pending | quality_audit | p1 | dev pipeline.txt | Add requirement, feature, entity, intent, operation, flow derivation schemas. |
| work_016 | Add training-vs-execution document mode policy. | pending | an_app_lang | p1 | contextual parsing reasoning source | Ensure training blocks cannot execute and execution blocks cannot update language memory without approval. |
| work_017 | Add reasoning trace and episode schema. | pending | an_memory | p1 | doc_subdomain_reasoning source | Define trace node, episode, disagreement, confidence update, stop rules. |
| work_018 | Normalize book/view type aliases. | pending | ui_surface | p2 | book_type.txt | Map old product names to approved layout names. |
| work_019 | Add app-shell panel behavior checklist. | pending | ui_surface | p2 | actionSpace definition | Cover splash, load folder, context menu, panel controls, raw/preview, resize, panel scroll policy. |
| work_020 | Add RSS feed discovery as external intake use case. | deferred | external_intake | p3 | actionSpace definition | Define later as provider-backed source intake. |
| work_021 | Add knowledge reasoning use cases. | pending | an_memory | p2 | knowledge reasoning dataset | Add dynamic FAQ, policy compliance, tutoring as use cases. |
| work_022 | Define version record schema and dataset names. | pending | version_system | p0 | Git concept model | Add snapshot, branch, diff, merge, conflict, tag, restore, and provenance contracts. |
| work_023 | Define entity diff and conflict utility scope. | pending | version_system | p0 | Git concept model | Decide which comparison logic is utility-level versus plugin-level. |
| work_024 | Define version plugin boundary against action_entity. | pending | version_system | p0 | Git concept model | Use action_entity for record lifecycle and add version behavior only where needed. |
| work_025 | Add version workflow tests. | pending | version_system | p1 | Git concept model | Test snapshot, diff, branch, merge, conflict, restore, tag, and history flows. |

## Conflict And Reconciliation Notes

| Conflict Id | Conflict | Decision Needed |
| --- | --- | --- |
| conflict_001 | Source uses product names as book types. | Use approved layout names and keep old names as aliases only. |
| conflict_002 | Source has `done`; master state catalog uses `completed`. | Prefer `completed`; keep `done` as import alias if needed. |
| conflict_003 | Source uses uppercase priority values `P0`, `P1`, `P2`. | Use lowercase priority values in active datasets or mark uppercase as source-only display labels. |
| conflict_004 | Source layout types include CSS techniques and product layouts together. | Split into `layout_word_names` and `css_layout_technique_names`. |
| conflict_005 | Source dataset files use `.dataset` format while scratchpad uses JS module dataset. | Treat `.dataset` as source artifact; active implementation format remains a project decision. |

## Next Batch Recommendation

Recommended next batch:

1. Add/reconcile dataset groups in scratchpad dataset file only.
2. Update master spec with requirement-to-user-flow derivation.
3. Update An App Lang docs with training/execution separation.
4. Update An Memory/Quality docs with reasoning trace and episode schema.
5. Re-run dataset validation and tracker status update.

No `dot` changes are required for this tracker.
