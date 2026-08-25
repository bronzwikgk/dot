# Agent Codex An App V4 Convention Scan Classification Report

Date: 2026-08-25
Status: proposed
Owner agent: agent_codex_an_app
Branch: `dot_agent_codex_an_app_v4`

## Scope

This report classifies convention scan hits from the V4 baseline so historical
or policy mentions are not confused with active code violations.

## Scan Pattern

The latest baseline scan used this pattern over active repository areas:

```text
materialize|materialization|VectorMathUtil|evaluateRule|flattenToVector|\bsrc\b|\bdeps\b
```

## Classification

| Category | Status | Meaning |
|---|---|---|
| active runtime violation | none found | promoted runtime files do not use the old camelCase utility names or the banned implementation term |
| banned-word dataset mention | allowed | policy datasets must list banned words so validators can catch them |
| policy/proposal mention | allowed | docs and proposals may mention banned words only to forbid or classify them |
| historical report mention | allowed with caution | reports may describe old findings, but must not prescribe old names as approved names |
| user-command echo mention | allowed with caution | release-validation proposals may include a user-supplied scan command |

## Known Hits

| Area | Classification | Action |
|---|---|---|
| validation word dataset | allowed | keep as banned-word source |
| policy and convention docs | allowed | keep as enforcement context |
| proposal and report files | allowed with caution | review during final promotion so old names do not leak into new implementation docs |
| runtime code | clean at baseline | rescan before transfer |

## Required Final Gate

Before any V4 code is transferred out of the workspace, run:

```text
rg "materialize|materialization|VectorMathUtil|evaluateRule|flattenToVector|\bsrc\b|\bdeps\b" code app_data templates docs proposal reports log test agent_workspace_v4
```

Each hit must be classified as:

- banned-word dataset
- policy/proposal explanation
- historical report
- active violation

Only `active violation` blocks promotion. Historical mentions should still be
minimized when they can confuse future agents.

## Finding

The baseline scan has no active runtime violation. Final V4 promotion still
requires a fresh scan after implementation because new files will be added.
