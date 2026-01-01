version: v1.1.13
status: inprogress
agent: KW-wonderAgent
last_updated: "2026-01-01"
documentation_version: "3.1"

# EHh FRAMEWORK v1.1.13 - DOCUMENTATION INDEX
# ============================================================================
# Master index covering manifest, design, specifications, guides, references, and dataset tree
# Last Updated: 2026-01-01
# Version: v1.1.13
# Status: In Progress
# ============================================================================

manifest:
  version: "v1.1.13"
  status: "inprogress"
  project:
    name: "Everything Happens Here (EHh)"
    acronym: "EHh"
    description: "Dataset-driven orchestration framework powered by ActionApp, ActionEngine, ActionEntity, and supporting plugins/utils."
    story: "EHh unifies entity flows, semantic navigation, and runtime validation across Node.js, Browser, and Apps Script."
  key_contacts:
    project_lead: "KW-wonderAgent"
    architecture: "ActionApp Core + Plugin catalog"
    documentation: "Renderer outputs + dataset index"
  repository:
    structure: "Single codebase with dataset-driven docs and renderer orchestration"
    languages: ["JavaScript (ES6)"]
    runtimes: ["Node.js", "Browser", "Google Apps Script"]
    dataset_root: "shunya/dataset_shunya/dataset_shunya_ehh"
  compliance:
    constraints:
      - "No arrow functions, no forEach"
      - "ES module imports only"
      - "Classes with constructors/methods"
      - "Semantic nav/UI cues in ActionView"
    validation: "ActionValidator ensures schema, RBAC, and CORS rules"

# ============================================================================  
# 1. PROJECT MANIFEST INDEX
# ============================================================================

project_manifest:
  sections:
    overview:
      file: "EHh-MANIFEST-OVERVIEW.md"
      sections:
        - "Vision, Objectives, and Purpose"
        - "Problem Addressed (audience POV)"
        - "Key Differentiators & Use Cases"
        - "Success Metrics & Constraints"
    requirements:
      file: "EHh-MANIFEST-REQUIREMENTS.md"
      sections:
        - "Constraints & Technical Requirements"
        - "Action Registry (single-verb commands + synonyms)"
        - "Entity Catalog and Roles"
        - "Plugin/Utility Expectations"
    governance:
      file: "EHh-MANIFEST-GOVERNANCE.md"
      sections:
        - "Agent Job Queue & Status Tracking"
        - "Changelog & Semantic Versioning"
        - "Renderer Workflow (index → datasets → EHh doc)"

# ============================================================================  
# 2. TECHNICAL DESIGN DOCUMENT INDEX
# ============================================================================

technical_design:
  architecture_overview:
    file: "EHh-DESIGN-ARCHITECTURE.md"
    sections:
      - "ActionApp Core Layer (Entry.js, ActionApp.js)"
      - "Plugin Mesh (Entity, View, Event, Server, Client, Engine)"
      - "Utility Services (Validator, Fs, Loader, Spreadsheet Adapter, etc.)"
      - "Renderer orchestration (DocumentRenderer, actionTree, actionFs)"
  plugin_framework:
    file: "EHh-DESIGN-PLUGINS.md"
    sections:
      - "Plugin list (ActionEntity, ActionView, ActionEvent, ActionServer, ActionClient, ActionEngine Flow)"
      - "Plugin lifecycle and hook points"
      - "Utility vs plugin boundary"
  entity_system:
    file: "EHh-DESIGN-ENTITY.md"
    sections:
      - "Entities (project, task, user, dataset, datatable)"
      - "Storage orchestration (ActionFs, LocalStorage, IndexedDB, ActionIndexDb)"
      - "Flow definitions (System Flow dataset)"
  navigation_design:
    file: "EHh-DESIGN-NAV.md"
    sections:
      - "ActionView semantic navigation requirements"
      - "Pointer/hover cues and accessibility helpers"
      - "Navigation specification dataset entries"

# ============================================================================  
# 3. TECHNICAL SPECIFICATION DOCUMENT INDEX
# ============================================================================

technical_specifications:
  coding:
    file: "EHh-SPEC-CODING.md"
    sections:
      - "Class-based Node.js implementation rules"
      - "Naming conventions (dataset-* files)"
      - "Dataset file structure (const arrays in .txt)"
  api:
    file: "EHh-SPEC-API.md"
    sections:
      - "HttpService, ActionServer, ActionClient responsibilities"
      - "Circuit breaker, retry, OAuth flows"
  configuration:
    file: "EHh-SPEC-CONFIG.md"
    sections:
      - "ActionLoader (formerly ConfigLoader) format support"
      - "Dataset index linkage"
  documentation:
    file: "EHh-SPEC-DOCS.md"
    sections:
      - "Renderer output (shunya/ehh-unified-doc.md)"
      - "Index and dataset coordination"
      - "Workflow for updates/test evidence"

# ============================================================================  
# 4. IMPLEMENTATION GUIDES & REFERENCES INDEX
# ============================================================================

implementation_guides:
  setup_guide:
    file: "EHh-GUIDE-SETUP.md"
    sections:
      - "Prerequisites & dependencies"
      - "Local/Browser/AppScript setup"
      - "Renderer execution steps"
  development_guide:
    file: "EHh-GUIDE-DEVELOPMENT.md"
    sections:
      - "Project structure navigation"
      - "Testing & code contribution"
  api_guide:
    file: "EHh-GUIDE-API.md"
    sections:
      - "Endpoint usage"
      - "Plugin development hints"

reference_docs:
  file: "EHh-REFERENCES.md"
  sections:
    - "ActionEntity API references"
    - "Plugin & Utility descriptions"
    - "Dataset definitions"

# ============================================================================  
# 5. DATASET INDEX TREE
# ============================================================================

datasets:
  metadata:
    index_file: this document
    renderer_output: "shunya/ehh-unified-doc.md"
    total: 24
  list:
    - objective: "ehh-v1.1.0-active-KW-wonderAgent-dataset-objective.txt"
    - purpose: "ehh-v1.1.0-active-KW-wonderAgent-dataset-purpose.txt"
    - usecases: "ehh-v1.1.0-active-KW-wonderAgent-dataset-usecases.txt"
    - problem_addressed: "ehh-v1.1.0-active-KW-wonderAgent-dataset-problem-addressed.txt"
    - audience: "ehh-v1.1.0-active-KW-wonderAgent-dataset-audience.txt"
    - constraints: "ehh-v1.1.0-active-KW-wonderAgent-dataset-constraints.txt"
    - requirements: "ehh-v1.1.0-active-KW-wonderAgent-dataset-requirements.txt"
    - features: "ehh-v1.1.0-active-KW-wonderAgent-dataset-features.txt"
    - technical_specifications: "ehh-v1.1.0-active-KW-wonderAgent-dataset-technical-specifications.txt"
    - design_specifications: "ehh-v1.1.0-active-KW-wonderAgent-dataset-design-specifications.txt"
    - navigation_specification: "ehh-v1.1.0-active-KW-wonderAgent-dataset-navigation.txt"
    - instructions: "ehh-v1.1.0-active-KW-wonderAgent-dataset-instructions.txt"
    - rules: "ehh-v1.1.0-active-KW-wonderAgent-dataset-rules.txt"
    - ui_specs: "ehh-v1.1.0-active-KW-wonderAgent-dataset-ui-specs.txt"
    - action: "ehh-v1.1.0-active-KW-wonderAgent-dataset-action.txt"
    - entity: "ehh-v1.1.0-active-KW-wonderAgent-dataset-entity.txt"
    - plugin: "ehh-v1.1.0-active-KW-wonderAgent-dataset-plugin.txt"
    - utility: "ehh-v1.1.0-active-KW-wonderAgent-dataset-utility.txt"
    - system_flow: "ehh-v1.1.0-active-KW-wonderAgent-dataset-system-flow.txt"
    - conditions: "ehh-v1.1.0-active-KW-wonderAgent-dataset-conditions.txt"
    - class: "ehh-v1.1.0-active-KW-wonderAgent-dataset-class.txt"
    - methods: "ehh-v1.1.0-active-KW-wonderAgent-dataset-methods.txt"
    - variables: "ehh-v1.1.0-active-KW-wonderAgent-dataset-variables.txt"

# ============================================================================  
# 6. DOCUMENTATION WORKFLOW & STATS
# ============================================================================

documentation_workflow:
  creation_process:
    - "Collect dataset entries and maintain action/utility/plugin naming conventions."
    - "Update this index whenever new datasets or documents appear."
    - "Run shunya/ehh-renderDoc.mjs; output goes to shunya/ehh-unified-doc.md."
  review_cycle:
    - "Weekly reviews for dataset accuracy."
    - "Per-release validation of renderer output and documentation index."
  quality_checks:
    - "Dataset files follow naming pattern dataset-<category>-<name>.txt."
    - "Action verbs remain single word with hyphen/underscore synonyms."
    - "Utilities/plugins documented in respective datasets."

documentation_stats:
  total_documents: 9
  total_datasets: 24
  renderer_output: "shunya/ehh-unified-doc.md"
  directory_tree:
    - shunya/
    -   dataset_shunya/
    -     dataset_shunya_ehh/
    -       dataset-*.txt
    -   ehh-renderDoc.mjs
    -   ehh-unified-doc.md
    -   ehh-v1.1.13-inprogress-KW-wonderAgent-index.md
    -   inprogress/
    -     log/
    -       ehh-*.md

# ============================================================================  
# END OF EHh INDEX
# ============================================================================
