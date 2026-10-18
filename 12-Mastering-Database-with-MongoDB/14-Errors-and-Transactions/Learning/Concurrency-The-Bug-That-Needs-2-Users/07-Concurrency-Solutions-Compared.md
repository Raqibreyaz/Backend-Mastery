# 07 — Concurrency Solutions Compared

## Technique Comparison Table

| Technique           | Core idea                                          | Good use case                                                   |
| ------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| Atomic SQL update   | Perform the calculation inside the database.       | Incrementing counters, deducting stock or balance.              |
| Unique constraint   | Let the database enforce uniqueness.               | Usernames, email addresses, unique identifiers.                 |
| Conditional update  | Update only when a condition is still true.        | Seat booking, inventory, status transitions.                    |
| Optimistic locking  | Update only if the record version has not changed. | Forms and longer edits.                                         |
| Pessimistic locking | Lock rows while performing a multi-step operation. | Operations that require a protected read-decide-write sequence. |

---

## A Practical Decision Flowchart

```
Can the operation be expressed as one SQL statement?
    |
    +-- Yes --> Use an atomic or conditional UPDATE.
    |
    +-- No
         |
         +-- Must detect stale edits (user edited over time)?
         |      |
         |      +-- Yes --> Use optimistic locking (version column).
         |
         +-- Must prevent conflicting work during
                a multi-step transaction?
                |
                +-- Yes --> Consider SELECT ... FOR UPDATE.
```

---

## One More Rule

If the requirement is a **permanent data rule** (e.g. uniqueness), use a **database constraint**. A locking strategy is not a replacement for that constraint — it only affects timing, not enforcement.
