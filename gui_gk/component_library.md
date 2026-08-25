# Component Library

**Version:** v1.0.0
**Status:** active
**Date:** 2026-08-25

Complete reference of all semantic HTML components with use cases, child elements, attributes, parameters, lifecycle, and update rules.

---

## Text & Structure Components

### Paragraph

**Use Case:** Default text for writing notes, paragraphs, and general content.

**Semantic Element:** `<p>`

**Child Elements:**
- `<strong>` / `<b>` - Bold emphasis
- `<em>` / `<i>` - Italic emphasis
- `<code>` - Inline code
- `<a>` - Hyperlink
- `<time>` - Date/time reference
- `<mark>` - Highlighted text
- `<sub>` / `<sup>` - Subscript/superscript

**Attributes/Parameters:**
- `class` - Styling hooks
- `id` - Unique identifier
- `lang` - Language declaration

**Lifecycle:**
1. Created when user types in empty block
2. Splits into new paragraph on Enter
3. Merges with previous on Backspace at start

**Update Rules:**
- Rich text formatting applied inline
- Never auto-deletes empty (preserve structure)

---

### Heading 1 / 2 / 3

**Use Case:** Create section titles to structure a document hierarchically.

**Semantic Elements:** `<h1>`, `<h2>`, `<h3>`

**Child Elements:**
- `<strong>` - Bold emphasis
- `<em>` - Italic emphasis
- `<a>` - Link
- `<code>` - Inline code

**Attributes/Parameters:**
- `is_toggleable` (boolean) - Makes heading collapsible
- `color` - Text color

**Lifecycle:**
1. Created via `/` command or `#` shortcuts (`#` = h1, `##` = h2, `###` = h3)
2. Toggle mode adds disclosure triangle
3. Downgrade: h1 -> h2 -> h3 -> paragraph

**Update Rules:**
- Level changes on `#` count
- Toggle preserves children on collapse/expand

---

### Quote

**Use Case:** Highlight a block of text, often used for pull quotes or references.

**Semantic Element:** `<blockquote>`

**Child Elements:**
- `<p>` - Quoted text
- `<cite>` - Source attribution
- `<strong>` / `<em>` - Formatting

**Attributes/Parameters:**
- `color` - Background/border color

**Lifecycle:**
1. Created via `/quote` or `>` shortcut
2. Supports nested blocks inside

**Update Rules:**
- Nested blocks inherit quote styling
- Can contain any block type as children

---

### Callout

**Use Case:** Draw attention to information with a distinctive background and emoji/icon.

**Semantic Element:** `<aside>` (with role="note")

**Child Elements:**
- Any block type (paragraphs, lists, code, etc.)
- `<i>` with Remix icon class (icon indicator)

**Attributes/Parameters:**
- `icon` - Emoji or icon class
- `color` - Background color variant

**Lifecycle:**
1. Created via `/callout`
2. Icon clickable to change
3. Color picker for variant

**Update Rules:**
- Children can be any block type
- Icon and color independently configurable

---

### Code

**Use Case:** Display code snippets with syntax highlighting.

**Semantic Elements:** `<pre>` + `<code>`

**Child Elements:**
- `<code>` - Code content (text only)

**Attributes/Parameters:**
- `language` - Programming language for highlighting
- `caption` - Optional description

**Lifecycle:**
1. Created via `/code` or ``` shortcut
2. Language selector for syntax
3. Copy button on hover

**Update Rules:**
- Content is plain text (no rich formatting)
- Language change re-highlights

---

### Equation

**Use Case:** Display mathematical formula using LaTeX/KaTeX syntax.

**Semantic Element:** `<span>` with KaTeX class

**Child Elements:** None (self-contained)

**Attributes/Parameters:**
- `expression` - LaTeX/KaTeX string
- `inline` (boolean) - Inline vs display mode

**Lifecycle:**
1. Created via `/equation` or `$$` shortcut
2. Renders in real-time as user types
3. Block mode centers and scales

**Update Rules:**
- Re-renders on expression change
- Invalid LaTeX shows error state

---

### Divider

**Use Case:** Insert horizontal rule to visually separate content sections.

**Semantic Element:** `<hr>`

**Child Elements:** None

**Attributes/Parameters:** None

**Lifecycle:**
1. Created via `/divider` or `---` shortcut
2. Instant, no configuration

**Update Rules:**
- Static, no updates needed

---

### Table of Contents

**Use Case:** Auto-generate navigation index of headings on the current page.

**Semantic Element:** `<nav>` with `<ol>`

**Child Elements:**
- `<li>` containing `<a>` links to headings

**Attributes/Parameters:**
- `depth` - Maximum heading level to include

**Lifecycle:**
1. Created via `/table_of_contents`
2. Auto-scans headings on render
3. Updates when headings change

**Update Rules:**
- Auto-regenerates on DOM mutation
- Links use heading IDs for anchor navigation

---

## List & Interactive Components

### Bulleted List

**Use Case:** Create unordered lists for items without specific sequence.

**Semantic Element:** `<ul>` with `<li>`

**Child Elements:**
- `<li>` - List items
- Nested `<ul>` for sub-lists
- Rich text inside `<li>`

**Attributes/Parameters:**
- `color` - Text color

**Lifecycle:**
1. Created via `/bullet` or `-` shortcut
2. Enter creates new item
3. Tab indents (creates nested list)
4. Backspace at start outdents or merges

**Update Rules:**
- Indentation via Tab/Shift+Tab
- Drag to reorder

---

### Numbered List

**Use Case:** Create ordered lists for steps, sequences, or prioritized items.

**Semantic Element:** `<ol>` with `<li>`

**Child Elements:**
- `<li>` - List items (auto-numbered)
- Nested `<ol>` for sub-steps

**Attributes/Parameters:**
- `start` - Starting number
- `type` - Numbering style (1, a, A, i, I)

**Lifecycle:**
1. Created via `/numbered` or `1.` shortcut
2. Numbers auto-increment
3. Renumber on insert/delete

**Update Rules:**
- Auto-renumbers on structural changes
- Maintains sequence across edits

---

### To-Do

**Use Case:** Create interactive checkboxes for task management and tracking.

**Semantic Element:** `<li>` with `<input type="checkbox">`

**Child Elements:**
- `<input type="checkbox">` - Toggle state
- `<label>` or `<span>` - Task text

**Attributes/Parameters:**
- `checked` (boolean) - Completion state
- `color` - Text color when checked

**Lifecycle:**
1. Created via `/todo` or `[]` shortcut
2. Click toggles checked state
3. Checked items get strikethrough

**Update Rules:**
- State persists across sessions
- Batch toggle via parent list

---

### Toggle

**Use Case:** Create collapsible content that reveals details when clicked.

**Semantic Element:** `<details>` with `<summary>`

**Child Elements:**
- `<summary>` - Toggle title (always visible)
- Any block type inside (hidden when collapsed)

**Attributes/Parameters:**
- `open` (boolean) - Default expanded state
- `color` - Text color

**Lifecycle:**
1. Created via `/toggle`
2. Click summary to expand/collapse
3. Children preserved in DOM when collapsed

**Update Rules:**
- Open state persists
- Children editable when expanded

---

### Synced Block

**Use Case:** Create reusable content block that updates everywhere when changed.

**Semantic Element:** `<div>` with sync data attribute

**Child Elements:**
- Any block type (content to sync)

**Attributes/Parameters:**
- `synced_block_id` - Reference to original
- `synced_from` - Source block reference

**Lifecycle:**
1. Created via `/synced_block`
2. Edit in any location updates all instances
3. Original can be deleted (copies remain)

**Update Rules:**
- Changes propagate to all synced instances
- Bidirectional sync

---

## Media Components

### Image

**Use Case:** Insert images from file upload or external URL.

**Semantic Element:** `<figure>` with `<img>`

**Child Elements:**
- `<img>` - Image element
- `<figcaption>` - Caption text

**Attributes/Parameters:**
- `src` - Image URL or base64
- `alt` - Alt text (required)
- `width` / `height` - Dimensions
- `caption` - Display caption

**Lifecycle:**
1. Created via `/image` or drag-drop
2. Upload or URL input
3. Resize handles on select

**Update Rules:**
- Caption editable inline
- Crop/resize via handles

---

### Video

**Use Case:** Embed video files or external video links.

**Semantic Element:** `<video>`

**Child Elements:**
- `<source>` - Video source

**Attributes/Parameters:**
- `src` - Video URL
- `controls` - Show playback controls
- `autoplay` - Auto-play on load
- `loop` - Loop playback
- `caption` - Description

**Lifecycle:**
1. Created via `/video` or embed URL
2. Controls appear on hover
3. Fullscreen option available

**Update Rules:**
- Source URL can be changed
- Poster image configurable

---

### Audio

**Use Case:** Embed audio files for playback.

**Semantic Element:** `<audio>`

**Child Elements:**
- `<source>` - Audio source

**Attributes/Parameters:**
- `src` - Audio URL
- `controls` - Show playback controls
- `autoplay` - Auto-play
- `loop` - Loop playback

**Lifecycle:**
1. Created via `/audio` or drag-drop
2. Inline player with waveform

**Update Rules:**
- Source URL can be changed

---

### File

**Use Case:** Attach a file for download, supporting any file type.

**Semantic Element:** `<a>` with download attribute

**Child Elements:**
- `<i>` - File type icon
- Text - File name and size

**Attributes/Parameters:**
- `file` - Uploaded file reference
- `external` - External URL
- `name` - Display name
- `caption` - Description

**Lifecycle:**
1. Created via `/file` or drag-drop
2. Shows file icon, name, size
3. Click downloads

**Update Rules:**
- Name editable
- Can be re-uploaded

---

### Bookmark

**Use Case:** Create rich link preview for an external URL.

**Semantic Element:** `<a>` with preview container

**Child Elements:**
- `<img>` - Preview thumbnail
- `<strong>` - Page title
- `<p>` - Description

**Attributes/Parameters:**
- `url` - Target URL (required)
- `caption` - Custom caption

**Lifecycle:**
1. Created via `/bookmark` or paste URL
2. Fetches preview metadata
3. Renders thumbnail + title + description

**Update Rules:**
- URL change re-fetches preview
- Caption overrides fetched title

---

### Embed

**Use Case:** Embed content from external service (Google Maps, Figma, etc.).

**Semantic Element:** `<iframe>`

**Child Elements:** None

**Attributes/Parameters:**
- `url` - Embed source URL (required)
- `type` - Service type for styling

**Lifecycle:**
1. Created via `/embed` or paste embed URL
2. Renders iframe with service content
3. Responsive scaling

**Update Rules:**
- URL change re-loads embed
- Aspect ratio configurable

---

## Database Components

### Table (Database)

**Use Case:** Create a simple grid table with rows and columns.

**Semantic Element:** `<table>`

**Child Elements:**
- `<thead>` with `<th>` - Header row
- `<tbody>` with `<tr>` and `<td>` - Data rows
- `<tfoot>` - Footer row
- `<caption>` - Table description

**Attributes/Parameters:**
- `table_width` - Number of columns
- `has_column_header` - Show header row
- `has_row_header` - First column as headers

**Lifecycle:**
1. Created via `/table` or `|` shortcut
2. Column count set on creation
3. Rows added via Enter
4. Columns added via tab at last cell

**Update Rules:**
- Row/column insert/delete
- Drag to reorder rows
- Sort by column

---

### Board (Kanban)

**Use Case:** Create Kanban-style board view of a database.

**Semantic Element:** `<section>` with columns

**Child Elements:**
- Column sections (Todo, In Progress, Done)
- Card items within columns

**Attributes/Parameters:**
- `group_by` - Property to group by
- `source_database` - Reference to data source

**Lifecycle:**
1. Created from database view
2. Cards draggable between columns
3. New columns added via +

**Update Rules:**
- Card movement updates status property
- Column changes reflected in data

---

### Gallery

**Use Case:** Create gallery view showing grid of items.

**Semantic Element:** `<section>` with `<figure>` grid

**Child Elements:**
- `<figure>` - Card container
- `<img>` - Cover image
- `<figcaption>` - Card title

**Attributes/Parameters:**
- `source_database` - Data source
- `card_size` - small/medium/large
- `show_cover` - Display cover image

**Lifecycle:**
1. Created from database view
2. Grid layout auto-adjusts
3. Click opens full card

**Update Rules:**
- Cover images update from data
- Card order configurable

---

### Calendar

**Use Case:** Create calendar view with dates.

**Semantic Element:** `<table>` with date grid

**Child Elements:**
- `<th>` - Day headers
- `<td>` - Date cells with events

**Attributes/Parameters:**
- `date_property` - Which property holds dates
- `source_database` - Data source

**Lifecycle:**
1. Created from database view
2. Events shown on dates
3. Click date to create/edit event

**Update Rules:**
- Events update from data
- Month navigation

---

### Timeline

**Use Case:** Create Gantt chart timeline view.

**Semantic Element:** `<div>` with bar chart layout

**Child Elements:**
- Bar elements (task duration)
- Label elements (task names)

**Attributes/Parameters:**
- `date_range` - Start/end date properties
- `group_by` - Grouping property
- `source_database` - Data source

**Lifecycle:**
1. Created from database view
2. Bars represent task duration
3. Drag to adjust dates

**Update Rules:**
- Bar length reflects duration
- Dependencies shown as connectors

---

## Layout Components

### Column List

**Use Case:** Create multi-column layout container.

**Semantic Element:** `<div>` with flex/grid

**Child Elements:**
- 2-5 `<div>` column containers

**Attributes/Parameters:**
- `column_count` - Number of columns (2-5)
- `ratio` - Column width ratios

**Lifecycle:**
1. Created via `/column_list`
2. Default 2 columns
3. Add/remove columns via handles

**Update Rules:**
- Column count adjustable
- Width ratios draggable

---

### Column

**Use Case:** Define single column within column_list.

**Semantic Element:** `<div>` (column container)

**Child Elements:**
- Any block type

**Attributes/Parameters:** None (inherited from parent)

**Lifecycle:**
1. Created as part of column_list
2. Content added inside
3. Width adjustable

**Update Rules:**
- Can contain any block type
- Width adjusts with ratio

---

### Child Page

**Use Case:** Create nested page within current page.

**Semantic Element:** `<a>` linking to child page

**Child Elements:**
- Icon + title text

**Attributes/Parameters:**
- `page_id` - Reference to child page
- `title` - Display title

**Lifecycle:**
1. Created via `/child_page`
2. Opens new page on click
3. Shows in sidebar navigation

**Update Rules:**
- Title reflects child page title
- Deleting parent moves children up

---

### Link to Page

**Use Case:** Create link to existing page in workspace.

**Semantic Element:** `<a>` with page reference

**Child Elements:**
- Icon + title text

**Attributes/Parameters:**
- `target_page_id` - Page to link to
- `label` - Custom display text

**Lifecycle:**
1. Created via `/link_to_page`
2. Search for target page
3. Click navigates to page

**Update Rules:**
- If target deleted, link shows broken state
- Label editable

---

## Form Components

### Text Input

**Use Case:** Single-line text entry.

**Semantic Element:** `<input type="text">`

**Attributes:**
- `placeholder` - Hint text
- `value` - Current value
- `required` - Validation
- `maxlength` - Character limit

---

### Select Control

**Use Case:** Dropdown selection from predefined options.

**Semantic Element:** `<select>` with `<option>`

**Attributes:**
- `options` - Array of choices
- `value` - Selected value
- `placeholder` - Default text

---

### Checkbox Control

**Use Case:** Binary toggle selection.

**Semantic Element:** `<input type="checkbox">`

**Attributes:**
- `checked` - Boolean state
- `label` - Associated text

---

### Button

**Use Case:** Trigger action on click.

**Semantic Element:** `<button>`

**Attributes:**
- `label` - Button text
- `action` - Function to execute
- `variant` - primary/secondary/ghost
- `disabled` - Interaction state

---

## Status Components

### Progress Bar

**Use Case:** Show completion percentage.

**Semantic Element:** `<progress>`

**Attributes:**
- `value` - Current progress (0-100)
- `max` - Maximum value (default 100)

---

### Status Badge

**Use Case:** Show current status with color.

**Semantic Element:** `<span>` with color class

**Attributes:**
- `status` - active/completed/pending/error
- `color` - Visual indicator

---

## Navigation Components

### Breadcrumb

**Use Case:** Show page location in hierarchy.

**Semantic Element:** `<nav>` with `<ol>`

**Child Elements:**
- `<li>` with `<a>` links

---

### Tab Bar

**Use Case:** Switch between open documents.

**Semantic Element:** `<nav>` with `<menu>`

**Child Elements:**
- `<li>` with `<a>` (tab item)
- Close icon per tab

---

## Update Protocol

All components follow this update pattern:

1. **User Action** -> Event captured
2. **State Change** -> DOM updated
3. **Sync** -> If synced block, propagate changes
4. **Persist** -> Save to storage
5. **Audit** -> Log change for undo/redo

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2026-08-25 | Initial component library |
