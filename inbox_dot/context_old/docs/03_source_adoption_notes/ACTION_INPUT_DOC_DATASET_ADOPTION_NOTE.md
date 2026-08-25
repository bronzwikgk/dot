# Action Input Doc Dataset Adoption Note

## Scope

Reviewed selected requirement, docs, changelog, and panel files from
`input_temp/b6/actionInput`.

This pass focused on UI naming, input surfaces, panels, accessibility,
configuration, persistence, and interaction rules.

## Files Reviewed

- `input_temp/b6/actionInput/actionInput.txt`
- `input_temp/b6/actionInput/actionInput_reequirnment.txt`
- `input_temp/b6/actionInput/actionInput_ui_frames.txt`
- `input_temp/b6/actionInput/actionPanels.txt`
- `input_temp/b6/actionInput/docs/actionInput/docs_actionInput_v002.md`
- `input_temp/b6/actionInput/docs/actionInput/CHANGELOG_actionInput.md`

## What This Folder Is About

This folder describes a reusable application input surface.

In simple English:

- an application has a floating input trigger
- the trigger opens menu actions
- a chat room panel can open near the trigger
- panels can be moved, minimized, maximized, restored, and closed
- the interface uses semantic markup and ARIA
- positions and theme choices persist
- labels, recent items, trash, notes, screen capture, and recording are panel
  concepts

This is useful for An App UI layout and An Bot chat surfaces.

## Adopted Concepts

### Input Surface Entities

UI entity names to approve:

- input surface
- input trigger
- action menu
- chat room
- chat session
- message composer
- sidebar
- recent list
- label list
- trash list
- notes panel
- screen capture action
- screen recording action
- toolbar

### Interaction Requirements

Required interactions:

- drag
- persist position
- open on hover
- delayed open
- pointer-safe close
- minimize
- maximize
- restore
- close
- toggle sidebar
- collapse section
- expand section

### Accessibility And Structure

Required rules:

- semantic markup
- ARIA labels
- pointer cursor on interactive controls
- keyboard-safe controls
- token-driven visual values
- reset styling
- no generic naming
- versioned file names

### Configuration Fields

Required config groups:

- behavior
- theme
- position
- menu labels
- tool definitions
- chat messages
- sidebar sections
- persistence keys

## Dataset Additions Needed

Add or extend 1D arrays for:

- input surface entity names
- input interaction names
- panel control names
- sidebar section names
- quick action names
- persistence field names
- UI requirement status names
- accessibility requirement names

## Documentation Updates Needed

1. `APPLICATION_ENTITY_DOCTRINE.md`
   - Add input surface and panel entities.
   - Add position persistence as UI state.

2. UI datasets
   - Add approved input surface and panel names.

3. `AN_BOT_SCOPE_REQUIREMENTS.md`
   - Add chat room, message composer, and context action surfaces.

## Decision

Adopt the UI surface and interaction concepts. Do not copy old branding names
as canonical names.
