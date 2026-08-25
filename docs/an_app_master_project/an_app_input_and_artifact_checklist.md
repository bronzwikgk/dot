# An App Input And Artifact Checklist

## Purpose

This checklist defines what an agent, developer, or maintainer should collect before creating, updating, validating, or reviewing an An App artifact.

## Input Checklist

| Id | Input Kind | Required Fields | Validation |
| --- | --- | --- | --- |
| input_001 | natural_english_request | raw_text, user_goal, target_domain, expected_output | parse intent, detect incomplete request, map approved names |
| input_002 | structured_command | command_type, target_entity, parameters, policy_context | command type approved, target resolves, risky action approved |
| input_003 | source_document | source_path, source_type, domain_hint, adoption_goal | source exists, file type supported, evidence retained |
| input_004 | dataset_file | dataset_name, owner_domain, values, source_ref | one-dimensional array, snake_case, duplicate check, banned-word check |
| input_005 | schema_file | schema_name, owner_domain, fields, required_fields, validation_rules | field types approved, required fields complete |
| input_006 | layout_tree | root_node, node_types, data_refs, content_refs, token_refs | layout node schema, tag ontology, singleton rules |
| input_007 | template_request | template_type, target_domain, required_slots, expected_artifacts | template type approved, slots filled |
| input_008 | workflow_request | trigger, stages, dependencies, conditions, rollback, audit_policy | stage names approved, dependencies resolve, conditions validate |
| input_009 | business_domain_request | domain_name, entities, user_flows, reports, policies, integrations | domain exists or domain proposal is created |
| input_010 | ui_request | layout, target_entity, interaction_mode, route, state_policy | layout approved, route schema valid, state entity exists |
| input_011 | bot_request | session_id, message, context_refs, allowed_actions | context resolved, action policy checked |
| input_012 | trading_research_request | symbols, timeframe, data_source, strategy, backtest_policy | no live trading, data quality checks |
| input_013 | fintech_operations_request | organization, product, transaction/account refs, compliance_policy | no real money movement in V1, compliance checks |
| input_014 | concept_definition | name, layer, definition, purpose, attributes, operations, relationships, constraints, examples, validation | concept shape complete and layer approved |
| input_015 | vocabulary_proposal | proposed_name, owner_domain, reason, source_ref, similar_matches, replacement_for | registry searched, similar names checked, reservation recorded |
| input_016 | provider_definition | provider_name, provider_type, interface_contract, config_keys, permissions, fallback_policy | provider type approved, interface complete, output validation required |
| input_017 | dataset_artifact | category, subcategory, type_names, word_arrays, changelog | flat arrays, no duplicates, owner category known |
| input_018 | storage_request | entity_ref, storage_provider, save_mode, version_policy, autosave_policy | provider approved, version policy explicit |
| input_019 | index_request | entity_refs, index_fields, search_modes, autocomplete_policy | fields resolve, search modes approved |
| input_020 | editor_interaction_request | surface, command, target_ref, selection, cursor_state, context_menu_state | surface and command approved |
| input_021 | workflow_builder_request | nodes, edges, node_configs, trigger, error_policy | node types approved, edges acyclic |
| input_022 | agent_workspace_request | agent_refs, task, memory_refs, capability_refs, approval_policy | permissions and approvals checked |

## Artifact Checklist

| Id | Artifact Kind | Required Output | Validation |
| --- | --- | --- | --- |
| artifact_001 | entity_record | entity JSON with config, schema, relationships, policy, provenance, status | entity schema validation |
| artifact_002 | dataset | approved one-dimensional array plus owner doc | dataset report passes |
| artifact_003 | schema_contract | required fields, optional fields, field types, validation rules | schema records validate |
| artifact_004 | utility | class-based utility, config, public methods, tests, doc, log | test utility passes |
| artifact_005 | plugin | class-based plugin, config, dependencies, input/output validation, doc, log | plugin smoke and generated tests pass |
| artifact_006 | workflow | stages, dependencies, conditions, rollback, audit records | runner validation passes |
| artifact_007 | template | input slots, artifact list, defaults, examples, limits | slots validate |
| artifact_008 | ui_layout | layout tree, render profile, route refs, state refs | layout node and ui ontology checks pass |
| artifact_009 | rendered_view | display artifact, lifecycle state, diagnostics | render output non-empty and state recorded |
| artifact_010 | bot_capability | trigger patterns, actions, constraints, examples | capability schema validation |
| artifact_011 | business_app | app definition, routes, views, templates, data, policies, test report | app shell checklist passes |
| artifact_012 | audit_report | inventory count, coverage count, gaps, conflicts, recommendations | audit schema validation |
| artifact_013 | release_note | changed files, tests, known limits, commit message | maintainer review complete |
| artifact_014 | concept_record | concept definition with all required concept fields | concept contract passes |
| artifact_015 | vocabulary_reservation | approved/proposed name, source, reason, similar-name decision, lifecycle state | naming governance passes |
| artifact_016 | provider_record | provider entity with interface, config, permissions, health, fallback, audit | provider schema validation |
| artifact_017 | dataset_registry_report | code/ui/system/domain dataset counts and duplicate findings | registry report passes |
| artifact_018 | storage_record | persisted entity ref, provider, version, save mode, timestamp, recovery state | storage schema validation |
| artifact_019 | index_record | indexed entity refs, fields, search modes, stats, rebuild state | index schema validation |
| artifact_020 | editor_command_record | command, target, selection, before state, after state, diagnostics | command schema validation |
| artifact_021 | workflow_builder_record | visual nodes, edges, configs, execution policy, logs | workflow schema validation |
| artifact_022 | agent_run_record | agent, task, memory refs, capability calls, approval decisions, artifacts | agent audit validation |
| artifact_023 | user_flow_record | flow id, trigger, actors, entities, pipeline stages, permissions, states, outputs | user flow schema validation |
| artifact_024 | state_catalog_record | state group, values, owner domain, allowed transitions | state catalog validation |
| artifact_025 | permission_catalog_record | permission strings, config keys, metric names, owner domain | system dataset validation |

## Concept Checklist

| Id | Check | Rule |
| --- | --- | --- |
| concept_check_001 | required fields | concept has name, layer, definition, purpose, attributes, operations, relationships, constraints, examples, validation |
| concept_check_002 | layer | layer is domain, behavior, ui, system, or approved domain-specific layer |
| concept_check_003 | name | active name is snake_case |
| concept_check_004 | examples | examples are concrete enough to test or validate |
| concept_check_005 | operations | operations reference approved operation names |
| concept_check_006 | relationships | relationships reference approved relationship names |
| concept_check_007 | validation | validation rules are explicit and testable |

## Vocabulary Checklist

| Id | Check | Rule |
| --- | --- | --- |
| vocab_check_001 | exact search | existing approved names searched before creation |
| vocab_check_002 | similar search | similar-word map checked before creation |
| vocab_check_003 | bag search | bag-of-words checked for overlapping component words |
| vocab_check_004 | reservation | new name is reserved before active use |
| vocab_check_005 | deprecation | replaced names are deprecated with replacement and changelog |
| vocab_check_006 | operation name | operation-specific names follow `verb_entity` where possible |
| vocab_check_007 | source | source reference and owner domain are recorded |

## ui Compiler Checklist

Use this checklist for layout-tree driven ui work.

| Id | Check | Rule |
| --- | --- | --- |
| ui_check_001 | layout nodes | every node has an approved node type |
| ui_check_002 | semantic tags | every tag is approved or explicitly proposed |
| ui_check_003 | tag relationships | parent-child relationships match ontology rules when rules exist |
| ui_check_004 | singleton tags | singleton tags appear no more than once per viewport |
| ui_check_005 | placeholders | every `{{slot}}` resolves to content or data |
| ui_check_006 | repeaters | every repeater has `data_path` and `template` |
| ui_check_007 | tokens | every design token reference resolves |
| ui_check_008 | route | route segments match approved segment names |
| ui_check_009 | lifecycle | render lifecycle state is recorded |
| ui_check_010 | diagnostics | failed render produces errors, not silent empty output |
| ui_check_011 | shell navigation | header, nav, hover menus, search, and window controls resolve to ui entities |
| ui_check_012 | editor tabs | active tabs, dirty state, and target entity refs are tracked |
| ui_check_013 | edit gestures | double-click edit and rename actions map to approved commands |
| ui_check_014 | clipboard | cut, copy, paste preserve audit and validation state |
| ui_check_015 | find replace | find and replace produces preview or audit before governed mutation |
| ui_check_016 | template insertion | inserted cells or blocks come from approved templates |
| ui_check_017 | autosave | autosave creates recoverable version records when enabled |

## Pipeline Debug Checklist

| Id | Check | Rule |
| --- | --- | --- |
| pipeline_check_001 | full run | full pipeline produces stage records |
| pipeline_check_002 | single stage | one stage can run with supplied context |
| pipeline_check_003 | dry run | dry run produces diagnostics without side effects |
| pipeline_check_004 | step forward | debug mode can advance one stage |
| pipeline_check_005 | step backward | debug mode can restore previous stage state when policy allows |
| pipeline_check_006 | trace | trace records inputs, outputs, timings, warnings, and errors |
| pipeline_check_007 | stop on error | stop/fallback/skip behavior follows policy |
| pipeline_check_008 | interrupt | running execution can be interrupted when policy allows |
| pipeline_check_009 | resume | interrupted or paused execution can resume from a valid state |

## Storage And Index Checklist

| Id | Check | Rule |
| --- | --- | --- |
| store_check_001 | save | saved entity has id, version, provider, timestamp, and status |
| store_check_002 | autosave | autosave interval and recovery policy are explicit |
| store_check_003 | version | versions can be listed and retrieved |
| store_check_004 | revert | revert creates a new traceable state, not silent overwrite |
| store_check_005 | import formats | json, markdown, csv, and xml import support is documented by provider |
| store_check_006 | export formats | json, markdown, HTML, pdf, and xml export support is documented by provider |
| index_check_001 | index fields | indexed fields resolve to entity attributes or content |
| index_check_002 | fuzzy search | fuzzy threshold is explicit |
| index_check_003 | autocomplete | autocomplete result limit is explicit |
| index_check_004 | rebuild | rebuild reports indexed count and failures |

## Entity Operation Checklist

| Id | Check | Rule |
| --- | --- | --- |
| entity_check_001 | append | append records parent, child, position, before state, after state, and audit ref |
| entity_check_002 | insert | insert records target, position, ordering policy, before state, after state, and audit ref |
| entity_check_003 | query | query condition validates before execution |
| entity_check_004 | link | source, target, relationship type, and cardinality validate before link creation |
| entity_check_005 | unlink | removed link is audited and not silently lost |
| entity_check_006 | path | path finding reports visited count and unresolved refs |
| entity_check_007 | trace | connection tracing reports source, targets, relationship types, and cycles |

## Context Checklist

| Id | Check | Rule |
| --- | --- | --- |
| context_check_001 | get | key lookup reports missing values clearly |
| context_check_002 | set | writes validate scope and permission |
| context_check_003 | check | existence check distinguishes false value from missing value |
| context_check_004 | delete | deletion follows policy and audit requirement |
| context_check_005 | push | child context records parent ref |
| context_check_006 | pop | pop restores parent context safely |
| context_check_007 | merge | merge reports overwritten keys |
| context_check_008 | clear | clear is blocked or audited for governed context |

## System Dataset Checklist

| Id | Check | Rule |
| --- | --- | --- |
| system_check_001 | permissions | permission strings use approved namespace/action pattern |
| system_check_002 | config keys | config keys are approved and owner-scoped |
| system_check_003 | metrics | metric names are approved and measured consistently |
| system_check_004 | providers | provider names, types, states, and interfaces validate |
| system_check_005 | diagnostics | error, warning, info, and log-level values are approved |

## Agent Review Checklist

Before marking work complete:

- confirm source files reviewed
- confirm no banned words were added as approved names
- confirm new terms use approved snake_case
- confirm the owning domain doc was updated
- confirm the dataset registry was updated when names were added
- confirm schema contract was updated when shapes were added
- confirm tests or validation commands were run
- confirm known limits are documented
- confirm next action is clear
