# Testing a Backend

## What it is

Backend testing is not mainly about achieving a high **code coverage percentage**.

The real goal is:

> **You should be able to change the code and quickly find out whether you broke something.**

A test suite that does not give you that confidence becomes a maintenance cost, even if every test is green. 

---

## One-sentence summary

**Write tests around the behavior you promise, use a real database, mock external systems you do not control, test failures heavily, keep tests independent, control time explicitly, and use a sensible test pyramid.**

---

# Intuition

Imagine you are changing a backend tomorrow.

You want this workflow:

```text
Change code
    ↓
Run tests
    ↓
Tests fail?
   / \
 Yes  No
  ↓    ↓
You    Safe enough
found   to continue
a bug
```

The value of testing is therefore not:

```text
"I have 90% coverage."
```

It is:

```text
"I can make changes and quickly discover
whether I broke important behavior."
```

This distinction is the foundation of the lesson. 

---

# 1. What Should You Test?

## Test the boundary you promise

For a backend, the main public boundary is usually the **API**.

For example:

```text
Client
  ↓
POST /orders
  ↓
Backend
  ↓
Response
```

Test what the client can actually observe:

```text
Request
   ↓
Endpoint
   ↓
Status code
   +
Response body
```

Example:

```text
POST /orders
```

with a valid request should produce:

```text
201 Created
```

and the expected response body.

---

## Why test the API boundary?

Because API-level tests do not care about your internal implementation.

Suppose the code starts as:

```text
Route
  ↓
validateOrder()
  ↓
createOrder()
  ↓
saveOrder()
```

Later you refactor it:

```text
Route
  ↓
processOrder()
  ↓
saveOrder()
```

The API behavior can remain exactly the same.

A boundary test still passes because it only cares about:

```text
Input → Observable output
```

It does not care about the internal functions.

---

# 2. Avoid Testing Internal Implementation Details

A weak test might say:

```javascript
expect(validateOrder).toHaveBeenCalledTimes(1);
```

This test is coupled to the implementation.

If you refactor the code so that validation happens through another function, the test breaks even though the API still works correctly.

The lesson points out that tests asserting which internal function was called:

* break during harmless refactoring
* do not necessarily find real bugs

Instead, test behavior.

### Better

```text
POST /orders
with missing "price"
        ↓
400 Bad Request
```

This test survives many internal refactors.

### Mental model

```text
Bad test:
"Did the code use THIS implementation?"

Good test:
"Did the system produce the promised behavior?"
```

---

# 3. Use a Real Database in Tests

This is one of the strongest points in the lesson.

The recommendation is:

> **Use a real database in tests.** 

It can be tempting to mock the database:

```text
Application
    ↓
Fake database
```

But this removes the exact behavior that can surprise you.

---

## What does a real database test?

A real database can expose problems involving:

* constraints
* transactions
* data types
* `NULL` behavior
* actual database semantics

A mock can easily pretend everything works.

For example:

```javascript
db.insert.mockResolvedValue({
    id: 123
});
```

This tells you almost nothing about whether the real database accepts the operation.

The real database might reject it because:

```text
UNIQUE constraint
      ↓
duplicate email
      ↓
database error
```

A mock may never reveal that.

---

# 4. Why Database Mocks Can Hide Bugs

Imagine your table has:

```sql
email VARCHAR UNIQUE NOT NULL
```

Your application test mocks:

```javascript
db.users.insert.mockResolvedValue(user);
```

The test passes twice:

```text
Insert Alice
   ↓
PASS

Insert Alice again
   ↓
PASS
```

But the real database might do:

```text
Insert Alice
   ↓
PASS

Insert Alice again
   ↓
UNIQUE constraint violation
```

The database contains important behavior.

Mocking it away means your test may pass while production fails.

---

# 5. Is a Real Database Too Expensive?

The source's answer is essentially **no**.

A container or dedicated test schema can provide a real database environment.

The cost may be a few extra seconds, but you test the thing that actually runs in production. 

A useful setup is:

```text
Test suite
    ↓
Test database
    ↓
Run test
    ↓
Clean database state
```

---

# 6. Keep Database Tests Isolated

Tests should not accidentally depend on data created by other tests.

For example:

```text
Test A:
create user Alice

Test B:
find Alice
```

If Test B depends on Test A, you have a problem.

What happens if someone runs Test B alone?

```text
Test B
 ↓
Alice does not exist
 ↓
FAIL
```

The source warns that tests sharing state can fail depending on their execution order. 

That makes failures extremely difficult to diagnose.

---

## Clean the database after each test

The source suggests:

* rolling back after each test, or
* truncating the relevant data

Conceptually:

```text
Before test
    ↓
Clean database
    ↓
Run test
    ↓
Rollback / truncate
    ↓
Clean database
    ↓
Next test
```

This gives each test a predictable starting point.

---

# 7. Mock What You Do Not Control

There is an important distinction:

```text
Database
    ↓
You control it
    ↓
Prefer real database
```

versus:

```text
Payment provider
    ↓
Third-party system
    ↓
You do not control it
    ↓
Mock it
```

The lesson recommends mocking external systems at the **network boundary**. 

---

# 8. Why Mock Third-Party APIs?

Suppose your backend calls a payment provider.

If every test calls the real service:

```text
Your test
   ↓
Internet
   ↓
Payment API
   ↓
Response
```

Tests can become:

* slow
* flaky
* dependent on network availability
* dependent on third-party behavior
* potentially billable

So instead:

```text
Your test
   ↓
Network boundary
   ↓
Mock payment API
   ↓
Controlled response
```

Now you can deliberately test different responses.

---

# 9. Mock More Than Just Success

A common mistake is mocking only:

```text
200 OK
```

But production problems often happen when external services fail.

Test:

```text
Success
   ↓
200

Timeout
   ↓
Request takes too long

Server error
   ↓
500
```

The lesson specifically calls out testing the **timeout and 500** from the third-party service because those are exactly the situations your application needs to handle. 

Example:

```text
Payment API
   ↓
500
   ↓
Your backend
   ↓
Correctly handles failure
```

The test should verify **your handling**, not whether the third-party service actually produces a `500`.

---

# 10. Test Failures, Not Just the Happy Path

This is one of the most important testing principles in the lesson.

The happy path is:

```text
Valid input
    ↓
Expected processing
    ↓
Success
```

That path is important.

But it is usually the easiest path.

The lesson says:

> Test the failures, because the happy path was going to work anyway. 

---

# 11. Important Failure Cases

The source specifically gives examples such as:

### Missing field

```json
{
  "name": "Alice"
}
```

when `email` is required.

Test:

```text
POST /users
   ↓
missing email
   ↓
400 Bad Request
```

---

### Wrong type

For example:

```json
{
  "age": "twenty"
}
```

when the API expects a number.

---

### Missing authentication

```text
Request
   ↓
No authentication
   ↓
401 Unauthorized
```

---

### Another user's ID

Suppose Alice tries to access Bob's resource:

```text
Alice
  ↓
GET /users/bob-id
  ↓
Should not receive Bob's private data
```

This tests authorization behavior.

---

### Same request twice

For example:

```text
Create order
    ↓
Request succeeds

Create same order again
    ↓
What should happen?
```

This tests behavior around duplicate requests/idempotency.

---

### Boundary values

Test values near important limits.

For example, if the API accepts:

```text
amount >= 0
```

test:

```text
-1
0
1
```

The boundary is often where bugs hide.

---

# 12. Why Failure Tests Are So Valuable

Imagine an API accepts:

```text
age: 0–120
```

Testing only:

```text
age = 25
```

doesn't tell you whether validation works.

Better:

```text
age = -1
age = 0
age = 1
age = 120
age = 121
```

Now you are testing the actual rule.

The lesson's failure-test list is essentially a checklist of places where real bugs can occur:

```text
Missing data
Wrong data type
Authentication
Authorization
Duplicates
Boundary values
External failures
```

---

# 13. Fix Bugs With a Test First

When you find a bug, do not immediately change the code.

First write a test that reproduces the bug.

The workflow is:

```text
Bug discovered
      ↓
Write failing test
      ↓
Understand the cause
      ↓
Fix the code
      ↓
Test passes
```

This is often called a **regression test** because it prevents the same bug from returning later.

---

## Why write the test first?

Suppose the bug is:

```text
User submits duplicate order
      ↓
Two orders are created
```

First write:

```text
Create order with key X
Create order with key X again
      ↓
Only one order should exist
```

Initially:

```text
FAIL
```

Then fix the implementation.

Now:

```text
PASS
```

You have evidence that the specific bug was actually addressed.

---

# 14. The Test Proves You Understood the Bug

Without a failing test, you might accidentally move the problem.

For example:

```text
Bug
 ↓
Change code
 ↓
Current example works
 ↓
Original bug still exists in another path
```

A test captures the exact behavior that was broken.

The lesson says this proves you understood the cause rather than simply moving it, and prevents the bug from returning during a future refactor. 

---

# 15. Tests Must Be Independent

A good test should be able to run by itself.

Bad:

```text
Test 1
 ↓
creates user

Test 2
 ↓
expects user from Test 1

Test 3
 ↓
expects state from Test 2
```

Now execution order matters.

Better:

```text
Test 1
 ↓
sets up its own state
 ↓
runs
 ↓
cleans up

Test 2
 ↓
sets up its own state
 ↓
runs
 ↓
cleans up
```

This makes tests predictable.

---

# 16. Shared State Creates Difficult Failures

Imagine:

```text
Test A → creates record 1
Test B → expects record 1
```

If Test A runs after Test B:

```text
Test B
 ↓
record 1 missing
 ↓
FAIL
```

Now the test suite behaves differently depending on order.

That is a terrible debugging experience.

The lesson describes these failures as particularly miserable to chase. 

---

# 17. Time Is Also Shared State

Time can secretly make tests dependent on external state.

Consider:

```javascript
const now = new Date();
```

This value changes every time the test runs.

So the test may behave differently depending on:

* the exact time
* midnight
* the end of a month
* daylight-saving changes
* timezone

The source specifically warns about these situations. 

---

# 18. Inject Time Instead

Instead of:

```javascript
function isExpired(token) {
    return token.expiresAt < new Date();
}
```

use:

```javascript
function isExpired(token, now) {
    return token.expiresAt <= now;
}
```

Now the test controls time:

```javascript
const now = new Date("2026-01-01T12:00:00Z");

const token = {
    expiresAt: new Date("2026-01-01T11:00:00Z")
};

isExpired(token, now);
```

The result is deterministic.

---

# 19. The Exercise: `isExpired(token, now)`

The lesson gives a concrete exercise.

The function should:

```text
isExpired(token, now)
```

Return:

```text
true
```

when:

1. `token.expiresAt` is **at or before** `now`
2. the token is missing
3. the token has no `expiresAt`

Otherwise return:

```text
false
```

The important contract is:

```text
expiresAt <= now
       ↓
     expired
```

Notice the word **at**.

If:

```text
expiresAt === now
```

the token is expired.

So use:

```javascript
token.expiresAt <= now
```

not:

```javascript
token.expiresAt < now
```

---

## Why the provided implementation is wrong

The exercise starts with:

```javascript
function isExpired(token, now) {
  // Use the now you were given. Never Date.now() here.
  return token.expiresAt < Date.now();
}
```

There are multiple problems.

### Problem 1: It ignores `now`

The function receives:

```javascript
now
```

but uses:

```javascript
Date.now()
```

That makes the function depend on the actual system clock.

The exercise explicitly says:

```text
Use the now you were given.
Never Date.now() here.
```

---

### Problem 2: It uses `<` instead of `<=`

The requirement says:

```text
expiresAt is at or before now
```

Therefore:

```javascript
expiresAt <= now
```

is required.

---

### Problem 3: Missing token must return `true`

The requirement says:

```text
missing token → true
```

The provided implementation would attempt:

```javascript
token.expiresAt
```

and fail if `token` is missing.

---

### Problem 4: Missing `expiresAt` must return `true`

An unknown expiry must **not** count as valid.

So:

```text
token exists
but expiresAt missing
        ↓
true
```

---

## Correct behavior

The source gives the exercise requirements, but the visible page does not provide the solution code. Based strictly on those requirements, the logic should be equivalent to:

```javascript
function isExpired(token, now) {
    if (!token || !token.expiresAt) {
        return true;
    }

    return token.expiresAt <= now;
}
```

The important design lesson is not just this function. It is **dependency injection for time**:

```text
Don't:
function something() {
    Date.now()
}

Prefer:
function something(now) {
    // use now
}
```

That makes tests deterministic. 

---

# 20. The Test Pyramid

The lesson recommends a practical test pyramid.

Think of tests as layers:

```text
             /\
            /  \
           / E2E\
          /------\
         / Endpoint\
        /   Tests   \
       /-------------\
      / Logic / Unit  \
     /-----------------\
```

The recommended distribution is:

```text
Many
 ↓
Small logic tests

Fewer
 ↓
Whole-endpoint tests

Very few
 ↓
End-to-end tests
```

---

# 21. Many Small Tests for Logic

Test logic such as:

* validation
* permission rules
* price calculation

These tests should be fast and focused.

Example:

```javascript
calculatePrice(items)
```

You can test:

```text
1 item
multiple items
zero items
discount
invalid quantity
boundary price
```

If one fails, you immediately know which logic is broken.

---

# 22. Fewer Whole-Endpoint Tests

Endpoint tests test the wiring between components.

For example:

```text
HTTP request
    ↓
Router
    ↓
Authentication
    ↓
Validation
    ↓
Business logic
    ↓
Database
    ↓
HTTP response
```

These tests are slower than small logic tests.

But they verify that the pieces actually work together.

Example:

```text
POST /orders
   ↓
201 Created
```

or:

```text
POST /orders
missing amount
   ↓
400 Bad Request
```

---

# 23. Very Few End-to-End Tests

End-to-end tests exercise a large part of the system.

Conceptually:

```text
Real client
   ↓
Real HTTP server
   ↓
Real backend
   ↓
Real database
   ↓
External systems / infrastructure
```

These tests can be valuable, but they are usually:

* slower
* more brittle
* harder to debug

Therefore the lesson recommends having **very few** of them. 

---

# 24. What Happens If You Invert the Pyramid?

Suppose you build:

```text
Very few unit tests
Some endpoint tests
Many E2E tests
```

Now your suite may:

* take a long time
* fail for infrastructure reasons
* be difficult to debug
* become unreliable

Eventually developers stop trusting the test suite.

Then you get the dangerous situation:

```text
Tests fail
   ↓
"Probably flaky"
   ↓
Ignore them
```

Or:

```text
Tests pass
   ↓
Green badge
   ↓
Everyone assumes system is safe
```

The lesson's warning is that a poorly designed suite can take around twenty minutes and fail for reasons nobody can reproduce. Once people stop trusting it, the green badge becomes almost meaningless. 

---

# 25. Why Test Speed Matters

Fast tests encourage frequent execution:

```text
Change code
 ↓
Run tests
 ↓
Get feedback quickly
 ↓
Fix problem
```

Slow tests create friction:

```text
Change code
 ↓
Start 20-minute suite
 ↓
Wait
 ↓
Context switching
 ↓
Maybe ignore test results
```

So the pyramid is not just about theory.

It is about making testing practical during development.

---

# 26. What to Mock vs What to Keep Real

This is a key comparison.

| Dependency                         | Recommended approach | Why                       |
| ---------------------------------- | -------------------- | ------------------------- |
| Your business logic                | Test directly        | Fast and precise          |
| API boundary                       | Test real endpoint   | Tests public contract     |
| Database                           | Use real database    | Captures real DB behavior |
| Third-party payment API            | Mock                 | You don't control it      |
| Network calls to external services | Mock at boundary     | Fast and deterministic    |
| System clock                       | Inject `now`         | Makes tests deterministic |

The core rule is:

```text
What you control
      ↓
Prefer testing the real thing

What you don't control
      ↓
Mock it at the boundary
```

The source specifically emphasizes real databases and mocked third-party APIs. 

---

# 27. A Practical Backend Testing Flow

A good backend test strategy can look like this:

```text
                    TEST SUITE
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ↓             ↓             ↓
       Logic        Endpoints        E2E
       tests          tests          tests
          │             │             │
       Many            Fewer         Very few
          │             │             │
       Fast           Slower        Slowest
          │             │             │
          └─────────────┼─────────────┘
                        ↓
                 Fast feedback
```

For dependencies:

```text
                 BACKEND TEST
                      │
        ┌─────────────┴─────────────┐
        │                           │
   Your systems                External systems
        │                           │
        ↓                           ↓
  Real database                Mock API
        │                           │
        ↓                           ↓
 Test real behavior           Test your handling
```

---

# Common Mistakes / Gotchas

## 1. Chasing coverage instead of confidence

```text
90% coverage
```

does not automatically mean:

```text
90% of important behavior is protected
```

The goal is fast detection of regressions.

---

## 2. Testing implementation details

Bad:

```javascript
expect(validateOrder).toHaveBeenCalled();
```

Better:

```text
POST /orders with invalid data
        ↓
400
```

Test what users of the API depend on.

---

## 3. Mocking the database

This can hide:

* constraints
* transactions
* types
* `NULL` behavior
* real database failures

Use a real database for tests when possible.

---

## 4. Letting tests share database state

Bad:

```text
Test B depends on data created by Test A.
```

Tests should clean up through rollback or truncation.

---

## 5. Calling real third-party services

This can cause:

```text
slow tests
flaky tests
network failures
unexpected billing
```

Mock them at the network boundary.

---

## 6. Testing only success

A suite that only tests:

```text
200 OK
```

misses many important failures.

Test:

```text
missing fields
wrong types
authentication
authorization
duplicates
boundaries
timeouts
500 responses
```

---

## 7. Using the real clock

Avoid:

```javascript
new Date()
Date.now()
```

inside logic that needs deterministic tests.

Inject the time instead.

---

## 8. Using `<` when the rule says "at or before"

If:

```text
expiresAt <= now
```

means expired, then:

```javascript
expiresAt < now
```

is wrong for the equality case.

---

## 9. Writing a bug fix without a regression test

Without a test, the same bug can return during a later refactor.

Use:

```text
Bug
 ↓
Failing test
 ↓
Fix
 ↓
Passing test
```

---

## 10. Too many E2E tests

E2E tests are useful, but a suite dominated by them becomes slow and brittle.

Keep the majority of tests lower in the pyramid.

---

# Comparison: Different Test Levels

| Test type            | What it tests                    |  Speed | Quantity |
| -------------------- | -------------------------------- | -----: | -------: |
| Logic/unit           | Small pieces of logic            |   Fast |     Many |
| Endpoint/integration | Whole API endpoint and wiring    | Medium |    Fewer |
| End-to-end           | Large portion of complete system |   Slow | Very few |

The important pattern is:

```text
Many fast tests
        ↓
Fewer integration tests
        ↓
Very few E2E tests
```

---

# Key Mental Models

### Model 1: Test behavior, not implementation

```text
Implementation
    ↓
Can change

Public behavior
    ↓
Should remain correct
```

So tests should generally target the second.

---

### Model 2: Real things you control, fake things you don't

```text
Database
   ↓
Real

Third-party API
   ↓
Mock
```

---

### Model 3: Make time a dependency

```text
Bad:
code → system clock

Better:
code ← now
```

Now tests decide what time it is.

---

### Model 4: Bugs become tests

```text
Bug
 ↓
Regression test
 ↓
Fix
 ↓
Permanent protection
```

---

### Model 5: Pyramid = fast feedback

```text
        Few E2E
          /\
         /  \
      Endpoint
       tests
      /------\
    Many logic
      tests
```

The bottom is large because those tests are fast and precise.

---

# Key Takeaways

* The goal of testing is **fast feedback when code changes**, not a coverage number.
* Test the **boundary you promise**, especially the API contract.
* Avoid tests that depend heavily on internal implementation details.
* Use a **real database** so tests see constraints, transactions, types, and `NULL` behavior.
* Clean database state between tests using rollback or truncation.
* Mock systems you **do not control**, especially third-party network APIs.
* Test external-service failures such as **timeouts and `500` responses**.
* Failure cases often provide more useful protection than simple happy-path tests.
* Test missing fields, wrong types, authentication, authorization, duplicates, and boundary values.
* When fixing a bug, **write the failing test first**.
* Tests should be independent and runnable in any order.
* Do not let tests depend on the real clock.
* Inject time through parameters such as `now`.
* For expiration rules, carefully distinguish `<` from `<=`.
* Use the practical test pyramid:

  * many small logic tests
  * fewer endpoint tests
  * very few end-to-end tests
* A test suite that is slow, flaky, or constantly fails for irrelevant reasons eventually loses developer trust.

---

# Minimal Self-Test

### 1. Why is mocking your database usually a bad trade?

**Answer:** Because you are mocking away behavior that can surprise you, including database constraints, transactions, types, and `NULL` semantics.

---

### 2. When can a test using `new Date()` become unreliable?

**Answer:** Around midnight, month boundaries, daylight-saving changes, or when running in another timezone.

---

### 3. Which test is more tightly coupled to implementation?

```javascript
expect(validateOrder).toHaveBeenCalledTimes(1);
```

or:

```text
POST /orders with missing field → 400
```

**Answer:** The first one. It checks an internal implementation detail rather than the public behavior.

---

### 4. What should you do when you discover a bug?

```text
Write failing test
       ↓
Fix bug
       ↓
Test passes
```

---

### 5. What belongs at the bottom of the test pyramid?

**Answer:** Many small, fast tests for logic such as validation, permission rules, and price calculation.

---

### 6. What belongs at the top?

**Answer:** Very few end-to-end tests because they are slower and more brittle.

---

# What to Learn Next

The source points to:

1. **Node.js Test Runner** — for writing and running tests.
2. **Practical Test Pyramid** by Martin Fowler — for understanding test-level trade-offs. 

A particularly useful next concept is **integration testing**, because it connects the lesson's ideas about API boundaries, real databases, mocks, and test isolation.