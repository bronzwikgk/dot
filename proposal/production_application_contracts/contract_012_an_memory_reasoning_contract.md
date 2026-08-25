# Contract 012: An Memory Reasoning

Status: proposed
Priority: p1
Owner domains: an_memory, quality_audit
Work items: work_010, work_017, work_021

## Purpose

Define memory, evidence, trust, reasoning trace, source conflict, and knowledge reasoning use cases.

## Required Records

- memory_record
- evidence record
- claim record
- source record
- trust record
- conflict record
- reasoning_trace
- episode
- recall policy
- forgetting policy

## Validation

- evidence has source refs
- claims have trust status
- conflicts are explicit
- recall respects policy
- retention values are approved
- reasoning steps are audit-ready

## Success Criteria

- dynamic FAQ use case is supported
- policy compliance use case is supported
- tutoring/research reasoning use case is supported
- disagreements are stored and reviewable
- confidence updates are explainable

## Do Not

- do not store unsupported claims as truth
- do not erase conflicts silently
