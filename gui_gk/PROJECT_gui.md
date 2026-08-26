# An App - Semantic UI Framework

**Version:** v1.4.0
**Status:** active
**Date:** 2026-08-25

---

## 1. Project Overview

An App is a universal semantic UI framework for building component-based interfaces. It separates **what content IS** (semantic data) from **how it LOOKS** (layout/UI).

### Core Philosophy

> "These dataset files are the single source of truth for our framework. Every type, enum, and relationship in the system must come from these lists. Never hardcode values—import them from these files."

### System Architecture

```
Dataset (1D arrays of names)
    ↓
Datamap (relationships between items)
    ↓
Data Table (attributes and properties)
    ↓
Generic Render Method
    ↓
HTML Output
```

---

## 2. Principles

### 2.1 Separation of Concerns

| Layer | Responsibility | Knows About |
|---|---|---|
| **Page Type** | Defines styling and component mapping | Nothing |
| **Workspace** | Manages UI state | Page Type, Editors |
| **Semantic Core** | Pure data backbone | ContentCollections |
| **Layout Renderer** | Transforms blocks into visual UI | ContentCollections + Blocks |

### 2.2 Semantic-Only HTML

- No `<div>` or `<span>` in HTML
- No classes in CSS
- No inline styles
- Use semantic elements only
- Use `role="search"` for search forms

### 2.3 Path-Based CSS

- No class-based selectors
- Target by DOM structure: `body > main > article > section > ul > li`
- One CSS file per concern: reset, tokens, shared, app, book

### 2.4 Data-Driven Rendering

- UI defined by schema (JSON)
- Components defined by datasets
- Relationships defined by datamaps
- Attributes defined by data tables
- One generic render method converts schema to HTML

### 2.5 Golden Rule

> "These dataset files are the single source of truth for our framework. Every type, enum, and relationship in the system must come from these lists. When you need to validate user input, generate UI, or enforce business rules, always reference these datasets first. Never hardcode values—import them from these files."

---

## 3. Hierarchy

### 3.1 Core Structure

```
Editor (body > main)
└── Book (article)
    ├── Header (article > header) - tabs only
    ├── Section (article > section) - editor area, scrollable
    │   ├── Section (section > section) - collection
    │   │   └── UL (section > ul) - block
    │   │       └── LI (ul > li) - cell
    │   │           └── Section (li > section) - nested content
    └── Footer (article > footer) - status bar
```

### 3.2 Hierarchy Levels

| Level | Name | Element | Purpose |
|---|---|---|---|
| 0 | Editor | `<main>` | Viewport, manages books |
| 1 | Book | `<article>` | Single document |
| 2 | Collection | `<section>` | Content group |
| 3 | Block | `<ul>/<ol>` | Item container |
| 4 | Cell | `<li>` | Leaf content |

### 3.3 Critical Rules

1. **Collection CANNOT contain Collection** - Only Blocks
2. **Block CANNOT contain Block** - Only Cells
3. **Cell CANNOT contain Block** - Only text and inline elements
4. **Cell is the absolute leaf** - Contains ONLY text and inline styles
5. **Each article must have** header, section (with ul > li), footer
6. **Each section must have** ul as child

### 3.4 ID Naming Convention

Format: `{level}_{index}`

| Level | Pattern | Example |
|---|---|---|
| Book | `book_{n}` | `book_01` |
| Collection | `book_{n}_col_{m}` | `book_01_col_01` |
| Block | `book_{n}_col_{m}_block_{k}` | `book_01_col_01_block_01` |
| Cell | `book_{n}_col_{m}_block_{k}_cell_{j}` | `book_01_col_01_block_01_cell_01` |

---

## 4. Page Types

| Page Type | Purpose | Font | Brand Color | Header BG | Scroll |
|---|---|---|---|---|---|
| website | Corporate web presence | Georgia (serif) | #0066cc | white | body |
| blog | Content publishing | Helvetica (sans) | #e74c3c | white | article |
| document | Technical docs | Palatino (serif) | #2c3e50 | #2c3e50 | article > section |
| application | Developer tools | Segoe UI (sans) | #2ea44f | #24292e | aside |
| saas_dashboard | Data dashboards | Inter (sans) | #6366f1 | #1e293b | none |

---

## 5. Layout Types

| Layout | Structure | Use Case |
|---|---|---|
| list | ul > li | Simple items |
| card | article > figure | Visual items |
| kanban | section > ul | Status columns |
| calendar | table | Date grid |
| workflowy_tree | details > summary | Nested items |
| timeline | table + progress | Time-based items |

---

## 6. Datasets

### 6.1 Dataset Types

| Dataset | Purpose | Used For |
|---|---|---|
| page_types | Define UI contexts | Theme engine, routing |
| layout_types | Define visual projections | Viewport switcher |
| component_types | Define semantic units | Data model validation |
| hierarchy_levels | Define nesting rules | Tree validation, drag-drop |
| semantic_elements | Define HTML support | Rich text editor, sanitization |
| css_token_categories | Define design tokens | Theme builder, style generation |
| relationship_types | Define connections | Graph traversal, UI navigation |
| html_relationship_types | Define link rel attributes | Link editor, SEO tools |

### 6.2 Dataset Values

```js
// Page Types
export const dataset_gui_page_types = [
  "website", "blog", "document", "application", "saas_dashboard"
];

// Layout Types
export const dataset_gui_layout_types = [
  "list", "card", "kanban", "calendar", "workflowy_tree", "timeline"
];

// Component Types
export const dataset_gui_component_types = [
  "workspace", "editor", "content_collection",
  "content_block", "content_cell", "content"
];

// Hierarchy Levels
export const dataset_gui_hierarchy_levels = [
  "editor", "book", "collection", "block", "cell"
];

// Semantic Elements
export const dataset_gui_semantic_elements = [
  "header", "nav", "main", "aside", "article", "section", "footer",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li",
  "table", "form", "details", "menu", "blockquote", "code",
  "progress", "time", "figure", "figcaption", "img", "video", "audio",
  "context-menu", "menuitem"
];

// CSS Token Categories
export const dataset_gui_css_token_categories = [
  "colors_text", "colors_background", "colors_border", "colors_brand",
  "typography_font", "typography_weight", "typography_line_height",
  "spacing", "border_radius", "border_width", "layout", "responsive"
];

// HTML Relationship Types (link rel attributes)
export const dataset_gui_html_relationship_types = [
  "alternate", "author", "bookmark", "canonical", "dns-prefetch",
  "external", "help", "icon", "license", "manifest", "modulepreload",
  "next", "nofollow", "noopener", "noreferrer", "pingback", "preconnect",
  "prefetch", "preload", "prerender", "prev", "search", "stylesheet", "tag"
];
```

---

## 7. Relationships

### 7.1 Relationship Types

```js
export const dataset_gui_relationship_types = [
  "contains", "renders", "uses", "belongs_to",
  "supports_layout", "styled_by", "constrains", "has_selector"
];
```

### 7.2 Relationship Rules

| Relationship | Meaning | Example |
|---|---|---|
| contains | Parent has child | `editor_contains_book` |
| renders | Component displays | `list_renders_ul` |
| uses | Page type needs | `application_uses_aside` |
| belongs_to | Element category | `header_belongs_to_sectioning_content` |
| constrains | Cannot nest | `p_constrains_section` |
| supports_layout | Page type supports layout | `website_supports_layout_list` |
| styled_by | Component uses CSS token | `header_styled_by_color_bg_surface` |
| has_selector | Level has CSS path | `editor_has_selector_body_main` |
| triggers | Context menu action | `article_triggers_context_menu` |

### 7.3 Compact Notation

Format: `source_relationship_target_cardinality`

| Cardinality | Meaning |
|---|---|
| 1_1 | one-to-one |
| 1_n | one-to-many |
| n_1 | many-to-one |
| n_n | many-to-many |
| 0_n | zero-to-many |

---

## 8. CSS Architecture

### 8.1 File Structure

| File | Purpose | Scope |
|---|---|---|
| reset.css | Remove browser defaults | Global |
| tokens.css | Design tokens (rem) | Global |
| shared.css | Component styles | Global |
| app.css | Layout (header, aside, footer) | Global |
| book.css | Document content | Global |
| tokens_xxx.css | Page type tokens | Per page type |

### 8.2 Path-Based Selectors

| Level | Selector |
|---|---|
| Editor | `body > main` |
| Book | `body > main > article` |
| Book Header | `article > header` |
| Editor Area | `article > section` |
| Collection | `article > section > section` |
| Block | `article > section > section > ul` |
| Cell | `article > section > section > ul > li` |

---

## 9. Semantic Elements

### 9.1 Element Reference

| Element | Purpose | Contains |
|---|---|---|
| `<header>` | Page/article header | nav, h1, button |
| `<nav>` | Navigation | menu, a, button |
| `<main>` | Primary content | aside, article |
| `<aside>` | Sidebar | section |
| `<article>` | Document | header, section, footer |
| `<section>` | Content group | h1, h2, p, ul, table |
| `<footer>` | Bottom bar | p, nav |
| `<ul>` | Unordered list | li |
| `<ol>` | Ordered list | li |
| `<li>` | List item | section, article, text |
| `<table>` | Data grid | thead, tbody, tr |
| `<form>` | Input form | fieldset, label, input |
| `<details>` | Collapsible | summary, p, ul |
| `<menu>` | Menu container | li |
| `<blockquote>` | Quote | p, cite |
| `<code>` | Code snippet | text |
| `<progress>` | Progress bar | none |
| `<time>` | Date/time | text |
| `<figure>` | Media container | img, figcaption |
| `<img>` | Image | none |
| `<video>` | Video player | source |
| `<audio>` | Audio player | source |
| `<context-menu>` | Right-click menu | menuitem |
| `<menuitem>` | Menu item | icon, text |

### 9.2 Parent-Child Rules

| Parent | Relationship | Child |
|---|---|---|
| `<body>` | contains | `<main>`, `<header>`, `<footer>` |
| `<main>` | contains | `<aside>`, `<article>` |
| `<article>` | contains | `<header>`, `<section>`, `<footer>` |
| `<section>` | contains | `<ul>`, `<ol>`, `<h2>`, `<p>` |
| `<ul>` | must contain | `<li>` |
| `<ol>` | must contain | `<li>` |
| `<li>` | contains | `<section>`, `<article>`, text |
| `<table>` | contains | `<thead>`, `<tbody>`, `<tr>` |
| `<form>` | contains | `<fieldset>` |
| `<p>` | contains | `<a>`, `<em>`, `<strong>`, `<code>`, `<time>` |
| `<header>` | contains | `<nav>`, `<h1>`, `<button>` |
| `<footer>` | contains | `<p>`, `<nav>` |

---

## 10. Constraints

### 10.1 Nesting Rules

| Constraint | Meaning |
|---|---|
| `p_constrains_section` | `<p>` cannot contain `<section>` |
| `h1_constrains_h1` | `<h1>` cannot nest inside `<h1>` |
| `button_constrains_button` | `<button>` cannot nest inside `<button>` |
| `a_constrains_a` | `<a>` cannot nest inside `<a>` |
| `table_constrains_table` | `<table>` cannot nest inside `<table>` |
| `details_constrains_details` | `<details>` cannot nest inside `<details>` |
| `figure_constrains_figure` | `<figure>` cannot nest inside `<figure>` |
| `form_constrains_form` | `<form>` cannot nest inside `<form>` |

### 10.2 Scroll Rules

| Page Type | Scroll Container | Behavior |
|---|---|---|
| website | body | Entire page scrolls |
| blog | article | Content area scrolls |
| document | article > section | Editor area scrolls |
| application | aside | Sidebar scrolls |
| saas_dashboard | none | No scrolling |

---

## 11. Editor Types

### 11.1 Editor Overview

| Editor Type | Purpose | Key Feature | Primary Use |
|---|---|---|---|
| Code Editor | Write and execute code | Syntax highlighting | Development |
| Jupyter Notebook | Mix code, text, output | Cell-based execution | Data science |
| n8n Workflow | Build automation flows | Node connections | Automation |
| Webflow Builder | Visual page design | Drag-drop components | Web design |
| Tree Editor | Nested list management | Indentation/collapse | Note-taking |

### 11.2 Code Editor

**Purpose:** Write, edit, and execute code with syntax highlighting.

**Components:**
- Line numbers gutter
- Syntax highlighted code area
- Execution output panel
- Language selector
- Run/stop buttons

**Datasets:**
```js
export const dataset_gui_code_editor_modes = [
  "javascript", "python", "html", "css", "json", "markdown"
];
```

**Constraints:**
- No rich text formatting in code cells
- No interactive elements (buttons, links) in code
- Monospace font required

---

### 11.3 Jupyter Notebook

**Purpose:** Mix code, markdown, and output in sequential cells.

**Components:**
- Cell (code, markdown, output)
- Execution indicator
- Cell toolbar (run, move, delete)
- Output area

**Datasets:**
```js
export const dataset_gui_notebook_cell_types = [
  "code", "markdown", "output", "raw"
];

export const dataset_gui_execution_states = [
  "idle", "running", "completed", "error"
];
```

**Constraints:**
- Cells execute in order
- Output belongs to preceding code cell
- Markdown cells cannot contain code execution

---

### 11.4 n8n Workflow

**Purpose:** Build automation flows with visual nodes and connections.

**Components:**
- Node (trigger, action, condition, merge)
- Connection (edge between nodes)
- Canvas (work area)
- Panel (node configuration)

**Datasets:**
```js
export const dataset_gui_workflow_node_types = [
  "trigger", "action", "condition", "merge", "split", "loop"
];

export const dataset_gui_workflow_states = [
  "idle", "running", "completed", "error", "waiting"
];
```

**Constraints:**
- Triggers have no incoming connections
- Actions require at least one input
- Conditions have exactly two outputs (true/false)
- No circular dependencies allowed

---

### 11.5 Webflow Builder

**Purpose:** Visual page design with drag-drop components.

**Components:**
- Component Palette (left panel)
- Canvas (center)
- Style Panel (right panel)
- Layer Tree

**Datasets:**
```js
export const dataset_gui_builder_modes = [
  "select", "drag", "resize", "style"
];

export const dataset_gui_drag_actions = [
  "move", "copy", "clone", "connect"
];
```

**Constraints:**
- Components must be dropped in valid containers
- Style changes apply to selected component only
- Layer tree reflects current DOM structure

---

### 11.6 Tree Editor (Workflowy)

**Purpose:** Manage nested lists with indentation and collapsing.

**Components:**
- Tree Item (bullet point)
- Collapse Arrow
- Indentation Guide
- Content Area

**Datasets:**
```js
export const dataset_gui_tree_item_states = [
  "expanded", "collapsed", "editing", "selected"
];

export const dataset_gui_tree_actions = [
  "indent", "outdent", "move_up", "move_down", "delete", "toggle"
];
```

**Constraints:**
- Items can nest indefinitely
- Collapse state persists
- Indentation is visual only (no depth limit)

---

## 12. Component Lifecycle States

### 12.1 Universal States

| State | Description | Allowed Transitions |
|---|---|---|
| `created` | Initial state | `active` |
| `active` | Visible and interactive | `editing`, `selected`, `hidden`, `deleted` |
| `editing` | Being modified | `active`, `deleted` |
| `selected` | Currently focused | `active`, `editing`, `deleted` |
| `hidden` | Not visible | `active`, `deleted` |
| `deleted` | Marked for removal | (terminal) |

### 12.2 Editor-Specific States

#### Code Editor
| State | Description |
|---|---|
| `idle` | Not executing |
| `running` | Code executing |
| `completed` | Execution finished |
| `error` | Execution failed |

#### Jupyter Notebook
| State | Description |
|---|---|
| `idle` | Cell not executed |
| `queued` | Cell waiting to execute |
| `running` | Cell executing |
| `completed` | Cell executed successfully |
| `error` | Cell execution failed |

#### n8n Workflow
| State | Description |
|---|---|
| `idle` | Workflow not running |
| `running` | Workflow executing |
| `paused` | Workflow paused |
| `completed` | Workflow finished |
| `error` | Workflow failed |
| `waiting` | Waiting for input/trigger |

#### Webflow Builder
| State | Description |
|---|---|
| `select` | Selection mode |
| `drag` | Dragging component |
| `resize` | Resizing component |
| `style` | Editing styles |

#### Tree Editor
| State | Description |
|---|---|
| `expanded` | Children visible |
| `collapsed` | Children hidden |
| `editing` | Content being modified |
| `selected` | Currently focused |

### 12.3 State Transition Rules

```
created -> active (always first)
active -> editing (user action)
editing -> active (save/cancel)
active -> selected (click)
selected -> active (click elsewhere)
active -> hidden (toggle)
hidden -> active (toggle)
active -> deleted (user action)
```

### 12.4 State Events

| Event | From | To | Trigger |
|---|---|---|---|
| `mount` | created | active | Component added to DOM |
| `focus` | active | selected | User clicks component |
| `blur` | selected | active | User clicks elsewhere |
| `edit` | active/editing | editing | User double-clicks |
| `save` | editing | active | User saves changes |
| `cancel` | editing | active | User cancels |
| `hide` | active | hidden | User toggles visibility |
| `show` | hidden | active | User toggles visibility |
| `remove` | any | deleted | User deletes |

---

## 13. File Structure

```
gui_gk/
├── PROJECT_gui.md                 # This document
├── reset.css                      # Browser reset
├── tokens.css                     # Base design tokens
├── shared.css                     # Component styles
├── app.css                        # Layout styles
├── book.css                       # Content styles
├── gui_an_app_v5.html            # Main app UI
├── gui_an_app_v5_clone.html      # Composed UI clone
├── gui_an_app_page_types.html    # Page types showcase
├── hierarchy_rules.md             # Hierarchy rules
├── component_library.md           # Component reference
├── relationships.txt              # Relationship reference
├── app_tree.txt                   # Complete component map
├── notion_blocks.txt              # Notion block reference
├── raw.raw                        # Raw design notes
├── rules.txt                      # Framework rules
├── dataset/
│   ├── dataset_gui_framework_v1.js       # All datasets
│   ├── dataset_gui_relationships_v1.js   # All relationships
│   ├── dataset_gui_editor_types.js       # Editor type definitions
│   ├── dataset_gui_cell_types.js         # Cell type definitions
│   ├── dataset_gui_workflow_states.js    # Workflow state definitions
│   └── dataset_gui_lifecycle_states.js   # Lifecycle state definitions
├── js/
│   ├── components.js              # Component definitions
│   ├── render.js                  # Generic render method
│   ├── data_tables.js             # Attribute definitions
│   └── state_machine.js           # State transition logic
└── page_types/
    ├── page_type_website.html
    ├── page_type_blog.html
    ├── page_type_document.html
    ├── page_type_application.html
    ├── page_type_saas_dashboard.html
    ├── page_type_code_editor.html
    ├── page_type_jupyter_notebook.html
    ├── page_type_n8n_workflow.html
    ├── page_type_webflow_builder.html
    ├── page_type_tree_editor.html
    ├── tokens_website.css
    ├── tokens_blog.css
    ├── tokens_document.css
    ├── tokens_application.css
    ├── tokens_saas_dashboard.css
    ├── tokens_code_editor.css
    ├── tokens_jupyter_notebook.css
    ├── tokens_n8n_workflow.css
    ├── tokens_webflow_builder.css
    └── tokens_tree_editor.css
```

---

## 12. Context Menu Component

### 12.1 Overview

A contextual right-click menu that opens different options depending on which component it's invoked on.

### 12.2 Menu Items by Component

| Component | Menu Items |
|---|---|
| `<article>` | Edit, Duplicate, Delete, Export, Settings |
| `<section>` | Add Block, Edit, Duplicate, Delete, Move Up, Move Down |
| `<ul>` | Add Item, Edit, Delete, Sort, Change Type |
| `<li>` | Edit, Duplicate, Delete, Move Up, Move Down, Indent, Outdent |
| `<table>` | Add Row, Add Column, Delete, Export CSV, Sort |
| `<form>` | Edit, Validate, Submit, Reset, Export |
| `<details>` | Toggle, Edit, Delete, Duplicate |
| `<header>` | Edit, Change Layout, Hide |
| `<footer>` | Edit, Change Layout, Hide |
| `<aside>` | Toggle, Resize, Hide, Add Section |

### 12.3 Context Menu Schema

```json
{
  "context_menu": {
    "trigger": "right-click",
    "target": "component",
    "items": [
      {
        "label": "Edit",
        "icon": "ri-edit-line",
        "action": "edit_component"
      },
      {
        "label": "Duplicate",
        "icon": "ri-file-copy-line",
        "action": "duplicate_component"
      },
      {
        "label": "Delete",
        "icon": "ri-delete-bin-line",
        "action": "delete_component",
        "danger": true
      }
    ]
  }
}
```

### 12.4 Context Menu Rules

1. Menu appears at cursor position
2. Menu closes on click outside
3. Menu items change based on target component
4. Danger items (delete) are visually distinct
5. Menu keyboard navigation: arrow keys, Enter, Escape

### 12.5 CSS for Context Menu

```css
context-menu {
  position: fixed;
  background: var(--color-bg-surface);
  border: var(--border-width-default) solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 12rem;
  padding: var(--space-2) 0;
}

context-menu > menuitem {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-4) var(--space-7);
  cursor: pointer;
}

context-menu > menuitem:hover {
  background: var(--color-bg-hover);
}

context-menu > menuitem.danger {
  color: #e53e3e;
}

context-menu > hr {
  border: none;
  border-top: var(--border-width-default) solid var(--color-border);
  margin: var(--space-2) 0;
}
```

---

## 13. Agent Guidelines

### 13.1 Agent Roles

| Agent | Role | Focus Area |
|---|---|---|
| agent_1 (codex_an_app) | Foundation | Core framework, CSS architecture, render engine |
| agent_2 (ui_application) | Product Surface | Visual components, templates, layouts |
| agent_3 (lang_and_memory) | Language | Parsing, content understanding, datasets |

### 13.2 Contribution Rules

#### Before Starting Work

1. **Read this document completely**
2. **Search for existing work:**
   ```powershell
   rg --files dot\gui_gk | rg "your_agent_name"
   ```
3. **Check datasets for available types**
4. **Verify relationships in datamap**
5. **Check constraints before adding components**

#### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Files | `snake_case` | `dataset_gui_framework_v1.js` |
| Components | `UPPER_CASE` | `CONTENT_BLOCK` |
| Relationships | `snake_case` | `editor_contains_book` |
| CSS tokens | `--kebab-case` | `--color-text-primary` |
| IDs | `level_index` | `book_01_col_01` |

#### File Naming Pattern

```
dataset_gui_{type}_{name}_v{version}.js
datamap_gui_{type}_v{version}.json
tokens_{page_type}.css
page_type_{name}.html
```

### 13.3 Workflow

#### Step 1: Understand Requirements
- Read PROJECT_gui.md
- Check existing datasets
- Verify relationships
- Identify constraints

#### Step 2: Check Existing Work
```powershell
rg --files dot\gui_gk | rg "agent_[0-9]"
rg --files dot\gui_gk\dataset | rg "dataset_gui"
```

#### Step 3: Create/Update Datasets
- Add new items to existing 1D arrays
- Never create duplicate entries
- Follow naming conventions

#### Step 4: Create/Update Relationships
- Add new relationships to datamap
- Follow compact notation: `source_relationship_target_cardinality`
- Verify no constraint violations

#### Step 5: Create/Update Components
- Add component definition to data_tables.js
- Define attributes and properties
- Verify parent-child rules

#### Step 6: Create/Update CSS
- Add token values to tokens_xxx.css
- Use path-based selectors only
- No classes, no inline styles

#### Step 7: Create/Update HTML
- Use semantic elements only
- Follow hierarchy rules
- Add proper IDs

#### Step 8: Test
- Verify no constraint violations
- Check all relationships
- Test all states

### 13.4 Conversation Guidelines

#### When Asked to Add Component

1. Check if component exists in dataset
2. If not, add to `dataset_gui_semantic_elements`
3. Add relationships to datamap
4. Add attributes to data_tables.js
5. Create CSS tokens if needed
6. Create HTML sample

#### When Asked to Modify Component

1. Check current component definition
2. Verify no constraint violations
3. Update dataset if adding new type
4. Update relationships if changing structure
5. Update CSS if changing appearance
6. Test all affected components

#### When Asked to Create Layout

1. Check layout exists in `dataset_gui_layout_types`
2. Add layout-specific relationships
3. Create CSS tokens for layout
4. Create HTML sample
5. Test all components in layout

#### When Asked to Create Page Type

1. Check page type exists in `dataset_gui_page_types`
2. Create token file with all required tokens
3. Create HTML sample with proper structure
4. Test all components in page type
5. Verify scroll behavior

### 13.5 Do Not Rules

| Rule | Reason |
|---|---|
| Do not use classes in CSS | Violates path-based CSS principle |
| Do not use div/span in HTML | Violates semantic-only principle |
| Do not hardcode values | Always use datasets |
| Do not skip constraints | Breaks hierarchy |
| Do not add duplicate entries | Confuses render method |
| Do not create circular relationships | Breaks datamap |
| Do not modify existing datasets without justification | Affects all consumers |
| Do not skip testing | Introduces bugs |

### 13.6 Cross-Agent Dependencies

| Agent | Depends On | Provides To |
|---|---|---|
| agent_1 | Datasets, Relationships | Core render, CSS architecture |
| agent_2 | Core render, CSS | Visual components, templates |
| agent_3 | Datasets, Relationships | Content parsing, validation |

### 13.7 Shared Inbox Protocol

1. **Post** new components to shared inbox
2. **Review** existing work before adding
3. **Cross-check** with other agents
4. **Validate** against constraints
5. **Test** before marking complete

---

## 14. Version History

| Version | Date | Changes |
|---|---|---|
| v1.0.0 | 2026-08-25 | Initial comprehensive project document |
| v1.1.0 | 2026-08-25 | Fixed gaps: added missing elements, constraints, scroll rules, fixed terminology consistency |
| v1.2.0 | 2026-08-25 | Added context menu component with per-component menus, updated datasets and relationships |
| v1.3.0 | 2026-08-25 | Added 5 editor types (code, jupyter, n8n, webflow, tree) and lifecycle states |
| v1.4.0 | 2026-08-25 | Added agent guidelines, contribution rules, conversation protocols |

---

## 15. License

This framework is part of the An App project. See project root for license details.

---

*Version history: v1.4.0 - Added agent guidelines and contribution rules*
