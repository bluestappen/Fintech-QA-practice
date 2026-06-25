# Mock Fintech App

## Overview

This directory defines the mock fintech service used as the test target for the Fintech QA Practice Portfolio.

This is not a real banking application.
It is a simplified fictional service created only for QA practice.

The purpose of this mock app is to provide a clear requirement baseline for:

* Test planning
* Test scenario design
* Business logic QA
* Bug report writing
* SQL validation examples
* Playwright E2E testing
* API testing practice

---

## Why This Mock App Exists

A QA portfolio needs a test target.

However, this project does not use a real company service, real banking data, or confidential business logic.

Therefore, this mock app is used to define a fictional fintech service with simple banking features.

The goal is not to build a production-level application.
The goal is to create enough service context to demonstrate QA thinking.

---

## Mock Service Features

The mock fintech service includes the following features:

* User login
* Account balance inquiry
* Money transfer
* Transfer failure handling
* Duplicate transfer prevention
* Transaction history inquiry
* Account status validation

---

## Main User Flow

The basic user flow is:

```text
Login
↓
View account balance
↓
Enter receiver account and transfer amount
↓
Submit transfer request
↓
Check transfer result
↓
Verify updated balance and transaction history
```

---

## Mock Test Accounts

| User ID          | Account ID | Account Status | Initial Balance | Purpose                       |
| ---------------- | ---------- | -------------- | --------------: | ----------------------------- |
| user_standard    | ACC-001    | ACTIVE         |     100,000 KRW | Normal transfer scenario      |
| user_low_balance | ACC-002    | ACTIVE         |       1,000 KRW | Insufficient balance scenario |
| user_suspended   | ACC-003    | SUSPENDED      |     100,000 KRW | Account restriction scenario  |
| user_receiver    | ACC-004    | ACTIVE         |      50,000 KRW | Receiver account              |

---

## Key Business Rules

| Rule ID | Business Rule                                                |
| ------- | ------------------------------------------------------------ |
| BR-001  | Transfer amount must not exceed available balance            |
| BR-002  | Sender balance must decrease after successful transfer       |
| BR-003  | Receiver balance must increase after successful transfer     |
| BR-004  | Failed transfer must not change account balance              |
| BR-005  | Failed transfer must not be recorded as completed            |
| BR-006  | Duplicate transfer request must not be processed twice       |
| BR-007  | Suspended account must not be allowed to transfer money      |
| BR-008  | Transaction history must match the actual transaction result |

---

## How This Mock App Supports QA

This mock app provides the basis for QA deliverables.

| QA Activity         | How the Mock App Is Used                    |
| ------------------- | ------------------------------------------- |
| Test Plan           | Defines what should be tested               |
| Test Scenario       | Provides service flows and expected results |
| Business Logic QA   | Provides financial rules to validate        |
| Bug Reports         | Provides realistic defect examples          |
| SQL Validation      | Provides mock data consistency checks       |
| Playwright E2E Test | Provides user flows to automate             |
| API Test            | Provides mock API behavior to validate      |

---

## Implementation Approach

This project does not aim to build a full fintech application.

The mock app can be implemented in a very simple way only for testing practice.

Possible implementation options:

| Option             | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| Documentation only | Define requirements and QA scenarios without executable app |
| Static mock UI     | Simple HTML pages for Playwright E2E practice               |
| Simple local app   | Minimal frontend with mock data                             |
| Mock API           | Simple API responses for API testing practice               |

For this portfolio, the recommended approach is:

1. Define requirements first
2. Create QA documents
3. Add a simple mock UI for Playwright practice
4. Add mock API tests
5. Connect tests to GitHub Actions

---

## Out of Scope

This mock app does not include:

* Real banking integration
* Real authentication
* Real customer data
* Real payment network
* Real database connection
* Security certification
* Production monitoring
* Complex financial product logic

---

## Related Documents

| Document                                             | Description                                |
| ---------------------------------------------------- | ------------------------------------------ |
| [Mock Requirements](requirements.md)                 | Defines detailed mock service requirements |
| [Test Plan](../docs/01-test-plan.md)                 | Defines QA strategy and test scope         |
| [Test Scenarios](../docs/02-test-scenarios.md)       | Defines detailed test cases                |
| [Business Logic QA](../docs/03-business-logic-qa.md) | Defines business rule validation           |
| [Bug Reports](../docs/04-bug-reports.md)             | Provides sample defect reports             |
| [SQL Validation](../docs/05-sql-validation.md)       | Provides backend validation examples       |

---

## Summary

The mock fintech app is a fictional test target for QA practice.

It exists to make the portfolio realistic enough to demonstrate QA thinking, while clearly avoiding any claim that this is a real company project.

The focus of this mock app is not product development, but quality assurance practice.
