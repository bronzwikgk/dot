# OHM v10 Layer Routing Handbook

## 1. Scope

This handbook defines how content is routed to correct knowledge layers (Level 0-3) and how layers map to file locations. It is the single reference for all routing decisions in OHM v10.

**Applies to:** All OHM v10 documents, code, data, and artifacts.
**Authority:** Level 0 (Root). All routing decisions must conform to this handbook.

---

## 2. Layer Definitions

### 2.1 Level 0 — Root

| Attribute | Value |
|-----------|-------|
| Purpose | What OHM **IS** |
| Content | Laws, primitives, shapes, naming, glossary |
| Authority | Highest — immutable once final |
| Mutability | Cannot change without breaking all downstream |
| Examples | Root Definition, Naming Convention Handbook, Layer Routing Handbook |

### 2.2 Level 1 — Capabilities

| Attribute | Value |
|-----------|-------|
| Purpose | What OHM **CAN DO** |
| Content | Pipeline stages, artifact types, constraints, rules |
| Authority | High — stable but extendable |
| Mutability | Can add new capabilities; cannot break existing |
| Examples | Pipeline spec, Artifact spec, Constraint rules |

### 2.3 Level 2 — Implementations

| Attribute | Value |
|-----------|-------|
| Purpose | How OHM **DOES IT** |
| Content | Code, grammars, parsers, transforms |
| Authority | Medium — evolves with development |
| Mutability | Can refactor; must conform to Level 1 |
| Examples | Lexer code, Parser code, .ohm grammar files |

### 2.4 Level 3 — Applications

| Attribute | Value |
|-----------|-------|
| Purpose | What OHM **PRODUCES** |
| Content | Datasets, datamaps, datatables, dataindexes, outputs |
| Authority | Low — variable based on use case |
| Mutability | Can create/modify; must conform to Level 2 |
| Examples | dataset_ohm_v10_..., datamap_ohm_v10_... |

---

## 3. File Layer Definitions

### 3.1 File Layer Values

| File Layer | Purpose | Typical Content |
|------------|---------|-----------------|
| `core` | Core engine code | Lexer, parser, executor, primitives |
| `plugins` | Extension modules | Optional add-ons, integrations |
| `utility` | Shared utilities | Helper functions, common code |
| `capabilities` | Capability implementations | Pipeline stages, feature modules |
| `domain` | Domain-specific logic | Business rules, domain models |
| `handbook` | Knowledge references | Handbooks, guides, conventions |
| `docs` | Documentation | Definitions, specs, guides |
| `tests` | Test files | Unit tests, integration tests |
| `logs` | Runtime logs | Execution logs, audit trails |
| `data` | Data artifacts | Datasets, datamaps, datatables |
| `config` | Configuration | Settings, defaults, environment |

### 3.2 File Layer vs Knowledge Level

| Knowledge Level | Primary File Layers | Secondary File Layers |
|-----------------|--------------------|-----------------------|
| Level 0 (Root) | `docs`, `handbook` | — |
| Level 1 (Capabilities) | `docs`, `capabilities` | `handbook` |
| Level 2 (Implementations) | `core`, `plugins`, `utility`, `capabilities`, `domain` | `tests` |
| Level 3 (Applications) | `data`, `logs` | `tests` |

---

## 4. Routing Rules: Content → Layer

### 4.1 Decision Tree

```
START: Read content
  │
  ├─ Does it define WHAT OHM IS?
  │   (laws, primitives, shapes, naming, glossary, scope)
  │   │
  │   YES → Level 0 (Root)
  │   NO  ↓
  │
  ├─ Does it define WHAT OHM CAN DO?
  │   (pipeline, artifacts, constraints, rules, capabilities)
  │   │
  │   YES → Level 1 (Capabilities)
  │   NO  ↓
  │
  ├─ Does it define HOW OHM DOES IT?
  │   (code, grammars, parsers, transforms, algorithms)
  │   │
  │   YES → Level 2 (Implementations)
  │   NO  ↓
  │
  ├─ Does it define WHAT OHM PRODUCES?
  │   (datasets, datamaps, datatables, dataindexes, outputs)
  │   │
  │   YES → Level 3 (Applications)
  │   NO  ↓
  │
  └─ AMBIGUOUS → Ask user:
      "Is this about WHAT, HOW, or OUTPUT?"
```

### 4.2 Content Keywords → Level Mapping

| Keywords Found | Route To |
|----------------|----------|
| law, primitive, shape, naming, glossary, scope, definition | Level 0 |
| pipeline, artifact, constraint, capability, rule, gate | Level 1 |
| code, grammar, parser, lexer, executor, transform, algorithm | Level 2 |
| dataset, datamap, datatable, dataindex, output, result | Level 3 |

### 4.3 Ambiguity Resolution

| Scenario | Resolution |
|----------|------------|
| Content describes both pipeline and code | Split: pipeline → Level 1, code → Level 2 |
| Content describes both laws and pipeline | Laws → Level 0, pipeline → Level 1 |
| Content describes both code and output | Code → Level 2, output → Level 3 |
| Content is unclear | Ask user: "What does this define?" |

---

## 5. Routing Rules: Layer → Content

### 5.1 Level 0 — Root

| MUST contain | MUST NOT contain |
|-------------|-----------------|
| Laws (12 Root Laws) | Code, implementation |
| Primitives (ATOM, PAIR, TUPLE, GROUP) | Pipeline stages |
| Shapes (ARRAY, TABLE, TREE, GRAPH, COLLECTION) | Output artifacts |
| Naming conventions | Behavior rules |
| Glossary | |
| Scope boundary | |
| Architecture decisions | |
| Handbooks (all handbooks are Level 0) | |

### 5.2 Level 1 — Capabilities

| MUST contain | MUST NOT contain |
|-------------|-----------------|
| Pipeline stages (18 steps) | Implementation code |
| Artifact types (dataset, datamap, datatable, dataindex) | Output artifacts |
| Constraint rules | Raw data |
| Validation gates | |
| Capability requirements | |
| Use cases | |

### 5.3 Level 2 — Implementations

| MUST contain | MUST NOT contain |
|-------------|-----------------|
| Code (JS, .ohm) | Output artifacts |
| Grammars | Laws |
| Parsers | Raw data |
| Transforms | |
| Algorithms | |
| Test code | |

### 5.4 Level 3 — Applications

| MUST contain | MUST NOT contain |
|-------------|-----------------|
| Datasets | Implementation code |
| Datamaps | Laws |
| Datatables | Pipeline definitions |
| Dataindexes | |
| Output files | |
| Results | |

---

## 6. Bidirectional Validation

### 6.1 Forward Check (Content → Layer)

```
INPUT:  Content
STEP 1: Apply Section 4.2 keywords
STEP 2: Route to level
STEP 3: Apply Section 5 validation
STEP 4: If validation fails → reject with reason
OUTPUT: Correct level
```

### 6.2 Reverse Check (Layer → Content)

```
INPUT:  Level
STEP 1: Apply Section 5 rules
STEP 2: Check content matches level
STEP 3: If mismatch → reject with reason
OUTPUT: Valid content for level
```

### 6.3 Validation Rules

| Rule ID | Rule | Fail Action |
|---------|------|-------------|
| VR-1 | Level 0 must not contain code | Reject, move to Level 2 |
| VR-2 | Level 1 must not contain output artifacts | Reject, move to Level 3 |
| VR-3 | Level 2 must not contain laws | Reject, move to Level 0 |
| VR-4 | Level 3 must not contain pipeline definitions | Reject, move to Level 1 |
| VR-5 | All handbooks are Level 0 | Reject if placed elsewhere |
| VR-6 | All tests are cross-cutting (any level) | Allow in any level |
| VR-7 | Output must include knowledge_level header | Reject if missing |

---

## 7. Agent Instructions

### 7.1 Step-by-Step Process

```
STEP 1: READ content completely
STEP 2: IDENTIFY content type using Section 4.2 keywords
STEP 3: APPLY decision tree (Section 4.1)
STEP 4: IF ambiguous → ASK user (see 7.2)
STEP 5: VALIDATE against Section 5 rules
STEP 6: IF validation fails → REJECT with reason
STEP 7: ROUTE to correct file layer (Section 3.2)
STEP 8: ADD knowledge_level header to document
STEP 9: LOG routing decision
```

### 7.2 User Prompt for Ambiguity

```
"I found content that could belong to multiple levels:

Level X: [reason]
Level Y: [reason]

Which level should this content belong to?

Option 1: Level X — [description]
Option 2: Level Y — [description]
Option 3: Split — Part A to Level X, Part B to Level Y"
```

### 7.3 Agent Decision Flowchart

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT ROUTING                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. READ content                                        │
│     ↓                                                   │
│  2. KEYWORD scan                                        │
│     ↓                                                   │
│  3. DECISION TREE (Section 4.1)                         │
│     ↓                                                   │
│  4. AMBIGUOUS? ──YES──→ ASK USER (Section 7.2)         │
│     │                                                   │
│     NO                                                  │
│     ↓                                                   │
│  5. VALIDATE (Section 6)                                │
│     ↓                                                   │
│  6. VALID? ──NO──→ REJECT with reason                   │
│     │                                                   │
│     YES                                                 │
│     ↓                                                   │
│  7. ROUTE to file layer                                 │
│     ↓                                                   │
│  8. ADD knowledge_level header                          │
│     ↓                                                   │
│  9. LOG decision                                        │
│     ↓                                                   │
│  DONE                                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Examples

### Example 1: Root Law

**Content:** "OHM must be deterministic — same input always produces same output."

| Step | Result |
|------|--------|
| Keywords | law, deterministic |
| Route to | Level 0 |
| File layer | docs |
| Header | knowledge_level: 0 |
| File | `docs_ohm_v10_0_0_root_definition_v1_draft_doc.md` |

### Example 2: Pipeline Stage

**Content:** "The tokenizer splits input into symbolic tokens using whitespace and punctuation."

| Step | Result |
|------|--------|
| Keywords | tokenizer, pipeline, splits |
| Route to | Level 1 |
| File layer | docs/capabilities |
| Header | knowledge_level: 1 |
| File | `docs_ohm_v10_0_0_pipeline_v1_draft_doc.md` |

### Example 3: Lexer Code

**Content:** "function tokenize(input) { return input.split(/\s+/); }"

| Step | Result |
|------|--------|
| Keywords | function, code |
| Route to | Level 2 |
| File layer | core |
| Header | knowledge_level: 2 |
| File | `core_ohm_v10_0_0_lexer_v1_draft_code.js` |

### Example 4: Dataset

**Content:** "VALID_VERBS = ['load', 'extract', 'calculate', 'detect', 'validate']"

| Step | Result |
|------|--------|
| Keywords | dataset, VALID_VERBS |
| Route to | Level 3 |
| File layer | data/datasets |
| Header | knowledge_level: 3 |
| File | `data_ohm_v10_0_0_valid_verbs_v1_draft_data_array.js` |

### Example 5: Naming Convention

**Content:** "All file names must follow: {layer}_{module}_{release}_{component}_{revision}_{stage}_{format}.{ext}"

| Step | Result |
|------|--------|
| Keywords | naming, convention, file name |
| Route to | Level 0 |
| File layer | handbook |
| Header | knowledge_level: 0 |
| File | `handbook_ohm_v10_0_0_naming_convention_v1_final_doc.md` |

### Example 6: Constraint Rule

**Content:** "OHM must not use external libraries — all functionality must be implemented natively."

| Step | Result |
|------|--------|
| Keywords | constraint, rule, external libraries |
| Route to | Level 1 |
| File layer | docs |
| Header | knowledge_level: 1 |
| File | `docs_ohm_v10_0_0_constraints_v1_draft_doc.md` |

### Example 7: Grammar File

**Content:** "rule sentence: when: [NP, VP] then: build_expression(NP, VP)"

| Step | Result |
|------|--------|
| Keywords | rule, grammar, .ohm |
| Route to | Level 2 |
| File layer | core |
| Header | knowledge_level: 2 |
| File | `core_ohm_v10_0_0_grammar_v1_draft_ohm.ohm` |

### Example 8: Datamap

**Content:** '{"synonym": "create", "maps_to": "generate", "context": "code"}'

| Step | Result |
|------|--------|
| Keywords | datamap, synonym, JSONL |
| Route to | Level 3 |
| File layer | data/datamaps |
| Header | knowledge_level: 3 |
| File | `data_ohm_v10_0_0_synonym_map_v1_draft_data_collection.jsonl` |

### Example 9: Test File

**Content:** "test_lexer_tokenizes_whitespace: assert_equals(tokenize('a b'), ['a', 'b'])"

| Step | Result |
|------|--------|
| Keywords | test, assert |
| Route to | Level 2 (cross-cutting) |
| File layer | tests |
| Header | knowledge_level: 2 |
| File | `test_ohm_v10_0_0_lexer_v1_draft_test.js` |

### Example 10: Glossary Term

**Content:** "ATOM: The smallest indivisible unit in OHM. Contains a single value."

| Step | Result |
|------|--------|
| Keywords | glossary, ATOM, definition |
| Route to | Level 0 |
| File layer | docs |
| Header | knowledge_level: 0 |
| File | `docs_ohm_v10_0_0_root_definition_v1_draft_doc.md` |

### Example 11: Datatable

**Content:** "condition,action,validation; if_atom,keep,pass; if_pair,split,pass; if_invalid,reject,fail"

| Step | Result |
|------|--------|
| Keywords | datatable, decision table, CSV |
| Route to | Level 3 |
| File layer | data/datatables |
| Header | knowledge_level: 3 |
| File | `data_ohm_v10_0_0_validation_gates_v1_draft_data_table.csv` |

### Example 12: Handbooks (All Levels)

**Content:** Any handbook content (naming, routing, conventions, guides)

| Step | Result |
|------|--------|
| Keywords | handbook, guide, convention |
| Route to | Level 0 (ALL handbooks) |
| File layer | handbook or docs |
| Header | knowledge_level: 0 |
| File | `handbook_ohm_v10_0_0_*_v1_draft_doc.md` |

---

## 9. Anti-Patterns

### 9.1 Wrong Layer Placement

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Code in Level 0 | Root is immutable; code evolves | Move to Level 2 |
| Laws in Level 1 | Capabilities depend on laws, not vice versa | Move to Level 0 |
| Output in Level 2 | Implementation produces output, doesn't define it | Move to Level 3 |
| Behavior in Level 3 | Applications don't define capabilities | Move to Level 1 |

### 9.2 Missing Headers

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| No knowledge_level header | Agent cannot determine authority | Add header |
| Wrong knowledge_level | Content has wrong authority | Correct level |
| Missing file_layer | File cannot be routed | Add file_layer |

### 9.3 Mixed Content

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Laws + code in same file | Immutable + evolving conflict | Split into Level 0 and Level 2 |
| Pipeline + output in same file | Definition + result conflict | Split into Level 1 and Level 3 |
| Handbooks + code in same file | Reference + implementation conflict | Split into Level 0 and Level 2 |

### 9.4 Naming Violations

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Wrong file layer in name | File routes to wrong folder | Rename file |
| Missing revision | Cannot track changes | Add revision v{number} |
| Wrong stage | File deploys prematurely | Correct stage |

---

## Appendix A: Quick Reference Card

```
CONTENT TYPE → LEVEL → FILE LAYER → HEADER

Law, Primitive, Shape    → Level 0 → docs, handbook     → knowledge_level: 0
Pipeline, Artifact       → Level 1 → docs, capabilities → knowledge_level: 1
Code, Grammar, Parser    → Level 2 → core, plugins      → knowledge_level: 2
Dataset, Datamap, Output → Level 3 → data, logs         → knowledge_level: 3
Test (any level)         → Level N → tests              → knowledge_level: N
```

---

## Appendix B: Validation Checklist

```
□ Content has been read completely
□ Keywords identified
□ Decision tree applied
□ Level determined
□ File layer determined
□ knowledge_level header added
□ File name follows naming convention
□ Content matches level rules (Section 5)
□ No anti-patterns present (Section 9)
□ Routing decision logged
```

---

**End of Layer Routing Handbook**