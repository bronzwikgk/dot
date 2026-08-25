# code_shared_definition_runtime_dependency_v4_0_0_draft

Status: draft
Owner: agent_codex_an_app

## What It Is

`definition_runtime_dependency` is a utility for An App definition files. It
parses, validates, and resolves project/product definitions before plugins,
utilities, app data, templates, or browser surfaces use them.

## When To Use

Use it when a project or product definition needs to prove:

- its runtime is approved
- required definition fields exist
- dependency records point to approved kinds
- dependency links do not create cycles
- defaults resolve predictably

## Public Methods

- `detect_runtime(config)`
- `parse_definition(config)`
- `validate_definition(config)`
- `resolve_definition(config)`
- `resolve_runtime_dependencies(config)`
- `resolve_defaults(config)`
- `validate_dependencies(config)`
- `resolve_dependency_record(config)`

## Result Shape

Every public method returns:

```js
{ ok, data, errors }
```

## Default Resolution

Defaults resolve with this precedence:

1. config value
2. definition value
3. template value
4. system value

The merged output is stored in `data.values`.

## Tests

Run:

```powershell
node --test test\v4_definition_runtime_dependency\agent_codex_an_app_v4_definition_runtime_dependency_v1_0_0_test.mjs
```
