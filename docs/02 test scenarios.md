# Test Scenarios

## 1. Purpose

This document defines test scenarios for the mock financial service used in the Fintech QA Practice Portfolio.

The purpose of this document is to demonstrate how QA can convert service requirements, business rules, and risk areas into structured test cases.

This is not a real company project.
All scenarios and test data are fictional and created only for personal QA practice.

---

## 2. Test Scenario Scope

The test scenarios cover two simplified financial service modules.

### Module 1: Account & Money Movement

This module covers:

* Login
* Account balance inquiry
* Money transfer
* Transfer failure handling
* Duplicate transfer prevention
* Transaction history inquiry
* Account status validation

### Module 2: Investment Order Flow

This module covers:

* Available cash inquiry
* Mock stock information inquiry
* Buy order placement
* Insufficient buying power handling
* Order history inquiry
* Holdings update after completed order
* Pending order cancellation
* Duplicate order prevention

The focus is on core financial service flows where defects can affect user trust, financial data consistency, order accuracy, or release readiness.

---

## 3. Priority Definition

| Priority | Meaning                                                                 | Example                                                    |
| -------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| P0       | Must be tested first because failure can cause critical business impact | Incorrect balance calculation or incorrect holdings update |
| P1       | Important flow that should be tested before release                     | Error message validation or order history display          |
| P2       | Lower-risk flow or usability-related check                              | Minor UI display issue                                     |

---

## 4. Test Type Definition

| Test Type       | Meaning                                                         |
| --------------- | --------------------------------------------------------------- |
| Functional      | Verifies that a feature works as expected                       |
| Negative        | Verifies that invalid actions are properly blocked              |
| Business Logic  | Verifies financial rules and service-specific business rules    |
| Data Validation | Verifies consistency between UI, API, and DB                    |
| Regression      | Verifies that existing core flows still work after changes      |
| UI              | Verifies visible screen elements and user interaction           |
| API             | Verifies backend response and validation result                 |
| SQL             | Verifies backend data consistency through database-level checks |

---

## 5. Test Data

## 5.1 Mock Account Data

| User Type        | User ID          | Account ID | Account Status |     Balance |
| ---------------- | ---------------- | ---------- | -------------- | ----------: |
| Standard user    | user_standard    | ACC-001    | ACTIVE         | 100,000 KRW |
| Low balance user | user_low_balance | ACC-002    | ACTIVE         |   1,000 KRW |
| Suspended user   | user_suspended   | ACC-003    | SUSPENDED      | 100,000 KRW |
| Receiver user    | user_receiver    | ACC-004    | ACTIVE         |  50,000 KRW |

## 5.2 Mock Investment Data

| Stock ID | Stock Name          | Current Price |
| -------- | ------------------- | ------------: |
| MOCK-001 | Toss Mock Stock     |    70,000 KRW |
| MOCK-002 | Fintech Growth Mock |    30,000 KRW |

| User ID          | Account ID | Stock ID | Initial Quantity |
| ---------------- | ---------- | -------- | ---------------: |
| user_standard    | ACC-001    | MOCK-001 |                0 |
| user_standard    | ACC-001    | MOCK-002 |                0 |
| user_low_balance | ACC-002    | MOCK-001 |                0 |

---

## 6. Login Scenarios

| Test Case ID | Feature | Scenario                            | Priority | Test Type      | Expected Result                                                               |
| ------------ | ------- | ----------------------------------- | -------- | -------------- | ----------------------------------------------------------------------------- |
| TC-LOGIN-001 | Login   | User logs in with valid credentials | P1       | Functional     | User is redirected to the account dashboard                                   |
| TC-LOGIN-002 | Login   | User logs in with invalid password  | P1       | Negative       | Login is rejected and an error message is displayed                           |
| TC-LOGIN-003 | Login   | User submits empty ID and password  | P2       | Negative / UI  | Required field validation messages are displayed                              |
| TC-LOGIN-004 | Login   | Suspended user attempts to log in   | P1       | Business Logic | User can be identified as suspended or restricted according to account policy |

---

## 7. Account Balance Scenarios

| Test Case ID | Feature | Scenario                                        | Priority | Test Type       | Expected Result                                                         |
| ------------ | ------- | ----------------------------------------------- | -------- | --------------- | ----------------------------------------------------------------------- |
| TC-ACC-001   | Account | User views account balance after login          | P1       | Functional      | Current account balance is displayed correctly                          |
| TC-ACC-002   | Account | UI balance matches API account balance response | P0       | Data Validation | Balance shown on UI is the same as API response                         |
| TC-ACC-003   | Account | Account balance is displayed in KRW format      | P2       | UI              | Balance is displayed with proper currency format                        |
| TC-ACC-004   | Account | Suspended account balance is viewed             | P1       | Business Logic  | Account status is displayed and restricted actions are handled properly |

---

## 8. Money Transfer - Successful Flow

| Test Case ID | Feature  | Scenario                                                          | Priority | Test Type                        | Expected Result                                        |
| ------------ | -------- | ----------------------------------------------------------------- | -------- | -------------------------------- | ------------------------------------------------------ |
| TC-TRF-001   | Transfer | User transfers money within available balance                     | P0       | Functional / Business Logic      | Transfer is completed successfully                     |
| TC-TRF-002   | Transfer | Sender balance decreases after successful transfer                | P0       | Business Logic / Data Validation | Sender balance is decreased by the transfer amount     |
| TC-TRF-003   | Transfer | Receiver balance increases after successful transfer              | P0       | Business Logic / Data Validation | Receiver balance is increased by the transfer amount   |
| TC-TRF-004   | Transfer | Successful transfer is recorded in transaction history            | P0       | Data Validation                  | Transaction history shows completed transfer           |
| TC-TRF-005   | Transfer | Transfer confirmation screen displays correct amount and receiver | P1       | UI / Functional                  | Confirmation screen shows correct transfer information |

---

## 9. Money Transfer - Negative Flow

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

## 10. Duplicate Transfer Request Scenarios

| Test Case ID | Feature  | Scenario                                                         | Priority | Test Type                   | Expected Result                          |
| ------------ | -------- | ---------------------------------------------------------------- | -------- | --------------------------- | ---------------------------------------- |
| TC-DUP-001   | Transfer | User clicks transfer submit button multiple times quickly        | P0       | Business Logic / Regression | Only one transfer request is processed   |
| TC-DUP-002   | Transfer | Same transfer API request is sent twice with same request ID     | P0       | API / Business Logic        | Duplicate request is rejected or ignored |
| TC-DUP-003   | Transfer | Duplicate transfer does not create duplicate transaction records | P0       | Data Validation             | Only one completed transaction exists    |
| TC-DUP-004   | Transfer | Balance is deducted only once for duplicate transfer attempt     | P0       | Data Validation             | Sender balance is decreased only once    |

---

## 11. Transaction History Scenarios

| Test Case ID | Feature             | Scenario                                                 | Priority | Test Type                    | Expected Result                                        |
| ------------ | ------------------- | -------------------------------------------------------- | -------- | ---------------------------- | ------------------------------------------------------ |
| TC-HIST-001  | Transaction History | User views transaction history after successful transfer | P0       | Functional / Data Validation | Completed transfer is displayed in transaction history |
| TC-HIST-002  | Transaction History | Transaction history amount matches transfer amount       | P0       | Data Validation              | Transaction amount is displayed correctly              |
| TC-HIST-003  | Transaction History | Transaction status is displayed correctly                | P0       | Data Validation              | Completed or failed status is displayed correctly      |
| TC-HIST-004  | Transaction History | Failed transfer is not shown as completed                | P0       | Business Logic               | Failed transfer is not marked as completed             |
| TC-HIST-005  | Transaction History | Latest transaction appears at the top                    | P1       | Functional                   | Most recent transaction is displayed first             |
| TC-HIST-006  | Transaction History | Transaction date and time are displayed                  | P2       | UI                           | Transaction timestamp is visible and understandable    |

---

## 12. Investment Order Scenarios

| Test Case ID | Feature            | Scenario                                                         | Priority | Test Type                        | Expected Result                                        |
| ------------ | ------------------ | ---------------------------------------------------------------- | -------- | -------------------------------- | ------------------------------------------------------ |
| TC-ORD-001   | Investment Order   | User views available cash before placing an order                | P0       | Functional / Data Validation     | Available cash is displayed correctly                  |
| TC-ORD-002   | Investment Order   | User places a buy order within available cash                    | P0       | Functional / Business Logic      | Buy order is completed successfully                    |
| TC-ORD-003   | Investment Order   | Available cash decreases after completed buy order               | P0       | Business Logic / Data Validation | Available cash is decreased by the order amount        |
| TC-ORD-004   | Investment Order   | Holding quantity increases after completed buy order             | P0       | Business Logic / Data Validation | Holding quantity is increased by the ordered quantity  |
| TC-ORD-005   | Investment Order   | User attempts to buy more than available cash                    | P0       | Negative / Business Logic        | Buy order is rejected due to insufficient buying power |
| TC-ORD-006   | Investment Order   | Failed buy order does not change available cash                  | P0       | Data Validation                  | Available cash remains unchanged                       |
| TC-ORD-007   | Investment Order   | Failed buy order does not change holdings                        | P0       | Data Validation                  | Holding quantity remains unchanged                     |
| TC-ORD-008   | Order History      | Completed buy order is shown in order history                    | P0       | Functional / Data Validation     | Order history shows completed order                    |
| TC-ORD-009   | Order History      | Failed order is not shown as completed                           | P0       | Business Logic / Data Validation | Failed order status is not displayed as completed      |
| TC-ORD-010   | Order History      | Latest order appears at the top                                  | P1       | Functional                       | Most recent order is displayed first                   |
| TC-ORD-011   | Order Cancellation | User cancels a pending order                                     | P1       | Functional / Business Logic      | Pending order status changes to canceled               |
| TC-ORD-012   | Order Cancellation | Canceled order does not change cash or holdings                  | P0       | Business Logic / Data Validation | Available cash and holdings remain unchanged           |
| TC-ORD-013   | Duplicate Order    | Same order request is submitted multiple times                   | P0       | Business Logic / Regression      | Only one order is processed                            |
| TC-ORD-014   | Duplicate Order    | Duplicate order does not create duplicate order records          | P0       | Data Validation                  | Only one completed order exists                        |
| TC-ORD-015   | Duplicate Order    | Available cash is deducted only once for duplicate order attempt | P0       | Data Validation                  | Available cash is decreased only once                  |
| TC-ORD-016   | Holdings           | Holdings UI matches holdings API response                        | P0       | Data Validation                  | UI and API show the same holding quantity              |
| TC-ORD-017   | Holdings           | Holdings update matches completed order quantity                 | P0       | Business Logic / Data Validation | Holding quantity reflects completed order quantity     |

---

## 13. API Test Scenarios

| Test Case ID | API                           | Scenario                                            | Priority | Test Type             | Expected Result                                               |
| ------------ | ----------------------------- | --------------------------------------------------- | -------- | --------------------- | ------------------------------------------------------------- |
| TC-API-001   | GET /accounts/{accountId}     | Request account information with valid account ID   | P1       | API                   | API returns account information with 200 status               |
| TC-API-002   | GET /accounts/{accountId}     | Request account information with invalid account ID | P1       | API / Negative        | API returns proper error response                             |
| TC-API-003   | POST /transfers               | Submit valid transfer request                       | P0       | API / Business Logic  | API returns success response and completed transaction status |
| TC-API-004   | POST /transfers               | Submit transfer request exceeding balance           | P0       | API / Business Logic  | API returns business validation error                         |
| TC-API-005   | POST /transfers               | Submit duplicate transfer request                   | P0       | API / Business Logic  | API prevents duplicate transaction processing                 |
| TC-API-006   | GET /transactions             | Request transaction history                         | P1       | API                   | API returns transaction list                                  |
| TC-API-007   | GET /transactions             | Verify latest transaction exists after transfer     | P0       | API / Data Validation | API response includes the latest completed transaction        |
| TC-API-008   | GET /stocks/{stockId}         | Request mock stock information                      | P1       | API                   | API returns stock ID, stock name, and current price           |
| TC-API-009   | POST /orders                  | Submit valid buy order request                      | P0       | API / Business Logic  | API returns completed order response                          |
| TC-API-010   | POST /orders                  | Submit buy order exceeding available cash           | P0       | API / Business Logic  | API returns insufficient buying power error                   |
| TC-API-011   | POST /orders                  | Submit duplicate order request                      | P0       | API / Business Logic  | API prevents duplicate order processing                       |
| TC-API-012   | GET /orders                   | Request order history                               | P1       | API                   | API returns order list                                        |
| TC-API-013   | GET /holdings                 | Request holdings after completed order              | P0       | API / Data Validation | API returns updated holding quantity                          |
| TC-API-014   | POST /orders/{orderId}/cancel | Cancel pending order                                | P1       | API / Business Logic  | API returns canceled order status                             |

---

## 14. SQL Validation Scenarios

| Test Case ID | Validation Area     | Scenario                                                         | Priority | Test Type             | Expected Result                               |
| ------------ | ------------------- | ---------------------------------------------------------------- | -------- | --------------------- | --------------------------------------------- |
| TC-SQL-001   | Account Balance     | Verify sender balance after successful transfer                  | P0       | SQL / Data Validation | Sender balance is decreased correctly         |
| TC-SQL-002   | Account Balance     | Verify receiver balance after successful transfer                | P0       | SQL / Data Validation | Receiver balance is increased correctly       |
| TC-SQL-003   | Failed Transfer     | Verify balance after failed transfer                             | P0       | SQL / Data Validation | Balance remains unchanged                     |
| TC-SQL-004   | Transaction Record  | Verify transaction record after successful transfer              | P0       | SQL / Data Validation | Completed transaction record exists           |
| TC-SQL-005   | Transaction Record  | Verify failed transfer is not saved as completed                 | P0       | SQL / Business Logic  | Failed transaction is not marked as completed |
| TC-SQL-006   | Duplicate Transfer  | Verify duplicate request does not create duplicate records       | P0       | SQL / Business Logic  | Only one transaction record exists            |
| TC-SQL-007   | Account Restriction | Verify suspended account cannot complete transfer                | P0       | SQL / Business Logic  | No completed transfer exists                  |
| TC-SQL-008   | Balance Consistency | Verify UI/API/DB balance consistency                             | P1       | SQL / Data Validation | UI, API, and DB show the same balance         |
| TC-SQL-009   | Order Record        | Verify completed buy order record exists                         | P0       | SQL / Data Validation | Completed order record exists                 |
| TC-SQL-010   | Available Cash      | Verify available cash after completed buy order                  | P0       | SQL / Data Validation | Available cash is decreased correctly         |
| TC-SQL-011   | Holdings            | Verify holding quantity after completed buy order                | P0       | SQL / Data Validation | Holding quantity is increased correctly       |
| TC-SQL-012   | Failed Order        | Verify failed order does not change available cash               | P0       | SQL / Business Logic  | Available cash remains unchanged              |
| TC-SQL-013   | Failed Order        | Verify failed order does not change holdings                     | P0       | SQL / Business Logic  | Holding quantity remains unchanged            |
| TC-SQL-014   | Duplicate Order     | Verify duplicate order request does not create duplicate records | P0       | SQL / Business Logic  | Only one completed order exists               |
| TC-SQL-015   | Order Status        | Verify canceled order is not saved as completed                  | P0       | SQL / Business Logic  | Canceled order status is not completed        |

---

## 15. E2E Automation Candidates

Not all test cases need to be automated.

Automation candidates are selected based on business importance, regression frequency, and stability of the test flow.

| Test Case ID | Scenario                                             | Automation Priority | Reason                                     |
| ------------ | ---------------------------------------------------- | ------------------- | ------------------------------------------ |
| TC-LOGIN-001 | Valid user login                                     | Medium              | Common entry flow                          |
| TC-TRF-001   | Successful transfer                                  | High                | Core money movement flow                   |
| TC-TRF-006   | Transfer exceeding balance                           | High                | Critical negative case                     |
| TC-TRF-007   | Balance unchanged after failed transfer              | High                | Important data consistency check           |
| TC-HIST-001  | Transaction history after transfer                   | High                | Confirms transaction result                |
| TC-DUP-001   | Multiple transfer submit clicks                      | Medium              | Important duplicate request scenario       |
| TC-ORD-002   | Successful buy order                                 | High                | Core investment order flow                 |
| TC-ORD-003   | Available cash decreases after completed buy order   | High                | Important financial data consistency check |
| TC-ORD-004   | Holding quantity increases after completed buy order | High                | Important holdings consistency check       |
| TC-ORD-005   | Buy order exceeding available cash                   | High                | Critical negative case                     |
| TC-ORD-008   | Completed buy order appears in order history         | High                | Confirms order result                      |
| TC-ORD-013   | Duplicate order request prevention                   | Medium              | Important duplicate request scenario       |

---

## 16. Manual Test Candidates

Some scenarios are better suited for manual testing, especially when they involve usability, exploratory testing, or visual confirmation.

| Test Case ID | Scenario                         | Reason for Manual Testing                |
| ------------ | -------------------------------- | ---------------------------------------- |
| TC-LOGIN-003 | Empty field validation           | Simple UI validation                     |
| TC-ACC-003   | KRW display format               | Visual confirmation                      |
| TC-TRF-005   | Transfer confirmation screen     | UI text and layout check                 |
| TC-HIST-006  | Transaction timestamp display    | Visual and format check                  |
| TC-ORD-010   | Latest order appears at the top  | Visual ordering check                    |
| TC-ORD-011   | Pending order cancellation       | May require specific order status setup  |
| TC-ORD-016   | Holdings UI matches API response | Useful for exploratory UI/API comparison |

---

## 17. Traceability Matrix

This matrix connects major risks to related test cases.

| Risk ID | Risk Description                                          | Related Test Cases                               |
| ------- | --------------------------------------------------------- | ------------------------------------------------ |
| R-001   | Balance is not updated correctly after transfer           | TC-TRF-002, TC-TRF-003, TC-SQL-001, TC-SQL-002   |
| R-002   | Transfer succeeds despite insufficient balance            | TC-TRF-006, TC-TRF-007, TC-API-004               |
| R-003   | Same transfer is processed multiple times                 | TC-DUP-001, TC-DUP-002, TC-DUP-003, TC-DUP-004   |
| R-004   | Completed transfer is missing from transaction history    | TC-TRF-004, TC-HIST-001, TC-API-007              |
| R-005   | Failed transfer is recorded as completed                  | TC-TRF-008, TC-HIST-004, TC-SQL-005              |
| R-006   | Error message is unclear or inconsistent                  | TC-LOGIN-002, TC-TRF-009, TC-TRF-010, TC-TRF-013 |
| R-007   | API response body has missing fields                      | TC-API-001, TC-API-003, TC-API-006               |
| R-008   | UI and API data are inconsistent                          | TC-ACC-002, TC-HIST-002, TC-API-007              |
| R-009   | Suspended account can use restricted features             | TC-LOGIN-004, TC-ACC-004, TC-TRF-012             |
| R-010   | Buy order succeeds despite insufficient buying power      | TC-ORD-005, TC-ORD-006, TC-API-010               |
| R-011   | Available cash is not updated after completed buy order   | TC-ORD-003, TC-SQL-010                           |
| R-012   | Holding quantity is not updated after completed buy order | TC-ORD-004, TC-ORD-017, TC-SQL-011               |
| R-013   | Failed order changes cash or holdings                     | TC-ORD-006, TC-ORD-007, TC-SQL-012, TC-SQL-013   |
| R-014   | Completed order is missing from order history             | TC-ORD-008, TC-API-012                           |
| R-015   | Same order is processed multiple times                    | TC-ORD-013, TC-ORD-014, TC-ORD-015, TC-SQL-014   |
| R-016   | Canceled order is shown as completed                      | TC-ORD-011, TC-ORD-012, TC-SQL-015               |

---

## 18. Sample Detailed Test Case

## TC-ORD-005: User attempts to buy more than available cash

| Item         | Description                                            |
| ------------ | ------------------------------------------------------ |
| Test Case ID | TC-ORD-005                                             |
| Feature      | Investment Order                                       |
| Priority     | P0                                                     |
| Test Type    | Negative / Business Logic                              |
| Related Risk | R-010                                                  |
| Precondition | User is logged in with an active account               |
| Test Data    | user_low_balance / ACC-002 / Available Cash: 1,000 KRW |

### Steps

1. Log in as `user_low_balance`.
2. Go to the investment order page.
3. Select stock `MOCK-001`.
4. Enter quantity `1`.
5. Confirm order price `70,000 KRW`.
6. Submit the buy order.

### Expected Result

* Buy order request is rejected.
* Insufficient buying power error message is displayed.
* Available cash remains `1,000 KRW`.
* Holding quantity remains unchanged.
* Order is not recorded as completed.

### Validation Points

* UI shows insufficient buying power message.
* API returns business validation error.
* DB available cash remains unchanged.
* DB holding quantity remains unchanged.
* Order status is not `COMPLETED`.

---

## 19. Summary

This document defines functional, negative, business logic, API, and SQL validation scenarios for the mock financial service.

The project started with account and money movement scenarios and was extended with investment order scenarios to better demonstrate QA thinking for securities service flows.

The main focus is to show how QA can identify high-risk financial service flows and convert them into structured test scenarios that support manual testing, automation testing, API validation, SQL validation, and release decision-making.
