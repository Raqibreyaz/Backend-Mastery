# Background Jobs and Queues

## What it is

A **background job** is work that does not need to finish while the user is waiting for an HTTP request.

Examples:

* Sending an email
* Generating a PDF
* Calling a slow third-party API
* Resizing an image
* Processing a large file

Instead of making the request wait for all this work, the server accepts the request, puts the work into a **queue**, and lets a **worker** process it later.

The lesson focuses on two things:

1. **Work that should happen outside the request**
2. **What happens when background work fails**

The original lesson describes this as an 18-minute lesson on background jobs and queues. 

---

## One-sentence summary

**Take the request, save the work safely, put a small job in the queue, process it even if it runs more than once, retry failures a few times, and keep track of failures and job order.**

---

# Intuition

Imagine a restaurant.

A customer orders food.

The waiter should:

```text
Take order
   ↓
Record order
   ↓
Give it to kitchen
   ↓
Tell customer "Order accepted"
```

The waiter should **not** stand there cooking the food.

Similarly, an HTTP request should not necessarily do:

```text
HTTP request
   ↓
Send email
   ↓
Generate PDF
   ↓
Resize image
   ↓
Call third-party API
   ↓
Finally respond
```

Instead:

```text
Client
  │
  │ request
  ▼
API Server
  │
  ├── validate
  ├── save durable data
  └── enqueue job
          │
          ▼
       Queue
          │
          ▼
       Worker
          │
          └── perform slow work
```

The user gets a response without waiting for the background work to finish.
