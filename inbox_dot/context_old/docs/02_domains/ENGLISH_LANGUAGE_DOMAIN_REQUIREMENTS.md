# English Language Domain Requirements

## Purpose

English Language is a domain inside An App.

Its job is to provide approved grammar, vocabulary, sentence types, language
patterns, and interpretation rules that An App Lang can use when it needs to
understand English input.

An App Lang is the language capability. English Language is the domain knowledge
for English.

## Position In An App

Flow:

```text
English text
-> An App Lang
-> English Language domain datasets
-> grammar and sentence analysis
-> structured understanding
-> validated entity change plan or findings
```

The English Language domain should not mutate application state. It supplies
datasets, data maps, data tables, corpus rows, and rules used by An App Lang.

## Source Learning

This domain learns from:

- locked English sentence corpus
- sentence type dataset
- English sentence handbook
- parser tool reference
- sentence completion notes
- incomplete sentence detection notes
- sentence similarity and sentence diff notes
- typed template learning notes

Source-specific project names are not adopted. Useful grammar concepts are
converted into An App domain requirements.

Owned learning from sentence references:

- 13 sentence intent types
- sentence classification order
- declarative, interrogative, exclamatory, imperative, fragment, and empty
  structure types
- incomplete sentence findings
- prompt and sentence completion candidates
- keyword extraction with ignore-word policy
- sentence-level diff
- sentence boundary detection with abbreviation, acronym, initial, ellipsis,
  and punctuation edge cases
- optional semantic similarity provider
- typed template learning for grammar patterns
- confidence, priority, and refinement policy for English templates

## Required Entities

English Language should model these as entities:

- english_token
- english_phrase
- english_sentence
- english_sentence_type
- english_sentence_pattern
- english_part_of_speech_tag
- english_tense_result
- english_pronoun_reference
- english_semantic_role_assignment
- english_figure_of_speech_finding
- english_exception_finding
- english_compound_sentence
- english_grammar_corpus_entry
- english_locked_dataset_definition
- english_sentence_analysis
- english_incomplete_sentence_finding
- english_sentence_completion_candidate
- english_sentence_similarity_result
- english_template_learning_record
- english_type_lattice_node

## Required Datasets

English Language needs approved 1D datasets for:

- sentence intent type names
- sentence structure type names
- part of speech names
- tense names
- pronoun type names
- figure of speech names
- semantic role names
- language exception names
- sentence pattern names
- phrase type names
- article words
- determiner words
- preposition words
- conjunction words
- modal words
- auxiliary words
- negator words
- connector words
- marker words
- sentence completion method names
- sentence similarity signal names
- template learning operation names

## Required Data Maps

English Language needs relationship/mapping data for:

- sentence pattern to intent
- sentence intent type to entity type
- sentence structure type to parser strategy
- part of speech to phrase role
- tense pattern to tense name
- pronoun type to resolution rule
- semantic role to slot name
- figure of speech to interpretation policy
- language exception to handler
- compound sentence to ordered child sentences
- preposition to slot name
- marker word to sentence intent
- connector word to compound behavior
- negator word to negation behavior
- partial sentence to completion method
- sentence pair to similarity signal
- typed pattern to template
- template to refinement operation

## Required Data Tables

English Language needs tabular definitions for:

- locked corpus metadata
- sentence grammar corpus rows
- sentence type rows
- part of speech tagging rules
- tense detection rules
- pronoun resolution rules
- semantic role rules
- figure of speech rules
- exception handling rules
- compound sentence parse rows
- phrase pattern rows
- corpus count expectations
- lifecycle transition rows
- incomplete sentence detection rules
- sentence completion candidate rows
- sentence similarity scoring rows
- typed template rows
- template learning records
- template ranking rows

## Locked Corpus Requirements

English Language may use locked corpus files as canonical grammar references.

A locked corpus should declare:

- version
- status
- schema version
- maintainer
- last updated date
- source reference
- row format
- lifecycle transition policy
- changelog

Locked corpus rows should be append-only. A row should not be deleted. Deprecated
rows should be marked and skipped so audit history remains available.

Sentence grammar corpus row format:

- sentence type
- phrase pattern
- resolved entity type
- intent meaning

The corpus count should be calculated from actual rows during tests. Comments or
headers that claim a row count are not trusted unless tests verify them.

## Sentence Intent Types

Required sentence intent types:

- assertion
- query
- command
- condition
- negation
- comparison
- definition
- greeting
- farewell
- confirmation
- rejection
- clarification
- compound

Each sentence should resolve to one primary sentence intent type or produce an
ambiguity finding.

## Sentence Structure Types

Required sentence structure types:

- declarative
- interrogative
- imperative
- exclamatory
- fragment
- empty

These describe grammatical or pragmatic sentence structure and may be different
from downstream application intent.

Fragment and empty inputs should not be treated as failures. They should produce
structured findings and may trigger completion suggestions.

## Parts Of Speech

Required parts of speech:

- noun
- verb
- adjective
- adverb
- pronoun
- preposition
- conjunction
- determiner
- interjection
- auxiliary verb
- modal verb
- qualifier
- particle
- article
- quantifier

Each token tag should include:

- token
- start position
- end position
- tag name
- confidence
- source dataset
- findings

## Sentence Pattern Requirements

Required sentence patterns:

- subject plus verb
- subject plus verb plus object
- subject plus verb plus complement
- subject plus verb plus object plus object
- subject plus verb plus object plus complement
- subject plus auxiliary plus verb plus object
- subject plus auxiliary plus adverb plus verb plus object

Patterns should produce structured roles such as subject, verb, object,
complement, auxiliary, and adverb.

## Sentence Boundary Requirements

English Language should distinguish a complete sentence from text that merely
ends with punctuation.

Sentence boundary checks should handle:

- missing letters
- acronym endings
- leading initials
- ellipsis endings
- known abbreviations
- terminal period, question mark, exclamation mark, interrobang, and related
  punctuation

A sentence boundary result should include:

- input text
- normalized text
- boundary decision
- reason
- matched exception
- confidence

Boundary detection should be used by sentence diff, incomplete sentence
detection, completion suggestions, and corpus validation.

## Tense Requirements

Required English tenses:

- present simple
- present continuous
- present perfect
- present perfect continuous
- past simple
- past continuous
- past perfect
- past perfect continuous
- future simple
- future continuous
- future perfect
- future perfect continuous

Tense detection should identify:

- main verb
- auxiliary tokens
- aspect
- time meaning
- confidence
- findings

## Pronoun Resolution Requirements

Required pronoun categories:

- subject pronoun
- object pronoun
- possessive pronoun
- possessive determiner
- reflexive pronoun
- demonstrative pronoun
- relative pronoun
- interrogative pronoun
- indefinite pronoun

Pronoun resolution should find the nearest compatible prior noun or phrase when
context is available. If no compatible referent exists, it should emit a finding
instead of guessing silently.

## Semantic Role Requirements

Required semantic roles:

- agent
- patient
- theme
- instrument
- location
- time

Semantic roles should map back to extracted slots so downstream entity plans can
use them.

## Non-Literal Language Requirements

Required non-literal language types:

- idiom
- metaphor
- simile
- irony
- sarcasm
- euphemism
- collocation

Non-literal detections should add interpretation findings. They should not
automatically create action plans.

## Language Exception Requirements

Required exception types:

- irregular verb
- irregular noun
- phrasal verb
- ambiguous word
- homonym
- synonym
- antonym
- contraction
- stopword
- compound word

Exception handling should be dataset-backed. Unknown exceptions should produce
findings and may create pending learning records.

## English Analysis Pipeline

For English input, the domain should support this analysis pipeline:

1. tokenize input into words and punctuation-aware segments
2. tag each token with part of speech
3. parse sentence structure
4. detect tense and aspect
5. resolve pronouns
6. map semantic roles
7. detect sentence intent
8. detect non-literal language
9. expand contractions and synonym candidates
10. handle irregular forms and known exceptions
11. produce structured understanding with confidence and findings

The original text should always be preserved.

## Compound Sentence Requirements

A compound sentence should be parsed into ordered child sentences.

Each child sentence should have:

- child index
- child text
- sentence intent type
- parsed structure
- entities
- semantic roles
- findings

The compound parent should preserve connector words and ordering.

## Sentence Completion Requirements

English Language should support sentence completion for short phrases, prompts,
and partially typed input.

Completion methods:

- prefix completion
- next word prediction
- phrase completion
- prompt completion
- template completion
- rule-based completion
- contextual completion
- broken-word repair

Completion should use approved datasets, templates, prior context, and grammar
patterns. It should not require a large model for V1.

Each completion candidate should include:

- candidate text
- method
- confidence
- reason
- source pattern
- whether it completes a word, phrase, or sentence

## Incomplete Sentence Requirements

The domain should detect incomplete or broken English input.

Signals:

- empty input
- fragment input
- missing subject
- missing verb
- missing object where required
- dangling connector
- dangling preposition
- unmatched quote or bracket
- unresolved pronoun
- unfinished modal or auxiliary sequence

Incomplete detection should return confidence, reasons, and suggested next
questions or completion candidates.

## Sentence Similarity And Diff Requirements

The domain should compare sentences for continuation, correction, deduplication,
and learning.

Similarity signals:

- keyword overlap
- intent match
- entity overlap
- topic overlap
- time decay when used in conversation context
- semantic embedding when an approved provider is configured
- sentence diff

Sentence diff should split text into sentence-aware units before comparing old
and new text.

Similarity output should include:

- score
- signals used
- matching terms
- changed sentence units
- confidence
- findings

## Typed Template Learning Requirements

English Language should support symbolic, type-anchored template learning.

Core idea:

- parse input into a typed graph
- match typed templates against that graph
- compare actual output to expected output
- extract missing typed subgraphs
- generalize them into candidate templates
- test candidates before promotion

Template rows should include:

- template id
- applies to type
- subtype
- priority
- pattern
- conditions
- actions
- confidence
- success count
- failure count
- review status

Template learning operations:

- seed template
- induce template
- specialize template
- generalize template
- merge templates
- split template
- rank template
- prune template

Selection score should consider:

- type match
- pattern coverage
- historical success
- context recency

Template induction should require review before becoming an approved rule.

## Validation Requirements

English Language should validate:

- locked corpus metadata is present
- locked corpus rows match declared row format
- corpus counts are calculated from actual rows
- sentence type is approved
- sentence structure type is approved
- part of speech name is approved
- tense name is approved
- pronoun type is approved
- semantic role name is approved
- figure of speech name is approved
- exception type is approved
- compound child order is preserved
- original text is preserved
- incomplete input emits findings
- completion candidates use approved methods
- sentence similarity signals are declared
- learned templates remain pending until reviewed

## Test Requirements

Required tests:

- locked corpus metadata tests
- corpus row format tests
- corpus count tests
- sentence intent classification tests
- sentence structure classification tests
- part-of-speech tagging tests
- sentence pattern tests
- tense detection tests
- pronoun resolution tests
- semantic role mapping tests
- non-literal language tests
- exception handling tests
- compound sentence tests
- original text preservation tests
- incomplete sentence tests
- sentence completion tests
- sentence similarity tests
- sentence diff tests
- typed template learning tests
- template ranking tests
- template refinement tests

## Integration Requirements

English Language must integrate with:

- an_app_lang
- entity_validator
- validation word datasets
- corpus system
- golden corpus runner
- diagnostics system
- learning store
- sentence completion provider
- sentence similarity provider
- typed template registry

An App Lang should call English Language when an input is detected as English or
when a user explicitly selects the English domain.

## Non-Goals

English Language should not:

- act as a general chatbot
- mutate application state
- guess silently
- replace An App Lang
- approve new words automatically
- treat every metaphor or idiom as executable instruction
- delete locked corpus rows

## Minimum Complete V1

Minimum V1 should support:

- load one locked English corpus
- validate corpus metadata
- validate corpus row count
- classify one sentence intent type
- classify one sentence structure type
- tag parts of speech for one sentence
- detect one tense
- resolve one pronoun when context is supplied
- map agent and patient semantic roles
- flag one idiom or metaphor
- expand one contraction
- normalize one irregular verb
- parse one compound sentence into ordered child sentences
- return confidence and findings
- detect one incomplete sentence
- generate one completion candidate
- compare two sentences for similarity
- produce one sentence diff result
- create one pending template learning record
