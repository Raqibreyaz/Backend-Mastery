# Documentation Somebody Can Actually Use (API Contracts & README Design)

## What it is

Good technical documentation should let **someone who has never seen the repository**:

1. Understand what the project is.
2. Run it successfully.
3. Call its API correctly.
4. Understand important things before changing it.

The source describes documentation mainly through the example of a backend/API repository. The key idea is that documentation is useful only when another developer can actually use it without having to ask the original author for help. 

---

## One-sentence summary

> **Good documentation answers what the project is, how to run it, how to use it, and what important decisions or constraints must be understood before modifying it.**

---

## Intuition

Think of documentation as a **handover to a developer who knows nothing about your project**.

Imagine you give someone your Git repository and disappear.

Can they:

```text
Clone repository
      ↓
Install dependencies
      ↓
Configure environment
      ↓
Start database
      ↓
Start application
      ↓
Call API
      ↓
Understand responses/errors
      ↓
Safely modify the system
```

If they get stuck and need to message you, the documentation has missed something.

The source puts this very simply:

> Documentation is judged by whether someone who has never seen the repository can get it running and call it correctly without asking you. 

---

# 1. The Four Questions Documentation Must Answer

A useful README should answer four questions **in this order**:

```text
1. What is this?
        ↓
2. How do I run it?
        ↓
3. How do I call it?
        ↓
4. What do I need to know before I change it?
```

These correspond roughly to the urgency of someone arriving at the repository.

### 1. What is this?

Give the reader enough context to understand the project.

Example:

```text
This is a REST API for managing customer orders.

It provides endpoints for:
- creating orders
- retrieving orders
- cancelling orders
```

The reader should not have to inspect 30 files just to discover what the project does.

---

### 2. How do I run it?

Give exact setup instructions.

For example:

```bash
git clone <repository>
cd orders-api
npm install
```

Then explain the database and environment configuration:

```text
1. Start PostgreSQL.
2. Create the orders database.
3. Copy .env.example to .env.
4. Fill in the required values.
5. Run database migrations.
6. Start the application.
```

The important part is that these are **copyable steps in the correct order**.

---

### 3. How do I call it?

Explain the API contract.

The reader needs to know things such as:

```text
HTTP method
Path
Request body
Response body
Status codes
Error codes
```

For example:

```text
POST /users
```

Request:

```json
{
  "email": "alice@example.com",
  "name": "Alice"
}
```

Response:

```json
{
  "id": "123",
  "email": "alice@example.com",
  "name": "Alice"
}
```

But this is still incomplete.

The caller also needs to know possible status codes.

For example:

```text
201 → user created
400 → invalid request
409 → email already exists
500 → unexpected server error
```

The source specifically highlights `409`: the caller needs to know that it means **the email is already taken**, because that determines what branch the client needs to implement. 

---

### 4. What should I know before changing it?

This is where architectural knowledge belongs.

For example:

```text
Why is this operation synchronous?

Why don't we use a queue?

Why is this database table structured this way?

Why does this endpoint behave differently?

Why is this operation not retried?
```

Some of these answers cannot be discovered simply by reading the current code.

That reasoning should be documented.

---

# 2. Setup Instructions Must Be Reproducible

## The problem with vague instructions

This is bad:

```text
Install the dependencies and run it.
```

Why?

Because it assumes the developer already knows:

* which dependencies to install
* which database to use
* how to start the database
* which environment variables are required
* how to configure `.env`
* whether migrations are needed
* which command starts the server

The source explicitly says:

> `"Install the dependencies and run it"` is not instructions. 

---

## Good setup instructions

A good setup section should look like a **copyable sequence**.

Example:

```bash
git clone <repository-url>
cd project

npm install

cp .env.example .env

# Start PostgreSQL

npm run migrate

npm run dev
```

Then explain anything that cannot be expressed as a command.

For example:

```text
DATABASE_URL must point to the PostgreSQL database.

PORT controls the HTTP server port.

STRIPE_KEY is required for payment operations.
```

---

# 3. Test Documentation on a Fresh Machine

One of the most useful techniques from the source is:

> Test the setup instructions on a machine that has never run the project. 

Why?

Because developers naturally forget the steps they performed months ago.

You might think:

```text
"Obviously, everyone knows they need to start PostgreSQL."
```

But that may only be obvious because **you already know it**.

A fresh setup exposes hidden assumptions.

### Mental model

```text
Your normal machine

Project
  +
cached dependencies
  +
existing database
  +
existing .env
  +
previous migrations
  +
system packages
  ↓
"Everything works!"
```

This can create a false sense that the README is complete.

A clean machine removes those hidden advantages:

```text
Fresh machine
    ↓
Follow README only
    ↓
Anything missing becomes visible
```

---

# 4. API Documentation Should Be a Contract

The source makes an important distinction:

> Document endpoints as a **contract**, not as a tour. 

A tour describes what the API looks like.

A contract tells the caller **exactly what they can rely on**.

For each endpoint, document:

| Item         | Meaning                              |
| ------------ | ------------------------------------ |
| Method       | `GET`, `POST`, `PUT`, `DELETE`, etc. |
| Path         | Endpoint URL                         |
| Request body | Required input                       |
| Response     | What the server returns              |
| Status codes | Possible outcomes                    |
| Meaning      | What each status code represents     |

Example:

```text
POST /payments
```

### Request

```json
{
  "amount": 1000,
  "currency": "USD"
}
```

### Possible responses

```text
201 Created
    Payment created.

400 Bad Request
    Invalid payment data.

409 Conflict
    Payment already exists.

402 Payment Required
    Payment could not be completed.
```

The important part is not merely listing the codes.

Explain **what they mean**.

---

# 5. Why Status Codes Matter More Than Just Field Lists

Suppose the API documentation says:

```text
Response fields:
- id
- email
- name
```

That's useful, but it doesn't tell the client what to do when something goes wrong.

Suppose instead it documents:

```text
409 Conflict
Email is already registered.
```

Now the client knows it needs a specific branch:

```javascript
if (response.status === 409) {
    showEmailAlreadyTakenMessage();
}
```

So:

```text
Fields
  ↓
Tell you what data looks like

Status codes
  ↓
Tell you what your program needs to do
```

This is why the source says status codes determine the branches the caller has to write. 

---

# 6. Give One Real Example Per Endpoint

A real example is often more useful than a large field table.

The source recommends **one worked example per endpoint**, preferably using `curl`, with a real request body and real response. 

Example:

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "name": "Alice"
  }'
```

Response:

```json
{
  "id": "123",
  "email": "alice@example.com",
  "name": "Alice"
}
```

Why is this powerful?

Because developers naturally do:

```text
Copy
 ↓
Paste
 ↓
Change a few values
 ↓
Run
```

A working example reduces the amount of interpretation required.

---

# 7. Errors Deserve Their Own Section

Errors are not an afterthought.

A good API documentation should have something like:

```text
## Errors
```

Then list the errors and tell callers what to do.

Example:

| Error                | Meaning                                                    | Retry?                   |
| -------------------- | ---------------------------------------------------------- | ------------------------ |
| `insufficient_funds` | Payment cannot be completed because funds are insufficient | No                       |
| `rate_limited`       | Too many requests                                          | Yes, after `Retry-After` |
| `invalid_request`    | Request data is invalid                                    | No                       |

---

## Example: `insufficient_funds`

```text
insufficient_funds
```

This is not normally a temporary failure.

Retrying immediately won't solve the underlying problem.

So the client should handle it as a non-retryable error.

---

## Example: `rate_limited`

```text
rate_limited
```

This may be temporary.

The server can provide:

```http
Retry-After: 30
```

The client should wait and then retry.

Conceptually:

```text
Request
  ↓
rate_limited
  ↓
Read Retry-After
  ↓
Wait
  ↓
Retry
```

Without documentation like this, every client developer has to guess.

The source's warning is important:

> Without clear error behavior, every client author guesses, and many will guess incorrectly. 

---

# 8. Document Decisions You Rejected

This is one of the most valuable ideas in the lesson.

Usually developers document:

```text
What we built
```

But they often don't document:

```text
What we considered
What we rejected
Why we rejected it
```

That reasoning can be extremely valuable.

---

## Example: synchronous vs queue

Suppose an operation takes about two seconds.

Someone later asks:

> Why don't we put this work into a queue?

Without documentation, they may spend hours investigating.

Instead, document:

```text
We considered moving this operation to a queue.

We rejected that approach because ordering is required.

A queue would make the ordering behavior more complicated.

To use a queue safely, we would first need to change the ordering requirement.
```

Now the next developer immediately understands the reasoning.

---

## Why this matters

The code tells you:

```text
WHAT the system does
```

Documentation can tell you:

```text
WHY it was designed this way
```

The source describes rejected decisions as part of the knowledge that **is not present in the code**. 

---

# 9. Generated Documentation vs Human Documentation

Generated documentation is useful.

But it has limits.

## Generated documentation

Tools such as OpenAPI can generate API reference information from the code.

This is excellent for things like:

```text
Field names
Types
Request structures
Response structures
Endpoint shapes
```

And an important advantage is that generated documentation can stay closer to the actual code.

---

## But generated documentation cannot explain meaning

For example, OpenAPI might tell you:

```text
idempotencyKey: string
```

But it may not explain the important behavior:

```text
If the same idempotency key is used twice,
creating the order is safe and does not create
a second order.
```

That is **behavioral meaning**, not merely API shape.

The source summarizes the distinction as:

```text
Generated documentation
        ↓
covers the shape

Human-written prose
        ↓
explains the meaning
```

So the recommended approach is:

> **Generate the reference. Write the prose.** 

---

# 10. API Shape vs API Meaning

This distinction is worth remembering.

### API shape

Answers:

```text
What fields exist?
What types do they have?
What endpoints exist?
What does the request look like?
```

Example:

```json
{
  "id": "string",
  "amount": "number"
}
```

### API meaning

Answers:

```text
What does this operation actually guarantee?

What happens if I repeat it?

Which errors should I retry?

What behavior must clients depend on?

Why does the API work this way?
```

Example:

```text
Using the same idempotency key twice
does not create a second order.
```

Both forms of documentation are useful.

---

# 11. Keep Documentation Short Enough to Maintain

A very important warning:

> A stale document can be worse than no document. 

Why?

Because developers tend to trust documentation.

Imagine the API changed:

```text
Old:
POST /users

New:
POST /accounts
```

But the README still says:

```text
POST /users
```

A new developer may follow the README and waste time debugging something that is not actually a code problem.

---

## The maintenance problem

A huge documentation system may start like this:

```text
Week 1
  ↓
Complete wiki
  ↓
Lots of documentation
```

Then:

```text
Month 2
  ↓
Code changes
  ↓
Wiki not updated
```

Eventually:

```text
Code ≠ Documentation
```

The source recommends keeping documentation short enough that the team will actually maintain it.

A small README that stays current is more useful than a large wiki that has not been touched for months. 

---

# 12. A Practical README Structure

Based directly on the four questions and the source's recommendations, a useful structure is:

```text
# Project Name

## What is this?
Short project explanation.

## Getting Started
Exact setup commands.

### Requirements
Required software.

### Environment
Required .env variables.

### Database
How to create/start/configure it.

### Run
Exact commands to start the project.

## API

### POST /users
Description.

Request:
...

Response:
...

Status codes:
...

curl example:
...

### GET /users/:id
Description.

Request:
...

Response:
...

Status codes:
...

curl example:
...

## Errors
List of error codes and what clients should do.

## Important Design Decisions
Why important choices were made.

## Before Changing This
Important constraints and behavior future developers need to understand.
```

This directly maps documentation to the questions a new developer will have.

---

# 13. A Complete Example

Suppose we have an API for creating users.

A useful endpoint section could look like:

````markdown
## POST /users

Creates a new user.

### Request

```json
{
  "email": "alice@example.com",
  "name": "Alice"
}
````

### Success

`201 Created`

```json
{
  "id": "usr_123",
  "email": "alice@example.com",
  "name": "Alice"
}
```

### Errors

`400 Bad Request`

The request body is invalid.

`409 Conflict`

The email is already registered.

### Example

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "name": "Alice"
  }'
```

````

Notice that the caller gets:

```text
What does it do?
      ↓
What do I send?
      ↓
What do I get?
      ↓
What can go wrong?
      ↓
What should I do?
      ↓
Give me something I can copy
````

That's much more useful than simply documenting:

```text
POST /users

email: string
name: string
```

---

# 14. Common Mistakes / Gotchas

## Mistake 1: "Install dependencies and run it"

Too vague.

### Better

Give exact commands and all prerequisites.

---

## Mistake 2: Documenting only successful responses

Bad:

```text
200 OK
User returned.
```

The client also needs to know:

```text
400?
401?
404?
409?
429?
500?
```

and what each means.

---

## Mistake 3: Listing status codes without meanings

This is still incomplete:

```text
200
400
404
409
500
```

Explain them:

```text
409 → email already exists
```

---

## Mistake 4: No real API examples

A table of fields requires the reader to construct the request themselves.

A working `curl` example gives them something they can immediately run and modify.

---

## Mistake 5: Only documenting what the code does

The code cannot always explain:

```text
Why this architecture exists
Why another approach was rejected
Why a strange constraint exists
Why something is synchronous
Why something cannot be retried
```

Document these decisions.

---

## Mistake 6: Assuming OpenAPI replaces documentation

OpenAPI can describe the **shape** of an API.

It does not automatically explain every important **behavioral meaning**.

---

## Mistake 7: Huge documentation nobody updates

More documentation is not automatically better.

A short, accurate README is better than a large, stale documentation system.

---

## Mistake 8: Testing setup only on the author's machine

Your machine may already have:

```text
Dependencies
Database
Environment variables
Migrations
Tools
Cached data
```

A fresh machine exposes missing instructions.

---

# 15. Documentation Quality Checklist

Before considering a backend README complete, ask:

### Project

* [ ] Does it explain what the project is?
* [ ] Can a stranger understand its purpose quickly?

### Setup

* [ ] Are commands given in exact order?
* [ ] Are dependencies explained?
* [ ] Is database setup documented?
* [ ] Is `.env` configuration documented?
* [ ] Can someone run it on a fresh machine?

### API

* [ ] Is every important endpoint documented?
* [ ] Is the HTTP method shown?
* [ ] Is the path shown?
* [ ] Is the request body explained?
* [ ] Is the response explained?
* [ ] Are possible status codes documented?
* [ ] Is the meaning of each status code explained?
* [ ] Is there a working example?

### Errors

* [ ] Are application error codes documented?
* [ ] Is each error's meaning explained?
* [ ] Is retry behavior explained?
* [ ] Are headers such as `Retry-After` documented where relevant?

### Architecture

* [ ] Are important design decisions documented?
* [ ] Are rejected alternatives documented?
* [ ] Are important constraints explained?
* [ ] Is behavioral meaning documented beyond API shape?

### Maintenance

* [ ] Is the documentation short enough to maintain?
* [ ] Is it updated when the API changes?
* [ ] Is it more trustworthy than an old wiki?

---

# 16. OpenAPI and Diátaxis

The lesson points to two resources for going deeper:

* **OpenAPI Specification** — for describing API contracts and machine-readable API definitions.
* **Diátaxis** — a framework for organizing technical documentation. 

The important idea from this lesson is not just learning a documentation tool.

It is understanding that documentation has different jobs:

```text
API reference
    ↓
What does this endpoint look like?

Human explanation
    ↓
What does this behavior mean?

Setup guide
    ↓
How do I get this running?

Design notes
    ↓
Why was it built this way?
```

---

# 17. Documentation Mental Model

A useful way to remember the entire lesson:

```text
                    GOOD DOCUMENTATION
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       SETUP              USAGE          KNOWLEDGE
          │                │                │
     Run project       Call API        Understand why
          │                │                │
     Exact commands     Contract       Decisions
     Database           Examples       Constraints
     .env               Errors         Rejected ideas
                         Status codes   Behavior
```

And the final maintenance layer:

```text
                GOOD DOCUMENTATION
                        │
                        ↓
                  Must stay current
                        │
                        ↓
              Short enough to maintain
```

---

# Key Takeaways

* Documentation is successful when a **new person can use the repository without asking the author**.
* The four core questions are:

  1. **What is this?**
  2. **How do I run it?**
  3. **How do I call it?**
  4. **What should I know before changing it?**
* Setup instructions must be an **exact, copyable sequence**.
* Test setup instructions on a **machine that has never run the project**.
* Document APIs as **contracts**, not tours.
* For every endpoint, include method, path, request, response, status codes, and meanings.
* Give **one real `curl` example per endpoint**.
* Errors deserve their own documentation.
* Tell clients whether errors are **retryable or not**.
* `Retry-After` is important when an error such as `rate_limited` can be retried.
* Document **decisions that were rejected**, not only decisions that were implemented.
* Generated documentation is excellent for **API shape**.
* Human-written prose is needed for **API meaning and behavior**.
* A stale document can be worse than no document because people trust it.
* Keep documentation **short enough that the team will actually maintain it**.

---

# Minimal Self-Test

Try answering these without looking back.

### 1. What is the fastest way to find a missing setup step?

<details>
<summary>Answer</summary>

Follow the instructions on a machine that has never run the project, doing only what the documentation says.

</details>

---

### 2. Why are status codes important to an API caller?

<details>
<summary>Answer</summary>

Because they determine the branches the caller needs to implement. For example, a `409` might mean the email is already taken.

</details>

---

### 3. Why should rejected design decisions be documented?

<details>
<summary>Answer</summary>

Because the reasoning behind a decision is not always present in the code. Without it, future developers may spend significant time rediscovering why an alternative was rejected.

</details>

---

### 4. What is the difference between generated documentation and human-written documentation?

<details>
<summary>Answer</summary>

Generated documentation is good at describing the **shape** of an API—fields, types, endpoints, etc. Human-written documentation explains the **meaning**, behavior, constraints, and design reasoning.

</details>

---

### 5. Why can stale documentation be worse than no documentation?

<details>
<summary>Answer</summary>

Because developers may trust it and follow instructions or API behavior that is no longer correct.

</details>

---

# What to Learn Next

A natural next step is to study:

1. **OpenAPI** — formally describing API contracts.
2. **API error design** — consistent error codes and retry behavior.
3. **Idempotency** — especially for APIs where repeating a request must be safe.
4. **Diátaxis** — organizing documentation into useful documentation types.
5. **API versioning and backward compatibility** — keeping documented contracts stable as APIs evolve.
