# Test Plan

## 1. Purpose

This document defines the QA test plan for the mock financial service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can plan testing activities based on service requirements, business risks, test scope, priorities, and release criteria.

This is not a real company project.
All service flows, test data, risks, and release criteria are fictional and created only for personal QA practice.

---

## 2. Project Overview

This project is a personal QA practice portfolio for a simplified mock financial service.

The project started with account and money movement scenarios to practice financial data consistency.
It is extended with investment order scenarios to better demonstrate QA thinking for securities service flows.

The project focuses on two modules.

### Module 1: Account & Money Movement

This module includes:

* User login
* Account balance inquiry
* Money transfer
* Insufficient balance handling
* Duplicate transfer prevention
* Transaction history inquiry
* Account status validation

### Module 2: Investment Order Flow

This module includes:

* Available cash inquiry
* Mock stock information inquiry
* Buy order placement
* Insufficient buying power handling
* Order history inquiry
* Holdings update after completed order
* Pending order cancellation
* Duplicate order prevention

---

## 3. QA Objectives

The QA objectives are:

* Verify that core financial service flows work as expected
* Identify high-risk areas before release
* Validate business rules for money movement and investment order flows
* Verify data consistency across UI, API, and DB layers
* Confirm that failed flows do not change financial data incorrectly
* Confirm that duplicate requests are not processed multiple times
* Provide clear defect reports with business impact
* Summarize release readiness based on risk and defect severity
* Select stable and important flows for automation

---

## 4. Test Approach

This project follows a risk-based QA approach.

In financial services, not all defects have the same impact.

For example, a minor UI text issue is less critical than:

* Incorrect account balance
* Transfer completion despite insufficient balance
* Duplicate transaction processing
* Failed transaction recorded as completed
* Buy order completion despite insufficient buying power
* Completed order not reflected in holdings
* Canceled order shown as completed

Therefore, this test plan prioritizes high-risk business logic and data consistency scenarios.

The main test approach includes:

* Requirement-based testing
* Risk-based testing
* Functional testing
* Negative testing
* Business logic validation
* UI/API/DB consistency validation
* Regression testing
* Basic automation testing using Playwright

---

## 5. Test Levels

| Test Level      | Purpose                                                      | Example                                                 |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| UI / E2E Test   | Verify user-facing flows from login to result confirmation   | Login, transfer, buy order, holdings check              |
| API Test        | Verify service response, validation logic, and response data | Transfer API, order API, holdings API                   |
| SQL Validation  | Verify backend data consistency                              | Balance, available cash, transactions, orders, holdings |
| Manual Test     | Verify usability, exploratory behavior, and visual details   | Error messages, display format, status labels           |
| Regression Test | Verify that critical flows still work after changes          | Transfer, order, duplicate request prevention           |

---

## 6. Test Scope

## 6.1 In Scope

The following areas are included in this test plan.

### Account & Money Movement

* Valid login
* Invalid login
* Account balance inquiry
* Successful money transfer
* Insufficient balance transfer attempt
* Invalid transfer amount
* Invalid receiver account
* Suspended account restriction
* Duplicate transfer prevention
* Transaction history validation
* UI/API/DB balance consistency

### Investment Order Flow

* Available cash inquiry
* Mock stock information inquiry
* Successful buy order
* Insufficient buying power order attempt
* Failed order handling
* Holdings update after completed order
* Order history validation
* Pending order cancellation
* Duplicate order prevention
* UI/API/DB holdings consistency

### QA Deliverables

* Test plan
* Test scenarios
* Business logic QA document
* Bug report samples
* SQL validation examples
* Release test summary
* Basic Playwright automation

---

## 6.2 Out of Scope

The following areas are not included in this practice project.

* Real banking integration
* Real securities trading integration
* Real customer authentication
* Real customer data
* Real payment network
* Real stock market data
* Real exchange connection
* Real-time price streaming
* Investment recommendation logic
* Complex financial product calculation
* Security penetration testing
* Performance testing at scale
* Compliance-level validation
* Production monitoring
* Mobile native app testing

These are excluded because the project is a personal QA practice portfolio using simplified mock service scenarios.

---

## 7. Test Environment

| Item           | Description                                                           |
| -------------- | --------------------------------------------------------------------- |
| Project        | Fintech QA Practice Portfolio                                         |
| Service Type   | Mock financial service                                                |
| Environment    | Local mock QA environment                                             |
| Browser        | Chromium                                                              |
| E2E Automation | Playwright                                                            |
| API Testing    | Playwright API Testing                                                |
| DB Validation  | Mock SQL validation                                                   |
| CI             | GitHub Actions                                                        |
| Test Report    | Playwright HTML Report / Allure Report                                |
| Test Data      | Fictional users, accounts, stocks, orders, transactions, and holdings |

---

## 8. Test Data

## 8.1 Mock Account Data

| User Type        | User ID          | Account ID | Account Status |     Balance | Available Cash |
| ---------------- | ---------------- | ---------- | -------------- | ----------: | -------------: |
| Standard user    | user_standard    | ACC-001    | ACTIVE         | 100,000 KRW |    100,000 KRW |
| Low balance user | user_low_balance | ACC-002    | ACTIVE         |   1,000 KRW |      1,000 KRW |
| Suspended user   | user_suspended   | ACC-003    | SUSPENDED      | 100,000 KRW |    100,000 KRW |
| Receiver user    | user_receiver    | ACC-004    | ACTIVE         |  50,000 KRW |     50,000 KRW |

## 8.2 Mock Investment Data

| Stock ID | Stock Name          | Current Price |
| -------- | ------------------- | ------------: |
| MOCK-001 | Toss Mock Stock     |    70,000 KRW |
| MOCK-002 | Fintech Growth Mock |    30,000 KRW |

| User ID          | Account ID | Stock ID | Initial Quantity |
| ---------------- | ---------- | -------- | ---------------: |
| user_standard    | ACC-001    | MOCK-001 |                0 |
| user_standard    | ACC-001    | MOCK-002 |                0 |
| user_low_balance | ACC-002    | MOCK-001 |                0 |

---

## 9. Risk-Based Test Priority

## 9.1 High Risk Areas

| Risk ID | Risk Description                                             | Impact                                              | Priority |
| ------- | ------------------------------------------------------------ | --------------------------------------------------- | -------- |
| R-001   | Balance is not updated correctly after transfer              | Incorrect financial data                            | P0       |
| R-002   | Transfer succeeds despite insufficient balance               | User can transfer more money than available balance | P0       |
| R-003   | Duplicate transfer is processed multiple times               | Duplicate withdrawal                                | P0       |
| R-004   | Failed transfer is recorded as completed                     | Misleading transaction history                      | P0       |
| R-005   | Transaction history does not match actual transaction result | User trust and audit issue                          | P0       |
| R-006   | Buy order succeeds despite insufficient buying power         | Incorrect order execution                           | P0       |
| R-007   | Available cash is not updated after completed order          | Incorrect buying power                              | P0       |
| R-008   | Completed buy order is not reflected in holdings             | Incorrect portfolio data                            | P0       |
| R-009   | Failed order changes cash or holdings                        | Financial data inconsistency                        | P0       |
| R-010   | Duplicate order is processed multiple times                  | Duplicate cash deduction and holdings update        | P0       |
| R-011   | Canceled order is shown as completed                         | Misleading order status                             | P0       |

## 9.2 Medium Risk Areas

| Risk ID | Risk Description                                   | Impact                                 | Priority |
| ------- | -------------------------------------------------- | -------------------------------------- | -------- |
| R-012   | Error message is unclear                           | User confusion                         | P1       |
| R-013   | API response has missing fields                    | Test and service integration issue     | P1       |
| R-014   | UI and API data are inconsistent                   | User may see stale or incorrect data   | P1       |
| R-015   | Suspended account restriction is unclear           | Policy and UX issue                    | P1       |
| R-016   | Latest transaction or order is not displayed first | User may misunderstand recent activity | P1       |

## 9.3 Low Risk Areas

| Risk ID | Risk Description       | Impact                  | Priority |
| ------- | ---------------------- | ----------------------- | -------- |
| R-017   | Minor UI text issue    | Low usability impact    | P2       |
| R-018   | Currency format issue  | Display inconsistency   | P2       |
| R-019   | Timestamp format issue | Minor readability issue | P2       |
| R-020   | Layout spacing issue   | Cosmetic issue          | P2       |

---

## 10. Entry Criteria

Testing can start when the following conditions are met.

| Criteria                          | Description                                                              |
| --------------------------------- | ------------------------------------------------------------------------ |
| Requirement baseline is available | Mock service requirements are documented                                 |
| Test data is defined              | Users, accounts, stocks, orders, and holdings data are available         |
| Test scenarios are prepared       | Functional, negative, business logic, API, and SQL scenarios are defined |
| Mock app is available             | Basic UI or mock service is ready for testing                            |
| Test environment is accessible    | Local test environment can be executed                                   |
| Basic tools are ready             | GitHub, Markdown, Playwright, and SQL examples are prepared              |

---

## 11. Exit Criteria

Testing can be considered complete when the following conditions are met.

| Criteria                     | Required Result                 |
| ---------------------------- | ------------------------------- |
| P0 test cases executed       | 100% executed                   |
| P0 defects                   | No unresolved P0 defects        |
| Core money movement flow     | Passed                          |
| Core investment order flow   | Passed                          |
| Balance consistency          | Verified across UI, API, and DB |
| Available cash consistency   | Verified across UI, API, and DB |
| Holdings consistency         | Verified across UI, API, and DB |
| Failed flow handling         | Verified                        |
| Duplicate request prevention | Verified                        |
| Release test summary         | Completed                       |
| Regression test              | Completed for critical flows    |

---

## 12. Defect Management

Defects are reported using a Jira-style format.

Each defect should include:

* Bug ID
* Title
* Severity
* Priority
* Feature
* Environment
* Preconditions
* Test data
* Steps to reproduce
* Expected result
* Actual result
* Business impact
* Evidence
* Related test case
* Related business rule
* Suggested investigation area

Defects should be prioritized based on business impact, not only technical behavior.

For example, a holdings update failure after a completed buy order should be treated as a critical financial data consistency defect.

---

## 13. Severity Definition

| Severity | Meaning                                                                     | Example                                                |
| -------- | --------------------------------------------------------------------------- | ------------------------------------------------------ |
| Critical | Causes financial data inconsistency or blocks a core financial service flow | Buy order succeeds despite insufficient available cash |
| Major    | Affects an important feature but may have a workaround                      | UI balance does not match API response                 |
| Minor    | Affects usability but does not block the main flow                          | Invalid receiver error message is unclear              |
| Trivial  | Cosmetic issue with very low impact                                         | Minor spacing issue                                    |

---

## 14. Priority Definition

| Priority | Meaning                                           | Example                                                                   |
| -------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| P0       | Must be fixed before release                      | Incorrect balance, available cash, holdings, transaction, or order status |
| P1       | Should be fixed before release candidate approval | Important API or UI consistency issue                                     |
| P2       | Can be fixed after higher-risk issues             | Minor message or format issue                                             |
| P3       | Optional improvement                              | Text refinement                                                           |

---

## 15. Test Execution Strategy

## 15.1 Manual Testing

Manual testing is used for:

* Requirement understanding
* Exploratory testing
* Error message review
* UI display validation
* Status label validation
* Release judgment support

Manual testing is especially useful for checking whether the service behavior is understandable from a user perspective.

## 15.2 Automation Testing

Automation is used for stable and repetitive regression scenarios.

Automation candidates include:

* Valid login
* Successful transfer
* Insufficient balance transfer
* Transaction history verification
* Successful buy order
* Insufficient buying power order
* Holdings update after completed order
* Order history verification

## 15.3 API Testing

API testing is used to verify:

* Account response
* Transfer request result
* Transaction history response
* Stock information response
* Order request result
* Order history response
* Holdings response

## 15.4 SQL Validation

SQL validation is used to verify:

* Account balance
* Available cash
* Transaction records
* Order records
* Holdings records
* Duplicate request count
* Failed transaction or failed order status

---

## 16. Regression Strategy

Regression testing should focus on high-risk financial service flows.

## 16.1 Core Regression Scope

| Area                      | Regression Focus                                     |
| ------------------------- | ---------------------------------------------------- |
| Login                     | User can access the service with valid credentials   |
| Account balance           | Balance is displayed correctly                       |
| Transfer                  | Successful transfer updates balances correctly       |
| Insufficient balance      | Failed transfer does not change balances             |
| Duplicate transfer        | Duplicate request is not processed twice             |
| Transaction history       | Transaction result is displayed correctly            |
| Buy order                 | Successful order updates available cash and holdings |
| Insufficient buying power | Failed order does not change cash or holdings        |
| Duplicate order           | Duplicate order is not processed twice               |
| Order history             | Order status is displayed correctly                  |
| Holdings                  | Completed order is reflected in holdings             |

## 16.2 Regression Priority

| Priority | Regression Target                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------- |
| P0       | Balance, available cash, holdings, transaction history, order history, duplicate request prevention |
| P1       | API response fields, UI/API consistency, error messages                                             |
| P2       | Currency format, timestamp format, minor UI text                                                    |

---

## 17. Automation Strategy

Automation is not used to replace QA thinking.

In this project, automation is used to support regression testing for critical flows.

The automation strategy is:

1. Start with stable login scenarios
2. Add core money movement E2E scenarios
3. Add core investment order E2E scenarios
4. Add API validation for account, transfer, order, and holdings
5. Run tests through GitHub Actions
6. Generate test reports for review

Planned automation files:

```text
tests/e2e/
├── login.spec.ts
├── transfer.spec.ts
└── order.spec.ts

tests/api/
├── account.api.spec.ts
├── transfer.api.spec.ts
└── order.api.spec.ts
```

---

## 18. Communication and Reporting

QA results should be communicated clearly and based on business impact.

The following reports are used in this project:

| Report               | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| Test Plan            | Defines strategy, scope, risks, and criteria            |
| Test Scenarios       | Defines test cases and validation points                |
| Business Logic QA    | Explains important business rules                       |
| Bug Reports          | Communicates defects with reproduction steps and impact |
| SQL Validation       | Shows backend data validation examples                  |
| Release Test Summary | Communicates release readiness and final recommendation |
| Playwright Report    | Shows automation execution result                       |

---

## 19. Release Judgment Criteria

The release decision should be based on risk and defect impact.

## 19.1 GO Criteria

A release can be recommended only if:

* No unresolved P0 defects remain
* Core money movement flows pass
* Core investment order flows pass
* Balance, available cash, and holdings consistency are verified
* Failed flows do not change financial data incorrectly
* Duplicate request prevention is verified
* Transaction and order history show correct status
* Regression tests pass

## 19.2 NO-GO Criteria

A release should not be recommended if:

* Any unresolved P0 defect exists
* Transfer can be completed despite insufficient balance
* Buy order can be completed despite insufficient buying power
* Completed order is not reflected in holdings
* Failed transaction or failed order is shown as completed
* Duplicate transfer or duplicate order is processed
* UI/API/DB data is inconsistent in core financial flows
* Regression testing is not completed for critical flows

---

## 20. Limitations

This test plan has the following limitations.

* The service is a simplified mock service
* The project does not connect to a real backend
* SQL validation is based on mock table assumptions
* API testing is based on assumed endpoints
* Real banking or securities system behavior is not implemented
* Real compliance validation is not included
* Real market price behavior is not included
* The automation scope is intentionally limited for portfolio purposes

These limitations are acceptable because the goal is to demonstrate QA thinking, not to build a production financial service.

---

## 21. Summary

This test plan defines the QA strategy for a mock financial service.

The plan covers account and money movement scenarios as well as investment order scenarios.

The main focus is to validate financial data consistency, business logic correctness, failed flow handling, duplicate request prevention, and release readiness.

This document demonstrates how QA can approach a service from requirement understanding to risk analysis, test design, defect management, automation planning, and release decision-making.

