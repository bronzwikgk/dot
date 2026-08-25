// datatable_gui_components_v1.js
// Attributes and properties for each component

export const datatable_component_attributes = {
    // ===== HEADER =====
    brand_name: { tag: "h1", text: "an app", id: "brand" },
    nav_menu: { tag: "nav", id: "menu_bar" },
    search_form: { tag: "form", role: "search", placeholder: "Search..." },
    window_controls: { tag: "section", id: "window_controls" },

    // ===== NAV MENU =====
    file_menu: { label: "File", has_dropdown: true },
    edit_menu: { label: "Edit", has_dropdown: true },
    insert_menu: { label: "Insert", has_dropdown: true },
    run_menu: { label: "Run", has_dropdown: true },
    view_menu: { label: "View", has_dropdown: true },
    help_menu: { label: "Help", has_dropdown: true },

    // ===== FILE MENU ITEMS =====
    new_book: { label: "New Book", icon: "ri-add-circle-line" },
    new_from_templates: { label: "New from Templates", icon: "ri-layout-grid-line" },
    import: { label: "Import", icon: "ri-upload-2-line" },
    export: { label: "Export", icon: "ri-download-2-line" },
    save: { label: "Save", icon: "ri-save-line" },
    settings: { label: "Settings", icon: "ri-settings-3-line" },

    // ===== EDIT MENU ITEMS =====
    undo: { label: "Undo", icon: "ri-arrow-go-back-line" },
    redo: { label: "Redo", icon: "ri-arrow-go-forward-line" },
    move_cell_up: { label: "Move Cell Up", icon: "ri-arrow-up-line" },
    move_cell_down: { label: "Move Cell Down", icon: "ri-arrow-down-line" },
    delete_cell: { label: "Delete Cell", icon: "ri-delete-bin-line" },

    // ===== INSERT MENU ITEMS =====
    text_cell: { label: "Text Cell", icon: "ri-markdown-line" },
    pipeline_cell: { label: "Pipeline Cell", icon: "ri-terminal-box-line" },
    code_cell: { label: "Code Cell", icon: "ri-code-line" },
    component: { label: "Component", icon: "ri-layout-masonry-line" },
    filter: { label: "Filter", icon: "ri-filter-3-line" },

    // ===== RUN MENU ITEMS =====
    run_active: { label: "Run Active", icon: "ri-play-line" },
    run_selected: { label: "Run Selected", icon: "ri-play-circle-line" },
    run_all: { label: "Run All", icon: "ri-play-circle-line" },
    execute_dag: { label: "Execute DAG", icon: "ri-node-tree" },
    execute_flow: { label: "Execute Flow", icon: "ri-play-circle-line" },
    reset: { label: "Reset", icon: "ri-eraser-line" },

    // ===== VIEW MENU ITEMS =====
    jupyter_layout: { label: "Jupyter Layout", icon: "ri-terminal-box-line" },
    notion_layout: { label: "Notion Layout", icon: "ri-layout-masonry-line" },
    vscode_layout: { label: "VSCode Layout", icon: "ri-code-s-slash-line" },
    flow_builder: { label: "Flow Builder", icon: "ri-node-tree" },
    toggle_sidebar: { label: "Toggle Sidebar", icon: "ri-side-bar-line" },

    // ===== HELP MENU ITEMS =====
    about: { label: "About", icon: "ri-information-line" },
    getting_started: { label: "Getting Started", icon: "ri-lightbulb-line" },
    api_docs: { label: "API Docs", icon: "ri-book-open-line" },

    // ===== WINDOW CONTROLS =====
    minimize: { label: "Minimize", icon: "ri-subtract-line" },
    maximize: { label: "Maximize", icon: "ri-checkbox-blank-line" },
    close: { label: "Close", icon: "ri-close-line" },

    // ===== ASIDE SECTIONS =====
    quick_access: { title: "Quick Access" },
    explorer: { title: "Explorer" },
    templates: { title: "Templates" },
    tags: { title: "Tags" },
    trash: { title: "Trash" },

    // ===== QUICK ACCESS ITEMS =====
    favorites: { label: "Favorites", icon: "ri-star-line" },
    recent: { label: "Recent", icon: "ri-history-line" },
    archived: { label: "Archived", icon: "ri-archive-line" },

    // ===== EXPLORER ITEMS =====
    component_library: { label: "Component Library", icon: "ri-file-text-line" },
    getting_started: { label: "Getting Started", icon: "ri-file-text-line" },
    api_reference: { label: "API Reference", icon: "ri-file-code-line" },

    // ===== TEMPLATE ITEMS =====
    notebook: { label: "Notebook", icon: "ri-layout-grid-line" },
    code: { label: "Code", icon: "ri-file-code-line" },
    flow: { label: "Flow", icon: "ri-flow-chart-line" },
    meeting_notes: { label: "Meeting Notes", icon: "ri-file-text-line" },

    // ===== TAG ITEMS =====
    reference: { label: "Reference", icon: "ri-price-tag-3-line" },
    draft: { label: "Draft", icon: "ri-price-tag-3-line" },

    // ===== TRASH ITEMS =====
    deleted_items: { label: "Deleted Items", icon: "ri-delete-bin-line" },

    // ===== ARTICLE TABS =====
    component_library_tab: { label: "Component Library", icon: "ri-file-text-line", has_close: true },
    getting_started_tab: { label: "Getting Started", icon: "ri-projector-2-line", has_close: true },

    // ===== COLLECTIONS =====
    page_title: { h1: "Component Library", p: "Reference of all semantic block types." },
    text_blocks: { h2: "Text Blocks" },
    list_blocks: { h2: "List Blocks" },
    media_blocks: { h2: "Media Blocks" },
    database_blocks: { h2: "Database Blocks" },
    form_blocks: { h2: "Form Blocks" },
    layout_blocks: { h2: "Layout Blocks" },
    team_updates: { h2: "Team Updates" },

    // ===== TEXT BLOCK ITEMS =====
    paragraph: { h3: "Paragraph", content: "Default text block for content." },
    headings: { h3: "Headings", content: "h1, h2, h3, h4, h5, h6" },
    quote: { h3: "Quote", content: "Blockquote with citation" },
    code: { h3: "Code", content: "Code block with syntax" },

    // ===== LIST BLOCK ITEMS =====
    bulleted_list: { h3: "Bulleted List", items: ["Item one", "Item two", "Item three"] },
    numbered_list: { h3: "Numbered List", items: ["Step one", "Step two"] },
    todo_list: { h3: "To-Do", items: [{ text: "Done", state: "done" }, { text: "Pending", state: "pending" }] },
    toggle: { h3: "Toggle", content: "Collapsible content" },

    // ===== MEDIA BLOCK ITEMS =====
    image: { h3: "Image", src: "https://picsum.photos/800/400", alt: "Sample", caption: "Sample image" },
    video: { h3: "Video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    audio: { h3: "Audio", src: "https://www.w3schools.com/html/horse.mp3" },
    file: { h3: "File", name: "document.pdf", icon: "ri-file-download-line" },
    embed: { h3: "Embed", src: "https://www.openstreetmap.org/export/embed.html" },

    // ===== DATABASE BLOCK ITEMS =====
    table: { h3: "Table", columns: ["Name", "Status", "Due"], rows: [["Design", "Done", "Sep 1"], ["Dev", "Progress", "Sep 15"]] },
    board: { h3: "Board", columns: ["Todo", "In Progress", "Done"] },
    calendar: { h3: "Calendar", days: ["S", "M", "T", "W", "T", "F", "S"] },
    timeline: { h3: "Timeline", items: [{ task: "Research", progress: 100 }, { task: "Design", progress: 60 }] },

    // ===== FORM BLOCK ITEMS =====
    contact_form: { h3: "Contact", fields: ["Name", "Message"], button: "Send" },
    progress_bars: { h3: "Progress", value: 75, max: 100, label: "75% complete" },

    // ===== LAYOUT BLOCK ITEMS =====
    breadcrumb: { h3: "Breadcrumb", items: ["Home", "Library"] },
    child_page: { h3: "Child Page", label: "Requirements", icon: "ri-file-text-line" },

    // ===== TEAM UPDATE ITEMS =====
    design_system_v2: { h3: "Design v2.0", author: "Sarah", time: "Today", content: "New design system released." },
    q3_performance: { h3: "Q3 Review", author: "Mike", time: "Yesterday", content: "15% growth in engagement." },

    // ===== FOOTER =====
    app_footer: { p: "An App v1.0", links: ["Privacy", "Terms"] },
    book_footer: { p: "Component Library", time: "Aug 25, 2026" }
};
