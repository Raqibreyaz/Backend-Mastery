# At-Least-Once Processing

A queue normally cannot safely promise:

> "This job will execute exactly once."

Instead, you should design around:

> **At least once**

That means a job will be processed one or more times.

Usually:

```text
1 time
```

but sometimes:

```text
2 times
3 times
...
```

The reason is a small failure window.

---

## The crash-after-success problem

Imagine:

```text
Queue
  ↓
Worker receives job
  ↓
Worker performs work successfully
  ↓
Worker crashes
  ↓
Worker never acknowledges job
```

The queue does not know that the work actually finished.

So it may deliver the job again:

```text
Job
 ↓
Worker
 ↓
SUCCESS
 ↓
💥 crash before acknowledgement
 ↓
Job delivered again
 ↓
Worker
```

Therefore:

```text
At-least-once delivery
        ↓
Potential duplicate execution
        ↓
Job must be idempotent
```

The source explicitly states that a worker can crash after finishing but before acknowledging, causing the job to appear again. 

---

# Idempotency

**Idempotent** means:

> Running the same operation multiple times should not produce an incorrect additional effect.

For background jobs, this is essential.

## Example: Sending an email

Suppose the job is:

```json
{
  "type": "send_email",
  "orderId": 123
}
```

If the worker executes twice:

```text
Attempt 1 → send email
Attempt 2 → send email again
```

The user may receive two emails.

Instead, the worker should be able to determine:

```text
Was this email already sent?
```

For example:

```text
email_sent = true
```

If it has already been sent:

```text
Skip
```

---

## Example: Conditional update

Suppose a job marks an order as processed.

Unsafe:

```sql
UPDATE orders
SET status = 'processed'
WHERE id = 123;
```

Depending on the operation, running this repeatedly may not give you enough protection against duplicate side effects.

A safer pattern can involve a condition representing the expected state:

```sql
UPDATE orders
SET status = 'processed'
WHERE id = 123
  AND status = 'pending';
```

Now the second attempt does not perform the transition again.

The lesson gives several examples of idempotency:

* check whether an email was already sent
* use the record ID rather than "the newest record"
* make the update conditional

The source also points out that this is the **same discipline as an idempotent HTTP endpoint**, because the underlying problem is similar: the same operation may be performed more than once. 

---

# Why "At Least Once" Changes How You Write Workers

You should mentally assume:

```text
worker(job)
```

may be called multiple times for the same job.

So avoid code that assumes:

```text
"This can only happen once."
```

Instead:

```text
if already_done(job.id):
    skip

perform_work()

record_done(job.id)
```

Conceptually:

```text
             ┌──────────────────┐
             │ Receive job      │
             └────────┬─────────┘
                      ↓
             Already processed?
                /           \
              YES            NO
               ↓              ↓
             Skip         Perform work
                              ↓
                         Record result
```
