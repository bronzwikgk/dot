# Shared validator Utility

## File

`code/plugins/code_shared_validator_v3_0_0_draft.js`

## What It Is

The shared validator utility provides three core services for the shared runtime:

- Schema validation for plain JavaScript payloads.
- Rule evaluation for workflow gates and other decision points.
- Mustache-style path resolution such as `{{input.user.id}}`.

It is used by the runner before workflow steps and DAG tasks, and can also be used directly by plugins that need lightweight validation without introducing another dependency.

## What It Does

`validator.validate(data, schema)` checks simple schema constraints:

- Required fields.
- Basic property types.
- String `minLength` and `maxLength`.

`validator.evaluateRule(rule, context)` evaluates rules in two forms:

- Structured rules, such as `{ left, operator, right }`.
- String conditions, such as `{ condition: "input.score >= 10" }`.

It also supports compound rules:

- `and`
- `or`
- `not`

`validator.resolveValue(path, context)` resolves wrapped paths against a context object. For example, `{{input.name}}` reads `context.input.name`.

## When To Use It

Use this utility when code needs lightweight, deterministic checks over plain objects.

Good use cases:

- Deciding whether a workflow step should run.
- Validating simple action input payloads.
- Resolving workflow input references.
- Evaluating simple business rules in a bounded sandbox.

Avoid using it for:

- Full JSON Schema compatibility.
- Deep type systems.
- Complex untrusted scripting.
- Cross-record database constraints.
- Validation that needs localization or rich user-facing errors.

## How It Works

Schema validation never throws for malformed payloads. It returns:

```js
{ valid: true, errors: [] }
```

or:

```js
{ valid: false, errors: [{ field: "name", message: "Field 'name' is required" }] }
```

Structured rules compare resolved left and right values:

```js
const validator = new validator();

validator.evaluateRule(
  { left: "{{input.count}}", operator: ">=", right: 3 },
  { input: { count: 4 } }
);
```

String conditions run inside Node's `vm` context and are wrapped as an expression:

```js
validator.evaluateRule(
  { condition: "input.count >= 3" },
  { input: { count: 4 } }
);
```

String condition evaluation has a timeout so runaway expressions cannot hang the process indefinitely.

Compound rules recursively evaluate child rules:

```js
validator.evaluateRule(
  {
    type: "and",
    conditions: [
      { left: "{{input.enabled}}", operator: "===", right: true },
      { condition: "input.score >= 10" }
    ]
  },
  { input: { enabled: true, score: 12 } }
);
```

## Supported Operators

- `==`
- `===`
- `!=`
- `!==`
- `>`
- `<`
- `>=`
- `<=`
- `contains`

`contains` currently supports arrays only.

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `validate()` should not throw when `data` is `null` or missing.
- Malformed VM/string conditions should evaluate to `false`.
- Compound `and` rules should pass only when every child passes.
- Compound `or` rules should pass when any child passes.
- Compound `not` rules should invert the first child rule.
- `resolveValue()` should return non-string values unchanged.
- Unrecognized operators should return `false`.

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
node --input-type=module -e "import assert from 'node:assert/strict'; import {validator} from './code/plugins/code_shared_validator_v3_0_0_draft.js'; const v=new validator(); assert.equal(v.validate(null,{required:['name']}).valid,false); assert.equal(v.evaluateRule({type:'and',conditions:[{left:'{{input.x}}',operator:'>=',right:2},{condition:'input.y <= 3'}]},{input:{x:2,y:3}}),true); assert.equal(v.evaluateRule({type:'or',conditions:[{left:'{{input.x}}',operator:'<',right:1},{left:'{{input.x}}',operator:'===',right:2}]},{input:{x:2}}),true); assert.equal(v.evaluateRule({type:'not',conditions:[{left:'{{input.x}}',operator:'<',right:1}]},{input:{x:2}}),true); assert.equal(v.evaluateRule({left:'{{input.name}}',operator:'!==',right:'b'},{input:{name:'a'}}),true); console.log('validator checks passed');"
```

Expected output:

```text
validator checks passed
```

## How To Update It

When updating this utility:

1. Keep the public API stable unless the caller code is updated in the same utility pass.
2. Add focused checks for every new operator or rule type.
3. Test direct validator use and runner-compatible compound rules.
4. Update this document with any new operator, schema feature, or behavior guarantee.
5. Update the matching maintenance log in `log/code_shared_validator_v3_0_0_draft.log.md`.
6. Commit only the validator code, validator docs, and validator log for the validator utility pass.

## Known Limits

- Schema validation is intentionally small and does not implement full JSON Schema.
- String condition context is shallow-copied into the VM sandbox.
- Path resolution is simple dot traversal and does not support array index syntax beyond normal property names.
- `contains` does not currently support substring matching.
