# 04 — Keep Transactions Short

A transaction can hold database locks while it runs. Other transactions may need those same locks before they can proceed.

---

## The Problem: External Calls Inside a Transaction

Consider this application code:

```js
await db.beginTransaction();

await db.query(
  "UPDATE accounts SET balance = balance - 500 WHERE id = 1"
);

await fetch("https://external-service.example/api");

await db.query(
  "UPDATE accounts SET balance = balance + 500 WHERE id = 2"
);

await db.commit();
```

The problem is the external HTTP call inside the transaction.

What if the external service takes five seconds to respond?

```
BEGIN
  |
  v
Update account
  |
  v
Wait for HTTP response
  |
  |  Transaction remains open
  |  Locks may remain held
  |
  v
Update second account
  |
  v
COMMIT
```

During that wait, other database operations may be blocked by locks held by the transaction.

If the HTTP request hangs, the transaction may remain open for a long time, causing a growing queue of waiting transactions.

---

## Better Approach: Move External Work Outside

Perform external work before opening the transaction when possible:

```js
const response = await fetch(
  "https://external-service.example/api"
);

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
```

This keeps the transaction focused on database operations.

However, there is an important distinction: moving an HTTP request outside a transaction does not make the HTTP operation atomic with the database transaction. If the external operation must succeed or fail together with a database update, additional design patterns may be needed.

---

## Rule of Thumb

> Keep transactions short and local. Avoid slow network calls while holding database locks.
