# Mock Financial Service Requirements

## 1. Purpose

This document defines the mock service requirements for the Fintech QA Practice Portfolio.

The purpose of this document is to provide a simple requirement baseline for test planning, test scenario design, business logic QA, bug reporting, SQL validation, API testing, and Playwright E2E automation practice.

This is not a real company project.
All requirements, service flows, data, and business rules are fictional and created only for personal QA practice.

This mock service is intentionally simplified.
The goal is not to build a production-level financial application, but to create enough service context to demonstrate QA thinking.

---

## 2. Service Overview

The mock service is a simplified financial service that includes two modules.

### Module 1: Account & Money Movement

This module focuses on basic financial data consistency.

Users can:

* Log in
* View account balance
* Transfer money to another account
* View transaction history
* Receive error messages for invalid transfer attempts

### Module 2: Investment Order Flow

This module focuses on simplified securities service QA scenarios.

Users can:

* View available cash for investment orders
* View mock stock information
* Place a buy order
* Handle insufficient buying power
* View order history
* View holdings after completed order
* Cancel a pending order
* Receive error messages for invalid order attempts

The investment order flow is included to better reflect securities service QA while keeping the project simple enough to explain clearly.

---

## 3. User Roles

| Role             | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| Standard User    | A normal user with an active account and available cash                |
| Low Balance User | A user with an active account but insufficient balance or buying power |
| Suspended User   | A user whose account is restricted                                     |
| Receiver User    | A user who can receive money from another account                      |

---

## 4. Mock Test Accounts

| User ID          | Account ID | Account Status | Initial Balance | Description                                                           |
| ---------------- | ---------- | -------------- | --------------: | --------------------------------------------------------------------- |
| user_standard    | ACC-001    | ACTIVE         |     100,000 KRW | Normal user for transfer and investment order scenarios               |
| user_low_balance | ACC-002    | ACTIVE         |       1,000 KRW | Used for insufficient balance and insufficient buying power scenarios |
| user_suspended   | ACC-003    | SUSPENDED      |     100,000 KRW | Used for account restriction scenarios                                |
| user_receiver    | ACC-004    | ACTIVE         |      50,000 KRW | Receiver account for money transfer scenarios                         |

---

## 5. Mock Investment Data

The mock investment module uses simplified fictional stock and order data.

### Mock Stocks

| Stock ID | Stock Name          | Current Price | Description                                         |
| -------- | ------------------- | ------------: | --------------------------------------------------- |
| MOCK-001 | Toss Mock Stock     |    70,000 KRW | Fictional stock used for buy order scenarios        |
| MOCK-002 | Fintech Growth Mock |    30,000 KRW | Fictional stock used for additional order scenarios |

### Mock Holdings

| User ID          | Account ID | Stock ID | Quantity |
| ---------------- | ---------- | -------- | -------: |
| user_standard    | ACC-001    | MOCK-001 |        0 |
| user_standard    | ACC-001    | MOCK-002 |        0 |
| user_low_balance | ACC-002    | MOCK-001 |        0 |

### Mock Buying Power

For this practice project, the account balance is also used as available cash for mock investment orders.

| Account ID | Available Cash |
| ---------- | -------------: |
| ACC-001    |    100,000 KRW |
| ACC-002    |      1,000 KRW |
| ACC-003    |    100,000 KRW |

---

## 6. Functional Requirements

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

## FR-010: Available Cash Inquiry

### Requirement

A logged-in user should be able to view available cash for investment orders.

### Acceptance Criteria

* Given the user is logged in
* When the user opens the investment order page
* Then available cash should be displayed
* And the available cash should match the backend account data

### Related Test Cases

* TC-ORD-001
* TC-ORD-002
* TC-ORD-004

---

## FR-011: Mock Stock Information Inquiry

### Requirement

A logged-in user should be able to view mock stock information before placing an order.

### Acceptance Criteria

* Given the user is logged in
* When the user opens the investment order page
* Then mock stock ID, stock name, and current price should be displayed

### Related Test Cases

* TC-ORD-001
* TC-ORD-004

---

## FR-012: Successful Buy Order

### Requirement

A user with sufficient available cash should be able to place a buy order for a mock stock.

### Acceptance Criteria

* Given the user has enough available cash
* And the mock stock exists
* When the user submits a buy order
* Then the order should be completed
* And available cash should decrease by the order amount
* And holding quantity should increase
* And the completed order should be recorded in order history

### Related Test Cases

* TC-ORD-001
* TC-ORD-002
* TC-ORD-003
* TC-ORD-008
* TC-SQL-011
* TC-SQL-012

---

## FR-013: Insufficient Buying Power Handling

### Requirement

A user should not be able to place a buy order when the order amount exceeds available cash.

### Acceptance Criteria

* Given the user does not have enough available cash
* When the user submits a buy order
* Then the order should be rejected
* And available cash should remain unchanged
* And holding quantity should remain unchanged
* And the order should not be recorded as completed

### Related Test Cases

* TC-ORD-004
* TC-ORD-005
* TC-ORD-006
* TC-SQL-013

---

## FR-014: Order History Inquiry

### Requirement

A user should be able to view investment order history.

### Acceptance Criteria

* Given the user has submitted orders
* When the user opens order history
* Then order status, stock ID, quantity, order amount, and timestamp should be displayed
* And failed or canceled orders should not be shown as completed

### Related Test Cases

* TC-ORD-007
* TC-ORD-008
* TC-ORD-009

---

## FR-015: Pending Order Cancellation

### Requirement

A user should be able to cancel a pending order.

### Acceptance Criteria

* Given the order status is `PENDING`
* When the user cancels the order
* Then the order status should become `CANCELED`
* And available cash should not be deducted
* And holding quantity should not be changed

### Related Test Cases

* TC-ORD-010
* TC-ORD-011

---

## FR-016: Duplicate Order Prevention

### Requirement

The same investment order request should not be processed more than once.

### Acceptance Criteria

* Given the same order request is submitted multiple times
* When duplicate requests are received
* Then only one order should be processed
* And available cash should be deducted only once
* And holding quantity should be increased only once
* And only one completed order record should exist

### Related Test Cases

* TC-ORD-012
* TC-ORD-013
* TC-SQL-014

---

## 7. Business Rules

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
| BR-011  | Buy order amount must not exceed available cash          | P0       |
| BR-012  | Completed buy order must decrease available cash         | P0       |
| BR-013  | Completed buy order must increase holding quantity       | P0       |
| BR-014  | Failed order must not change cash or holdings            | P0       |
| BR-015  | Canceled order must not be shown as completed            | P0       |
| BR-016  | Duplicate order request must not be processed twice      | P0       |

---

## 8. API Assumptions

This mock service assumes the following simplified API endpoints.

| Method | Endpoint                              | Purpose                        |
| ------ | ------------------------------------- | ------------------------------ |
| POST   | `/login`                              | User login                     |
| GET    | `/accounts/{accountId}`               | Account balance inquiry        |
| POST   | `/transfers`                          | Money transfer request         |
| GET    | `/transactions?accountId={accountId}` | Transaction history inquiry    |
| GET    | `/stocks/{stockId}`                   | Mock stock information inquiry |
| POST   | `/orders`                             | Investment buy order request   |
| GET    | `/orders?accountId={accountId}`       | Order history inquiry          |
| GET    | `/holdings?accountId={accountId}`     | Holdings inquiry               |
| POST   | `/orders/{orderId}/cancel`            | Pending order cancellation     |

---

## 9. Example API Behavior

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

### Insufficient Balance Response

```json
{
  "status": "FAILED",
  "errorCode": "INSUFFICIENT_BALANCE",
  "message": "Transfer amount exceeds available balance."
}
```

### Duplicate Transfer Response

```json
{
  "status": "REJECTED",
  "errorCode": "DUPLICATE_REQUEST",
  "message": "Duplicate transfer request was detected."
}
```

---

## POST /orders

### Successful Buy Order Request

```json
{
  "requestId": "REQ-ORDER-001",
  "accountId": "ACC-001",
  "stockId": "MOCK-001",
  "side": "BUY",
  "quantity": 1,
  "price": 70000
}
```

### Expected Response

```json
{
  "orderId": "ORD-001",
  "status": "COMPLETED",
  "accountId": "ACC-001",
  "stockId": "MOCK-001",
  "side": "BUY",
  "quantity": 1,
  "orderAmount": 70000
}
```

### Insufficient Buying Power Response

```json
{
  "status": "REJECTED",
  "errorCode": "INSUFFICIENT_BUYING_POWER",
  "message": "Order amount exceeds available cash."
}
```

### Duplicate Order Response

```json
{
  "status": "REJECTED",
  "errorCode": "DUPLICATE_ORDER_REQUEST",
  "message": "Duplicate order request was detected."
}
```

---

## 10. Data Consistency Requirements

The service should maintain consistency across UI, API, and database.

| Area                | Requirement                                              |
| ------------------- | -------------------------------------------------------- |
| Account Balance     | UI, API, and DB should show the same balance             |
| Successful Transfer | Sender and receiver balances should be updated correctly |
| Failed Transfer     | Balance should remain unchanged                          |
| Transaction History | Transaction status should match actual transfer result   |
| Duplicate Transfer  | Only one completed transaction should exist              |
| Suspended Account   | No completed transfer should be created                  |
| Buy Order           | Completed buy order should decrease available cash       |
| Holdings            | Completed buy order should increase holding quantity     |
| Failed Order        | Available cash and holdings should remain unchanged      |
| Order History       | Order status should match actual order result            |
| Duplicate Order     | Only one completed order should exist                    |
| Canceled Order      | Canceled order should not be shown as completed          |

---

## 11. Non-Functional Requirements

This project focuses mainly on functional and business logic QA.

However, the following basic non-functional points are considered at a practice level.

| Area                 | Requirement                                                       |
| -------------------- | ----------------------------------------------------------------- |
| Reliability          | Core transfer and order flows should behave consistently          |
| Usability            | Error messages should be clear and understandable                 |
| Maintainability      | Test cases should be readable and easy to update                  |
| Traceability         | Requirements should be linked to test cases and bug reports       |
| Automation Readiness | Stable regression scenarios should be automated                   |
| Cross-Platform       | Core flows should be testable in both desktop and mobile viewport |

---

## 12. Out of Scope

The following areas are not covered in this mock service.

* Real banking integration
* Real user authentication
* Real customer data
* Real payment network
* Real database connection
* Security penetration testing
* Performance testing at scale
* Mobile app testing
* Complex financial product calculation
* Real compliance validation
* Production monitoring
* Real stock market data integration
* Real securities order execution
* Real exchange connection
* Real-time market price streaming
* Investment recommendation logic
* Compliance-level securities trading validation

These areas are excluded because this project is a personal QA practice portfolio.

---

## 13. Requirement Traceability Summary

| Requirement ID | Requirement                            | Related Document                                                                         |
| -------------- | -------------------------------------- | ---------------------------------------------------------------------------------------- |
| FR-001         | User Login                             | `docs/02-test-scenarios.md`                                                              |
| FR-002         | Account Balance Inquiry                | `docs/02-test-scenarios.md`, `docs/05-sql-validation.md`                                 |
| FR-003         | Successful Money Transfer              | `docs/02-test-scenarios.md`, `docs/03-business-logic-qa.md`                              |
| FR-004         | Insufficient Balance Transfer Handling | `docs/03-business-logic-qa.md`, `docs/04-bug-reports.md`                                 |
| FR-005         | Invalid Transfer Amount Handling       | `docs/02-test-scenarios.md`                                                              |
| FR-006         | Invalid Receiver Account Handling      | `docs/04-bug-reports.md`                                                                 |
| FR-007         | Suspended Account Restriction          | `docs/03-business-logic-qa.md`                                                           |
| FR-008         | Duplicate Transfer Prevention          | `docs/03-business-logic-qa.md`, `docs/04-bug-reports.md`                                 |
| FR-009         | Transaction History Inquiry            | `docs/02-test-scenarios.md`, `docs/06-release-test-summary.md`                           |
| FR-010         | Available Cash Inquiry                 | `docs/02-test-scenarios.md`, `docs/05-sql-validation.md`                                 |
| FR-011         | Mock Stock Information Inquiry         | `docs/02-test-scenarios.md`                                                              |
| FR-012         | Successful Buy Order                   | `docs/02-test-scenarios.md`, `docs/03-business-logic-qa.md`, `docs/05-sql-validation.md` |
| FR-013         | Insufficient Buying Power Handling     | `docs/03-business-logic-qa.md`, `docs/04-bug-reports.md`                                 |
| FR-014         | Order History Inquiry                  | `docs/02-test-scenarios.md`, `docs/06-release-test-summary.md`                           |
| FR-015         | Pending Order Cancellation             | `docs/02-test-scenarios.md`, `docs/03-business-logic-qa.md`                              |
| FR-016         | Duplicate Order Prevention             | `docs/03-business-logic-qa.md`, `docs/04-bug-reports.md`                                 |

---

## 14. Summary

This requirement document defines the baseline behavior of the mock financial service.

The requirements are intentionally simple, but they are structured to support QA activities such as:

* Test planning
* Test scenario design
* Business logic validation
* Bug report writing
* SQL validation
* API testing
* E2E automation

This document helps connect service requirements to QA deliverables in a traceable way.

The project started with account and money movement scenarios, then expanded into investment order scenarios to better demonstrate QA thinking for securities service flows.

