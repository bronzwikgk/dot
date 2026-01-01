Project: projectname
Version: 1.0.26
Status: inprogress
Agent: WA-Alpha wonderAgent

User message: recreate,  ActionApp.js
            - Features:
                - detect runtime,
                - loads and Parses global config, resolve directives, like include.
                - stores global config in this.config as per config,
                - initGlobal variables,
                - load utility and packages
                - init plugins,
                - init flows,
                - resolvePath
            - Dependency
                -actionInclude
                - actionParser 
            - Construtor
            - method
                - detectRuntime
                - initGlobal,
                - loadutility
                - initplugins,
                - initflows,
                - resolvePath
                - handleRequest
                -sendResponse
            - input
                - AppConfig

## Summary
- Rebuilt the ActionApp fragment to match the new feature list/dependency/methods structure you described, tagging every item with documentation metadata and keeping the path/type/priority scheme intact.

## Jobs Queue
1. Confirm downstream tooling reads the new structure as expected.
2. Keep evolving fragments/manifests and log further significant updates.
3. Document any next steps once code splits follow this new structure.

## Status
- Documentation update only; no tests run.
