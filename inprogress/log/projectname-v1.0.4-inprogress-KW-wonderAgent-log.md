# dot Changelog

version: v1.0.4
status: inprogress
agent: KW-wonderAgent

jobs:
- Move ActionFs into a dedicated module file
- Move ActionEntity along with SchemaValidator and dataset metadata into an isolated module
- Rerun the bundled example via the new ESM runner after module split

user inputs:
- lest move actionEntity from shunya/src/plugins/actionEntity/actionEntity_v4.js in its own file with version adn status in its name
- lest move actionfs from shunya/src/plugins/actionEntity/actionEntity_v4.js in its own file with version adn status in its name

updates:
- extracted ActionFs and ActionEntity/SchemaValidator into versioned modules and updated the entry script to import/re-export them
- introduced dot-actionEntity-run-v1.0.4-inprogress-KW-wonderAgent.js to stub TTL timers and dynamically import the modular entry point
- added package.json (type module) so every plugin file can rely on `import`
- recorded the latest test output at inprogress/test/dot_v1.0.4-inprogress-KW-wonderAgent-test-report.md with evidence in ...-test-evidence.txt
jobs queue: []
