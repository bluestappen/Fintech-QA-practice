# Mock Fintech Service Requirements

## 1. Purpose

This document defines the mock service requirements for the Fintech QA Practice Portfolio.

The purpose of this document is to provide a simple requirement baseline for test planning, test scenario design, business logic QA, API testing, SQL validation, and automation practice.

This is not a real company project.
All requirements, service flows, data, and business rules are fictional and created only for personal QA practice.

---

## 2. Service Overview

The mock fintech service is a simplified banking service that allows users to:

* Log in
* View account balance
* Transfer money to another account
* View transaction history
* Receive error messages for invalid transfer attempts

The service is intentionally simplified to focus on QA thinking rather than full product implementation.

---

## 3. User Roles

| Role             | Description                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| Standard User    | A normal user with an active account                                               |
| Low Balance User | A user with an active account but insufficient balance for some transfer scenarios |
| Suspended User   | A user whose account is restricted                                                 |
| Receiver User    | A user who can receive money from another account                                  |

---

## 4. Mock Test Accounts

| User ID          | Account ID | Account Status | Initial Balance | Description                             |
| ---------------- | ---------- | -------------- | --------------: | --------------------------------------- |
| user_standard    | ACC-001    | ACTIVE         |     100,000 KRW | Normal sender account                   |
| user_low_balance | ACC-002    | ACTIVE         |       1,000 KRW | Used for insufficient balance scenarios |
| user_suspended   | ACC-003    | SUSPENDED      |     100,000 KRW | Used for account restriction scenarios  |
| user_receiver    | ACC-004    | ACTIVE         |      50,000 KRW | Receiver account                        |

---

## 5. Functional Requirements

## FR-001: User Login

### Requirement

A registered user should be able to log in with valid credentials.

### Acceptance Criteria

* Given the user enters valid credentials
* When the user clicks the login button
* Then the user should be redirected to the account dashboard

### Negative Cases

* Invalid password
* Empty user ID
* Empty password
* Suspended user login attempt

### Related Test Cases

* TC-LOGIN-001
* TC-LOGIN-002
* TC-LOGIN-003
* TC-LOGIN-004

---

## FR-002: Account Balance Inquiry

### Requirement

A logged-in user should be able to view the current account balance.

### Acceptance Criteria

* Given the user is logged in
* When the user opens the account dashboard
* Then the current balance should be displayed
* And the UI balance should match the backend account data

### Related Test Cases

* TC-ACC-001
* TC-ACC-002
* TC-ACC-003
* TC-ACC-004

---

## FR-003: Successful Money Transfer

### Requirement

A user with an active account and sufficient balance should be able to transfer money to a valid receiver account.

### Acceptance Criteria

* Given the sender account is active
* And the receiver account is valid
* And the sender has enough balance
* When the user submits the transfer request
* Then the transfer should be completed successfully
* And the sender balance should decrease by the transfer amount
* And the receiver balance should increase by the transfer amount
* And the completed transaction should be recorded in transaction history

### Related Test Cases

* TC-TRF-001
* TC-TRF-002
* TC-TRF-003
* TC-TRF-004
* TC-HIST-001
* TC-SQL-001
* TC-SQL-002
* TC-SQL-004

---

## FR-004: Insufficient Balance Transfer Handling

### Requirement

A user should not be able to transfer more money than the available account balance.

### Acceptance Criteria

* Given the sender balance is lower than the transfer amount
* When the user submits the transfer request
* Then the transfer should be rejected
* And an insufficient balance error message should be displayed
* And the sender balance should remain unchanged
* And the receiver balance should remain unchanged
* And the transaction should not be recorded as completed

### Related Test Cases

* TC-TRF-006
* TC-TRF-007
* TC-TRF-008
* TC-API-004
* TC-SQL-003
* TC-SQL-005

---

## FR-005: Invalid Transfer Amount Handling

### Requirement

The transfer amount must be greater than zero.

### Acceptance Criteria

* Given the user enters `0 KRW`, a negative amount, an empty amount, or a non-numeric amount
* When the user submits the transfer request
* Then the transfer should be rejected
* And a validation message should be displayed
* And no balance change should occur
* And no completed transaction should be created

### Related Test Cases

* TC-TRF-009
* TC-TRF-010

---

## FR-006: Invalid Receiver Account Handling

### Requirement

A transfer should not be completed if the receiver account is invalid.

### Acceptance Criteria

* Given the receiver account does not exist or is invalid
* When the user submits the transfer request
* Then the transfer should be rejected
* And a clear error message should be displayed
* And the sender balance should remain unchanged
* And no completed transaction should be created

### Related Test Cases

* TC-TRF-013
* BUG-005

---

## FR-007: Suspended Account Restriction

### Requirement

A suspended account should not be allowed to transfer money.

### Acceptance Criteria

* Given the sender account status is `SUSPENDED`
* When the user attempts to transfer money
* Then the transfer should be blocked
* And no balance change should occur
* And no completed transaction should be created

### Related Test Cases

* TC-LOGIN-004
* TC-ACC-004
* TC-TRF-012
* TC-SQL-007

---

## FR-008: Duplicate Transfer Prevention

### Requirement

The same transfer request should not be processed more than once.

### Acceptance Criteria

* Given the same transfer request is submitted multiple times
* When duplicate requests are received
* Then only one transfer should be processed
* And the sender balance should be deducted only once
* And the receiver balance should be increased only once
* And only one completed transaction record should exist

### Related Test Cases

* TC-DUP-001
* TC-DUP-002
* TC-DUP-003
* TC-DUP-004
* TC-SQL-006
* BUG-002

---

## FR-009: Transaction History Inquiry

### Requirement

A user should be able to view transaction history.

### Acceptance Criteria

* Given the user has completed transactions
* When the user opens transaction history
* Then the latest transactions should be displayed
* And transaction amount, status, receiver, and timestamp should be visible
* And failed transactions should not be displayed as completed

### Related Test Cases

* TC-HIST-001
* TC-HIST-002
* TC-HIST-003
* TC-HIST-004
* TC-HIST-005
* TC-HIST-006

---

## 6. Business Rules

| Rule ID | Business Rule                                            | Priority |
| ------- | -------------------------------------------------------- | -------- |
| BR-001  | Transfer amount must not exceed available balance        | P0       |
| BR-002  | Sender balance must decrease after successful transfer   | P0       |
| BR-003  | Receiver balance must increase after successful transfer | P0       |
| BR-004  | Failed transfer must not change account balance          | P0       |
| BR-005  | Failed transfer must not be recorded as completed        | P0       |
| BR-006  | Duplicate transfer request must not be processed twice   | P0       |
| BR-007  | Suspended account must not be allowed to transfer money  | P0       |
| BR-008  | Transaction history must match actual transaction result | P0       |
| BR-009  | Transfer amount must be greater than zero                | P1       |
| BR-010  | Invalid receiver account must be rejected                | P1       |

---

## 7. API Assumptions

This mock service assumes the following simplified API endpoints.

| Method | Endpoint                              | Purpose                     |
| ------ | ------------------------------------- | --------------------------- |
| POST   | `/login`                              | User login                  |
| GET    | `/accounts/{accountId}`               | Account balance inquiry     |
| POST   | `/transfers`                          | Money transfer request      |
| GET    | `/transactions?accountId={accountId}` | Transaction history inquiry |

---

## 8. Example API Behavior

## POST /transfers

### Successful Transfer Request

```json
{
  "requestId": "REQ-TRANSFER-001",
  "senderAccountId": "ACC-001",
  "receiverAccountId": "ACC-004",
  "amount": 30000
}
```

### Expected Response

```json
{
  "transactionId": "TX-001",
  "status": "COMPLETED",
  "senderAccountId": "ACC-001",
  "receiverAccountId": "ACC-004",
  "amount": 30000
}
```

---

## Insufficient Balance Response

```json
{
  "status": "FAILED",
  "errorCode": "INSUFFICIENT_BALANCE",
  "message": "Transfer amount exceeds available balance."
}
```

---

## Duplicate Request Response

```json
{
  "status": "REJECTED",
  "errorCode": "DUPLICATE_REQUEST",
  "message": "Duplicate transfer request was detected."
}
```

---

## 9. Data Consistency Requirements

The service should maintain consistency across UI, API, and database.

| Area                | Requirement                                              |
| ------------------- | -------------------------------------------------------- |
| Account Balance     | UI, API, and DB should show the same balance             |
| Successful Transfer | Sender and receiver balances should be updated correctly |
| Failed Transfer     | Balance should remain unchanged                          |
| Transaction History | Transaction status should match actual transfer result   |
| Duplicate Request   | Only one completed transaction should exist              |
| Suspended Account   | No completed transfer should be created                  |

---

## 10. Non-Functional Requirements

This project focuses mainly on functional and business logic QA.

However, the following basic non-functional points are considered at a practice level.

| Area                 | Requirement                                                 |
| -------------------- | ----------------------------------------------------------- |
| Reliability          | Core transfer flow should behave consistently               |
| Usability            | Error messages should be clear and understandable           |
| Maintainability      | Test cases should be readable and easy to update            |
| Traceability         | Requirements should be linked to test cases and bug reports |
| Automation Readiness | Stable regression scenarios should be automated             |

---

## 11. Out of Scope

The following areas are not covered in this mock service.

* Real banking integration
* Real user authentication
* Real customer data
* Real payment network
* Security penetration testing
* Performance testing at scale
* Mobile app testing
* Complex financial product calculation
* Real compliance validation
* Production monitoring

These areas are excluded because this project is a personal QA practice portfolio.

---

## 12. Requirement Traceability Summary

| Requirement ID | Requirement                            | Related Document                                               |
| -------------- | -------------------------------------- | -------------------------------------------------------------- |
| FR-001         | User Login                             | `docs/02-test-scenarios.md`                                    |
| FR-002         | Account Balance Inquiry                | `docs/02-test-scenarios.md`, `docs/05-sql-validation.md`       |
| FR-003         | Successful Money Transfer              | `docs/02-test-scenarios.md`, `docs/03-business-logic-qa.md`    |
| FR-004         | Insufficient Balance Transfer Handling | `docs/03-business-logic-qa.md`, `docs/04-bug-reports.md`       |
| FR-005         | Invalid Transfer Amount Handling       | `docs/02-test-scenarios.md`                                    |
| FR-006         | Invalid Receiver Account Handling      | `docs/04-bug-reports.md`                                       |
| FR-007         | Suspended Account Restriction          | `docs/03-business-logic-qa.md`                                 |
| FR-008         | Duplicate Transfer Prevention          | `docs/03-business-logic-qa.md`, `docs/04-bug-reports.md`       |
| FR-009         | Transaction History Inquiry            | `docs/02-test-scenarios.md`, `docs/06-release-test-summary.md` |

---

## 13. Summary

This requirement document defines the baseline behavior of the mock fintech service.

The requirements are intentionally simple, but they are structured to support QA activities such as:

* Test planning
* Test scenario design
* Business logic validation
* Bug report writing
* SQL validation
* API testing
* E2E automation

This document helps connect service requirements to QA deliverables in a traceable way.
