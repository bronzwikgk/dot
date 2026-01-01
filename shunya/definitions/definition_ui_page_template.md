---
Version: v1.0.0
Status: draft
Agent: Gemini CLI
Last Updated: 2025-12-29
---
# UI Page Definition Template

This document provides a template and checklist for defining a UI page, covering various aspects from purpose and information architecture to performance and compliance.

## Metadata

*   **Title**: `<Item> — UI Page Definition`
*   **Version**: `v0.1.0` (This will be updated to v1.0.0 for this template itself)
*   **Owner**: `<Team>`
*   **State**: Active
*   **ID Ref**: `<ID from dataset_ui_pages>`

## 1. Purpose & Scope
*   What this page is for, core value, primary user actions.

## 2. Information Architecture
*   **Sections/Blocks (ordered)**: [header, main, sidebar, footer, etc.]
*   **Key Components**: [tables, charts, forms, filters, tabs]
*   **Navigation Entry Points**: [menu path, deep-links, query params]

## 3. Authentication & RBAC
*   **Security Level**: `<Unsecured | Secured>`
*   **Auth Type**: `<Guest | Password | JWT | OAuth2 | MFA | SSO>`
*   **Roles & Permissions**: [User, Admin, System] with action matrix
*   **Session/Timeout behavior**

## 4. Data Contract
*   **Primary Entities**: [list]
*   **APIs Consumed**: [method, path, request schema, response schema]
*   **Events/Webhooks**: [name, payload shape]
*   **Caching Strategy**: [none | memory | http-cache | SWR]

## 5. UX Behavior
*   **Empty States**: [description + visuals]
*   **Loading/Skeleton**: [rules]
*   **Errors & Recovery**: [validation, retries, toasts]
*   **Accessibility (a11y)**: [focus order, ARIA, contrast]
*   **Localization**: [copy keys, number/date formats]

## 6. Telemetry & Observability
*   **Metrics**: [TTFB, FCP, interactions, conversions]
*   **Logs**: [user actions, API failures]
*   **Traces**: [if applicable]
*   **Audit Events**: [who/what/when]

## 7. Performance & SLA
*   **Performance Profile**: `<Light | Medium | Heavy>`
*   **SLA/SLO Class**: `<Batch | Near-real-time | Real-time>`
*   **Target Budgets**: [latency, FPS, CPU/memory hints]
*   **Degradation Strategy**: [progressive feature-off]

## 8. Compliance & Retention
*   **Compliance Class**: `<Public | PII | Financial | Audit>`
*   **Retention Policy**: [None | 90d | 1y | 7y | Indefinite]
*   **Data Sensitivity Notes**

## 9. Edge Cases
*   Enumerated scenarios (at least 5) with expected outcomes.

## 10. Testing & Quality Gates
*   **Test Coverage**: [unit, integration, e2e, visual]
*   **Critical Test Cases**: [list]
*   **Acceptance Criteria (Given/When/Then)**

## 11. Changelog Link
*   Link/Ref to project CHANGELOG section for this page.

## 12. Open Questions & TODOs
*   Known gaps, dependencies, design decisions pending.
