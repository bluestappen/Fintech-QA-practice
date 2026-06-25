# Bug Reports

## 1. Purpose

This document provides sample bug reports for the mock fintech service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can report defects clearly, reproducibly, and with proper business impact analysis.

This is not a real company project.
All bug reports, scenarios, data, and evidence paths are fictional and created only for personal QA practice.

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

| Severity | Meaning                                                           | Example                                        |
| -------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| Critical | Causes financial data inconsistency or blocks a core service flow | Transfer succeeds despite insufficient balance |
| Major    | Affects an important feature but may have a workaround            | Transaction history is not updated immediately |
| Minor    | Affects usability but does not block the main flow                | Error message is unclear                       |
| Trivial  | Cosmetic issue with very low impact                               | Minor layout spacing issue                     |

### Priority

Priority describes how urgently the issue should be fixed.

| Priority | Meaning                      | Example                              |
| -------- | ---------------------------- | ------------------------------------ |
| P0       | Must be fixed before release | Incorrect balance calculation        |
| P1       | Should be fixed soon         | Missing important validation message |
| P2       | Can be fixed later           | Minor UI inconsistency               |
| P3       | Optional improvement         | Text refinement                      |

---

## 4. Bug Summary

| Bug ID  | Title                                                             | Severity | Priority | Related Test Case | Status |
| ------- | ----------------------------------------------------------------- | -------- | -------- | ----------------- | ------ |
| BUG-001 | Transfer is completed even when amount exceeds available balance  | Critical | P0       | TC-TRF-006        | Open   |
| BUG-002 | Sender balance is deducted twice after duplicate transfer request | Critical | P0       | TC-DUP-001        | Open   |
| BUG-003 | Failed transfer is shown as completed in transaction history      | Critical | P0       | TC-HIST-004       | Open   |
| BUG-004 | Account balance on UI does not match API response                 | Major    | P1       | TC-ACC-002        | Open   |
| BUG-005 | Error message is unclear when receiver account is invalid         | Minor    | P2       | TC-TRF-013        | Open   |

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
| Environment           | Mock Fintech QA Environment                                      |
| Browser               | Chromium                                                         |
| Test Type             | Negative / Business Logic                                        |

---

## Description

The transfer is completed successfully even when the transfer amount exceeds the sender's available balance.

This violates the business rule that a user should not be able to transfer more money than the available account balance.

---

## Preconditions

* User account is active
* Sender account balance is `1,000 KRW`
* Receiver account exists and is active

---

## Test Data

| Item             | Value            |
| ---------------- | ---------------- |
| User ID          | user_low_balance |
| Sender Account   | ACC-002          |
| Receiver Account | ACC-004          |
| Sender Balance   | 1,000 KRW        |
| Transfer Amount  | 10,000 KRW       |

---

## Steps to Reproduce

1. Log in as `user_low_balance`.
2. Go to the transfer page.
3. Enter receiver account `ACC-004`.
4. Enter transfer amount `10,000 KRW`.
5. Click the transfer submit button.
6. Check the transfer result screen.
7. Check account balance and transaction history.

---

## Expected Result

* Transfer request should be rejected.
* Insufficient balance error message should be displayed.
* Sender balance should remain `1,000 KRW`.
* Receiver balance should remain unchanged.
* Transaction should not be recorded as completed.

---

## Actual Result

* Transfer is completed successfully.
* Transaction history shows the transfer as completed.
* Sender balance is changed despite insufficient balance.

---

## Impact

This is a critical financial defect because the system allows a user to transfer more money than the available balance.

This can cause:

* Incorrect account balance
* Financial data inconsistency
* Loss of user trust
* Incorrect transaction history
* Serious business logic failure

---

## Evidence

| Evidence Type | Path                                                       |
| ------------- | ---------------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-001-transfer-exceeds-balance.png` |
| API Response  | `reports/api/BUG-001-transfer-response.json`               |
| SQL Result    | `reports/sql/BUG-001-balance-check.txt`                    |
| Test Result   | `reports/allure-results/BUG-001-result.json`               |

---

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
| Environment           | Mock Fintech QA Environment                                       |
| Browser               | Chromium                                                          |
| Test Type             | Business Logic / Regression                                       |

---

## Description

When the transfer submit button is clicked multiple times quickly, the same transfer is processed more than once.

As a result, the sender balance is deducted multiple times.

---

## Preconditions

* User account is active
* Sender account has enough balance
* Receiver account exists and is active

---

## Test Data

| Item                    | Value         |
| ----------------------- | ------------- |
| User ID                 | user_standard |
| Sender Account          | ACC-001       |
| Receiver Account        | ACC-004       |
| Initial Sender Balance  | 100,000 KRW   |
| Transfer Amount         | 10,000 KRW    |
| Expected Sender Balance | 90,000 KRW    |

---

## Steps to Reproduce

1. Log in as `user_standard`.
2. Go to the transfer page.
3. Enter receiver account `ACC-004`.
4. Enter transfer amount `10,000 KRW`.
5. Click the transfer submit button multiple times quickly.
6. Check the transfer result.
7. Check sender balance.
8. Check transaction history.

---

## Expected Result

* Only one transfer request should be processed.
* Sender balance should be deducted only once.
* Sender balance should become `90,000 KRW`.
* Only one completed transaction should be created.
* Duplicate requests should be rejected or ignored.

---

## Actual Result

* Transfer is processed twice.
* Sender balance becomes `80,000 KRW`.
* Two completed transaction records are created.

---

## Impact

This is a critical financial defect because duplicate transfer processing can cause duplicate withdrawal from the sender account.

This can cause:

* Duplicate transaction
* Incorrect account balance
* Financial loss
* User trust issue
* Serious regression risk in the transfer flow

---

## Evidence

| Evidence Type | Path                                                  |
| ------------- | ----------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-002-duplicate-transfer.png`  |
| API Response  | `reports/api/BUG-002-duplicate-response.json`         |
| SQL Result    | `reports/sql/BUG-002-duplicate-transaction-check.txt` |
| Test Result   | `reports/allure-results/BUG-002-result.json`          |

---

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
| Environment           | Mock Fintech QA Environment                                  |
| Browser               | Chromium                                                     |
| Test Type             | Business Logic / Data Validation                             |

---

## Description

A failed transfer is displayed as a completed transaction in the transaction history.

The transfer itself fails due to insufficient balance, but the transaction history shows the transaction status as `COMPLETED`.

---

## Preconditions

* User account is active
* Sender account balance is lower than transfer amount
* Receiver account exists and is active

---

## Test Data

| Item             | Value            |
| ---------------- | ---------------- |
| User ID          | user_low_balance |
| Sender Account   | ACC-002          |
| Receiver Account | ACC-004          |
| Sender Balance   | 1,000 KRW        |
| Transfer Amount  | 10,000 KRW       |

---

## Steps to Reproduce

1. Log in as `user_low_balance`.
2. Go to the transfer page.
3. Enter receiver account `ACC-004`.
4. Enter transfer amount `10,000 KRW`.
5. Submit the transfer request.
6. Confirm that the transfer fails.
7. Go to transaction history.
8. Check the latest transaction status.

---

## Expected Result

* Transfer should fail due to insufficient balance.
* Transaction should not be displayed as completed.
* If failed transactions are displayed, the status should be `FAILED`.
* Balance should remain unchanged.

---

## Actual Result

* Transfer failure message is displayed.
* However, transaction history shows the transfer as `COMPLETED`.
* This creates inconsistency between transfer result and transaction history.

---

## Impact

This is a critical defect because transaction history is one of the most important records in a financial service.

Incorrect transaction status can cause:

* User confusion
* Loss of trust
* Incorrect audit trail
* Mismatch between actual balance and transaction history
* Difficulty in customer support investigation

---

## Evidence

| Evidence Type | Path                                                                |
| ------------- | ------------------------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-003-failed-transfer-completed-history.png` |
| API Response  | `reports/api/BUG-003-transaction-history-response.json`             |
| SQL Result    | `reports/sql/BUG-003-transaction-status-check.txt`                  |
| Test Result   | `reports/allure-results/BUG-003-result.json`                        |

---

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
| Environment           | Mock Fintech QA Environment                       |
| Browser               | Chromium                                          |
| Test Type             | Data Validation                                   |

---

## Description

The account balance displayed on the UI is different from the balance returned by the account inquiry API.

---

## Preconditions

* User account is active
* User is logged in successfully
* Account inquiry API is available

---

## Test Data

| Item        | Value         |
| ----------- | ------------- |
| User ID     | user_standard |
| Account ID  | ACC-001       |
| UI Balance  | 100,000 KRW   |
| API Balance | 90,000 KRW    |

---

## Steps to Reproduce

1. Log in as `user_standard`.
2. Go to the account dashboard.
3. Check the account balance displayed on the UI.
4. Send `GET /accounts/ACC-001` API request.
5. Compare the UI balance with the API response balance.

---

## Expected Result

* UI balance should match the account API response.
* User should see the latest account balance.

---

## Actual Result

* UI shows `100,000 KRW`.
* API response returns `90,000 KRW`.
* UI and API data are inconsistent.

---

## Impact

This is a major defect because users may see incorrect account balance information.

Although the actual backend data may be correct, incorrect UI display can cause:

* User confusion
* Reduced trust in the service
* Incorrect transfer decision by user
* Customer support inquiries

---

## Evidence

| Evidence Type | Path                                                      |
| ------------- | --------------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-004-ui-api-balance-mismatch.png` |
| API Response  | `reports/api/BUG-004-account-response.json`               |
| Test Result   | `reports/allure-results/BUG-004-result.json`              |

---

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
| Environment           | Mock Fintech QA Environment                               |
| Browser               | Chromium                                                  |
| Test Type             | Negative / UI                                             |

---

## Description

When a user enters an invalid receiver account, the system displays a generic error message.

The message does not clearly explain that the receiver account is invalid.

---

## Preconditions

* User account is active
* Sender account has enough balance
* Receiver account does not exist

---

## Test Data

| Item                     | Value         |
| ------------------------ | ------------- |
| User ID                  | user_standard |
| Sender Account           | ACC-001       |
| Invalid Receiver Account | ACC-999       |
| Transfer Amount          | 10,000 KRW    |

---

## Steps to Reproduce

1. Log in as `user_standard`.
2. Go to the transfer page.
3. Enter invalid receiver account `ACC-999`.
4. Enter transfer amount `10,000 KRW`.
5. Click the transfer submit button.
6. Check the error message.

---

## Expected Result

A clear error message should be displayed.

Example:

`Receiver account does not exist. Please check the account number and try again.`

---

## Actual Result

The following generic error message is displayed:

`Something went wrong.`

---

## Impact

This is a minor usability defect.

The transfer is correctly blocked, but the error message does not help the user understand what went wrong.

This can cause:

* User confusion
* Repeated failed attempts
* Increased customer support inquiries
* Poor user experience

---

## Evidence

| Evidence Type | Path                                                       |
| ------------- | ---------------------------------------------------------- |
| Screenshot    | `reports/screenshots/BUG-005-invalid-receiver-message.png` |
| API Response  | `reports/api/BUG-005-invalid-receiver-response.json`       |

---

## Suggested Investigation Area

* Error code to message mapping
* Receiver account validation message
* Frontend error handling
* API error response consistency

---

## 5. Bug Report Writing Notes

When writing bug reports, the following principles are used:

### 5.1 Make the title specific

Bad example:

`Transfer bug`

Good example:

`Transfer is completed even when amount exceeds available balance`

A specific title helps developers understand the problem quickly.

---

### 5.2 Separate expected result and actual result

Expected result and actual result should be written separately to make the defect clear.

Bad example:

`Transfer does not work correctly.`

Good example:

Expected:

`Transfer should be rejected due to insufficient balance.`

Actual:

`Transfer is completed successfully and transaction history shows completed status.`

---

### 5.3 Explain business impact

In fintech QA, business impact is important.

For example, an incorrect balance issue should not be reported only as a functional bug.
It should explain the impact on financial data consistency and user trust.

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

This document provides sample Jira-style bug reports for the mock fintech service.

The main focus is to show that QA can report defects in a clear, reproducible, and business-oriented way.

In financial service QA, a good bug report should not only describe what failed, but also explain why the failure matters.
