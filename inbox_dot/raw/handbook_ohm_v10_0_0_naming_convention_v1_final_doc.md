# OHM Naming Convention — Complete Reference

*Single source of truth for all naming in OHM projects.*

---

## Table of Contents

1. [File Naming](#1-file-naming)
2. [Token Roles and Machine-Readable Metadata](#2-token-roles-and-machine-readable-metadata)
3. [Folder Naming](#3-folder-naming)
4. [Variable Naming](#4-variable-naming)
5. [Constant Naming](#5-constant-naming)
6. [Task/Function Naming](#6-taskfunction-naming)
7. [Parameter Naming](#7-parameter-naming)
8. [Class Naming](#8-class-naming)
9. [Data Shape Naming](#9-data-shape-naming)
10. [Semantic Type Naming](#10-semantic-type-naming)
11. [Keyword Naming](#11-keyword-naming)
12. [Module Naming](#12-module-naming)
13. [Pipeline Naming](#13-pipeline-naming)
14. [Rule Naming](#14-rule-naming)
15. [Test Naming](#15-test-naming)
16. [Configuration Naming](#16-configuration-naming)
17. [Documentation Naming](#17-documentation-naming)
18. [Quick Reference](#18-quick-reference)

---

## 1. File Naming

### Formula

```
{layer}_{module}_{release}_{component}_{revision}_{stage}_{format}.{ext}
```

### Segments

| # | Segment | Question | Values |
|---|---------|----------|--------|
| 1 | **layer** | WHERE in codebase? | core, plugins, utility, capabilities, domain, handbook, docs, tests, logs, data, config |
| 2 | **module** | WHICH project? | ohm, umip, miner, shared |
| 3 | **release** | WHICH version? | v10_0_0, v1_0_0, etc. |
| 4 | **component** | WHICH file? | lowercase, snake_case |
| 5 | **revision** | WHICH revision? | v1, v2, v3, etc. |
| 6 | **stage** | WHAT status? | draft, candidate, final, deprecated |
| 7 | **format** | WHAT kind? | code, ohm, data_array, data_table, data_tree, data_graph, data_collection, test, doc, config |

### Visual Breakdown

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
│     │   │      │     │   │     │    │
│     │   │      │     │   │     │    └─ format: what kind of file
│     │   │      │     │   │     └────── stage: development status
│     │   │      │     │   └──────────── revision: file version
│     │   │      │     └──────────────── component: which file
│     │   │      └────────────────────── release: project version
│     │   └───────────────────────────── module: which project
│     └───────────────────────────────── layer: where in codebase
```

### Rules

1. All lowercase
2. Snake case for multi-word names
3. No camel case
4. No dots in version (`v10_0_0` not `v10.0.0`)
5. Underscores only (no hyphens, no spaces)
6. Extension last (`.js`, `.ohm`, `.txt`, `.md`, `.json`)

### Examples

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
core_ohm_v10_0_0_parser_runtime_v1_draft_code.js
plugins_ohm_v10_0_0_context_v1_draft_code.js
utility_ohm_v10_0_0_types_v1_draft_code.js
domain_umip_v10_0_0_ingest_v1_draft_ohm.ohm
domain_miner_v10_0_0_discover_v1_draft_ohm.ohm
data_umip_v10_0_0_products_v1_draft_data_table.txt
data_umip_v10_0_0_relations_v1_draft_data_graph.txt
data_umip_v10_0_0_categories_v1_draft_data_tree.txt
data_umip_v10_0_0_reviews_v1_draft_data_collection.txt
tests_ohm_v10_0_0_test_hello_v1_draft_test.js
handbook_ohm_v10_0_0_naming_convention_v1_final_doc.md
```

---

## 2. Token Roles and Machine-Readable Metadata

Each token in the filename is not just a label. It is a **structured key** that downstream logic can parse, query, and consume. The filename is a machine-readable identifier.

### Token Role Table

| Token | Position | Human Meaning | Machine Role | Query Example |
|-------|----------|--------------|--------------|---------------|
| `layer` | 1st | Where in codebase | **Router** — system routes to the correct folder and engine module | "Show me all files in `core`" |
| `module` | 2nd | Which project | **Project identifier** — filters files by project in multi-project workspace | "Give me all files for project `umip`" |
| `release` | 3rd | Which version | **Version selector** — system picks the right version of a component | "Load only `v10_0_0` files" |
| `component` | 4th | Which file | **Lookup key** — system references this by name, not by full path | "Find the `lexer` component" |
| `revision` | 5th | Which revision | **Cache control** — system knows when to reload vs reuse | "Is this the latest revision of `lexer`?" |
| `stage` | 6th | Development status | **Access gate** — system only loads `final` files into production | "Show me only `final` files" |
| `format` | 7th | What kind of file | **Parser selector** — system routes to the correct file reader | "Load all `data_table` files" |
| `ext` | last | File extension | **Handler** — system invokes the right file I/O routine | "Read all `.csv` files" |

### Why Each Token Matters

#### `layer` — The Router

The first token tells the system where the file lives in the codebase hierarchy. In a workspace with multiple layers (core, plugins, utility, capabilities, domain, handbook, docs, tests, logs, data, config), the `layer` token is the primary routing key.

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
  ^^^^
  Router: this file belongs to the core engine layer
```

**Downstream use:**
- System loads `core` files into the runtime engine
- System loads `plugins` files into the plugin registry
- System loads `utility` files into the shared utility library
- System loads `domain` files into domain-specific modules
- System loads `tests` files into the test runner
- System loads `docs` files into the documentation index

#### `module` — The Project Identifier

The second token identifies which project this file belongs to. In a multi-project workspace, this is the primary filter key.

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
       ^^^
       Project: this file belongs to the OHM project

domain_umip_v10_0_0_ingest_v1_draft_ohm.ohm
          ^^^^
          Project: this file belongs to the UMIP project
```

**Downstream use:**
- System queries: "Give me all files where module = `ohm`"
- System queries: "What modules exist in this workspace?"
- System queries: "Show me all core files across all modules"
- System isolates project contexts when working on multiple projects

#### `release` — The Version Selector

The third token tracks which version of the project this file was created for. The system can load specific versions and detect version mismatches.

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
            ^^^^^^
            Version: OHM v10.0.0
```

**Downstream use:**
- System loads files matching the current release
- System detects when a file is from an older release
- System can run multiple releases side-by-side for comparison
- System enforces: "Do not load `v9_0_0` files into `v10_0_0` runtime"

#### `component` — The Lookup Key

The fourth token is the human-readable name of the file. This is the key used in references, imports, and documentation.

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
                    ^^^^^
                    Component: this is the lexer
```

**Downstream use:**
- System references: "The `lexer` component is in `core` layer"
- System imports: `require('core/ohm_v10_0_0/lexer')`
- System documentation: "See `lexer` for tokenization logic"
- System conflict detection: "Two files named `lexer` in same layer — conflict"

#### `revision` — The Cache Control

The fifth token tracks how many times this specific file has been significantly revised. The system uses this to determine if a cached version is still valid.

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
                         ^
                         Revision: first version
```

**Downstream use:**
- System compares: "Is the local `v1` the same as the remote `v2`?"
- System caches: "This file is `v1`, no need to reload"
- System invalidates: "This file is now `v2`, reload required"
- System tracks: "How many revisions has this component gone through?"

#### `stage` — The Access Gate

The sixth token determines whether the file is safe to load into production. The system enforces access rules based on this token.

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
                              ^^^^^
                              Stage: work in progress
```

**Downstream use:**
- System loads: "Only load `final` files into the runtime engine"
- System blocks: "Do not load `draft` files into production"
- System archives: "Move `deprecated` files to archive"
- System reports: "How many files are still in `draft` status?"

#### `format` — The Parser Selector

The seventh token tells the system how to parse the file content. The system routes to the correct parser based on this token.

```
data_umip_v10_0_0_products_v1_draft_data_table.txt
                                ^^^^^^^^^^^^^
                                Format: this is a data table (pipe-separated rows)
```

**Downstream use:**
- System parses: `format = "data_table"` → use table parser (detect `|` separator)
- System parses: `format = "data_array"` → use array parser (one value per line)
- System parses: `format = "data_graph"` → use graph parser (tab-separated triples)
- System parses: `format = "data_tree"` → use tree parser (indentation-based)
- System parses: `format = "data_collection"` → use collection parser (`[section]` headers)
- System parses: `format = "code"` → use JavaScript parser
- System parses: `format = "ohm"` → use OHM rule parser
- System parses: `format = "test"` → use test runner
- System parses: `format = "doc"` → use markdown reader
- System parses: `format = "config"` → use JSON/YAML config reader

#### `ext` — The File Handler

The final token is the actual file extension. This tells the operating system and the OHM runtime which I/O routine to use.

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
                                       ^^^
                                       Extension: JavaScript file
```

**Downstream use:**
- System reads: `.js` → JavaScript file reader
- System reads: `.ohm` → OHM rule file reader
- System reads: `.txt` → Plain text reader (then detect shape by content)
- System reads: `.csv` → CSV reader
- System reads: `.md` → Markdown reader
- System reads: `.json` → JSON reader
- System reads: `.yml` → YAML reader

### Query Examples

The filename structure enables powerful queries:

```
QUERY: "Load all OHM v10 core files"
  → Filter: layer=core, module=ohm, release=v10_0_0
  → Returns: core_ohm_v10_0_0_lexer_v1_draft_code.js
             core_ohm_v10_0_0_parser_v1_draft_code.js

QUERY: "Show me only final files"
  → Filter: stage=final
  → Returns: all files with "final" in name

QUERY: "Load all data tables"
  → Filter: format=data_table
  → Returns: data_umip_v10_0_0_products_v1_draft_data_table.txt

QUERY: "What version of lexer are we on?"
  → Parse: component=lexer, revision=v1
  → Returns: v1 (first version)

QUERY: "Show me all deprecated files across all projects"
  → Filter: stage=deprecated
  → Returns: all files with "deprecated" in name

QUERY: "Load all test files for OHM"
  → Filter: layer=tests, module=ohm
  → Returns: tests_ohm_v10_0_0_test_*.js

QUERY: "What projects exist?"
  → Group by: module
  → Returns: ohm, umip, miner, shared

QUERY: "Show me all .ohm rule files"
  → Filter: ext=.ohm
  → Returns: all files ending in .ohm
```

### Filename as Metadata Record

When the system loads a file, it can extract metadata directly from the filename without opening the file:

```
INPUT:  core_ohm_v10_0_0_lexer_v1_draft_code.js

EXTRACTED METADATA:
  layer:     core
  module:    ohm
  release:   v10_0_0
  component: lexer
  revision:  v1
  stage:     draft
  format:    code
  ext:       .js

DECISIONS BASED ON METADATA:
  layer = core       → Load into runtime engine
  module = ohm       → Belongs to OHM project
  release = v10_0_0  → Compatible with current version
  stage = draft      → Do not load into production
  format = code      → Parse as JavaScript
  ext = .js          → Use JavaScript file reader
```

---

## 3. Folder Naming

### Formula

```
{layer}_{module}_{release}
```

### Rules

1. All lowercase
2. Snake case for multi-word names
3. No camel case
4. No special characters
5. Matches the files it contains

### Structure

```
code/
├── core/
│   └── ohm_v10_0_0/
├── plugins/
│   └── ohm_v10_0_0/
├── utility/
│   └── ohm_v10_0_0/
├── capabilities/
│   └── ohm_v10_0_0/
└── domain/
    ├── umip_v10_0_0/
    ├── miner_v10_0_0/
    └── shared_v10_0_0/

handbook/
└── ohm_v10_0_0/

docs/
└── ohm_v10_0_0/

tests/
└── ohm_v10_0_0/

data/
└── umip_v10_0_0/
```

### Examples

```
code/core/ohm_v10_0_0/                    ← core engine
code/plugins/ohm_v10_0_0/                 ← plugins
code/utility/ohm_v10_0_0/                 ← utility
code/capabilities/ohm_v10_0_0/            ← capabilities
code/domain/umip_v10_0_0/                 ← UMIP module
code/domain/miner_v10_0_0/                ← Miner module
code/domain/shared_v10_0_0/               ← shared components
handbook/ohm_v10_0_0/                     ← reference docs
docs/ohm_v10_0_0/                         ← project docs
tests/ohm_v10_0_0/                        ← test files
data/umip_v10_0_0/                        ← datasets
```

---

## 4. Variable Naming

### Convention

```
lowercase_snake_case
```

### Rules

1. All lowercase
2. Snake case for multi-word names
3. No camel case
4. No special characters
5. No underscores at start/end
6. Descriptive names (no single letters except loop counters)

### Examples

```javascript
// ✅ Correct
var data_source = 'file.csv';
var feature_vector = [];
var rule_count = 0;
var max_depth = 5;
var is_valid = true;
var result_list = [];

// ❌ Wrong
var dataSource = 'file.csv';      // camel case
var FeatureVector = [];           // Pascal case
var DATA_SOURCE = 'file.csv';    // UPPER case (that's for constants)
var _data_source = 'file.csv';   // leading underscore
var data_source_ = 'file.csv';   // trailing underscore
```

### Loop Counters (Exception)

```javascript
// Single letters allowed for loop counters
for (var i = 0; i < items.length; i++) { ... }
for (var j = 0; j < rows.length; j++) { ... }
for (var k = 0; k < columns.length; k++) { ... }
```

---

## 5. Constant Naming

### Convention

```
UPPER_SNAKE_CASE
```

### Rules

1. All uppercase
2. Snake case for multi-word names
3. No camel case
4. No special characters
5. Defines values that should never change

### Examples

```javascript
// ✅ Correct
var MAX_DEPTH = 5;
var DEFAULT_MULTIPLIER = 2.5;
var SUPPORT_THRESHOLD = 0.8;
var API_BASE_URL = 'https://api.example.com';
var MAX_RETRY_COUNT = 3;

// ❌ Wrong
var maxDepth = 5;           // camel case
var Max_Depth = 5;          // Pascal case
var MAXDEPTH = 5;           // no snake case
var max_depth = 5;          // lowercase (that's for variables)
```

---

## 6. Task/Function Naming

### Convention

```
lowercase_snake_case
```

### Rules

1. All lowercase
2. Snake case for multi-word names
3. Verb first (describes action)
4. No camel case
5. No special characters

### Examples

```javascript
// ✅ Correct
task load_data(source, config) { ... }
task extract_features(sequence, window) { ... }
task mine_relationships(training_symbols) { ... }
task validate_expression(candidate) { ... }
task calculate_entropy(sequence) { ... }

// ❌ Wrong
task loadData(source, config) { ... }        // camel case
task Extract_Features(sequence, window) { ... } // Pascal case
task extractFeatures(sequence, window) { ... }  // camel case
task LOAD_DATA(source, config) { ... }          // UPPER case (that's for constants)
```

### Verb Prefixes

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

---

## 7. Parameter Naming

### Convention

```
lowercase_snake_case
```

### Rules

1. All lowercase
2. Snake case for multi-word names
3. Descriptive names
4. No camel case
5. No special characters

### Examples

```javascript
// ✅ Correct
task load_data(file_path, data_type, max_retries) { ... }
task extract_features(sequence, window_size, normalize) { ... }
task mine_relationships(training_symbols, min_confidence, max_lead_time) { ... }

// ❌ Wrong
task load_data(filePath, dataType, maxRetries) { ... }  // camel case
task load_data(File_Path, Data_Type, Max_Retries) { ... } // Pascal case
```

---

## 8. Class Naming

### Convention

```
PascalCase
```

### Rules

1. Pascal case (each word capitalized)
2. No underscores
3. No special characters
4. Singular noun (not plural)
5. Descriptive name

### Examples

```javascript
// ✅ Correct
class Entity { ... }
class Relation { ... }
class FeatureExtractor { ... }
class PatternDiscovery { ... }
class BehaviorClassifier { ... }
class MemoryBank { ... }

// ❌ Wrong
class entity { ... }           // lowercase
class feature_extractor { ... } // snake case
class FEATURE_EXTRACTOR { ... } // UPPER case
class FeatureExtractors { ... } // plural
```

### When to Use Classes

- Complex objects with state and behavior
- Multiple instances needed
- Clear "is-a" relationship
- Example: `Entity`, `Relation`, `FeatureExtractor`

### When to Use Tasks/Functions

- Simple operations
- No state needed
- Single instance
- Example: `load_data`, `extract_features`, `calculate_entropy`

---

## 9. Data Shape Naming

### Convention

```
UPPERCASE (single word)
```

### Shapes

| Shape | Description | Example |
|-------|-------------|---------|
| `ARRAY` | Ordered list | `[1, 2, 3]` |
| `TABLE` | Structured rows/columns | `[{name: "A", value: 1}, ...]` |
| `TREE` | Hierarchical | `{name: "root", children: [...]}` |
| `GRAPH` | Nodes and edges | `{nodes: [...], edges: [...]}` |
| `COLLECTION` | Grouped data | `{group1: [...], group2: [...]}` |

### In File Names

```
data_umip_v10_0_0_products_v1_draft_data_table.txt
data_umip_v10_0_0_relations_v1_draft_data_graph.txt
data_umip_v10_0_0_categories_v1_draft_data_tree.txt
data_umip_v10_0_0_reviews_v1_draft_data_collection.txt
data_umip_v10_0_0_verbs_v1_draft_data_array.txt
```

### In Code

```javascript
var shape = 'TABLE';      // uppercase
var ARRAY = 'ARRAY';      // constant
var TREE = 'TREE';        // constant
var GRAPH = 'GRAPH';      // constant
var COLLECTION = 'COLLECTION'; // constant
```

---

## 10. Semantic Type Naming

### Convention

```
UPPERCASE (single word)
```

### Types

| Type | Description |
|------|-------------|
| `ENTITY` | Individual object |
| `RELATION` | Connection between entities |
| `ATTRIBUTE` | Property of entity |
| `STATE` | Condition/status |
| `EVENT` | Something that happens |
| `INTENT` | Purpose/goal |
| `GOAL` | Desired outcome |
| `OPERATION` | Action/task |
| `PATTERN` | Recurring structure |
| `RULE` | If-then logic |
| `CONTEXT` | Surrounding conditions |
| `MEMORY` | Stored information |
| `CONSTRAINT` | Limitation/rule |
| `TRANSFORMATION` | Change/mapping |
| `OBSERVATION` | What is seen |
| `HYPOTHESIS` | Proposed explanation |

### In Code

```javascript
var type = 'ENTITY';           // uppercase
var ENTITY = 'ENTITY';         // constant
var RELATION = 'RELATION';     // constant
var ATTRIBUTE = 'ATTRIBUTE';   // constant
```

---

## 11. Keyword Naming

### Convention

```
lowercase (single word)
```

### Keywords

| Category | Keywords |
|----------|----------|
| **Data** | `atom`, `task`, `if`, `else`, `while`, `for`, `each`, `return`, `break`, `continue` |
| **Output** | `print`, `assert_equals`, `assert_true`, `assert_false` |
| **Logic** | `true`, `false`, `null` |
| **OHM** | `match`, `pattern`, `rule`, `group`, `transform`, `pipeline`, `operation` |

### Rules

1. Always lowercase
2. No underscores
3. No special characters
4. Reserved (cannot be used as variable names)

### Examples

```ohm
// ✅ Correct
atom max_depth = 5
task load_data(source, config):
    if source != null:
        print(source)
    else:
        print("No source")

// ❌ Wrong
Atom max_depth = 5           // capitalized
ATOM max_depth = 5           // UPPER case
task load_Data(source, config):  // camel case in task name
```

---

## 12. Module Naming

### Convention

```
lowercase (single word)
```

### Modules

| Module | Description |
|--------|-------------|
| `ohm` | Main OHM language project |
| `umip` | Universal Market Intelligence Platform |
| `miner` | OHM Miner (symbolic discovery) |
| `shared` | Cross-domain shared components |

### In File Names

```
core_ohm_v10_0_0_lexer_v1_draft_code.js
domain_umip_v10_0_0_ingest_v1_draft_ohm.ohm
domain_miner_v10_0_0_discover_v1_draft_ohm.ohm
domain_shared_v10_0_0_adapter_v1_draft_ohm.ohm
```

### In Code

```javascript
var module_name = 'umip';     // lowercase
var MODULE = 'OHM';           // constant (if needed)
```

---

## 13. Pipeline Naming

### Convention

```
lowercase_snake_case
```

### Rules

1. All lowercase
2. Snake case for multi-word names
3. Verb first (describes action)
4. No camel case

### Examples

```
domain_miner_v10_0_0_strategy_leg_v1_draft_ohm.ohm
domain_umip_v10_0_0_data_ingestion_v1_draft_ohm.ohm
domain_umip_v10_0_0_feature_extraction_v1_draft_ohm.ohm
```

### In Code

```ohm
pipeline data_ingestion:
    step load_data
    step validate_data
    step transform_data

pipeline feature_extraction:
    step extract_universal
    step extract_volatility
    step normalize
```

---

## 14. Rule Naming

### Convention

```
lowercase_snake_case
```

### Rules

1. All lowercase
2. Snake case for multi-word names
3. Descriptive name
4. No camel case

### Examples

```ohm
rule detect_pivot_high(candles, lookback, lookahead):
    ...

rule validate_expression(candidate, max_depth, max_nodes):
    ...

rule mine_relationships(training_symbols, min_confidence):
    ...
```

---

## 15. Test Naming

### Convention

```
test_{component}_{scenario}
```

### Rules

1. All lowercase
2. Snake case
3. Starts with `test_`
4. Describes what is being tested
5. Describes the scenario

### Examples

```
tests_ohm_v10_0_0_test_hello_v1_draft_test.js
tests_ohm_v10_0_0_test_atoms_v1_draft_test.js
tests_ohm_v10_0_0_test_tasks_v1_draft_test.js
tests_ohm_v10_0_0_test_control_flow_v1_draft_test.js
```

### In Code

```javascript
// Test file names
test_contextual_reasoning.js
test_scraper_analysis.js
test_data_shapes.js

// Test function/task names
task test_load_data_success() { ... }
task test_load_data_file_not_found() { ... }
task test_extract_features_empty_input() { ... }
```

---

## 16. Configuration Naming

### Convention

```
lowercase_snake_case
```

### Rules

1. All lowercase
2. Snake case
3. Descriptive name
4. No camel case

### Examples

```
utility_ohm_v10_0_0_settings_v1_draft_config.json
utility_ohm_v10_0_0_database_v1_draft_config.json
utility_ohm_v10_0_0_api_v1_draft_config.json
```

### In Code

```json
{
  "database_host": "localhost",
  "database_port": 5432,
  "max_retry_count": 3,
  "default_timeout": 30
}
```

---

## 17. Documentation Naming

### Convention

```
{descriptive_name}_v{version}_{stage}_doc.md
```

### Rules

1. Lowercase
2. Snake case
3. Includes version
4. Includes stage
5. Extension is `.md`

### Examples

```
handbook_ohm_v10_0_0_naming_convention_v1_final_doc.md
handbook_ohm_v10_0_0_data_type_handbook_v1_final_doc.md
docs_ohm_v10_0_0_readme_v1_final_doc.md
docs_umip_v10_0_0_specification_v1_draft_doc.md
```

---

## 18. Quick Reference

### File Naming

```
{layer}_{module}_{release}_{component}_{revision}_{stage}_{format}.{ext}

EXAMPLE: core_ohm_v10_0_0_lexer_v1_draft_code.js
```

### All Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **File** | `{layer}_{module}_{release}_{component}_{revision}_{stage}_{format}.{ext}` | `core_ohm_v10_0_0_lexer_v1_draft_code.js` |
| **Folder** | `{layer}_{module}_{release}` | `code/core/ohm_v10_0_0/` |
| **Variable** | `lowercase_snake_case` | `data_source`, `feature_vector` |
| **Constant** | `UPPER_SNAKE_CASE` | `MAX_DEPTH`, `DEFAULT_MULTIPLIER` |
| **Task/Function** | `lowercase_snake_case` | `load_data`, `extract_features` |
| **Parameter** | `lowercase_snake_case` | `file_path`, `window_size` |
| **Class** | `PascalCase` | `Entity`, `FeatureExtractor` |
| **Data Shape** | `UPPERCASE` | `ARRAY`, `TABLE`, `TREE`, `GRAPH`, `COLLECTION` |
| **Semantic Type** | `UPPERCASE` | `ENTITY`, `RELATION`, `ATTRIBUTE` |
| **Keyword** | `lowercase` | `atom`, `task`, `if`, `else` |
| **Module** | `lowercase` | `ohm`, `umip`, `miner`, `shared` |
| **Pipeline** | `lowercase_snake_case` | `data_ingestion`, `feature_extraction` |
| **Rule** | `lowercase_snake_case` | `detect_pivot_high`, `validate_expression` |
| **Test** | `test_{component}_{scenario}` | `test_hello`, `test_atoms` |
| **Config** | `lowercase_snake_case` | `settings`, `database`, `api` |
| **Documentation** | `{name}_v{version}_{stage}_doc.md` | `naming_convention_v1_final_doc.md` |

### Do / Don't

| ✅ Do | ❌ Don't |
|-------|---------|
| `core_ohm_v10_0_0_lexer_v1_draft_code.js` | `ohm_core_v10_0_0_draft_lexer.js` |
| `lowercase_snake_case` | `camelCase` or `PascalCase` |
| `UPPER_SNAKE_CASE` for constants | `lowercase` for constants |
| `v10_0_0` | `v10.0.0` |
| `draft` | `Draft` |
| `load_data` | `loadData` or `Load_Data` |
| `FeatureExtractor` | `feature_extractor` or `featureExtractor` |

### Rules Summary

1. **Layer first** — always starts with layer
2. **Module second** — project name
3. **Release third** — project version
4. **Component fourth** — file name
5. **Revision fifth** — file version
6. **Stage sixth** — development status
7. **Format seventh** — file type
8. **All lowercase** — no exceptions for files/folders
9. **Snake case** — no camel case anywhere
10. **Underscores only** — no dots, no hyphens
11. **No dots in version** — `v10_0_0` not `v10.0.0`
12. **Extension last** — `.js`, `.ohm`, `.txt`, `.md`, `.json`

---

## 19. Strict Rules

### Rule 1: Snake Case Only

```
ALL names MUST be snake_case (lowercase with underscores)
NO camelCase, NO PascalCase, NO UPPER_CASE (except constants)
NO exceptions
```

** Applies to:**
- File names
- Folder names
- Variable names
- Task/function names
- Parameter names
- Pipeline names
- Rule names
- Test names
- Config names

**Exception:**
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_DEPTH`)
- Classes: `PascalCase` (e.g., `Entity`, `FeatureExtractor`)
- Data shapes: `UPPERCASE` (e.g., `ARRAY`, `TABLE`)
- Semantic types: `UPPERCASE` (e.g., `ENTITY`, `RELATION`)
- Keywords: `lowercase` (e.g., `atom`, `task`, `if`)

---

### Rule 2: No New Keywords Without Checking

```
BEFORE adding any new keyword:
1. Check existing keywords list (Section 10)
2. Check existing datasets for conflicts
3. Check existing code for conflicts
4. Get owner approval
5. Update this document
```

** Existing Keywords:**

| Category | Keywords |
|----------|----------|
| **Data** | `atom`, `task`, `if`, `else`, `while`, `for`, `each`, `return`, `break`, `continue` |
| **Output** | `print`, `assert_equals`, `assert_true`, `assert_false` |
| **Logic** | `true`, `false`, `null` |
| **OHM** | `match`, `pattern`, `rule`, `group`, `transform`, `pipeline`, `operation` |

**Before Adding:**
```
1. Is this keyword already used? → STOP
2. Does this keyword conflict with existing code? → STOP
3. Does this keyword conflict with existing data? → STOP
4. Is this keyword necessary? → Can we use an existing keyword?
5. Get owner approval → YES/NO
6. Update this document → Add to keywords list
```

---

### Rule 3: No Editing Active Files

```
DO NOT edit files that are:
- In use by other files
- Referenced by other code
- Part of running systems
- Marked as "final" or "active"
```

**Instead:**
```
1. Create new file with new name
2. Mark old file as "deprecated"
3. Update references to point to new file
4. Get owner approval
5. Archive old file
```

**Active File Indicators:**
```
- Status: final
- Referenced by other files
- Part of running tests
- Used in production
```

**Safe to Edit:**
```
- Status: draft
- Not referenced by other files
- Not part of running tests
- Not used in production
```

---

### Rule 4: Everything Marked Candidate Until Owner Review

```
ALL new files, changes, and additions are "candidates" until:
1. Owner reviews
2. Owner approves
3. Status changed from "draft" to "final"
```

**Candidate Lifecycle:**
```
draft (candidate) → owner review → final (approved)
                         ↓
                    rejected → archived
```

**Candidate Indicators:**
```
- Status: draft
- File name includes "draft"
- Not yet reviewed by owner
- Not yet approved by owner
```

**What Requires Owner Review:**
```
- New files
- New keywords
- New conventions
- Breaking changes
- Major modifications
- Anything affecting other files
```

**What Does NOT Require Owner Review:**
```
- Bug fixes in draft files
- Typo corrections
- Documentation updates (non-breaking)
- Test additions (non-breaking)
```

---

### Rule 5: File Status Lifecycle

```
draft → candidate → final → deprecated
  ↑         │
  └─────────┘ (if revised, goes back to draft)
```

**Status Meanings:**

| Status | Meaning | Can Edit? | Can Deploy? |
|--------|---------|-----------|-------------|
| `draft` | Work in progress | Yes | No |
| `candidate` | Awaiting owner review | No | No |
| `final` | Approved, tested | No | Yes |
| `deprecated` | No longer maintained | No | No |

**Status Transitions:**
```
draft → candidate (submitted for review)
candidate → final (approved by owner)
candidate → draft (rejected, needs work)
final → deprecated (no longer needed)
draft → deprecated (abandoned)
```

---

### Rule 6: Version Control

```
Version format: v{major}_{minor}_{patch}
Examples: v10_0_0, v1_0_0, v2_1_3
```

**When to Increment:**

| Change Type | Version Change | Example |
|-------------|----------------|---------|
| Breaking change | Major | v10_0_0 → v11_0_0 |
| New feature | Minor | v10_0_0 → v10_1_0 |
| Bug fix | Patch | v10_0_0 → v10_0_1 |

**Version Rules:**
1. Always starts with `v`
2. Segments separated by `_`
3. No dots allowed
4. No hyphens allowed
5. Numbers only (no letters)

---

### Rule 7: Revision Control

```
Revision format: v{number}
Examples: v1, v2, v3
```

**When to Increment:**

| Change Type | Revision Change | Example |
|-------------|-----------------|---------|
| Major logic change | +1 | v1 → v2 |
| Breaking change | +1 | v2 → v3 |
| Minor fix | Same | v2 → v2 |

**Revision Rules:**
1. Always starts with `v`
2. Numbers only
3. Increment for significant changes
4. Keep same for minor fixes

---

### Rule 8: Cross-Reference Check

```
BEFORE finalizing any file:
1. Check all files that reference this file
2. Update references if name changes
3. Verify no breaking changes
4. Get owner approval
```

**Cross-Reference Checklist:**
```
□ Which files reference this file?
□ Will renaming break other files?
□ Are there circular dependencies?
□ Do tests still pass?
□ Does documentation need updating?
```

---

### Rule 9: Naming Conflict Resolution

```
IF naming conflict detected:
1. Check existing names in all datasets
2. Check existing names in all code
3. Check existing names in all documentation
4. Choose alternative name
5. Get owner approval
6. Update this document
```

**Conflict Resolution Steps:**
```
1. Search for existing name → Found? → Choose alternative
2. Search for similar name → Found? → Choose alternative
3. Check for reserved words → Found? → Choose alternative
4. Check for external conflicts → Found? → Choose alternative
5. Get owner approval → Approved? → Use name
6. Update documentation → Done
```

---

### Rule 10: Documentation Update

```
IF naming convention changes:
1. Update this document
2. Update all examples
3. Update all references
4. Notify owner
5. Get approval
```

**Documentation Checklist:**
```
□ This document updated
□ All examples updated
□ All references updated
□ All tests updated
□ All documentation updated
□ Owner notified
□ Approval received
```

---

### Rule 11: Documentation Format

```
Do NOT use tree characters (├──, └──, │) in documentation.

Use bullets (*) and tab spaces for hierarchy.
```

**Correct Format:**
```
* level1
	* level2
		* level3
```

**Incorrect Format:**
```
├── level1
│   ├── level2
│   └── level3
└── level1
```

**Rules:**
1. Use asterisk (*) for bullet points
2. Use tab spaces for indentation
3. Never use ├──, └──, │, or similar tree characters
4. Apply to all documentation, index files, and text outputs

---

### Strict Rules Summary

| # | Rule | Description |
|---|------|-------------|
| 1 | Snake case only | ALL names must be snake_case (except constants, classes, shapes, types, keywords) |
| 2 | No new keywords | Check existing datasets, code, and get owner approval before adding |
| 3 | No editing active files | Create new file, deprecate old, update references |
| 4 | Candidate until review | All changes are candidates until owner approves |
| 5 | Status lifecycle | draft → candidate → final → deprecated |
| 6 | Version control | v{major}_{minor}_{patch}, no dots |
| 7 | Revision control | v{number}, increment for significant changes |
| 8 | Cross-reference check | Check all references before finalizing |
| 9 | Conflict resolution | Check all datasets, code, docs before naming |
| 10 | Documentation update | Update all docs when conventions change |
| 11 | Documentation format | No tree characters (├──, └──, │), use bullets (*) + tabs |

---

*Version: 10.0.0*
*Status: Final*
*Last Updated: 2026-08-18*
