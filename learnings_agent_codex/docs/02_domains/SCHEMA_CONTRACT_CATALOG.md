# Schema Contract Catalog

## Purpose

This catalog defines the minimum shape for important An App records. It is a human-readable contract source until the same records are represented in code.

## Common Record Fields

Every persistent record should support:

- `id`
- `type`
- `name`
- `owner_domain`
- `status`
- `version`
- `created_at`
- `updated_at`
- `provenance`
- `policy_refs`
- `validation_state`

## Entity Schema

Required fields:

- `id`
- `type`
- `name`
- `config`
- `attributes`
- `relationships`
- `policies`
- `contracts`
- `status`
- `provenance`

Contract:

- entity type must be approved
- relationship targets must resolve
- config must match the entity type schema
- policy violations must block unsafe activation

## Relationship Schema

Required fields:

- `id`
- `type`
- `source_id`
- `target_id`
- `cardinality`
- `direction`
- `status`
- `provenance`

Contract:

- type must be approved
- source and target must exist
- cardinality must be valid for the relationship type
- cycles must be reported where unsafe

## Command Schema

Required fields:

- `id`
- `phrase`
- `intent`
- `capability_id`
- `action_id`
- `risk_level`
- `confirmation_mode`
- `status`
- `outcome`

Contract:

- command must map to an approved capability
- risky commands require confirmation
- incomplete commands create clarification requests
- execution must create a log entry

## Capability Schema

Required fields:

- `id`
- `name`
- `domain`
- `allowed_input`
- `output`
- `policy_refs`
- `action_refs`
- `test_refs`
- `owner`

Contract:

- capability must have at least one action
- input and output must be documented
- policy must define approval and failure behavior

## Action Schema

Required fields:

- `id`
- `name`
- `capability_id`
- `input_schema`
- `output_schema`
- `policy_refs`
- `log_schema`

Contract:

- action must validate input before execution
- action must validate output after execution
- action must report failures with evidence

## Flow Schema

Required fields:

- `id`
- `name`
- `trigger`
- `steps`
- `conditions`
- `approval_gates`
- `rollback_plan`
- `audit_refs`
- `error_handling`

Contract:

- every step must reference an approved action
- conditions must be validated
- approval gates must be explicit
- failed steps must produce recoverable reports
- error handling must map condition to recovery action

## Template Schema

Required fields:

- `id`
- `name`
- `template_type`
- `domain`
- `parameters`
- `entities`
- `relationships`
- `views`
- `flows`
- `policies`
- `tests`
- `placeholder_slots`
- `examples`
- `maintenance_rule`

Contract:

- template parameters must be validated
- generated entities must use approved names
- template artifact creation must produce an audit report
- required placeholder slots must be filled before artifact creation

## Placeholder Slot Schema

Required fields:

- `id`
- `name`
- `required`
- `data_type`
- `default_value`
- `validation_rule`
- `example`

Contract:

- required slots must be filled before artifact creation
- slot names must be approved
- validation rules must resolve
- defaults must match the declared data type

## Document Tree Node Schema

Required fields:

- `id`
- `node_type`
- `text`
- `children`
- `source_span`
- `provenance`
- `labels`

Contract:

- node ids must be stable inside one parse
- source span must preserve traceability
- labels must use approved names where possible

## Semantic Tree Node Schema

Required fields:

- `id`
- `concept_type`
- `text`
- `normalized_name`
- `confidence`
- `relationships`
- `evidence_refs`
- `review_state`

Contract:

- low confidence nodes remain proposed
- conflicting nodes create memory conflict records
- accepted nodes can become entity change proposals

## Render Tree Node Schema

Required fields:

- `id`
- `layout`
- `component`
- `data_ref`
- `state`
- `accessibility`
- `children`

Contract:

- layout must be approved
- component name must be approved
- data reference must resolve

## Layout Tree Node Schema

Required fields:

- `id`
- `node_type`
- `tag`
- `attributes`
- `content`
- `children`
- `data_path`
- `template`
- `state_refs`
- `policy_refs`

Contract:

- node type must be approved
- tag must be approved when a DOM tag is used
- parent-child tag rules must pass when a relationship rule exists
- singleton tags cannot be repeated in the same viewport
- repeater nodes must define `data_path` and `template`
- unresolved placeholders must create diagnostics

## Content Label Schema

Required fields:

- `id`
- `key`
- `value`
- `locale`
- `owner_domain`
- `source_ref`

Contract:

- key must be unique within its content group
- placeholder references must resolve to known keys
- governed records cannot be silently changed by content replacement

## Design Token Schema

Required fields:

- `id`
- `token_name`
- `token_value`
- `token_type`
- `scope`
- `owner_domain`

Contract:

- token name must be approved
- value must match token type
- runtime injection must preserve audit diagnostics

## Route Entity Schema

Required fields:

- `id`
- `route_pattern`
- `segments`
- `target_entity_ref`
- `view_ref`
- `state_policy`
- `permission_policy`

Contract:

- segment names must be approved
- target entity and view must resolve
- route changes must update active state through entity behavior
- invalid route state must produce diagnostics
- accessibility state must be present for interactive pieces

## Audit Report Schema

Required fields:

- `id`
- `scope`
- `inventory_count`
- `covered_count`
- `gap_count`
- `conflict_count`
- `decision_count`
- `evidence_refs`
- `recommendations`
- `approval_state`

Contract:

- every gap needs an owner
- every conflict needs a decision path
- every adopted item needs evidence

## Datatable Schema

Required fields:

- `id`
- `name`
- `fields`
- `indexes`
- `validation_rules`
- `status`
- `provenance`

Contract:

- every field must declare type and required state
- indexes must reference existing fields
- validation rules must use approved rule names

## Datamap Schema

Required fields:

- `id`
- `name`
- `source_entity`
- `target_entity`
- `relationship`
- `mapping_rules`
- `validation_checks`
- `provenance`

Contract:

- source and target entities must resolve
- relationship type must be approved
- every mapping rule must name its source and target fields
- validation checks must fail on unresolved targets

## Binding Schema

Required fields:

- `id`
- `name`
- `dataset_ref`
- `datatable_ref`
- `datamap_ref`
- `template_ref`
- `output_ref`
- `status`

Contract:

- every referenced artifact must resolve
- template slots must be filled by dataset, datatable, or datamap fields
- unresolved slots block rendering

## Handbook Row Schema

Required fields:

- `id`
- `kind`
- `name`
- `meaning`
- `phase_ref`
- `source_ref`
- `status`

Contract:

- row ids must be stable and unique
- retired rows remain traceable
- every rendered handbook section should trace to rows where practical
- orphan rows must be reported

## Parser Plugin Schema

Required fields:

- `id`
- `name`
- `plugin_type`
- `commands`
- `input_formats`
- `output_formats`
- `config_schema`
- `activation_policy`
- `deactivation_policy`

Contract:

- plugin type must be approved
- commands must be approved
- input and output formats must be declared
- activation must register only namespaced capabilities
- deactivation must release registered resources

## Parser Session Schema

Required fields:

- `id`
- `config_ref`
- `loaded_plugins`
- `loaded_knowledge`
- `active_document`
- `command_history`
- `output_history`
- `validation_state`

Contract:

- session must not hide parser errors
- loaded plugins must resolve
- command history must preserve failed commands
- output history must keep provenance

## Source Adoption Record Schema

Required fields:

- `id`
- `source_path`
- `source_type`
- `concepts`
- `owner_doc`
- `secondary_docs`
- `decision`
- `validation_stage_one`
- `validation_stage_two`
- `notes`

Contract:

- every reviewed file or folder has an indexed record
- skipped items need a reason
- deferred items need an owner and future trigger

## Schema Migration Record Schema

Required fields:

- `id`
- `from_schema`
- `to_schema`
- `migration_steps`
- `compatibility_notes`
- `deprecation_warnings`
- `validation_checks`
- `rollback_plan`

Contract:

- migration must preserve provenance
- deprecated fields must be reported
- failed migration must produce a recovery report
- backward compatibility must be explicit

## External Intake Record Schema

Required fields:

- `id`
- `source_type`
- `source_identifier`
- `allowed_protocol`
- `timeout`
- `maximum_response_size`
- `retry_policy`
- `client_identity`
- `authentication_mode`
- `output_format`
- `evidence_ref`
- `error_format`

Contract:

- unsupported protocols are rejected
- timeout and maximum response size are enforced
- raw evidence is retained when policy allows it
- normalized output references raw evidence
- failures produce structured error records

## Planning Artifact Schema

Required fields:

- `id`
- `plan_type`
- `title`
- `owner`
- `scope`
- `assumptions`
- `sections`
- `risks`
- `metrics`
- `review_cadence`
- `status`

Contract:

- plan type must be approved
- assumptions are separated from facts
- risks include mitigation or owner notes
- active plans declare review cadence

## Hypothesis Record Schema

Required fields:

- `id`
- `record_type`
- `source_ref`
- `proposed_value`
- `confidence`
- `evidence_refs`
- `validation_count`
- `conflicts_won`
- `conflicts_lost`
- `verification_status`
- `approval_state`
- `created_at`
- `updated_at`

Contract:

- hypothesis records do not become active without validation
- confidence must stay within 0 and 1
- source references must resolve when policy requires evidence
- conflicts must be preserved, not overwritten

## Acceptance Criterion Schema

Required fields:

- `id`
- `name`
- `owner`
- `category`
- `target`
- `verification_method`
- `priority`
- `result`
- `evidence_ref`

Contract:

- criterion ids must be stable
- pass/fail result must reference evidence
- blocking criteria cannot be bypassed by high aggregate score

## Rejection Criterion Schema

Required fields:

- `id`
- `criterion`
- `owner`
- `severity`
- `verification_method`
- `evidence_ref`
- `required_resolution`

Contract:

- rejected records must keep reason and evidence
- blocking rejection criteria prevent activation
- resolution requires a new validation result

## Repair Record Schema

Required fields:

- `id`
- `target_ref`
- `repair_action`
- `before_state`
- `after_state`
- `reason`
- `evidence_refs`
- `validation_result`
- `rollback_plan`

Contract:

- repair action must be approved
- before and after state must be traceable
- failed repair must not replace active state

## Source Trust Record Schema

Required fields:

- `id`
- `source_ref`
- `reliability_band`
- `confidence`
- `validation_count`
- `contradiction_count`
- `freshness`
- `last_reviewed_at`
- `notes`

Contract:

- trust changes must be explainable
- contradiction count must not be discarded
- high trust does not bypass schema or policy validation

## Experiment Run Schema

Required fields:

- `id`
- `experiment_ref`
- `version_ref`
- `input_refs`
- `config`
- `started_at`
- `completed_at`
- `status`
- `output_refs`
- `finding_refs`
- `metric_refs`
- `audit_ref`

Contract:

- each run must reference the exact experiment version
- config must be persisted with the run
- failed runs must remain visible
- output and findings must trace to inputs

## Finding Schema

Required fields:

- `id`
- `run_ref`
- `finding_type`
- `summary`
- `evidence_refs`
- `confidence`
- `validation_result`
- `next_action`

Contract:

- finding type must be approved
- confidence must stay within 0 and 1
- evidence references must resolve when policy requires proof
- next action must be explicit when validation fails

## UI Component Contract Schema

Required fields:

- `id`
- `name`
- `component_type`
- `owner_domain`
- `input_contract`
- `output_contract`
- `state_ref`
- `setting_refs`
- `command_refs`
- `shortcut_refs`
- `permission_policy`
- `render_policy`
- `audit_level`

Contract:

- component type must be approved
- input and output contracts must resolve
- commands and shortcuts must resolve
- settings must validate before render
- render failures must produce diagnostics

## Keyboard Shortcut Schema

Required fields:

- `id`
- `command_ref`
- `label`
- `keys`
- `platform`
- `scope`
- `when_context`
- `priority`
- `enabled`
- `source`
- `conflict_policy`

Contract:

- command reference must resolve
- shortcut scope must be approved
- context condition must be valid
- conflicts must be reported
- user overrides must preserve default records

## Setting Schema

Required fields:

- `id`
- `name`
- `category`
- `scope`
- `value_type`
- `default_value`
- `allowed_values`
- `description`
- `owner`
- `requires_restart`
- `policy_ref`

Contract:

- scope must be approved
- value must match declared type
- override order must be deterministic
- risky settings require a policy gate
- settings UI and editor view must show the same data
