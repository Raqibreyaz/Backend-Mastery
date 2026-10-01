# Job Ordering Is Not Automatically Guaranteed

Suppose you have two jobs:

```text
Job A
Job B
```

You might assume:

```text
A finishes
   ↓
B finishes
```

But with multiple workers:

```text
             ┌── Worker 1 ── Job A ── slow
Queue ───────┤
             └── Worker 2 ── Job B ── fast
```

The result may be:

```text
B finishes
before
A
```

So:

```text
Submitted:
A → B

Completed:
B → A
```

---

# Why Ordering Can Matter

Suppose two jobs modify the same record.

```text
Job A:
balance = 100

Job B:
balance = 200
```

If they run in the wrong order, the final state may be wrong.

Another example:

```text
Job A → create account
Job B → update account
```

If B runs first, the system may not find the account.

With multiple workers, operations can **interleave**.

---

# How to Handle Ordering

The source gives two approaches.

## Approach 1: Key the queue

Send all jobs for the same record to the same worker/partition.

For example:

```text
record ID = 123

Job A → key 123
Job B → key 123
Job C → key 123
```

They are routed together.

Conceptually:

```text
Key 123
   ↓
Worker 3
   ├── Job A
   ├── Job B
   └── Job C
```

This helps preserve ordering for that key.

---

## Approach 2: Make operations commutative

A **commutative operation** is one where changing the order does not change the result.

For example:

```text
10 + 5 = 15
5 + 10 = 15
```

So addition is commutative.

If possible, designing operations this way reduces the need to depend on strict execution order.

---

# Scheduled Jobs Need a Lock

Scheduled jobs create another problem.

Suppose you have:

```text
cron: every hour
```

and your application has three instances:

```text
Instance 1 ── cron
Instance 2 ── cron
Instance 3 ── cron
```

If all three execute the scheduler:

```text
Instance 1 → run job
Instance 2 → run job
Instance 3 → run job
```

The job runs **three times**.

---

## Distributed lock

A scheduler needs some form of lock:

```text
Instance 1 ──┐
Instance 2 ──┼──> Lock
Instance 3 ──┘
                ↓
           Only one runs
```

For example:

```text
Acquire lock
    ↓
Success?
 /      \
YES      NO
 ↓        ↓
run      skip
```

The lesson gives the rule:

> A cron running on three instances runs three times.

Therefore, whatever schedules the job needs a lock, **or the job itself must tolerate concurrent runs**. 

Notice how this comes back to the same principle:

```text
Concurrency
    ↓
Possible duplicate execution
    ↓
Idempotency
```
