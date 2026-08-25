# Shared Product Surface Plugin

## File

`code/plugins/code_shared_product_surface_v3_0_0_draft.js`

## What It Is

The shared product surface plugin turns approved templates and application
entities into visible builder models, command surfaces, editor surfaces, preview
paths, and layout projections.

## Browser Surface

The static browser surface lives in `html/product_surface`.

The browser surface now declares:

- mount target `an_app_mount`
- boot marker `__an_app_boot_marker__`
- started, ready, and failed boot states
- global workspace search input
- search count and active hit marker
- browser command records for action, selector, and keyboard resolution
- notebook cell workspace with rail, editor, output, and focus restore
- run-all cell execution path with DAG-shaped task order
- layout parity tabs for notebook, code editor, block editor, tree, table,
  board, calendar, timeline, diagram, and dashboard
- browser workspace persistence for selected template, layout, and active cell
- keyboard undo/redo through version checkpoint records

## When To Use It

Use it when An App needs to create or inspect an application builder surface,
template preview, or same-data layout projection.

## Layout Parity

Use `create_layout_projection`, `validate_layout_name`, `render_layout`,
`switch_layout`, and `compare_layout_output` to prove approved layout names,
same source entity id preservation, and no source entity mutation during layout
switches.

## Runtime Contract

- Templates must use approved template domains.
- Application routes must start with `/`.
- Layout and render profile names must be approved.
- Browser entry must write boot markers and must not report ready after failed
  boot.

## How It Was Tested

Product-surface plugin tests validate datasets, templates, application
instantiation, route validation, layout projections, and e2e contract creation.
Visible surface tests validate required hooks, class-based controller shape,
mount target, boot marker strings, search hooks, search markers, and responsive
CSS guards.

Browser e2e tests validate Chromium boot readiness, page error capture, search
result count, hit navigation, keyboard execution, focus preservation, desktop
rail layout, mobile stacking, run-all keyboard execution, and all required
layout projections. Reload persistence and Ctrl+Z/Ctrl+Y undo/redo are also
validated in the browser e2e path.
