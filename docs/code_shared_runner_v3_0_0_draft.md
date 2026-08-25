# Shared runner Utility

## File

`code/plugins/code_shared_runner_v3_0_0_draft.js`

## What It Is

The shared runner utility executes declared workflow plans. It supports two plan styles:

- AST plans: ordered steps with conditions, jumps, termination, and nested subflows.
- DAG plans: dependency-ordered tasks with input wiring and nested subflows.

It is the orchestration layer for the shared runtime. Worker behavior is injected through an actions host or task registry, so the runner stays focused on scheduling, gating, input resolution, and safety limits.

## What It Does

The runner can:

- Register named plans with `registerPlan(name, plan)`.
- Run named or inline plans with `run(planOrName, input)`.
- Infer plan kind from `steps` or `tasks`.
- Execute AST steps in sequence.
- Execute DAG tasks in dependency order.
- Fail when a DAG task has no matching task type or executable action.
- Skip steps/tasks when validator-backed conditions fail.
- Route AST execution with `nextMap`.
- Stop AST execution with `TERMINATE`.
- Nest subflows with `DECOMPOSE`.
- Enforce a shared action budget across nested runs.
- Enforce a nesting depth limit.
- Report active sessions.

## When To Use It

Use the runner when code needs a declarative execution surface instead of hand-written orchestration.

Good use cases:

- Workflow execution.
- Multi-step action pipelines.
- DAG-style data processing tasks.
- Conditional automation flows.
- Composing smaller plans into larger plans.

Avoid using it for:

- Parallel scheduling. The current runner walks tasks sequentially.
- Long-running distributed job management.
- Persisted workflow state across process restarts.
- Security isolation for untrusted actions.

## How AST Plans Work

AST plans use a `steps` array:

```js
const runner = new runner({ actions, validator });

await runner.run({
  steps: [
    {
      stepId: "load",
      action: "LOAD_USER",
      inputs: { userId: "{{input.userId}}" }
    },
    {
      stepId: "done",
      action: "RETURN",
      conditions: [
        { left: "{{stepOutputs.load.active}}", operator: "===", right: true }
      ]
    }
  ]
}, { userId: "u_1" });
```

Each normal step calls:

```js
actions.executeAction(step.action, resolvedInputs)
```

If no actions host is provided, the runner returns the resolved inputs for the step.

## How DAG Plans Work

DAG plans use a `tasks` array:

```js
await runner.run({
  tasks: [
    {
      task_id: "extract",
      action: "EXTRACT",
      inputs: { source: { source_type: "config", value: "users" } }
    },
    {
      task_id: "transform",
      action: "TRANSFORM",
      dependencies: ["extract"],
      inputs: {
        rows: { source_type: "task_output", task_id: "extract" }
      }
    }
  ]
});
```

The runner topologically sorts tasks before execution. It rejects missing task IDs, duplicate task IDs, missing dependencies, and dependency cycles.

## Input Resolution

AST step inputs use validator path resolution:

```js
{ value: "{{input.value}}" }
```

DAG task inputs support:

- `{ source_type: "task_output", task_id: "previous" }`
- `{ source_type: "config", value: 123 }`
- literal values

DAG positional inputs use `input_sources` and are passed to registered task classes as positional arguments.

## Conditions

Conditions are evaluated through the shared validator as an implicit `and` group:

```js
conditions: [
  { left: "{{input.enabled}}", operator: "===", right: true },
  { condition: "input.score >= 10" }
]
```

If no validator is provided, conditions pass by default.

## Safety Behavior

The runner enforces:

- Action limit: defaults to `50`.
- Nesting depth limit: defaults to `16`.
- `nextMap` target validation.
- DAG task ID validation.
- DAG duplicate ID validation.
- DAG missing dependency validation.
- DAG cycle detection.

The action budget is shared across nested runs so deeply decomposed workflows cannot bypass the root limit.

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `registerPlan()` and inline `run()` both infer plan kind.
- Unknown named plans throw.
- Plans without `steps` or `tasks` throw `[SYS-06]`.
- AST `nextMap` targets must exist.
- DAG sort must return dependencies before dependents.
- DAG cycles must throw instead of producing an order.
- DAG missing dependencies must throw instead of being ignored.
- Active sessions are removed after successful completion or termination.
- Failed sessions retain failure status and error details.

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
node --input-type=module -e "import assert from 'node:assert/strict'; import {runner} from './code/plugins/code_shared_runner_v3_0_0_draft.js'; import {validator} from './code/plugins/code_shared_validator_v3_0_0_draft.js'; const calls=[]; const validator=new validator(); const runner=new runner({validator, actions:{executeAction:async (action, inputs)=>{calls.push({action, inputs}); return action==='CHOOSE'?'yes':inputs;}}, limits:{actions:10, depth:3}}); const inline=await runner.run({steps:[{stepId:'s1', action:'ECHO', conditions:[{left:'{{input.ok}}', operator:'===', right:true}], inputs:{value:'{{input.value}}'}}]}, {ok:true,value:42}); assert.deepEqual(inline.s1,{value:42}); runner.registerPlan('jump',{steps:[{stepId:'choose', action:'CHOOSE', nextMap:{yes:'done'}},{stepId:'skip', action:'SKIP'},{stepId:'done', action:'DONE', inputs:{ok:true}}]}); const jumped=await runner.run('jump'); assert.deepEqual(jumped.done,{ok:true}); assert.throws(()=>runner.topologicalSort([{task_id:'a', dependencies:['b']},{task_id:'b', dependencies:['a']}]),/cycle/); assert.throws(()=>runner.topologicalSort([{task_id:'a', dependencies:['z']}]),/dependency/); assert.throws(()=>runner.topologicalSort([{task_id:'a'},{task_id:'a'}]),/Duplicate/); assert.throws(()=>runner.topologicalSort([{dependencies:[]}]),/missing task_id/); const order=runner.topologicalSort([{task_id:'b',dependencies:['a']},{task_id:'a'}]).map(t=>t.task_id); assert.deepEqual(order,['a','b']); const dag=await runner.run({tasks:[{task_id:'first', action:'ECHO', inputs:{v:{source_type:'config', value:1}}},{task_id:'second', action:'ECHO', dependencies:['first'], inputs:{prev:{source_type:'task_output', task_id:'first'}}}]}); assert.deepEqual(dag.second,{prev:{v:1}}); console.log('runner checks passed');"
```

Expected output:

```text
runner checks passed
```

## How To Update It

When updating this utility:

1. Keep runner behavior deterministic unless adding explicit parallel scheduling.
2. Add focused checks for every new plan feature.
3. Test both registered plans and inline plans.
4. Test both AST and DAG execution paths when changing shared session or budget behavior.
5. Test failure cases for graph validation.
6. Update this document with any new action, task, condition, or safety behavior.
7. Update the matching maintenance log in `log/code_shared_runner_v3_0_0_draft.log.md`.
8. Commit only runner code, runner docs, and runner log for the runner utility pass.

## Known Limits

- DAG execution is dependency ordered but not parallel.
- Sessions are in-memory only.
- Task registry classes are instantiated per task execution.
- Failed sessions remain in `activeSessions` for inspection.
- The runner does not validate action names beyond dispatch availability.
