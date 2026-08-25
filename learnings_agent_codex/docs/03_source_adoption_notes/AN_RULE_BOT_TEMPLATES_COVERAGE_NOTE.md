# An Rule Bot Templates Coverage Note

## Purpose

This note evaluates `input_temp/b7/AnRuleBot/templates/README.md`.

The goal is to adopt useful template concepts while keeping An App conventions, approved names, and class/config/method style.

## Source Summary

The folder contains one README describing reusable templates for documents, reports, knowledge records, communications, code, tests, and config records.

Most useful parts are the knowledge templates and report templates. The old code examples are not adopted directly because they use old folder names and old module style.

## Template Families Found

Knowledge template families:

- action template
- entity template
- rule template
- policy template
- flow template

Document template families:

- specification template
- design document template
- API document template
- meeting notes template

Report template families:

- weekly status report
- sprint report
- test report
- incident report

Communication template families:

- release notes
- announcement
- email

Technical template families:

- module template
- test template
- config template

## Record Shapes Found

Action template fields:

- action id
- action name
- command
- command template
- required parameters
- optional parameters
- safety level
- confirmation level
- description
- similar words

Entity template fields:

- entity id
- entity name
- patterns
- validation rules
- synonyms
- description
- examples

Rule template fields:

- rule id
- rule name
- condition
- consequence
- priority
- category
- description

Policy template fields:

- policy id
- policy name
- policy condition
- enforcement action
- severity
- scope
- description

Flow template fields:

- flow id
- flow name
- description
- trigger
- steps
- error handling

Test report fields:

- suite name
- date
- tester name
- total tests
- passed
- failed
- skipped
- test id
- description
- status
- notes
- expected
- actual
- root cause
- recommendations

## Already Covered

Already covered by current scratchpad:

- action, capability, and command shape: `COMMAND_CAPABILITY_DOMAIN_REQUIREMENTS.md`
- entity schema: `SCHEMA_CONTRACT_CATALOG.md`
- rule and policy ownership: `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md`
- template domain: `TEMPLATE_DOMAIN_REQUIREMENTS.md`
- bot capability registry and template registry: `AN_RULE_BOT_DOC_DATASET_ADOPTION_NOTE.md`
- test report schema: partly covered by `SCHEMA_CONTRACT_CATALOG.md`

## Gaps Found

Missing or not explicit enough:

- template family dataset for knowledge, document, report, communication, technical, and config templates
- placeholder contract for template slot names
- similar words field for action and entity templates
- test report detailed field list
- flow error handling as a required template section
- template maintenance rules: version, examples, validation rules, and update review

## Concepts To Adopt

| Concept | Meaning | Owner |
| --- | --- | --- |
| knowledge template | Template for action, entity, rule, policy, and flow records. | `TEMPLATE_DOMAIN_REQUIREMENTS.md` |
| placeholder contract | Required slot names that must be filled before artifact creation. | `SCHEMA_CONTRACT_CATALOG.md` |
| template family | Grouping for template purpose and validation rules. | `TEMPLATE_DOMAIN_REQUIREMENTS.md` |
| flow error handling | Template section that maps error condition to recovery action. | `SCHEMA_CONTRACT_CATALOG.md` |
| template maintenance rule | Rule requiring versioning, examples, validation, and review. | `QUALITY_AUDIT_DOMAIN_REQUIREMENTS.md` |

## Dataset Additions Needed

- template family names
- knowledge template type names
- document template type names
- report template type names
- communication template type names
- technical template type names
- template placeholder field names
- action template field names
- entity template field names
- rule template field names
- policy template field names
- flow template field names
- test report field names

## Decision

Adopt the template record shapes and template maintenance rules. Do not adopt the old code examples directly.
