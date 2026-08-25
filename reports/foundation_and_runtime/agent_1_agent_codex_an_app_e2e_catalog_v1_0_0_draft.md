# Agent 1 E2E Catalog

Date: 2026-08-25
Acting agent: agent_codex_an_app
Assigned owner agent: agent_codex_an_app
Status: draft

## Purpose

Define the first real-app foundation validation catalog for Agent 1.

## Scenario Catalog

| Scenario Id | Contract | Scenario | Current Evidence | Status |
| --- | --- | --- | --- | --- |
| e2e_agent_1_001 | parent_001 | boot valid application entity | app_shell test creates application, route, view, audit | passed |
| e2e_agent_1_002 | parent_001 | reject invalid application before runtime work | app_shell test rejects missing name | passed |
| e2e_agent_1_003 | parent_003 | snapshot entity | version_system test stores entity payload | passed |
| e2e_agent_1_004 | parent_003 | diff entity versions | version_system test reports changed path | passed |
| e2e_agent_1_005 | parent_003 | restore entity from version record | version_system test returns entity payload | passed |
| e2e_agent_1_006 | parent_004 | inspect repository status read-only | repository_operations test runs status inspection | passed |
| e2e_agent_1_007 | parent_004 | create commit proposal | repository_operations test validates proposal fields | passed |
| e2e_agent_1_008 | parent_001 | reject duplicate child ids and invalid workflow plan | app_shell regression test checks validation before runtime work | passed |
| e2e_agent_1_009 | parent_003 | detect three-way merge conflict | version_system regression test reports conflict | passed |
| e2e_agent_1_010 | parent_003 | reject invalid restore payload | version_system regression test rejects bad version record | passed |
| e2e_agent_1_011 | parent_004 | block mutating Git command | repository_operations regression test rejects commit command | passed |

## Validation Command

```powershell
node --test test/foundation_and_runtime/agent_1_agent_codex_an_app_foundation_runtime_v1_0_0_test.mjs
```

## Result

Passed 7 automated tests covering 11 foundation scenarios.

## Remaining Production Gaps

- real browser shell boot not connected yet
- full GUI flow mapping not converted into this catalog yet
- schema contracts are documentation-level and need validator wiring
- repository workflow runs and artifacts are not implemented yet
- version merge policy is field-level and needs path-level structured diff
