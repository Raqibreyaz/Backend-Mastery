# Changing the Schema While It Is Running

## What it is

Changing a database schema while an application is running is harder than changing a schema when the application is stopped.

The main reason is simple:

> **During a deployment, old code and new code can run at the same time.**

Therefore, every schema change must remain compatible with both versions of the application. This single constraint explains most of the safe migration techniques in this lesson. 

---

## One-sentence summary

**Use an Expand → Backfill → Migrate → Contract process so that database changes remain compatible with old and new application code without downtime.**

---

## Intuition

Imagine you have two versions of your application running:

```text
                Database
                   │
          ┌────────┴────────┐
          ↓                 ↓
      Old code           New code
```

During deployment, you cannot assume that the old code disappears immediately.

So if you make a database change that only the new code understands, the old code may start failing.

For example:

```text
Old code:
SELECT name FROM users;

Database after migration:
name column ❌
full_name column ✅
```

The old code is still alive and now every request using `name` fails.

So database migrations should be designed around **backward compatibility during deployment**.

---

# 1. Why a Schema Change Is Not Always One Step

Consider renaming:

```sql
ALTER TABLE users
RENAME COLUMN name TO full_name;
```

It looks like a simple operation.

But imagine this deployment:

```text
Before deployment:

Old application
      │
      └── reads `name`
             │
             ↓
          Database
             │
             └── `name`
```

You rename the column immediately:

```text
Database:
name      ❌
full_name ✅
```

But old application instances may still be running:

```text
Old application
      │
      └── SELECT name ...
                  │
                  ↓
              ❌ ERROR
```

The old code expects `name`, but the database no longer has it.

Therefore, a rename should not normally be treated as:

```text
rename column
     ↓
done
```

Instead, use several compatible deployments.

---

# 2. The Safe Migration Pattern

The lesson describes four stages:

```text
EXPAND
   ↓
BACKFILL
   ↓
MIGRATE
   ↓
CONTRACT
```

This pattern allows old and new code to coexist safely.

---

## Stage 1: Expand

Add the new schema without removing the old schema.

For example:

```text
Before:

users
├── id
├── name
└── email
```

Add:

```text
users
├── id
├── name
├── full_name   ← new
└── email
```

The new column should initially be nullable.

Why?

Because old code does not know about `full_name`, but it can continue using `name`.

So both versions can work:

```text
Old code → name
New code → full_name
```

---

## Stage 2: Backfill

Now copy the old data into the new column.

Conceptually:

```text
name
 │
 └──────→ full_name
```

For example:

```text
name       full_name
----------------------
Alice  →   Alice
Bob    →   Bob
Charlie →  Charlie
```

The important point is:

> **Backfill the data in batches instead of changing millions of rows in one giant transaction.**

---

## Stage 3: Write to Both Columns

While old and new application versions may both exist, make writes update both columns.

For example:

```text
Application
     │
     ├── write name
     │
     └── write full_name
```

So the database stays compatible with both versions.

Example:

```text
name       = "Alice Smith"
full_name  = "Alice Smith"
```

Now:

```text
Old code → reads name
New code → reads full_name
```

Both work.

---

## Stage 4: Migrate

Once the new column contains the required data and the application is ready, deploy code that reads the new column.

```text
Old code:
reads name

        ↓ deployment

New code:
reads full_name
```

At this point, the application has migrated to the new schema.

---

## Stage 5: Contract

Only after you are confident that nothing still uses the old column should you remove it.

```text
users
├── id
├── full_name
└── email
```

The old:

```text
name
```

can now be dropped.

This is the **contract** phase.

---

# 3. Complete Rename Example

Suppose the original schema is:

```text
users
├── id
├── name
└── email
```

You want:

```text
full_name
```

instead of:

```text
name
```

### Deploy 1 — Expand

```sql
ALTER TABLE users
ADD COLUMN full_name TEXT;
```

Do not immediately remove `name`.

---

### Deploy 2 — Backfill

Copy existing values:

```text
name → full_name
```

For example:

```text
id    name          full_name
-----------------------------
1     Alice         Alice
2     Bob           Bob
3     Charlie       Charlie
```

---

### Deploy 3 — Migrate

Application code starts reading:

```text
full_name
```

and writes to both columns while compatibility is still required.

---

### Deploy 4 — Contract

Once nothing reads the old column:

```sql
ALTER TABLE users
DROP COLUMN name;
```

Now the old schema is gone.

---

## Why all this effort?

It may feel excessive for something as simple as renaming a column.

But the alternative can be:

```text
Schema change
     ↓
old application breaks
     ↓
requests fail
     ↓
outage
```

The safe approach makes the change gradual:

```text
Expand
  ↓
Backfill
  ↓
Dual compatibility
  ↓
Migrate application
  ↓
Contract
```

The lesson describes this as the difference between a change nobody notices and a period of total failure. 

---

# 4. Adding a Column

Adding a column is generally easier than renaming one.

A new nullable column with no default is described as usually being safe:

```sql
ALTER TABLE users
ADD COLUMN full_name TEXT;
```

The important condition is:

```text
new
+
nullable
+
no default
```

This can be an instant schema change.

---

## `NOT NULL` and Defaults

Be careful with:

```sql
ALTER TABLE users
ADD COLUMN full_name TEXT NOT NULL DEFAULT 'unknown';
```

Historically, adding a `NOT NULL` column with a default to a large table could require rewriting the entire table while holding a lock.

For example:

```text
10 million rows
       ↓
table rewrite
       ↓
large operation
       ↓
lock
       ↓
possible outage
```

However, the lesson specifically notes an important PostgreSQL detail:

> Modern PostgreSQL can handle a constant default without rewriting the table, but a **volatile default** can still cause a rewrite.

Therefore:

**Do not blindly assume that every `ADD COLUMN ... DEFAULT` is cheap.**

Check what your PostgreSQL version does before running the migration on a very large table. 

---

# 5. Adding an Index on a Live Table

Indexes are another important migration case.

A normal:

```sql
CREATE INDEX
```

can block writes while the index is being built.

For example:

```sql
CREATE INDEX idx_users_email
ON users(email);
```

On a large table, building the index may take minutes.

During that time:

```text
Application
    │
    ├── reads
    ├── writes ──→ blocked
    └── writes ──→ blocked
```

This is dangerous for a live production system.

---

# 6. `CREATE INDEX CONCURRENTLY`

PostgreSQL provides:

```sql
CREATE INDEX CONCURRENTLY
```

Example:

```sql
CREATE INDEX CONCURRENTLY idx_users_email
ON users(email);
```

The important difference is:

```text
CREATE INDEX
        ↓
can block writes

CREATE INDEX CONCURRENTLY
        ↓
does not block normal writes in the same way
```

This makes concurrent index creation useful on live systems.

---

## Trade-off

`CREATE INDEX CONCURRENTLY` is not simply "better."

It has costs.

It is:

* slower
* unable to run inside a transaction

So there is a trade-off:

| Method                      | Live writes                | Speed  | Transaction               |
| --------------------------- | -------------------------- | ------ | ------------------------- |
| `CREATE INDEX`              | Blocks writes during build | Faster | Can run in transaction    |
| `CREATE INDEX CONCURRENTLY` | Allows writes              | Slower | Cannot run in transaction |

For a live production system, the lesson recommends the concurrent approach.

---

# 7. Important Gotcha: Invalid Index

A concurrent index build can fail.

If it does, it can leave an **invalid index** behind.

Example:

```text
CREATE INDEX CONCURRENTLY
          ↓
       failure
          ↓
 invalid index remains
```

The planner ignores such an invalid index.

Therefore:

> **After a concurrent index creation, check that the index is valid.**

Do not assume that the command succeeding or failing is the end of the story. 

---

# 8. The Dangerous Lock Chain

One of the most important ideas in the lesson is that a migration can get stuck waiting for another transaction.

Imagine:

```text
Long-running query
       │
       │ holds lock
       ↓
ALTER TABLE
       │
       │ waits
       ↓
New queries
       │
       └── wait behind ALTER TABLE
```

This creates a queue.

---

## Step-by-step

Suppose a long-running transaction is using a table:

```text
Transaction A
──────────────
running for a long time
        │
        ↓
     holds lock
```

Then your migration starts:

```sql
ALTER TABLE users ...;
```

The migration needs a lock.

But the lock is currently unavailable.

So:

```text
ALTER TABLE
     │
     └── waits
```

Now another request comes in.

That request may also need access to the table.

Instead of simply waiting behind the original long-running query, it can end up waiting behind the migration.

So the situation becomes:

```text
Long query
    ↓
ALTER TABLE waiting
    ↓
new queries waiting
    ↓
more queries waiting
    ↓
system becomes unavailable
```

A table that was merely **busy** can effectively become unavailable.

---

# 9. `lock_timeout`

One way to protect the system is to give the migration a short lock timeout.

Conceptually:

```text
Try to acquire lock
       │
       ├── lock available
       │       ↓
       │    continue
       │
       └── lock unavailable
               ↓
        wait only briefly
               ↓
          give up
```

The goal is:

> **Fail the migration instead of allowing the migration itself to become the cause of an outage.**

This is an important production mindset.

A migration failing safely can be much better than a migration waiting indefinitely and blocking application traffic.

---

# 10. Backfilling Large Tables

Suppose you have:

```text
10 million rows
```

and want to populate a new column:

```sql
UPDATE users
SET full_name = name;
```

Doing this as one huge transaction is dangerous.

---

## What can go wrong?

A massive update can:

### 1. Hold locks

The large transaction keeps locks for a long time.

### 2. Increase WAL

PostgreSQL's **write-ahead log (WAL)** records changes needed for durability and recovery.

A huge update can generate a lot of WAL.

### 3. Affect replication

Large amounts of generated WAL can put pressure on replicas and make replication fall behind.

### 4. Put pressure on the running system

A giant transaction competes with normal production work.

So:

```text
UPDATE 10 million rows
        ↓
one giant transaction
        ↓
locks + huge WAL + replication pressure
```

---

# 11. Batch the Backfill

Instead of updating everything at once:

```text
10,000,000 rows
       ↓
one transaction ❌
```

process smaller batches:

```text
10,000 rows
   ↓ commit

10,000 rows
   ↓ commit

10,000 rows
   ↓ commit

...
```

Conceptually:

```text
Database
   │
   ├── batch 1 → commit
   ├── pause
   ├── batch 2 → commit
   ├── pause
   ├── batch 3 → commit
   └── ...
```

The lesson specifically recommends **batches with a pause**.

This is slower on paper, but much kinder to a running production system. 

---

## Why pause between batches?

The pause gives normal application traffic some breathing room.

Instead of:

```text
backfill
backfill
backfill
backfill
backfill
```

you get:

```text
backfill
pause
backfill
pause
backfill
pause
```

This reduces the pressure placed on the live system.

---

# 12. Every Migration Needs a Way Back

A migration should have a recovery strategy.

Sometimes that means a down migration:

```text
up migration
    ↓
change schema

down migration
    ↓
reverse schema change
```

For example:

```text
ADD COLUMN
    ↓
DROP COLUMN
```

But not every change is safely reversible.

---

# 13. Backup Is Not Automatically a Recovery Plan

Sometimes the answer is:

```text
restore from backup
```

But that only counts as a real recovery strategy if the restore process has been tested.

A backup that has never been restored is not something you should blindly trust during an incident.

Think:

```text
Backup exists
     ≠
Restore works
```

A real recovery plan requires confidence that the restore process actually works.

---

# 14. Destructive Changes Need Extra Care

Some schema operations destroy information.

Examples:

```sql
DROP COLUMN name;
```

or:

```sql
DROP TABLE users;
```

Once the data is removed, a simple migration script may not be able to bring it back.

Therefore, destructive operations should generally be separated into a later deployment.

The safe progression is:

```text
1. Stop using old data
        ↓
2. Deploy new code
        ↓
3. Verify everything
        ↓
4. Wait until confident
        ↓
5. Perform destructive change
```

This gives you time to detect problems before deleting the old structure.

---

# 15. The Complete Mental Model

The entire lesson can be remembered as:

```text
              LIVE APPLICATION
                     │
          old + new code coexist
                     │
                     ↓
          ┌──────────────────┐
          │      EXPAND      │
          │ Add new schema   │
          │ Keep old schema  │
          └────────┬─────────┘
                   ↓
          ┌──────────────────┐
          │    BACKFILL      │
          │ Copy old data    │
          │ in small batches │
          └────────┬─────────┘
                   ↓
          ┌──────────────────┐
          │     MIGRATE      │
          │ New code uses    │
          │ new schema       │
          └────────┬─────────┘
                   ↓
          ┌──────────────────┐
          │    CONTRACT      │
          │ Remove old       │
          │ schema           │
          └──────────────────┘
```

The core principle is:

> **Never make a schema change incompatible with code that may still be running.**

---

# 16. Common Mistakes / Gotchas

## Mistake 1: Renaming immediately

```sql
ALTER TABLE users
RENAME COLUMN name TO full_name;
```

### Problem

Old application instances may still query:

```sql
SELECT name FROM users;
```

### Safer approach

Use:

```text
Expand → Backfill → Migrate → Contract
```

---

## Mistake 2: Assuming `ADD COLUMN` is always cheap

A nullable column with no default is usually safe.

But defaults and constraints can change the cost.

Especially consider:

```text
NOT NULL
DEFAULT
volatile default
large table
PostgreSQL version
```

Check the behavior before running a migration on millions of rows.

---

## Mistake 3: Using plain `CREATE INDEX` on a live large table

```sql
CREATE INDEX ...
```

can block writes while the index is being built.

For a live system, consider:

```sql
CREATE INDEX CONCURRENTLY ...
```

and remember its trade-offs.

---

## Mistake 4: Forgetting that concurrent index creation can fail

A failed concurrent build can leave an invalid index.

Check it afterward.

---

## Mistake 5: Letting a migration wait forever

A migration waiting for a lock can become part of a larger lock queue.

Use a short:

```sql
lock_timeout
```

so the migration fails rather than creating an outage.

---

## Mistake 6: Backfilling everything in one transaction

Avoid:

```sql
UPDATE ...;
```

over millions of rows as one giant transaction.

Prefer:

```text
small batch
   ↓
commit
   ↓
pause
   ↓
next batch
```

---

## Mistake 7: Treating "we have a backup" as enough

A backup is only useful if restoration has been tested.

Remember:

```text
backup ≠ tested recovery
```

---

## Mistake 8: Dropping old columns too early

Do not remove the old column immediately after deploying new code.

First establish that:

```text
nothing reads old column
```

Then contract.

---

# 17. Quick Comparison

| Situation                 | Risk                                    | Safer approach                           |
| ------------------------- | --------------------------------------- | ---------------------------------------- |
| Rename a column           | Old code still expects old name         | Expand → Backfill → Migrate → Contract   |
| Add nullable column       | Usually low risk                        | Add it without unnecessary defaults      |
| Add `NOT NULL` + default  | May have significant migration cost     | Check PostgreSQL/version behavior        |
| Normal index creation     | Can block writes                        | Consider `CONCURRENTLY`                  |
| Concurrent index creation | Slower, no transaction, can fail        | Use on live systems and verify afterward |
| Huge backfill             | Locks, WAL growth, replication pressure | Small batches + pauses                   |
| Lock acquisition          | Can create a queue/outage               | Short `lock_timeout`                     |
| Drop column/table         | Destructive                             | Do it in a later deployment              |
| Restore from backup       | Only useful if proven                   | Test restores                            |

---

# 18. Interview Questions

### Q1. Why can't you simply rename a database column in one deployment?

Because old and new application code can run simultaneously. Old code may still query the old column name, so removing it immediately can make those requests fail.

---

### Q2. What is the Expand → Backfill → Migrate → Contract pattern?

```text
Expand
→ add new schema

Backfill
→ copy existing data

Migrate
→ deploy code using the new schema

Contract
→ remove the old schema after nothing depends on it
```

It allows schema and application changes to remain compatible during deployment.

---

### Q3. Why should a large backfill be done in batches?

A giant transaction can hold locks, generate large amounts of WAL, and put pressure on replication and the running system.

Small committed batches are slower on paper but safer for a live system.

---

### Q4. Why use `CREATE INDEX CONCURRENTLY`?

A normal `CREATE INDEX` can block writes while the index is built. `CREATE INDEX CONCURRENTLY` avoids that write blocking at the cost of being slower and not being usable inside a transaction.

---

### Q5. What happens if an `ALTER TABLE` waits for a long-running transaction?

The `ALTER TABLE` can wait for the required lock. New queries may then queue behind the waiting migration, potentially making the table unavailable.

---

### Q6. Why use `lock_timeout`?

To make the migration give up after a short wait instead of allowing a blocked migration to contribute to an outage.

---

### Q7. Why should destructive migrations be delayed?

Operations such as dropping columns or tables are difficult or impossible to reverse with a simple migration. Delaying them gives you time to verify that the old schema is no longer needed.

---

# 19. Minimal Self-Test

Try answering these without looking above:

1. Why can old and new application code exist simultaneously during a deployment?
2. Why is directly renaming a column dangerous?
3. What are the four stages of a safe schema migration?
4. Why is the new column often made nullable during the expand phase?
5. Why should large backfills be split into batches?
6. What problems can a huge transaction cause?
7. What is WAL?
8. Why can a normal `CREATE INDEX` be dangerous on a live system?
9. What does `CREATE INDEX CONCURRENTLY` change?
10. What is the trade-off of concurrent index creation?
11. Why can an invalid index remain after a failed concurrent build?
12. How can a waiting `ALTER TABLE` cause other queries to queue?
13. Why is `lock_timeout` useful?
14. Why is a backup not enough unless restoration is tested?
15. Why should `DROP COLUMN` usually happen in a later deployment?

---

# Key Takeaways

* **Old and new code can run at the same time during deployment.**
* Every schema change must therefore consider **backward compatibility**.
* A column rename should usually use:
  **Expand → Backfill → Migrate → Contract**.
* Adding a new nullable column without a default is usually straightforward.
* PostgreSQL behavior around defaults depends on the type of default and version.
* Normal index creation can block writes on a live table.
* `CREATE INDEX CONCURRENTLY` avoids that write blocking but is slower and cannot run inside a transaction.
* A failed concurrent index build can leave an invalid index, so check afterward.
* A migration waiting for a lock can cause **other queries to queue behind it**.
* Use a short **`lock_timeout`** to fail safely instead of turning the migration into an outage.
* Backfill large tables using **small batches with commits and pauses**.
* Large transactions can cause lock pressure, WAL growth, and replication problems.
* Every migration needs a **recovery strategy**.
* A backup is only a real recovery option if **restore has been tested**.
* Destructive changes such as dropping columns or tables should happen **later**, after the old schema is confirmed to be unused.
