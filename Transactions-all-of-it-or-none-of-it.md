# Database Transactions: All or Nothing

## 1. What is a database transaction?

A database transaction is a group of database operations treated as one logical unit of work.

The central idea is simple:

Either every operation succeeds, or none of the changes are kept.

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

## 2. One-sentence summary

A database transaction groups multiple operations into one logical unit so that failures do not leave partially committed changes.

## 3. Intuition: A transaction is like a sealed package

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

## 4. The three essential transaction commands

### `BEGIN`

Starts a transaction.

```
BEGIN;
```

The database begins treating subsequent statements as part of the transaction.

### `COMMIT`

Makes the transaction's changes permanent.

```
COMMIT;
```

If all required operations succeed, commit the transaction.

### `ROLLBACK`

Cancels the transaction's uncommitted changes.

```
ROLLBACK;
```

If an operation fails, rollback prevents the partial changes from being committed.

### Complete SQL example

```
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

```
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

## 5. ACID properties

Database transactions are commonly described using four properties: ACID.

## A — Atomicity

All operations succeed together, or none of their changes are committed.

Example: A bank transfer must not subtract money without crediting the recipient.

## C — Consistency

A transaction must preserve the database's defined integrity rules when it completes successfully.

Example: A database constraint prevents an account balance from becoming negative, if negative balances are prohibited by the schema.

## I — Isolation

Controls how concurrent transactions interact and what data they can observe.

Example: Two users attempting to purchase the last item in stock must not both successfully claim it when the business rule allows only one purchase.

## D — Durability

Once a transaction is committed, its changes survive failures covered by the database's durability guarantees.

Example: After a successful bank transfer is committed, a power failure should not simply erase the transfer.

### Understanding the difference

| Property    | Main question                                  |
| ----------- | ---------------------------------------------- |
| Atomicity   | Were the changes applied all together?         |
| Consistency | Were the database's integrity rules preserved? |
| Isolation   | How did concurrent transactions interact?      |
| Durability  | Will committed changes survive a failure?      |

These properties solve different problems. A transaction can provide atomicity without automatically preventing every concurrency bug.

## 6. Isolation levels: How concurrent transactions see data

Isolation is one of the most important transaction concepts because it involves trade-offs between concurrency, correctness, and performance.

PostgreSQL provides several isolation levels.

### 6.1 Read Committed

`Read Committed` is PostgreSQL's default isolation level.

A transaction sees committed data, but two separate reads within the same transaction can return different results if another transaction commits changes between them.

Consider this sequence:

```
Transaction A                 Transaction B
-------------                 -------------
BEGIN                         BEGIN

Read balance = ₹1,000

                              Update balance to ₹800
                              COMMIT

Read balance = ₹800

COMMIT
```

Transaction A sees two different values:

```
First read:  ₹1,000
Second read: ₹800
```

Why?

Under `Read Committed`, each ordinary `SELECT` generally sees a snapshot of data committed before that statement began.

The two reads use different statement snapshots, so the second read can observe Transaction B's committed update.

This does not mean Transaction A read uncommitted data. Both values were committed when they were observed.

### 6.2 Repeatable Read

`Repeatable Read` provides a stable snapshot for the transaction.

Using the same example:

```
Transaction A                 Transaction B
-------------                 -------------
BEGIN                         BEGIN

Read balance = ₹1,000

                              Update balance to ₹800
                              COMMIT

Read balance = ₹1,000

COMMIT
```

Transaction A continues to see the same snapshot for ordinary reads, even after Transaction B commits its update.

In PostgreSQL, `Repeatable Read` uses snapshot isolation. It prevents non-repeatable reads and, unlike some implementations of the SQL isolation standard, also prevents phantom reads for ordinary snapshot-based queries.

However, it does not eliminate every possible concurrency anomaly. In particular, snapshot isolation alone does not guarantee full serializability.

### 6.3 Serializable

`Serializable` provides the strongest standard isolation level.

Its goal is to make successfully committed concurrent transactions behave as if they had executed one after another in some serial order.

For example:

```
Transaction A
      |
      v
Transaction B
      |
      v
Consistent final outcome
```

The database does not necessarily execute every transaction sequentially in real time. It may allow concurrent execution while detecting situations that cannot safely be serialized.

When PostgreSQL detects a serialization conflict, it can abort a transaction with a serialization failure.

The application must then retry the transaction when appropriate.

### Isolation-level comparison

| Isolation level | Main behavior                                            | Important consideration                                                                  |
| --------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Read Committed  | Each statement generally sees its own committed snapshot | Separate reads can return different values                                               |
| Repeatable Read | Reads use a stable transaction snapshot                  | Some concurrent updates can still conflict or produce anomalies under snapshot isolation |
| Serializable    | Successful transactions behave as if executed serially   | Serialization failures require retries                                                   |

Higher isolation does not mean fewer errors. It means stronger correctness guarantees, sometimes at the cost of rejecting transactions that must be retried.

## 7. Why transactions should be short

A transaction can hold database locks while it runs. Other transactions may need those same locks before they can proceed.

Consider this application code:

```
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

### Better approach

Perform external work before opening the transaction when possible:

```
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

Rule of thumb: Keep transactions short and local. Avoid slow network calls while holding database locks.

## 8. Deadlocks: When transactions wait for each other

A deadlock occurs when transactions form a cycle of dependencies: each transaction waits for a resource held by another transaction in the cycle.

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

### 8.1 How to prevent deadlocks

The lesson's recommended solution is to acquire locks in a consistent order.

For example, instead of updating rows in arbitrary order:

```
Transaction A: row 1 -> row 2
Transaction B: row 2 -> row 1
```

Make both transactions use:

```
Transaction A: row 1 -> row 2
Transaction B: row 1 -> row 2
```

In application logic, sort the row IDs before acquiring locks or performing updates that acquire locks.

This avoids the opposing lock order that creates the cycle in this example.

Consistent ordering reduces deadlock risk, although it cannot eliminate every possible deadlock in a complex system.

## 9. Transactions do not automatically prevent lost updates

A transaction is not a lock on the entire database.

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

One update has overwritten the other. This is called a lost update.

Under `Read Committed`, this can occur when the application reads a value, computes a new value outside the database, and later writes that value without protecting against concurrent modifications.

Each transaction may have used committed data, and each may have executed successfully. Yet the business operation is incorrect.

The lesson's key point is:

Transactions alone do not prevent every concurrency bug.

Possible solutions include atomic SQL updates, row-level locking, optimistic concurrency checks, and stronger isolation where appropriate. These are covered by the broader topic of concurrency and race conditions.

## 10. Always handle rollback in application code

Opening a transaction is only half the job. Your application must handle failures correctly.

Consider:

```
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

### 10.1 A safer transaction structure

```
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

### 10.2 What about `try/finally`?

The lesson highlights `try/finally` or a helper that wraps the transaction as ways to ensure cleanup happens on every exit path.

A `finally` block always runs when control leaves the associated `try` statement, whether it exits normally or through an exception.

However, a `finally` block should not blindly roll back a transaction that has already committed. Track the transaction state, or use a transaction helper that correctly manages commit, rollback, and connection cleanup.

Also, if rollback itself fails, preserve the original error and ensure the connection is not incorrectly reused.

In production, prefer the transaction API provided by your database driver or ORM when it correctly guarantees cleanup.

# Part 11 — Exercise: Implement `runAll(state, operations)`

The source lesson provides a coding exercise.

The function receives:

- `state`: An object that operations can modify.
- `operations`: An array of functions, each receiving `state` and potentially changing it.

Requirements:

1. Apply every operation in order.
2. If all operations succeed, return `{ ok: true }`.
3. If an operation throws, restore `state` to exactly how it was before the function started.
4. Return `{ ok: false, failedAt }`, where `failedAt` is the index of the operation that threw.

## 11.1 Why the original implementation fails

```
function runAll(state, operations) {
  operations.forEach((op) => op(state));

  return { ok: true };
}
```

If the third operation throws, the first two operations may already have modified `state`.

The exception also prevents the function from returning the required failure object.

The fix is to preserve the original state and restore it if an operation fails.

## 11.2 Solution for a plain object with primitive values

```
function runAll(state, operations) {
  const original = { ...state };

  for (let i = 0; i < operations.length; i++) {
    try {
      operations[i](state);
    } catch (error) {
      for (const key of Object.keys(state)) {
        delete state[key];
      }

      Object.assign(state, original);

      return {
        ok: false,
        failedAt: i
      };
    }
  }

  return { ok: true };
}
```

### How it works

1. Save a shallow copy of the original state.
2. Run each operation in order.
3. If an operation throws, remove the current object's properties.
4. Restore the original properties.
5. Return the failed operation's index.

For example:

```
const state = {
  balance: 100,
  count: 0
};

const operations = [
  (s) => {
    s.balance -= 20;
  },
  (s) => {
    s.count += 1;
  },
  (s) => {
    s.balance = -999;
    throw new Error("Operation failed");
  }
];

console.log(runAll(state, operations));
```

Result:

```
{
  ok: false,
  failedAt: 2
}
```

The state is restored to:

```
{
  balance: 100,
  count: 0
}
```

### Important limitation

The implementation uses a shallow copy. It works for the stated exercise when state consists of simple properties whose values are not themselves being mutated.

If the state contains nested objects or arrays that operations mutate in place, the shallow copy retains references to those nested values. It cannot fully restore those mutations.

For arbitrary nested state, you need a suitable deep-copy and restoration strategy, or an immutable update approach. The strategy must match the kinds of state and operations the exercise permits.

This exercise simulates atomicity in application memory. It is not a replacement for a real database transaction, which also coordinates concurrent operations and durable storage.

# 12. Check Yourself

Use these questions to test your understanding.

1. Why should an external HTTP call not happen inside a transaction?
2. Two transactions deadlock. What is the standard prevention strategy?
3. If you raise isolation to `Serializable`, what must your application be prepared to handle?

## Answers

1. A transaction may hold locks while waiting for the HTTP call, causing other writers to wait.
2. Acquire locks in a consistent order, such as sorting row IDs before updating them.
3. Serialization failures that require retrying the transaction when appropriate.

# 13. Key Takeaways

- A transaction groups database operations into one logical unit.
- Atomicity means all changes are committed together or none are committed.
- `BEGIN` starts a transaction, `COMMIT` commits it, and `ROLLBACK` cancels uncommitted changes.
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

## 14. What to learn next

The next logical topic is Concurrency: the bug that needs two users.

It builds directly on transactions and explores lost updates, race conditions, atomic SQL operations, row-level locks, and how to keep concurrent requests from violating business rules.