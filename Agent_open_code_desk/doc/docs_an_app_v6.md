# an app v6 — Project Definition

---

## 1. What an app Is

A unified, entity-based platform where everything — code, documents, workflows, automations, and AI agents — flows through a single universal pipeline. Users interact with the system through natural language English. The system translates that English into executable graphs (ASTs/DAGs) without requiring users to write code.

---

## 2. What an app Does

### 2.1 Natural Language Programming

Users write English sentences or definition documents. The system:

1. Tokenizes input into atomic words
2. Tags each token with its part of speech (noun, verb, adjective, etc.)
3. Matches POS patterns to expression templates
4. Resolves context (pronouns, scope, references) using a session graph
5. Identifies entity types from a hierarchical taxonomy
6. Composes an executable AST (procedural) or DAG (data pipeline)
7. Executes the graph against registered plugins and utilities
8. Decomposes the result back into plain English for confirmation

### 2.2 Universal Pipeline

Every entity type — whether code file, document block, workflow node, database record, or AI agent task — flows through the same 13-stage pipeline:

| Stage | Name | Input | Output | Description |
|-------|------|-------|--------|-------------|
| 1 | Decompose | External data | `entity[]` | Break raw input into atomic entities |
| 2 | Validate | `entity[]` | `{ entities, diagnostics }` | Gatekeeper validation |
| 3 | Parse | `entity[]` | `entity[]` | Build hierarchical tree |
| 4 | Transform | `entity[]` | `entity[]` | Normalize and apply defaults |
| 5 | Reason | `entity[]` | `{ entities, diagnostics }` | Apply semantic logic |
| 6 | Resolve | `entity[]` | `{ entities, refs }` | Link references to targets |
| 7 | Index | `entity[]` | `index` | Build searchable index |
| 8 | Compose | `entity[]` | `composed` | Assemble final output |
| 9 | Execute | `composed` | `result` | Run code or workflows |
| 10 | Format | `composed \| result` | `serialized` | Convert to export format |
| 11 | Display | `composed \| result` | `display_output` | Render to visual surface |
| 12 | Persist | `entity[] \| composed` | `void` | Save to storage |
| 13 | Respond | `entity[]` | `trigger` | Detect changes and feedback |

Each stage is a pure function. Phases can be skipped but not reordered. Every stage has a post-step linter that halts the pipeline on critical errors.

### 2.3 Dual-Mode Documents

A single document can simultaneously teach the system new definitions (training) and trigger automations (execution). The system splits content using:

| Method | How It Works |
|--------|-------------|
| Explicit markers | `--- SYSTEM: TRAINING ---` and `--- SYSTEM: EXECUTION ---` headers |
| Inline tags | `[TRAIN]` and `[EXEC]` at the start of paragraphs |
| Implicit detection | Verb tense analysis: generic nouns + present tense = training; imperative verbs + specific instances = execution |
| User confirmation | Decomposer echoes back what it understood and asks for clarification on ambiguous blocks |

Training blocks update the type registry, phrase mappings, and rule engine. Execution blocks compile into AST/DAG nodes and are scheduled or run immediately.

### 2.4 Self-Validating Registry

All definitions live in a centralized registry. E2E tests are automatically generated from registry entries. Any change to entities, components, templates, intents, or operations triggers automatic test generation.

---

## 3. Core Objectives

| Objective | Description |
|-----------|-------------|
| One pipeline, many uses | Every entity type processed by the same 13-stage architecture |
| Generic entity model | All entities share the same base structure; behavior determined by traits, not type |
| Deterministic processing | Same input always produces same output — no probabilistic guessing |
| Zero external dependencies | Pure implementation — no npm packages, no Python libraries, no imported NLP tools |
| Grammar over vocabulary | Intent determined by sentence structure (POS patterns), not word meaning |
| Rules as data | Every rule, pattern, transformation stored as data in dataset files |
| Local-first | Data stays under user control; cloud sync is optional |
| Extensible by design | New entity types, traits, operations added without changing core |
| Self-documenting | Every definition document is both code and documentation |
| Continuous improvement | System discovers patterns organically from user interactions |

---

## 4. Architecture

### 4.1 Foundational Philosophy

```
Words are atoms → Pairings are relationships → Arrays are structures
→ Structures compose into contexts → Contexts recursively transform into new structures
```

### 4.2 The Two-Layer Natural Language Engine

| Layer | Engine | Responsibility | Output |
|-------|--------|---------------|--------|
| Layer 1 | Syntactic Compiler | Translates current sentence into raw symbolic expression | `[COMMAND, CREATE, FILE, ?]` (target missing) |
| Layer 2 | Discourse Resolver | Fills missing slots from conversation history | `[COMMAND, CREATE, FILE, "notes.txt"]` |

The Syntactic Compiler never looks at context. The Discourse Resolver never parses grammar. They feed into each other.

### 4.3 Knowledge Layers

| Level | Purpose | Authority | Mutability |
|-------|---------|-----------|-----------|
| Level 0 (Root) | What the system IS | Highest — immutable | Cannot change without breaking all downstream |
| Level 1 (Capabilities) | What the system CAN DO | High — stable | Can add; cannot break existing |
| Level 2 (Implementations) | How the system DOES IT | Medium — evolving | Can refactor; must conform to Level 1 |
| Level 3 (Applications) | What the system PRODUCES | Low — variable | Can create/modify; must conform to Level 2 |

**Authority chain:** Level 0 → constrains → Level 1 → constrains → Level 2 → produces → Level 3

### 4.4 Context Stack

Active scopes form a LIFO stack:

```
Session Context (persists across conversations)
    ├── Document Context (loaded from definition documents)
    │   ├── Entity Definitions (types)
    │   ├── Intent Mappings (phrases)
    │   └── Contracts (rules)
    │
    ├── Conversation Context (current session)
    │   ├── Active Scope (e.g., "inside the cart")
    │   ├── Variables (e.g., order_id = #123)
    │   └── History (last 5 commands)
    │
    └── Execution Context (runtime)
        ├── Pipeline State (completed steps)
        ├── Error Logs
        └── Temporary Variables
```

Scope resolution: "Inside the cart" pushes a scope. "Back to main" pops it. Variables in inner scopes hide variables in outer scopes.

### 4.5 Data Primitives

Four primitives only — minimum viable set:

| Primitive | Structure | Purpose | Example |
|-----------|-----------|---------|---------|
| ATOM | `[name, value]` | Single named value | `["token", "create"]` |
| PAIR | `[key, value]` | Two linked values | `["entity_1", "FILE_123"]` |
| TUPLE | `[item_1, item_2, ...]` | Ordered sequence | `[COMMAND, CREATE, TARGET, PROJECT]` |
| GROUP | `[GROUP, name, [tuples...]]` | Named collection | `[GROUP, "scope_001", [...]]` |

### 4.6 Data Shapes

Shape is independent of file extension. Parser detects shape by reading content structure.

| Shape | Structure | Detection | Example Extensions |
|-------|-----------|-----------|-------------------|
| ARRAY | One value per line | No separators, no headers | `.js`, `.yml`, `.txt`, `.md`, `.json` |
| TABLE | Header row + separator + data rows | First line contains `|` or `,` or `\t` | `.csv`, `.ohm`, `.yml`, `.json` |
| TREE | Indentation defines hierarchy | Lines with increasing indentation | `.yml`, `.md`, `.txt`, `.json` |
| GRAPH | Subject TAB predicate TAB object | Tab-separated triples | `.ohm`, `.txt`, `.tsv`, `.jsonl` |
| COLLECTION | `[section_name]` headers | Lines starting with `[section]` | `.md`, `.txt`, `.ohm`, `.yml` |

### 4.7 Semantic Types

16 types that the system recognizes:

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

## 5. Root Laws

Every capability must obey these. No exceptions.

| Law | Rule | Rationale |
|-----|------|-----------|
| 1. Primitive-Only Data | All data structures built from ATOM, PAIR, TUPLE, GROUP only | Minimum viable set; more primitives mean more complexity |
| 2. Zero External Dependencies | No npm packages, Python libraries, or imported NLP tools at runtime | Full control over runtime, memory, and logic |
| 3. Deterministic Processing | Same input + same context = same output every time | Predictability over coverage; unmatched patterns get clarification requests |
| 4. Two-Layer Architecture | Syntactic Compiler for grammar, Discourse Resolver for context — never mixed | Separation makes both testable and debuggable |
| 5. Pipeline Is Phased | Processing flows through named phases in strict order | Each phase is a pure function; phases can be skipped but not reordered |
| 6. Grammar Over Vocabulary | Intent determined by sentence structure, not word meaning | Works on any words including invented ones |
| 7. Context Is a Stack | Active scopes form a LIFO stack | Matches natural language nested scopes exactly |
| 8. Rules Are Data | All rules stored in dataset files, never hard-coded | Can be imported, exported, versioned, linted, shared |
| 9. Lint Before Execute | Every pipeline phase has a post-step linter | Catch errors at phase boundary before cascading failures |
| 10. Testable at Every Layer | Every primitive, phase, rule, and strategy has dedicated tests | Test suite is the regression gate |
| 11. Flexible Extensions | Engine files use `.ohm`; app data files use any fitting extension | Adapt to whatever file the user provides |
| 12. Shape Independent of Extension | Parser detects shape by content structure, not by extension | Teams use whatever format fits their workflow |

---

## 6. Generic Entity Model

Every entity in the system has the same base structure:

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `id` | `string` | Unique identifier | Required, uuid v4 |
| `type` | `string` | Entity classification | Required, extensible |
| `data` | `any` | Payload | Required |
| `attributes` | `map` | Extensible key-value store | Required |
| `traits` | `string[]` | Behavior markers | Optional, default `[]` |
| `links` | `link[]` | Relationships to other entities | Optional, default `[]` |
| `state` | `state` | Pipeline progression flags | Required |
| `diagnostics` | `diagnostic[]` | Errors, warnings, hints | Optional, default `[]` |
| `version` | `string` | Entity version | Required, default `1.0.0` |
| `created_at` | `number` | Creation timestamp | Required |
| `updated_at` | `number` | Last update timestamp | Required |

**Entity types supported:**

| Entity Type | Sub-types | Description |
|-------------|-----------|-------------|
| Code | File, Symbol | Programming code with language detection |
| Document | Block, Component | Block-based content (headings, paragraphs, lists, code, tables) |
| Database | View, Relationship | Schema-defined data with multiple views |
| Workflow | Trigger, Action, Condition, Loop, Subworkflow | Visual automation flows |
| Agent | Task, Memory, Tool, Artifact | AI orchestration with memory and tools |
| Template | Pre-built Blueprint | Reusable structure for instantiation |
| Layout | Spatial Arrangement | How components position on screen |
| Configuration | Settings, Defaults | System and user preferences |

---

## 7. Features

### 7.1 Core System

| Feature | Description |
|---------|-------------|
| Universal entity model | All entities share the same base structure |
| 13-stage pipeline | Universal processing pipeline for all entities |
| Generic operations | Create, append, insert, transform, resolve, execute, display |
| Trait-based behavior | Behavior determined by traits, not by type |
| Link-based relationships | Entities can link to any other entity |
| Diagnostic capture | Errors, warnings, hints captured at every stage |
| State tracking | Pipeline progress tracked for every entity |
| Extensible type system | New types added without changing core |
| Extensible trait system | New traits added without changing core |
| Local-first storage | Data stored locally by default |
| Full-text search | Search across all entities |
| Command palette | Unified command interface |
| Auto-save | Every 5 seconds with crash recovery |

### 7.2 Natural Language Engine

| Feature | Description |
|---------|-------------|
| POS tagging | Part-of-speech labels on all tokens |
| Pattern matching | POS patterns map to expression templates |
| Context resolution | Pronoun substitution, scope management, temporal context |
| Type identification | Map nouns to system types via hierarchical taxonomy |
| AST/DAG composition | Procedural flows become ASTs; data pipelines become DAGs |
| Decomposition | Reverse-walk graphs to generate plain English confirmation |
| Dual-mode documents | Training blocks teach the system; execution blocks trigger automation |
| Plugin system | Behavioral schemas written in English, registered dynamically |

### 7.3 Code Editing

| Feature | Description |
|---------|-------------|
| Syntax highlighting | 20+ programming languages |
| Autocomplete | Intelligent code completion |
| Diagnostics | Errors, warnings, hints inline |
| Symbol resolution | Go to definition, find references |
| Code formatting | Automatic formatting |
| Multiple cursors | Edit multiple positions simultaneously |
| Code folding | Collapse/expand code blocks |
| Line numbers | Display line numbers |

### 7.4 Document Engine

| Feature | Description |
|---------|-------------|
| Block-based editing | Structured document blocks |
| Block types | Heading, paragraph, list, callout, code, table, image, embed |
| Slash commands | `/` to insert blocks |
| Mentions | `@` to link entities |
| Nested blocks | Blocks within blocks |
| Database support | Configurable property types with multiple views |
| Relations | Cross-database relationships with rollups |
| Version history | Track document changes |
| Full-text search | Search within documents |

### 7.5 Automation Engine

| Feature | Description |
|---------|-------------|
| Visual workflow builder | Drag-and-drop node-based programming |
| Node types | Trigger, action, condition, loop, subworkflow, parallel, merge, timeout |
| Triggers | Schedule, webhook, file change, database change, manual |
| Actions | HTTP request, database query, file I/O, send email, send notification |
| Conditionals | If/else, for/while loops, try/catch error handling |
| Parallel execution | Run independent branches simultaneously |
| Subworkflows | Nest workflows within workflows |
| Execution logs | Detailed error traces and history |

### 7.6 AI Agent Engine

| Feature | Description |
|---------|-------------|
| Agent orchestration | Orchestrator decomposes complex tasks into subtasks |
| Parallel subagents | Multiple agents working simultaneously |
| Agent memory | Short-term, long-term, project memory |
| Tool calling | Terminal, file system, browser, API, database |
| Artifacts | Plans, code diffs, screenshots, walkthroughs |
| Approval workflows | Human-in-the-loop review |
| Streaming output | Real-time thought process display |
| Agent handoff | Transfer between agents |
| Custom system prompts | Define agent behavior per agent |
| Multiple LLM providers | Fallback support |

### 7.7 Integration

| Feature | Description |
|---------|-------------|
| Code in documents | Execute code blocks from documents |
| Workflow triggers from documents | Click to run workflows |
| Agent access to documents | Agents read and write documents |
| Agent access to code | Agents read and write code |
| Database-driven workflows | Database changes trigger automations |
| Unified search | Search all entity types from one search bar |
| Entity linking | Link any entity to any other entity |

### 7.8 UI

| Feature | Description |
|---------|-------------|
| Tabbed interface | Multiple content views with tabs |
| Split pane | Side-by-side and top/bottom splits |
| Sidebar navigation | File tree, database list, workflow list, agent list |
| Command palette | Global search and actions (Ctrl+P) |
| Keyboard shortcuts | Customizable for all operations |
| Dark and light themes | Visual theme support |
| Resizable panels | User-adjustable panel sizes |
| Contextual menus | Right-click menus depending on entity type |
| Status bar | File info, line count, cursor position, notifications |
| Activity bar | Switching between views |

---

## 8. Entity Types and Operations

### 8.1 Complete Entity Taxonomy

| Entity | Sub-types | Primary Component | Typical Intent |
|--------|-----------|------------------|----------------|
| Workspace | Personal, Team, Project | — | Organize |
| Page | Dashboard, Document, Whiteboard, Notebook | Document Page | Create, Edit |
| Block | Text, Image, Code, Table, List, Embed | Various editors | Edit |
| Node | Trigger, Action, Filter, Router, AI | Flowchart Plane | Automate |
| Edge | Data Flow, Control Flow, Dependency | Flowchart Plane | Connect |
| Cell | Code, Markdown, Raw Data, Output | Notebook Grid | Analyze |
| File | Script, Data, Image, PDF | Code Editor | Create, Edit |
| Data Source | Database, API, Webhook, Local File | Table View | Query |
| Data Sink | Dashboard, Report, Webhook, Database | Chart View | Display |
| User | Admin, Editor, Viewer, Guest | Settings Panel | Configure |
| Credential | API Key, OAuth Token, Basic Auth | Settings Panel | Configure |
| Variable | Environment, Global, Local, Secret | Settings Panel | Configure |
| Comment | Inline, Threaded, Suggestion | Modal Overlay | Collaborate |
| Version | Snapshot, Branch, Tag | Sidebar | Explore |
| Template | Pre-built Blueprint | Card View | Browse |
| Layout | Spatial Arrangement | Canvas | Configure |
| Configuration | Settings, Defaults | Settings Panel | Configure |

### 8.2 Operations

| Category | Operation | Input | Output |
|----------|-----------|-------|--------|
| CRUD | Create Entity | Type, Attributes, Parent ID | Entity ID |
| CRUD | Read Entity | ID, Projection | Entity Object |
| CRUD | Update Entity | ID, Attributes | Updated Entity |
| CRUD | Delete Entity | ID, Cascade optional | Success/Failure |
| CRUD | List Entities | Type, Filter, Sort, Pagination | Entity List |
| CRUD | Query Entities | Condition | Entity List |
| CRUD | Append Child | Parent ID, Child Entity | Child ID |
| CRUD | Insert at Position | Parent ID, Child Entity, Index | Child ID |
| Workflow | Execute Node | Node ID, Input Data | Output Data |
| Workflow | Execute Workflow | Workflow ID, Input Params | Execution ID |
| Workflow | Pause Workflow | Workflow ID | Status |
| Workflow | Resume Workflow | Workflow ID | Status |
| Workflow | Cancel Execution | Execution ID | Status |
| Notebook | Run Cell | Cell ID, Kernel | Output Object |
| Notebook | Run All Cells | Notebook ID | Batch Output |
| Notebook | Restart Kernel | Notebook ID | Status |
| Notebook | Insert Cell | Position, Type | Cell ID |
| Code | Format Code | Source Code, Language | Formatted Code |
| Code | Lint Code | Source Code, Language | Lint Issues List |
| Code | Autocomplete | Partial Code, Position | Suggestions List |
| Code | Refactor | Code, Operation Type | Refactored Code |
| Data | Query | Connection ID, Query String | Result Set |
| Data | Transform | Data, Transformation Spec | Transformed Data |
| Data | Merge | Left Data, Right Data, Join Keys | Merged Data |
| Data | Validate | Data, Schema | Validation Result |
| AI | Generate Text | Prompt, Model, Params | Generated Text |
| AI | Embed Text | Text, Model | Vector Embedding |
| AI | Chat | Messages, Model, Stream | Streaming Response |
| AI | Summarize | Text, Max Length | Summary |
| AI | Classify | Text, Labels, Model | Classification Result |
| Collaboration | Add Comment | Entity ID, Text, Reply To | Comment ID |
| Collaboration | Resolve Comment | Comment ID | Status |
| Collaboration | Invite User | Email, Role, Workspace ID | Invitation ID |
| Version Control | Commit | Entity ID, Message | Commit ID |
| Version Control | Revert | Entity ID, Commit ID | Reverted Entity |
| Version Control | Diff | Commit ID A, Commit ID B | Diff Object |
| Integration | Send Webhook | URL, Payload, Headers | Response |
| Integration | Call API | Connection ID, Endpoint, Method, Body | API Response |
| Integration | Sync | Source ID, Target ID, Direction | Sync Report |
| System | Authenticate | Credentials | Session Token |
| System | Authorize | User ID, Resource, Action | Boolean |
| System | Log | Level, Message, Context | Log ID |
| System | Notify | User ID, Message, Type | Notification ID |
| System | Schedule | Operation Spec, Cron Expression | Schedule ID |

---

## 9. Natural Language Operators

| Operator | Written Form | System Interpretation | DAG Shape |
|----------|-------------|----------------------|-----------|
| AND | `&&` or `and` | Parallel execution | Split into 2+ parallel branches |
| OR | `\|\|` or `or` | Conditional branch | Decision node with fallback path |
| XOR | `xor` or `either...or...` | Exclusive branch | Decision node with single path |
| THEN | `then`, `and then`, `after that` | Sequential chaining | Linear dependency (output → input) |
| IF/ELSE | `if...then...otherwise...` | Conditional logic | Branch node with true/false paths |
| WAIT | `wait for`, `await` | Dependency pause | Node that blocks until dependency completes |

**Example interpretation:**

User writes: "Fetch user data && send welcome email. Then if the email fails, retry twice."

System builds:
```
DAG Root
    ├── Parallel Node (&&)
    │   ├── FetchUserData (Node A)
    │   └── SendWelcomeEmail (Node B)
    │
    └── Conditional Node (then)
        ├── Dependency: Wait for Node A & Node B
        ├── Condition: Node B.status == "failed"
        │   ├── True Path: RetryNode (2 retries)
        │   └── False Path: (Do nothing)
        └── Output: Success/Failure report
```

---

## 10. UI Components

### 10.1 Component Categories

| Category | Components |
|----------|-----------|
| Canvas | Infinite Board, Notebook Grid, Document Page, Flowchart Plane |
| Editors | Rich Text Editor, Markdown Editor, Code Editor, Formula Builder, JSON/YAML Editor |
| Data Displays | Table View, Gallery View, Chart View, Kanban Board, Calendar View |
| Input Controls | Text Input, Select Dropdown, Toggle Switch, Date/Time Picker, File Uploader |
| Workflow Controls | Trigger Selector, Action Picker, Condition Builder, Loop Constructor, Error Handler |
| AI Components | Prompt Input, Context Selector, Response Renderer |
| Navigation | Sidebar, Breadcrumbs, Command Palette, Tabs |
| Modals/Dialogs | Settings Panel, Share Dialog, Export Dialog, Confirmation Modal |

### 10.2 Layout Types

| Layout | Description |
|--------|-------------|
| Full Canvas | One main component occupying the entire viewport |
| Split Pane | Two panels side-by-side (horizontal or vertical) |
| Grid | Multiple equal-sized panels (2x2, 3x3) |
| Golden Ratio | Main content + sidebar |
| Dashboard Grid | Resizable, draggable tiles |
| Sidebar (Left/Right) | Navigation tree or properties panel |
| Bottom Panel | Terminal output or debug console |
| Modal Overlay | Centered settings, forms, wizards |
| Full Screen | Presentation mode with hidden UI |
| Focus Mode | Distraction-free writing/coding |
| User-Defined | Save and switch between custom arrangements |

---

## 11. Templates

| Category | Template | Description |
|----------|----------|-------------|
| Data Pipelines | ETL Template | Extract → Transform → Load with error handling |
| Data Pipelines | Web Scraper → Database | Scrape website and push to database |
| Data Pipelines | API Aggregator | Combine multiple REST APIs into one output |
| Automation | Email Trigger → Slack | Send notification on new email |
| Automation | Form Submission → Database | Store webhook data into storage |
| Automation | Scheduled Report Generator | Periodic CSV export via email |
| Notebooks | Data Analysis Starter | Import CSV, clean, describe, plot |
| Notebooks | ML Model Trainer | Train a classifier |
| Notebooks | Financial Forecast | Time-series prediction |
| Documents | Meeting Notes Template | Agenda, decisions, action items |
| Documents | Project Proposal | Title, abstract, budget, timeline |
| Dashboards | Sales KPI Dashboard | Revenue, conversions, retention |
| Dashboards | System Health Monitor | Uptime, latency, error rate |
| Whiteboards | Mind Map Starter | Central idea with branching subtopics |
| Whiteboards | User Journey Map | Stages, touchpoints, emotions |
| Code Projects | Web App Scaffold | Framework with routing and static files |
| Code Projects | Data Science Project | Folder structure with data, notebooks, src |
| AI Agents | Chatbot with RAG | Retrieval-Augmented Generation pipeline |
| AI Agents | Document Q&A | Upload document → Query with LLM |
| AI Agents | Content Summarizer | Long text → concise bullet points |

---

## 12. Conventions

### 12.1 Naming

All names use `lowercase_snake_case`. No camelCase, no PascalCase.

| Type | Convention | Example |
|------|------------|---------|
| Variables | `lowercase_snake_case` | `data_source`, `feature_vector` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_DEPTH`, `DEFAULT_MULTIPLIER` |
| Functions | `lowercase_snake_case` (verb first) | `load_data`, `extract_features` |
| Parameters | `lowercase_snake_case` | `file_path`, `window_size` |
| Classes | `PascalCase` | `Entity`, `FeatureExtractor` |
| Data Shapes | `UPPERCASE` | `ARRAY`, `TABLE`, `TREE`, `GRAPH` |
| Semantic Types | `UPPERCASE` | `ENTITY`, `RELATION`, `ATTRIBUTE` |
| Keywords | `lowercase` | `atom`, `task`, `if`, `else` |
| Modules | `lowercase` | `ohm`, `umip`, `miner`, `shared` |
| Pipelines | `lowercase_snake_case` | `data_ingestion`, `feature_extraction` |
| Rules | `lowercase_snake_case` | `detect_pivot_high`, `validate_expression` |
| Tests | `test_{component}_{scenario}` | `test_hello`, `test_atoms` |

### 12.2 File Naming

```
{layer}_{module}_{release}_{component}_{revision}_{stage}_{format}.{ext}
```

| # | Segment | Question | Values |
|---|---------|----------|--------|
| 1 | layer | WHERE in codebase? | `core`, `plugins`, `utility`, `capabilities`, `domain`, `handbook`, `docs`, `tests`, `logs`, `data`, `config` |
| 2 | module | WHICH project? | `ohm`, `umip`, `miner`, `shared` |
| 3 | release | WHICH version? | `v10_0_0`, `v1_0_0` |
| 4 | component | WHICH file? | `lowercase_snake_case` |
| 5 | revision | WHICH revision? | `v1`, `v2`, `v3` |
| 6 | stage | WHAT status? | `draft`, `candidate`, `final`, `deprecated` |
| 7 | format | WHAT kind? | `code`, `ohm`, `data_array`, `data_table`, `data_tree`, `data_graph`, `data_collection`, `test`, `doc`, `config` |

**Each token is a machine-readable queryable field:**

| Token | Machine Role | Query Example |
|-------|-------------|---------------|
| `layer` | Router — routes to correct folder and engine module | "Show me all files in `core`" |
| `module` | Project identifier — filters by project | "Give me all files for project `umip`" |
| `release` | Version selector — picks the right version | "Load only `v10_0_0` files" |
| `component` | Lookup key — system references by name | "Find the `lexer` component" |
| `revision` | Cache control — knows when to reload | "Is this the latest revision?" |
| `stage` | Access gate — only loads `final` into production | "Show me only `final` files" |
| `format` | Parser selector — routes to correct reader | "Load all `data_table` files" |
| `ext` | Handler — invokes the right I/O routine | "Read all `.csv` files" |

### 12.3 File Status Lifecycle

```
draft → candidate → final → deprecated
  ↑         │
  └─────────┘ (if revised, goes back to draft)
```

| Status | Meaning | Can Edit | Can Deploy |
|--------|---------|----------|-----------|
| `draft` | Work in progress | Yes | No |
| `candidate` | Awaiting owner review | No | No |
| `final` | Approved, tested | No | Yes |
| `deprecated` | No longer maintained | No | No |

### 12.4 Version Control

| Change Type | Version Change | Example |
|-------------|----------------|---------|
| Breaking change | Major | `v10_0_0` → `v11_0_0` |
| New feature | Minor | `v10_0_0` → `v10_1_0` |
| Bug fix | Patch | `v10_0_0` → `v10_0_1` |

### 12.5 Strict Rules

| # | Rule | Description |
|---|------|-------------|
| 1 | Snake case only | ALL names must be `snake_case` (except constants, classes, shapes, types, keywords) |
| 2 | No new keywords | Check existing datasets, code, and get approval before adding |
| 3 | No editing active files | Create new file, deprecate old, update references |
| 4 | Candidate until review | All changes are candidates until owner approves |
| 5 | Status lifecycle | `draft → candidate → final → deprecated` |
| 6 | Version control | `v{major}_{minor}_{patch}`, no dots |
| 7 | Revision control | `v{number}`, increment for significant changes |
| 8 | Cross-reference check | Check all references before finalizing |
| 9 | Conflict resolution | Check all datasets, code, docs before naming |
| 10 | Documentation update | Update all docs when conventions change |
| 11 | Documentation format | No tree characters (`├──`, `└──`, `│`), use bullets (`*`) and tabs |

### 12.6 Verb Prefixes for Functions

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

### 12.7 Reserved Keywords

| Category | Keywords |
|----------|----------|
| Data | `atom`, `task`, `if`, `else`, `while`, `for`, `each`, `return`, `break`, `continue` |
| Output | `print`, `assert_equals`, `assert_true`, `assert_false` |
| Logic | `true`, `false`, `null` |
| System | `match`, `pattern`, `rule`, `group`, `transform`, `pipeline`, `operation` |

---

## 13. E2E Testing System

### 13.1 Registry-Based Test Generation

All definitions live in a centralized registry. Tests are generated automatically from registry entries.

| Registry | Stores | Count |
|----------|--------|-------|
| Entity Registry | All entity types with schemas and validators | 17+ |
| Component Registry | All UI components with render props and events | 35+ |
| Template Registry | All pre-built blueprints | 25+ |
| Layout Registry | All spatial arrangements | 15+ |
| Intent Registry | All user goals with triggers and success criteria | 25+ |
| Operation Registry | All operations with input/output schemas | 50+ |
| Validation Registry | Cross-entity rules | Dynamic |
| State Registry | Pre-conditions and post-conditions | Dynamic |

### 13.2 Test Types

| Test Type | Generated From | Example |
|-----------|---------------|---------|
| CRUD Tests | Entity + CRUD Operations | Create Document → Update → Delete |
| Workflow Tests | Node + Edge + Execute | Trigger → Action → Filter → Sink |
| UI Tests | Component + Layout + Render | Render Dashboard with 2x2 Grid |
| Integration Tests | Template + All Operations | Instantiate ETL → Run → Export |
| State Transition Tests | Intent + Operation Sequence | Analyze → Run Cell → Visualize |
| Error Tests | Operation + Invalid Input | Execute Workflow with missing Credential |
| Permission Tests | User Role + Operation | Viewer tries to Delete |

### 13.3 Feedback Loop

```
Registry Update → Test Generation → E2E Execution → Report
    ↓                                                ↓
[PASS] → Merge registry update
[FAIL] → Block merge → Alert team → Fix registry or platform
```

- Commit hooks: Registry changes trigger test generation automatically
- Daily cron: Full regression suite runs on production-like environment
- On-demand: Developers can run subset tests during development

---

## 14. Performance Targets

| Metric | Target |
|--------|--------|
| Pipeline latency (small entities) | < 50ms |
| Pipeline latency (large entities > 10MB) | < 2s |
| Autocomplete response time | < 100ms |
| Document open time (1000 blocks) | < 500ms |
| Workflow execution start delay | < 200ms |
| Agent streaming latency (first token) | < 1s |
| Memory usage (idle) | < 100MB |
| Memory usage (large entity > 10MB) | < 500MB |
| Maximum entity data size | 100MB |
| Maximum concurrent entities loaded | 100 |
| Maximum concurrent workflows | 50 |
| Maximum concurrent agents | 20 |
| Maximum database rows per database | 10,000 |
| Maximum blocks per document | 10,000 |
| Autosave frequency | Every 5 seconds |
| Code language support | 20+ |
| Trait support | 23+ |
| Operation support | 100+ |

---

## 15. Security

| Requirement | Description |
|-------------|-------------|
| Local-first | Data never leaves device by default |
| Optional cloud sync | End-to-end encryption when enabled |
| Agent tool sandboxing | Limited file system access for agents |
| Workflow execution sandboxing | Isolated execution environments |
| Audit trail | Every action is logged |
| Version control | Every type definition is versioned |
| Reversibility | Every execution is reversible where possible |
| Permission levels | Read-Only → Read-Write → Execute → Delete → Admin |
| Permission inheritance | Document → Entity → Operation permission chain |

---

## 16. Constraints

| Constraint | Description |
|------------|-------------|
| Deterministic | Same input + same context = same output always |
| No guessing | Unmatched patterns throw Clarification Required error |
| No external dependencies | All functionality implemented natively |
| Grammar over vocabulary | Intent from structure, not word meaning |
| Rules as data | Nothing hard-coded in engine logic |
| Lint before execute | Errors caught at phase boundaries |
| Four primitives only | ATOM, PAIR, TUPLE, GROUP — minimum viable set |
| No tree characters in docs | Use bullets and tabs for hierarchy |

---

## 17. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Performance bottlenecks in generic pipeline | High | Optimize stage contracts; implement caching; async execution |
| Memory leaks with long-running agents | High | Memory limits; garbage collection monitoring; memory tracking |
| Complexity of generic entity system | Medium | Clear documentation; debugging tools; example implementations |
| Security vulnerabilities (agent tool access) | High | Sandboxing; permission controls; audit logs |
| Dependency-free constraint limiting features | Medium | Implement minimal required parsers; reuse browser APIs |
| Cross-engine integration complexity | High | Pipeline as single integration point; unified entity model |

---

## 18. Glossary

| Term | Definition |
|------|-----------|
| Entity | Universal atomic unit that flows through the pipeline |
| Trait | Behavior marker that enables specific operations |
| Link | Relationship between two entities |
| State | Pipeline progression flags on an entity |
| Diagnostic | Error, warning, or hint captured during processing |
| Runner | Universal executor that operates on entities |
| Pipeline | 13-stage processing flow |
| Operation | Generic function that works on any entity |
| Attribute | Extensible key-value store on an entity |
| Context | Execution context shared across operations |
| Storage | Persistence layer for entities |
| Index | Searchable index of entity content |
| Display | Visual rendering of entities |
| ATOM | Smallest indivisible unit; single named value |
| PAIR | Two linked values in a named relationship |
| TUPLE | Ordered sequence of values |
| GROUP | Named collection of tuples sharing context |
| Expression | A tuple representing a translated sentence structure |
| Slot | A `?` placeholder that must be filled by the Discourse Resolver |
| Phase | A named processing step in the pipeline |
| Rule | A pattern-action pair stored as a tuple |
| Pattern | The left-hand side of a rule |
| Action | The right-hand side of a rule |
| Scope | An active context boundary; pushed and popped on a LIFO stack |
| Anaphora | A pronoun or reference that resolves to a previously mentioned entity |
| POS Tag | Part-of-speech label assigned to a token |
| POS Pattern | A sequence of POS tags that maps to an expression template |
| AST | Abstract Syntax Tree for procedural flows |
| DAG | Directed Acyclic Graph for data pipelines and parallel chains |
| Linter | A validator that runs after a phase to catch errors before execution |
| Reasoning Strategy | A deterministic function that extracts knowledge from data shapes |
| Capability | A major functional domain (tokenize, resolve, reason, execute, learn) |
| Shape | Logical structure of data — independent of file extension |
| Extension | File format — determines storage, not structure |

---

**End of Project Definition**
