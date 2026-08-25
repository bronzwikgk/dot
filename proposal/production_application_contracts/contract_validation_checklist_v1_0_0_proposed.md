# Contract Validation Checklist

Use this checklist before any agent starts implementation from these contracts.

## Required Checks

- contract has id, status, owner agent, owner domain, work item mapping, and priority
- contract maps to active master docs
- assigned agent name matches the parent contract or approved handoff
- assigned agent cross-checked the current conversation, master docs, policy docs, parent contract, detail contracts, and shared inbox before editing
- contract follows entity doctrine
- contract does not introduce unauthorized names
- contract defines inputs and outputs
- contract defines validation
- contract defines success criteria
- contract defines do and do-not rules
- contract names related files or expected locations
- contract includes e2e impact when relevant
- contract lists source coverage when created from a source inbox
- contract maps source-only terms to approved or proposed An App terms
- contract records authorization needs for any source name that should not be promoted directly

## Batch Acceptance

A batch is acceptable only when:

- all touched contracts are updated
- all touched active docs/logs are updated
- tests pass or the skipped test reason is explicit
- shared inbox records unresolved authorization questions
- handoff records the acting agent name and conversation cross-check result
- user receives a commit message
