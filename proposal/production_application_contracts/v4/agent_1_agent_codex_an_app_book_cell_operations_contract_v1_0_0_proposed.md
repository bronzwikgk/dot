# V4 Contract 003: Book and Cell Operations

Date: 2026-08-25
Status: active
Owner agent: agent_codex_an_app
Priority: p0
Domain: product_surface

## Purpose

Define live book/cell create, move, remove, and render operations for the notebook interface.

## Required Records

- book_entity_record
- cell_entity_record
- cell_output_record
- book_cell_relationship_record

## Required Operations

- create_book
- add_cell
- move_cell
- remove_cell
- render_book
- render_cell

## Inputs

- book_ref
- cell_ref
- position
- content

## Outputs

- book_entity_record
- cell_entity_record

## Validation

- books have unique ids
- cells belong to exactly one book
- cell order is consistent
- removal is audited

## Success Criteria

- create book works
- add cell to book works
- move cell changes position
- remove cell updates book

## Do

- use entity doctrine for book and cell
- preserve cell content on move
- audit removal operations

## Do Not

- do not allow orphan cells
- do not lose content on move
- do not bypass audit on removal
