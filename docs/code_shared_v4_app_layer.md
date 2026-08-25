# code_shared_v4_app_layer.md

**Version:** v4.0.0
**Status:** active
**Owner:** agent_codex_an_app
**Merged from:** template_trio, template_gallery, docs_routing, manifest_validation

## What It Is

V4 app layer: template store/composer/renderer, gallery, docs routing, manifest validation.

## Components

### template_trio
Template store, composer, and tree renderer boundary. No duplicate names, no hard dependency cycles.

### template_gallery
Template gallery with card entity/layout and create action.

### docs_routing
Docs route entity, route selection state, deep-link validation.

### manifest_validation
Manifest and route/action registration validation for stale entries and duplicate bindings.

## Runtime Contract

- template trio validates no duplicate names
- manifests validate for stale/duplicate entries
- docs routes resolve to valid module paths

## Related Files

- code/utilities/code_shared_template_trio_v4_0_0_draft.js
- code/utilities/code_shared_template_gallery_v4_0_0_draft.js
- code/utilities/code_shared_docs_routing_v4_0_0_draft.js
- code/utilities/code_shared_manifest_validation_v4_0_0_draft.js
