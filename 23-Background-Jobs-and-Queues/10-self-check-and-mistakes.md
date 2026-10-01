# The Three Self-Check Questions

The lesson asks three questions.

## Question 1

You commit the order, then push a job to the queue, and the process dies in between.

What happens?

The important state is:

```text
Order exists
+
Job does not exist
```

Therefore:

> **The order exists and no job will ever process it.**

This is exactly the failure the **transactional outbox** pattern addresses.

---

## Question 2

Why must a job be safe to run twice, even with a well-behaved queue?

Because:

```text
Worker finishes
      ↓
Worker crashes before acknowledgement
      ↓
Queue thinks job was not completed
      ↓
Job appears again
```

Therefore:

> **A worker that finishes and crashes before acknowledging will see the job again.**

---

## Question 3

Why put an ID in the job payload rather than the full record?

Because:

```text
enqueue
   ↓
record changes
   ↓
worker executes
```

The full record stored in the queue may now be stale.

Therefore:

> **The record may change between enqueue and execution, and the copy would be stale.**

---

# Common Mistakes / Gotchas

## Mistake 1: Doing slow work inside the request

Bad:

```text
Request
 ↓
Generate PDF
 ↓
Send email
 ↓
Call third party
 ↓
Response
```

Problem:

* request takes longer
* request timeout becomes a problem
* external services can block your request

---

## Mistake 2: Saving the database row and queueing separately

Bad:

```text
COMMIT database
      ↓
enqueue
      ↓
💥 crash
```

You can end up with durable data but no job.

Use the outbox pattern to avoid this gap.

---

## Mistake 3: Assuming a job executes exactly once

Do not assume:

```text
one job → one execution
```

Instead assume:

```text
one job → one or more executions
```

Design the job to be idempotent.

---

## Mistake 4: Retrying forever

Bad:

```text
failure
 ↓
retry
 ↓
failure
 ↓
retry
 ↓
forever
```

Use:

```text
limited retries
+
exponential backoff
+
dead-letter queue
```

---

## Mistake 5: Ignoring failed jobs

If you cannot see your failed jobs:

```text
job fails
 ↓
disappears
```

You have no idea what happened.

At minimum monitor:

```text
dead-lettered job count
```

and alert when it changes.

---

## Mistake 6: Assuming queue order

With multiple workers:

```text
A submitted first
B submitted second
```

does not necessarily mean:

```text
A finishes first
B finishes second
```

If ordering matters, explicitly design for it.

---

## Mistake 7: Running cron on every application instance

Three instances can produce:

```text
3 instances
   ↓
3 schedulers
   ↓
3 executions
```

Use a lock or make the scheduled operation safely idempotent.

---

## Mistake 8: Putting the entire database record into the job

Bad:

```json
{
  "order": { "... huge record ..." }
}
```

Better:

```json
{
  "orderId": 123
}
```

Then load the current record when the worker runs.

---

# Key Takeaways

* Some work should **not happen inside the HTTP request**.
* Use the pattern:

```text
Accept → Enqueue → Answer
```

* `202 Accepted` means **the work was accepted**, not that it has completed.
* Do not separately commit a database write and then enqueue a job without considering the crash window.
* The **transactional outbox pattern** records the work durably in the same transaction as the business data.
* Background jobs should be treated as **at-least-once**.
* At-least-once means the same job may execute more than once.
* Therefore, jobs should be **idempotent**.
* Retries should use **exponential backoff**.
* Retries need a **limit**.
* Permanently failing jobs should go to a **dead-letter queue**.
* Failed jobs must be **visible and monitored**.
* Queue ordering is **not automatically guaranteed** with multiple workers.
* If order matters, use per-record queue keys/partitioning or make operations commutative.
* Scheduled jobs need a **lock**, or the job must tolerate concurrent execution.
* Keep job payloads **small and stable**.
* Prefer:

```json
{
  "id": 123
}
```

over embedding the entire database record.

* Fetch the current record when the worker executes.

---

# Minimal Self-Test

Try answering these without looking above:

1. Why is doing a slow third-party API call inside an HTTP request dangerous?
2. What exactly does `202 Accepted` communicate?
3. What failure occurs if you commit a database row and crash before enqueueing the job?
4. How does the transactional outbox pattern solve that failure?
5. Why can a successfully completed job execute again?
6. What does **at-least-once** mean?
7. What does **idempotent** mean for a background job?
8. Why should retries use exponential backoff?
9. Why can't a permanently failing job be retried forever?
10. What is a dead-letter queue?
11. Why isn't queue depth alone enough to know whether the system is healthy?
12. Why can job B finish before job A?
13. How can you preserve ordering for jobs belonging to the same record?
14. Why can a cron job execute three times when the application has three instances?
15. Why is putting `orderId` in a job usually better than putting the entire order object in it?
16. What should `runJob()` do if `store[job.id]` already exists?
17. What should happen to the store if `handler(job)` throws?
18. At what attempt does the exercise mark the job as `dead`?

---

# What to Learn Next

The lesson itself connects naturally to:

```text
Background Jobs & Queues
        ↓
Transactional Outbox
        ↓
Idempotency
        ↓
Retries + Exponential Backoff
        ↓
Dead-Letter Queues
        ↓
Distributed Locks
        ↓
Observability
```

The provided lesson also links to **Transactional Outbox** and **MDN's documentation for `202 Accepted`** for deeper reading. 
