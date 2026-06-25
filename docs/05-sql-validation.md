# SQL Validation

## 1. Purpose

This document provides SQL validation examples for the mock fintech service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can verify backend data consistency beyond UI-level and API-level validation.

This is not a real company project.
All database tables, queries, and test data are fictional and created only for personal QA practice.

---

## 2. Why SQL Validation Matters

In fintech services, UI confirmation alone is not enough.

For example, even if the UI shows that a transfer was successful, QA should also consider whether:

* Sender balance was actually decreased
* Receiver balance was actually increased
* Transaction record was created correctly
* Failed transfer was not saved as completed
* Duplicate transfer did not create duplicate records
* UI, API, and DB values are consistent

SQL validation helps QA check whether the backend data correctly reflects the service behavior.

---

## 3. Mock Database Scope

This project assumes a simplified mock database with the following tables:

* `users`
* `accounts`
* `transactions`

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
| currency       | Account currency                           |
| account_status | Account status such as ACTIVE or SUSPENDED |

Example:

```sql
SELECT account_id, user_id, balance, currency, account_status
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

## 5. Mock Test Data

| User Type        | User ID          | Account ID | Account Status | Balance |
| ---------------- | ---------------- | ---------- | -------------- | ------- |
| Standard user    | user_standard    | ACC-001    | ACTIVE         | 100000  |
| Low balance user | user_low_balance | ACC-002    | ACTIVE         | 1000    |
| Suspended user   | user_suspended   | ACC-003    | SUSPENDED      | 100000  |
| Receiver user    | user_receiver    | ACC-004    | ACTIVE         | 50000   |

---

## 6. SQL Validation Scenarios

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
| ---------- | ------- |
| ACC-001    | 70000   |

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
| ---------- | ------- |
| ACC-004    | 80000   |

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
| ----------------- | ------------------- | ------ | --------- |
| ACC-001           | ACC-004             | 30000  | COMPLETED |

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
| ---------- | ------- |
| ACC-002    | 1000    |

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
| ----------------- | ------------------- | ------ | ------ | -------------------- |
| ACC-002           | ACC-004             | 10000  | FAILED | INSUFFICIENT_BALANCE |

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
| --------------- |
| 0               |

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
| ---------------- | ----------------- |
| REQ-TRANSFER-001 | 1                 |

### Additional Balance Check

```sql
SELECT account_id, balance
FROM accounts
WHERE account_id = 'ACC-001';
```

### Expected Result

If the initial sender balance was `100000` and the transfer amount was `10000`:

| account_id | balance |
| ---------- | ------- |
| ACC-001    | 90000   |

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
| ------ | ------- |
| UI     | 70000   |
| API    | 70000   |
| DB     | 70000   |

### QA Checkpoint

All layers should show the same balance value.

---

## SQL-009: Verify latest transaction ordering

### Related Test Case

* TC-HIST-005

### Purpose

Verify that the latest transaction appears first in transaction history.

### SQL Query

```sql
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
```

### Expected Result

The most recent transaction should appear at the top of the transaction history.

### QA Checkpoint

Transaction ordering should be consistent between DB, API, and UI.

---

## SQL-010: Verify transaction amount matches balance difference

### Related Test Case

* TC-TRF-002
* TC-TRF-003
* TC-HIST-002

### Purpose

Verify that the transaction amount matches the actual balance change.

### Example Scenario

| Item                   | Value  |
| ---------------------- | ------ |
| Sender Initial Balance | 100000 |
| Sender Final Balance   | 70000  |
| Transaction Amount     | 30000  |

### SQL Query

```sql
SELECT
    sender_account_id,
    receiver_account_id,
    amount,
    status
FROM transactions
WHERE sender_account_id = 'ACC-001'
  AND receiver_account_id = 'ACC-004'
  AND status = 'COMPLETED'
ORDER BY created_at DESC
LIMIT 1;
```

### Expected Result

| sender_account_id | receiver_account_id | amount | status    |
| ----------------- | ------------------- | ------ | --------- |
| ACC-001           | ACC-004             | 30000  | COMPLETED |

### QA Checkpoint

The completed transaction amount should match the sender balance decrease and receiver balance increase.

---

## 7. SQL Validation Checklist

| Checkpoint                    | Description                                          | Priority |
| ----------------------------- | ---------------------------------------------------- | -------- |
| Sender balance update         | Sender balance decreases after successful transfer   | P0       |
| Receiver balance update       | Receiver balance increases after successful transfer | P0       |
| Failed transfer balance       | Balance remains unchanged after failed transfer      | P0       |
| Completed transaction record  | Successful transfer creates completed transaction    | P0       |
| Failed transaction status     | Failed transfer is not marked as completed           | P0       |
| Duplicate request handling    | Duplicate request creates only one transaction       | P0       |
| Suspended account restriction | Suspended account cannot complete transfer           | P0       |
| UI/API/DB consistency         | Balance is consistent across all layers              | P1       |
| Transaction ordering          | Latest transaction is displayed first                | P1       |

---

## 8. Example SQL Files

The following SQL files can be stored under the `sql/` directory.

```text
sql/
├── account-validation.sql
├── transfer-validation.sql
└── transaction-history-validation.sql
```

---

## 9. Example: account-validation.sql

```sql
-- Verify account balance by account ID
SELECT
    account_id,
    user_id,
    balance,
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

## 10. Example: transfer-validation.sql

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

## 11. Example: transaction-history-validation.sql

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

## 12. SQL Validation Notes

SQL validation in this project is intentionally simple.

The goal is not to demonstrate advanced database skills, but to show that QA can think beyond the UI and verify whether backend data is consistent with business rules.

Important QA questions include:

* Does the DB value match what the user sees?
* Does the API response match the DB value?
* Was the transaction saved with the correct status?
* Did the balance change only when the transfer was successful?
* Was a duplicate request prevented?
* Is failed transaction handling clear and consistent?

---

## 13. Summary

This document provides SQL validation examples for a mock fintech service.

The main focus is to demonstrate backend data validation from a QA perspective.

By combining UI validation, API validation, and SQL validation, QA can more confidently verify that important financial service rules are working correctly.
