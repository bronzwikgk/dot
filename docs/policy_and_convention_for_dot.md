# Policy & Convention for dot

## Version 1.0.0

---

## Purpose

This document defines the policies and conventions for the dot project. All agents, humans, and systems must follow these policies when creating, modifying, or validating dot artifacts. Each rule includes validation criteria and a decision tree for handling violations.

---

## 1. Naming Policy

### Purpose
Ensure consistent naming across all files and code.

### Scope
All dataset files, schemas, concepts, code, folders, and files.

### Rules

| # | Rule | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| N1 | snake_case only | All names use snake_case (letters, digits, underscores only) | `grep -rn '[A-Z]' --include="*.js" --include="*.md" --include="*.datatable" --include="*.datamap"` | Error: Rename to snake_case |
| N2 | No duplicates | No duplicate names across all files | `grep -rn "const " --include="*.datatable" | awk -F: '{print $3}' | sort \| uniq -d` | Error: Resolve duplicate names |
| N3 | Singular | Names are singular unless inherently plural | Manual review | Warning: Rename to singular |
| N4 | No abbreviations | No abbreviations that lose meaning | Manual review | Warning: Expand abbreviation |
| N5 | Verb + entity | Operations follow `verb_entity` pattern | Manual review | Warning: Rename to verb_entity |
| N6 | Plural for lists | Arrays returning multiple items use plural | Manual review | Warning: Rename to plural |
| N7 | File naming | `<type>_<name>_<project>_v<version>.<ext>` | `ls -la` and pattern match | Error: Rename file |
| N8 | Folder naming | `<type>_<project>_v<version>` | `ls -la` and pattern match | Error: Rename folder |
| N9 | No generic names | No `README.md`, `CHANGELOG.md` - use project-specific names | Manual review | Error: Rename to project-specific name |
| N10 | Config naming | config + project_name + own_name + version + status + author + extension | Manual review | Error: Rename config file |

### Banned Or Avoidable Active Names

These names must not be introduced as active product, code, dataset, operation,
entity, utility, plugin, method, or folder names. They may appear only inside
explicit banned-name lists, source coverage notes, migration notes, or warnings
that say not to promote them.

- `src`
- `function`
- `foreach`
- `engine`
- `deps`
- `materialize`
- `materialization`
- `neuro_rule`
- `rule_engine`

Preferred approved replacements:

- use `code`, not `src`
- use class/config/constructor/method style, not standalone `function` style
- use `dependencies`, not `deps`
- use `create`, not `materialize`
- use `rule_set`, `rule_record`, `assertion_record`, or `validation_utility`,
  not rule-engine wording

Controlled but allowed operation names:

- `optimize` or `optimise` may be used for measurable improvement work when
  the contract defines the score target and acceptance rule
- `evolve` may be used for iterative improvement behavior when seed, policy,
  approval, and audit are explicit
- `mutate` may be used for transform/config/data variation when seed,
  boundary, rollback, and validation are explicit
- avoid using these words as vague product, plugin, utility, or domain names

### Boundary And Recursion Policy

Any domain that reasons, resolves context, learns, or proposes changes must
define boundary behavior before implementation.

Boundary behavior must cover:

- missing evidence
- ambiguous references
- stale context
- low confidence
- conflicting memory
- unsafe action
- approval required
- recursion limit reached

Recursive decomposition or reasoning must define:

- max depth
- max node count
- cycle detection
- repeated-state detection
- timeout
- audit trail
- stop reason

When a boundary check fails, the system must return a clarification, blocked
result, or explicit assumption. It must not silently produce executable action.

---

## 2. Coding Policy

### Purpose
Define coding standards for all JavaScript code.

### Scope
All `.js` files in the project.

### Rules

| # | Rule | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| C1 | Class/constructor/method | Plugins use instance initiation, utilities use static methods | `grep -rn "function " --include="*.js"` | Error: Convert to class/constructor/method |
| C2 | No forEach | No forEach loops allowed | `grep -rn "\.forEach" --include="*.js"` | Error: Convert to for...of or reduce |
| C3 | No arrow functions | No arrow functions allowed | `grep -rn "=>" --include="*.js"` | Error: Convert to function expressions |
| C4 | Generic code | Code must be entity/configuration/case/rule-based, not task-specific | Manual review | Warning: Refactor to generic patterns |
| C5 | ESM imports only | Use `import`, not `require` | `grep -rn "require(" --include="*.js"` | Error: Convert to import statements |
| C6 | No external dependencies | No libraries unless specified by user | `grep -rn "node_modules" package.json` | Error: Remove dependency |
| C7 | Node.js by default | Use Node.js unless Python specified | Manual review | Warning: Convert to Node.js |
| C8 | One concern per file | Each file covers one module or utility | Manual review | Warning: Split file |

---

## 3. File Structure Policy

### Purpose
Organize files logically for easy navigation.

### Scope
All files and folders.

### Rules

| # | Rule | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| F1 | Code in code/ | All code in root/code folder | `find . -name "*.js" -not -path "*/code/*"` | Error: Move to code/ |
| F2 | Core in code/core | Core files in code/core | Manual review | Warning: Move to code/core |
| F3 | Plugins in code/plugins | Plugin files in code/plugins | Manual review | Warning: Move to code/plugins |
| F4 | Config in config/ | Configuration files in config/ | Manual review | Warning: Move to config/ |
| F5 | Samples in samples/ | Sample files in samples/ | Manual review | Warning: Move to samples/ |
| F6 | Log in log/ | Log files in log/ | Manual review | Warning: Move to log/ |
| F7 | Output in output/ | Output files in output/ | Manual review | Warning: Move to output/ |
| F8 | Docs in docs/ | Documentation files in docs/ | Manual review | Warning: Move to docs/ |
| F9 | HTML in html/ | HTML files in html/ | Manual review | Warning: Move to html/ |
| F10 | Folder index | All folders should have an index file | `find . -type d -exec sh -c 'ls "{}" | grep -q "index" || echo "{}"' \;` | Warning: Generate index file |

### Folder Structure

```
dot/
├── code/
│   ├── core/              # core modules
│   │   └── code_shared_*.js
│   └── plugins/           # plugin modules
│       └── code_shared_*.js
├── config/                # configuration files
├── samples/               # sample files
├── log/                   # log files
├── output/                # output files
├── docs/                  # documentation
├── html/                  # HTML files
├── dataset/               # vocabulary datasets
├── inbox/                 # incoming items
├── agent_workspace/       # agent work area
├── policy_and_convention_for_dot.md
├── overview_dot.md
├── changelog_dot.md
└── VERSION
```

---

## 4. Dataset Policy

### Purpose
Define how datasets are structured.

### Scope
All `.datatable` and `.datamap` files.

### Rules

| # | Rule | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| D1 | Flat arrays | Datasets are flat arrays of strings only | `grep -rn "\[" --include="*.datatable" | grep -v "const"` | Error: Convert to flat array |
| D2 | No nesting | No objects, no nested arrays | `grep -rn "{" --include="*.datatable"` | Error: Remove nesting |
| D3 | Type names array | Each file has a `type_names` array listing categories | `grep -rn "type_names" --include="*.datatable"` | Error: Add type_names array |
| D4 | Grouped by type | Names grouped under their type with comments | Manual review | Warning: Group by type |
| D5 | Comments optional | Comments on names are optional but recommended | Manual review | Info: Add comments |
| D6 | Export | Arrays are exported for use by other files | Manual review | Warning: Add exports |

---

## 5. Module Policy

### Purpose
Define required modules and their responsibilities.

### Scope
All code modules.

### Rules

| # | Module | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| M1 | Index Generator | Generate tree indexes from folders | Manual review | Warning: Implement if needed |
| M2 | Data Fetcher | REST API data fetching with auth support | Manual review | Warning: Implement if needed |
| M3 | Flow Runner | Nested workflow execution with pause/resume | Manual review | Warning: Implement if needed |
| M4 | Validator | Input validation with schemas/rules | Manual review | Warning: Implement if needed |
| M5 | Learner | Learn from libraries by calling help | Manual review | Warning: Implement if needed |
| M6 | Derivatives | Difference, ratio, velocity, acceleration, jerk | Manual review | Warning: Implement if needed |

---

## 6. UI Policy

### Purpose
Define UI standards for HTML/CSS.

### Scope
All HTML and CSS files.

### Rules

| # | Rule | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| U1 | CSS in Beauty/ | CSS files in project root/Beauty/ | Manual review | Warning: Move to Beauty/ |
| U2 | HTML in html/ | HTML files in project root/html/ | Manual review | Warning: Move to html/ |
| U3 | Global tokens only | Only global token-based CSS, no static values | `grep -rn "[0-9]px" --include="*.css"` | Error: Convert to tokens |
| U4 | Global reset | Use global reset | Manual review | Warning: Add global reset |
| U5 | Semantic tags only | Only semantic tags, no DIV or SPAN | `grep -rn "<div\|<span" --include="*.html"` | Error: Convert to semantic tags |
| U6 | No CSS classes | No class in CSS, only nested rule-based CSS | `grep -rn "\." --include="*.css"` | Error: Convert to nested rules |

### Markup Structure

```html
<body id="app" class="flex column no-scroll last-child-bottom full-vw-vh">
  <header class="flex row last-child-right">
    <nav class="flex row left-aligned">
      <!-- brand name: toggles aside -->
    </nav>
    <!-- search -->
    <!-- window control -->
  </header>
  <main class="flex row flex-1 no-padding no-scroll">
    <aside class="flex column slide-left-toggle">
      <!-- aside content -->
    </aside>
    <article>
      <header></header>
      <section></section>
      <footer></footer>
      <aside></aside>
    </article>
  </main>
  <footer></footer>
</body>
```

---

## 7. Agent Policy

### Purpose
Define agent behavior and responsibilities.

### Scope
All agent operations.

### Rules

| # | Rule | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| A1 | Follow instructions | Agents must follow instructions religiously | Manual review | Error: Stop and follow instructions |
| A2 | Use existing modules | Use existing modules where possible | Manual review | Warning: Check for existing modules |
| A3 | Initiate with action_index | Initiate projects using action_index | Manual review | Warning: Use action_index |
| A4 | Execute with action_flow | Execute flows using action_flow | Manual review | Warning: Use action_flow |
| A5 | Maintain conversation log | Maintain conversation log for session continuity | Manual review | Warning: Create/update conversation log |

### Conversation Log Format

```
Timestamp | Project/Folder | Current Task | Work Completed | State/Blockers | Next Steps
```

---

## 8. Versioning Policy

### Purpose
Manage versions of artifacts.

### Scope
All artifact versioning.

### Rules

| # | Rule | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| VS1 | Semantic versioning | Use major.minor.patch format | `grep -rn "VERSION" --include="*.md"` | Error: Use semantic versioning |
| VS2 | Bump on change | Any change requires version bump | Manual review | Warning: Bump version |
| VS3 | Changelog | Every change must be logged | Manual review | Warning: Update changelog |
| VS4 | Deprecation | Never delete; mark as deprecated | Manual review | Error: Mark as deprecated |
| VS5 | Backward compatible | Changes must be backward compatible | Manual review | Error: Ensure compatibility |

---

## 9. Validation Policy

### Purpose
Ensure artifacts are valid before use.

### Scope
All artifact creation and modification.

### Rules

| # | Rule | Description | Validation | Violation Action |
|:---|:---|:---|:---|:---|
| V1 | Check before create | Search registries before creating any artifact | Manual review | Warning: Search registries |
| V2 | Exact match | If exact match exists, reuse it | Manual review | Warning: Reuse existing |
| V3 | Similar match | If similar match exists, extend that concept | Manual review | Warning: Extend existing |
| V4 | No match | If no match, reserve the artifact first | Manual review | Warning: Reserve artifact |
| V5 | Validate on use | Validate artifacts when used | Manual review | Warning: Validate artifacts |

---

## 10. Decision Tree for Violations

### Purpose
Define how agents should handle violations.

### Violation Levels

| Level | Action | Description |
|:---|:---|:---|
| Error | Stop and fix | Must fix before proceeding |
| Warning | Continue with fix | Can continue but must fix |
| Info | Log and continue | Log for future reference |

### Decision Tree

```
Violation Detected
├── Is it an Error?
│   ├── Yes → Stop work
│   │   ├── Can fix immediately?
│   │   │   ├── Yes → Fix and continue
│   │   │   └── No → Report to user and wait
│   │   └── Log violation
│   └── No → Is it a Warning?
│       ├── Yes → Log violation
│       │   ├── Can fix immediately?
│       │   │   ├── Yes → Fix and continue
│       │   │   └── Continue work, fix later
│       │   └── Log for later
│       └── No → Log and continue
└── Report violation
```

### Violation Response Actions

| Violation Type | Response | Priority |
|:---|:---|:---|
| N1: Naming (camelCase) | Rename to snake_case | High |
| N2: Naming (duplicates) | Rename with prefix/suffix | High |
| C1: Class/constructor | Refactor to class pattern | Medium |
| C2: forEach | Convert to for...of | High |
| C3: Arrow functions | Convert to function expressions | High |
| C4: Generic code | Refactor to entity-based | Medium |
| C5: require() | Convert to import | High |
| F1: File location | Move to correct folder | Medium |
| D1: Dataset format | Convert to flat array | High |
| D3: Dataset structure | Add type_names array | High |
| U1: CSS location | Move to Beauty/ folder | Low |
| U3: CSS tokens | Convert to global tokens | Medium |
| U5: HTML tags | Convert to semantic tags | Medium |

### Agent Decision Matrix

| Agent Role | Can Fix | Must Report | Can Continue |
|:---|:---|:---|:---|
| Discover Agent | No | All violations | Yes |
| Define Agent | No | All violations | Yes |
| Design Agent | No | All violations | Yes |
| Develop Agent | Yes (code) | Non-code violations | Yes |
| Deploy Agent | Yes (config) | Non-config violations | Yes |
| Deliver Agent | No | All violations | Yes |

### Violation Handling Protocol

1. **Detect:** Run `node validate_conventions.js [folder]`
2. **Classify:** Determine violation level (Error/Warning/Info)
3. **Decide:** Use decision tree to determine action
4. **Execute:** Fix violation or report to appropriate agent
5. **Log:** Record violation in `docs/convention_violation_report.md`
6. **Verify:** Re-run validation to confirm fix

---

## Change Log

| Version | Date | Change |
|:---|:---|:---|
| 1.0.0 | 2026-08-25 | Initial policy definitions with validation rules and decision tree |
