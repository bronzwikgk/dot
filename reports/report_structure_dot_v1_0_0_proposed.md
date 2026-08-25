# Reports

## Purpose

Store evaluation, validation, audit, comparison, and readiness reports
organized by subdomain.

## Structure

```text
reports/
  <subdomain_name>/
    report_<subdomain_name>_overview_v<version>_<status>.md
    report_<name>_v<version>_<status>.md
```

## Rules

- reports must name the acting agent and assigned owner agent
- reports must include source refs, checks run, findings, conflicts, skipped
  checks, and next action
- production readiness reports must include e2e evidence, not only unit tests
