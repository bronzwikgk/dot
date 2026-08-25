# code_shared_v4_ui_surface.md

**Version:** v4.0.0
**Status:** active
**Owner:** agent_codex_an_app
**Merged from:** command_registry, editor_focus, book_cell_operations, search_status, layout_parity, guided_tour, canvas_interaction, listener_view_frame

## What It Is

V4 UI surface modules: command registry, editor/focus, book/cell, search/status, layout parity, guided tour, canvas interaction, listener/view frame.

## Components

### command_registry
Unified command registry binding data-action attributes, selectors, keyboard combos, and methods.

### editor_focus
Edit/command mode gating, focus state capture/restore, keyboard policy.

### book_cell_operations
Live book/cell create, move, remove, render operations.

### search_status
Global search with hit marking, count, cycling, and status surface.

### layout_parity
Validates same entity data renders in all 10 core layouts without data loss.

### guided_tour
Tour entity with step navigation, highlight policy, and tour lifecycle.

### canvas_interaction
Canvas drag/drop, chain execution, node management.

### listener_view_frame
Listener entity, event binding map, view_frame definition.

## Runtime Contract

- all UI names from approved datasets
- snake_case naming
- command registry validates before registering
- focus preservation across renders
- layout parity proves no data loss

## Related Files

- code/utilities/code_shared_command_registry_v4_0_0_draft.js
- code/utilities/code_shared_editor_focus_v4_0_0_draft.js
- code/utilities/code_shared_book_cell_operations_v4_0_0_draft.js
- code/utilities/code_shared_search_status_v4_0_0_draft.js
- code/utilities/code_shared_layout_parity_v4_0_0_draft.js
- code/utilities/code_shared_guided_tour_v4_0_0_draft.js
- code/utilities/code_shared_canvas_interaction_v4_0_0_draft.js
- code/utilities/code_shared_listener_view_frame_v4_0_0_draft.js
