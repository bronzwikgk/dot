# Hierarchy Rules Notebook

**Version:** v1.0.0
**System:** 5-Level Semantic Hierarchy

---

## Core Hierarchy

```
Editor (body > main)
└── Book (article)
    ├── Header (article > header) - tabs only
    ├── Section (article > section) - editor area, scrollable
    │   ├── Section (section > section) - collection
    │   │   └── UL (section > ul) - block
    │   │       └── LI (ul > li) - cell
    │   │           └── Section (li > section) - nested content
    │   │           └── Article (li > article) - nested article
    └── Footer (article > footer) - status bar
```

---

## ID Naming Convention

Format: `{level}_{index}`

| Level | ID Pattern | Example |
|---|---|---|
| Book | `book_{n}` | `book_01` |
| Collection | `book_{n}_col_{m}` | `book_01_col_01` |
| Block | `book_{n}_col_{m}_block_{k}` | `book_01_col_01_block_01` |
| Cell | `book_{n}_col_{m}_block_{k}_cell_{j}` | `book_01_col_01_block_01_cell_01` |
| Nested | `book_{n}_col_{m}_block_{k}_cell_{j}_section_{i}` | `book_01_col_01_block_01_cell_01_section_01` |

---

## Relationship Rules

### Rule 1: Article Structure
- `article` must have exactly: `header`, `section`, `footer`
- `header` contains only tab navigation (menu)
- `section` is the scrollable editor area
- `footer` contains status information

### Rule 2: Section Contains ul > li
- Every `section` inside editor must contain a `ul` (or `ol`)
- `ul` contains `li` elements (cells)
- No direct text content in section - must be in li

### Rule 3: li Contains Section or Article
- `li` can contain a `section` (nested block)
- `li` can contain an `article` (nested document)
- `li` can contain direct text (simple cell)

### Rule 4: No Checkbox on Content li
- Checkboxes only on `li[aria-checked]` (task items)
- Content `li` have no visual markers

### Rule 5: Section Width
- Editor sections: `max-width: 80%`, centered
- Left/right padding: `var(--space-20)`
- Content flows naturally within 80% width

### Rule 6: Scroll Behavior
- `article > header` - fixed (no scroll)
- `article > section` - scrollable (overflow-y: auto)
- `article > footer` - fixed (no scroll)

---

## Selector Paths

| Level | Selector | Element |
|---|---|---|
| Editor | `body > main` | main |
| Book | `body > main > article` | article |
| Book Header | `article > header` | header |
| Editor Area | `article > section` | section |
| Collection | `article > section > section` | section |
| Block | `article > section > section > ul` | ul |
| Cell | `article > section > section > ul > li` | li |
| Nested Cell | `ul > li > section` | section |
| Nested Article | `ul > li > article` | article |
| Book Footer | `article > footer` | footer |

---

## Complete Element Index

### Book 01: Component Library

| Element | ID | Level | Content |
|---|---|---|---|
| Book | book_01 | 1 | Component Library |
| Header | book_01_header | 1 | Tab bar |
| Editor | book_01_editor | 1 | Scrollable area |
| Footer | book_01_footer | 1 | Status bar |
| Collection | book_01_col_00 | 2 | Page title |
| Collection | book_01_col_01 | 2 | Text & Structure Blocks |
| Block | book_01_col_01_block_01 | 3 | Text items |
| Cell | book_01_col_01_block_01_cell_01 | 4 | Paragraph |
| Cell | book_01_col_01_block_01_cell_02 | 4 | Headings |
| Cell | book_01_col_01_block_01_cell_03 | 4 | Quote |
| Cell | book_01_col_01_block_01_cell_04 | 4 | Callout |
| Cell | book_01_col_01_block_01_cell_05 | 4 | Code |
| Cell | book_01_col_01_block_01_cell_06 | 4 | Equation |
| Cell | book_01_col_01_block_01_cell_07 | 4 | Divider |
| Cell | book_01_col_01_block_01_cell_08 | 4 | Table of Contents |
| Collection | book_01_col_02 | 2 | List & Interactive Blocks |
| Block | book_01_col_02_block_01 | 3 | Interactive items |
| Cell | book_01_col_02_block_01_cell_01 | 4 | Bulleted List |
| Cell | book_01_col_02_block_01_cell_02 | 4 | Numbered List |
| Cell | book_01_col_02_block_01_cell_03 | 4 | To-Do List |
| Cell | book_01_col_02_block_01_cell_04 | 4 | Toggle |
| Collection | book_01_col_03 | 2 | Media Blocks |
| Block | book_01_col_03_block_01 | 3 | Media items |
| Cell | book_01_col_03_block_01_cell_01 | 4 | Image |
| Cell | book_01_col_03_block_01_cell_02 | 4 | Video |
| Cell | book_01_col_03_block_01_cell_03 | 4 | Audio |
| Cell | book_01_col_03_block_01_cell_04 | 4 | File |
| Cell | book_01_col_03_block_01_cell_05 | 4 | Bookmark |
| Cell | book_01_col_03_block_01_cell_06 | 4 | Embed |
| Collection | book_01_col_04 | 2 | Database Blocks |
| Block | book_01_col_04_block_01 | 3 | Database items |
| Cell | book_01_col_04_block_01_cell_01 | 4 | Table |
| Cell | book_01_col_04_block_01_cell_02 | 4 | Board |
| Cell | book_01_col_04_block_01_cell_03 | 4 | Gallery |
| Cell | book_01_col_04_block_01_cell_04 | 4 | Calendar |
| Cell | book_01_col_04_block_01_cell_05 | 4 | Timeline |
| Collection | book_01_col_05 | 2 | Form Elements |
| Block | book_01_col_05_block_01 | 3 | Form items |
| Cell | book_01_col_05_block_01_cell_01 | 4 | Contact Form |
| Cell | book_01_col_05_block_01_cell_02 | 4 | Progress Bars |
| Collection | book_01_col_06 | 2 | Layout Blocks |
| Block | book_01_col_06_block_01 | 3 | Layout items |
| Cell | book_01_col_06_block_01_cell_01 | 4 | Columns |
| Cell | book_01_col_06_block_01_cell_02 | 4 | Breadcrumb |
| Cell | book_01_col_06_block_01_cell_03 | 4 | Child Page |
| Cell | book_01_col_06_block_01_cell_04 | 4 | Link to Page |
| Collection | book_01_col_07 | 2 | Team Updates |
| Block | book_01_col_07_block_01 | 3 | Update items |
| Cell | book_01_col_07_block_01_cell_01 | 4 | Design System v2.0 |
| Cell | book_01_col_07_block_01_cell_02 | 4 | Q3 Performance |

---

## CSS Layer Rules

| Layer | File | Purpose |
|---|---|---|
| Reset | reset.css | Remove browser defaults |
| Tokens | tokens.css | Design tokens (rem) |
| Shared | shared.css | Component styles (buttons, headings, forms) |
| App | app.css | Layout (header, aside, footer) |
| Book | book.css | Document content (article, sections, cells) |

---

## Forbidden Patterns

- No `div` or `span` in HTML
- No classes in CSS
- No inline styles
- No hidden scrollbars
- No checkboxes on content cells

---

## Recursive Nesting

```html
<ul id="book_01_col_01_block_01">
    <li id="book_01_col_01_block_01_cell_01">
        <section id="book_01_col_01_block_01_cell_01_section_01">
            <h3>Title</h3>
            <ul id="book_01_col_01_block_01_cell_01_section_01_block_01">
                <li id="book_01_col_01_block_01_cell_01_section_01_block_01_cell_01">
                    <section>
                        <h4>Sub-title</h4>
                        <p>Content</p>
                    </section>
                </li>
            </ul>
        </section>
    </li>
</ul>
```

Maximum recommended depth: 4 levels (ul > li > section > ul > li)

---

*Version history: v1.0.0 - Initial hierarchy rules with IDs*
