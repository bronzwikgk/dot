# Shared Browser Runtime Utility

## File

`code/utilities/code_shared_browser_runtime_v4_0_0_draft.js`

## What It Is

The shared browser runtime utility controls application boot markers, mount
target checks, default view frame resolution, listener attachment, page errors,
and browser readiness reports.

## What It Does

It exposes:

- `load_definition_file(config)`
- `resolve_mount_target(config)`
- `create_app_instance(config)`
- `resolve_default_view_frame(config)`
- `resolve_default_listeners(config)`
- `attach_listener(config)`
- `write_boot_marker(config)`
- `report_boot_error(config)`
- `wait_app_ready(config)`
- `record_boot_marker(config)`
- `record_page_error(config)`
- `guard_benchmark(config)`
- `create_browser_test_report(config)`

## When To Use It

Use it when browser entry code must prove that the app mounted correctly before
tests, benchmarks, or user workflows continue.

## Runtime Contract

- Missing mount target returns a structured error.
- Failed boot never reports ready.
- Duplicate listener attachment is prevented.
- Boot markers distinguish `started`, `ready`, and `failed`.
- Browser reports include status, page error count, browser, and viewport data.

## How It Was Tested

Focused Node tests cover definition loading, mount target failure, ready and
failed boot markers, duplicate listener prevention, benchmark short-circuit, and
browser test report failure on page errors.
