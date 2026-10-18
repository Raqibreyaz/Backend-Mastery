# Concurrency: The Bug That Needs Two Users

## What it is

Concurrency means multiple operations are in progress at the same time. In a backend application, this often happens when two users send requests that access or modify the same database record.

A concurrency bug occurs when the result depends on the timing or order of overlapping operations.

These bugs can be difficult to detect because:

- Everything may work correctly when one user uses the application.
- Unit tests may pass when requests execute sequentially.
- No exception may occur.
- Both requests may return success even though the final database state is incorrect.

The lesson focuses on three common problems:

1. Lost updates — one request overwrites another request's change.
2. Check-then-act races — a condition becomes invalid between checking it and acting on it.
3. Conflicting edits — one user's changes silently overwrite another user's work.

The key principle is to let the database decide which concurrent operation succeeds.

## One-sentence summary

Concurrency bugs happen when multiple requests read and modify shared data at overlapping times, and the solution is to make important decisions atomic or let the database detect conflicts.

## Intuition: Two people editing the same record

Imagine two users trying to withdraw ₹30 from an account containing ₹100.

Both requests read the balance before either writes its result.

### The lost update

Initial database balance

# ₹100

Request A

Reads ₹100

Calculates ₹100 − ₹30

## ₹70

Request B

Reads ₹100

Calculates ₹100 − ₹30

## ₹70

Both requests write ₹70

Final database balance

# ₹70

Expected: ₹40. One withdrawal was effectively lost.

Two withdrawals happened, but the database reflects only one.

Nothing necessarily crashed. Both requests might have returned success. The bug is in the coordination between requests.

## 1. The lost update problem

### How it happens

The underlying pattern is called read-modify-write:

1. Read a value from the database.
2. Modify it in application code.
3. Write the new value back to the database.

For example:

```
const account = await getAccount(accountId);

const newBalance = account.balance - 30;

await updateBalance(accountId, newBalance);
```

The dangerous part is that another request can change the balance between the read and the write.

### Step-by-step timeline

| Time | Request A      | Request B      | Database balance |
| ---- | -------------- | -------------- | ---------------- |
| 1    | Reads ₹100     | —              | ₹100             |
| 2    | —              | Reads ₹100     | ₹100             |
| 3    | Calculates ₹70 | —              | ₹100             |
| 4    | —              | Calculates ₹70 | ₹100             |
| 5    | Writes ₹70     | —              | ₹70              |
| 6    | —              | Writes ₹70     | ₹70              |

The second write overwrites the first write's effect.

### Why a normal transaction is not always enough

Putting both operations inside transactions does not automatically prevent every concurrency bug.

Under common isolation levels, two transactions can still read the same old value and later overwrite each other's changes if the application performs the calculation outside the database.

The important question is not just whether a transaction exists. It is how the update is expressed and coordinated.

### The fix: Calculate inside the database

Instead of calculating the new balance in application code, use one SQL statement:

```
UPDATE accounts
SET balance = balance - 30
WHERE id = $1;
```

Here, `$1` is a parameter containing the account ID.

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

Important: This statement prevents the lost-update pattern, but it does not prevent the balance from becoming negative. If overdrafts are forbidden, include the business condition in the SQL statement too.

```
UPDATE accounts
SET balance = balance - 30
WHERE id = $1
  AND balance >= 30
RETURNING balance;
```

Now the database also checks whether sufficient funds remain.

- One returned row means the withdrawal succeeded.
- Zero returned rows means the account was not eligible for the withdrawal, or the account ID did not match an existing row.

If the application needs to distinguish those two failure reasons, it needs an additional check or a more explicit database operation.

### Key lesson

Whenever possible, express a change as a database operation rather than reading a value, calculating a replacement in application code, and writing that replacement back.

## 2. The check-then-act race condition

### What it is

A check-then-act race occurs when an application checks whether an operation is allowed and performs the operation later.

Another request can change the situation between those two steps.

This creates a time gap in which the original decision may become invalid.

### Example: Username registration

Suppose two users try to register the username `raquib`.

A naive implementation might do this:

```
const existing = await findUserByUsername("raquib");

if (!existing) {
  await createUser("raquib");
}
```

The application checks whether the username exists and inserts it if it does not.

The problem is that the check and insertion are separate database operations.

### How the race happens

```
Request A                         Request B
---------                         ---------
SELECT username                  SELECT username
Username not found               Username not found

INSERT username                  INSERT username
          \                      /
           Both attempt insertion
```

Both requests can observe that the username is available.

Without a database constraint, both may insert it.

Even if the application checks the username correctly, the check can become outdated immediately afterward.

### The fix: A unique constraint

Make the database enforce the rule that usernames must be unique.

```
ALTER TABLE users
ADD CONSTRAINT users_username_unique
UNIQUE (username);
```

Then attempt the insertion directly:

```
INSERT INTO users (username)
VALUES ('raquib');
```

The database decides which insertion succeeds.

- The first valid insertion succeeds.
- The competing insertion fails with a unique-constraint violation.

The application catches that specific error and tells the second user that the username is already taken.

### Why the database is the right place

An application-level check is not enough because multiple application servers or requests can run concurrently.

A unique constraint is enforced centrally by the database. It protects the rule even when requests reach different application instances.

General rule: If a condition must always remain true, enforce it with a database constraint whenever possible.

Examples include:

- Usernames must be unique.
- An email address must not be registered twice.
- An order must reference a valid customer.
- A required value must not be `NULL`.

## 3. Conditional updates: Let the database decide

Sometimes a business operation can be expressed as one conditional `UPDATE`.

This is often simpler than performing a separate check and then updating.

### Example: Booking a seat

Suppose a seat is available only when `taken_by IS NULL`.

A naive implementation would:

1. Check whether the seat is free.
2. If it is free, assign it to the user.

Two requests could both pass the first check.

Instead, write:

```
UPDATE seats
SET taken_by = $1
WHERE id = $2
  AND taken_by IS NULL;
```

Parameters:

- `$1`: the user attempting to book the seat.
- `$2`: the seat ID.

The database updates the row only if the seat is still available when the update is evaluated.

### How to interpret the result

Check the number of affected rows.

| Rows affected | Meaning                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `1`           | The seat was available and this request booked it.                                                      |
| `0`           | No matching available seat was updated. Someone may have booked it first, or the seat ID may not exist. |

The second request cannot successfully overwrite the first user's booking through this statement because its condition no longer matches the updated row.

### Why this is useful

You do not need to manually manage a lock for this simple operation.

The condition and update are combined into one database statement, so there is no separate application-level gap between checking availability and changing the record.

This pattern is useful for:

- Reserving seats.
- Claiming jobs from a queue.
- Decrementing inventory.
- Changing a status only if the current status is correct.
- Spending credits only if enough credits remain.

For example, decrement inventory safely:

```
UPDATE products
SET stock = stock - 1
WHERE id = $1
  AND stock > 0
RETURNING stock;
```

A successful update means one item was deducted. If no row is returned, the product either does not exist or has no stock available.

## 4. Optimistic locking: Detect conflicting edits

Conditional updates are ideal for simple business operations. But what happens when a user edits a record over several seconds or minutes?

For example, two administrators open the same product:

- Administrator A changes the product description.
- Administrator B changes the price.
- Both save their forms.

If both save without checking whether the record changed, the later save may overwrite the earlier save.

Optimistic locking detects this conflict rather than silently allowing stale data to overwrite newer data.

### The idea: Add a version column

A record contains a version number.

```
Product:
    id: 42
    name: "Keyboard"
    price: 1000
    version: 5
```

When a user reads the record, the application remembers its version.

When the user saves, the application updates the record only if the version is still the same.

### Example SQL

```
UPDATE products
SET price = $1,
    version = version + 1
WHERE id = $2
  AND version = $3;
```

Parameters:

- `$1`: the new price.
- `$2`: the product ID.
- `$3`: the version originally read by the user.

Suppose both administrators read version `5`.

1. Administrator A saves first.
2. The update matches version `5`.
3. The database saves the change and increments the version to `6`.
4. Administrator B tries to save using expected version `5`.
5. B's update matches no rows because the current version is `6`.

The application knows that another user modified the record after B read it.

Instead of silently discarding someone's work, it can show a message such as:

> This record was modified by another user. Reload the latest version and try again.

### When to use optimistic locking

Use it when:

- Conflicts are possible but not extremely frequent.
- Users may edit a record for a long time.
- You want to avoid holding database locks while users work.
- Losing another user's changes would be a serious problem.

Examples include document editors, product administration panels, profile editing, and settings pages.

### Optimistic locking versus a unique constraint

These solve different problems:

- A unique constraint prevents two records from violating a uniqueness rule.
- Optimistic locking prevents a stale update from overwriting a newer version of the same record.

You may need both in the same application.

## 5. Pessimistic locking: Lock the row before working

Optimistic locking detects conflicts when a user saves. Sometimes, however, the application must prevent another transaction from changing a row while a particular operation is in progress.

This is where pessimistic locking is useful.

### The idea

Lock the database row before reading and modifying it.

In PostgreSQL, use:

```
SELECT *
FROM accounts
WHERE id = $1
FOR UPDATE;
```

`FOR UPDATE` acquires a row-level lock on the selected row. Competing transactions that need conflicting locks on that row must wait until the lock is released.

The lock remains held until the transaction ends.

### Example

```
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

The exact application logic depends on the database driver, but the important part is that the read, decision, and update happen inside the same transaction while the row is locked.

### When to use it

Use pessimistic locking when the work between reading and writing genuinely cannot be expressed as a single conditional database statement.

For example, a complex operation may need to read several values, make a decision based on them, and then update a record.

### The trade-off

Pessimistic locking prevents conflicting operations from proceeding simultaneously on the locked rows, but it also makes competing requests wait.

Long-running transactions can therefore reduce throughput and increase contention.

Keep transactions short, and avoid slow external calls while holding locks.

## 6. Compare the main concurrency solutions

| Technique           | Core idea                                          | Good use case                                                   |
| ------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| Atomic SQL update   | Perform the calculation inside the database.       | Incrementing counters, deducting stock or balance.              |
| Unique constraint   | Let the database enforce uniqueness.               | Usernames, email addresses, unique identifiers.                 |
| Conditional update  | Update only when a condition is still true.        | Seat booking, inventory, status transitions.                    |
| Optimistic locking  | Update only if the record version has not changed. | Forms and longer edits.                                         |
| Pessimistic locking | Lock rows while performing a multi-step operation. | Operations that require a protected read-decide-write sequence. |

### A practical decision process

```
Can the operation be one SQL statement?
    |
    +-- Yes --> Use an atomic or conditional UPDATE.
    |
    +-- No
         |
         +-- Must detect stale edits?
         |      |
         |      +-- Yes --> Use optimistic locking.
         |
         +-- Must prevent conflicting work during
                a multi-step transaction?
                |
                +-- Yes --> Consider SELECT ... FOR UPDATE.
```

Also, if the requirement is a permanent data rule, such as uniqueness, use a database constraint. A locking strategy is not a replacement for that constraint.

## 7. How to prove that a concurrency bug is fixed

Reasoning about concurrent code is not enough. You need to reproduce the race and test the final state.

A sequential test might pass:

```
await withdraw(30);
await withdraw(30);
```

The second request starts only after the first has finished. This does not reproduce the problematic overlap.

### Run requests concurrently

In Node.js, `Promise.all` can start multiple asynchronous operations without waiting for each one to finish first.

```
await Promise.all([
  withdraw(30),
  withdraw(30)
]);
```

This is a useful starting point, but it does not guarantee that the requests will overlap at the exact point needed to reproduce a race. Depending on scheduling and the implementation, the bug may not appear every time.

A stronger test uses a synchronization barrier or a test hook so both requests reach the critical section together.

### Test the final database state

For two successful withdrawals of ₹30 from ₹100, the expected balance is ₹40.

```
Initial balance: 100

Run two withdrawals concurrently.

Expected final balance: 40
```

For a seat-booking operation where only one user may claim a seat:

```
Run two booking requests concurrently.

Expected:
    Exactly one booking succeeds.
    The other request reports a conflict.
```

For optimistic locking:

```
Two users read version 5.

User A saves:
    Success
    Version becomes 6

User B saves with expected version 5:
    Conflict
    Record remains unchanged by B
```

### Use `curl` or a small script

The lesson suggests sending two HTTP requests at the same time with `curl` commands run in the background using `&`, or writing a small script with `Promise.all`.

For example, if your endpoint deducts ₹30 from a test account:

```
curl -X POST http://localhost:3000/accounts/1/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount":30}' &

curl -X POST http://localhost:3000/accounts/1/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount":30}' &

wait
```

The exact URL and request format depend on your application.

The `&` starts each command in the background. `wait` waits for the background commands to finish.

Check the database afterward. Two HTTP responses that both look successful do not prove that the final state is correct.

Keep a reproducible concurrency test in your README. It documents the bug and provides a way to verify that future changes do not reintroduce it.

## 8. Exercise: Implement optimistic locking in JavaScript

The source lesson asks you to implement:

```
saveWithVersion(store, id, expectedVersion, patch)
```

The function must update `store[id]` only when the record exists and its current version matches `expectedVersion`.

### Requirements

1. If the record does not exist, return:
   ```
   { ok: false, reason: "not_found" }
   ```
2. If the record exists but the version does not match, return:
   ```
   {
     ok: false,
     reason: "conflict",
     currentVersion: record.version
   }
   ```
   Do not change the record.
3. If the version matches:
   - Apply the patch.
   - Increment the version.
   - Return the new version.
   ```
   { ok: true, version: newVersion }
   ```

### Complete solution

```
function saveWithVersion(store, id, expectedVersion, patch) {
  const record = store[id];

  if (record === undefined) {
    return {
      ok: false,
      reason: "not_found"
    };
  }

  if (record.version !== expectedVersion) {
    return {
      ok: false,
      reason: "conflict",
      currentVersion: record.version
    };
  }

  Object.assign(record, patch);
  record.version += 1;

  return {
    ok: true,
    version: record.version
  };
}
```

### Example: Successful save

```
const store = {
  42: {
    name: "Keyboard",
    price: 1000,
    version: 5
  }
};

const result = saveWithVersion(
  store,
  42,
  5,
  { price: 1200 }
);

console.log(result);
// { ok: true, version: 6 }

console.log(store[42]);
// { name: "Keyboard", price: 1200, version: 6 }
```

The expected version was `5`, so the save succeeded. The record's version increased to `6`.

### Example: Conflicting save

```
const result = saveWithVersion(
  store,
  42,
  5,
  { price: 1500 }
);

console.log(result);
// { ok: false, reason: "conflict", currentVersion: 6 }
```

The record is already at version `6`. The function rejects the stale save and leaves the record unchanged.

### Example: Missing record

```
const result = saveWithVersion(
  store,
  99,
  1,
  { price: 500 }
);

console.log(result);
// { ok: false, reason: "not_found" }
```

No record with ID `99` exists, so no update is performed.

### Important limitation

This exercise simulates optimistic locking in a single JavaScript process. It is useful for learning the logic, but it is not a substitute for database concurrency control.

In a real backend, the version check and update must be part of one atomic database operation. Otherwise, two application requests could both check the version before either one updates the record.

For example:

```
UPDATE products
SET price = $1,
    version = version + 1
WHERE id = $2
  AND version = $3
RETURNING version;
```

If no row is returned, the application can report a conflict or investigate whether the record is missing.

## 9. Common mistakes and gotchas

### Mistake 1: Assuming unit tests will reveal every race

A unit test that calls one request at a time may never create the overlapping execution needed for a lost update.

Better approach: Test concurrent requests and verify the final state.

### Mistake 2: Assuming transactions automatically solve every race

Transactions provide important guarantees, but the outcome still depends on the isolation level and how queries are written.

Better approach: Use atomic updates, database constraints, conditional updates, version checks, or row locks according to the business rule.

### Mistake 3: Checking a condition in JavaScript and trusting it later

A value can change after the application reads it.

Better approach: Put the condition into the database update or enforce it with a constraint.

### Mistake 4: Treating a successful HTTP response as proof of correctness

Two requests can return success while one silently overwrites the other's change.

Better approach: Assert the expected database state after concurrent operations.

### Mistake 5: Holding row locks for too long

Long transactions make competing requests wait and increase the risk of deadlocks or timeouts.

Better approach: Keep locked sections short and avoid unrelated work inside them.

### Mistake 6: Forgetting to increment the version

If optimistic locking checks a version but never changes it after a successful save, later updates may not detect conflicts properly.

Better approach: Increment the version as part of the same atomic update.

### Mistake 7: Treating zero updated rows as one specific error

For a conditional update, zero rows may mean the record does not exist, the condition is false, or the version is stale.

Better approach: Decide what each result means for your API and use additional checks if the application must distinguish those cases.

## 10. Key takeaways

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

## 11. Minimal self-test

Try answering these questions without looking back.

1. Why can a sequential unit test fail to reveal a lost update?
2. Two requests read a balance of ₹100 and both subtract ₹30 in application code. Why might the final balance be ₹70 instead of ₹40?
3. Why is `SELECT` followed by `INSERT` not enough to guarantee a unique username?
4. What does it mean when a conditional `UPDATE` affects zero rows?
5. How does a version column help detect conflicting edits?
6. What is the difference between optimistic locking and pessimistic locking?
7. Why should a transaction that uses `SELECT ... FOR UPDATE` be kept short?
8. Why is `Promise.all` useful for concurrency testing, and why might it not reproduce a race every time?
9. Where should a rule such as “a username must be unique” be enforced?
10. Why is an in-memory implementation of optimistic locking not sufficient for a multi-request database application?

## 12. What to learn next

The next logical topics are:

1. Database transactions and isolation levels — understand atomicity, isolation, row locks, and the guarantees each isolation level provides.
2. PostgreSQL MVCC — learn how PostgreSQL handles concurrent reads and writes using multiversion concurrency control.
3. Deadlocks and lock ordering — understand why transactions can wait on each other and how to reduce the risk.
4. Idempotency — make repeated requests safe, especially for payments and retryable operations.
5. Database constraints and indexes — learn how the database enforces correctness and how constraints interact with query execution.