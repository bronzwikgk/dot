# An App V5 - Master Architecture Document

**Version:** v5.0.0
**Status:** proposed
**Owner:** agent_3_agent_lang_and_memory
**Date:** 2026-08-26

---

## 1. Core Philosophy

> **Everything is an entity.** Templates, components, policies, books, cells - all entities with unique IDs, types, data, relationships, and validation.

### 1.1 Entity Doctrine

Every durable/governable item is an entity with:
- `id` - Unique indexable identifier
- `type` - Entity type name
- `name` - Human-readable name
- `data` - Entity data/config
- `config` - Operational settings
- `attributes` - Key-value properties
- `traits` - Behavior markers
- `links` - Concrete relationship instances
- `relationships` - Approved relationship meanings
- `policies` - Governing rules
- `contracts` - Behavioral agreements
- `status` - Current lifecycle label
- `state` - Runtime condition
- `diagnostics` - Errors, warnings, hints
- `provenance` - Source trace
- `validation_state` - Validation result

---

## 2. Entity Type Catalog

| Entity Type | Owner Domain | Purpose |
|---|---|---|
| application | application_shell | Top-level app container |
| entity | entity_system | Generic governed record |
| trait | entity_system | Behavior marker |
| relationship | entity_system | Approved relationship meaning |
| link | entity_system | Stored relationship edge |
| attribute | entity_system | Entity field/value |
| config | schema_contract | Behavior settings |
| schema | schema_contract | Record shape contract |
| contract | schema_contract | Input/output agreement |
| dataset | dataset_registry | Approved word/value source |
| datamap | dataset_registry | Relationship record set |
| datatable | dataset_registry | Row-based reference data |
| policy | quality_audit | Rule governing permission/risk |
| command | an_app_lang | User instruction record |
| intent | an_app_lang | Parsed user goal |
| language_request | an_app_lang | Incoming language input |
| parse_tree | an_app_lang | Structural parse result |
| ast_record | an_app_lang | Normalized AST record |
| dag_record | workflow_system | Executable graph record |
| plan | workflow_system | Ordered execution plan |
| workflow | workflow_system | Conditional business flow |
| pipeline | workflow_system | Ordered stage sequence |
| stage | workflow_system | One pipeline position |
| task | workflow_system | Logical work unit |
| operation | workflow_system | Callable action |
| route | ui_surface | Navigable path |
| render_profile | ui_surface | View definition |
| layout_node | ui_surface | Layout tree node |
| component | ui_surface | Reusable view element |
| book | ui_surface | Notebook container |
| cell | ui_surface | Editable block |
| view | ui_surface | Presentation |
| provider | provider_system | Swappable adapter |
| storage_record | storage_system | Persistence record |
| index_record | search_index | Search metadata |
| version_record | version_system | Entity snapshot |
| branch_record | version_system | Named work line |
| diff_record | version_system | Structured comparison |
| merge_record | version_system | Change combination |
| conflict_record | version_system | Reviewable disagreement |
| tag_record | version_system | Stable label |
| audit_report | quality_audit | Evidence summary |
| diagnostic | quality_audit | Error/warning/hint |
| template | template_domain | Reusable starter |
| bot_session | an_bot | Conversation state |
| agent | agent_system | Work actor |
| brain_session | an_app_brain | Coordination session |
| memory_record | an_memory | Evidence record |

---

## 3. System State Catalog

| State Group | Values |
|---|---|
| lifecycle_status | proposed, draft, reviewed, approved, ready, active, stable, staged, validated, deprecated, archived, rejected, deferred |
| execution_status | received, parsed, matched, needs_clarification, waiting_for_approval, approved, running, completed, failed, blocked, cancelled |
| validation_status | untested, verified, contradicted, deprecated, blocked, needs_review |
| ui_component_state | idle, focused, hovered, active, selected, editing, dragging, resizing, connecting, loading, empty, dirty, saving, saved, validating, valid, warning, error, blocked, disabled, read_only, pending_approval, running, completed, failed, cancelled, archived |
| ui_lifecycle_state | unmounted, initializing, mounted, rendering, rendered, updating, updated, destroying |
| storage_state | unsaved, autosaving, saved, versioned, recovering, recovered, revert_pending, reverted, failed |
| provider_state | unavailable, available, activating, active, degraded, failing, disabled |
| audit_state | not_checked, in_review, supported, weakly_supported, contradicted, accepted, rejected, needs_review |
| memory_state | new, linked, consolidated, superseded, expired, archived |
| workflow_state | draft, validated, running, paused, waiting_for_approval, completed, failed, cancelled, archived |

---

## 4. Pipeline Stages

| Stage | Purpose | Required Output |
|---|---|---|
| ingest | Accept raw input | intake record |
| decompose | Break input into fragments | candidate fragments |
| parse | Build parse tree | parse tree |
| build_ast | Convert to AST | AST records |
| build_dag | Convert to DAG | DAG records |
| classify | Assign domain/type | classification records |
| validate | Check datasets/schemas | validation report |
| reason | Apply rules/logic | findings |
| resolve | Resolve references | resolved references |
| plan | Produce ordered plan | plan record |
| execute | Run operations | execution result |
| compose | Assemble output | composed artifact |
| display | Present output | display record |
| persist | Save records | persisted refs |
| audit | Record evidence | audit report |
| respond | Return summary | response record |

---

## 5. Entity Core Fields

Every entity must include:

```
{
  id: string,
  type: string,
  name: string,
  data: object,
  config: object,
  attributes: object,
  traits: array,
  links: array,
  relationships: array,
  policies: array,
  contracts: array,
  status: string,
  state: object,
  diagnostics: array,
  provenance: object,
  validation_state: string
}
```

---

## 6. Version Management

| Git Concept | An App Adaptation |
|---|---|
| commit | Entity snapshot with change summary |
| diff | Structured comparison |
| branch | Named line of work |
| merge | Governed combination |
| conflict | Reviewable disagreement |
| status | Current version state |
| staging | Selected changes |
| history | Timeline of versions |
| tag | Stable label |
| restore | Revert to older version |
| field_provenance | Field-level history |

---

## 7. Quality Targets

| Area | Target |
|---|---|
| Small pipeline latency | < 50ms |
| Large entity pipeline | < 2s for >10mb |
| Autocomplete response | < 100ms |
| Document open | < 500ms for 1000 blocks |
| Workflow start | < 200ms |
| Agent first output | < 1s |
| Idle memory | < 100mb |
| Maximum entity data | 100mb |
| Loaded entities | 100 concurrent |
| Concurrent workflows | 50 |
| Database rows | 10000 per database |
| Document blocks | 10000 per document |

---

## 8. File Structure

```
agent_3_agent_lang_and_memory/v5/
├── docs/
│   └── MASTER.md
├── code/
│   ├── plugins/
│   │   ├── action_entity_v5_0_0.js
│   │   ├── app_shell_v4_0_0.js
│   │   └── app_entry_v1_0_0.js
│   └── utilities/
│       ├── id_generator.js
│       ├── validator.js
│       └── registry.js
├── datasets/
│   ├── entity_types.js
│   ├── relationships.js
│   ├── attributes.js
│   ├── states.js
│   └── pipeline_stages.js
└── gui/
    ├── css/
    ├── html/
    └── tokens/
```

---

*Version history: v5.0.0 - Initial master architecture document*
