# Test Plan

## 1. Purpose

This document defines the QA test plan for the Fintech QA Practice Portfolio.

The purpose of this test plan is to demonstrate how QA can approach a mock fintech service through structured planning, risk-based testing, business logic validation, defect reporting, and basic automation.

This is not a real company project.
All service flows, requirements, and test data are fictional and created only for personal QA practice.

---

## 2. Project Scope

This project focuses on a mock fintech service that provides basic banking features.

The main service features covered in this portfolio are:

* User login
* Account balance inquiry
* Money transfer
* Transaction history inquiry
* Transfer failure handling
* Basic account status validation

The project is designed to show QA thinking rather than to build a complete production-level banking system.

---

## 3. QA Objectives

The main QA objectives are:

* Understand mock service requirements
* Identify high-risk areas in fintech user flows
* Design functional and negative test scenarios
* Validate business rules related to money transfer
* Check UI, API, and DB-level consistency
* Write clear and reproducible bug reports
* Automate selected regression test cases
* Execute automated tests through GitHub Actions
* Generate test execution reports using Allure Report

---

## 4. Test Approach

This project follows a risk-based testing approach.

In fintech services, some defects have a higher business impact than others.
For example, a minor UI text issue is less critical than an incorrect account balance calculation.

Therefore, test priority is determined based on the following criteria:

* Impact on financial data
* Impact on user trust
* Possibility of data inconsistency
* Frequency of user flow
* Severity of failure
* Regression risk

High-risk test areas are tested first and considered more important for release judgment.

---

## 5. Test Levels

### 5.1 UI / E2E Test

UI and E2E tests validate whether important user flows work correctly from the user's perspective.

Target flows:

* Login
* Account balance check
* Successful transfer
* Failed transfer due to insufficient balance
* Transaction history verification

### 5.2 API Test

API tests validate whether backend responses are correct and whether business rules are handled properly at the API level.

Target APIs:

* Account inquiry API
* Transfer request API
* Transaction history API

Validation points:

* HTTP status code
* Response body structure
* Error response
* Transaction status
* Balance consistency

### 5.3 SQL Validation

SQL validation is used to verify backend data consistency.

Validation points:

* Account balance after transfer
* Transaction record creation
* Transaction status
* Failed transaction handling
* Sender and receiver account consistency

---

## 6. Test Scope

### 6.1 In Scope

The following areas are included in this project:

* Login flow validation
* Account balance display validation
* Money transfer success scenario
* Money transfer failure scenario
* Insufficient balance validation
* Duplicate transfer request validation
* Transaction history validation
* Basic API response validation
* Basic SQL data validation
* Playwright-based E2E test automation
* GitHub Actions-based automated test execution
* Allure Report generation

### 6.2 Out of Scope

The following areas are not included in this project:

* Real banking system integration
* Real customer data validation
* Real payment network integration
* Security penetration testing
* Performance testing at scale
* Mobile app testing
* Production-level monitoring
* Real authentication service integration
* Complex financial product calculation

These areas are excluded because this project is a personal practice portfolio, not a real financial service QA project.

---

## 7. Test Environment

The assumed test environment is a local mock service environment.

| Item                | Description                            |
| ------------------- | -------------------------------------- |
| Application         | Mock fintech service                   |
| Test Framework      | Playwright                             |
| API Test Tool       | Playwright API Testing                 |
| Report Tool         | Allure Report                          |
| CI Tool             | GitHub Actions                         |
| Database Validation | SQL examples                           |
| Browser             | Chromium                               |
| Test Data           | Mock users, accounts, and transactions |

---

## 8. Test Data

Mock test data is used for all test scenarios.

Example test data:

| User Type        | User ID          | Account Status | Balance     |
| ---------------- | ---------------- | -------------- | ----------- |
| Normal user      | user_standard    | Active         | 100,000 KRW |
| Low balance user | user_low_balance | Active         | 1,000 KRW   |
| Suspended user   | user_suspended   | Suspended      | 100,000 KRW |
| Receiver user    | user_receiver    | Active         | 50,000 KRW  |

Test data is fictional and used only for practice purposes.

---

## 9. Risk-Based Test Priority

### 9.1 High Risk

High-risk areas can directly affect financial data, user trust, or transaction integrity.

| Risk ID | Risk Area            | Example Risk                                           | Priority |
| ------- | -------------------- | ------------------------------------------------------ | -------- |
| R-001   | Balance calculation  | Balance is not updated correctly after transfer        | P0       |
| R-002   | Insufficient balance | Transfer succeeds despite insufficient balance         | P0       |
| R-003   | Duplicate request    | Same transfer is processed multiple times              | P0       |
| R-004   | Transaction history  | Completed transfer is missing from transaction history | P0       |
| R-005   | Failed transaction   | Failed transfer is recorded as completed               | P0       |

### 9.2 Medium Risk

Medium-risk areas affect service reliability or user experience but may not directly cause financial data corruption.

| Risk ID | Risk Area       | Example Risk                                     | Priority |
| ------- | --------------- | ------------------------------------------------ | -------- |
| R-006   | Error message   | Error message is unclear or inconsistent         | P1       |
| R-007   | API response    | API response body has missing fields             | P1       |
| R-008   | UI/API mismatch | UI shows different data from API response        | P1       |
| R-009   | Account status  | Suspended account can access restricted features | P1       |

### 9.3 Low Risk

Low-risk areas have limited business impact.

| Risk ID | Risk Area      | Example Risk                                   | Priority |
| ------- | -------------- | ---------------------------------------------- | -------- |
| R-010   | UI text        | Minor typo in button label                     | P2       |
| R-011   | Layout         | Minor spacing issue                            | P2       |
| R-012   | Display format | Date format is inconsistent but understandable | P2       |

---

## 10. Entry Criteria

Testing can start when the following conditions are met:

* Mock service requirements are defined
* Main user flows are identified
* Test scenarios are drafted
* Test data is prepared
* Test environment is available
* Playwright project is initialized
* Basic API endpoints or mock responses are available

---

## 11. Exit Criteria

Testing can be considered complete when the following conditions are met:

* P0 test cases are executed
* Critical business logic scenarios are validated
* Major defects are documented
* Automated E2E tests are executable
* API tests are executable
* SQL validation examples are documented
* Allure Report can be generated
* GitHub Actions workflow is configured
* README and QA documents are updated

---

## 12. Defect Management

Defects are documented in a Jira-style format.

Each bug report should include:

* Bug ID
* Title
* Severity
* Priority
* Environment
* Preconditions
* Steps to reproduce
* Expected result
* Actual result
* Impact
* Evidence
* Related test case ID

Severity is determined by the actual impact of the defect.

Priority is determined by how urgently the defect should be fixed.

---

## 13. Severity Definition

| Severity | Definition                                                                        | Example                                               |
| -------- | --------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Critical | A defect that can cause financial data inconsistency or block a core service flow | Transfer succeeds despite insufficient balance        |
| Major    | A defect that affects an important feature but has a workaround                   | Transaction history is delayed but eventually updated |
| Minor    | A defect that affects usability but does not block the main flow                  | Error message is unclear                              |
| Trivial  | A cosmetic issue with very low impact                                             | Minor UI spacing issue                                |

---

## 14. Priority Definition

| Priority | Definition                   | Example                            |
| -------- | ---------------------------- | ---------------------------------- |
| P0       | Must be fixed before release | Incorrect balance calculation      |
| P1       | Should be fixed soon         | Important error message is missing |
| P2       | Can be fixed later           | Minor UI inconsistency             |
| P3       | Optional improvement         | Text refinement                    |

---

## 15. Regression Strategy

Regression testing focuses on high-risk and frequently used flows.

Regression target areas:

* Login
* Account balance inquiry
* Successful transfer
* Failed transfer
* Transaction history
* API response consistency
* Balance data validation

Automated tests are used for selected regression scenarios that are stable, repetitive, and business-critical.

Manual testing is used for exploratory checks, edge cases, and scenarios that are not yet suitable for automation.

---

## 16. Automation Strategy

Automation is not the main goal of this project.
It is used as a supporting method to repeatedly verify important user flows.

Automation candidates are selected based on:

* Business importance
* Regression frequency
* Stability of test flow
* Clear expected result
* Low dependency on external systems

Initial automation targets:

| Test ID | Scenario                           | Reason for Automation   |
| ------- | ---------------------------------- | ----------------------- |
| TC-001  | Login with valid user              | Common entry flow       |
| TC-003  | Successful money transfer          | Core business flow      |
| TC-004  | Transfer with insufficient balance | High-risk negative case |
| TC-006  | Transaction history update         | Data consistency check  |

---

## 17. Communication and Reporting

Test results are summarized in a structured format.

The test summary should include:

* Test execution date
* Test scope
* Number of passed and failed test cases
* Critical defects
* Open issues
* Risk summary
* Release recommendation

Allure Report is used to provide visual test execution results for automated tests.

---

## 18. Release Judgment Criteria

A mock release can be considered acceptable when:

* No open P0 defects remain
* Core transfer scenarios pass
* Balance calculation is correct
* Failed transactions are handled correctly
* Transaction history matches actual transaction results
* Automated smoke tests pass
* Known issues are documented

A mock release should not be recommended when:

* Balance data is incorrect
* Transfer can be completed with insufficient balance
* Duplicate transfer can be processed
* Failed transactions are marked as completed
* P0 defects remain unresolved

---

## 19. Limitations

This test plan is based on a simplified mock fintech service.

The project does not include:

* Real banking infrastructure
* Real user authentication
* Real transaction processing
* Real customer data
* Full security validation
* Full performance testing

The purpose is to demonstrate QA thinking and practical test design at a portfolio level.

---

## 20. Summary

This test plan defines how the mock fintech service will be validated from a QA perspective.

The main focus is not only on whether the service works, but also on whether important financial business rules are protected.

This project demonstrates a QA approach that includes planning, risk analysis, scenario design, defect reporting, data validation, and basic automation.

