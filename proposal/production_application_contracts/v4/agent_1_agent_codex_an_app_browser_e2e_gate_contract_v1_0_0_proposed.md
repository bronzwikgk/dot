# V4 Contract 006: Browser E2E Gate

Date: 2026-08-25
Status: active
Owner agent: agent_codex_an_app
Priority: p0
Domain: foundation_and_runtime

## Purpose

Define browser health, boot guard, and benchmark short-circuit for e2e validation.

## Required Records

- browser_health_record
- boot_guard_record
- benchmark_result_record

## Required Operations

- check_browser_health
- guard_boot
- run_benchmark
- short_circuit_on_failure

## Inputs

- browser_ref
- boot_config
- benchmark_config

## Outputs

- browser_health_record
- benchmark_result_record

## Validation

- clean boot with no page errors
- command registry present
- benchmark stops on boot error
- failure reason is reported

## Success Criteria

- health spec proves clean boot
- no page errors
- command registry present
- benchmark short-circuits on failure

## Do

- use entity doctrine for health records
- capture page errors
- report exact failure reason

## Do Not

- do not ignore page errors
- do not continue benchmark on boot failure
- do not hide failure reasons
