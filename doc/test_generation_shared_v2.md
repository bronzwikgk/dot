# Test Generation Utility - Shared v2

## What This Is

A system that writes tests automatically. You point it at a code file,
it reads the file, works out what every function expects, generates test
cases from stored banks of templates and sample data, renders a runnable
test file and executes it. No human writes these tests.

It was built so every utility in shared follows one trusted testing path:
code is validated against conventions first, then tested by generated
regression baselines second.

## The Pieces

| Piece | Location | Job |
|:---|:---|:---|
| code_inspector | `code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js` | Reads source text, lists every function with its parameters, jsdoc notes and behaviour traits |
| signature_inference | `code/utilities/test_generation/code_shared_signature_inference_v2_2_0_draft.js` | Guesses parameter types, return types and a behavioural archetype for each function |
| test_generation | `code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js` | Builds the test plan from the banks and renders a runnable node:test file |
| template bank | `dataset_shared_v2/code/dataset_of_testing_templates_in_shared_v2.dataset` | Which test properties apply to which archetype |
| sample bank | `dataset_shared_v2/code/dataset_of_testing_samples_in_shared_v2.dataset` | Reusable typed values used as arguments (edge values listed first) |
| pipeline | `pipelines/system_validate_and_test_code_v2_2_0.md` | The 7 stage recipe the Runner executes |

Supporting file: `code/utilities/test_generation/vendor/acorn.js`
(vendored acorn 8.14.0, MIT licence) lets the inspector parse any modern
javascript without an npm install. If this file is missing the inspector
falls back to its simpler built in parser.

## How A File Gets Tested

1. **observe** - collect changed files under `shared_v2/code/**`
2. **inspect** - read the text, never execute it; produce an inventory
3. **validate_conventions** - check naming, export shape, purity red flags
4. **infer** - attach types and an archetype to every exported function
5. **generate** - combine signatures with the two banks, render a test file
6. **execute** - run `node --test`; first run freezes snapshot baselines
7. **report** - one line per target: units, cases, violations, result

## The Four Generated Properties

Every generated test checks some mix of four properties:

| Property | Plain meaning |
|:---|:---|
| determinism | calling twice with the same input gives the same answer (or throws the same error twice) |
| immutability | the function did not secretly change the objects you passed in |
| snapshot | the output is frozen as a baseline; later runs must match it exactly |
| edge_safety | empty, zero and other boundary inputs either return normally or throw a proper Error - never anything else |

Properties are dropped automatically when traits say they would give false
alarms (for example determinism is skipped for functions using Math.random).

## Edge Case Rules

Edge cases are not guesses - they are a rule layer backed by their own
dataset (`dataset_of_testing_edges_in_shared_v2.dataset`).

The rule, in plain words:

1. For every parameter, look up the edge values of its type.
2. Hit that parameter with each edge value one at a time while all other
   parameters stay at their normal mid range value.
3. One final row applies the first edge of every parameter together.

Example for `execute(stdDev, sampleSize)` where both are numbers:

| row | stdDev | sampleSize | what it checks |
|:---|:---|:---|:---|
| sweep 1 | 0 | 42 | zero stddev |
| sweep 2 | NaN | 42 | not a number input |
| sweep 3 | Infinity | 42 | infinite input |
| ... | ... | ... | ... |
| sweep n | 7 | 0 | zero sample size |
| combined | 0 | 0 | everything empty at once |

Built in edge sets per type (extend by editing the dataset):

| type | edge literals |
|:---|:---|
| string | "" , " " , tab , "0" , "null" |
| number | 0 , -1 , NaN , Infinity , -Infinity , MAX_SAFE_INTEGER |
| boolean | false, true |
| array | [] , [null] |
| object | {} , null |
| any | null , undefined |

Edge rows run only the edge_safety property: the call must either return
normally or throw a proper Error. Anything else fails.

## Running It Today

The committed baseline covers the full code tree: 55 of 56 files,
2618 test cases, all green. The one exception is `metrics`, a pure
re-export shim with nothing to test.

```
node --test --test-force-exit "tests_generated/*.test.js"
```

`--test-force-exit` is required because some plugins start fire and forget
async work that outlives the tests.

Per file results live in `tests_generated/sweep_report.json`.

## Full Sweep Findings

The sweep over all 56 code files surfaced real defects, all fixed:

| finding | fix |
|:---|:---|
| `formula.index_to_column(Infinity)` looped forever | RangeError guard for non finite index |
| `array_slicing.slidingWindows(arr, -Infinity)` allocated until heap death | RangeError guard for non positive window size |
| `metric_calculation`, `standard_deviation` required pre rename sibling names | requires repointed to convention files |
| `policy_gate` imported the old CLI file name | import repointed to `code_shared_cli_v2_2_0_draft.js` |
| `runtime` imported five legacy utility paths | five imports repointed; two remain broken (see below) |
| `export class X` classified as named_object | inspector now classifies it as class style |

Known open items (externalized by decision, not blockers):

- `runner` task registry is now injectable via `config.taskRegistry`
  (empty default). The original 14 task classes live in the museum at
  `shared/inbox/ohm_model/code/task/tasks.js`; rebuild into a proper
  task category when the ML pipeline use case is needed.
- `runtime` takes config and validationPipeline as constructor options
  (defaults `{}` / null; validate stage reports skipped when absent).
  The museum copy lives at
  `shared/inbox/assorted/code/utility/ValidationPipeline_ourActionLang_v2_2_0_ready_Gem.js`.
  No Config class exists anywhere; every consumer optional-chains, so
  `{}` is behavior-identical.
- `metrics` generates no units by design: it is a pure re-export shim

## Running It Today (single target)

Committed baselines exist under `tests_generated/`. Run them all:

```
node --test tests_generated\standard_error_v2_2_0_draft.test.js tests_generated\sorting_v2_2_0_draft.test.js tests_generated\text_v2_2_0_draft.test.js tests_generated\test_generation_code_shared_code_inspector_v2_2_0_draft.test.js tests_generated\test_generation_code_shared_signature_inference_v2_2_0_draft.test.js tests_generated\test_generation_code_shared_test_generation_v2_2_0_draft.test.js
```

To generate tests for a new target, drive stages 2 to 5 directly:

```js
const fs = require("node:fs");
const U = "E:/root_0dot1_wip/shared_v2/code/utilities/test_generation/";
const inspector = require(U + "code_shared_code_inspector_v2_2_0_draft.js");
const inference = require(U + "code_shared_signature_inference_v2_2_0_draft.js");
const generation = require(U + "code_shared_test_generation_v2_2_0_draft.js");

const source = fs.readFileSync("path/to/target.js", "utf8");
const inv = inspector.inspect_source_auto(source);
const sigs = inference.infer_signatures(inv.functions);
const plan = generation.generate_test_plan(sigs, templates, samples, {
  target: "target.js",
  export_style: inv.export_style,
  exported_names: inv.exported_names,
  file_flags: { has_module_state: inv.has_module_state },
});
fs.writeFileSync("out.test.js", generation.render_test_file(plan, targetPath, "snapshots/out.snap.json"));
```

First run sets `TESTGEN_CAPTURE=1` to record baselines; later runs compare.
Delete the snapshot file to recapture after an intentional change.

## Extending The Banks

Add lines to the sample bank to teach the generator about new value shapes.
Values are plain JSON literals separated by `||`; the first value is treated
as the edge case.

```
"type:date_string || \"2026-01-01\" || \"\" || \"not-a-date\"",
```

Add an archetype line to the template bank when inference learns a new
archetype; unknown archetypes fall back to `generic`.

## Known Limitations

| id | limitation | work around |
|:---|:---|:---|
| L1 | generated test files embed absolute paths to their targets at generation time | regenerate per machine; relativising paths is planned for stage 5 |
| L2 | types are inferred from jsdoc, defaults and naming; undocumented code gets low confidence | confidence shows in reports so weak spots surface for review |
| L3 | functions with side effects (fs, network, process) will act during tests | plugins belong behind mocks; utilities stay pure per C2 |
| L4 | classes needing constructor arguments are instantiated bare | pass config through a factory fixture (planned) |

### FV6 Explained Simply

Node decides how to read a file by its extension and nearest package.json:

| File | Dialect Node assumes | Uses |
|:---|:---|:---|
| `.js` (no type setting) | old javascript (CommonJS) | require() |
| `.mjs` or `.js` under a package with `"type": "module"` | new javascript (ESM) | import / export |

Reading and understanding both dialects always works - inventory never fails
on this. The trouble starts at execution time only: if a file contains
import/export syntax but Node treats it as CommonJS, Node stops at the word
export before any of our code runs. The text is fine; the label is wrong.

Fixes, pick one:
1. rename the target to `.mjs`
2. add `{ "type": "module" }` to the nearest package.json
3. rerender the harness as mjs (the renderer supports this)

## Failure Modes

See the failure modes table in `pipelines/system_validate_and_test_code_v2_2_0.md`
(FV1 to FV7).

## Proven On

- six shared_v2 targets: 500 generated tests green (includes self hosted
  tests of the three utilities themselves)
- hostile synthetic esm target (arrow exports, default class, getters,
  rest parameters): 84 tests green
- hostile synthetic cjs target (module.exports object, exports.x alias):
  76 tests green
- real legacy file `inbox_code/utility_legacy/nlu.js`: 39 functions
  inventoried with exact line ranges (inventory only, not executed -
  it is a daemon with side effects)

## Planned Next

- watcher plugin so stage 1 triggers on file save
- mutation scoring: grade how strong the generated tests are by injecting
  small bugs and checking the tests catch them
- relative require paths in rendered files (removes L1)
