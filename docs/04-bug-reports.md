# Bug Reports

## 1. Purpose

This document provides sample bug reports for the mock financial service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can report defects clearly, reproducibly, and with proper business impact analysis.

This is not a real company project.
All bug reports, scenarios, test data, and evidence paths are fictional and created only for personal QA practice.

---

## 2. Bug Report Format

Each bug report follows a Jira-style structure.

A good bug report should make it easy for developers, product managers, and QA members to understand:

* What happened
* Where it happened
* How to reproduce it
* What the expected behavior is
* What the actual behavior is
* Why the issue matters
* What evidence is available
* Which test case or business rule is related

---

## 3. Severity and Priority

Severity and priority are separated in this project.

### Severity

Severity describes the actual impact of the defect.

| Severity | Meaning                                                                     | Example                                                |
| -------- | --------------------------------------------------------------------------- | ------------------------------------------------------ |
| Critical | Causes financial data inconsistency or blocks a core financial service flow | Buy order succeeds despite insufficient available cash |
| Major    | Affects an important feature but may have a workaround                      | UI balance does not match API response                 |
| Minor    | Affects usability but does not block the main flow                          | Error message is unclear                               |
| Trivial  | Cosmetic issue with very low impact                                         | Minor layout spacing issue                             |

### Priority

Priority describes how urgently the issue should be fixed.

| Priority | Meaning                      | Example                                      |
| -------- | ---------------------------- | -------------------------------------------- |
| P0       | Must be fixed before release | Incorrect balance, holdings, or order status |
| P1       | Should be fixed soon         | Missing important validation message         |
| P2       | Can be fixed later           | Minor UI inconsistency                       |
| P3       | Optional improvement         | Text refinement                              |

---

## 4. Bug Summary

| Bug ID  | Title                                                                | Severity | Priority | Related Test Case | Related Rule | Status |
| ------- | -------------------------------------------------------------------- | -------- | -------- | ----------------- | ------------ | ------ |
| BUG-001 | Transfer is completed even when amount exceeds available balance     | Critical | P0       | TC-TRF-006        | BL-001       | Open   |
| BUG-002 | Sender balance is deducted twice after duplicate transfer request    | Critical | P0       | TC-DUP-001        | BL-006       | Open   |
| BUG-003 | Failed transfer is shown as completed in transaction history         | Critical | P0       | TC-HIST-004       | BL-005       | Open   |
| BUG-004 | Account balance on UI does not match API response                    | Major    | P1       | TC-ACC-002        | BL-008       | Open   |
| BUG-005 | Error message is unclear when receiver account is invalid            | Minor    | P2       | TC-TRF-013        | BL-010       | Open   |
| BUG-006 | Buy order is completed even when order amount exceeds available cash | Critical | P0       | TC-ORD-005        | BL-011       | Open   |
| BUG-007 | Completed buy order is not reflected in holdings                     | Critical | P0       | TC-ORD-004        | BL-013       | Open   |

---

# BUG-001: Transfer is completed even when amount exceeds available balance

## Basic Information

| Item                  | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| Bug ID                | BUG-001                                                          |
| Title                 | Transfer is completed even when amount exceeds available balance |
| Severity              | Critical                                                         |
| Priority              | P0                                                               |
| Status                | Open                                                             |
| Feature               | Money Transfer                                                   |
| Related Test Case     | TC-TRF-006                                                       |
| Related Business Rule | BL-001                                                           |
| Environment           | Mock Financial QA Environment                                    |
| Browser               | Chromium                                                         |
| Test Type             | Negative / Business Logic                                        |

## Description

The transfer is completed successfully even when the transfer amount exceeds the sender's available balance.

This violates the business rule that a user should not be able to transfer more money than the available account balance.

## Preconditions

* User account is active
* Sender account balance is `1,000 KRW`
* Receiver account exists and is active

## Test Data

| Item             | Value            |
| ---------------- | ---------------- |
| User ID          | user_low_balance |
| Sender Account   | ACC-002          |
| Receiver Account | ACC-004          |
| Sender Balance   | 1,000 KRW        |
| Transfer Amount  | 10,000 KRW       |

## Steps to Reproduce

1. Log in as `user_low_balance`.
2. Go to the transfer page.
3. Enter receiver account `ACC-004`.
4. Enter transfer amount `10,000 KRW`.
5. Click the transfer submit button.
6. Check the transfer result screen.
7. Check account balance and transaction history.

## Expected Result

* Transfer request should be rejected.
* Insufficient balance error message should be displayed.
* Sender balance should remain `1,000 KRW`.
* Receiver balance should remain unchanged.
* Transaction should not be recorded as completed.

## Actual Result

* Transfer is completed successfully.
* Transaction history shows the transfer as completed.
* Sender balance is changed despite insufficient balance.

## Impact

This is a critical financial defect because the system allows a user to transfer more money than the available balance.

This can cause:

* Incorrect account balance
* Financial data inconsistency
* Loss of user trust
* Incorrect transaction history
* Serious business logic failure

## Evidence

| Evidence Type | Path                                                       |
| ------------- | ---------------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-001-transfer-exceeds-balance.png` |
| API Response  | `reports/api/BUG-001-transfer-response.json`               |
| SQL Result    | `reports/sql/BUG-001-balance-check.txt`                    |
| Test Result   | `reports/playwright/BUG-001-result.json`                   |

## Suggested Investigation Area

* Transfer amount validation logic
* Available balance check before transfer completion
* API response handling for insufficient balance
* Transaction status creation logic
* Balance update transaction control

---

# BUG-002: Sender balance is deducted twice after duplicate transfer request

## Basic Information

| Item                  | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| Bug ID                | BUG-002                                                           |
| Title                 | Sender balance is deducted twice after duplicate transfer request |
| Severity              | Critical                                                          |
| Priority              | P0                                                                |
| Status                | Open                                                              |
| Feature               | Money Transfer                                                    |
| Related Test Case     | TC-DUP-001                                                        |
| Related Business Rule | BL-006                                                            |
| Environment           | Mock Financial QA Environment                                     |
| Browser               | Chromium                                                          |
| Test Type             | Business Logic / Regression                                       |

## Description

When the transfer submit button is clicked multiple times quickly, the same transfer is processed more than once.

As a result, the sender balance is deducted multiple times.

## Preconditions

* User account is active
* Sender account has enough balance
* Receiver account exists and is active

## Test Data

| Item                    | Value         |
| ----------------------- | ------------- |
| User ID                 | user_standard |
| Sender Account          | ACC-001       |
| Receiver Account        | ACC-004       |
| Initial Sender Balance  | 100,000 KRW   |
| Transfer Amount         | 10,000 KRW    |
| Expected Sender Balance | 90,000 KRW    |

## Steps to Reproduce

1. Log in as `user_standard`.
2. Go to the transfer page.
3. Enter receiver account `ACC-004`.
4. Enter transfer amount `10,000 KRW`.
5. Click the transfer submit button multiple times quickly.
6. Check the transfer result.
7. Check sender balance.
8. Check transaction history.

## Expected Result

* Only one transfer request should be processed.
* Sender balance should be deducted only once.
* Sender balance should become `90,000 KRW`.
* Only one completed transaction should be created.
* Duplicate requests should be rejected or ignored.

## Actual Result

* Transfer is processed twice.
* Sender balance becomes `80,000 KRW`.
* Two completed transaction records are created.

## Impact

This is a critical financial defect because duplicate transfer processing can cause duplicate withdrawal from the sender account.

This can cause:

* Duplicate transaction
* Incorrect account balance
* Financial loss
* User trust issue
* Serious regression risk in the transfer flow

## Evidence

| Evidence Type | Path                                                  |
| ------------- | ----------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-002-duplicate-transfer.png`  |
| API Response  | `reports/api/BUG-002-duplicate-response.json`         |
| SQL Result    | `reports/sql/BUG-002-duplicate-transaction-check.txt` |
| Test Result   | `reports/playwright/BUG-002-result.json`              |

## Suggested Investigation Area

* Submit button disable handling
* API idempotency logic
* Duplicate request ID validation
* Transaction creation logic
* Balance update transaction locking

---

# BUG-003: Failed transfer is shown as completed in transaction history

## Basic Information

| Item                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| Bug ID                | BUG-003                                                      |
| Title                 | Failed transfer is shown as completed in transaction history |
| Severity              | Critical                                                     |
| Priority              | P0                                                           |
| Status                | Open                                                         |
| Feature               | Transaction History                                          |
| Related Test Case     | TC-HIST-004                                                  |
| Related Business Rule | BL-005                                                       |
| Environment           | Mock Financial QA Environment                                |
| Browser               | Chromium                                                     |
| Test Type             | Business Logic / Data Validation                             |

## Description

A failed transfer is displayed as a completed transaction in the transaction history.

The transfer itself fails due to insufficient balance, but the transaction history shows the transaction status as `COMPLETED`.

## Preconditions

* User account is active
* Sender account balance is lower than transfer amount
* Receiver account exists and is active

## Test Data

| Item             | Value            |
| ---------------- | ---------------- |
| User ID          | user_low_balance |
| Sender Account   | ACC-002          |
| Receiver Account | ACC-004          |
| Sender Balance   | 1,000 KRW        |
| Transfer Amount  | 10,000 KRW       |

## Steps to Reproduce

1. Log in as `user_low_balance`.
2. Go to the transfer page.
3. Enter receiver account `ACC-004`.
4. Enter transfer amount `10,000 KRW`.
5. Submit the transfer request.
6. Confirm that the transfer fails.
7. Go to transaction history.
8. Check the latest transaction status.

## Expected Result

* Transfer should fail due to insufficient balance.
* Transaction should not be displayed as completed.
* If failed transactions are displayed, the status should be `FAILED`.
* Balance should remain unchanged.

## Actual Result

* Transfer failure message is displayed.
* However, transaction history shows the transfer as `COMPLETED`.
* This creates inconsistency between transfer result and transaction history.

## Impact

This is a critical defect because transaction history is one of the most important records in a financial service.

Incorrect transaction status can cause:

* User confusion
* Loss of trust
* Incorrect audit trail
* Mismatch between actual balance and transaction history
* Difficulty in customer support investigation

## Evidence

| Evidence Type | Path                                                                |
| ------------- | ------------------------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-003-failed-transfer-completed-history.png` |
| API Response  | `reports/api/BUG-003-transaction-history-response.json`             |
| SQL Result    | `reports/sql/BUG-003-transaction-status-check.txt`                  |
| Test Result   | `reports/playwright/BUG-003-result.json`                            |

## Suggested Investigation Area

* Transfer failure handling
* Transaction status mapping
* Transaction history API response
* DB transaction status update
* UI status display logic

---

# BUG-004: Account balance on UI does not match API response

## Basic Information

| Item                  | Description                                       |
| --------------------- | ------------------------------------------------- |
| Bug ID                | BUG-004                                           |
| Title                 | Account balance on UI does not match API response |
| Severity              | Major                                             |
| Priority              | P1                                                |
| Status                | Open                                              |
| Feature               | Account Balance                                   |
| Related Test Case     | TC-ACC-002                                        |
| Related Business Rule | BL-008                                            |
| Environment           | Mock Financial QA Environment                     |
| Browser               | Chromium                                          |
| Test Type             | Data Validation                                   |

## Description

The account balance displayed on the UI is different from the balance returned by the account inquiry API.

## Preconditions

* User account is active
* User is logged in successfully
* Account inquiry API is available

## Test Data

| Item        | Value         |
| ----------- | ------------- |
| User ID     | user_standard |
| Account ID  | ACC-001       |
| UI Balance  | 100,000 KRW   |
| API Balance | 90,000 KRW    |

## Steps to Reproduce

1. Log in as `user_standard`.
2. Go to the account dashboard.
3. Check the account balance displayed on the UI.
4. Send `GET /accounts/ACC-001` API request.
5. Compare the UI balance with the API response balance.

## Expected Result

* UI balance should match the account API response.
* User should see the latest account balance.

## Actual Result

* UI shows `100,000 KRW`.
* API response returns `90,000 KRW`.
* UI and API data are inconsistent.

## Impact

This is a major defect because users may see incorrect account balance information.

Although the actual backend data may be correct, incorrect UI display can cause:

* User confusion
* Reduced trust in the service
* Incorrect transfer or order decision by user
* Customer support inquiries

## Evidence

| Evidence Type | Path                                                      |
| ------------- | --------------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-004-ui-api-balance-mismatch.png` |
| API Response  | `reports/api/BUG-004-account-response.json`               |
| Test Result   | `reports/playwright/BUG-004-result.json`                  |

## Suggested Investigation Area

* Account dashboard data refresh logic
* API response mapping
* Frontend state management
* Cache handling
* Balance display formatting

---

# BUG-005: Error message is unclear when receiver account is invalid

## Basic Information

| Item                  | Description                                               |
| --------------------- | --------------------------------------------------------- |
| Bug ID                | BUG-005                                                   |
| Title                 | Error message is unclear when receiver account is invalid |
| Severity              | Minor                                                     |
| Priority              | P2                                                        |
| Status                | Open                                                      |
| Feature               | Money Transfer                                            |
| Related Test Case     | TC-TRF-013                                                |
| Related Business Rule | BL-010                                                    |
| Environment           | Mock Financial QA Environment                             |
| Browser               | Chromium                                                  |
| Test Type             | Negative / UI                                             |

## Description

When a user enters an invalid receiver account, the system displays a generic error message.

The message does not clearly explain that the receiver account is invalid.

## Preconditions

* User account is active
* Sender account has enough balance
* Receiver account does not exist

## Test Data

| Item                     | Value         |
| ------------------------ | ------------- |
| User ID                  | user_standard |
| Sender Account           | ACC-001       |
| Invalid Receiver Account | ACC-999       |
| Transfer Amount          | 10,000 KRW    |

## Steps to Reproduce

1. Log in as `user_standard`.
2. Go to the transfer page.
3. Enter invalid receiver account `ACC-999`.
4. Enter transfer amount `10,000 KRW`.
5. Click the transfer submit button.
6. Check the error message.

## Expected Result

A clear error message should be displayed.

Example:

`Receiver account does not exist. Please check the account number and try again.`

## Actual Result

The following generic error message is displayed:

`Something went wrong.`

## Impact

This is a minor usability defect.

The transfer is correctly blocked, but the error message does not help the user understand what went wrong.

This can cause:

* User confusion
* Repeated failed attempts
* Increased customer support inquiries
* Poor user experience

## Evidence

| Evidence Type | Path                                                       |
| ------------- | ---------------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-005-invalid-receiver-message.png` |
| API Response  | `reports/api/BUG-005-invalid-receiver-response.json`       |

## Suggested Investigation Area

* Error code to message mapping
* Receiver account validation message
* Frontend error handling
* API error response consistency

---

# BUG-006: Buy order is completed even when order amount exceeds available cash

## Basic Information

| Item                  | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| Bug ID                | BUG-006                                                              |
| Title                 | Buy order is completed even when order amount exceeds available cash |
| Severity              | Critical                                                             |
| Priority              | P0                                                                   |
| Status                | Open                                                                 |
| Feature               | Investment Order                                                     |
| Related Test Case     | TC-ORD-005                                                           |
| Related Business Rule | BL-011                                                               |
| Environment           | Mock Financial QA Environment                                        |
| Browser               | Chromium                                                             |
| Test Type             | Negative / Business Logic                                            |

## Description

The buy order is completed successfully even when the total order amount exceeds the user's available cash.

This violates the business rule that a buy order amount must not exceed available cash.

## Preconditions

* User account is active
* User has insufficient available cash
* Mock stock exists
* Order side is `BUY`

## Test Data

| Item           | Value            |
| -------------- | ---------------- |
| User ID        | user_low_balance |
| Account ID     | ACC-002          |
| Stock ID       | MOCK-001         |
| Stock Price    | 70,000 KRW       |
| Quantity       | 1                |
| Available Cash | 1,000 KRW        |
| Order Amount   | 70,000 KRW       |

## Steps to Reproduce

1. Log in as `user_low_balance`.
2. Go to the investment order page.
3. Select stock `MOCK-001`.
4. Enter quantity `1`.
5. Confirm that the order amount is `70,000 KRW`.
6. Click the buy order submit button.
7. Check the order result.
8. Check available cash, holdings, and order history.

## Expected Result

* Buy order should be rejected due to insufficient buying power.
* Available cash should remain `1,000 KRW`.
* Holding quantity should remain unchanged.
* Order should not be recorded as `COMPLETED`.
* Error message should explain that the order amount exceeds available cash.

## Actual Result

* Buy order is completed successfully.
* Order history shows the order as `COMPLETED`.
* Available cash is changed despite insufficient buying power.

## Impact

This is a critical securities service defect because the system allows a user to place a buy order without sufficient available cash.

This can cause:

* Incorrect order execution
* Incorrect available cash
* Incorrect order history
* Financial data inconsistency
* Loss of user trust
* Serious release-blocking risk

## Evidence

| Evidence Type | Path                                                 |
| ------------- | ---------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-006-order-exceeds-cash.png` |
| API Response  | `reports/api/BUG-006-order-response.json`            |
| SQL Result    | `reports/sql/BUG-006-order-cash-check.txt`           |
| Test Result   | `reports/playwright/BUG-006-result.json`             |

## Suggested Investigation Area

* Available cash validation before order completion
* Order amount calculation logic
* Order status creation logic
* API response handling for insufficient buying power
* Cash update transaction control
* Order history status mapping

---

# BUG-007: Completed buy order is not reflected in holdings

## Basic Information

| Item                  | Description                                      |
| --------------------- | ------------------------------------------------ |
| Bug ID                | BUG-007                                          |
| Title                 | Completed buy order is not reflected in holdings |
| Severity              | Critical                                         |
| Priority              | P0                                               |
| Status                | Open                                             |
| Feature               | Holdings                                         |
| Related Test Case     | TC-ORD-004                                       |
| Related Business Rule | BL-013                                           |
| Environment           | Mock Financial QA Environment                    |
| Browser               | Chromium                                         |
| Test Type             | Business Logic / Data Validation                 |

## Description

A buy order is completed successfully, but the purchased stock is not reflected in the user's holdings.

The order history shows `COMPLETED`, but the holdings page still shows quantity `0`.

## Preconditions

* User account is active
* User has sufficient available cash
* Mock stock exists
* User has no initial holdings for the selected stock

## Test Data

| Item                      | Value         |
| ------------------------- | ------------- |
| User ID                   | user_standard |
| Account ID                | ACC-001       |
| Stock ID                  | MOCK-001      |
| Stock Price               | 70,000 KRW    |
| Initial Available Cash    | 100,000 KRW   |
| Initial Holding Quantity  | 0             |
| Buy Quantity              | 1             |
| Expected Holding Quantity | 1             |

## Steps to Reproduce

1. Log in as `user_standard`.
2. Go to the investment order page.
3. Select stock `MOCK-001`.
4. Enter quantity `1`.
5. Submit the buy order.
6. Confirm that the order result is `COMPLETED`.
7. Go to holdings.
8. Check the holding quantity for `MOCK-001`.

## Expected Result

* Buy order should be completed successfully.
* Available cash should decrease from `100,000 KRW` to `30,000 KRW`.
* Holding quantity for `MOCK-001` should increase from `0` to `1`.
* Holdings UI, holdings API, and DB should show the same quantity.

## Actual Result

* Buy order is completed successfully.
* Order history shows the order as `COMPLETED`.
* Holdings still show quantity `0`.
* Holdings data does not match the completed order result.

## Impact

This is a critical financial data consistency defect because the user's portfolio does not reflect a completed order.

This can cause:

* Incorrect portfolio data
* User trust issue
* Inconsistency between order history and holdings
* Incorrect investment decision by user
* Customer support investigation difficulty
* Release-blocking risk for investment order flow

## Evidence

| Evidence Type | Path                                                   |
| ------------- | ------------------------------------------------------ |
| Screenshot    | `reports/screenshots/BUG-007-holdings-not-updated.png` |
| API Response  | `reports/api/BUG-007-holdings-response.json`           |
| SQL Result    | `reports/sql/BUG-007-holdings-check.txt`               |
| Test Result   | `reports/playwright/BUG-007-result.json`               |

## Suggested Investigation Area

* Holdings update logic after completed order
* Order completion event handling
* Holdings API response mapping
* DB holdings table update
* UI holdings refresh logic
* Transaction boundary between order completion and holdings update

---

## 5. Bug Report Writing Notes

When writing bug reports, the following principles are used.

### 5.1 Make the title specific

Bad example:

`Order bug`

Good example:

`Buy order is completed even when order amount exceeds available cash`

A specific title helps developers understand the problem quickly.

---

### 5.2 Separate expected result and actual result

Expected result and actual result should be written separately to make the defect clear.

Bad example:

`Order does not work correctly.`

Good example:

Expected:

`Buy order should be rejected due to insufficient buying power.`

Actual:

`Buy order is completed and order history shows COMPLETED status.`

---

### 5.3 Explain business impact

In financial service QA, business impact is important.

For example, an incorrect holdings issue should not be reported only as a display bug.
It should explain the impact on portfolio accuracy, order history consistency, and user trust.

---

### 5.4 Include evidence

Useful evidence includes:

* Screenshot
* Video
* API response
* Request payload
* Response body
* SQL query result
* Log file
* Test report
* Environment information

---

### 5.5 Link related test cases and business rules

Each bug should be connected to a related test case or business rule when possible.

This helps maintain traceability between:

* Requirement
* Business rule
* Test case
* Bug report
* Regression test

---

## 6. Summary

This document provides sample Jira-style bug reports for the mock financial service.

The main focus is to show that QA can report defects in a clear, reproducible, and business-oriented way.

The bug examples cover both money movement scenarios and investment order scenarios.

In financial service QA, a good bug report should not only describe what failed, but also explain why the failure matters from the perspective of financial data consistency, user trust, and release risk.
