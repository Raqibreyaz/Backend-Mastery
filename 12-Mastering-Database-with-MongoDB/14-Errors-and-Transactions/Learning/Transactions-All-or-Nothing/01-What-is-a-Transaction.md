# 01 — What is a Database Transaction?

## Definition

A database transaction is a group of database operations treated as one logical unit of work.

The central idea is simple:

Either every operation succeeds, or none of the changes are kept.

> **Note on READ operations:** Only write operations (INSERT, UPDATE, DELETE) strictly need to be wrapped in a transaction — they are the ones that modify data. A READ operation (SELECT or FIND) does not modify data and does not need to be part of a transaction, although it can be included when you need a consistent snapshot.

---

## The Bank Transfer Problem

Consider transferring ₹500 from Alice's account to Bob's account.

Initially:

```
Alice: ₹2,000
Bob:   ₹1,000
----------------
Total: ₹3,000
```

The transfer requires two operations:

1. Subtract ₹500 from Alice.
2. Add ₹500 to Bob.

After a successful transfer:

```
Alice: ₹1,500
Bob:   ₹1,500
----------------
Total: ₹3,000
```

But imagine the application crashes after subtracting money from Alice and before adding it to Bob.

Without a transaction, the database might end up in this state:

```
Alice: ₹1,500
Bob:   ₹1,000
----------------
Total: ₹2,500
```

The money has disappeared from the application's perspective.

A transaction prevents this half-finished database operation from being committed.

---

## One-Sentence Summary

A database transaction groups multiple operations into one logical unit so that failures do not leave partially committed changes.

---

## Intuition: A Transaction is Like a Sealed Package

Imagine sending a package containing two items that must always arrive together.

- If both items are delivered, the delivery succeeds.
- If one item cannot be delivered, the entire delivery is cancelled.

A transaction follows the same principle.

```
BEGIN
  |
  v
Subtract ₹500 from Alice
  |
  v
Add ₹500 to Bob
  |
  v
COMMIT
```

If any operation fails:

```
BEGIN
  |
  v
Subtract ₹500 from Alice
  |
  v
Add ₹500 to Bob
  |
  v
ERROR
  |
  v
ROLLBACK
  |
  v
Restore the transaction's changes
```

The transaction protects the database from being left in a partially completed state.

---

## The Three Essential Transaction Commands

### `BEGIN`

Starts a transaction.

```sql
BEGIN;
```

The database begins treating subsequent statements as part of the transaction.

### `COMMIT`

Makes the transaction's changes permanent.

```sql
COMMIT;
```

If all required operations succeed, commit the transaction.

### `ROLLBACK`

Cancels the transaction's uncommitted changes.

```sql
ROLLBACK;
```

If an operation fails, rollback prevents the partial changes from being committed.

### Complete SQL Example

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 500
WHERE id = 1;

UPDATE accounts
SET balance = balance + 500
WHERE id = 2;

COMMIT;
```

If the application detects an error before committing, it should execute:

```sql
ROLLBACK;
```

The important distinction is that `COMMIT` and `ROLLBACK` are alternative outcomes for the transaction.

```
                BEGIN
                  |
                  v
             SQL operations
                  |
          +-------+-------+
          |               |
       Success           Error
          |               |
          v               v
       COMMIT           ROLLBACK
          |               |
          v               v
    Keep changes     Discard changes
```

---

## How Transactions Work: 4-Step Flow

1. A transaction starts when an INSERT, UPDATE, or DELETE operation is initiated.
2. All operations inside the transaction are executed.
3. If all operations succeed, the transaction is **committed**.
4. If any operation fails, the transaction is **rolled back**, and no changes are applied.
