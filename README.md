# Fintech QA Practice Portfolio

This repository is a personal QA practice portfolio designed to demonstrate service QA thinking, test design, business logic validation, and basic test automation skills using mock fintech service scenarios.

*** This is not a real company project.
*** All scenarios, data, and service flows are fictional and created only for learning and portfolio purposes.

## Project Purpose

The purpose of this project is to show how QA can approach a fintech service from multiple perspectives, including requirement analysis, risk-based test planning, functional validation, business rule verification, defect reporting, SQL-based data validation, and basic automation.

The main goal is not to write a large amount of code, but to demonstrate structured QA thinking and practical testing approaches for financial service flows.

## Background

2+ years of software QA experience (Jun.2026), mainly in IVI and Android Automotive OS validation.

Relevant experience includes:

* Linux / Android Automotive OS for IVI validation
* Automation test operation
* Jira, ALM Octane, and Confluence usage
* Global collaboration with teams mostly in Germany
* ISTQB CTFL certification

This project is an attempt to expand my QA experience from embedded and automotive software validation into service QA and fintech product QA.

## Mock Service Scope

This portfolio uses a fictional fintech service scenario with simplified banking features.

Main service flows include:

* User login
* Account balance inquiry
* Money transfer
* Transaction history inquiry
* Transfer failure handling
* Account status validation

## QA Focus Areas

### 1. Functional QA

Functional QA focuses on whether the main user flows work as expected.

Target flows:

* Login
* Account balance check
* Successful money transfer
* Failed money transfer due to insufficient balance
* Transaction history update after transfer

### 2. Business Logic QA

Business logic QA focuses on whether financial rules are correctly applied.

Example validation points:

* Transfer amount must not exceed available balance
* Balance must be updated only after a successful transfer
* Failed transfer must not be recorded as a completed transaction
* Duplicate transfer requests should be prevented
* Transaction history must match actual account activity
* Account status should affect whether transfer is allowed

### 3. API QA

API QA focuses on validating backend responses and business rule handling at the API level.

Example validation points:

* HTTP status code
* Response body structure
* Error message consistency
* Business validation result
* Transaction status
* Account balance consistency

### 4. SQL Validation

SQL validation is included to demonstrate how QA can verify backend data consistency beyond UI-level confirmation.

Example validation points:

* Account balance after transfer
* Transaction status
* Sender and receiver account records
* Failed transaction handling
* Transaction history consistency

### 5. Automation QA

Playwright is used to automate selected high-priority user flows.

Initial automation targets:

* Login flow
* Successful transfer flow
* Insufficient balance transfer flow
* Transaction history verification

## Risk-Based Test Strategy

This project follows a risk-based QA approach.
High-risk areas are prioritized first because they can directly affect financial data consistency and user trust.

### High Risk

* Incorrect balance calculation
* Transfer completed despite insufficient balance
* Duplicate transaction creation
* Transaction history mismatch
* API success response despite failed business validation

### Medium Risk

* Incorrect error message
* Delayed transaction history update
* UI and API data mismatch
* Invalid account status handling

### Low Risk

* Minor UI text issues
* Layout inconsistency
* Non-critical display formatting issues

## QA Deliverables

| Deliverable          | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| Test Plan            | Define test scope, strategy, risks, and exit criteria |
| Test Scenarios       | Convert user flows and business rules into test cases |
| Business Logic QA    | Validate financial rules and edge cases               |
| Bug Reports          | Show clear and reproducible defect reporting          |
| SQL Validation       | Verify backend data consistency                       |
| Playwright E2E Tests | Automate key user flows                               |
| API Tests            | Validate API behavior and business responses          |
| Allure Report        | Visualize test execution results                      |
| GitHub Actions       | Run tests automatically in CI                         |

## Repository Structure

```text
fintech-qa-practice/
├── docs/
│   ├── 01-test-plan.md
│   ├── 02-test-scenarios.md
│   ├── 03-business-logic-qa.md
│   ├── 04-bug-reports.md
│   ├── 05-sql-validation.md
│   └── 06-release-test-summary.md
├── mock-app/
├── tests/
│   ├── e2e/
│   ├── api/
│   └── fixtures/
├── sql/
├── reports/
├── .github/workflows/
├── playwright.config.ts
├── package.json
└── README.md
```

## Example Test Scenario

| ID     | Feature     | Scenario                                                 | Priority | Type            |
| ------ | ----------- | -------------------------------------------------------- | -------- | --------------- |
| TC-001 | Login       | Valid user can log in successfully                       | P1       | Functional      |
| TC-002 | Account     | User can view account balance                            | P1       | Functional      |
| TC-003 | Transfer    | User can transfer money within available balance         | P0       | Functional      |
| TC-004 | Transfer    | User cannot transfer more than available balance         | P0       | Negative        |
| TC-005 | Transfer    | Duplicate transfer request is prevented                  | P0       | Business Logic  |
| TC-006 | Transaction | Transaction history is updated after successful transfer | P0       | Data Validation |
| TC-007 | Transaction | Failed transfer is not recorded as completed             | P0       | Business Logic  |

## Example Business Rule

### BL-001: Transfer amount must not exceed available balance

**Given**

* User A has 100,000 KRW available balance

**When**

* User A attempts to transfer 150,000 KRW

**Then**

* The transfer request must be rejected
* The balance must remain 100,000 KRW
* The failed transaction must not be recorded as completed
* A proper error message should be displayed to the user

## Tech Stack

| Area            | Tool                   |
| --------------- | ---------------------- |
| Test Design     | Markdown               |
| E2E Automation  | Playwright             |
| API Testing     | Playwright API Testing |
| Test Report     | Allure Report          |
| CI              | GitHub Actions         |
| DB Validation   | SQL                    |
| Version Control | Git / GitHub           |

## How to Run Tests

This section will be updated after Playwright setup is completed.

Planned commands:

```bash
npm install
npx playwright install
npx playwright test
```

Planned Allure command:

```bash
npm run allure:report
```

## Disclaimer

This repository is a personal QA practice portfolio.

It does not contain any confidential company information, real customer data, or internal test assets from previous work experience.

All scenarios, data, and service flows are fictional and created only for learning and portfolio purposes.
