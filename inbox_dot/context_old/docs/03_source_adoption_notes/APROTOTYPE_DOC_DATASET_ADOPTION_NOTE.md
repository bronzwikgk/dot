# Aprototype Doc Dataset Adoption Note

## Scope

Reviewed selected documentation and config-style dataset files from
`input_temp/b7/Aprototype`.

This pass focused on natural-English definitions, commands, entities, rules,
keywords, global settings, validation behavior, and traversal requirements.

## Files Reviewed

- `input_temp/b7/Aprototype/README.md`
- `input_temp/b7/Aprototype/v1/config/actions.txt`
- `input_temp/b7/Aprototype/v1/config/action_implementations.txt`
- `input_temp/b7/Aprototype/v1/config/commands.txt`
- `input_temp/b7/Aprototype/v1/config/entities.txt`
- `input_temp/b7/Aprototype/v1/config/keywords.txt`
- `input_temp/b7/Aprototype/v1/config/rules.txt`
- `input_temp/b7/Aprototype/v1/config/behavior.txt`
- `input_temp/b7/Aprototype/v1/config/globals.txt`
- `input_temp/b7/Aprototype/v2/nanoPrototype_v2.md`

## What This Folder Is About

This folder is a small natural-English application prototype. In simple
English, it says:

- application behavior can be described in plain text
- changing the definition changes the application
- entities, commands, rules, outputs, and settings can all be described as data
- one definition can drive command-line and browser usage
- traversal should use one shared iterator utility

This matches the An App direction very closely.

## Adopted Concepts

### Definition Document Sections

The definition document should support sections for:

- builtins
- patterns
- section parsers
- executors
- project metadata
- entities
- commands
- validations
- rules
- outputs
- handlers
- configuration

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- `APPLICATION_ENTITY_DOCTRINE.md`
- dataset files

### Natural-English Config Datasets

The folder uses small text files as datasets:

- action definitions
- command definitions
- entity definitions
- keyword rules
- business rules
- behavior validations
- global settings

Adoption target:

- `APPLICATION_ENTITY_DOCTRINE.md`
- dataset files

### Command Definition Shape

Command definitions should capture:

- command name
- command purpose
- syntax
- output template
- empty result template
- accepted arguments
- required arguments
- permission or policy check

Adoption target:

- `AN_BOT_SCOPE_REQUIREMENTS.md`
- `APPLICATION_ENTITY_DOCTRINE.md`

### Entity Definition Shape

Entity definitions should capture:

- entity type
- properties
- property types
- relationships
- allowed actions
- validation rules

Adoption target:

- `APPLICATION_ENTITY_DOCTRINE.md`

### Keyword Parsing Rules

Keyword rules should capture:

- keyword
- parsing priority
- detected intent
- storage target
- output template

Example concept:

- keyword `is` can indicate a type definition
- keyword `has` can indicate a property definition
- keyword `can` can indicate an allowed action
- keyword `when` can indicate a rule
- keyword `must` can indicate validation

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`

### Rule And Validation Shape

Rules should support:

- trigger condition
- action to run
- validation statement
- output template
- storage target

Adoption target:

- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
- `APPLICATION_ENTITY_DOCTRINE.md`

### Shared Traversal Utility

The prototype points to one shared traversal utility for parsing definition
sections and walking generated structures.

Required traversal behavior:

- walk objects and arrays
- support depth limits
- avoid circular reference loops
- emit enter, leave, and leaf events
- return traversal reports and metrics

Adoption target:

- utility requirements
- `AN_APP_LANG_SCOPE_REQUIREMENTS.md`

## Dataset Additions Needed

Add or extend 1D arrays for:

- definition section names
- natural config file group names
- command field names
- entity definition field names
- keyword parsing field names
- keyword priority names
- rule field names
- validation field names
- output template field names
- traversal event names
- traversal report field names

## Documentation Updates Needed

1. `AN_APP_LANG_SCOPE_REQUIREMENTS.md`
   - Add canonical definition document section list.
   - Add keyword-to-structure parsing rules.
   - Add traversal utility expectations.

2. `APPLICATION_ENTITY_DOCTRINE.md`
   - Add definition document as an entity type.
   - Add command definition, rule definition, validation definition, and output
     template as entity-backed definition types.

3. `AN_BOT_SCOPE_REQUIREMENTS.md`
   - Add command definition shape and fallback output behavior.

4. `ENGLISH_LANGUAGE_DOMAIN_REQUIREMENTS.md`
   - Add keyword intent signals for `is`, `has`, `can`, `when`, `must`, and
     `all`.

## Decision

Adopt the natural-English definition concept. Do not adopt old folder names as
canonical names. This folder should inform An App definition documents, command
definitions, entity definitions, rule definitions, validation definitions, and
shared traversal requirements.
