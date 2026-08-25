# V4 Contract 006: Browser E2E Gate

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_005, v4_missing_013, v4_missing_018

## Goal

Create the browser validation gate for boot success, boot failure, page errors,
readiness markers, and benchmark/test short-circuit behavior.

## Required Entities

- boot_marker
- browser_test_run
- page_error
- readiness_record
- benchmark_guard

## Required Methods

- wait_app_ready(config)
- record_boot_marker(config)
- record_page_error(config)
- guard_benchmark(config)
- create_browser_test_report(config)

## Success Criteria

- failed boot never reports ready
- page errors fail health test
- benchmark stops when readiness fails
- health e2e proves command registry exists
- validation report records browser and viewport data

## Tests

- browser health e2e
- boot failure e2e
- page error capture test

## Do Not

- do not rely on manual visual checking alone
- do not hide page errors as warnings
