## dot Changelog
version: v1.0.6
status: inprogress
agent: KW-wonderAgent

jobs:
- release dot-actionFs v1.0.1 to carry the new dataset metadata
- keep the previous v1.0.0 helper unchanged for reference
- document and test dot-actionFs via a v1.0.1 standalone script plus rerun the ActionEntity runner

user inputs:
- always create new version when adding anything
- ad a const with dataset of method implemented and  a dataset of method tested and a dataset with future roadmap

updates:
- created `shunya/src/plugins/actionEntity/dot-actionFs-v1.0.1-inprogress-KW-wonderAgent.js` (v1.0.1) containing the dataset metadata plus the rest of the folder/file helpers while leaving the v1.0.0 copy untouched
- added `inprogress/test/dot-actionFS-test-v1.0.1-inprogress-KW-wonderAgent.js` plus its evidence/report entries to validate the ActionFs contract independently of ActionEntity
- re-imported the v1.0.1 helper from `dot-actionEntity-v1.0.1-inprogress-KW-wonderAgent.js` and reran `node dot-actionEntity-run-v1.0.4-inprogress-KW-wonderAgent.js` to cover the modular example with the new helper version
- updated `shunya/src/plugins/actionEntity/actionEntity_v4.js` to re-export the latest module bundle and preserved the earlier versions for historical context
jobs queue: []
