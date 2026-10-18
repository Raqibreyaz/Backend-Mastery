# 06 — Pessimistic Locking: Lock the Row Before Working

Optimistic locking detects conflicts when a user saves. Sometimes, however, the application must **prevent** another transaction from changing a row while a particular operation is in progress.

This is where pessimistic locking is useful.

---

## The Idea

Lock the database row before reading and modifying it.

In PostgreSQL, use:

```sql
SELECT *
FROM accounts
WHERE id = $1
FOR UPDATE;
```

`FOR UPDATE` acquires a row-level lock on the selected row. Competing transactions that need conflicting locks on that row **must wait** until the lock is released.

The lock remains held until the transaction ends.

---

## Example: Protected Read-Decide-Write

```sql
BEGIN;

SELECT balance
FROM accounts
WHERE id = $1
FOR UPDATE;

-- Application checks the balance and decides the operation.

UPDATE accounts
SET balance = balance - 30
WHERE id = $1;

COMMIT;
```

The read, decision, and update happen inside the same transaction while the row is locked. No other transaction can modify that row between the SELECT and the UPDATE.

---

## When to Use It

Use pessimistic locking when the work between reading and writing genuinely **cannot be expressed as a single conditional database statement**.

For example, a complex operation may need to read several values, make a decision based on them, and then update a record.

---

## The Trade-Off

Pessimistic locking prevents conflicting operations from proceeding simultaneously on the locked rows, but it also **makes competing requests wait**.

Long-running transactions can therefore reduce throughput and increase contention.

> Keep transactions short, and avoid slow external calls while holding locks.
