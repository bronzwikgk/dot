# Shared Markdown Pipeline Utility

## File

`code/utilities/code_shared_markdown_pipeline_v3_0_0_draft.js`

## What It Is

The shared markdown pipeline utility decomposes markdown into blocks, parses
block metadata, and composes blocks back into markdown.

## What It Does

It exposes:

- `decompose(markdown)`
- `compose(blocks)`
- `parse(markdown)`
- `run(markdown)`

## When To Use It

Use it for simple markdown round trips, documentation parsing experiments, and
early document-tree work.

## Runtime Contract

- Markdown is split into line blocks.
- Heading lines become heading blocks with level.
- Non-heading lines become text blocks.
- Compose joins block text back into markdown.

## Known Limits

- It is line-oriented only.
- It does not yet preserve rich markdown structures, tables, links, or source
  spans.

## How It Was Tested

The promoted module was imported from `dot/code` as part of the promotion smoke
checks.
