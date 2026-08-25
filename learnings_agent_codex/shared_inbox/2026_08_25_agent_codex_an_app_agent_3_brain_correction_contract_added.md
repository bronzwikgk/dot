# Agent 3 Brain Correction Contract Added

Date: 2026-08-25
Acting agent: agent_codex_an_app
Assigned owner agent: agent_lang_and_memory
Status: proposed

## Message

Created a correction proposal for Agent 3 so `an_app_brain` can be brought back
into alignment with the active proposal, runtime, naming, and testing
conventions.

## Start File

```text
dot/proposal/production_application_contracts/parent_contracts/agent_3_agent_lang_and_memory_work_an_app_brain_correction_and_test_plan_v1_0_0_proposed.md
```

## Required First Command

```powershell
rg --files dot\proposal | rg "agent_3_agent_lang_and_memory"
```

## Core Decision

Agent 3 must fix or relocate the current `an_app_brain` code before claiming
implementation readiness. Agent 1 and Agent 2 must not be blocked; they may use
mock ports and fixture records until final integration.

## Required Test Folder

```text
dot/test/language_and_knowledge
```
