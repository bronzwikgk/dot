# Template Domain Requirements

## Purpose

The Template domain owns reusable plans that create applications, domains, views, flows, records, and examples.

## Template Guided Discovery

Templates may be used for guided discovery, not only artifact creation.

An expression template is a governed template with placeholders, allowed
options, score rules, and output shape.

Template-guided discovery should support:

- selecting one or more approved templates
- filling placeholders from approved options or bounded ranges
- evaluating generated candidates against data or evidence
- scoring candidates by precision, recall, frequency, and complexity
- clustering similar candidates
- staging candidates as hypotheses before promotion
- preserving provenance and test results

Required template fields:

- `id`
- `name`
- `pattern`
- `placeholders`
- `allowed_options`
- `bounded_ranges`
- `target_shape`
- `score_rules`
- `validation_policy`
- `output_contract`

Template evolution is allowed only when the new template is staged and reviewed.

## Scope

This domain includes:

- starter templates
- domain templates
- sample pipelines
- layout templates
- flow templates
- document templates
- entity templates
- business application templates
- template validation
- template artifact creation
- template families
- placeholder contracts
- template maintenance rules

## Template Families

Initial template families should include:

- LMS template
- fintech organization template
- single user template
- organization management template
- sample pipeline template
- documentation template
- parser workbench template
- language workbench template
- layout parser template
- handbook skeleton template
- dataset template
- datamap template
- datatable template
- report template
- knowledge template
- communication template
- technical template
- config template
- business plan template
- strategy goals template
- market customer template
- governance risk compliance template
- human review template
- operations reliability template
- financial unit economics template
- data knowledge template
- continuous improvement template
- change version management template
- agent architecture template
- investor one-pager template
- market study template

## Template Contract

A template must include:

- id
- name
- template type
- domain
- parameters
- generated entities
- generated relationships
- views
- flows
- policies
- validation rules
- tests
- audit report shape
- placeholder slots
- examples
- maintenance rule

## Artifact Creation Contract

Template artifact creation must:

- validate parameters
- create proposed entity records
- create proposed relationship records
- create view and layout records
- create policy records
- create test records
- produce an audit report
- require approval before activation when risk is not low
- fail when required placeholders are not filled

## Sample Pipeline Contract

A sample pipeline must include:

- trigger
- input records
- actions
- expected output records
- validation checks
- audit output

## Knowledge Template Requirements

Knowledge templates should cover:

- action records
- entity records
- rule records
- policy records
- flow records

Each knowledge template should include:

- stable id
- name
- required fields
- optional fields
- validation rules
- examples
- related words or synonyms where useful

## Report Template Requirements

Report templates should support:

- test report
- status report
- sprint report
- incident report
- discovery report
- audit report

Test report templates should include totals, pass count, fail count, skipped count, failed case details, root cause, and recommendations.

## Template Maintenance Requirements

Templates should:

- use explicit placeholders
- declare required placeholders
- include examples
- include validation rules
- carry version and status
- be reviewed before becoming approved

## Handbook Template Requirements

A handbook template is a governed document template rendered from rows.

It must define:

- reader role
- purpose
- boundary
- required input
- required output
- constraints
- allowed state
- examples
- validation rules
- guard behavior
- glossary
- requirements
- use cases
- similar items
- lifecycle
- transitions
- policies
- rules
- change log

Handbook creation should follow this flow:

1. discover the reader and one intent
2. define atomic fact rows
3. define row schemas
4. relate rows with typed links
5. select section templates
6. bind rows into template slots
7. render output
8. run guards before status change

Handbook output should be reproducible from the same rows.

## Dataset Updates Needed

- Add template family names.
- Add template type names.
- Add artifact creation state names.
- Add sample pipeline names.
- Add template validation gate names.
- Add handbook row kind names.
- Add handbook section names.
