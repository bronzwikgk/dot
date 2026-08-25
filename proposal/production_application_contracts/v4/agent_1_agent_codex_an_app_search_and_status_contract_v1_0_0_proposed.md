# V4 Contract 004: Search and Status Surface

Date: 2026-08-25
Status: active
Owner agent: agent_codex_an_app
Priority: p0
Domain: product_surface

## Purpose

Define global search with hit marking, count, cycling, and status surface for error display.

## Required Records

- search_state_record
- search_result_record
- status_surface_record
- error_record

## Required Operations

- search
- mark_hits
- cycle_results
- clear_search
- display_status
- display_error

## Inputs

- search_query
- search_context
- error_ref

## Outputs

- search_state_record
- search_result_record
- status_surface_record

## Validation

- search results are accurate
- hit count matches results
- cycling wraps correctly
- errors are displayed in status surface

## Success Criteria

- hit marking works
- count is accurate
- next/previous cycling works
- clear resets state
- storage errors appear in status

## Do

- use entity doctrine for search state
- preserve search context across renders
- surface errors in status bar

## Do Not

- do not show stale results
- do not lose search context on render
- do not hide errors from status
