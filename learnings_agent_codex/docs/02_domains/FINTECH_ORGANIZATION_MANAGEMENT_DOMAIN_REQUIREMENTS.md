# Fintech Organization Management Domain Requirements

## Purpose

The Fintech Organization Management domain defines how An App can model,
operate, audit, and govern a fintech business.

This is a business domain. It should use the shared An App entity system,
schemas, datasets, templates, policies, runner, memory, UI surfaces, and quality
audit.

## Core Entities

- fintech_organization
- business_unit
- product
- customer
- account
- transaction
- ledger_entry
- payment
- payout
- settlement
- invoice
- subscription
- fee
- pricing_plan
- risk_case
- compliance_case
- kyc_record
- aml_check
- audit_record
- approval_request
- policy
- control
- report
- dashboard
- integration
- webhook
- reconciliation_run
- exception_queue

## Business Use Cases

- create fintech organization workspace
- define business units, products, teams, and operating policies
- manage customers, accounts, subscriptions, pricing plans, fees, and invoices
- ingest transactions and payments
- reconcile ledger entries, payments, payouts, and settlements
- track failed payments and exception queues
- create approval workflows for risky operations
- manage KYC and AML review records
- track compliance cases and audit evidence
- create finance, risk, compliance, operations, and executive dashboards
- generate monthly reports, audit packs, and board summaries
- maintain integration records for banks, payment providers, accounting tools,
  CRMs, and data vendors

## Pipelines

### Organization Setup Pipeline

1. ingest organization details
2. classify business model and products
3. create organization, business unit, product, role, and policy entities
4. validate names, required schemas, and approval policies
5. create default dashboards and reports
6. persist setup audit

### Transaction Operations Pipeline

1. ingest transaction batch
2. normalize records
3. validate schema, currency, account refs, and duplicate ids
4. classify transaction type
5. create ledger entries
6. reconcile with payments, payouts, and settlements
7. create exceptions
8. compose report
9. persist audit

### Compliance Review Pipeline

1. ingest customer or transaction evidence
2. classify KYC/AML risk
3. validate source and policy
4. create review case
5. request approval when required
6. record decision and evidence
7. update customer/account status
8. persist audit record

## UI Requirements

Required layouts:

- dashboard
- table_view
- kanban_view
- calendar_view
- timeline_view
- document_view
- form_view
- workflow_canvas
- chart_view

Required surfaces:

- operations dashboard
- risk dashboard
- compliance dashboard
- finance dashboard
- transaction table
- reconciliation view
- exception queue
- approval inbox
- customer profile
- account profile
- report builder
- audit evidence panel

## Validation Requirements

Validation must check:

- required entity fields
- duplicate ids
- currency code validity
- amount precision
- account references
- transaction references
- ledger balance rules
- policy approval requirements
- audit evidence
- status transitions
- unresolved exceptions
- unsupported provider data

## Contracts

Every transaction record should include:

- `id`
- `source_ref`
- `customer_ref`
- `account_ref`
- `transaction_type`
- `amount`
- `currency`
- `occurred_at`
- `status`
- `ledger_refs`
- `evidence_refs`
- `audit_ref`

Every compliance case should include:

- `id`
- `case_type`
- `subject_ref`
- `risk_level`
- `evidence_refs`
- `policy_refs`
- `reviewer_ref`
- `decision`
- `status`
- `audit_ref`

Every reconciliation run should include:

- `id`
- `input_refs`
- `matched_count`
- `unmatched_count`
- `exception_refs`
- `status`
- `report_ref`
- `audit_ref`

## Dataset Needs

- fintech_entity_names
- fintech_product_type_names
- transaction_type_names
- account_type_names
- payment_status_names
- settlement_status_names
- reconciliation_status_names
- compliance_case_type_names
- kyc_status_names
- aml_status_names
- risk_level_names
- approval_decision_names
- currency_code_names
- provider_type_names
- report_type_names

## Templates

Starter templates should include:

- fintech organization template
- payments operations template
- lending operations template
- subscription billing template
- compliance review template
- reconciliation template
- risk dashboard template
- finance dashboard template
- executive report template

## Non-Goals

This domain should not:

- execute real money movement in V1
- store secrets outside approved credential policy
- bypass compliance approval gates
- treat imported provider data as trusted without validation
- hide failed reconciliation records

## Minimum Complete V1

Minimum V1 should support:

- create one fintech organization
- create one product
- create one customer
- create one account
- ingest one transaction batch
- create ledger entries
- run one reconciliation
- create one exception
- create one compliance case
- render operations dashboard
- write audit record
