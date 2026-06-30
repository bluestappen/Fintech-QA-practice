# SQL Validation

## 1. Purpose

This document provides SQL validation examples for the mock financial service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can verify backend data consistency beyond UI-level and API-level validation.

This is not a real company project.
All database tables, queries, and test data are fictional and created only for personal QA practice.

---

## 2. Why SQL Validation Matters

In financial services, UI confirmation alone is not enough.

For example, even if the UI shows that a transfer or buy order was successful, QA should also consider whether:

* Sender balance was actually decreased
* Receiver balance was actually increased
* Available cash was updated correctly
* Holdings were updated after a completed order
* Transaction or order record was created correctly
* Failed transfer or failed order was not saved as completed
* Duplicate request did not create duplicate records
* UI, API, and DB values are consistent

SQL validation helps QA check whether backend data correctly reflects service behavior and business rules.

---

## 3. Mock Database Scope

This project assumes a simplified mock database with the following tables:

* `users`
* `accounts`
* `transactions`
* `stocks`
* `orders`
* `holdings`

These tables are simplified for QA practice purposes.

---

## 4. Mock Table Structure

## 4.1 users

| Column      | Description                             |
| ----------- | --------------------------------------- |
| user_id     | Unique user ID                          |
| user_name   | User name                               |
| user_status | User status such as ACTIVE or SUSPENDED |

Example:

```sql
SELECT user_id, user_name, user_status
FROM users;
```

---

## 4.2 accounts

| Column         | Description                                |
| -------------- | ------------------------------------------ |
| account_id     | Unique account ID                          |
| user_id        | Owner user ID                              |
| balance        | Current account balance                    |
| available_cash | Available cash for investment orders       |
| currency       | Account currency                           |
| account_status | Account status such as ACTIVE or SUSPENDED |

Example:

```sql
SELECT account_id, user_id, balance, available_cash, currency, account_status
FROM accounts;
```

---

## 4.3 transactions

| Column              | Description                                               |
| ------------------- | --------------------------------------------------------- |
| transaction_id      | Unique transaction ID                                     |
| request_id          | Unique request ID for duplicate request prevention        |
| sender_account_id   | Sender account ID                                         |
| receiver_account_id | Receiver account ID                                       |
| amount              | Transfer amount                                           |
| status              | Transaction status such as COMPLETED, FAILED, or REJECTED |
| failure_reason      | Reason for failed transaction                             |
| created_at          | Transaction creation time                                 |

Example:

```sql
SELECT transaction_id, request_id, sender_account_id, receiver_account_id, amount, status, created_at
FROM transactions;
```

---

## 4.4 stocks

| Column        | Description              |
| ------------- | ------------------------ |
| stock_id      | Unique mock stock ID     |
| stock_name    | Mock stock name          |
| current_price | Current mock stock price |
| currency      | Price currency           |

Example:

```sql
SELECT stock_id, stock_name, current_price, currency
FROM stocks;
```

---

## 4.5 orders

| Column         | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| order_id       | Unique order ID                                                        |
| request_id     | Unique request ID for duplicate order prevention                       |
| account_id     | Account ID that submitted the order                                    |
| stock_id       | Ordered stock ID                                                       |
| side           | Order side such as BUY or SELL                                         |
| quantity       | Ordered quantity                                                       |
| price          | Order price                                                            |
| order_amount   | Total order amount                                                     |
| status         | Order status such as COMPLETED, FAILED, REJECTED, PENDING, or CANCELED |
| failure_reason | Reason for failed or rejected order                                    |
| created_at     | Order creation time                                                    |

Example:

```sql
SELECT order_id, request_id, account_id, stock_id, side, quantity, price, order_amount, status, created_at
FROM orders;
```

---

## 4.6 holdings

| Column     | Description              |
| ---------- | ------------------------ |
| account_id | Account ID               |
| stock_id   | Stock ID                 |
| quantity   | Current holding quantity |
| updated_at | Last updated time        |

Example:

```sql
SELECT account_id, stock_id, quantity, updated_at
FROM holdings;
```

---

## 5. Mock Test Data

## 5.1 Account Data

| User Type        | User ID          | Account ID | Account Status | Balance | Available Cash |
| ---------------- | ---------------- | ---------- | -------------- | ------: | -------------: |
| Standard user    | user_standard    | ACC-001    | ACTIVE         |  100000 |         100000 |
| Low balance user | user_low_balance | ACC-002    | ACTIVE         |    1000 |           1000 |
| Suspended user   | user_suspended   | ACC-003    | SUSPENDED      |  100000 |         100000 |
| Receiver user    | user_receiver    | ACC-004    | ACTIVE         |   50000 |          50000 |

## 5.2 Investment Data

| Stock ID | Stock Name          | Current Price |
| -------- | ------------------- | ------------: |
| MOCK-001 | Toss Mock Stock     |         70000 |
| MOCK-002 | Fintech Growth Mock |         30000 |

| Account ID | Stock ID | Initial Quantity |
| ---------- | -------- | ---------------: |
| ACC-001    | MOCK-001 |                0 |
| ACC-001    | MOCK-002 |                0 |
| ACC-002    | MOCK-001 |                0 |

---

# 6. SQL Validation Scenarios: Account & Money Movement

## SQL-001: Verify sender balance after successful transfer

### Related Test Case

* TC-TRF-002
* TC-SQL-001

### Purpose

Verify that the sender balance decreases correctly after a successful transfer.

### Example Scenario

| Item             | Value   |
| ---------------- | ------- |
| Sender Account   | ACC-001 |
| Initial Balance  | 100000  |
| Transfer Amount  | 30000   |
| Expected Balance | 70000   |

### SQL Query

```sql
SELECT account_id, balance
FROM accounts
WHERE account_id = 'ACC-001';
```

### Expected Result

| account_id | balance |
| ---------- | ------: |
| ACC-001    |   70000 |

### QA Checkpoint

The sender balance should be decreased by the exact transfer amount.

---

## SQL-002: Verify receiver balance after successful transfer

### Related Test Case

* TC-TRF-003
* TC-SQL-002

### Purpose

Verify that the receiver balance increases correctly after a successful transfer.

### Example Scenario

| Item             | Value   |
| ---------------- | ------- |
| Receiver Account | ACC-004 |
| Initial Balance  | 50000   |
| Transfer Amount  | 30000   |
| Expected Balance | 80000   |

### SQL Query

```sql
SELECT account_id, balance
FROM accounts
WHERE account_id = 'ACC-004';
```

### Expected Result

| account_id | balance |
| ---------- | ------: |
| ACC-004    |   80000 |

### QA Checkpoint

The receiver balance should be increased by the exact transfer amount.

---

## SQL-003: Verify completed transaction record after successful transfer

### Related Test Case

* TC-TRF-004
* TC-HIST-001
* TC-SQL-004

### Purpose

Verify that a completed transaction record exists after a successful transfer.

### SQL Query

```sql
SELECT
    transaction_id,
    request_id,
    sender_account_id,
    receiver_account_id,
    amount,
    status,
    created_at
FROM transactions
WHERE sender_account_id = 'ACC-001'
  AND receiver_account_id = 'ACC-004'
  AND amount = 30000
ORDER BY created_at DESC
LIMIT 1;
```

### Expected Result

| sender_account_id | receiver_account_id | amount | status    |
| ----------------- | ------------------- | -----: | --------- |
| ACC-001           | ACC-004             |  30000 | COMPLETED |

### QA Checkpoint

The latest transaction should be recorded with `COMPLETED` status.

---

## SQL-004: Verify balance remains unchanged after insufficient balance transfer

### Related Test Case

* TC-TRF-006
* TC-TRF-007
* TC-SQL-003

### Purpose

Verify that the sender balance does not change when a transfer is rejected due to insufficient balance.

### Example Scenario

| Item             | Value   |
| ---------------- | ------- |
| Sender Account   | ACC-002 |
| Initial Balance  | 1000    |
| Transfer Amount  | 10000   |
| Expected Balance | 1000    |

### SQL Query

```sql
SELECT account_id, balance
FROM accounts
WHERE account_id = 'ACC-002';
```

### Expected Result

| account_id | balance |
| ---------- | ------: |
| ACC-002    |    1000 |

### QA Checkpoint

The sender balance should remain unchanged because the transfer failed.

---

## SQL-005: Verify failed transfer is not recorded as completed

### Related Test Case

* TC-TRF-008
* TC-HIST-004
* TC-SQL-005

### Purpose

Verify that a failed transfer is not saved with `COMPLETED` status.

### SQL Query

```sql
SELECT
    transaction_id,
    sender_account_id,
    receiver_account_id,
    amount,
    status,
    failure_reason,
    created_at
FROM transactions
WHERE sender_account_id = 'ACC-002'
  AND receiver_account_id = 'ACC-004'
  AND amount = 10000
ORDER BY created_at DESC;
```

### Expected Result Option 1

If the system stores failed transactions:

| sender_account_id | receiver_account_id | amount | status | failure_reason       |
| ----------------- | ------------------- | -----: | ------ | -------------------- |
| ACC-002           | ACC-004             |  10000 | FAILED | INSUFFICIENT_BALANCE |

### Expected Result Option 2

If the system does not store rejected transactions:

No completed transaction should exist.

### Additional Check

```sql
SELECT COUNT(*) AS completed_count
FROM transactions
WHERE sender_account_id = 'ACC-002'
  AND receiver_account_id = 'ACC-004'
  AND amount = 10000
  AND status = 'COMPLETED';
```

### Expected Result

| completed_count |
| --------------: |
|               0 |

### QA Checkpoint

A failed transfer must not be recorded as `COMPLETED`.

---

## SQL-006: Verify duplicate transfer request is processed only once

### Related Test Case

* TC-DUP-001
* TC-DUP-002
* TC-DUP-003
* TC-DUP-004

### Purpose

Verify that duplicate transfer requests do not create multiple completed transactions.

### Example Scenario

| Item             | Value            |
| ---------------- | ---------------- |
| Request ID       | REQ-TRANSFER-001 |
| Sender Account   | ACC-001          |
| Receiver Account | ACC-004          |
| Transfer Amount  | 10000            |

### SQL Query

```sql
SELECT
    request_id,
    COUNT(*) AS transaction_count
FROM transactions
WHERE request_id = 'REQ-TRANSFER-001'
GROUP BY request_id;
```

### Expected Result

| request_id       | transaction_count |
| ---------------- | ----------------: |
| REQ-TRANSFER-001 |                 1 |

### Additional Balance Check

```sql
SELECT account_id, balance
FROM accounts
WHERE account_id = 'ACC-001';
```

### Expected Result

If the initial sender balance was `100000` and the transfer amount was `10000`:

| account_id | balance |
| ---------- | ------: |
| ACC-001    |   90000 |

### QA Checkpoint

Only one completed transaction should exist, and the sender balance should be deducted only once.

---

## SQL-007: Verify suspended account cannot complete transfer

### Related Test Case

* TC-TRF-012

### Purpose

Verify that a suspended account cannot complete a money transfer.

### SQL Query

```sql
SELECT account_id, account_status, balance
FROM accounts
WHERE account_id = 'ACC-003';
```

### Expected Result

| account_id | account_status |
| ---------- | -------------- |
| ACC-003    | SUSPENDED      |

### Transaction Check

```sql
SELECT
    transaction_id,
    sender_account_id,
    receiver_account_id,
    amount,
    status
FROM transactions
WHERE sender_account_id = 'ACC-003'
  AND status = 'COMPLETED';
```

### Expected Result

No completed transaction should exist.

### QA Checkpoint

A suspended account should not be able to create a completed transfer.

---

## SQL-008: Verify UI/API/DB balance consistency

### Related Test Case

* TC-ACC-002

### Purpose

Verify that the balance displayed on the UI matches the API response and DB value.

### SQL Query

```sql
SELECT account_id, balance
FROM accounts
WHERE account_id = 'ACC-001';
```

### Expected Result

The DB balance should match:

* UI account dashboard balance
* Account API response balance
* Transaction result calculation

### Example Comparison

| Source | Balance |
| ------ | ------: |
| UI     |   70000 |
| API    |   70000 |
| DB     |   70000 |

### QA Checkpoint

All layers should show the same balance value.

---

# 7. SQL Validation Scenarios: Investment Order Flow

## SQL-009: Verify completed buy order record exists

### Related Test Case

* TC-ORD-002
* TC-ORD-008
* TC-SQL-009

### Purpose

Verify that a completed buy order record exists after a successful buy order.

### Example Scenario

| Item            | Value     |
| --------------- | --------- |
| Account ID      | ACC-001   |
| Stock ID        | MOCK-001  |
| Quantity        | 1         |
| Price           | 70000     |
| Order Amount    | 70000     |
| Expected Status | COMPLETED |

### SQL Query

```sql
SELECT
    order_id,
    request_id,
    account_id,
    stock_id,
    side,
    quantity,
    price,
    order_amount,
    status,
    created_at
FROM orders
WHERE account_id = 'ACC-001'
  AND stock_id = 'MOCK-001'
  AND side = 'BUY'
  AND quantity = 1
ORDER BY created_at DESC
LIMIT 1;
```

### Expected Result

| account_id | stock_id | side | quantity | order_amount | status    |
| ---------- | -------- | ---- | -------: | -----------: | --------- |
| ACC-001    | MOCK-001 | BUY  |        1 |        70000 | COMPLETED |

### QA Checkpoint

The completed buy order should be saved with correct stock, quantity, order amount, and status.

---

## SQL-010: Verify available cash after completed buy order

### Related Test Case

* TC-ORD-003
* TC-SQL-010

### Purpose

Verify that available cash decreases by the exact order amount after a completed buy order.

### Example Scenario

| Item                    | Value   |
| ----------------------- | ------- |
| Account ID              | ACC-001 |
| Initial Available Cash  | 100000  |
| Order Amount            | 70000   |
| Expected Available Cash | 30000   |

### SQL Query

```sql
SELECT account_id, available_cash
FROM accounts
WHERE account_id = 'ACC-001';
```

### Expected Result

| account_id | available_cash |
| ---------- | -------------: |
| ACC-001    |          30000 |

### QA Checkpoint

Available cash should decrease from `100000` to `30000`.

---

## SQL-011: Verify holding quantity after completed buy order

### Related Test Case

* TC-ORD-004
* TC-ORD-017
* TC-SQL-011

### Purpose

Verify that holding quantity increases after a completed buy order.

### Example Scenario

| Item              | Value    |
| ----------------- | -------- |
| Account ID        | ACC-001  |
| Stock ID          | MOCK-001 |
| Initial Quantity  | 0        |
| Buy Quantity      | 1        |
| Expected Quantity | 1        |

### SQL Query

```sql
SELECT
    account_id,
    stock_id,
    quantity,
    updated_at
FROM holdings
WHERE account_id = 'ACC-001'
  AND stock_id = 'MOCK-001';
```

### Expected Result

| account_id | stock_id | quantity |
| ---------- | -------- | -------: |
| ACC-001    | MOCK-001 |        1 |

### QA Checkpoint

The holding quantity should increase by the completed buy order quantity.

---

## SQL-012: Verify failed buy order does not change available cash

### Related Test Case

* TC-ORD-005
* TC-ORD-006
* TC-SQL-012

### Purpose

Verify that available cash remains unchanged when a buy order is rejected due to insufficient buying power.

### Example Scenario

| Item                    | Value    |
| ----------------------- | -------- |
| Account ID              | ACC-002  |
| Initial Available Cash  | 1000     |
| Stock ID                | MOCK-001 |
| Order Amount            | 70000    |
| Expected Available Cash | 1000     |

### SQL Query

```sql
SELECT account_id, available_cash
FROM accounts
WHERE account_id = 'ACC-002';
```

### Expected Result

| account_id | available_cash |
| ---------- | -------------: |
| ACC-002    |           1000 |

### QA Checkpoint

Available cash should remain unchanged because the buy order failed.

---

## SQL-013: Verify failed buy order does not change holdings

### Related Test Case

* TC-ORD-005
* TC-ORD-007
* TC-SQL-013

### Purpose

Verify that holding quantity remains unchanged when a buy order fails.

### SQL Query

```sql
SELECT
    account_id,
    stock_id,
    quantity
FROM holdings
WHERE account_id = 'ACC-002'
  AND stock_id = 'MOCK-001';
```

### Expected Result

| account_id | stock_id | quantity |
| ---------- | -------- | -------: |
| ACC-002    | MOCK-001 |        0 |

### QA Checkpoint

A failed buy order should not increase holding quantity.

---

## SQL-014: Verify failed buy order is not recorded as completed

### Related Test Case

* TC-ORD-005
* TC-ORD-009

### Purpose

Verify that a failed buy order is not saved with `COMPLETED` status.

### SQL Query

```sql
SELECT
    order_id,
    account_id,
    stock_id,
    quantity,
    order_amount,
    status,
    failure_reason,
    created_at
FROM orders
WHERE account_id = 'ACC-002'
  AND stock_id = 'MOCK-001'
  AND order_amount = 70000
ORDER BY created_at DESC;
```

### Expected Result Option 1

If the system stores failed orders:

| account_id | stock_id | order_amount | status   | failure_reason            |
| ---------- | -------- | -----------: | -------- | ------------------------- |
| ACC-002    | MOCK-001 |        70000 | REJECTED | INSUFFICIENT_BUYING_POWER |

### Expected Result Option 2

If the system does not store rejected orders:

No completed order should exist.

### Additional Check

```sql
SELECT COUNT(*) AS completed_order_count
FROM orders
WHERE account_id = 'ACC-002'
  AND stock_id = 'MOCK-001'
  AND order_amount = 70000
  AND status = 'COMPLETED';
```

### Expected Result

| completed_order_count |
| --------------------: |
|                     0 |

### QA Checkpoint

A failed buy order must not be recorded as `COMPLETED`.

---

## SQL-015: Verify duplicate order request is processed only once

### Related Test Case

* TC-ORD-013
* TC-ORD-014
* TC-ORD-015
* TC-SQL-014

### Purpose

Verify that duplicate order requests do not create multiple completed orders.

### Example Scenario

| Item       | Value         |
| ---------- | ------------- |
| Request ID | REQ-ORDER-001 |
| Account ID | ACC-001       |
| Stock ID   | MOCK-001      |
| Quantity   | 1             |
| Price      | 70000         |

### SQL Query

```sql
SELECT
    request_id,
    COUNT(*) AS order_count
FROM orders
WHERE request_id = 'REQ-ORDER-001'
GROUP BY request_id;
```

### Expected Result

| request_id    | order_count |
| ------------- | ----------: |
| REQ-ORDER-001 |           1 |

### Additional Cash Check

```sql
SELECT account_id, available_cash
FROM accounts
WHERE account_id = 'ACC-001';
```

### Expected Result

If the initial available cash was `100000` and the order amount was `70000`:

| account_id | available_cash |
| ---------- | -------------: |
| ACC-001    |          30000 |

### Additional Holdings Check

```sql
SELECT account_id, stock_id, quantity
FROM holdings
WHERE account_id = 'ACC-001'
  AND stock_id = 'MOCK-001';
```

### Expected Result

| account_id | stock_id | quantity |
| ---------- | -------- | -------: |
| ACC-001    | MOCK-001 |        1 |

### QA Checkpoint

Only one completed order should exist, available cash should be deducted once, and holdings should increase once.

---

## SQL-016: Verify canceled order is not saved as completed

### Related Test Case

* TC-ORD-011
* TC-ORD-012
* TC-SQL-015

### Purpose

Verify that a canceled order is not shown or stored as completed.

### Example Scenario

| Item                         | Value    |
| ---------------------------- | -------- |
| Account ID                   | ACC-001  |
| Stock ID                     | MOCK-002 |
| Order Status Before Cancel   | PENDING  |
| Expected Status After Cancel | CANCELED |

### SQL Query

```sql
SELECT
    order_id,
    account_id,
    stock_id,
    quantity,
    order_amount,
    status,
    created_at
FROM orders
WHERE account_id = 'ACC-001'
  AND stock_id = 'MOCK-002'
ORDER BY created_at DESC
LIMIT 1;
```

### Expected Result

| account_id | stock_id | status   |
| ---------- | -------- | -------- |
| ACC-001    | MOCK-002 | CANCELED |

### Additional Check

```sql
SELECT COUNT(*) AS completed_order_count
FROM orders
WHERE account_id = 'ACC-001'
  AND stock_id = 'MOCK-002'
  AND status = 'COMPLETED';
```

### Expected Result

| completed_order_count |
| --------------------: |
|                     0 |

### QA Checkpoint

A canceled order must not be saved or displayed as `COMPLETED`.

---

## SQL-017: Verify UI/API/DB holdings consistency

### Related Test Case

* TC-ORD-016
* TC-ORD-017

### Purpose

Verify that holdings displayed on the UI match the holdings API response and DB value.

### SQL Query

```sql
SELECT
    account_id,
    stock_id,
    quantity
FROM holdings
WHERE account_id = 'ACC-001'
  AND stock_id = 'MOCK-001';
```

### Expected Result

The DB holding quantity should match:

* Holdings UI
* Holdings API response
* Completed order quantity calculation

### Example Comparison

| Source | Stock ID | Quantity |
| ------ | -------- | -------: |
| UI     | MOCK-001 |        1 |
| API    | MOCK-001 |        1 |
| DB     | MOCK-001 |        1 |

### QA Checkpoint

All layers should show the same holding quantity.

---

# 8. SQL Validation Checklist

| Checkpoint                     | Description                                              | Priority |
| ------------------------------ | -------------------------------------------------------- | -------- |
| Sender balance update          | Sender balance decreases after successful transfer       | P0       |
| Receiver balance update        | Receiver balance increases after successful transfer     | P0       |
| Failed transfer balance        | Balance remains unchanged after failed transfer          | P0       |
| Completed transaction record   | Successful transfer creates completed transaction        | P0       |
| Failed transaction status      | Failed transfer is not marked as completed               | P0       |
| Duplicate transfer handling    | Duplicate transfer request creates only one transaction  | P0       |
| Suspended account restriction  | Suspended account cannot complete transfer               | P0       |
| UI/API/DB balance consistency  | Balance is consistent across all layers                  | P1       |
| Completed order record         | Successful buy order creates completed order             | P0       |
| Available cash update          | Available cash decreases after completed buy order       | P0       |
| Holdings update                | Holding quantity increases after completed buy order     | P0       |
| Failed order cash              | Available cash remains unchanged after failed order      | P0       |
| Failed order holdings          | Holding quantity remains unchanged after failed order    | P0       |
| Duplicate order handling       | Duplicate order request creates only one completed order | P0       |
| Canceled order status          | Canceled order is not marked as completed                | P0       |
| UI/API/DB holdings consistency | Holdings are consistent across all layers                | P0       |

---

# 9. Example SQL Files

The following SQL files can be stored under the `sql/` directory.

```text
sql/
├── account-validation.sql
├── transfer-validation.sql
├── transaction-history-validation.sql
├── order-validation.sql
└── holdings-validation.sql
```

---

## 9.1 account-validation.sql

```sql
-- Verify account balance and available cash by account ID
SELECT
    account_id,
    user_id,
    balance,
    available_cash,
    currency,
    account_status
FROM accounts
WHERE account_id = 'ACC-001';

-- Verify suspended account status
SELECT
    account_id,
    user_id,
    account_status
FROM accounts
WHERE account_id = 'ACC-003';
```

---

## 9.2 transfer-validation.sql

```sql
-- Verify latest successful transfer
SELECT
    transaction_id,
    request_id,
    sender_account_id,
    receiver_account_id,
    amount,
    status,
    created_at
FROM transactions
WHERE sender_account_id = 'ACC-001'
  AND receiver_account_id = 'ACC-004'
ORDER BY created_at DESC
LIMIT 1;

-- Verify failed transfer is not completed
SELECT COUNT(*) AS completed_count
FROM transactions
WHERE sender_account_id = 'ACC-002'
  AND receiver_account_id = 'ACC-004'
  AND amount = 10000
  AND status = 'COMPLETED';
```

---

## 9.3 transaction-history-validation.sql

```sql
-- Verify transaction history ordering
SELECT
    transaction_id,
    sender_account_id,
    receiver_account_id,
    amount,
    status,
    created_at
FROM transactions
WHERE sender_account_id = 'ACC-001'
ORDER BY created_at DESC;

-- Verify transaction status count
SELECT
    status,
    COUNT(*) AS status_count
FROM transactions
GROUP BY status;
```

---

## 9.4 order-validation.sql

```sql
-- Verify latest completed buy order
SELECT
    order_id,
    request_id,
    account_id,
    stock_id,
    side,
    quantity,
    price,
    order_amount,
    status,
    created_at
FROM orders
WHERE account_id = 'ACC-001'
  AND stock_id = 'MOCK-001'
ORDER BY created_at DESC
LIMIT 1;

-- Verify failed order is not completed
SELECT COUNT(*) AS completed_order_count
FROM orders
WHERE account_id = 'ACC-002'
  AND stock_id = 'MOCK-001'
  AND order_amount = 70000
  AND status = 'COMPLETED';

-- Verify duplicate order request count
SELECT
    request_id,
    COUNT(*) AS order_count
FROM orders
WHERE request_id = 'REQ-ORDER-001'
GROUP BY request_id;
```

---

## 9.5 holdings-validation.sql

```sql
-- Verify holding quantity after completed buy order
SELECT
    account_id,
    stock_id,
    quantity,
    updated_at
FROM holdings
WHERE account_id = 'ACC-001'
  AND stock_id = 'MOCK-001';

-- Verify holdings summary by account
SELECT
    account_id,
    stock_id,
    SUM(quantity) AS total_quantity
FROM holdings
WHERE account_id = 'ACC-001'
GROUP BY account_id, stock_id;
```

---

# 10. SQL Validation Notes

SQL validation in this project is intentionally simple.

The goal is not to demonstrate advanced database skills, but to show that QA can think beyond the UI and verify whether backend data is consistent with business rules.

Important QA questions include:

* Does the DB value match what the user sees?
* Does the API response match the DB value?
* Was the transaction or order saved with the correct status?
* Did the balance change only when the transfer was successful?
* Did available cash change only when the order was completed?
* Did holdings change only when the order was completed?
* Was a duplicate transfer or duplicate order prevented?
* Is failed transaction or failed order handling clear and consistent?

---

# 11. Summary

This document provides SQL validation examples for a mock financial service.

The main focus is to demonstrate backend data validation from a QA perspective.

By combining UI validation, API validation, and SQL validation, QA can more confidently verify that important financial service rules are working correctly.

The project started with account and money movement validation and was extended with investment order and holdings validation to better demonstrate QA thinking for securities service flows.

