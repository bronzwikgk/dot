# Large Folder Doc Dataset Adoption Note

## Scope

Reviewed documentation and dataset-facing files from these large folders:

- `input_temp/b6/AnActionAgent`
- `input_temp/b6/AnActionAgent-Learner`
- `input_temp/b7/AAstParser`
- `input_temp/b7/AnAgent`
- `input_temp/b7/AnGitAgent`
- `input_temp/b7/any2any`
- `input_temp/b7/anyFormat2js`

Generated outputs, package material, logs, media, and massive command corpuses
were counted or sampled, but not deeply adopted line by line.

## Inventory Summary

| Folder | Doc and dataset candidate count | Decision |
| --- | ---: | --- |
| b6 AnActionAgent | 605 | adopt grouped agent, command, constraint, benchmark, and role catalog concepts |
| b6 AnActionAgent-Learner | 104 | adopt learner config, knowledge base entries, session audit, taxonomy, and benchmark concepts |
| b7 AAstParser | 91 | adopt entity parser, type-anchored learning, approval, provenance, and coverage concepts |
| b7 AnAgent | 63 | adopt agent entity templates, YAML entity packs, skills, flows, menus, facts, and profiles |
| b7 AnGitAgent | 34,946 | adopt repository domain, 6D canonical artifact rules, templates, dataset rulebook, and phase gates |
| b7 any2any | 9 | adopt any-to-any conversion flow, conditional parsing, policy wrapper, and reports |
| b7 anyFormat2js | 14 | adopt file importer, format matrix, parser edge cases, and tree template conversion |

## AnActionAgent Coverage

Adopted concepts:

- agent constraint tree
- agent framework profile
- remediation proposal
- command catalog
- role catalog
- benchmark input
- conversation input
- learned tree artifacts
- profile-driven tests
- rule-based research flow

Where it belongs:

- `AN_BOT_SCOPE_REQUIREMENTS.md`
- `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md`
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

Missing canonical updates:

- agent role catalog schema
- command catalog schema
- benchmark scenario schema
- remediation proposal entity

## AnActionAgent Learner Coverage

Adopted concepts:

- learner system config
- knowledge base entry records
- knowledge base index
- taxonomy output
- session audit records
- benchmark reports
- reply generation
- extractor
- validator

Where it belongs:

- `AN_MEMORY_SCOPE_REQUIREMENTS.md`
- `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md`

Missing canonical updates:

- learned knowledge entry schema
- learner session schema
- taxonomy schema
- knowledge promotion policy

## AAstParser Coverage

Adopted concepts:

- everything as an entity
- English-defined behavior
- plugin architecture
- round-trip validation
- provenance
- type-anchored learning
- approval records
- gap analysis against raw requirements
- coverage analysis

Where it belongs:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md`
- `AN_MEMORY_SCOPE_REQUIREMENTS.md`

Missing canonical updates:

- parser coverage report schema
- approval record schema
- type-anchored template schema
- round-trip validation contract

## AnAgent Coverage

Adopted concepts:

- entity-only agent platform
- YAML entity definitions
- universal entity template
- agent profile schema
- skill records
- flow records
- menu entities
- fact records
- model selection policy
- review output contract

Where it belongs:

- `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md`
- `APPLICATION_ENTITY_DOCTRINE.md`
- `AN_BOT_SCOPE_REQUIREMENTS.md`

Missing canonical updates:

- universal entity template fields
- skill record fields
- menu entity fields
- review agent output schema

## AnGitAgent Coverage

Adopted concepts:

- repository domain
- 6D phase artifacts
- entity type requirements
- dataset rulebook
- rulebook index
- rule precedence
- fail with report on conflict
- dataset templates
- deployment manifest templates
- quality report and delivery report concepts

Where it belongs:

- `REPOSITORY_OPERATIONS_DOMAIN_REQUIREMENTS.md`
- `APPLICATION_ENTITY_DOCTRINE.md`
- `AGENT_REWORK_POLICY_AND_CONVENTIONS.md`

Missing canonical updates:

- repository entity datasets
- phase gate datasets
- deployment manifest schema
- rulebook index schema

## any2any Coverage

Adopted concepts:

- one input to many outputs
- conditional content parsing
- folder tree mode
- conversion manifest
- performance report
- policy wrapper
- capability matrix
- preservation and loss summary
- rule decision trace

Where it belongs:

- `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md`
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

Missing canonical updates:

- conversion profile schema
- capability matrix schema
- conversion report schema
- preservation status datasets

## anyFormat2js Coverage

Adopted concepts:

- file importer
- supported format matrix
- type detection
- parser per format
- traversal integration
- generated module wrapper
- bug and edge case matrix
- tree template conversion

Where it belongs:

- `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md`
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

Missing canonical updates:

- supported format dataset
- parser adapter matrix
- parser edge case dataset
- tree render template schema

## Dataset Additions Needed

Add 1D arrays for:

- agent entity type names
- skill field names
- agent profile field names
- command catalog field names
- benchmark scenario field names
- learner knowledge field names
- learner session field names
- approval status names
- parser coverage field names
- repository entity names
- repository phase names
- deployment manifest field names
- rulebook precedence names
- conversion input format names
- conversion output format names
- conversion feature fact names
- preservation status names
- parser edge case names

## Documentation Added

New domain docs:

- `AGENT_SYSTEM_DOMAIN_REQUIREMENTS.md`
- `REPOSITORY_OPERATIONS_DOMAIN_REQUIREMENTS.md`
- `FILE_CONVERSION_DOMAIN_REQUIREMENTS.md`

## Decision

The large folders are covered at concept and dataset level. They should not be
copied directly. They should feed canonical docs and dataset arrays through the
new domain docs and later schema updates.
