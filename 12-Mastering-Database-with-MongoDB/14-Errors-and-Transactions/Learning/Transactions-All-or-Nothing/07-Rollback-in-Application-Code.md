# 07 — Rollback in Application Code

Opening a transaction is only half the job. Your application must handle failures correctly.

---

## The Unsafe Pattern

```js
async function transfer(db) {
  await db.beginTransaction();

  await db.query(
    "UPDATE accounts SET balance = balance - 500 WHERE id = 1"
  );

  await db.query(
    "UPDATE accounts SET balance = balance + 500 WHERE id = 2"
  );

  await db.commit();
}
```

What happens if the second query throws an exception?

If the code does not handle the failure, the transaction may remain open until it is rolled back, the connection is closed, or a timeout occurs.

An open transaction can continue holding locks and interfere with other requests.

---

## A Safer Transaction Structure

```js
async function transfer(db) {
  await db.beginTransaction();

  try {
    await db.query(
      "UPDATE accounts SET balance = balance - 500 WHERE id = 1"
    );

    await db.query(
      "UPDATE accounts SET balance = balance + 500 WHERE id = 2"
    );

    await db.commit();
  } catch (error) {
    await db.rollback();
    throw error;
  }
}
```

The intended control flow is:

```
BEGIN
  |
  v
Execute operations
  |
  +---- Success ----> COMMIT
  |
  +---- Failure ----> ROLLBACK
                       |
                       v
                  Propagate error
```

This is better than allowing an exception to escape without transaction cleanup.

---

## What About `try/finally`?

A `finally` block always runs when control leaves the associated `try` statement, whether it exits normally or through an exception.

However, a `finally` block should **not** blindly roll back a transaction that has already committed. Track the transaction state, or use a transaction helper that correctly manages commit, rollback, and connection cleanup.

Also, if rollback itself fails, preserve the original error and ensure the connection is not incorrectly reused.

---

## Production Guidance

> In production, prefer the transaction API provided by your database driver or ORM when it correctly guarantees cleanup.

Use transaction helpers or careful error handling rather than leaving a transaction open after an exception.
