# 06 — Lost Updates: Transactions Don't Prevent Everything

A transaction is not a lock on the entire database.

---

## The Lost Update Problem

Consider two transactions that both read the same account balance.

Initially:

```
Balance = ₹100
```

Both transactions intend to subtract ₹30.

```
Transaction A                 Transaction B
-------------                 -------------
Read ₹100                     Read ₹100

Compute ₹70                   Compute ₹70

Write ₹70                     Write ₹70
```

The final balance becomes:

```
₹70
```

But the expected balance is:

```
₹100 - ₹30 - ₹30 = ₹40
```

One update has overwritten the other. This is called a **lost update**.

---

## Why It Happens

Under `Read Committed`, this can occur when the application reads a value, computes a new value outside the database, and later writes that value without protecting against concurrent modifications.

Each transaction may have used committed data, and each may have executed successfully. Yet the business operation is incorrect.

---

## Key Insight

> **Transactions alone do not prevent every concurrency bug.**

Possible solutions include:

- **Atomic SQL updates** — let the database compute the new value: `SET balance = balance - 30`
- **Row-level locking** — `SELECT ... FOR UPDATE`
- **Optimistic concurrency checks** — version/timestamp columns
- **Stronger isolation** — Repeatable Read or Serializable where appropriate

These are covered by the broader topic of concurrency and race conditions.
