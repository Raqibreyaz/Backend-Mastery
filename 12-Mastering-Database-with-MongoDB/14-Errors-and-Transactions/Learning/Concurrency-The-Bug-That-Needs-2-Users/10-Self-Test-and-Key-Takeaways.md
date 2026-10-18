# 10 — Self-Test and Key Takeaways

---

## Common Mistakes and Gotchas

### Mistake 1: Assuming unit tests will reveal every race

A unit test that calls one request at a time may never create the overlapping execution needed for a lost update.

**Better approach:** Test concurrent requests and verify the final state.

### Mistake 2: Assuming transactions automatically solve every race

Transactions provide important guarantees, but the outcome still depends on the isolation level and how queries are written.

**Better approach:** Use atomic updates, database constraints, conditional updates, version checks, or row locks according to the business rule.

### Mistake 3: Checking a condition in JavaScript and trusting it later

A value can change after the application reads it.

**Better approach:** Put the condition into the database update or enforce it with a constraint.

### Mistake 4: Treating a successful HTTP response as proof of correctness

Two requests can return success while one silently overwrites the other's change.

**Better approach:** Assert the expected database state after concurrent operations.

### Mistake 5: Holding row locks for too long

Long transactions make competing requests wait and increase the risk of deadlocks or timeouts.

**Better approach:** Keep locked sections short and avoid unrelated work inside them.

### Mistake 6: Forgetting to increment the version

If optimistic locking checks a version but never changes it after a successful save, later updates may not detect conflicts properly.

**Better approach:** Increment the version as part of the same atomic update.

### Mistake 7: Treating zero updated rows as one specific error

For a conditional update, zero rows may mean the record does not exist, the condition is false, or the version is stale.

**Better approach:** Decide what each result means for your API and use additional checks if the application must distinguish those cases.

---

## Key Takeaways

- Concurrency bugs occur when overlapping operations interact with shared data.
- A lost update happens when one request overwrites another request's change.
- Read-modify-write code is dangerous when the read and write are separate operations.
- Atomic SQL updates allow the database to calculate changes safely.
- Check-then-act code has a race window between the check and the action.
- Unique constraints enforce data rules even when requests run concurrently.
- Conditional updates combine a condition and a modification into one database operation.
- Optimistic locking detects stale edits using a version number.
- Pessimistic locking protects rows during a multi-step transaction, but it makes competing operations wait.
- `Promise.all` and concurrent HTTP requests help test races, but deterministic synchronization may be needed to reproduce them reliably.
- Always verify the final database state, not just the HTTP responses.
- In real applications, conflict detection and updates must be atomic at the database level.

---

## Minimal Self-Test

Try answering these without looking back.

1. Why can a sequential unit test fail to reveal a lost update?
2. Two requests read a balance of ₹100 and both subtract ₹30 in application code. Why might the final balance be ₹70 instead of ₹40?
3. Why is `SELECT` followed by `INSERT` not enough to guarantee a unique username?
4. What does it mean when a conditional `UPDATE` affects zero rows?
5. How does a version column help detect conflicting edits?
6. What is the difference between optimistic locking and pessimistic locking?
7. Why should a transaction that uses `SELECT ... FOR UPDATE` be kept short?
8. Why is `Promise.all` useful for concurrency testing, and why might it not reproduce a race every time?
9. Where should a rule such as "a username must be unique" be enforced?
10. Why is an in-memory implementation of optimistic locking not sufficient for a multi-request database application?

---

## What to Learn Next

1. **Database transactions and isolation levels** — understand atomicity, isolation, row locks, and the guarantees each isolation level provides.
2. **PostgreSQL MVCC** — learn how PostgreSQL handles concurrent reads and writes using multiversion concurrency control.
3. **Deadlocks and lock ordering** — understand why transactions can wait on each other and how to reduce the risk.
4. **Idempotency** — make repeated requests safe, especially for payments and retryable operations.
5. **Database constraints and indexes** — learn how the database enforces correctness and how constraints interact with query execution.
