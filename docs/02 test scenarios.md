# Test Scenarios

## 1. Purpose

This document defines test scenarios for the mock fintech service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can convert service requirements and business rules into structured test cases.

This is not a real company project.
All scenarios and test data are fictional and created only for personal QA practice.

---

## 2. Test Scenario Scope

The test scenarios cover the following mock fintech service features:

* Login
* Account balance inquiry
* Money transfer
* Transfer failure handling
* Transaction history inquiry
* Account status validation
* Basic API and data consistency checks

The focus is on core financial flows where defects can affect user trust, financial data consistency, or service reliability.

---

## 3. Priority Definition

| Priority | Meaning                                                                 | Example                       |
| -------- | ----------------------------------------------------------------------- | ----------------------------- |
| P0       | Must be tested first because failure can cause critical business impact | Incorrect balance calculation |
| P1       | Important flow that should be tested before release                     | Error message validation      |
| P2       | Lower-risk flow or usability-related check                              | Minor UI display issue        |

---

## 4. Test Type Definition

| Test Type       | Meaning                                                    |
| --------------- | ---------------------------------------------------------- |
| Functional      | Verifies that a feature works as expected                  |
| Negative        | Verifies that invalid actions are properly blocked         |
| Business Logic  | Verifies business rules and financial logic                |
| Data Validation | Verifies consistency between UI, API, and DB               |
| Regression      | Verifies that existing core flows still work after changes |
| UI              | Verifies visible screen elements and user interaction      |
| API             | Verifies backend response and validation result            |

---

## 5. Test Data

The following mock test data is used for the scenarios.

| User Type        | User ID          | Account ID | Account Status | Balance     |
| ---------------- | ---------------- | ---------- | -------------- | ----------- |
| Standard user    | user_standard    | ACC-001    | Active         | 100,000 KRW |
| Low balance user | user_low_balance | ACC-002    | Active         | 1,000 KRW   |
| Suspended user   | user_suspended   | ACC-003    | Suspended      | 100,000 KRW |
| Receiver user    | user_receiver    | ACC-004    | Active         | 50,000 KRW  |

---

## 6. Test Scenarios

## 6.1 Login

| Test Case ID | Feature | Scenario                            | Priority | Test Type      | Expected Result                                            |
| ------------ | ------- | ----------------------------------- | -------- | -------------- | ---------------------------------------------------------- |
| TC-LOGIN-001 | Login   | User logs in with valid credentials | P1       | Functional     | User is redirected to the account dashboard                |
| TC-LOGIN-002 | Login   | User logs in with invalid password  | P1       | Negative       | Login is rejected and an error message is displayed        |
| TC-LOGIN-003 | Login   | User submits empty ID and password  | P2       | Negative / UI  | Required field validation messages are displayed           |
| TC-LOGIN-004 | Login   | Suspended user attempts to log in   | P1       | Business Logic | Login is blocked or restricted according to account policy |

---

## 6.2 Account Balance Inquiry

| Test Case ID | Feature | Scenario                                        | Priority | Test Type       | Expected Result                                                         |
| ------------ | ------- | ----------------------------------------------- | -------- | --------------- | ----------------------------------------------------------------------- |
| TC-ACC-001   | Account | User views account balance after login          | P1       | Functional      | Current account balance is displayed correctly                          |
| TC-ACC-002   | Account | UI balance matches API account balance response | P0       | Data Validation | Balance shown on UI is the same as API response                         |
| TC-ACC-003   | Account | Account balance is displayed in KRW format      | P2       | UI              | Balance is displayed with proper currency format                        |
| TC-ACC-004   | Account | Suspended account balance is viewed             | P1       | Business Logic  | Account status is displayed and restricted actions are handled properly |

---

## 6.3 Money Transfer - Successful Flow

| Test Case ID | Feature  | Scenario                                                          | Priority | Test Type                        | Expected Result                                        |
| ------------ | -------- | ----------------------------------------------------------------- | -------- | -------------------------------- | ------------------------------------------------------ |
| TC-TRF-001   | Transfer | User transfers money within available balance                     | P0       | Functional / Business Logic      | Transfer is completed successfully                     |
| TC-TRF-002   | Transfer | Sender balance decreases after successful transfer                | P0       | Business Logic / Data Validation | Sender balance is decreased by the transfer amount     |
| TC-TRF-003   | Transfer | Receiver balance increases after successful transfer              | P0       | Business Logic / Data Validation | Receiver balance is increased by the transfer amount   |
| TC-TRF-004   | Transfer | Successful transfer is recorded in transaction history            | P0       | Data Validation                  | Transaction history shows completed transfer           |
| TC-TRF-005   | Transfer | Transfer confirmation screen displays correct amount and receiver | P1       | UI / Functional                  | Confirmation screen shows correct transfer information |

---

## 6.4 Money Transfer - Negative Flow

| Test Case ID | Feature  | Scenario                                                              | Priority | Test Type                        | Expected Result                                            |
| ------------ | -------- | --------------------------------------------------------------------- | -------- | -------------------------------- | ---------------------------------------------------------- |
| TC-TRF-006   | Transfer | User attempts to transfer more than available balance                 | P0       | Negative / Business Logic        | Transfer is rejected due to insufficient balance           |
| TC-TRF-007   | Transfer | Balance remains unchanged after insufficient balance transfer attempt | P0       | Data Validation                  | Sender balance is not changed                              |
| TC-TRF-008   | Transfer | Failed transfer is not recorded as completed                          | P0       | Business Logic / Data Validation | Transaction status is not marked as completed              |
| TC-TRF-009   | Transfer | User attempts to transfer zero KRW                                    | P1       | Negative                         | Transfer is rejected with validation message               |
| TC-TRF-010   | Transfer | User attempts to transfer negative amount                             | P1       | Negative                         | Transfer is rejected with validation message               |
| TC-TRF-011   | Transfer | User attempts to transfer without receiver account                    | P1       | Negative / UI                    | Required receiver information message is displayed         |
| TC-TRF-012   | Transfer | Suspended user attempts to transfer money                             | P0       | Business Logic                   | Transfer is blocked due to account status                  |
| TC-TRF-013   | Transfer | User attempts to transfer to invalid account                          | P1       | Negative                         | Transfer is rejected and proper error message is displayed |

---

## 6.5 Duplicate Transfer Request

| Test Case ID | Feature  | Scenario                                                         | Priority | Test Type                   | Expected Result                          |
| ------------ | -------- | ---------------------------------------------------------------- | -------- | --------------------------- | ---------------------------------------- |
| TC-DUP-001   | Transfer | User clicks transfer submit button multiple times quickly        | P0       | Business Logic / Regression | Only one transfer request is processed   |
| TC-DUP-002   | Transfer | Same transfer API request is sent twice with same request ID     | P0       | API / Business Logic        | Duplicate request is rejected or ignored |
| TC-DUP-003   | Transfer | Duplicate transfer does not create duplicate transaction records | P0       | Data Validation             | Only one completed transaction exists    |
| TC-DUP-004   | Transfer | Balance is deducted only once for duplicate transfer attempt     | P0       | Data Validation             | Sender balance is decreased only once    |

---

## 6.6 Transaction History

| Test Case ID | Feature             | Scenario                                                 | Priority | Test Type                    | Expected Result                                        |
| ------------ | ------------------- | -------------------------------------------------------- | -------- | ---------------------------- | ------------------------------------------------------ |
| TC-HIST-001  | Transaction History | User views transaction history after successful transfer | P0       | Functional / Data Validation | Completed transfer is displayed in transaction history |
| TC-HIST-002  | Transaction History | Transaction history amount matches transfer amount       | P0       | Data Validation              | Transaction amount is displayed correctly              |
| TC-HIST-003  | Transaction History | Transaction status is displayed correctly                | P0       | Data Validation              | Completed or failed status is displayed correctly      |
| TC-HIST-004  | Transaction History | Failed transfer is not shown as completed                | P0       | Business Logic               | Failed transfer is not marked as completed             |
| TC-HIST-005  | Transaction History | Latest transaction appears at the top                    | P1       | Functional                   | Most recent transaction is displayed first             |
| TC-HIST-006  | Transaction History | Transaction date and time are displayed                  | P2       | UI                           | Transaction timestamp is visible and understandable    |

---

## 6.7 API Test Scenarios

| Test Case ID | API                       | Scenario                                            | Priority | Test Type             | Expected Result                                               |
| ------------ | ------------------------- | --------------------------------------------------- | -------- | --------------------- | ------------------------------------------------------------- |
| TC-API-001   | GET /accounts/{accountId} | Request account information with valid account ID   | P1       | API                   | API returns account information with 200 status               |
| TC-API-002   | GET /accounts/{accountId} | Request account information with invalid account ID | P1       | API / Negative        | API returns proper error response                             |
| TC-API-003   | POST /transfers           | Submit valid transfer request                       | P0       | API / Business Logic  | API returns success response and completed transaction status |
| TC-API-004   | POST /transfers           | Submit transfer request exceeding balance           | P0       | API / Business Logic  | API returns business validation error                         |
| TC-API-005   | POST /transfers           | Submit duplicate transfer request                   | P0       | API / Business Logic  | API prevents duplicate transaction processing                 |
| TC-API-006   | GET /transactions         | Request transaction history                         | P1       | API                   | API returns transaction list                                  |
| TC-API-007   | GET /transactions         | Verify latest transaction exists after transfer     | P0       | API / Data Validation | API response includes the latest completed transaction        |

---

## 6.8 SQL Validation Scenarios

| Test Case ID | Validation Area    | Scenario                                                   | Priority | Test Type             | Expected Result                               |
| ------------ | ------------------ | ---------------------------------------------------------- | -------- | --------------------- | --------------------------------------------- |
| TC-SQL-001   | Account Balance    | Verify sender balance after successful transfer            | P0       | SQL / Data Validation | Sender balance is decreased correctly         |
| TC-SQL-002   | Account Balance    | Verify receiver balance after successful transfer          | P0       | SQL / Data Validation | Receiver balance is increased correctly       |
| TC-SQL-003   | Failed Transfer    | Verify balance after failed transfer                       | P0       | SQL / Data Validation | Balance remains unchanged                     |
| TC-SQL-004   | Transaction Record | Verify transaction record after successful transfer        | P0       | SQL / Data Validation | Completed transaction record exists           |
| TC-SQL-005   | Transaction Record | Verify failed transfer is not saved as completed           | P0       | SQL / Business Logic  | Failed transaction is not marked as completed |
| TC-SQL-006   | Duplicate Transfer | Verify duplicate request does not create duplicate records | P0       | SQL / Business Logic  | Only one transaction record exists            |

---

## 7. E2E Automation Candidates

Not all test cases need to be automated.

Automation candidates are selected based on business importance, regression frequency, and stability of the test flow.

| Test Case ID | Scenario                                | Automation Priority | Reason                                         |
| ------------ | --------------------------------------- | ------------------- | ---------------------------------------------- |
| TC-LOGIN-001 | Valid user login                        | Medium              | Common entry flow                              |
| TC-TRF-001   | Successful transfer                     | High                | Core financial flow                            |
| TC-TRF-006   | Transfer exceeding balance              | High                | Critical negative case                         |
| TC-TRF-007   | Balance unchanged after failed transfer | High                | Important data consistency check               |
| TC-HIST-001  | Transaction history after transfer      | High                | Confirms transaction result                    |
| TC-DUP-001   | Multiple submit clicks                  | Medium              | Important but may require stable mock behavior |

---

## 8. Manual Test Candidates

Some scenarios are better suited for manual testing, especially when they involve usability, exploratory testing, or unclear requirements.

| Test Case ID | Scenario                      | Reason for Manual Testing |
| ------------ | ----------------------------- | ------------------------- |
| TC-LOGIN-003 | Empty field validation        | Simple UI validation      |
| TC-ACC-003   | KRW display format            | Visual confirmation       |
| TC-TRF-005   | Transfer confirmation screen  | UI text and layout check  |
| TC-HIST-006  | Transaction timestamp display | Visual and format check   |

---

## 9. Traceability Matrix

This matrix connects major risks from the test plan to related test cases.

| Risk ID | Risk Description                                       | Related Test Cases                               |
| ------- | ------------------------------------------------------ | ------------------------------------------------ |
| R-001   | Balance is not updated correctly after transfer        | TC-TRF-002, TC-TRF-003, TC-SQL-001, TC-SQL-002   |
| R-002   | Transfer succeeds despite insufficient balance         | TC-TRF-006, TC-TRF-007, TC-API-004               |
| R-003   | Same transfer is processed multiple times              | TC-DUP-001, TC-DUP-002, TC-DUP-003, TC-DUP-004   |
| R-004   | Completed transfer is missing from transaction history | TC-TRF-004, TC-HIST-001, TC-API-007              |
| R-005   | Failed transfer is recorded as completed               | TC-TRF-008, TC-HIST-004, TC-SQL-005              |
| R-006   | Error message is unclear or inconsistent               | TC-LOGIN-002, TC-TRF-009, TC-TRF-010, TC-TRF-013 |
| R-007   | API response body has missing fields                   | TC-API-001, TC-API-003, TC-API-006               |
| R-008   | UI and API data are inconsistent                       | TC-ACC-002, TC-HIST-002, TC-API-007              |
| R-009   | Suspended account can use restricted features          | TC-LOGIN-004, TC-ACC-004, TC-TRF-012             |

---

## 10. Sample Detailed Test Case

## TC-TRF-006: User attempts to transfer more than available balance

| Item         | Description                                     |
| ------------ | ----------------------------------------------- |
| Test Case ID | TC-TRF-006                                      |
| Feature      | Money Transfer                                  |
| Priority     | P0                                              |
| Test Type    | Negative / Business Logic                       |
| Related Risk | R-002                                           |
| Precondition | User is logged in with an active account        |
| Test Data    | user_low_balance / ACC-002 / Balance: 1,000 KRW |

### Steps

1. Log in as `user_low_balance`.
2. Go to the transfer page.
3. Enter receiver account `ACC-004`.
4. Enter transfer amount `10,000 KRW`.
5. Click the transfer submit button.

### Expected Result

* Transfer request is rejected.
* Error message is displayed.
* Sender balance remains `1,000 KRW`.
* Receiver balance remains unchanged.
* Transaction is not recorded as completed.

### Validation Points

* UI shows insufficient balance message.
* API returns business validation error.
* DB balance remains unchanged.
* Transaction status is not `COMPLETED`.

---

## 11. Summary

This document defines functional, negative, business logic, API, and SQL validation scenarios for the mock fintech service.

The main focus is to show how QA can identify high-risk financial service flows and convert them into structured test scenarios.

The scenarios are designed to support both manual testing and automation testing.
