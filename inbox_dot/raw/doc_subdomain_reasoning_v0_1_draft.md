# Subdomain Specification — Recursive Reasoning Engine (v0.2.0)

| Field | Value |
|---|---|
| Document | doc_subdomain_reasoning |
| Version | 0.2.0 |
| Status | DRAFT |
| Project | ohm_platform |
| Domain | capability / reasoning |
| Date | 2026-08-21 |

---

## Core Concepts

| Term | Meaning |
|---|---|
| **recursive regression and reasoning** | one recursive process with two halves: discovering symbolic expressions from data (regression) and decomposing goals into validated steps (reasoning) |
| **reasoning trace** | the record of one reasoning run: root goal, sub-goal branches, terminal actions, each step carrying its validation results |
| **goal decomposition** | breaking a declared goal into sub-goals until each is directly executable or answerable by an expression |
| **contract** | a pre/post condition enforced on a reasoning step; a named predicate over declared step metrics, checked by the shared gate checker |
| **guard rail** | a safety constraint enforced before any state transition: causality, no future information, minimum sample floors, autocorrelation consistent error bars |
| **state / action / outcome** | the system condition at a point in the trace; a transition between conditions; the recorded result of that transition (success or failure) |
| **episode** | the captured success or failure trace of a complete run, stored as records of an action entity |
| **disagreement detection** | comparison of predicted against observed outcome; divergence triggers mining of a contextual separator expression |
| **scoped fact** | an expression stored in episode memory together with the context scope in which it holds |

---

## 1. Objectives & Boundaries

The `reasoning` subdomain realizes the reasoning half of the unified recursive process on exactly the same machinery as the `miner` subdomain: the same runner executes its flow, the same gate checker renders verdicts, the same ledger records runs. A contract is a gate over step metrics; acceptance semantics cannot drift between the two halves because both pass through one checker (core_master section on shared gate checker discipline).

The engine knows no market words and no domain words: it consumes expressions as data, goals as declarations, and produces traces as artifacts. Out of scope: executing actions outside platform boundaries, knowledge storage beyond action entity records, and any rewriting of acceptance semantics.

Placement law: the reasoning engine is a **child capability of the `miner` subdomain**, not an independent acceptance power — it learns from data episodes, shares the tower's proposers, and binds on the same runner. Guard-rail primitives and the trace/episode schemas are **shared kernel property** (declared in core_master shared requirements); episode outcome vocabulary joins the verdict closed set under **core custody** — no second acceptance authority may exist anywhere in the platform.

---

## 2. Functional Requirements

* **reasoning_functional_requirement_01 (Unified Acceptance Authority):** every reasoning step is validated by named predicates through the shared gate checker; verdicts come from the closed set (`accepted`, `flagged`, `pruned`, `unstable`, `empty_tree`, `inconclusive`). No separate validation path may exist. A contract failure is an execution event that follows the step's declared error policy (`on_error`) — it is never a second verdict; the relational referee remains the sole acceptance authority.
* **reasoning_functional_requirement_02 (Trace Structure):** a trace is root goal → sub-goal branches → terminal actions. Every node records goal text, chosen action, precondition result, postcondition result, guard rail report, and confidence. Traces serialize deterministically: identical traces produce byte-identical serializations; wall-clock fields are recorded but excluded from content hashes.
* **reasoning_functional_requirement_03 (Guard Rails):** four constraints are checked before any state transition: causality (effects follow causes), no future information, minimum sample floors for any statistic quoted, autocorrelation consistent error bars for any claim about repeated data. The primitives are shared-domain arithmetic; a step declares only their parameters. Violations refuse at load.
* **reasoning_functional_requirement_04 (Episode Capture):** every run writes one success or failure episode record through the action entity pattern (`action_entity_episode_v0_1_definition.md`); policy violations are findings, never exceptions.
* **reasoning_functional_requirement_05 (Disagreement Detection):** when predicted and observed outcomes diverge, the engine mines a contextual separator expression distinguishing the two contexts and stores it as a scoped fact.
* **reasoning_functional_requirement_06 (Confidence Update):** episode outcomes adjust the confidence of every expression and reasoning step used; updates are ledger-chained deltas, never silent overwrites.
* **reasoning_functional_requirement_07 (Stop Rules):** recursion stops on goal satisfaction, depth ceiling, or contract failure; every stop is loud and carries its reason.
* **reasoning_functional_requirement_08 (Single Entry):** one entry call takes a task definition declaring data, task, mode (`coverage`, `accuracy`, `reasoning`, `combined`), gates, contracts, stop rules, and output sections; unknown keys are rejected at load.
* **reasoning_functional_requirement_09 (Agent Fragment Parity):** goal decompositions emitted by conversational agents enter as ordinary task-definition fragments through their frontend and pass the identical contract and gate stack as hand-authored equivalents; human approval gates are unchanged.

---

## 3. Specifications

### 3.1 Unified Validation Authority

| Validation | Expression side (data) | Reasoning side (goals) |
|---|---|---|
| gate check | min_records, min_labels, min_lift, referee margin | preconditions, postconditions, guard rails |
| stability | era stability across equal-count eras | contract stability across repeat contexts |
| confirmation | hold confirmation, one-shot | episode confirmation from success/failure traces |
| confidence | error-floored lift, stable share, breadth | contract pass rate, disagreement resolution, trace completeness |
| stop rule | depth ceiling, member floor, marginal gain | depth ceiling, goal satisfaction, contract failure |

### 3.2 Trace Node Schema

Each trace node declares: node id, parent id, goal text, action name, input references, precondition predicates and results, postcondition predicates and results, guard rail report, confidence, verdict. Traces ship inside the run artifact; they are never overwritten.

### 3.3 Contract Declaration Format

A contract names its predicates over declared step metrics, mirroring the miner gate stack:

```
contracts:
  - contract_id: sample_floor
    predicate: records_in_context >= 30
    phase: precondition
  - contract_id: effect_present
    predicate: abs(outcome_delta) >= referee_k * combined_error
    phase: postcondition
```

Unknown metric names are rejected at load; failed contracts are findings recorded in artifact and ledger.

### 3.4 Episode Store

Episodes live as records behind `action_entity_episode` definition files carrying shape, definition, policy, schema. Policy declares retention, redaction, and who may learn from whom. Every mutation appends a timestamped ledger entry.

### 3.5 Binding To The Runner

Reasoning binds onto the generic flow interpreter exactly as mining does: steps declare their proposer (goal decomposition instead of threshold proposals), metrics (contract pass rates instead of lift), gates (contracts), mode, and stop rule. Nested flows map onto sub-goal nesting. The combined mode interleaves data branches (expression trees) and reasoning branches (traces) under one root task.

### 3.6 Self-Tests

| Check | Assertion |
|---|---|
| contract parity | identical predicate evaluated through both contexts yields identical results |
| honest negative | inconclusive hypotheses ship as first-class outputs, never errors |
| separator recovery | planted contextual difference recovered as a scoped fact |
| determinism | same task definition plus same inputs reproduce the trace byte for byte |

---

## 4. Acceptance Criteria

| Id | Test | Pass condition |
|---|---|---|
| A1 | determinism: same task definition twice | traces byte identical |
| A2 | no future information: truncate inputs at T | nothing differs from removed later material |
| A3 | contract parity | one checker, two contexts, one verdict |
| A4 | disagreement loop | injected divergence produces a scoped fact whose expression separates the contexts |
| A5 | episode integrity | episode mutations append-only; policy violations recorded as findings |
| A6 | agent fragment parity | agent-proposed fragment and hand-authored equivalent receive identical verdicts on the same context |

---

## 5. Status

Designed; nothing built. Components registered as **designed**: reasoning engine, knowledge accessor, disagreement detector, episode learner, trace recorder (see component register, reasoning subsection). Specification precedes build per register note discipline.
