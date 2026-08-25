# Shared App Generator Plugin

## File

`code/plugins/code_shared_app_generator_v3_0_0_draft.js`

## What It Is

The shared app generator plugin creates a simple app manifest plan from an app
entity plus related route, view, and component entities.

## What It Does

It exposes:

- `plan_app(app_entity, related_entities)`
- `compose_manifest(plan)`

`plan_app` validates the app entity and related entities, then creates file
records for routes, views, and components. `compose_manifest` renders that plan
as formatted JSON.

## When To Use It

Use it when a validated app entity needs a first materialization plan.

Avoid using it as the final app builder. It does not yet create files, run
tests, resolve templates, or enforce full materialization policy.

## Runtime Contract

- Input entities must pass shared entity validation.
- Related entity names must be safe snake_case names.
- Route, view, and component entities become planned file entries.
- Relationships from app to related entities are emitted as `contains`.

## Known Limits

- It creates a manifest only.
- It does not yet support template inheritance, layout projection, datasets, or
  deployment output.

## How It Was Tested

The promoted module was imported from `dot/code`. It is included in the current
promotion smoke check set.
