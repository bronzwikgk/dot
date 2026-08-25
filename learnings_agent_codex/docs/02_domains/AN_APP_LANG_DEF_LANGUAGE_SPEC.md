# An App Lang Definition Language Spec

## Source Conversion

This document converts useful concepts from:

`D:\0dot1_Aug_2016_master\gk\shared\inbox_research\ohm_old\ohm_lang_dsl_v15.txt`

The old source name is not carried forward as the active project name. The adapted language is **An App Lang**. Consumer-specific examples from the source are treated as examples only, not as core doctrine.

## Purpose

An App Lang should support a definition language for describing entities, applications, pipelines, configs, rules, models, flows, state, schemas, migrations, async work, logging, caching, and transactions in a text format that can parse into AST records and compile into DAG records.

The language should be readable by humans, parseable by utilities, and governed by datasets, schemas, and validation policies.

## Definition File Role

A definition file is a source artifact that describes An App entities and relationships.

Recommended extension:

- `.def`

Definition files should produce:

- parse tree
- AST
- DAG
- validation report
- entity change plan
- audit record

## Design Principles

| Id | Principle | Requirement |
| --- | --- | --- |
| lang_principle_001 | controlled_english | Syntax should read close to English while staying deterministic. |
| lang_principle_002 | indentation_based | Indentation defines nested structure. |
| lang_principle_003 | keyword_driven | Approved keywords define record type and operation meaning. |
| lang_principle_004 | type_checked | Values are typed and validated during parse/compile. |
| lang_principle_005 | composable | Definitions can reference other definitions by approved references. |
| lang_principle_006 | extensible | New keywords and macros require registration, owner, schema, and tests. |
| lang_principle_007 | stateful | State is an entity-backed record and can persist when policy allows it. |
| lang_principle_008 | async_ready | Async behavior must be explicit and auditable. |

## Syntax Rules

| Id | Rule | Requirement |
| --- | --- | --- |
| lang_syntax_001 | case | Keywords are lowercase. User values may preserve case when needed. |
| lang_syntax_002 | indentation | Four spaces equal one nesting level. Tabs are invalid. |
| lang_syntax_003 | comments | Lines beginning with `#` are comments. |
| lang_syntax_004 | blank_lines | Blank lines are ignored by parser and preserved by formatter when possible. |
| lang_syntax_005 | statement_line | One statement per line for V1. |
| lang_syntax_006 | quotes | Single and double quoted strings are accepted. |
| lang_syntax_007 | escape | Escaped quotes, backslash, hash, tab, newline, and carriage return are supported. |
| lang_syntax_008 | line_length | Lines should stay within 120 characters unless a source-preservation policy allows longer text. |
| lang_syntax_009 | encoding | UTF-8 is preferred. |

Special comments:

- `# TODO:`
- `# NOTE:`
- `# FIXME:`
- `# DEPRECATED:`
- `# TEST:`

## Core Keywords

| Group | Keywords |
| --- | --- |
| entity | entity, version, description, entity_type, depends_on, language_version |
| input_output | input, output, input_schema, output_schema |
| process | steps, step, process, transform, compute |
| control | if, else, loop, break, continue, parallel, branch, on_error, fallback, set, trigger, run |
| params | params, param, param_type, default, min, max, required |
| pipeline | pipeline, stage, timeout, retry, rollback |
| config | config, source, env |
| rule | rule, condition, action, priority, weight |
| model | model, weights, train, infer, optimize |
| lifecycle | deprecated, since, until |
| import | import, include, namespace, use |
| state | state, store, restore, persist, state_type, state_schema, state_ttl |
| schema | schema, schema_version, migration, migration_script, backward_compatible, forward_compatible |
| async | async, await, defer, retry_on_timeout |
| logging | log, debug, trace, log_level, log_file |
| cache | cache, ttl, invalidate, cache_key, cache_backend |
| transaction | transaction, commit, isolation_level |

`language_version` replaces old source-specific version labels in active An App Lang documents.

## Data Types

| Type | Shape | Notes |
| --- | --- | --- |
| string | quoted or bare text | Bare strings are allowed for simple names and versions. |
| number | integer or decimal | Negative values are allowed where the schema allows them. |
| boolean | true or false | Lowercase. |
| none | none | An App Lang null value. |
| datetime | ISO 8601 | Used for timestamps and schedule records. |
| regex | slash-delimited pattern | Flags must be approved. |
| duration | number plus unit | Units: ms, s, m, h, d. |
| list | `[a, b, c]` | Ordered values. |
| map | indented key-value block | Nested record. |
| tuple | `(a, b)` | Fixed ordered group. |
| enum | `|one|two|` | Explicit allowed options. |
| reference | prefixed ref | See reference prefixes. |
| expression | comparison/logical tree | Compiles to expression AST. |
| template | `${expression}` | Expression interpolation inside text. |

## Reference Prefixes

| Prefix | Meaning |
| --- | --- |
| `@name` | local name reference |
| `@name.property` | property path reference |
| `file:path` | file reference |
| `entity:name` | entity reference |
| `entity:name(args)` | entity call reference |
| `utility:name` | utility reference |
| `dataset:name` | dataset reference |
| `import:path` | import reference |
| `state:name` | state reference |
| `cache:name` | cache reference |

The old `util:` prefix should be accepted only as a legacy alias during migration. New An App Lang documents should use `utility:`.

## Operators

Comparison:

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`
- `~=`
- `!~`
- `is none`
- `is not none`

Logical:

- `and`
- `or`
- `not`

Assignment:

- `set name = value`

Access and fallback:

- `.`
- `?.`
- `??`

Consumer-provided operators such as pipe, map, and chain syntax can be allowed only through an extension registry.

## AST Node Types

| Node Type | Purpose |
| --- | --- |
| program | Root record containing imports and statements. |
| entity_def | Entity definition. |
| pipeline_def | Pipeline definition with stages. |
| config_def | Configuration definition. |
| rule_def | Rule with condition, action, priority, and weight. |
| model_def | Model record with weights, training, inference, and optimization sections. |
| flow_def | Triggered flow with steps. |
| state_def | State definition or state reference shape. |
| schema_def | Schema definition with fields and migration. |
| migration_def | Migration from one schema version to another. |
| step | Work step with calls, conditions, state, logs, cache, async, and transaction flags. |
| process_call | Utility, builtin, or entity call. |
| expression | Logical or comparison expression tree. |
| reference | Named reference to entity, dataset, utility, file, import, state, or cache. |
| parameter | Parameter definition. |
| literal | Typed literal value. |
| import | Import statement. |
| action | Rule action. |
| weight | Weight group. |
| config_section | Named config section. |
| loop | Iteration construct. |
| set_assignment | Mutable assignment construct. |
| log | Logging statement. |
| cache | Cache statement. |
| transaction | Transaction block. |
| branch | Explicit conditional branch. |
| deprecated | Deprecation marker with since/until. |

AST node names are written in snake_case in An App Lang. Legacy uppercase names from the source are not adopted as active names.

## DAG Node Types

| Node Type | Purpose |
| --- | --- |
| data_source | Ingest data or source records. |
| transform | Transform data. |
| compute | Compute derived values. |
| classify | Classify records or text. |
| validate | Validate data, schema, or policy. |
| decide | Pick action from rules and evidence. |
| execute | Execute approved action. |
| branch | Split flow by condition. |
| merge | Merge multiple flow paths. |
| parallel | Run independent paths. |
| output | Produce final result. |
| error_handler | Recover or fail with diagnostics. |
| state_load | Load state entity. |
| state_store | Store state entity. |
| async | Start async step. |
| await | Wait for async step. |
| cache | Cache or retrieve cached value. |
| transaction | Wrap atomic operation. |

Consumer-specific nodes should be registered by plugin or domain. They are not core until a dataset and schema approve them.

## AST To DAG Rules

| Id | Rule |
| --- | --- |
| lang_dag_001 | Entity steps map to DAG nodes through the plugin and utility registry. |
| lang_dag_002 | Pipeline stages compile into ordered DAG nodes. |
| lang_dag_003 | Conditions compile into branch nodes. |
| lang_dag_004 | Parallel flags compile into parallel and merge nodes. |
| lang_dag_005 | Error behavior wraps nodes with error_handler behavior. |
| lang_dag_006 | Flow steps compile to DAG backbone nodes with trigger rules. |
| lang_dag_007 | Loops compile to repeated or parallelized node groups under policy. |
| lang_dag_008 | State blocks compile to state_load and state_store. |
| lang_dag_009 | Async flags compile to async and await. |
| lang_dag_010 | Cache blocks compile to cache nodes. |
| lang_dag_011 | Transactions wrap affected nodes. |
| lang_dag_012 | Cycles fail validation. |

## Definition Shapes

### Entity

```text
entity: name
    language_version: 1.0.0
    version: 1.0.0
    description: text
    entity_type: approved_type
    depends_on: [entity:other_entity]
    state:
        state_type: map
        state_schema: @schema_ref
        state_ttl: 3600s
        persist: true
        default: {}
    input: [@input_record]
    output: [@output_record]
    input_schema: input_schema_name
    output_schema: output_schema_name
    steps:
        step: validate_input
            process: utility:validator.validate(@input_record)
            on_error: fail
```

### Pipeline

```text
pipeline: name
    state:
        state_type: map
        persist: true
    run: sequential
    stage: ingest
        process: utility:intake.read(@source)
        timeout: 30s
        retry: 3
        on_error: retry
    stage: validate
        process: utility:validator.validate(@ingest.result)
        on_error: fail
```

### Rule

```text
rule: name
    condition: confidence > 0.7 and status == active
    action: approve candidate_entity
    priority: 1
    weight: 0.85
```

### Schema

```text
schema: name
    schema_version: 1.0.0
    id: string required
    status: string required default: draft
    score: number optional min: 0 max: 1
    migration:
        from: 0.9.0
        to: 1.0.0
        migration_script: migrate_schema.js
        backward_compatible: true
        forward_compatible: false
```

### Flow

```text
flow: daily_review
    trigger: cron: "0 0 * * *"
    steps:
        step: load_config
            process: utility:config_loader.read(@config_file)
            on_error: retry
        step: decide
            process: utility:reasoner.decide(@facts, @rules)
            if: decision == proceed
                step: execute
                    process: entity:approved_action(@decision)
```

## Validation Codes

Syntax errors:

| Code | Meaning |
| --- | --- |
| E001 | indentation error |
| E002 | invalid keyword or structure |
| E003 | missing colon separator |
| E004 | invalid reference prefix |
| E005 | malformed expression |
| E006 | invalid regex |
| E007 | invalid datetime |
| E008 | invalid duration |
| E009 | line too long |
| E010 | invalid cron expression |
| E011 | invalid regex flags |

Semantic errors:

| Code | Meaning |
| --- | --- |
| E101 | unknown entity |
| E102 | unknown dataset |
| E103 | unknown utility |
| E104 | import file missing |
| E105 | unknown builtin |
| E106 | schema mismatch |
| E107 | circular dependency |
| E108 | missing required parameter |
| E109 | type error |
| E110 | value out of range |
| E111 | invalid `not` expression |
| E112 | missing state |
| E113 | invalid schema version |
| E114 | missing cache |
| E115 | invalid async timeout |
| E116 | duplicate namespace |
| E117 | invalid null check |

Ordering and lifecycle:

| Code | Meaning |
| --- | --- |
| E201 | self reference |
| E202 | dependency missing |
| E203 | import not at top |
| E204 | state used before definition |
| E205 | migration before schema |
| W401 | deprecation warning |
| W402 | deprecated error behavior |
| E402 | removed item still used |
| E403 | transaction rollback |

## State Requirements

State is an entity-backed record. It should define:

- state type
- schema reference
- ttl
- persistence flag
- default value
- restore policy
- store policy

Lifecycle:

`define -> restore -> use_or_update -> store -> persist`

## Import Requirements

Imports must appear before definitions. Import behavior must validate:

- file exists
- relative path resolves
- namespace is unique
- circular imports are blocked
- duplicate imports are ignored or reported according to policy

## Schema Versioning Requirements

Schemas must define:

- schema version
- fields
- required/optional state
- default values
- min/max constraints
- migration path when versions change
- backward compatibility
- forward compatibility

## Async, Cache, And Transaction Requirements

Async work must define timeout and retry behavior when relevant. Awaited steps must reference an async result.

Cache records must define key, ttl, backend, value, and invalidation behavior.

Transactions must define isolation level, commit behavior, rollback behavior, and error reporting.

## Builtin Capability Families

An App Lang should support builtin capability families for:

- math
- string
- datetime
- list
- state
- validation

The source lists individual examples such as sine, lowercase, trim, date parsing, list length, state get/set, and validation checks. An App should expose only the subset that has approved utility bindings and tests.

## Extension Registry

Extensions may add:

- custom keywords
- macros
- plugin-provided call targets
- consumer-specific DAG nodes
- domain-specific entity types
- provider-specific operations

Each extension must define:

- name
- owner domain
- syntax
- validation rule
- handler reference
- tests
- documentation
- deprecation policy

## Relationship To Existing An App Pipeline

An App Lang supports the language part of:

`ingest -> decompose -> parse -> build_ast -> build_dag -> classify -> validate -> reason -> resolve -> plan -> execute -> compose -> display -> persist -> audit -> respond`

This document mainly owns:

- parse
- build_ast
- build_dag
- validate language records
- produce a structured change plan

Execution belongs to runner/action plugins after validation.

## Adoption Decisions

| Decision | Status |
| --- | --- |
| Rename active language to An App Lang | adopted |
| Keep `.def` as definition-file candidate | adopted |
| Use snake_case AST and DAG node names | adopted |
| Treat old consumer examples as examples only | adopted |
| Replace old utility prefix in new docs with `utility:` | adopted |
| Keep old utility prefix as migration alias only | proposed |
| Require import cycle validation | adopted |
| Require DAG cycle validation | adopted |
| Require schema migration records | adopted |
| Require state/cache/transaction audit | adopted |

## Required Dataset Additions

Candidate dataset groups:

- definition_keyword_names
- definition_data_type_names
- reference_prefix_names
- comparison_operator_names
- logical_operator_names
- ast_node_type_names
- dag_node_type_names
- validation_code_names
- deprecation_warning_names
- isolation_level_names
- cache_backend_names
- extension_type_names
- import_policy_names

## Required Utility Or Plugin Work

Likely future implementation items:

- definition_file_parser
- indentation_validator
- reference_resolver
- expression_parser
- ast_builder
- dag_builder
- definition_schema_validator
- import_resolver
- schema_migration_validator
- state_reference_validator
- cache_reference_validator
- transaction_policy_validator
- extension_registry_validator

These should be evaluated against existing utilities before creating new files.

## Known Conflicts And Normalization

| Source Item | An App Decision |
| --- | --- |
| source-specific language name | use An App Lang |
| uppercase AST/DAG node names | normalize to snake_case |
| old utility reference prefix | use `utility:` in new docs |
| consumer-specific examples | keep as examples only |
| symbolic operator extensions | require extension registry |
| old wording that conflicts with current banned words | do not adopt as approved names |

## Minimum Acceptance Checklist

- Parser rejects bad indentation.
- Parser preserves source span for every AST node.
- AST nodes use approved snake_case names.
- References resolve or produce findings.
- DAG compile detects cycles.
- Schema versions validate as semver.
- State/cache/transaction records create audit output.
- Deprecated language features warn or fail according to policy.
- Definition output can become an entity change plan.
