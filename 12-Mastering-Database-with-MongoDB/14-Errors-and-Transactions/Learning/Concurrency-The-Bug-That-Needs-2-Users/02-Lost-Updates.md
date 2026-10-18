# 02 — The Lost Update Problem

## How It Happens

The underlying pattern is called **read-modify-write**:

1. Read a value from the database.
2. Modify it in application code.
3. Write the new value back to the database.

For example:

```js
const account = await getAccount(accountId);

const newBalance = account.balance - 30;

await updateBalance(accountId, newBalance);
```

The dangerous part is that another request can change the balance between the read and the write.

---

## Step-by-Step Timeline

| Time | Request A      | Request B      | Database balance |
| ---- | -------------- | -------------- | ---------------- |
| 1    | Reads ₹100     | —              | ₹100             |
| 2    | —              | Reads ₹100     | ₹100             |
| 3    | Calculates ₹70 | —              | ₹100             |
| 4    | —              | Calculates ₹70 | ₹100             |
| 5    | Writes ₹70     | —              | ₹70              |
| 6    | —              | Writes ₹70     | ₹70              |

The second write overwrites the first write's effect.

---

## Why a Normal Transaction Is Not Always Enough

Putting both operations inside transactions does not automatically prevent every concurrency bug.

Under common isolation levels, two transactions can still read the same old value and later overwrite each other's changes if the application performs the calculation outside the database.

The important question is not just whether a transaction exists. It is **how the update is expressed and coordinated**.

---

## The Fix: Calculate Inside the Database

Instead of calculating the new balance in application code, use one SQL statement:

```sql
UPDATE accounts
SET balance = balance - 30
WHERE id = $1;
```

The database performs the subtraction as part of the update. When concurrent updates target the same row, PostgreSQL coordinates them using row-level locking.

Conceptually:

```
Initial balance: 100

Request A:
    balance = balance - 30
    Result: 70

Request B:
    waits for A's row update
    applies balance = balance - 30
    Result: 40
```

Both withdrawals are reflected in the final balance.

---

## Adding a Business Condition

The atomic update prevents the lost-update pattern, but it does not prevent the balance from becoming negative. If overdrafts are forbidden, include the business condition in the same SQL statement:

```sql
UPDATE accounts
SET balance = balance - 30
WHERE id = $1
  AND balance >= 30
RETURNING balance;
```

- **One returned row** → withdrawal succeeded.
- **Zero returned rows** → insufficient funds, or the account ID did not match.

If the application needs to distinguish those two failure reasons, it needs an additional check or a more explicit database operation.

---

## Key Lesson

> Whenever possible, express a change as a database operation rather than reading a value, calculating a replacement in application code, and writing that replacement back.
