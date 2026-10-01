# Complete Mental Model

Put all the pieces together:

```text
                    HTTP Request
                         │
                         ▼
                    Validate
                         │
                         ▼
              Durable database write
                         │
                         │ same transaction
                         ▼
                  Outbox record
                         │
                         ▼
                    Queue
                         │
                         ▼
                     Worker
                         │
              ┌──────────┴──────────┐
              │                     │
          Already done?          Not done
              │                     │
             YES                    ▼
              │                Perform work
              │                     │
              │                Record result
              │                     │
              └─────────────┬───────┘
                            ▼
                         Success
```

If something fails:

```text
Worker
  ↓
failure
  ↓
retry with exponential backoff
  ↓
failure
  ↓
retry
  ↓
too many failures
  ↓
Dead-Letter Queue
  ↓
Alert / investigate
```

And the HTTP request can return:

```http
202 Accepted
```

while the worker continues in the background.

---

# Comparison: Request Work vs Background Work

| Request work                              | Background work                                            |
| ----------------------------------------- | ---------------------------------------------------------- |
| User waits for response                   | User does not wait for completion                          |
| Should generally be quick                 | Can take longer                                            |
| Directly affects request latency          | Happens asynchronously                                     |
| Timeout affects the user request          | Worker can continue independently                          |
| Good for validation and durable writes    | Good for email, PDFs, image processing, slow third parties |
| Response may be `200`/`201` when complete | Often `202 Accepted` when accepted but unfinished          |

The key question is:

> **Does the caller actually need to wait for this operation to finish?**

If not, background processing may be appropriate.

---

# Important Guarantees to Remember

A robust background-job system should think about these guarantees separately:

```text
Durability
    ↓
Will the job be lost?

Delivery
    ↓
Can the job be delivered again?

Idempotency
    ↓
Is duplicate execution safe?

Retries
    ↓
What happens when temporary failures occur?

Dead-lettering
    ↓
What happens when a job can never succeed?

Visibility
    ↓
Can we see failed work?

Ordering
    ↓
Does execution order matter?

Concurrency
    ↓
Can multiple workers/schedulers execute the same work?

Payload freshness
    ↓
Will the worker use current data?
```

These are different problems. A queue by itself does not automatically solve all of them.
