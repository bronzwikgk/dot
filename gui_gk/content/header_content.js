// header_content.js - Header content data
export const header_content = {
    brand: {
        tag: "h1",
        id: "brand",
        text: "an app"
    },
    nav_items: [
        { label: "File", icon: null, children: [
            { label: "New Book", icon: "ri-add-circle-line" },
            { label: "Templates", icon: "ri-layout-grid-line" },
            { type: "separator" },
            { label: "Import", icon: "ri-upload-2-line" },
            { label: "Export", icon: "ri-download-2-line" },
            { type: "separator" },
            { label: "Save", icon: "ri-save-line" },
            { label: "Settings", icon: "ri-settings-3-line" }
        ]},
        { label: "Edit", icon: null, children: [
            { label: "Undo", icon: "ri-arrow-go-back-line" },
            { label: "Redo", icon: "ri-arrow-go-forward-line" },
            { type: "separator" },
            { label: "Delete", icon: "ri-delete-bin-line" }
        ]},
        { label: "View", icon: null, children: [
            { label: "Notion", icon: "ri-layout-masonry-line" },
            { label: "Code", icon: "ri-code-s-slash-line" },
            { label: "Flow", icon: "ri-node-tree" }
        ]}
    ],
    search_placeholder: "Search...",
    window_controls: ["Minimize", "Maximize", "Close"]
};
