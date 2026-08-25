# Shared Search Status Utility

## File

`code/utilities/code_shared_search_status_v4_0_0_draft.js`

## What It Is

The shared search status utility stores search state, search hits, active hit
navigation, and structured status messages.

## What It Does

It exposes:

- `search_workspace(config)`
- `mark_search_hits(config)`
- `clear_search_hits(config)`
- `move_to_next_hit(config)`
- `update_status(config)`
- `report_error_status(config)`

## Runtime Contract

- Search state is stored as a record, not only as DOM classes.
- Search count is available from returned state.
- Next-hit navigation wraps around.
- Status and error messages are structured records.
- Every result returns `{ ok, data, errors }`.

## How It Was Tested

Focused Node tests cover search result counts, hit marking, hit navigation,
clear behavior, and error status records.
