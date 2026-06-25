# Business Logic QA

## 1. Purpose

This document defines business logic validation points for the mock fintech service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can identify, analyze, and validate business rules in a financial service scenario.

This is not a real company project.
All business rules, scenarios, and test data are fictional and created only for personal QA practice.

---

## 2. Why Business Logic QA Matters

In fintech services, business logic defects can directly affect financial data, user trust, and service reliability.

Unlike simple UI defects, business logic defects can cause serious issues such as:

* Incorrect account balance
* Unauthorized money transfer
* Duplicate transaction processing
* Failed transaction recorded as completed
* Transaction history mismatch
* Account status rule violation

Therefore, QA should validate not only whether the screen works, but also whether the underlying rules are correctly applied.

---

## 3. Business Logic Scope

The business logic QA scope in this project includes the following areas:

* Transfer amount validation
* Balance calculation
* Sender and receiver account update
* Failed transfer handling
* Duplicate transfer prevention
* Transaction history consistency
* Account status validation
* UI/API/DB consistency

---

## 4. Business Rule Summary

| Rule ID | Business Rule                                            | Risk Level | Related Test Cases                    |
| ------- | -------------------------------------------------------- | ---------- | ------------------------------------- |
| BL-001  | Transfer amount must not exceed available balance        | High       | TC-TRF-006, TC-TRF-007, TC-API-004    |
| BL-002  | Sender balance must decrease after successful transfer   | High       | TC-TRF-002, TC-SQL-001                |
| BL-003  | Receiver balance must increase after successful transfer | High       | TC-TRF-003, TC-SQL-002                |
| BL-004  | Failed transfer must not change account balance          | High       | TC-TRF-007, TC-SQL-003                |
| BL-005  | Failed transfer must not be recorded as completed        | High       | TC-TRF-008, TC-HIST-004, TC-SQL-005   |
| BL-006  | Duplicate transfer request must not be processed twice   | High       | TC-DUP-001, TC-DUP-002, TC-DUP-003    |
| BL-007  | Suspended account must not be allowed to transfer money  | High       | TC-TRF-012                            |
| BL-008  | Transaction history must match actual transaction result | High       | TC-HIST-001, TC-HIST-002, TC-HIST-003 |
| BL-009  | Transfer amount must be greater than zero                | Medium     | TC-TRF-009, TC-TRF-010                |
| BL-010  | Invalid receiver account must be rejected                | Medium     | TC-TRF-013                            |

---

## 5. Detailed Business Rules

## BL-001: Transfer amount must not exceed available balance

### Description

A user should not be able to transfer more money than the available balance in the sender account.

### Business Risk

If this rule fails, the system may allow users to transfer money they do not have.
This can cause incorrect balance data and serious financial inconsistency.

### Preconditions

* Sender account is active
* Sender account has available balance
* Receiver account exists and is active

### Example Test Data

| Item             | Value      |
| ---------------- | ---------- |
| Sender Account   | ACC-002    |
| Receiver Account | ACC-004    |
| Sender Balance   | 1,000 KRW  |
| Transfer Amount  | 10,000 KRW |

### Expected Behavior

* Transfer request is rejected
* Sender balance remains unchanged
* Receiver balance remains unchanged
* Transaction is not recorded as completed
* User sees an insufficient balance error message

### Validation Points

| Layer       | Validation                                    |
| ----------- | --------------------------------------------- |
| UI          | Error message is displayed                    |
| API         | Business validation error is returned         |
| DB          | Sender and receiver balances remain unchanged |
| Transaction | No completed transaction is created           |

---

## BL-002: Sender balance must decrease after successful transfer

### Description

When a transfer is completed successfully, the sender account balance must decrease by the exact transfer amount.

### Business Risk

If the sender balance is not updated correctly, the system may display incorrect financial data to the user.

### Example Test Data

| Item             | Value       |
| ---------------- | ----------- |
| Sender Account   | ACC-001     |
| Initial Balance  | 100,000 KRW |
| Transfer Amount  | 30,000 KRW  |
| Expected Balance | 70,000 KRW  |

### Expected Behavior

* Transfer is completed successfully
* Sender balance decreases from 100,000 KRW to 70,000 KRW
* Updated balance is reflected in UI, API, and DB

### Validation Points

| Layer       | Validation                                      |
| ----------- | ----------------------------------------------- |
| UI          | Account dashboard shows 70,000 KRW              |
| API         | Account API returns 70,000 KRW                  |
| DB          | Account balance column is updated to 70,000 KRW |
| Transaction | Completed transaction exists                    |

---

## BL-003: Receiver balance must increase after successful transfer

### Description

When a transfer is completed successfully, the receiver account balance must increase by the exact transfer amount.

### Business Risk

If the receiver balance is not updated correctly, money movement between accounts becomes inconsistent.

### Example Test Data

| Item             | Value      |
| ---------------- | ---------- |
| Receiver Account | ACC-004    |
| Initial Balance  | 50,000 KRW |
| Transfer Amount  | 30,000 KRW |
| Expected Balance | 80,000 KRW |

### Expected Behavior

* Receiver balance increases from 50,000 KRW to 80,000 KRW
* Receiver transaction history includes incoming transfer
* Sender and receiver balances are both updated consistently

### Validation Points

| Layer            | Validation                                   |
| ---------------- | -------------------------------------------- |
| API              | Receiver account API returns updated balance |
| DB               | Receiver balance is increased correctly      |
| Transaction      | Incoming transaction record exists           |
| Data Consistency | Sender decrease equals receiver increase     |

---

## BL-004: Failed transfer must not change account balance

### Description

If a transfer fails, neither sender nor receiver balance should be changed.

### Business Risk

If balance changes after a failed transfer, the system may create financial data inconsistency.

### Failure Examples

* Insufficient balance
* Invalid receiver account
* Suspended sender account
* Invalid transfer amount
* Duplicate request rejected

### Expected Behavior

* Transfer status is failed or rejected
* Sender balance remains unchanged
* Receiver balance remains unchanged
* No completed transaction is created

### Validation Points

| Layer       | Validation                            |
| ----------- | ------------------------------------- |
| UI          | Failure result is displayed           |
| API         | Failure response is returned          |
| DB          | Balance values remain unchanged       |
| Transaction | Transaction is not saved as completed |

---

## BL-005: Failed transfer must not be recorded as completed

### Description

A failed transfer should not appear as a completed transaction in transaction history.

### Business Risk

If a failed transaction is shown as completed, users may believe money has been transferred even though the transaction failed.

### Expected Behavior

* Failed transaction is either not shown in completed history or shown with failed status
* Transaction status must not be `COMPLETED`
* Balance must not be changed

### Validation Points

| Layer   | Validation                                                   |
| ------- | ------------------------------------------------------------ |
| UI      | Failed transaction is not displayed as completed             |
| API     | Transaction status is not `COMPLETED`                        |
| DB      | Transaction status is `FAILED` or no completed record exists |
| History | Completed transaction list excludes failed transfer          |

---

## BL-006: Duplicate transfer request must not be processed twice

### Description

If the same transfer request is submitted multiple times, the system should process it only once.

This can happen when:

* User clicks the submit button multiple times
* Network delay causes retry
* Same API request is sent again
* Browser refresh or back button resubmits the request

### Business Risk

If duplicate requests are not handled properly, the sender may be charged multiple times.

### Example Test Data

| Item             | Value            |
| ---------------- | ---------------- |
| Sender Account   | ACC-001          |
| Receiver Account | ACC-004          |
| Transfer Amount  | 10,000 KRW       |
| Request ID       | REQ-TRANSFER-001 |

### Expected Behavior

* Only one transfer is completed
* Sender balance is decreased only once
* Receiver balance is increased only once
* Only one completed transaction record is created
* Duplicate request is rejected or ignored

### Validation Points

| Layer   | Validation                                  |
| ------- | ------------------------------------------- |
| UI      | Submit button is disabled after first click |
| API     | Duplicate request ID is rejected or ignored |
| DB      | Only one completed transaction exists       |
| Balance | Balance is updated only once                |

---

## BL-007: Suspended account must not be allowed to transfer money

### Description

A suspended account should not be allowed to perform money transfer.

### Business Risk

If restricted accounts can transfer money, the system may violate account control policies.

### Example Test Data

| Item            | Value          |
| --------------- | -------------- |
| User ID         | user_suspended |
| Account ID      | ACC-003        |
| Account Status  | Suspended      |
| Transfer Amount | 10,000 KRW     |

### Expected Behavior

* Transfer menu is restricted or transfer request is rejected
* Account status reason is displayed if applicable
* No balance change occurs
* No completed transaction is created

### Validation Points

| Layer       | Validation                                     |
| ----------- | ---------------------------------------------- |
| UI          | Transfer action is blocked or unavailable      |
| API         | Transfer API rejects suspended account request |
| DB          | No balance change                              |
| Transaction | No completed transaction exists                |

---

## BL-008: Transaction history must match actual transaction result

### Description

Transaction history should accurately reflect actual account activity.

### Business Risk

If transaction history does not match actual account changes, users cannot trust the service.

### Expected Behavior

After successful transfer:

* Transaction history contains the completed transfer
* Amount is correct
* Sender and receiver information is correct
* Transaction status is correct
* Transaction timestamp is displayed

After failed transfer:

* Failed transfer is not displayed as completed
* Balance remains unchanged
* Transaction status is not misleading

### Validation Points

| Layer       | Validation                                           |
| ----------- | ---------------------------------------------------- |
| UI          | Transaction history shows correct result             |
| API         | Transaction history API returns correct data         |
| DB          | Transaction table contains correct status and amount |
| Consistency | Transaction history matches account balance change   |

---

## BL-009: Transfer amount must be greater than zero

### Description

Transfer amount should be greater than zero.

Invalid transfer amounts should be rejected.

### Invalid Examples

* 0 KRW
* Negative amount
* Empty amount
* Non-numeric amount

### Business Risk

Invalid amount handling can cause unexpected behavior or incorrect transaction records.

### Expected Behavior

* Transfer request is rejected
* Validation message is displayed
* No balance change occurs
* No completed transaction is created

### Validation Points

| Layer   | Validation                            |
| ------- | ------------------------------------- |
| UI      | Input validation message is displayed |
| API     | Invalid amount request is rejected    |
| DB      | No completed transaction is created   |
| Balance | Balance remains unchanged             |

---

## BL-010: Invalid receiver account must be rejected

### Description

A transfer should not be completed if the receiver account does not exist or is invalid.

### Business Risk

If the system allows transfer to an invalid receiver, money movement cannot be properly tracked.

### Invalid Receiver Examples

* Non-existing account
* Closed account
* Suspended receiver account
* Incorrect account format

### Expected Behavior

* Transfer request is rejected
* Proper error message is displayed
* Sender balance remains unchanged
* No completed transaction is created

### Validation Points

| Layer       | Validation                            |
| ----------- | ------------------------------------- |
| UI          | Invalid receiver error is displayed   |
| API         | Receiver validation error is returned |
| DB          | Sender balance remains unchanged      |
| Transaction | No completed transaction exists       |

---

## 6. UI / API / DB Consistency

Business logic QA should not stop at UI validation.

A financial service flow should be checked from multiple layers:

| Layer       | Purpose                  | Example                                |
| ----------- | ------------------------ | -------------------------------------- |
| UI          | Check what the user sees | Balance shown on dashboard             |
| API         | Check backend response   | Account API returns updated balance    |
| DB          | Check stored data        | Account table balance is updated       |
| Transaction | Check audit result       | Transaction record status is completed |

### Example: Successful Transfer Consistency

| Validation Target    | Expected Result                             |
| -------------------- | ------------------------------------------- |
| UI balance           | Sender balance decreases by transfer amount |
| Account API          | Updated sender balance is returned          |
| Transaction API      | Completed transaction is returned           |
| DB account table     | Sender and receiver balances are updated    |
| DB transaction table | Completed transaction record exists         |

### Example: Failed Transfer Consistency

| Validation Target    | Expected Result                        |
| -------------------- | -------------------------------------- |
| UI message           | Error message is displayed             |
| Account API          | Balance remains unchanged              |
| Transaction API      | No completed transaction is returned   |
| DB account table     | Balance remains unchanged              |
| DB transaction table | No completed transaction record exists |

---

## 7. Business Logic Risk Matrix

| Risk ID | Business Risk                                  | Impact                          | Related Rule | Priority |
| ------- | ---------------------------------------------- | ------------------------------- | ------------ | -------- |
| BR-001  | Transfer succeeds despite insufficient balance | Financial data inconsistency    | BL-001       | P0       |
| BR-002  | Balance is deducted incorrectly                | Incorrect user balance          | BL-002       | P0       |
| BR-003  | Receiver balance is not updated                | Inconsistent money movement     | BL-003       | P0       |
| BR-004  | Failed transfer changes balance                | Financial data corruption       | BL-004       | P0       |
| BR-005  | Failed transfer shown as completed             | User trust issue                | BL-005       | P0       |
| BR-006  | Duplicate transfer is processed                | Duplicate withdrawal            | BL-006       | P0       |
| BR-007  | Suspended account can transfer                 | Policy violation                | BL-007       | P0       |
| BR-008  | Transaction history mismatch                   | User trust and audit issue      | BL-008       | P0       |
| BR-009  | Invalid amount is accepted                     | Unexpected transaction behavior | BL-009       | P1       |
| BR-010  | Invalid receiver is accepted                   | Invalid money movement          | BL-010       | P1       |

---

## 8. Automation Candidates for Business Logic QA

Some business logic scenarios are good candidates for automation because they are important for regression testing.

| Rule ID | Scenario                                    | Automation Priority | Reason                                              |
| ------- | ------------------------------------------- | ------------------- | --------------------------------------------------- |
| BL-001  | Transfer amount exceeds balance             | High                | Critical negative case                              |
| BL-002  | Sender balance decreases after transfer     | High                | Core financial logic                                |
| BL-004  | Failed transfer does not change balance     | High                | Prevents financial inconsistency                    |
| BL-005  | Failed transfer is not completed            | High                | Prevents misleading transaction history             |
| BL-006  | Duplicate transfer request prevention       | Medium              | Important but may require stable request ID control |
| BL-008  | Transaction history matches transfer result | High                | Important regression check                          |

---

## 9. Manual Review Points

Some business logic areas may require manual review or exploratory testing.

| Area                  | Manual Review Point                                            |
| --------------------- | -------------------------------------------------------------- |
| Error message         | Is the message understandable to users?                        |
| Transfer confirmation | Does the confirmation screen clearly show amount and receiver? |
| Account restriction   | Is the restricted account state clear to the user?             |
| Transaction history   | Is the transaction result easy to understand?                  |
| Edge case behavior    | Are unexpected inputs handled safely?                          |

---

## 10. Summary

This document defines business logic validation points for the mock fintech service.

The main QA focus is to ensure that money transfer rules, balance updates, transaction records, and account restrictions are handled correctly.

This document demonstrates that QA should validate service quality not only through UI behavior, but also through business rules, API responses, and backend data consistency.
