# V4 Contract 012: Entry Mount View Frame

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`
Related backlog: v4_missing_037, v4_missing_040

## Goal

Define how browser entry code loads an app definition file, creates the app shell
instance, resolves default listeners and view frame, and mounts the application
into the configured element id.

## Required Entities

- browser_entry
- mount_target
- view_frame
- listener_record
- default_flow
- boot_marker

## Required Methods

- load_definition_file(config)
- resolve_mount_target(config)
- create_app_instance(config)
- resolve_default_view_frame(config)
- resolve_default_listeners(config)
- attach_listener(config)
- write_boot_marker(config)
- report_boot_error(config)

## Success Criteria

- missing mount target fails with structured error
- entry code never reports ready after failed boot
- default listeners attach once
- view frame renders without overlap on desktop/mobile
- boot markers distinguish started, ready, and failed states

## Tests

- static entry validation
- browser boot success e2e
- browser boot failure e2e
- duplicate listener prevention test
- mount target missing test

## Do Not

- do not use unowned globals except approved boot markers
- do not mount into arbitrary elements not declared in the definition file
