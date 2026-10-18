# 09 — Self-Test and Key Takeaways

---

## Check Yourself

Use these questions to test your understanding.

1. Why should an external HTTP call not happen inside a transaction?
2. Two transactions deadlock. What is the standard prevention strategy?
3. If you raise isolation to `Serializable`, what must your application be prepared to handle?

### Answers

1. A transaction may hold locks while waiting for the HTTP call, causing other writers to wait.
2. Acquire locks in a consistent order, such as sorting row IDs before updating them.
3. Serialization failures that require retrying the transaction when appropriate.

---

## Key Takeaways

- A transaction groups database operations into one logical unit.
- Atomicity means all changes are committed together or none are committed.
- `BEGIN` starts a transaction, `COMMIT` commits it, and `ROLLBACK` cancels uncommitted changes.
- Only write operations (INSERT, UPDATE, DELETE) need to be wrapped in a transaction; READ operations do not modify data.
- ACID stands for Atomicity, Consistency, Isolation, and Durability.
- PostgreSQL's default isolation level is `Read Committed`.
- Under `Read Committed`, two reads in one transaction can observe different committed values.
- `Repeatable Read` provides a stable snapshot, but does not guarantee full serializability.
- `Serializable` can reject transactions that must be retried.
- Keep transactions short and avoid slow external network calls while holding locks.
- Acquire locks in a consistent order to reduce deadlocks.
- Transactions do not automatically prevent lost updates.
- Ensure failures trigger rollback and that connections are cleaned up correctly.
- In application code, use transaction helpers or careful error handling rather than leaving a transaction open after an exception.
- A simulated in-memory rollback must account for the depth and mutability of the state being changed.

---

## What to Learn Next

The next logical topic is **Concurrency: the bug that needs two users**.

It builds directly on transactions and explores lost updates, race conditions, atomic SQL operations, row-level locks, and how to keep concurrent requests from violating business rules.
