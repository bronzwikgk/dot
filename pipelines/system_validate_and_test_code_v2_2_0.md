# Pipeline: system_validate_and_test_code

## Meta

| Field | Value |
|:---|:---|
| id | system_validate_and_test_code |
| project | shared_v2 |
| version | 2.2.0 |
| status | draft |
| runner | code_shared_runner (only executor per C4) |
| trigger | manual cli call or plugin watcher event on code folder change |
| consumes | changed .js files under shared_v2/code/utilities and shared_v2/code/plugins |
| emits | generated test files, snapshot baselines, validation report |

## Purpose

Every utility and plugin file is validated against the code conventions and then
tested against tests generated from its own source. No human writes these tests.
The pipeline reads the file, inventories its functions, infers signatures,
generates a test plan from the template and sample banks, renders a runnable
node:test file, executes it and reports results.

## Stages

### Stage 1: observe

| op | input | output | performed by |
|:---|:---|:---|:---|
| fs_list_changed | watch_root path | candidate_files array | plugin file_storage or cli argument |

Rules:
- candidates are files matching `code_shared_*_v*_*.js`
- when triggered manually the caller passes explicit paths instead

### Stage 2: inspect

| op | input | output | performed by |
|:---|:---|:---|:---|
| fs_read | each candidate path | source_text string | plugin file_storage |
| inspect_source | source_text | inventory record | utility code_inspector |

Rules:
- never execute the candidate during inspection
- inventory carries functions, params, jsdoc, traits, export style, module state

### Stage 3: validate_conventions

| op | input | output | performed by |
|:---|:---|:---|:---|
| validate_naming | file name + inventory | violations list | utility validator |
| validate_purity | inventory traits + import scan | violations list | utility validator |

Checks:
- C1 category match: utilities declare no require of fs, net, http, child_process
- C2 purity red flags: Math.random, Date.now inside utilities mark nondeterministic traits rather than failing
- export style must be one of class, named_object, unknown fails
- one concern per file: more than 15 exported units fails review threshold

On violation: emit report entry, skip remaining stages for that file.

### Stage 4: infer

| op | input | output | performed by |
|:---|:---|:---|:---|
| infer_signatures | inventory.functions | signature records | utility signature_inference |

Rules:
- confidence field travels with every record into the report

### Stage 5: generate

| op | input | output | performed by |
|:---|:---|:---|:---|
| dataset_load | testing templates bank | template strings | plugin schema_registry |
| dataset_load | testing samples bank | sample strings | plugin schema_registry |
| generate_test_plan | signatures + banks + options | plan record | utility test_generation |
| render_test_file | plan + require path + snapshot path | test file text | utility test_generation |
| fs_write | text | tests_generated/<target>.test.js + snapshots/<target>.snap.json | plugin file_storage |

Options passed to plan:
- exported_names from inventory
- module_kind and export_style from inventory
- file_flags.has_module_state from inventory

### Stage 6: execute

| op | input | output | performed by |
|:---|:---|:---|:---|
| process_spawn | node --test tests_generated/<target>.test.js | pass fail summary | runtime |

Rules:
- first run sets TESTGEN_CAPTURE=1 to freeze snapshot baselines
- later runs compare against baselines; mismatches fail
- intentional behaviour changes rerun capture after human review

### Stage 7: report

| op | input | output | performed by |
|:---|:---|:---|:---|
| build_report | stage outputs | report record | runner |

Report fields per target:
- path, export_style, unit count, case count, confidence histogram
- convention violations, test result, snapshot delta count

Emitted as one line per target so terminal_renderer can print a table.

## Failure Modes

| id | failure | handling |
|:---|:---|:---|
| FV1 | file unparseable or empty inventory | report violation, skip stages 4 to 7 |
| FV2 | nondeterministic function detected | determinism and snapshot properties dropped automatically |
| FV3 | module level state detected | snapshot property dropped, reported |
| FV4 | generated test crashes at require time | syntax error reported against target file |
| FV5 | snapshot mismatch | test fails; human decides fix or recapture |
