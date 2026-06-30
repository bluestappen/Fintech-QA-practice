Fintech QA Practice Portfolio
Overview

This repository is a personal QA practice portfolio created to demonstrate service QA thinking, test design, business logic validation, defect reporting, data validation, and basic test automation using mock financial service scenarios.

This is not a real company project.
It does not use real customer data, real banking systems, real securities trading systems, or confidential company information.

The goal of this project is not to build a production-level financial application, but to show how QA can approach financial services from the perspectives of requirement analysis, risk-based testing, business logic validation, defect reporting, UI/API/DB validation, and automation.

This project started with a simplified account and money movement flow to practice financial data consistency.
It is being extended with mock investment order scenarios to better reflect securities service QA.

Project Goal

This project was designed as a one-week portfolio sprint to demonstrate practical QA thinking for financial service quality assurance.

The main focus is not to write a large amount of code.
The main focus is to show how QA can understand a service, identify quality risks, design test scenarios, report defects, validate data consistency, and support release decisions.

The project focuses on:

Understanding mock financial service requirements
Creating a structured QA test plan
Designing functional, negative, and business logic test scenarios
Identifying high-risk areas in money movement and investment order flows
Writing Jira-style bug reports
Validating UI, API, and DB-level consistency
Creating basic Playwright E2E and API tests
Running tests through GitHub Actions
Generating test reports
My QA Background

My background includes approximately 3 years of software QA experience, mainly in IVI and Android Automotive OS validation.

Relevant experience includes:

BMW IVI / Android Automotive OS validation
ECU-TEST based automation test operation
Android Auto / CarPlay / OTA / Linux validation
Jira, ALM Octane, and Confluence usage
Global collaboration with teams in Germany, India, and Japan
ISTQB CTFL certification

This portfolio is an attempt to expand my QA experience from automotive software validation into service QA and financial product QA.

Mock Service Scope

This project uses simplified mock financial service scenarios.

The mock service is divided into two modules.

Module 1: Account & Money Movement

This module focuses on basic financial data consistency.

Included flows:

User login
Account balance inquiry
Money transfer
Transfer failure handling
Duplicate transfer prevention
Transaction history inquiry
Basic account status validation
Module 2: Investment Order Flow

This module focuses on simplified securities service QA scenarios.

Included flows:

Available cash inquiry
Mock stock information inquiry
Buy order placement
Insufficient buying power handling
Order history inquiry
Holdings update after completed order
Pending order cancellation
Duplicate order prevention

All service flows and data are fictional and created only for QA practice.

Repository Structure
fintech-qa-practice/
│
├── README.md
│
├── docs/
│   ├── 01-test-plan.md
│   ├── 02-test-scenarios.md
│   ├── 03-business-logic-qa.md
│   ├── 04-bug-reports.md
│   ├── 05-sql-validation.md
│   └── 06-release-test-summary.md
│
├── mock-app/
│   ├── README.md
│   ├── requirements.md
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── tests/
│   ├── e2e/
│   │   ├── login.spec.ts
│   │   ├── transfer.spec.ts
│   │   └── order.spec.ts
│   │
│   ├── api/
│   │   ├── account.api.spec.ts
│   │   ├── transfer.api.spec.ts
│   │   └── order.api.spec.ts
│   │
│   └── fixtures/
│       ├── users.json
│       ├── accounts.json
│       ├── transactions.json
│       ├── stocks.json
│       ├── orders.json
│       └── holdings.json
│
├── sql/
│   ├── account-validation.sql
│   ├── transfer-validation.sql
│   ├── transaction-history-validation.sql
│   ├── order-validation.sql
│   └── holdings-validation.sql
│
├── reports/
│   └── screenshots/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── playwright.config.ts
├── package.json
└── .gitignore
QA Deliverables
Document	Purpose
Test Plan	Defines QA scope, strategy, risks, entry criteria, and exit criteria
Test Scenarios	Converts requirements and risks into structured test cases
Business Logic QA	Defines financial business rules and validation points
Bug Reports	Provides Jira-style sample bug reports
SQL Validation	Shows backend data consistency validation examples
Release Test Summary	Summarizes test results, risks, and release recommendation
Mock Requirements	Defines fictional service requirements used for testing
QA Strategy

This project follows a risk-based QA approach.

In financial services, some defects have a higher impact than others.
For example, a minor UI issue is less critical than incorrect balance calculation, duplicate transaction processing, or incorrect holdings update after a completed order.

Therefore, this project prioritizes high-risk areas such as:

Incorrect account balance calculation
Transfer completion despite insufficient balance
Duplicate transfer processing
Failed transfer recorded as completed
Transaction history mismatch
Order completion despite insufficient buying power
Completed order not reflected in holdings
Canceled order displayed as completed
UI/API/DB data inconsistency

The main QA focus is not only whether the UI works, but whether financial data remains consistent across user actions, API responses, and backend data.

Business Logic Focus

The most important QA focus in this project is financial data consistency.

The project covers two types of business logic:

Money movement consistency
Investment order lifecycle consistency
Account & Money Movement Rules
Rule ID	Business Rule	Priority
BL-001	Transfer amount must not exceed available balance	P0
BL-002	Sender balance must decrease after successful transfer	P0
BL-003	Receiver balance must increase after successful transfer	P0
BL-004	Failed transfer must not change account balance	P0
BL-005	Failed transfer must not be recorded as completed	P0
BL-006	Duplicate transfer request must not be processed twice	P0
BL-007	Suspended account must not be allowed to transfer money	P0
BL-008	Transaction history must match actual transaction result	P0
Investment Order Rules
Rule ID	Business Rule	Priority
BL-011	Buy order amount must not exceed available cash	P0
BL-012	Completed buy order must decrease available cash	P0
BL-013	Completed buy order must increase holding quantity	P0
BL-014	Failed order must not change cash or holdings	P0
BL-015	Canceled order must not be shown as completed	P0
BL-016	Duplicate order request must not be processed twice	P0
Automation Scope

Automation is used as a supporting method for regression testing.

The initial automation scope is intentionally limited to core flows that are stable, repetitive, and business-critical.

Planned E2E Test Scope
Valid user login
Successful money transfer
Transfer failure due to insufficient balance
Transaction history verification
Successful buy order
Buy order failure due to insufficient buying power
Holdings update after completed order
Order history verification
Planned API Test Scope
Account API validation
Transfer API validation
Transaction API validation
Order API validation
Holdings API validation
Tech Stack
Area	Tool
Test Design	Markdown
E2E Automation	Playwright
API Testing	Playwright API Testing
Test Report	Playwright HTML Report / Allure Report
CI	GitHub Actions
DB Validation	SQL
Version Control	Git / GitHub
How to Run Tests

This section will be updated as the Playwright test environment is implemented.

Planned commands:

npm install
npx playwright install chromium
npm run test:e2e

To run tests with browser UI:

npm run test:headed

To view Playwright report:

npm run show-report
Project Status
Area	Status
Project structure	In Progress
README	Updated for financial service QA scope
Test Plan	Completed
Test Scenarios	Completed
Business Logic QA	Completed
Bug Report Samples	Completed
SQL Validation	Completed
Release Test Summary	Completed
Mock Requirements	Updating for investment order flow
Mock App UI	In Progress
Playwright E2E Tests	In Progress
API Tests	Planned
Allure Report	Planned
GitHub Actions	Planned
What This Portfolio Demonstrates

Through this project, I aim to demonstrate that I can approach QA as a structured quality activity, not only as test execution.

This includes:

Understanding product requirements
Identifying business risks
Designing meaningful test scenarios
Prioritizing high-risk flows
Reporting defects clearly
Validating data consistency
Automating important regression flows
Communicating QA results in a release-oriented format
Extending QA scope based on target service domain
Connecting money movement risks to investment order lifecycle risks
Evaluating release readiness based on business impact, not only pass rate
Interview Explanation

If asked why the project includes account transfer scenarios while applying for a securities QA role, the answer is:

The first iteration used a simplified money movement flow to practice financial data consistency, failure handling, duplicate request prevention, and transaction history validation.

These risks are also relevant to securities services because investment order flows require similar QA thinking around available cash, order status, holdings update, duplicate order prevention, and history consistency.

The project is therefore being extended with mock investment order scenarios to better reflect securities service QA.

Disclaimer

This repository is a personal QA practice portfolio.

It does not contain:

Real customer data
Real banking data
Real securities trading data
Confidential company information
Internal test assets from previous work experience
Real production service logic

All scenarios, data, and requirements are fictional and created only for learning and portfolio purposes.
