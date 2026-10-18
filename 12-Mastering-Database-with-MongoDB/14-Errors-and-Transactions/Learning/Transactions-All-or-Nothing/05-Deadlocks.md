# 05 — Deadlocks: When Transactions Wait for Each Other

A deadlock occurs when transactions form a cycle of dependencies: each transaction waits for a resource held by another transaction in the cycle.

---

## How a Deadlock Forms

Suppose two transactions update two rows.

```
Transaction A                 Transaction B
-------------                 -------------
Lock row 1                    Lock row 2

Wait for row 2                Wait for row 1
```

The situation becomes:

```
Transaction A
    |
    | waits for row 2
    v
Transaction B
    |
    | waits for row 1
    v
Transaction A
```

Neither transaction can proceed without the other releasing a lock.

The database detects the deadlock and aborts one transaction so that the other can continue.

---

## How to Prevent Deadlocks

The recommended solution is to **acquire locks in a consistent order**.

Instead of updating rows in arbitrary order:

```
Transaction A: row 1 -> row 2
Transaction B: row 2 -> row 1   ← opposing order = deadlock risk
```

Make both transactions use the same order:

```
Transaction A: row 1 -> row 2
Transaction B: row 1 -> row 2   ← consistent order = safe
```

In application logic, **sort the row IDs before acquiring locks** or performing updates that acquire locks.

This avoids the opposing lock order that creates the cycle in this example.

Consistent ordering reduces deadlock risk, although it cannot eliminate every possible deadlock in a complex system.
