# Why Some Work Should Not Happen Inside the Request

Some operations are slow or depend on systems outside your control.

For example:

```text
POST /send-report

Server:
    generate PDF
        ↓
    contact email provider
        ↓
    send email
        ↓
    return response
```

This creates a problem.

If the email provider takes 20 seconds, your request may also take 20 seconds.

If the request timeout is 10 seconds:

```text
Your server ────────────────> Email server
       │
       │ waiting...
       │
       X timeout
```

Your request has effectively become dependent on somebody else's system.

The source specifically gives these examples:

* sending an email
* generating a PDF
* calling a slow third party
* resizing an image

The caller usually does **not** need to wait for these operations to finish. 

---

# The Basic/Fundamental Pattern: Accept, Enqueue, Answer

The key pattern is:

> **Accept, enqueue, answer.**

The flow is:

```text
1. Validate request
       ↓
2. Write what must be durable
       ↓
3. Put job on queue
       ↓
4. Return 202 Accepted
       ↓
5. Worker processes job later
```

## Why `202 Accepted`?

`202 Accepted` means:

> "I have accepted this work."

It does **not** mean:

> "The work is finished."

For example:

```http
POST /reports
```

The server may respond:

```http
HTTP/1.1 202 Accepted
```

with something like:

```json
{
  "jobId": "job_123",
  "statusUrl": "/jobs/job_123"
}
```

The client can then check:

```http
GET /jobs/job_123
```

and receive:

```json
{
  "status": "processing"
}
```

Later:

```json
{
  "status": "completed"
}
```

### Important distinction

```text
202 Accepted
      ≠
Completed
```

The status code should make this distinction clear instead of hiding it in some vague response message. 
