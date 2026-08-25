# V4 Contract 012: Entry, Mount, and View Frame

Date: 2026-08-25
Status: active
Owner agent: agent_codex_an_app
Priority: p1
Domain: foundation_and_runtime

## Purpose

Define browser entry file, mount target, default view frame, and default listeners.

## Required Records

- entry_record
- mount_target_record
- view_frame_record
- listener_record

## Required Operations

- load_entry
- mount_app
- resolve_view_frame
- resolve_listeners

## Inputs

- entry_ref
- mount_ref
- view_frame_ref

## Outputs

- entry_record
- mount_target_record

## Validation

- entry loads definition
- shell boots correctly
- mount target resolves
- view frame resolves

## Success Criteria

- browser entry loads definition
- boots shell
- mounts into configured element id
- default listeners work

## Do

- use entity doctrine for entry/mount
- validate mount target
- resolve view frame at boot

## Do Not

- do not skip entry validation
- do not mount to invalid target
- do not bypass view frame resolution
