# Business Logic QA

## 1. Purpose

This document defines business logic validation points for the mock financial service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can identify, analyze, and validate business rules in financial service scenarios.

This is not a real company project.
All business rules, scenarios, and test data are fictional and created only for personal QA practice.

---

## 2. Why Business Logic QA Matters

In financial services, business logic defects can directly affect financial data, user trust, transaction accuracy, and release readiness.

Unlike simple UI defects, business logic defects can cause serious issues such as:

* Incorrect account balance
* Unauthorized money transfer
* Duplicate transaction processing
* Failed transaction recorded as completed
* Transaction history mismatch
* Buy order completed despite insufficient buying power
* Completed order not reflected in holdings
* Canceled order displayed as completed
* Duplicate order processing

Therefore, QA should validate not only whether the screen works, but also whether the underlying business rules are correctly applied.

---

## 3. Business Logic Scope

This project covers two simplified financial service modules.

### Module 1: Account & Money Movement

This module focuses on money transfer and account balance consistency.

Business logic QA scope includes:

* Transfer amount validation
* Balance calculation
* Sender and receiver account update
* Failed transfer handling
* Duplicate transfer prevention
* Transaction history consistency
* Account status validation
* UI/API/DB consistency

### Module 2: Investment Order Flow

This module focuses on simplified securities service QA scenarios.

Business logic QA scope includes:

* Available cash validation
* Mock stock order placement
* Buy order amount validation
* Holdings update after completed order
* Failed order handling
* Order history consistency
* Pending order cancellation
* Duplicate order prevention
* UI/API/DB consistency

---

## 4. Business Rule Summary

## 4.1 Account & Money Movement Rules

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

## 4.2 Investment Order Rules

| Rule ID | Business Rule                                       | Risk Level | Related Test Cases                             |
| ------- | --------------------------------------------------- | ---------- | ---------------------------------------------- |
| BL-011  | Buy order amount must not exceed available cash     | High       | TC-ORD-005, TC-ORD-006, TC-API-010             |
| BL-012  | Completed buy order must decrease available cash    | High       | TC-ORD-003, TC-SQL-010                         |
| BL-013  | Completed buy order must increase holding quantity  | High       | TC-ORD-004, TC-ORD-017, TC-SQL-011             |
| BL-014  | Failed order must not change cash or holdings       | High       | TC-ORD-006, TC-ORD-007, TC-SQL-012, TC-SQL-013 |
| BL-015  | Canceled order must not be shown as completed       | High       | TC-ORD-011, TC-ORD-012, TC-SQL-015             |
| BL-016  | Duplicate order request must not be processed twice | High       | TC-ORD-013, TC-ORD-014, TC-ORD-015, TC-SQL-014 |

---

# 5. Detailed Business Rules: Account & Money Movement

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
| Account Status  | SUSPENDED      |
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

# 6. Detailed Business Rules: Investment Order Flow

## BL-011: Buy order amount must not exceed available cash

### Description

A user should not be able to place a buy order when the total order amount exceeds available cash.

### Business Risk

If this rule fails, the system may allow users to place orders without sufficient buying power.

In a securities service, this can cause serious financial data inconsistency because the order result may not match the user's available cash.

### Preconditions

* User account is active
* Mock stock exists
* User has available cash
* Order side is `BUY`

### Example Test Data

| Item           | Value            |
| -------------- | ---------------- |
| User ID        | user_low_balance |
| Account ID     | ACC-002          |
| Stock ID       | MOCK-001         |
| Stock Price    | 70,000 KRW       |
| Quantity       | 1                |
| Available Cash | 1,000 KRW        |
| Order Amount   | 70,000 KRW       |

### Expected Behavior

* Buy order request is rejected
* Available cash remains unchanged
* Holding quantity remains unchanged
* Order is not recorded as completed
* User sees an insufficient buying power error message

### Validation Points

| Layer    | Validation                                           |
| -------- | ---------------------------------------------------- |
| UI       | Insufficient buying power error message is displayed |
| API      | Business validation error is returned                |
| DB       | Available cash remains unchanged                     |
| Holdings | Holding quantity remains unchanged                   |
| Order    | No completed order is created                        |

---

## BL-012: Completed buy order must decrease available cash

### Description

When a buy order is completed successfully, available cash must decrease by the exact order amount.

### Business Risk

If available cash is not updated correctly, the user may see incorrect buying power and may be allowed to place additional orders incorrectly.

### Example Test Data

| Item                    | Value       |
| ----------------------- | ----------- |
| Account ID              | ACC-001     |
| Initial Available Cash  | 100,000 KRW |
| Stock ID                | MOCK-001    |
| Stock Price             | 70,000 KRW  |
| Quantity                | 1           |
| Expected Available Cash | 30,000 KRW  |

### Expected Behavior

* Buy order is completed successfully
* Available cash decreases from 100,000 KRW to 30,000 KRW
* Updated available cash is reflected in UI, API, and DB
* Completed order record exists

### Validation Points

| Layer       | Validation                                     |
| ----------- | ---------------------------------------------- |
| UI          | Available cash shows 30,000 KRW                |
| API         | Account or buying power API returns 30,000 KRW |
| DB          | Available cash is updated to 30,000 KRW        |
| Order       | Completed order exists                         |
| Consistency | Cash decrease equals order amount              |

---

## BL-013: Completed buy order must increase holding quantity

### Description

When a buy order is completed successfully, the holding quantity for the ordered stock must increase by the ordered quantity.

### Business Risk

If holdings are not updated correctly after a completed order, the user's portfolio becomes inaccurate.

This can directly affect user trust because holdings are one of the most important results of an investment order.

### Example Test Data

| Item              | Value    |
| ----------------- | -------- |
| Account ID        | ACC-001  |
| Stock ID          | MOCK-001 |
| Initial Quantity  | 0        |
| Buy Quantity      | 1        |
| Expected Quantity | 1        |

### Expected Behavior

* Buy order is completed successfully
* Holding quantity for MOCK-001 increases from 0 to 1
* Holdings UI, holdings API, and DB show the same quantity
* Order history shows the completed buy order

### Validation Points

| Layer         | Validation                                       |
| ------------- | ------------------------------------------------ |
| UI            | Holdings page shows quantity 1                   |
| API           | Holdings API returns quantity 1                  |
| DB            | Holdings table shows quantity 1                  |
| Order History | Completed order is shown                         |
| Consistency   | Order quantity matches holding quantity increase |

---

## BL-014: Failed order must not change cash or holdings

### Description

If a buy order fails or is rejected, available cash and holdings should not be changed.

### Failure Examples

* Insufficient buying power
* Invalid stock ID
* Invalid quantity
* Suspended account
* Duplicate order rejected

### Business Risk

If failed orders change available cash or holdings, the system may create incorrect financial data and mislead users.

### Expected Behavior

* Order status is failed or rejected
* Available cash remains unchanged
* Holding quantity remains unchanged
* No completed order record is created

### Validation Points

| Layer    | Validation                         |
| -------- | ---------------------------------- |
| UI       | Failure result is displayed        |
| API      | Failure response is returned       |
| DB       | Available cash remains unchanged   |
| Holdings | Holding quantity remains unchanged |
| Order    | Order is not saved as completed    |

---

## BL-015: Canceled order must not be shown as completed

### Description

A canceled order should not appear as a completed order.

If the service supports pending order cancellation, the canceled order status must be clearly shown as `CANCELED`.

### Business Risk

If a canceled order is shown as completed, users may believe that the order was executed even though it was canceled.

This can cause confusion about available cash, holdings, and order history.

### Example Test Data

| Item                       | Value    |
| -------------------------- | -------- |
| Account ID                 | ACC-001  |
| Stock ID                   | MOCK-002 |
| Order Status Before Cancel | PENDING  |
| Order Status After Cancel  | CANCELED |

### Expected Behavior

* Pending order can be canceled
* Order status changes to `CANCELED`
* Available cash is not deducted
* Holding quantity is not changed
* Canceled order is not shown as completed

### Validation Points

| Layer         | Validation                                   |
| ------------- | -------------------------------------------- |
| UI            | Canceled order status is displayed clearly   |
| API           | Cancel API returns `CANCELED` status         |
| DB            | Order status is `CANCELED`                   |
| Holdings      | Holding quantity remains unchanged           |
| Order History | Canceled order is not displayed as completed |

---

## BL-016: Duplicate order request must not be processed twice

### Description

If the same buy order request is submitted multiple times, the system should process it only once.

This can happen when:

* User clicks the order submit button multiple times
* Network delay causes retry
* Same API request is sent again
* Browser refresh or back button resubmits the request

### Business Risk

If duplicate orders are not handled properly, available cash may be deducted multiple times and holding quantity may increase incorrectly.

### Example Test Data

| Item       | Value         |
| ---------- | ------------- |
| Account ID | ACC-001       |
| Stock ID   | MOCK-001      |
| Quantity   | 1             |
| Price      | 70,000 KRW    |
| Request ID | REQ-ORDER-001 |

### Expected Behavior

* Only one buy order is completed
* Available cash is decreased only once
* Holding quantity is increased only once
* Only one completed order record is created
* Duplicate request is rejected or ignored

### Validation Points

| Layer    | Validation                                        |
| -------- | ------------------------------------------------- |
| UI       | Submit button is disabled after first click       |
| API      | Duplicate order request ID is rejected or ignored |
| DB       | Only one completed order exists                   |
| Cash     | Available cash is deducted only once              |
| Holdings | Holding quantity is increased only once           |

---

## 7. UI / API / DB Consistency

Business logic QA should not stop at UI validation.

A financial service flow should be checked from multiple layers:

| Layer   | Purpose                  | Example                                             |
| ------- | ------------------------ | --------------------------------------------------- |
| UI      | Check what the user sees | Balance, available cash, holdings, order history    |
| API     | Check backend response   | Account, transaction, order, holdings API responses |
| DB      | Check stored data        | Account, transaction, order, holdings tables        |
| History | Check audit result       | Transaction history or order history status         |

---

## 8. Example Consistency Checks

## 8.1 Successful Transfer Consistency

| Validation Target    | Expected Result                             |
| -------------------- | ------------------------------------------- |
| UI balance           | Sender balance decreases by transfer amount |
| Account API          | Updated sender balance is returned          |
| Transaction API      | Completed transaction is returned           |
| DB account table     | Sender and receiver balances are updated    |
| DB transaction table | Completed transaction record exists         |

## 8.2 Failed Transfer Consistency

| Validation Target    | Expected Result                        |
| -------------------- | -------------------------------------- |
| UI message           | Error message is displayed             |
| Account API          | Balance remains unchanged              |
| Transaction API      | No completed transaction is returned   |
| DB account table     | Balance remains unchanged              |
| DB transaction table | No completed transaction record exists |

## 8.3 Successful Buy Order Consistency

| Validation Target | Expected Result                              |
| ----------------- | -------------------------------------------- |
| UI available cash | Available cash decreases by order amount     |
| UI holdings       | Holding quantity increases by order quantity |
| Order API         | Completed order response is returned         |
| Holdings API      | Updated holding quantity is returned         |
| DB account table  | Available cash is updated                    |
| DB holdings table | Holding quantity is updated                  |
| DB orders table   | Completed order record exists                |

## 8.4 Failed Buy Order Consistency

| Validation Target | Expected Result                                |
| ----------------- | ---------------------------------------------- |
| UI message        | Insufficient buying power message is displayed |
| Account API       | Available cash remains unchanged               |
| Holdings API      | Holding quantity remains unchanged             |
| Order API         | Order status is rejected or failed             |
| DB account table  | Available cash remains unchanged               |
| DB holdings table | Holding quantity remains unchanged             |
| DB orders table   | No completed order record exists               |

---

## 9. Business Logic Risk Matrix

| Risk ID | Business Risk                                         | Impact                                       | Related Rule | Priority |
| ------- | ----------------------------------------------------- | -------------------------------------------- | ------------ | -------- |
| BR-001  | Transfer succeeds despite insufficient balance        | Financial data inconsistency                 | BL-001       | P0       |
| BR-002  | Balance is deducted incorrectly                       | Incorrect user balance                       | BL-002       | P0       |
| BR-003  | Receiver balance is not updated                       | Inconsistent money movement                  | BL-003       | P0       |
| BR-004  | Failed transfer changes balance                       | Financial data corruption                    | BL-004       | P0       |
| BR-005  | Failed transfer shown as completed                    | User trust issue                             | BL-005       | P0       |
| BR-006  | Duplicate transfer is processed                       | Duplicate withdrawal                         | BL-006       | P0       |
| BR-007  | Suspended account can transfer                        | Policy violation                             | BL-007       | P0       |
| BR-008  | Transaction history mismatch                          | User trust and audit issue                   | BL-008       | P0       |
| BR-009  | Invalid amount is accepted                            | Unexpected transaction behavior              | BL-009       | P1       |
| BR-010  | Invalid receiver is accepted                          | Invalid money movement                       | BL-010       | P1       |
| BR-011  | Buy order succeeds despite insufficient buying power  | Incorrect order execution                    | BL-011       | P0       |
| BR-012  | Available cash is not updated after completed order   | Incorrect buying power                       | BL-012       | P0       |
| BR-013  | Holding quantity is not updated after completed order | Incorrect portfolio data                     | BL-013       | P0       |
| BR-014  | Failed order changes cash or holdings                 | Financial data inconsistency                 | BL-014       | P0       |
| BR-015  | Canceled order is shown as completed                  | Misleading order status                      | BL-015       | P0       |
| BR-016  | Duplicate order is processed                          | Duplicate cash deduction and holdings update | BL-016       | P0       |

---

## 10. Automation Candidates for Business Logic QA

Some business logic scenarios are good candidates for automation because they are important for regression testing.

| Rule ID | Scenario                                           | Automation Priority | Reason                                              |
| ------- | -------------------------------------------------- | ------------------- | --------------------------------------------------- |
| BL-001  | Transfer amount exceeds balance                    | High                | Critical negative case                              |
| BL-002  | Sender balance decreases after transfer            | High                | Core financial logic                                |
| BL-004  | Failed transfer does not change balance            | High                | Prevents financial inconsistency                    |
| BL-005  | Failed transfer is not completed                   | High                | Prevents misleading transaction history             |
| BL-006  | Duplicate transfer request prevention              | Medium              | Important but may require stable request ID control |
| BL-008  | Transaction history matches transfer result        | High                | Important regression check                          |
| BL-011  | Buy order exceeds available cash                   | High                | Critical negative case for investment order         |
| BL-012  | Available cash decreases after completed buy order | High                | Core order data consistency                         |
| BL-013  | Holdings increase after completed buy order        | High                | Core portfolio data consistency                     |
| BL-014  | Failed order does not change cash or holdings      | High                | Prevents financial data inconsistency               |
| BL-015  | Canceled order is not completed                    | Medium              | Important order status validation                   |
| BL-016  | Duplicate order request prevention                 | Medium              | Important but may require stable request ID control |

---

## 11. Manual Review Points

Some business logic areas may require manual review or exploratory testing.

| Area                  | Manual Review Point                                                            |
| --------------------- | ------------------------------------------------------------------------------ |
| Error message         | Is the message understandable to users?                                        |
| Transfer confirmation | Does the confirmation screen clearly show amount and receiver?                 |
| Account restriction   | Is the restricted account state clear to the user?                             |
| Transaction history   | Is the transaction result easy to understand?                                  |
| Order confirmation    | Does the order screen clearly show stock, quantity, price, and total amount?   |
| Holdings display      | Is the updated holding quantity easy to understand?                            |
| Order status          | Are completed, failed, pending, and canceled statuses clearly distinguishable? |
| Edge case behavior    | Are unexpected inputs handled safely?                                          |

---

## 12. Summary

This document defines business logic validation points for the mock financial service.

The main QA focus is to ensure that money movement rules, balance updates, investment order rules, holdings updates, transaction records, and order records are handled correctly.

The project started with account and money movement business rules and was extended with investment order lifecycle rules to better demonstrate QA thinking for securities service flows.

This document demonstrates that QA should validate service quality not only through UI behavior, but also through business rules, API responses, and backend data consistency.

