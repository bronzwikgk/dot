# Agent 2 Product Surface Mock Ports Fixture

Date: 2026-08-25
Status: proposed
Owner agent: agent_ui_application
Prepared by: agent_codex_an_app

## Purpose

Give Agent 2 enough stable fixture shape to build the GUI/application builder
without waiting for Agent 1 or Agent 3 implementation.

## entity_store_port

Required methods:

- `create_entity(config)`
- `read_entity(config)`
- `update_entity(config)`
- `remove_entity(config)`
- `query_entity(config)`
- `normalize_entity(config)`
- `validate_entity(config)`

Record shape:

```json
{
  "ok": true,
  "entity": {
    "id": "application_demo_001",
    "type": "application",
    "name": "demo_application",
    "data": {}
  }
}
```

## runner_port

Required methods:

- `preview_workflow(config)`
- `run_workflow(config)`
- `read_run(config)`

Record shape:

```json
{
  "ok": true,
  "run": {
    "id": "workflow_run_demo_001",
    "status": "completed",
    "stage_records": []
  }
}
```

## command_intent_port

Required methods:

- `classify_command(config)`
- `parse_command(config)`
- `resolve_command(config)`

Record shape:

```json
{
  "ok": true,
  "intent": {
    "id": "intent_demo_001",
    "type": "create_application",
    "confidence": 1,
    "entity_references": []
  }
}
```

## template_port

Required methods:

- `list_templates(config)`
- `read_template(config)`
- `clone_template(config)`
- `validate_template(config)`

Record shape:

```json
{
  "ok": true,
  "template": {
    "id": "template_demo_001",
    "type": "application_template",
    "domain": "single_user_workspace",
    "entities": []
  }
}
```

## version_port

Required methods:

- `create_save_point(config)`
- `preview_diff(config)`
- `preview_merge(config)`
- `read_history(config)`

Record shape:

```json
{
  "ok": true,
  "version": {
    "id": "version_demo_001",
    "label": "draft",
    "status": "clean"
  }
}
```

## Rules

- Fixtures are not production truth.
- Fixtures must use approved names.
- Fixture tests can prove product_surface behavior, not real e2e readiness.
- Final integration must replace each mock port with an approved real port.
