---
Version: v1.0.0
Status: draft
Agent: Gemini CLI
Last Updated: 2025-12-29
---
# Dataset Organisation Index

This document serves as the master index for datasets within the SaaS organization, covering various business domains. It provides an overview of available datasets and their key attributes.

## Master Dataset: SaaS Organisation Overview

```yaml
dataset-master-saas-org-v-1-4-0:
  description: Master dataset for SaaS Organisation. Covers all business, user, product, finance, trading, operations, analytics, AI, and compliance datasets.
  version: v-1-4-0
  file: form/dataset/dataset-master-saas-org-v-1-4-0.yml
  naming_rules: "<unique-ID>:<item-name>:<label>:#<commented-definition>"
  dataset_instructions: |
    Refer to the authoritative `definition_dataset.md` for comprehensive dataset instructions, structure, naming, and versioning rules.
  dataIndex:
    organisation-v-1-0-0: "Organisation dataset"
    department-v-1-0-0: "Department dataset"
    team-v-1-0-0: "Team dataset"
    role-v-1-0-0: "Role dataset"
    permission-v-1-0-0: "Permission dataset"
    business-unit-v-1-0-0: "Business Unit dataset"
    partner-contract-v-1-0-0: "Partner & Vendor contracts dataset"
    vendor-v-1-0-0: "Vendors dataset"
    policy-v-1-0-0: "Organisation-wide policies dataset"

    user-v-1-0-0: "Users dataset"
    employee-v-1-0-0: "Employees dataset"
    session-v-1-0-0: "User session dataset"
    ai-agent-v-1-0-0: "AI Agents dataset"
    persona-v-1-0-0: "Persona dataset"
    training-v-1-0-0: "Employee training dataset"
    user-preference-v-1-0-0: "User preferences dataset"

    product-v-1-0-0: "Products dataset"
    service-v-1-0-0: "Services dataset"
    subscription-plan-v-1-0-0: "Subscription plans dataset"
    pricing-plan-v-1-0-0: "Pricing plans dataset"
    api-v-1-0-0: "API dataset"
    service-level-agreement-v-1-0-0: "SLA dataset"
    product-roadmap-v-1-0-0: "Product roadmap dataset"

    account-v-1-0-0: "Accounts dataset"
    invoice-v-1-0-0: "Invoices dataset"
    payment-v-1-0-0: "Payments dataset"
    transaction-v-1-0-0: "Transactions dataset"
    revenue-v-1-0-0: "Revenue dataset"
    expense-v-1-0-0: "Expenses dataset"
    profit-loss-v-1-0-0: "Profit & Loss dataset"
    budget-v-1-0-0: "Budget dataset"

    portfolio-v-1-0-0: "Portfolio dataset"
    watchlist-v-1-0-0: "Watchlist dataset"
    rules-v-1-0-0: "Rules dataset"
    strategy-v-1-0-0: "Strategy dataset"
    filters-v-1-0-0: "Filters dataset"
    labels-v-1-0-0: "Labels dataset"
    order-book-v-1-0-0: "Order Book dataset"
    tradebook-v-1-0-0: "Tradebook dataset"
    order-v-1-0-0: "Orders dataset"
    order-gtt-v-1-0-0: "Good Till Trigger Orders dataset"
    candlestick-pattern-v-1-0-0: "Candlestick pattern dataset"
    holdings-v-1-0-0: "Holdings dataset"
    stock-historical-data-v-1-0-0: "Stock historical dataset"
    exchange-v-1-0-0: "Exchange dataset"

    services-v-1-0-0: "Organisation services dataset"
    token-v-1-0-0: "Tokens dataset"
    infrastructure-v-1-0-0: "Infrastructure dataset"
    deployment-pipeline-v-1-0-0: "Deployment pipeline dataset"
    cron-job-v-1-0-0: "Cron jobs dataset"
    api-log-v-1-0-0: "API logs dataset"
    error-log-v-1-0-0: "Error logs dataset"

    reports-v-1-0-0: "Reports dataset"
    log-v-1-0-0: "System logs dataset"
    changelog-v-1-0-0: "Change logs dataset" # Corrected from change-log
    release-notes-v-1-0-0: "Release notes dataset"

    project-v-1-0-0: "Projects dataset"
    sprint-v-1-0-0: "Sprints dataset"
    escalation-matrix-v-1-0-0: "Escalation matrix dataset"
    workflow-v-1-0-0: "Workflows dataset"

    ai-dataset-v-1-0-0: "AI datasets registry"
    ai-model-v-1-0-0: "AI models dataset"
    ai-benchmark-v-1-0-0: "AI benchmarks dataset"

    feedback-v-1-0-0: "Customer feedback dataset"
    knowledge-base-v-1-0-0: "Knowledge base dataset"
    community-v-1-0-0: "Community dataset"

    data-policy-v-1-0-0: "Data policy dataset"
    privacy-consent-v-1-0-0: "Privacy consent dataset"
    security-incident-v-1-0-0: "Security incidents dataset"
```