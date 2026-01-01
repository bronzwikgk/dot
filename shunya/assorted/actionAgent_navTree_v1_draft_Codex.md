---
version: v1
status: draft
agent: Codex
project: ActionApp
---

# actionAgent_nav_tree

The ActionApp navigation tree now limits itself to the four UI nodes that define the actionAgent experience, enriched with the learned affordances for spacing, keyboard control, and rich responses.

## Tree Overview
- **App Icon**
  - Bottom-right circular toggle button that shows the hover tooltip text "Hover for instructions ƒ?› click to open chat."
  - Tooltip pseudo-element positioned directly above the icon with instructions and hover animation.
  - Drag handle interactions with pointer movement, `dragThreshold`, and `localStorage` persistence of `right`/`bottom` coordinates.
  - Accessibility states (`aria-expanded`, `aria-hidden`, screen-reader helper `[data-sr-only]` text).
  - Visual feedback such as focus-border highlight and `cursor: grab` mirrors modern chat affordances.
- **Chat Panel**
  - Section container holding the actionAgent header, canned introduction, message log, and controls.
  - Header elements (title `h2`, subtitle `p`, optional status badges) frame the conversation context.
  - Panel shell floats above the icon with rounded corners, soft background fill, and entry/exit transitions.
  - Toggle stays under icon control while drag detection prevents accidental opens.
  - Behaves like a lightweight terminal surface: click to open, stays open for the conversation, and closes when idle.
- **Request Panel**
  - Form area nested inside the Chat Panel with label, single-line text input, and Send button.
  - Input portal provides placeholder guidance, focus styling, and `name="action-message"` semantics.
  - Keyboard controls: Enter submits the message, Shift+Enter adds a newline, and empty submissions are blocked for clearer validation.
  - Submission clears the field, adds a bubble to the Response Panel, and auto-scrolls to the latest entry.
  - The Send button echoes Copilot/ChatGPT controls through tooltip hints and accessible labeling so that users feel the same flow.
- **Response Panel**
  - Message log displaying request/response bubbles tagged with `data-action-message`.
  - Scrollable container with max-height, breathing room, and padding for readability.
  - Bubbles styled via semantic CSS tokens (overlay background, softened rounding, refined typography).
  - `aria-live` announcements keep focus-friendly spacing, making new responses obvious.
  - Supports formatting helpers and attachment cues inspired by Copilot/ChatGPT to keep responses rich and actionable.

This tree keeps the ActionApp nav focused on the actionable elements that link the icon, chat context, user requests, and agent responses together.
