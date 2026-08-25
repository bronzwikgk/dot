# V4 Contract 004: Search And Status

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_011, v4_missing_015, v4_missing_020

## Goal

Add global search, hit navigation, and status/error reporting as entity-backed
surface behavior.

## Required Entities

- search_state
- search_hit
- status_surface
- status_message
- error_notice

## Required Methods

- search_workspace(config)
- mark_search_hits(config)
- clear_search_hits(config)
- move_to_next_hit(config)
- update_status(config)
- report_error_status(config)

## Success Criteria

- search count is visible
- Enter cycles through hits
- clear removes hit markers
- storage and boot errors appear in status surface
- status messages are structured records

## Tests

- search unit tests
- browser search e2e
- status/error e2e

## Do Not

- do not store search state only in DOM classes
- do not hide storage errors in console-only output
