# Retries

Background jobs often fail temporarily.

Examples:

* Third-party API is temporarily unavailable
* Network connection fails
* Database is temporarily unavailable
* Service returns a temporary error

A retry can solve these cases.

But retrying forever is dangerous.

---

# Exponential Backoff

Instead of immediately retrying over and over:

```text
fail
retry
fail
retry
fail
retry
...
```

use **exponential backoff**.

The waiting period grows after each failure.

For example:

```text
Attempt 1 → fail
wait 1 second

Attempt 2 → fail
wait 2 seconds

Attempt 3 → fail
wait 4 seconds

Attempt 4 → fail
wait 8 seconds
```

Conceptually:

```text
retry delay
   ↑
   │             *
   │          *
   │       *
   │    *
   │  *
   └────────────────→ attempts
```

The exact delays depend on the system, but the key idea is:

> **Do not hammer a failing dependency continuously.**

---

# Retries Need a Limit

Retries should eventually stop.

For example:

```text
Attempt 1 → fail
Attempt 2 → fail
Attempt 3 → fail
Attempt 4 → stop
```

Why?

Because some failures are permanent.

Examples:

```text
Malformed payload
Deleted record
Invalid data
```

Retrying these forever will never fix them.

The source describes this as giving retries both:

* a **limit**
* a **resting place**

That resting place is the **dead-letter queue**. 

---

# Dead-Letter Queue (DLQ)

A **dead-letter queue** stores jobs that have failed too many times.

Example:

```text
Main Queue
    ↓
Worker
    ↓
failure
    ↓
retry
    ↓
failure
    ↓
retry
    ↓
failure
    ↓
too many attempts
    ↓
Dead-Letter Queue
```

Instead of:

```text
bad job
 ↓
retry forever
 ↓
worker permanently occupied
```

we get:

```text
bad job
 ↓
limited retries
 ↓
DLQ
 ↓
human/system can inspect it
```

---

## Why this matters

Imagine a job contains malformed data:

```json
{
  "userId": null
}
```

Every attempt fails.

If you retry forever:

```text
Worker
 ↓
bad job
 ↓
fail
 ↓
retry
 ↓
fail
 ↓
retry
 ↓
...
```

That worker keeps spending time on work that can never succeed.

The queue may even appear healthy if you only look at queue depth.

For example:

```text
Queue depth = 10
```

looks fine.

But perhaps those 10 jobs are permanently failing.

So:

```text
Queue depth alone
       ≠
System is making progress
```

---

# Failed Jobs Must Be Visible

A system should not silently lose failed work.

The lesson's idea is:

> A queue with no visibility into failures is a place where work goes to die quietly.

At minimum, monitor:

```text
Dead-lettered job count
```

and alert when that count changes.

For example:

```text
DLQ jobs = 0
       ↓
job fails repeatedly
       ↓
DLQ jobs = 1
       ↓
🚨 alert
```

This gives operators a chance to investigate.
