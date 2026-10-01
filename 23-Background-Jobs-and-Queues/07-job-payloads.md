# Keep Job Payloads Small and Stable

A job should generally contain an **ID**, not the entire database record.

Bad:

```json
{
  "user": {
    "id": 42,
    "name": "Rahul",
    "email": "old@example.com",
    "plan": "free"
  }
}
```

Better:

```json
{
  "userId": 42
}
```

Then the worker fetches the current record:

```text
Queue
  ↓
{ userId: 42 }
  ↓
Worker
  ↓
Database
  ↓
SELECT user WHERE id = 42
  ↓
Current record
```

---

# Why Sending the Whole Record Is Dangerous

Suppose the record looks like this when the job is created:

```text
User 42
email = old@example.com
plan = free
```

The job stores the entire record.

Then, before the worker executes:

```text
User 42
email = new@example.com
plan = premium
```

The database now contains the current state.

But the queue contains:

```text
old@example.com
free
```

So the worker may process **stale data**.

This creates a subtle bug because the stale copy may look perfectly valid.

Instead:

```text
Job payload:
    userId = 42
```

Then:

```text
Worker
  ↓
read user 42
  ↓
get current state
```

The source describes this as one database query that removes the entire stale-copy problem. 

---

# Small and Stable Payloads

A good job payload is usually something like:

```json
{
  "jobId": "abc123",
  "orderId": 456
}
```

rather than:

```json
{
  "order": {
    "id": 456,
    "customer": "...",
    "items": [...],
    "address": "...",
    "payment": "...",
    "..."
  }
}
```

The smaller payload is easier to:

* store
* serialize
* transfer
* reason about
* keep compatible over time

Most importantly, the worker can retrieve fresh state when it executes.
