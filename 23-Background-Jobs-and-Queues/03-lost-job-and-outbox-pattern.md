# The Classic Lost-Job Problem

One of the most important problems with background jobs is:

> **What happens if the database write succeeds but the job is never queued?**

Consider creating an order.

Naive implementation:

```text
BEGIN

Create order
   ↓
COMMIT

Push job to queue
   ↓
Process crashes
```

Suppose the order was successfully committed.

Then:

```text
Database:
    Order #123 exists

Queue:
    No job for Order #123
```

Now nobody will process the order.

The job has been **lost**.

---

## Timeline of the failure

```text
Time ─────────────────────────────────────>

1. Write order
       ↓
2. COMMIT
       ↓
3. Database now contains order
       ↓
4. Push job
       ↓
       💥 PROCESS CRASHES
```

Result:

```text
Order exists
+
Job does not exist
=
Work is never processed
```

This is why the lesson says:

> **Enqueue in the same transaction as the write, or you will lose jobs.** 

---

# Transactional Outbox Pattern

The solution presented in the lesson is the **outbox pattern**.

Instead of directly depending on:

```text
Database transaction
      +
Queue operation
```

you write the job into a database table as part of the same transaction.

Conceptually:

```text
BEGIN TRANSACTION

    Insert order
        +
    Insert outbox job

COMMIT
```

Both happen together.

So:

```text
Transaction succeeds
       ↓
Order exists
       +
Outbox job exists
```

Or:

```text
Transaction fails
       ↓
Order does not exist
       +
Outbox job does not exist
```

This gives you:

```text
Both happen
OR
Neither happens
```

rather than:

```text
Order happens
but
job disappears
```

### Example

Suppose we have:

```text
orders
--------------------------------
id     user_id     amount
123    42          500
```

And:

```text
outbox
--------------------------------
id     type             payload
1      ProcessOrder     {"id":123}
```

Both rows are created inside the same database transaction.

A separate process can then read the outbox and publish the job to the actual queue.

### Key idea

The important thing is not merely "use a queue."

The important guarantee is:

```text
Durable business data
       +
Durable record of work
```

must not be separated by a crash window.

The lesson explicitly points to **microservices.io's Transactional Outbox** as further reading. 
