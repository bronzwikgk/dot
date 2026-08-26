# OHM v10 — Root Definition

---

## 1. What OHM Is

OHM is a sovereign, zero-dependency syntactic compiler that translates English sentence structures into executable symbolic expressions using only four native primitives: ATOM, PAIR, TUPLE, GROUP.

---

## 2. Root Laws

Every Level 1 capability must obey these. No exceptions.

### Law 1 — Primitive-Only Data
All data structures inside OHM are built from ATOM, PAIR, TUPLE, GROUP. No arrays, no objects, no maps, no external data structures. If it cannot be expressed in these four, the feature does not belong in OHM.

### Law 2 — Zero External Dependencies
No npm packages. No Python libraries. No Java .jars. No imported NLP tools at runtime. External research (GATE, JAPE, DRT, Boxer) is studied as blueprints and re-implemented natively. The runtime is fully self-contained.

### Law 3 — Deterministic Processing
Given the same input and the same context, OHM produces the same output every time. No randomness. No ML inference. No probabilistic guessing. If a pattern is not matched, the system throws a structured Clarification Required error. It never guesses.

### Law 4 — Two-Layer Architecture
Layer 1 (Syntactic Compiler) translates the current sentence into a raw expression. Layer 2 (Discourse Resolver) fills missing slots from context. These layers never mix. The compiler never looks at context. The resolver never parses grammar.

### Law 5 — Pipeline Is Phased
Processing flows through named phases in strict order: Tokenize then POS Tag then Pattern Match then Expression Build then Context Resolve then Reason then Execute then Compose. Each phase is a pure function. Phases can be skipped but not reordered.

### Law 6 — Grammar Over Vocabulary
Intent is determined by sentence structure (POS patterns), not word meaning. "Make a website" and "Create a website" produce the same expression because they share the same grammatical shape. New domains require new patterns, not new vocabularies.

### Law 7 — Context Is a Stack, Not a Blob
Active scopes form a LIFO stack. "Inside the cart" pushes a scope. "Back to main" pops it. Entities and variables live in specific scopes. Resolution follows accessibility rules. Nested scopes limit visibility.

### Law 8 — Rules Are Data, Not Code
Every rule, pattern, transformation, and pipeline definition is stored as OHM tuples in dataset files. Nothing is hard-coded in engine logic. Rules can be added, removed, imported, or linted without touching runtime code.

### Law 9 — Lint Before Execute
Every pipeline phase has a post-step linter. If the linter finds a critical error (duplicate rule, contradictory binding, unreachable action), the pipeline halts and returns a structured error. Clean data only enters execution.

### Law 10 — Testable at Every Layer
Every primitive, every phase, every rule, and every reasoning strategy has dedicated test cases. The test suite is the regression gate. No feature ships unless all tests pass.

### Law 11 — .ohm for Engine, Flexible Extensions for App Data
Internal engine files (rules, patterns, transforms, pipelines) use `.ohm` format. App data (datasets, datamaps, datatables, definitions, templates, docs) may use any file extension that fits the data type. Shape is determined by content structure, not file extension.

### Law 12 — Shape Is Independent of File Extension
An Array can be stored in `.js`, `.yml`, `.txt`, `.md`, `.html`, or `.json`. A Table can be `.csv`, `.ohm`, or `.yml`. The parser detects shape by reading content structure. Downstream logic must never assume shape from extension.

---

## 3. Glossary

| Term | Definition |
|------|-----------|
| ATOM | A single named value. The smallest indivisible unit in OHM. |
| PAIR | Two linked values. A key-value or subject-predicate relationship. |
| TUPLE | An ordered sequence of values. Used for rules, expressions, and operations. |
| GROUP | A named collection of Tuples sharing a common context or scope. |
| Expression | An OHM TUPLE representing a translated sentence structure. |
| Slot | A `?` placeholder in an expression that must be filled by the Discourse Resolver. |
| Phase | A named processing step in the pipeline. Each phase is a pure function. |
| Rule | A pattern-action pair stored as an OHM TUPLE. Defines how inputs map to outputs. |
| Pattern | The left-hand side of a rule. What to match in the input. |
| Action | The right-hand side of a rule. What to produce when the pattern matches. |
| Scope | An active context boundary. Pushed and popped on a LIFO stack. |
| Discourse Variable | A named entity introduced in conversation, tracked with type, scope, and accessibility. |
| Anaphora | A pronoun or reference (it, they, this) that resolves to a previously mentioned entity. |
| POS Tag | Part-of-speech label assigned to a token (noun, verb, adjective, etc.). |
| POS Pattern | A sequence of POS tags that maps to an OHM expression template. |
| Expression Template | A partially instantiated OHM expression with `{{variable}}` placeholders. |
| AST | Abstract Syntax Tree. The executable graph produced from a fully resolved expression. |
| DAG | Directed Acyclic Graph. Used for parallel and sequential operation chains. |
| Pipeline | The ordered sequence of phases that transforms input text into output. |
| Linter | A validator that runs after a phase to catch errors before execution. |
| Reasoning Strategy | A deterministic function that extracts knowledge from data shapes and context. |
| Capability | A major functional domain (tokenize, resolve, reason, execute, learn). |
| Level 1 | A major capability with its own rules, data, and tests. |
| Root | The shared foundation that all Level 1 capabilities must obey. |
| Shape | Logical structure of data (Array, Table, Tree, Graph, Collection). Independent of file extension. |
| Extension | File format (.ohm, .js, .yml, .txt, .csv, .md, .html, .json). Determines storage, not structure. |
| Parser | Reads file content to detect shape by structure, not by extension. |
| Engine File | Internal OHM file (rules, patterns, transforms, pipelines). Uses `.ohm` format. |
| App Data | External data files (datasets, datamaps, datatables, definitions, templates, docs). Flexible extension. |

---

## 4. Data Primitives

### 4.1 ATOM
```
Structure:  [name, value]
Example:    ["token", "create"]
Example:    ["pos", "VB"]
Example:    ["confidence", 0.95]
```
- Stores a single named value
- Value can be string, number, or boolean
- Cannot contain other primitives
- Used for tokens, tags, labels, scores, flags

### 4.2 PAIR
```
Structure:  [key, value]
Example:    ["token_1", "create"]
Example:    ["create", "VB"]
Example:    ["entity_1", "FILE_123"]
```
- Links two values in a named relationship
- Key identifies what the relationship is about
- Value is what the key points to
- Used for annotations, bindings, lookups

### 4.3 TUPLE
```
Structure:  [item_1, item_2, item_3, ...]
Example:    [RULE, "DelegateAction", PATTERN, [I, want, you], ACTION, [SET, Agent, system]]
Example:    [COMMAND, CREATE, TARGET, PROJECT]
Example:    [DELEGATE, USER, SYSTEM, BUILD, WEBSITE]
```
- Ordered sequence of values
- First item often defines the type or purpose
- Used for rules, expressions, operations, pipeline definitions
- Length is variable but purpose-specific

### 4.4 GROUP
```
Structure:  [GROUP, name, [tuple_1, tuple_2, ...]]
Example:    [GROUP, "DRS_001", [[ENTITY, x, TYPE, USER], [ENTITY, y, TYPE, SYSTEM], [RELATION, x, WANTS, y]]]
Example:    [GROUP, "shopping_cart", [[ENTITY, item_456], [ENTITY, item_789]]]
```
- Named collection of Tuples sharing context
- Name identifies the scope or purpose
- Contents are all OHM primitives
- Used for discourse representations, scopes, annotation sets, rule registries

---

## 5. Data Shapes

Shape is the logical structure of data. Shape is independent of file extension. The parser detects shape by reading content structure. Any shape can be stored in any compatible extension.

### 5.0 Shape-to-Extension Mapping

| Shape | Supported Extensions | Detection Method |
|-------|---------------------|-----------------|
| ARRAY | `.js`, `.yml`, `.txt`, `.md`, `.json`, `.html` | One value per line, no separators, no headers |
| TABLE | `.csv`, `.ohm`, `.yml`, `.json`, `.txt`, `.html` | First line contains separator (`|` or `,` or `\t`) |
| TREE | `.yml`, `.md`, `.txt`, `.json`, `.ohm` | Lines with increasing indentation |
| GRAPH | `.ohm`, `.txt`, `.tsv`, `.jsonl`, `.yml` | Lines with tab-separated subject/predicate/object |
| COLLECTION | `.md`, `.txt`, `.ohm`, `.yml`, `.json` | Lines starting with `[section]` headers |

### 5.1 ARRAY
```
Structure:  One value per line
Example:    create
            delete
            update
            read
```
- Flat list of values
- No hierarchy, no relationships
- Used for vocabularies, verb lists, stopwords

### 5.2 TABLE
```
Structure:  Header row | separator | Data rows
Example:    name | type | status
            apple | fruit | active
            bob | person | active
```
- Columns define attributes
- Rows define entities
- First row is always the header
- Used for entity registries, product catalogs, any tabular data

### 5.3 TREE
```
Structure:  Indentation defines hierarchy
Example:    company
              engineering
                frontend
                  react
                  vue
                backend
                  node
                  python
```
- Parent-child relationships via indentation
- Depth is unlimited
- Used for category hierarchies, org charts, file systems

### 5.4 GRAPH
```
Structure:  subject TAB predicate TAB object
Example:    apple   IS_A   fruit
            fruit   IS_A   food
            bob     HAS_ROLE   engineer
```
- Directed edges between nodes
- Supports forward, reverse, and neighbor queries
- Used for ontologies, knowledge graphs, relationship maps

### 5.5 COLLECTION
```
Structure:  [section_name] header
            item_1
            item_2
Example:    [fruits]
            apple
            banana
            [vegetables]
            carrot
            potato
```
- Items grouped under named sections
- Sections are independent groups
- Used for categorized data, sentiment groups, review types

---

## 6. Patterns and Types

### 6.1 POS Pattern Format
```
Structure:  [POS_1, POS_2, POS_3, ...]
Example:    [VB, DT, NN]           → Imperative command
Example:    [PRP, VBP, PRP, TO, VB] → Delegation
Example:    [DT, NN, VBZ, JJ]      → State description
```
- Each position is a POS tag
- Variable positions use `{{name}}` for extraction
- Patterns map to expression templates
- Stored in the pattern library dataset

### 6.2 Expression Template Format
```
Structure:  [TYPE, {{var_1}}, TYPE, {{var_2}}, ...]
Example:    [COMMAND, {{verb}}, TARGET, {{noun}}]
Example:    [DELEGATE, USER, SYSTEM, {{verb}}, {{noun}}]
Example:    [STATE, {{noun}}, IS, {{adjective}}]
```
- Contains OHM type tags and variable placeholders
- Variable placeholders are filled by the expression builder
- Output is a fully instantiated OHM expression

### 6.3 Rule Format
```
Structure:  [RULE, name, PATTERN, [pattern], ACTION, [action]]
Example:    [RULE, "DelegateAction", PATTERN, [PRP, VBP, PRP, TO, VB], ACTION, [SET, Agent, system]]
```
- First item: RULE tag
- Second item: rule name (string)
- Third item: PATTERN tag
- Fourth item: POS pattern to match
- Fifth item: ACTION tag
- Sixth item: action to execute on match

### 6.4 Pipeline Phase Format
```
Structure:  [PHASE, name, order, input_type, output_type, rules_ref]
Example:    [PHASE, "Tokenize", 1, "raw_text", "tokens", "decompose.ohm"]
Example:    [PHASE, "POS_Tag", 2, "tokens", "tagged_tokens", "lexicon.ohm"]
```
- Defines execution order
- Specifies input and output types
- References the file containing its rules (`.ohm` for engine rules, or any extension for app data)
- Phases execute in order sequence

### 6.5 The 16 Semantic Types

| # | Type | Detection Rule |
|---|------|---------------|
| 1 | ENTITY | Has name + type/kind/category |
| 2 | RELATION | Has subject + predicate + object |
| 3 | ATTRIBUTE | Has entity + property + value |
| 4 | STATE | Has subject + is/was/are + condition |
| 5 | EVENT | Has action + timestamp or trigger |
| 6 | INTENT | Has desire + target + optional agent |
| 7 | GOAL | Has objective + steps + progress |
| 8 | OPERATION | Has type + parameters + execution state |
| 9 | PATTERN | Has match condition + output template |
| 10 | RULE | Has name + pattern + action |
| 11 | CONTEXT | Has scope + entities + variables |
| 12 | MEMORY | Has content + tier + timestamp |
| 13 | CONSTRAINT | Has condition + enforcement + scope |
| 14 | TRANSFORMATION | Has input + output + operation |
| 15 | OBSERVATION | Has source + data + timestamp |
| 16 | HYPOTHESIS | Has claim + evidence + confidence |

---

## 7. Conventions

### 7.1 File Naming
```
{layer}_{module}_{release}_{component}_{revision}_{stage}_{format}.{ext}

layer:      core | plugins | utility | capabilities | domain | handbook | docs | tests | logs | data | config
module:     ohm | umip | miner | shared
release:    v{major}_{minor}_{patch}
component:  lowercase, snake_case
revision:   v{number}
stage:      draft | candidate | final | deprecated
format:     code | ohm | data_array | data_table | data_tree | data_graph | data_collection | test | doc | config
```

**Token Roles (Machine-Readable Metadata):**
Each token in the filename is a queryable field. The system can filter, route, version, gate, and parse files purely from their names — without opening them.

| Token | Machine Role | Example Query |
|-------|-------------|---------------|
| `layer` | Router — routes to correct folder and engine module | "Show me all files in `core`" |
| `module` | Project identifier — filters by project in multi-project workspace | "Give me all files for project `umip`" |
| `release` | Version selector — picks the right version of a component | "Load only `v10_0_0` files" |
| `component` | Lookup key — system references by name, not path | "Find the `lexer` component" |
| `revision` | Cache control — knows when to reload vs reuse | "Is this the latest revision?" |
| `stage` | Access gate — only loads `final` files into production | "Show me only `final` files" |
| `format` | Parser selector — routes to correct file reader | "Load all `data_table` files" |
| `ext` | Handler — invokes the right file I/O routine | "Read all `.csv` files" |

### 7.2 .ohm File Syntax (Engine Internal)
`.ohm` is the primary format for all internal engine files: rules, patterns, transforms, pipelines, and operations.
```
rule <name>:
  when: <condition>
  then: <action>

pattern <name>:
  match: <keywords>
  extract: <target>

transform <name>:
  from: <input_type>
  to: <output_type>
  apply: <operation>

pipeline <name>:
  steps: <phase_list>

operation <name>:
  takes: <input>
  returns: <output>
```

### 7.3 App Data File Conventions
Engine internal files use `.ohm`. App data files use extensions that fit the data type:

| Data Type | Recommended Extensions | Purpose |
|-----------|----------------------|---------|
| Dataset (name registry) | `.js`, `.yml`, `.txt`, `.json` | Locked vocabulary, verb lists, stopwords |
| Datamap (relationships) | `.ohm`, `.txt`, `.tsv`, `.jsonl` | Synonym maps, parent maps, route maps |
| Datatable (decisions) | `.csv`, `.ohm`, `.yml`, `.json` | Decision tables, validation gates, benchmarks |
| Dataindex (lookup tree) | `.yml`, `.json`, `.md` | Route trees, placement indexes |
| Definition (formal spec) | `.md`, `.ohm` | Root definitions, Level 1 specs, glossaries |
| Template (output format) | `.md`, `.html`, `.txt` | Response templates, report formats |
| Test (validation) | `.js`, `.ohm` | Unit tests, integration tests |
| Config (settings) | `.json`, `.yml`, `.ohm` | Pipeline config, app defaults |

### 7.4 Code Style
- All lowercase with snake_case
- No camelCase in file names or variable names in datasets
- No external imports
- Functions are pure (input in, output out, no side effects except memory writes)
- Every function has a corresponding test

### 7.5 Variable Naming
```
lowercase_snake_case
```
- All lowercase, snake case for multi-word names
- No camelCase, no PascalCase, no UPPER_CASE (that's for constants)
- Descriptive names (no single letters except loop counters)
- Example: `data_source`, `feature_vector`, `rule_count`

### 7.6 Constant Naming
```
UPPER_SNAKE_CASE
```
- All uppercase, snake case for multi-word names
- Defines values that should never change
- Example: `MAX_DEPTH`, `DEFAULT_MULTIPLIER`, `SUPPORT_THRESHOLD`

### 7.7 Task/Function Naming
```
lowercase_snake_case
```
- All lowercase, snake case, verb first (describes action)
- No camelCase, no PascalCase
- Example: `load_data`, `extract_features`, `validate_expression`

**Verb Prefixes:**
| Prefix | Purpose | Example |
|--------|---------|---------|
| `load_` | Load data from source | `load_data`, `load_config` |
| `extract_` | Extract information | `extract_features`, `extract_entities` |
| `calculate_` | Perform calculation | `calculate_entropy`, `calculate_sharpe` |
| `detect_` | Detect pattern/condition | `detect_pivots`, `detect_anomaly` |
| `validate_` | Validate input/output | `validate_expression`, `validate_data` |
| `mine_` | Discover patterns | `mine_relationships`, `mine_causes` |
| `store_` | Store data | `store_features`, `store_rules` |
| `query_` | Query data | `query_rules`, `query_patterns` |
| `generate_` | Generate output | `generate_report`, `generate_signals` |
| `transform_` | Transform data | `transform_prices`, `transform_features` |

### 7.8 Class Naming
```
PascalCase
```
- Each word capitalized, no underscores, singular noun
- Used for complex objects with state and behavior
- Example: `Entity`, `Relation`, `FeatureExtractor`, `MemoryBank`

### 7.9 Test Naming
```
test_{component}_{scenario}
```
- All lowercase, snake case, starts with `test_`
- Describes what is being tested and the scenario
- Example: `test_hello`, `test_atoms`, `test_load_data_success`

### 7.10 Keyword Registry
Reserved keywords that cannot be used as variable names:

| Category | Keywords |
|----------|----------|
| **Data** | `atom`, `task`, `if`, `else`, `while`, `for`, `each`, `return`, `break`, `continue` |
| **Output** | `print`, `assert_equals`, `assert_true`, `assert_false` |
| **Logic** | `true`, `false`, `null` |
| **OHM** | `match`, `pattern`, `rule`, `group`, `transform`, `pipeline`, `operation` |

**Rule:** No new keywords without checking existing datasets, code, and getting owner approval.

### 7.11 File Status Lifecycle
```
draft → candidate → final → deprecated
  ↑         │
  └─────────┘ (if revised, goes back to draft)
```

| Status | Meaning | Can Edit? | Can Deploy? |
|--------|---------|-----------|-------------|
| `draft` | Work in progress | Yes | No |
| `candidate` | Awaiting owner review | No | No |
| `final` | Approved, tested | No | Yes |
| `deprecated` | No longer maintained | No | No |

### 7.12 Version Control
```
Version format: v{major}_{minor}_{patch}
```

| Change Type | Version Change | Example |
|-------------|----------------|---------|
| Breaking change | Major | v10_0_0 → v11_0_0 |
| New feature | Minor | v10_0_0 → v10_1_0 |
| Bug fix | Patch | v10_0_0 → v10_0_1 |

### 7.13 Revision Control
```
Revision format: v{number}
```

| Change Type | Revision Change | Example |
|-------------|-----------------|---------|
| Major logic change | +1 | v1 → v2 |
| Breaking change | +1 | v2 → v3 |
| Minor fix | Same | v2 → v2 |

### 7.14 Strict Rules

1. **Snake case only** — ALL names must be snake_case (except constants, classes, shapes, types, keywords)
2. **No new keywords** — Check existing datasets, code, and get owner approval before adding
3. **No editing active files** — Create new file, deprecate old, update references
4. **Candidate until review** — All changes are candidates until owner approves
5. **Status lifecycle** — draft → candidate → final → deprecated
6. **Version control** — v{major}_{minor}_{patch}, no dots
7. **Revision control** — v{number}, increment for significant changes
8. **Cross-reference check** — Check all references before finalizing
9. **Conflict resolution** — Check all datasets, code, docs before naming
10. **Documentation update** — Update all docs when conventions change

### 7.15 Layer Routing Summary

OHM v10 uses a dual-layer system: **Knowledge Levels** (authority) and **File Layers** (storage).

**Knowledge Levels:**

| Level | Name | Purpose | Authority |
|-------|------|---------|-----------|
| Level 0 | Root | What OHM IS | Highest — immutable |
| Level 1 | Capabilities | What OHM CAN DO | High — stable |
| Level 2 | Implementations | How OHM DOES IT | Medium — evolving |
| Level 3 | Applications | What OHM PRODUCES | Low — variable |

**Routing Decision Rule:**

```
IF content answers "What is OHM?"        → Level 0
IF content answers "What can OHM do?"    → Level 1
IF content answers "How does OHM do it?" → Level 2
IF content answers "What did OHM make?"  → Level 3
```

**Authority Chain:**

```
Level 0 → constrains → Level 1 → constrains → Level 2 → produces → Level 3
```

**File Layer Mapping:**

| Level | Primary File Layers |
|-------|---------------------|
| Level 0 | docs, handbook |
| Level 1 | docs, capabilities |
| Level 2 | core, plugins, utility, capabilities, domain |
| Level 3 | data, logs |

**All handbooks are Level 0.** They are part of Root and constrain all downstream work.

**Full reference:** `handbook_ohm_v10_0_0_layer_routing_v1_draft_doc.md`

---

## 8. Decisions

### 8.1 Why Syntactic Compiler, Not Semantic Interpreter
Semantic approaches require knowing what words mean. This breaks on new vocabulary. Syntactic approaches match sentence structure. This works on any words, including invented ones.

### 8.2 Why Two Layers, Not One
Mixing grammar parsing with context resolution creates circular dependencies. The compiler must be context-free to be deterministic. The resolver must be grammar-free to be simple. Separating them makes both testable and debuggable.

### 8.3 Why Rules as Data
Hard-coded rules require code changes to update. Data-stored rules can be imported, exported, versioned, linted, and shared. This enables the rule import pipeline from GATE and Boxer without touching engine code.

### 8.4 Why LIFO Stack for Context
Natural language has nested scopes ("Inside the cart, if the total is over $100..."). A stack matches this structure exactly. Push on enter, pop on exit. Variables in inner scopes hide variables in outer scopes. This is deterministic and matches how compilers handle nested blocks.

### 8.5 Why 4 Primitives Only
More primitives mean more complexity. Fewer primitives mean more encoding work. Four (ATOM, PAIR, TUPLE, GROUP) covers all needed structures: single values, relationships, sequences, and collections. This is the minimum viable set.

### 8.6 Why Deterministic, Not Probabilistic
Probabilistic systems are unpredictable. Users cannot debug them. OHM is an automation platform, not a chatbot. Predictability is more valuable than coverage. Unmatched patterns get clarification requests, not guesses.

### 8.7 Why Native Rule Import, Not External Libraries
External libraries bring dependency chains, version conflicts, and license constraints. Studying their data structures and re-implementing natively gives full control over runtime, memory, and logic. The research is adopted; the code is not.

### 8.8 Why Lint Before Execute
Errors in rules compound through the pipeline. A duplicate rule causes conflicting outputs. A contradictory binding causes undefined behavior. Catching errors at the phase boundary prevents cascading failures and makes debugging tractable.

### 8.9 Why Shape Is Independent of File Extension
Locking shapes to specific extensions forces teams to adopt one file format. In reality, teams use `.js`, `.yml`, `.csv`, `.md`, `.json`, and others depending on their tooling and workflow. By detecting shape from content structure, OHM stays flexible. The parser adapts to whatever file the user provides. Downstream logic never assumes shape from extension.

---

## 9. Scope Boundary

### What Belongs in Root
- Definition of what OHM is
- Laws every capability must obey
- Glossary of shared terms
- Specification of primitives, shapes, patterns, and types
- Conventions for naming, syntax, and code style
- Architecture decisions with rationale
- All handbooks (naming, routing, conventions, guides)

### What Belongs in Level 1
- Requirements for a specific capability
- Use cases for a specific capability
- Rules specific to a capability
- Input/output specifications
- Test cases for that capability
- Implementation notes

### The Rule
If it is shared across all capabilities, it belongs in Root. If it is specific to one capability, it belongs in Level 1. If you are unsure, ask: "Would removing this break capabilities other than the one it describes?" If yes, it belongs in Root.

---

**End of Root Definition**
