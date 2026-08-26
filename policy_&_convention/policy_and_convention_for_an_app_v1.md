# Policy & Convention for an_app_v5

## Purpose

This document defines the policies and conventions for an_app_v5. All agents, humans, and systems must follow these policies when creating, modifying, or validating vocabulary.

---

## 1. Naming Policy

### Purpose
Ensure consistent naming across all files.

### Scope
All dataset files, schemas, concepts, and code.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| N1 | snake_case | All names use snake_case (letters, digits, underscores only) |
| N2 | No duplicates | No duplicate names across all files |
| N3 | Singular | Names are singular unless inherently plural (e.g., `window_controls`) |
| N4 | No abbreviations | No abbreviations that lose meaning (use `status_bar` not `sbar`) |
| N5 | Verb + entity | Operations follow `verb_entity` pattern (e.g., `create_entity`) |
| N6 | Plural for lists | Arrays returning multiple items use plural (e.g., `list_entities`) |

### Examples

| Correct | Incorrect | Reason |
|:---|:---|:---|
| `create_entity` | `createEntity` | Must be snake_case |
| `data_types` | `dataType` | Must be snake_case |
| `status_bar` | `sbar` | No abbreviations |
| `list_entities` | `list_entity` | Plural for lists |

---

## 2. Core Concepts Policy

### Purpose
Define the fundamental concepts and their classifications. All agents must understand these boundaries.

### Scope
All an_app components.

### Three Categories

| Category | Definition | Format | Needs Global Context |
|:---|:---|:---|:---|
| **Plugin** | Code component that performs system actions | Code (.js) | ✅ Yes |
| **Utility** | Pure function, no side effects | Code (.js) | ❌ No |
| **Pipeline** | Template defining how plugins/utilities are used | MD (.md) | ❌ No |

### Plugins (need global_context)

| Plugin | Purpose | Why needs context |
|:---|:---|:---|
| Runner | Executes pipelines | Needs ctx.ops to run operations |
| Validator | Validates entities/inputs | Needs ctx.types to check schemas |
| Runtime | Orchestrates pipeline execution | Needs ctx for all components |
| Policy Gate | Gates decisions | Needs ctx to check policies |
| Index Builder | Builds search index | Needs ctx.index to build index |
| CLI | Command line interface | May need ctx for commands |

### Utilities (pure functions)

| Utility | Purpose | Why no context needed |
|:---|:---|:---|
| Tokenizer | Tokenizes natural language | Pure text processing |
| Parser | Parses tokens to AST | Pure data transformation |
| Compiler | Compiles AST to plan | Pure data transformation |
| Resolver | Resolves symbols | Pure graph analysis |
| Transformer | Transforms AST to models | Pure data transformation |

### Pipelines (MD templates)

| Pipeline Type | Purpose | Example |
|:---|:---|:---|
| Template Pipeline | Reusable workflow template | `template_find_information.md` |
| System Pipeline | System-internal workflow | `system_6d_lifecycle.md` |
| User Pipeline | User-created workflow | `user_custom_flow.md` |

### Hierarchy

```
Pipeline (MD template)
  └── defines usage of →
        ├── Plugin 1 (needs global_context)
        ├── Plugin 2 (needs global_context)
        ├── Utility 1 (pure function)
        └── Utility 2 (pure function)

Runner (Plugin)
  └── executes → Pipeline (MD template)
```

### Rules

| # | Rule | Description |
|:---|:---|:---|
| C1 | Plugin needs context | All plugins must receive global_context at activation |
| C2 | Utility is pure | Utilities must not have side effects or require global_context |
| C3 | Pipeline is template | Pipelines are MD files defining sequences of work |
| C4 | Runner executes | Runner is the only plugin that executes pipelines |
| C5 | No mixing | Do not put plugin code in utilities folder or vice versa |

### File Structure

```
an_app_v5/
├── code/
│   ├── plugins/ (need global_context)
│   │   ├── code_shared_runner_v2_2_0_draft.js
│   │   ├── code_shared_validator_v2_2_0_draft.js
│   │   ├── code_shared_runtime_v2_2_0_draft.js
│   │   ├── code_shared_policy_gate_v2_2_0_draft.js
│   │   ├── code_shared_index_builder_v2_2_0_draft.js
│   │   └── code_shared_cli_v2_2_0_draft.js
│   └── utilities/ (pure functions)
│       ├── code_shared_tokenizer_v2_2_0_draft.js
│       ├── code_shared_parser_v2_2_0_draft.js
│       ├── code_shared_compiler_v2_2_0_draft.js
│       ├── code_shared_resolver_v2_2_0_draft.js
│       └── code_shared_transformer_v2_2_0_draft.js
└── pipelines/ (MD templates)
    ├── template_*.md
    └── system_*.md
```

---

## 3. File Structure Policy

### Purpose
Organize files logically for easy navigation.

### Scope
All dataset files.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| F1 | Three categories | Files organized into code, ui, system |
| F2 | Naming pattern | `dataset_of_<category>_<subcategory>_in_an_app_v5.dataset` |
| F3 | Extension | Use `.dataset` extension (not `.js`) |
| F4 | One concern per file | Each file covers one subcategory |

### File Structure

```
dataset_an_app_v5/
├── code/
│   ├── dataset_of_code_types_in_an_app_v5.dataset
│   ├── dataset_of_code_entities_in_an_app_v5.dataset
│   ├── dataset_of_code_behaviors_in_an_app_v5.dataset
│   └── dataset_of_code_schemas_in_an_app_v5.dataset
├── ui/
│   ├── dataset_of_ui_components_in_an_app_v5.dataset
│   ├── dataset_of_ui_events_in_an_app_v5.dataset
│   ├── dataset_of_ui_layouts_in_an_app_v5.dataset
│   ├── dataset_of_ui_styles_in_an_app_v5.dataset
│   └── dataset_of_ui_tokens_in_an_app_v5.dataset
└── system/
    ├── dataset_of_system_values_in_an_app_v5.dataset
    ├── dataset_of_system_config_in_an_app_v5.dataset
    ├── dataset_of_system_dsl_in_an_app_v5.dataset
    ├── dataset_of_system_errors_in_an_app_v5.dataset
    └── dataset_of_system_providers_in_an_app_v5.dataset
```

---

## 3. Dataset Policy

### Purpose
Define how datasets are structured.

### Scope
All `.dataset` files.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| D1 | Flat arrays | Datasets are flat arrays of strings only |
| D2 | No nesting | No objects, no nested arrays |
| D3 | Type names array | Each file has a `type_names` array listing categories |
| D4 | Grouped by type | Names grouped under their type with comments |
| D5 | Comments optional | Comments on names are optional but recommended |
| D6 | Export | Arrays are exported for use by other files |

### Example

```js
const type_names = [
  "primitives",   // data types and shapes
  "domain",       // entity types, traits, relationships
];

const primitives_data_types = [
  "string",    // short-form values
  "text",      // long-form content
  "integer",   // whole numbers
];

const primitives_data_shapes = [
  "max_length",    // max character count
  "pattern",       // regex pattern
];
```

---

## 4. Concept Policy

### Purpose
Define how concepts are documented.

### Scope
All concept definition files.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| C1 | 10 fields | Every concept has name, layer, definition, purpose, attributes, operations, relationships, constraints, examples, validation |
| C2 | One sentence | Definition must be one sentence |
| C3 | Concrete examples | Examples must be concrete, not abstract |
| C4 | Validation rules | Every concept must have validation rules |

---

## 5. Schema Policy

### Purpose
Define how entity schemas are structured.

### Scope
All schema files.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| S1 | Four fields | Every schema has type, traits, attributes, relationships |
| S2 | Type exists | Type must exist in entity_types |
| S3 | Traits exist | All traits must exist in trait registry |
| S4 | Attributes typed | All attributes must have valid data types |
| S5 | Relationships valid | All relationships must exist in relationship registry |

---

## 6. Validation Policy

### Purpose
Ensure names are valid before use.

### Scope
All name creation and modification.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| V1 | Check before create | Search registries before creating any name |
| V2 | Exact match | If exact match exists, reuse it |
| V3 | Similar match | If similar match exists, extend that concept |
| V4 | No match | If no match, reserve the name first |
| V5 | Validate on use | Validate names when used in code |

### Decision Tree for Naming

```
START: New name needed
  │
  ▼
STEP 1: Check bag_of_words for single word match
  │
  ├─ MATCH → Check similar_words table
  │          ├─ Similar exists → REUSE existing name
  │          └─ No similar → USE the matched word
  │
  └─ NO MATCH → Check full dataset for partial match
                ├─ Partial exists → ADOPT or EXTEND existing
                └─ No match → RESERVE new name (add to bag_of_words)
  │
  ▼
END: Name is valid
```

---

## 7. Bag of Words Policy

### Purpose
Maintain a master list of all unique single words for quick comparison.

### Scope
All vocabulary names.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| B1 | Single words only | Bag contains unique single words, not compound names |
| B2 | No banned words | Banned words (tool, engine) are excluded |
| B3 | No similar words | Words with identical meaning appear only once |
| B4 | First comparison | Check bag before checking full dataset |
| B5 | Update on add | Add new words to bag when creating new names |

### Bag of Words Structure

```js
const bag_of_words = [
  // Domain words
  "entity", "type", "trait", "relationship", "link",
  "attribute", "property", "state", "diagnostic", "finding",
  
  // Behavior words
  "operation", "task", "pipeline", "workflow", "intent",
  "action", "trigger", "condition", "stage", "step",
  
  // Data words
  "string", "text", "integer", "float", "boolean",
  "list", "map", "reference", "timestamp", "json",
  
  // UI words
  "button", "input", "modal", "tab", "panel",
  "menu", "sidebar", "header", "footer", "container",
  
  // System words
  "provider", "plugin", "utility", "config", "metric",
  "error", "warning", "log", "event", "permission"
];
```

### Banned Words (excluded from bag)

| Word | Reason | Replacement |
|:---|:---|:---|
| `tool` | Implies external/unsafe | `operation` or `callable` |
| `engine` | Vague and overloaded | `plugin` or `utility` |

---

## 8. Similar Words Policy

### Purpose
Maintain a relationship table for words with identical meanings.

### Scope
All vocabulary names.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| S1 | One canonical | Each concept has one canonical name |
| S2 | Similar table | Maintain table of word → canonical mappings |
| S3 | No synonyms | Synonyms are not allowed in vocabulary |
| S4 | Extend, don't duplicate | If similar exists, extend that concept |
| S5 | Document decisions | Record why a name was chosen over alternatives |

### Similar Words Table

```js
const similar_words = {
  // Entity synonyms
  "object": "entity",
  "item": "entity",
  "record": "entity",
  "thing": "entity",
  
  // Type synonyms
  "kind": "type",
  "category": "type",
  "class": "type",
  
  // Trait synonyms
  "property": "trait",
  "capability": "trait",
  "feature": "trait",
  
  // Attribute synonyms
  "field": "attribute",
  "key": "attribute",
  "column": "attribute",
  
  // Operation synonyms
  "function": "operation",
  "method": "operation",
  "command": "operation",
  
  // Handler synonyms
  "callback": "handler",
  "listener": "handler",
  "processor": "handler",
  
  // Pipeline synonyms
  "sequence": "pipeline",
  "chain": "pipeline",
  
  // Workflow synonyms
  "process": "workflow",
  "procedure": "workflow",
  
  // Task synonyms
  "job": "task",
  "assignment": "task",
  
  // Component synonyms
  "widget": "component",
  "element": "component",
  
  // Provider synonyms
  "backend": "provider",
  "adapter": "provider",
  
  // Plugin synonyms
  "module": "plugin",
  "extension": "plugin"
};
```

---

## 9. Governance Policy

### Purpose
Manage changes to vocabulary.

### Scope
All vocabulary changes.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| G1 | Version bump | Any change requires version bump |
| G2 | Changelog | Every change must be logged in changelog |
| G3 | Deprecation | Never delete; mark as deprecated with replacement |
| G4 | Approval | Major changes require approval |
| G5 | Backward compatible | Changes must be backward compatible |

---

## 8. Agent Policy

### Purpose
Guide agent behavior when working with vocabulary.

### Scope
All agents working with an_app.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| A1 | Registry-first | Never write code for a name absent in registry |
| A2 | Reuse-before-create | Before adding name, search for existing |
| A3 | Type changes are API changes | Adding/removing types requires approval |
| A4 | Conflicts resolve by generalization | Keep more general parameterization |
| A5 | Document all changes | Every addition appends to changelog |

---

## 9. Conflict Resolution Policy

### Purpose
Resolve naming conflicts.

### Scope
All naming conflicts.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| K1 | Rename | Rename one of the conflicting values |
| K2 | Document | Document the conflict and resolution |
| K3 | Deprecate | If old name exists, deprecate it |
| K4 | Namespace | Use prefix/suffix to distinguish |
| K5 | Accept | If different contexts, accept with documentation |

---

## 10. Documentation Policy

### Purpose
Ensure consistent documentation.

### Scope
All files and concepts.

### Rules

| # | Rule | Description |
|:---|:---|:---|
| Doc1 | Header | Every file has JSDoc header with entity, meta, version |
| Doc2 | Comments | Every name has optional comment |
| Doc3 | Examples | Every concept has examples |
| Doc4 | Changelog | Every file has changelog |
| Doc5 | Cross-references | Reference related files/concepts |

---

## Change Log

| Version | Date | Change |
|:---|:---|:---|
| 1.0.0 | 2026-08-24 | Initial policy definitions |
| 1.1.0 | 2026-08-24 | Added bag of words, similar words, decision tree policies |
