# Inspiration Feature Matrix

## Purpose

This matrix compares inspiration products by product capability, UI component,
state, setting, shortcut, schema, and dataset pattern.

It is a planning artifact for An App. It does not mean An App should clone every
feature. It helps decide what to adopt, defer, or reject.

## Legend

- `yes`: visible inspiration exists
- `partial`: related concept exists, but not the same shape
- `reference`: useful as product learning only
- `defer`: useful later, not foundation
- `no`: not a meaningful source for this item

## Product Columns

| key | source |
| --- | --- |
| vscode | Visual Studio Code / Monaco |
| notion | Notion-style workspace |
| appflowy | AppFlowy |
| affine | AFFiNE |
| logseq | Logseq |
| outline | Outline |
| n8n | n8n |
| nodered | Node-RED |
| webflow | Webflow |
| grapesjs | GrapesJS |
| excalidraw | Excalidraw |
| tldraw | tldraw |

## Core Product Capability Matrix

| capability | vscode | notion | appflowy | affine | logseq | outline | n8n | nodered | webflow | grapesjs | excalidraw | tldraw | An App adoption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code editing | yes | partial | partial | partial | partial | partial | partial | partial | partial | partial | no | no | required through `code_editor` layout |
| markdown editing | partial | partial | partial | partial | yes | yes | partial | partial | partial | partial | partial | partial | required through markdown/document tree |
| block editing | no | yes | yes | yes | partial | partial | no | no | partial | partial | no | partial | required through `block_editor` |
| outline editing | partial | partial | partial | partial | yes | partial | no | no | no | no | no | no | required through `collapsible_tree` |
| database views | no | yes | yes | yes | partial | partial | no | no | yes | partial | no | partial | required |
| knowledge graph | partial | partial | partial | partial | yes | partial | no | no | no | no | no | partial | required for memory/reasoning |
| workflow automation | partial | partial | partial | partial | partial | partial | yes | yes | partial | partial | no | partial | required |
| visual flow builder | partial | partial | no | partial | no | no | yes | yes | partial | partial | partial | partial | required for flow/pipeline UI |
| website builder | no | partial | partial | partial | no | no | no | no | yes | yes | no | partial | required later |
| infinite canvas | no | partial | no | yes | partial | no | partial | partial | partial | partial | yes | yes | required as `canvas_view` |
| diagramming | partial | partial | partial | yes | partial | partial | partial | partial | partial | partial | yes | yes | required |
| template gallery | partial | yes | yes | yes | partial | partial | yes | partial | yes | yes | partial | partial | required |
| import/export | yes | partial | partial | partial | yes | partial | yes | yes | yes | yes | yes | yes | required with round-trip validation |
| plugin/extension model | yes | partial | yes | partial | yes | partial | yes | yes | yes | yes | partial | yes | required |
| permissions | partial | yes | partial | partial | partial | yes | yes | partial | yes | partial | partial | partial | required for business apps |
| local-first/offline | partial | reference | yes | yes | yes | partial | partial | partial | no | partial | partial | partial | required as storage policy option |
| collaboration | yes | yes | yes | yes | partial | yes | yes | yes | yes | partial | yes | yes | defer full realtime; schema now |
| version history | yes | yes | partial | partial | yes | yes | yes | yes | yes | partial | partial | partial | required for governed artifacts |
| audit/run history | yes | partial | partial | partial | partial | partial | yes | yes | partial | partial | partial | partial | required |

## Layout And View Type Matrix

| view/layout | vscode | notion | appflowy | affine | logseq | outline | n8n | nodered | webflow | grapesjs | excalidraw | tldraw | An App name |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code editor | yes | partial | partial | partial | partial | partial | partial | partial | partial | partial | no | no | `code_editor` |
| document view | yes | yes | yes | yes | yes | yes | partial | partial | partial | partial | partial | partial | `document_view` |
| block editor | no | yes | yes | yes | partial | partial | no | no | partial | partial | no | partial | `block_editor` |
| notebook | partial | partial | partial | partial | partial | partial | no | no | no | no | no | no | `notebook` |
| collapsible tree | yes | partial | partial | partial | yes | partial | partial | partial | yes | yes | partial | partial | `collapsible_tree` |
| table | partial | yes | yes | yes | partial | partial | partial | partial | yes | partial | no | partial | `table_view` |
| list | yes | yes | yes | yes | yes | yes | yes | yes | yes | partial | partial | partial | `list_view` |
| board/kanban | partial | yes | yes | yes | partial | partial | no | no | no | partial | partial | partial | `kanban_view` |
| calendar | no | yes | yes | partial | partial | no | partial | partial | no | no | no | no | `calendar_view` |
| timeline | partial | yes | partial | partial | partial | no | partial | partial | no | no | partial | partial | `timeline_view` |
| gallery | no | yes | partial | partial | no | no | partial | no | yes | partial | partial | partial | `gallery_view` |
| form | partial | yes | partial | partial | partial | partial | yes | partial | yes | yes | no | partial | `form_view` |
| diagram | partial | partial | partial | yes | partial | partial | partial | partial | partial | partial | yes | yes | `diagram` |
| canvas | no | partial | no | yes | partial | no | yes | yes | yes | yes | yes | yes | `canvas_view` |
| workflow canvas | no | no | no | partial | no | no | yes | yes | no | partial | no | partial | `workflow_canvas` |
| dashboard | partial | partial | partial | partial | partial | partial | yes | yes | yes | partial | no | partial | `dashboard` |
| diff view | yes | partial | partial | partial | yes | partial | partial | partial | partial | partial | no | partial | `diff_view` |
| split view | yes | partial | partial | partial | partial | partial | partial | partial | partial | partial | no | partial | `split_view` |

## Block Type Matrix

| block type | notion | appflowy | affine | logseq | outline | vscode | webflow | grapesjs | An App adoption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| paragraph | yes | yes | yes | yes | yes | yes | yes | yes | required |
| heading_1 | yes | yes | yes | yes | yes | yes | yes | yes | required |
| heading_2 | yes | yes | yes | yes | yes | yes | yes | yes | required |
| heading_3 | yes | yes | yes | yes | yes | yes | yes | yes | required |
| bulleted_list | yes | yes | yes | yes | yes | yes | yes | yes | required |
| numbered_list | yes | yes | yes | yes | yes | yes | yes | yes | required |
| checklist | yes | yes | yes | yes | partial | partial | partial | partial | required |
| toggle | yes | partial | yes | partial | partial | partial | partial | partial | required |
| quote | yes | yes | yes | yes | yes | yes | yes | yes | required |
| callout | yes | partial | yes | partial | partial | partial | partial | partial | required |
| divider | yes | yes | yes | partial | yes | yes | yes | yes | required |
| code_block | yes | yes | yes | yes | yes | yes | yes | yes | required |
| equation | yes | partial | partial | partial | partial | partial | no | no | defer |
| table | yes | yes | yes | partial | yes | partial | partial | partial | required |
| image | yes | yes | yes | yes | yes | partial | yes | yes | required |
| video | yes | partial | partial | partial | partial | partial | yes | partial | defer |
| audio | yes | partial | partial | partial | partial | partial | partial | partial | defer |
| file | yes | yes | yes | yes | yes | yes | yes | partial | required |
| bookmark | yes | partial | partial | partial | partial | partial | partial | partial | defer |
| embed | yes | yes | yes | partial | partial | partial | yes | yes | required |
| page_reference | yes | yes | yes | yes | partial | partial | partial | partial | required |
| block_reference | partial | partial | partial | yes | partial | partial | no | no | required |
| backlink | partial | partial | partial | yes | partial | partial | no | no | required |
| relation | yes | yes | yes | yes | partial | partial | partial | partial | required |
| property | yes | yes | yes | yes | partial | partial | yes | yes | required |
| tag | yes | yes | yes | yes | partial | partial | yes | partial | required |
| mention | yes | yes | yes | yes | yes | partial | partial | partial | required |
| comment | yes | yes | yes | partial | yes | partial | yes | partial | required |
| citation | partial | partial | partial | partial | partial | partial | no | no | defer |
| command_block | no | no | partial | partial | no | yes | no | no | An App-specific |
| workflow_block | no | partial | partial | no | no | partial | no | partial | An App-specific |
| pipeline_block | no | no | partial | no | no | partial | no | partial | An App-specific |
| entity_block | partial | partial | partial | partial | partial | partial | partial | partial | An App-specific |
| schema_block | partial | partial | partial | partial | no | yes | partial | partial | An App-specific |
| dataset_block | yes | yes | yes | partial | partial | partial | yes | partial | An App-specific |
| policy_block | partial | partial | partial | partial | partial | partial | partial | partial | An App-specific |
| template_block | yes | yes | yes | partial | partial | partial | yes | yes | An App-specific |
| experiment_block | no | no | no | no | no | no | no | no | An App-specific |
| output_block | partial | partial | partial | partial | partial | yes | partial | partial | An App-specific |
| audit_block | partial | partial | partial | partial | partial | yes | partial | partial | An App-specific |

## Navigation Matrix

| navigation pattern | vscode | notion | appflowy | affine | logseq | outline | n8n | nodered | webflow | grapesjs | excalidraw | tldraw | An App adoption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| workspace switcher | yes | yes | yes | yes | yes | yes | partial | partial | yes | partial | partial | partial | required |
| project/application switcher | yes | partial | partial | partial | partial | partial | yes | yes | yes | partial | partial | partial | required |
| sidebar tree | yes | yes | yes | yes | yes | yes | yes | yes | yes | yes | partial | partial | required |
| file explorer | yes | partial | partial | partial | yes | partial | partial | partial | partial | partial | no | no | required |
| entity explorer | partial | partial | partial | partial | partial | partial | partial | partial | partial | partial | partial | partial | required |
| page tree | partial | yes | yes | yes | yes | yes | no | no | yes | partial | partial | yes | required |
| block tree | partial | partial | partial | partial | yes | partial | no | no | yes | yes | no | partial | required |
| breadcrumb | yes | partial | partial | partial | partial | yes | partial | partial | yes | partial | no | partial | required |
| tab bar | yes | partial | partial | partial | partial | partial | partial | yes | yes | partial | partial | partial | required |
| command palette | yes | partial | partial | partial | partial | partial | partial | partial | partial | partial | no | partial | required |
| quick switcher | yes | partial | partial | partial | partial | partial | partial | partial | partial | partial | no | partial | required |
| global search | yes | yes | yes | yes | yes | yes | yes | yes | partial | partial | partial | partial | required |
| backlinks | no | partial | partial | partial | yes | partial | no | no | no | no | no | no | required for memory |
| graph navigation | partial | partial | partial | yes | yes | partial | partial | partial | partial | partial | partial | partial | required |
| canvas zoom into node | no | partial | no | yes | partial | no | partial | partial | partial | partial | yes | yes | required |
| history back/forward | yes | yes | partial | partial | partial | yes | partial | partial | partial | partial | partial | partial | required |
| recent items | yes | yes | partial | partial | yes | partial | partial | partial | partial | partial | partial | partial | required |
| pinned/favorites | yes | yes | partial | partial | yes | partial | partial | partial | partial | partial | partial | partial | required |

## State Matrix

| state | meaning | An App requirement |
| --- | --- | --- |
| idle | loaded and waiting | all interactive components |
| focused | keyboard focus active | all input and navigation controls |
| hovered | pointer is over item | visual affordance only |
| active | current active control/view | navigation and tabs |
| selected | selected entity/node/text | editor, canvas, tree, table |
| editing | user can mutate content | editable surfaces |
| dragging | pointer drag active | canvas, tree, board, builder |
| resizing | size change active | panels, canvas shapes, columns |
| connecting | edge/wire creation active | diagram and workflow canvas |
| loading | async read/render active | all external or slow views |
| empty | no content yet | all list/document/run panels |
| dirty | unsaved local changes | editors/builders |
| saving | persistence in progress | editors/builders |
| saved | persistence completed | editors/builders |
| validating | validation in progress | governed records |
| valid | validation passed | governed records |
| warning | non-blocking issue | governed records |
| error | failed operation | all surfaces |
| blocked | policy prevents operation | risky/governed actions |
| disabled | control unavailable | all controls |
| read_only | visible but not mutable | docs, audit, restricted records |
| pending_approval | waiting for user/reviewer | risky actions |
| running | flow/run executing | runners, automations, experiments |
| completed | flow/run done | runners, automations, experiments |
| failed | flow/run failed | runners, automations, experiments |
| cancelled | stopped by user/policy | runners, automations |
| archived | hidden from active work | docs/entities/templates |

## Suggestion And Correction Matrix

| behavior | source inspiration | An App adoption |
| --- | --- | --- |
| command suggestions | VS Code command palette, n8n nodes | required |
| shortcut suggestions | VS Code shortcuts editor, tldraw shortcut dialog | required |
| block type suggestions | Notion/AppFlowy/AFFiNE style block menus | required |
| slash menu | Notion-style and block editors | required |
| field/property suggestions | database builders and schema editors | required |
| relation suggestions | knowledge workspaces and entity systems | required |
| template suggestions | Notion/AppFlowy/n8n/Webflow/GrapesJS | required |
| workflow node suggestions | n8n/Node-RED | required |
| approved name suggestions | An App vocabulary policy | required |
| near-match correction | language workbench | required |
| banned-word replacement | An App policy | required |
| missing-slot suggestion | command capability domain | required |
| incomplete-command suggestion | An App Lang | required |
| autocorrect apply | productivity editors | policy-controlled |
| correction learning | An App Memory/Bot | required but review-gated |

## Settings Matrix

| setting group | examples | An App requirement |
| --- | --- | --- |
| appearance | theme, density, font size | required |
| layout | sidebar position, panel position, default view | required |
| accessibility | reduce motion, labels, keyboard mode | required |
| keyboard_shortcuts | enable, override, reset, conflict policy | required |
| editor | word wrap, minimap, folding, line numbers | required for code/markdown |
| block_editor | slash menu, block drag, toggle behavior | required |
| canvas | grid, snap, zoom, shortcuts, tool defaults | required |
| workflow_canvas | node defaults, wire style, run display | required |
| table_view | visible fields, sort, filter, grouping | required |
| dashboard | widgets, refresh, time range | required |
| notifications | toasts, approvals, failures | required |
| autosuggest | enabled, source, confidence threshold | required |
| autocorrect | enabled, approval requirement | required |
| validation | strictness, show diagnostics | required |
| audit_visibility | show provenance, logs, acceptance | required |

## Completeness Score

| area | status | score |
| --- | --- | --- |
| inspiration source inventory | strong | 85% |
| high-level feature list | strong | 85% |
| UI component catalog | improved | 80% |
| Notion-style block catalog | improved | 80% |
| view/layout catalog | improved | 85% |
| navigation catalog | improved | 80% |
| state catalog | improved | 80% |
| autosuggest/autocorrect | improved | 75% |
| settings/preferences | improved | 75% |
| exact product shortcut tables | weak | 35% |
| exact API endpoint inventory | weak | 35% |
| source-code schema extraction | not done | 10% |
| mobile/tablet behavior | weak | 25% |
| collaboration/conflict states | partial | 45% |

## Remaining Gaps

- Build exact shortcut tables per product.
- Build exact settings/preferences table per product.
- Extract public API endpoint inventories where available.
- Inspect open-source repository data models for actual schema names.
- Add mobile and tablet navigation patterns.
- Add collaboration and conflict-resolution state matrix.
- Add import/export format matrix.
- Add permissions and roles matrix.
