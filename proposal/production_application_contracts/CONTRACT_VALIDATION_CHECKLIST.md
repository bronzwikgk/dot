# Contract Validation Checklist

Use this checklist before any agent starts implementation from these contracts.

## Required Checks

- contract has id, status, owner domain, work item mapping, and priority
- contract maps to active master docs
- contract follows entity doctrine
- contract does not introduce unauthorized names
- contract defines inputs and outputs
- contract defines validation
- contract defines success criteria
- contract defines do and do-not rules
- contract names related files or expected locations
- contract includes e2e impact when relevant

## Batch Acceptance

A batch is acceptable only when:

- all touched contracts are updated
- all touched active docs/logs are updated
- tests pass or the skipped test reason is explicit
- shared inbox records unresolved authorization questions
- user receives a commit message
